import { User } from '../../auth/entities/user.entity';
import { UserAnswer } from './user-answer.entity';
export declare class UserError {
    id: string;
    userId: string;
    user: User;
    userAnswerId: string;
    userAnswer: UserAnswer;
    errorType: string;
    errorDescription: string;
    aiAnalysis: string;
    phase: number;
    createdAt: Date;
}
