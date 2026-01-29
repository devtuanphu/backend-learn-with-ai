import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserExercise,
  UserExerciseStatus,
  LearningPhase,
} from './entities/user-exercise.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { UserError } from './entities/user-error.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { AiService } from '../ai/ai.service';
import { Question } from '../exercises/entities/question.entity';
import { QuestionOption } from '../exercises/entities/question-option.entity';
import { ExercisePoolService } from '../exercise-pool/exercise-pool.service';
import { ExerciseType } from '../exercises/entities/exercise.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserExercise)
    private userExerciseRepository: Repository<UserExercise>,
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    @InjectRepository(UserError)
    private userErrorRepository: Repository<UserError>,
    private exercisesService: ExercisesService,
    private aiService: AiService,
    @Inject(forwardRef(() => ExercisePoolService))
    private exercisePoolService: ExercisePoolService,
  ) {}

  // Bắt đầu lộ trình 1 - Khởi động
  // Game cần 3 bài: BASIC, APPLICATION, PROBLEM_SOLVING
  async startWarmUpPhase(userId: string): Promise<UserExercise[]> {
    const savedIds: string[] = [];
    const exerciseTypes = [
      ExerciseType.BASIC,
      ExerciseType.APPLICATION,
      ExerciseType.PROBLEM_SOLVING,
    ];

    // Lấy templates cho mỗi loại
    const templates = await this.exercisesService.getTemplateExercises(
      'phep-nhan-so-thap-phan',
    );

    for (const type of exerciseTypes) {
      // Tìm template theo type
      const template = templates.find((t) => t.type === type);

      if (!template) {
        console.warn(`⚠️ No template found for type: ${type}`);
        continue;
      }

      let exerciseId: string;

      try {
        // Tạo exercise mới từ template (có thể dùng AI generate sau)
        const exercise = await this.exercisesService.createExercise({
          type: template.type,
          topic: template.topic,
          scenario: template.scenario,
          timeLimit: template.timeLimit,
          bonusTime: template.bonusTime,
          isTemplate: false,
          generatedFromId: template.id,
          questions: template.questions.map((q) => ({
            content: q.content,
            correctPoints: q.correctPoints,
            wrongPoints: q.wrongPoints,
            bonusPoints: q.bonusPoints,
            options: q.options.map((opt) => ({
              content: opt.content,
              isCorrect: opt.isCorrect,
              errorType: opt.errorType,
              errorDescription: opt.errorDescription,
            })),
          })),
        });
        exerciseId = exercise.id;
        console.log(`✅ Created exercise ${type}:`, exercise.id);
      } catch (error) {
        console.warn(`⚠️ Failed to create exercise for ${type}:`, error);
        exerciseId = template.id;
      }

      const userExercise = this.userExerciseRepository.create({
        userId,
        exerciseId,
        phase: LearningPhase.WARM_UP,
        status: UserExerciseStatus.IN_PROGRESS,
      });

      const saved = await this.userExerciseRepository.save(userExercise);
      savedIds.push(saved.id);
    }

    // Load full data with relations
    return this.userExerciseRepository.find({
      where: savedIds.map((id) => ({ id })),
      relations: [
        'exercise',
        'exercise.questions',
        'exercise.questions.options',
      ],
      order: { startedAt: 'ASC' },
    });
  }

  // Submit câu trả lời
  async submitAnswer(
    userId: string,
    userExerciseId: string,
    questionId: string,
    selectedOptionIds: string[],
    textAnswer?: string,
    timeSpent?: number,
  ): Promise<UserAnswer> {
    const userExercise = await this.userExerciseRepository.findOne({
      where: { id: userExerciseId, userId },
      relations: [
        'exercise',
        'exercise.questions',
        'exercise.questions.options',
      ],
    });

    if (!userExercise) {
      throw new NotFoundException('User exercise not found');
    }

    const question: Question | undefined = userExercise.exercise.questions.find(
      (q: Question) => q.id === questionId,
    );
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check if answer is correct
    const correctOptions: QuestionOption[] = question.options.filter(
      (o: QuestionOption) => o.isCorrect,
    );
    const correctOptionIds: string[] = correctOptions.map(
      (o: QuestionOption) => o.id,
    );
    const isCorrect =
      selectedOptionIds.length === correctOptionIds.length &&
      selectedOptionIds.every((id: string) => correctOptionIds.includes(id));

    // Calculate points
    let earnedPoints = isCorrect
      ? question.correctPoints
      : question.wrongPoints;
    if (isCorrect && timeSpent && timeSpent < userExercise.exercise.bonusTime) {
      earnedPoints += question.bonusPoints;
    }

    // Create answer
    const answer = this.userAnswerRepository.create({
      userId,
      userExerciseId,
      questionId,
      selectedOptions: selectedOptionIds,
      textAnswer,
      isCorrect,
      earnedPoints,
      timeSpent: timeSpent ?? 0,
    });

    const savedAnswer = await this.userAnswerRepository.save(answer);

    // If wrong, record error
    if (!isCorrect) {
      const selectedOption: QuestionOption | undefined = question.options.find(
        (o: QuestionOption) => selectedOptionIds.includes(o.id),
      );
      if (selectedOption?.errorType) {
        const errorType: string = selectedOption.errorType;
        const errorDescription: string =
          selectedOption.errorDescription ?? 'Lỗi không xác định';
        const error = this.userErrorRepository.create({
          userId,
          userAnswerId: savedAnswer.id,
          errorType,
          errorDescription,
          phase: userExercise.phase,
        });
        await this.userErrorRepository.save(error);
      }
    }

    // Update user exercise score
    await this.userExerciseRepository.update(userExerciseId, {
      score: () => `score + ${earnedPoints}`,
      timeSpent: () => `"timeSpent" + ${timeSpent ?? 0}`,
    });

    return savedAnswer;
  }

  // Complete exercise
  async completeExercise(
    userId: string,
    userExerciseId: string,
  ): Promise<UserExercise> {
    const userExercise = await this.userExerciseRepository.findOne({
      where: { id: userExerciseId, userId },
    });

    if (!userExercise) {
      throw new NotFoundException('User exercise not found');
    }

    userExercise.status = UserExerciseStatus.COMPLETED;
    userExercise.completedAt = new Date();

    return this.userExerciseRepository.save(userExercise);
  }

  // Lấy lỗi sai của user theo phase
  async getUserErrors(userId: string, phase?: number): Promise<UserError[]> {
    const query = this.userErrorRepository
      .createQueryBuilder('error')
      .where('error.userId = :userId', { userId });

    if (phase !== undefined) {
      query.andWhere('error.phase <= :phase', { phase });
    }

    return query.orderBy('error.createdAt', 'DESC').getMany();
  }

  // Lấy kết quả chi tiết của user exercise
  async getExerciseResult(userId: string, userExerciseId: string) {
    const userExercise = await this.userExerciseRepository.findOne({
      where: { id: userExerciseId, userId },
      relations: [
        'exercise',
        'userAnswers',
        'userAnswers.question',
        'userAnswers.errors',
      ],
    });

    if (!userExercise) {
      throw new NotFoundException('User exercise not found');
    }

    // Generate AI feedback
    const feedbackData = userExercise.userAnswers.map((a: UserAnswer) => ({
      question: a.question?.content ?? '',
      studentAnswer: a.selectedOptions?.join(', ') || a.textAnswer || '',
      isCorrect: a.isCorrect,
      errorType: a.errors?.[0]?.errorType ?? undefined,
    }));

    const aiFeedback = await this.aiService.generateFinalFeedback(feedbackData);

    return {
      ...userExercise,
      aiFeedback,
    };
  }

  // Lấy progress tổng quan của user
  async getUserProgress(userId: string) {
    const exercises = await this.userExerciseRepository.find({
      where: { userId },
      relations: ['exercise'],
      order: { startedAt: 'ASC' },
    });

    const errors = await this.getUserErrors(userId);

    return {
      totalExercises: exercises.length,
      completedExercises: exercises.filter(
        (e: UserExercise) => e.status === UserExerciseStatus.COMPLETED,
      ).length,
      totalScore: exercises.reduce(
        (sum: number, e: UserExercise) => sum + e.score,
        0,
      ),
      totalErrors: errors.length,
      currentPhase:
        exercises.length > 0
          ? Math.max(...exercises.map((e: UserExercise) => e.phase))
          : 0,
      exercises,
      recentErrors: errors.slice(0, 5),
    };
  }
}
