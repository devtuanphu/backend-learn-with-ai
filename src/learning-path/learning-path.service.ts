import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LearningSession,
  SessionStatus,
} from './entities/learning-session.entity';
import {
  ChatMessage,
  MessageRole,
  PromptType,
} from './entities/chat-message.entity';
import { UserProgressService } from '../user-progress/user-progress.service';
import { ExercisesService } from '../exercises/exercises.service';
import { AiService } from '../ai/ai.service';
import { ExerciseType, Exercise } from '../exercises/entities/exercise.entity';
import { LearningPhase } from '../user-progress/entities/user-exercise.entity';
import { ExercisePoolService } from '../exercise-pool/exercise-pool.service';

// Interface for question data from pool or AI
interface QuestionData {
  content: string;
  options: {
    content: string;
    isCorrect: boolean;
    errorType?: string;
    errorDescription?: string;
  }[];
}

@Injectable()
export class LearningPathService {
  constructor(
    @InjectRepository(LearningSession)
    private sessionRepository: Repository<LearningSession>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
    private userProgressService: UserProgressService,
    private exercisesService: ExercisesService,
    private aiService: AiService,
    @Inject(forwardRef(() => ExercisePoolService))
    private exercisePoolService: ExercisePoolService,
  ) {}

  // Bắt đầu lộ trình 2 - Luyện tập sửa lỗi
  async startPracticePhase(userId: string): Promise<{
    session: LearningSession;
    exercise: Exercise;
    welcomeMessage: string;
  }> {
    // Lấy lỗi từ lộ trình 1
    const errors = await this.userProgressService.getUserErrors(
      userId,
      LearningPhase.WARM_UP,
    );

    // Lấy error types để tìm bài tập từ pool
    const errorTypes = [...new Set(errors.map((e) => e.errorType))];

    let exerciseData: { scenario: string; questions: QuestionData[] };

    // 1. Thử lấy bài tập từ pool trước (nhanh < 1 giây)
    const poolExercise = await this.exercisePoolService.getExerciseByErrors(
      2,
      errorTypes,
      userId,
    );

    if (poolExercise) {
      console.log('✅ Got Phase 2 exercise from pool:', poolExercise.id);
      exerciseData = {
        scenario: poolExercise.scenario,
        questions: poolExercise.questions,
      };
    } else {
      // 2. Fallback: Nếu pool trống, dùng AI generate (chậm 10-30s)
      console.warn('⚠️ Pool empty for Phase 2, falling back to AI...');
      exerciseData = await this.aiService.generateErrorBasedExercise(
        errors,
        'APPLICATION',
      );
    }

    const exercise = await this.exercisesService.createExercise({
      type: ExerciseType.APPLICATION,
      topic: 'phep-nhan-so-thap-phan',
      scenario: exerciseData.scenario,
      isTemplate: false,
      questions: exerciseData.questions.map((q) => ({
        content: q.content,
        options: q.options,
      })),
    });

    // Tạo session
    const session = this.sessionRepository.create({
      userId,
      phase: LearningPhase.PRACTICE,
      userErrors: errors.map((e) => e.id),
      status: SessionStatus.ACTIVE,
    });
    const savedSession = await this.sessionRepository.save(session);

    // Welcome message
    const welcomeMessage = `Chào bạn! Mình là Trợ lí Học tập Ảo của bạn đây! 🌟

Mình đã xem qua kết quả ở phần Khởi động rồi. Bạn làm tốt lắm! Nhưng mình thấy có vài chỗ bạn còn nhầm lẫn một chút. Đừng lo, cùng nhau luyện tập để tiến bộ hơn nhé!

📝 **Bài toán:**
${exerciseData.scenario}

Bạn hãy đọc kỹ bài toán, sau đó trả lời mình nhé:
**Bài toán trên cho ta biết điều gì? Bài toán yêu cầu ta làm gì?**`;

    // Save welcome message
    await this.messageRepository.save({
      sessionId: savedSession.id,
      role: MessageRole.AI,
      content: welcomeMessage,
      promptType: PromptType.SCAFFOLDING_1,
    });

    return {
      session: savedSession,
      exercise,
      welcomeMessage,
    };
  }

  // Chat với TLHTA
  async chat(
    userId: string,
    sessionId: string,
    message: string,
  ): Promise<{
    aiResponse: string;
    promptType: PromptType;
    emotion: string;
    evaluation: string;
  }> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId },
      relations: ['messages'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Save user message
    await this.messageRepository.save({
      sessionId,
      role: MessageRole.USER,
      content: message,
      promptType: PromptType.GENERAL,
    });

    // Get errors for context
    const errors = await this.userProgressService.getUserErrors(
      userId,
      session.phase,
    );

    // Determine current scaffolding step
    const aiMessages = session.messages.filter(
      (m) => m.role === MessageRole.AI,
    );
    const lastAiMessage = aiMessages[aiMessages.length - 1];
    let currentStep: 1 | 2 | 3 | 4 = 1;

    if (lastAiMessage) {
      switch (lastAiMessage.promptType) {
        case PromptType.SCAFFOLDING_1:
          currentStep = 2;
          break;
        case PromptType.SCAFFOLDING_2:
          currentStep = 3;
          break;
        case PromptType.SCAFFOLDING_3:
          currentStep = 4;
          break;
        default:
          currentStep = 1;
      }
    }

    // Get conversation history
    const history = session.messages.map((m) => ({
      role:
        m.role === MessageRole.USER ? ('user' as const) : ('model' as const),
      content: m.content,
    }));

    // Get problem from session context or first message
    const problem: string =
      (session.aiContext?.problem as string) ||
      'Bài toán về phép nhân số thập phân';

    // Get AI response (now returns structured object with emotion)
    const aiResult = await this.aiService.scaffoldingChat(
      currentStep,
      problem,
      message,
      errors,
      history,
    );

    // Determine next prompt type
    let nextPromptType: PromptType;
    switch (currentStep) {
      case 1:
        nextPromptType = PromptType.SCAFFOLDING_2;
        break;
      case 2:
        nextPromptType = PromptType.SCAFFOLDING_3;
        break;
      case 3:
        nextPromptType = PromptType.SCAFFOLDING_4;
        break;
      default:
        nextPromptType = PromptType.FEEDBACK;
    }

    // Save AI response with emotion
    await this.messageRepository.save({
      sessionId,
      role: MessageRole.AI,
      content: aiResult.message,
      promptType: nextPromptType,
      emotion: aiResult.emotion,
    });

    return {
      aiResponse: aiResult.message,
      promptType: nextPromptType,
      emotion: aiResult.emotion,
      evaluation: aiResult.evaluation,
    };
  }

  // Bắt đầu lộ trình 3 - Vận dụng
  async startApplicationPhase(userId: string): Promise<{
    session: LearningSession;
    exercise: Exercise;
    welcomeMessage: string;
  }> {
    // Lấy TẤT CẢ lỗi từ lộ trình 1 + 2
    const errors = await this.userProgressService.getUserErrors(userId);

    // Lấy error types để tìm bài tập từ pool
    const errorTypes = [...new Set(errors.map((e) => e.errorType))];

    let exerciseData: { scenario: string; questions: QuestionData[] };

    // 1. Thử lấy bài tập từ pool trước (nhanh < 1 giây)
    const poolExercise = await this.exercisePoolService.getExerciseByErrors(
      3,
      errorTypes,
      userId,
    );

    if (poolExercise) {
      console.log('✅ Got Phase 3 exercise from pool:', poolExercise.id);
      exerciseData = {
        scenario: poolExercise.scenario,
        questions: poolExercise.questions,
      };
    } else {
      // 2. Fallback: Nếu pool trống, dùng AI generate (chậm 10-30s)
      console.warn('⚠️ Pool empty for Phase 3, falling back to AI...');
      exerciseData = await this.aiService.generateErrorBasedExercise(
        errors,
        'COMPREHENSIVE',
      );
    }

    const exercise = await this.exercisesService.createExercise({
      type: ExerciseType.PROBLEM_SOLVING,
      topic: 'phep-nhan-so-thap-phan',
      scenario: exerciseData.scenario,
      isTemplate: false,
      questions: exerciseData.questions.map((q) => ({
        content: q.content,
        options: q.options,
      })),
    });

    // Tạo session
    const session = this.sessionRepository.create({
      userId,
      phase: LearningPhase.APPLICATION,
      userErrors: errors.map((e) => e.id),
      status: SessionStatus.ACTIVE,
    });
    const savedSession = await this.sessionRepository.save(session);

    const welcomeMessage = `Tuyệt vời! Bạn đã hoàn thành phần Luyện tập rồi! 🎉

Bây giờ chúng ta sẽ cùng nhau thử thách với một bài toán thực tế nhé!

📝 **Bài toán vận dụng:**
${exerciseData.scenario}

Đây là bài toán tổng hợp những gì bạn đã học. Hãy đọc kỹ và cho mình biết:
**Bài toán cho ta biết điều gì? Yêu cầu ta làm gì?**`;

    await this.messageRepository.save({
      sessionId: savedSession.id,
      role: MessageRole.AI,
      content: welcomeMessage,
      promptType: PromptType.SCAFFOLDING_1,
    });

    return {
      session: savedSession,
      exercise,
      welcomeMessage,
    };
  }

  // Get session messages
  async getSessionMessages(
    userId: string,
    sessionId: string,
  ): Promise<ChatMessage[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.messageRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  // Complete session
  async completeSession(
    userId: string,
    sessionId: string,
  ): Promise<LearningSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.status = SessionStatus.COMPLETED;
    return this.sessionRepository.save(session);
  }
}
