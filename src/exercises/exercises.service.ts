import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { Question, QuestionType } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private optionRepository: Repository<QuestionOption>,
  ) {}

  async getTemplateExercises(topic?: string): Promise<Exercise[]> {
    const query = this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('exercise.isTemplate = :isTemplate', { isTemplate: true })
      .orderBy('exercise.type', 'ASC')
      .addOrderBy('questions.orderIndex', 'ASC');

    if (topic) {
      query.andWhere('exercise.topic = :topic', { topic });
    }

    return query.getMany();
  }

  async getExerciseById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!exercise) {
      throw new NotFoundException('Bài tập không tồn tại');
    }

    return exercise;
  }

  async createExercise(data: {
    type: ExerciseType;
    topic: string;
    scenario: string;
    timeLimit?: number;
    bonusTime?: number;
    isTemplate?: boolean;
    generatedFromId?: string;
    questions: {
      content: string;
      type?: QuestionType;
      correctPoints?: number;
      wrongPoints?: number;
      bonusPoints?: number;
      aiRecognitionRules?: Record<string, unknown>;
      options?: {
        content: string;
        isCorrect: boolean;
        errorType?: string;
        errorDescription?: string;
      }[];
    }[];
  }): Promise<Exercise> {
    const exercise = this.exerciseRepository.create({
      type: data.type,
      topic: data.topic,
      scenario: data.scenario,
      timeLimit: data.timeLimit ?? 90,
      bonusTime: data.bonusTime ?? 30,
      isTemplate: data.isTemplate ?? false,
      generatedFromId: data.generatedFromId,
    });

    const savedExercise = await this.exerciseRepository.save(exercise);

    // Create questions
    for (let i = 0; i < data.questions.length; i++) {
      const qData = data.questions[i];
      const question = this.questionRepository.create({
        exerciseId: savedExercise.id,
        orderIndex: i + 1,
        content: qData.content,
        type: qData.type ?? QuestionType.SINGLE,
        correctPoints: qData.correctPoints ?? 12,
        wrongPoints: qData.wrongPoints ?? 2,
        bonusPoints: qData.bonusPoints ?? 4,
        aiRecognitionRules: qData.aiRecognitionRules,
      });

      const savedQuestion = await this.questionRepository.save(question);

      // Create options
      if (qData.options) {
        for (const optData of qData.options) {
          const option = this.optionRepository.create({
            questionId: savedQuestion.id,
            content: optData.content,
            isCorrect: optData.isCorrect,
            errorType: optData.errorType,
            errorDescription: optData.errorDescription,
          });
          await this.optionRepository.save(option);
        }
      }
    }

    return this.getExerciseById(savedExercise.id);
  }

  async getExercisesByType(type: ExerciseType): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      where: { type, isTemplate: true },
      relations: ['questions', 'questions.options'],
    });
  }
}
