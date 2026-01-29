import { LearningPathService } from './learning-path.service';
export declare class LearningPathController {
    private readonly learningPathService;
    constructor(learningPathService: LearningPathService);
    startPractice(req: {
        user: {
            id: string;
        };
    }): Promise<{
        session: import("./entities/learning-session.entity").LearningSession;
        exercise: import("../exercises/entities/exercise.entity").Exercise;
        welcomeMessage: string;
    }>;
    startApplication(req: {
        user: {
            id: string;
        };
    }): Promise<{
        session: import("./entities/learning-session.entity").LearningSession;
        exercise: import("../exercises/entities/exercise.entity").Exercise;
        welcomeMessage: string;
    }>;
    chat(req: {
        user: {
            id: string;
        };
    }, sessionId: string, body: {
        message: string;
    }): Promise<{
        aiResponse: string;
        promptType: import("./entities/chat-message.entity").PromptType;
        emotion: string;
        evaluation: string;
    }>;
    getMessages(req: {
        user: {
            id: string;
        };
    }, sessionId: string): Promise<import("./entities/chat-message.entity").ChatMessage[]>;
    completeSession(req: {
        user: {
            id: string;
        };
    }, sessionId: string): Promise<import("./entities/learning-session.entity").LearningSession>;
}
