import { Repository } from 'typeorm';
import { LearningSession } from './entities/learning-session.entity';
import { ChatMessage, PromptType } from './entities/chat-message.entity';
import { UserProgressService } from '../user-progress/user-progress.service';
import { ExercisesService } from '../exercises/exercises.service';
import { AiService } from '../ai/ai.service';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisePoolService } from '../exercise-pool/exercise-pool.service';
export declare class LearningPathService {
    private sessionRepository;
    private messageRepository;
    private userProgressService;
    private exercisesService;
    private aiService;
    private exercisePoolService;
    constructor(sessionRepository: Repository<LearningSession>, messageRepository: Repository<ChatMessage>, userProgressService: UserProgressService, exercisesService: ExercisesService, aiService: AiService, exercisePoolService: ExercisePoolService);
    startPracticePhase(userId: string): Promise<{
        session: LearningSession;
        exercise: Exercise;
        welcomeMessage: string;
    }>;
    chat(userId: string, sessionId: string, message: string): Promise<{
        aiResponse: string;
        promptType: PromptType;
        emotion: string;
        evaluation: string;
    }>;
    startApplicationPhase(userId: string): Promise<{
        session: LearningSession;
        exercise: Exercise;
        welcomeMessage: string;
    }>;
    getSessionMessages(userId: string, sessionId: string): Promise<ChatMessage[]>;
    completeSession(userId: string, sessionId: string): Promise<LearningSession>;
}
