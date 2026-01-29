import { LearningSession } from './learning-session.entity';
export declare enum MessageRole {
    USER = "USER",
    AI = "AI"
}
export declare enum PromptType {
    SCAFFOLDING_1 = "SCAFFOLDING_1",
    SCAFFOLDING_2 = "SCAFFOLDING_2",
    SCAFFOLDING_3 = "SCAFFOLDING_3",
    SCAFFOLDING_4 = "SCAFFOLDING_4",
    FEEDBACK = "FEEDBACK",
    ENCOURAGEMENT = "ENCOURAGEMENT",
    GENERAL = "GENERAL"
}
export type RobotEmotion = 'celebrating' | 'encouraging' | 'thinking' | 'happy' | 'idle';
export declare class ChatMessage {
    id: string;
    sessionId: string;
    session: LearningSession;
    role: MessageRole;
    content: string;
    promptType: PromptType;
    emotion: RobotEmotion | null;
    createdAt: Date;
}
