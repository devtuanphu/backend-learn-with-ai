import { ConfigService } from '@nestjs/config';
import { Exercise } from '../exercises/entities/exercise.entity';
import { UserError } from '../user-progress/entities/user-error.entity';
interface QuestionOption {
    content: string;
    isCorrect: boolean;
    errorType?: string;
    errorDescription?: string;
}
export declare class AiService {
    private configService;
    private readonly logger;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    private formatQuestionForPrompt;
    generateExerciseFromTemplate(template: Exercise): Promise<{
        scenario: string;
        questions: {
            content: string;
            options: QuestionOption[];
        }[];
    }>;
    evaluateAnswer(questionContent: string, correctAnswer: string, studentAnswer: string, errorTypes: string[]): Promise<{
        isCorrect: boolean;
        errorType?: string;
        errorDescription?: string;
        feedback: string;
    }>;
    scaffoldingChat(stepNumber: 1 | 2 | 3 | 4, problem: string, studentMessage: string, errors: UserError[], conversationHistory: {
        role: 'user' | 'model';
        content: string;
    }[]): Promise<{
        message: string;
        evaluation: 'correct' | 'incorrect' | 'partial' | 'unclear';
        emotion: 'celebrating' | 'encouraging' | 'thinking' | 'happy' | 'idle';
    }>;
    generateErrorBasedExercise(errors: UserError[], exerciseType: 'APPLICATION' | 'PROBLEM_SOLVING' | 'COMPREHENSIVE'): Promise<{
        scenario: string;
        questions: {
            content: string;
            options: QuestionOption[];
        }[];
    }>;
    generateFinalFeedback(answers: {
        question: string;
        studentAnswer: string;
        isCorrect: boolean;
        errorType?: string;
    }[]): Promise<string>;
}
export {};
