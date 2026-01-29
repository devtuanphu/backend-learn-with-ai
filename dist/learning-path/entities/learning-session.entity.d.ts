import { User } from '../../auth/entities/user.entity';
import { ChatMessage } from './chat-message.entity';
export declare enum SessionStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED"
}
export declare class LearningSession {
    id: string;
    userId: string;
    user: User;
    phase: number;
    status: SessionStatus;
    aiContext: Record<string, any>;
    userErrors: string[];
    createdAt: Date;
    messages: ChatMessage[];
}
