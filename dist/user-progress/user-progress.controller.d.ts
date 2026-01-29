import { UserProgressService } from './user-progress.service';
export declare class UserProgressController {
    private readonly userProgressService;
    constructor(userProgressService: UserProgressService);
    startWarmUp(req: {
        user: {
            id: string;
        };
    }): Promise<import("./entities/user-exercise.entity").UserExercise[]>;
    submitAnswer(req: {
        user: {
            id: string;
        };
    }, body: {
        userExerciseId: string;
        questionId: string;
        selectedOptionIds: string[];
        textAnswer?: string;
        timeSpent?: number;
    }): Promise<import("./entities/user-answer.entity").UserAnswer>;
    completeExercise(req: {
        user: {
            id: string;
        };
    }, userExerciseId: string): Promise<import("./entities/user-exercise.entity").UserExercise>;
    getResult(req: {
        user: {
            id: string;
        };
    }, userExerciseId: string): Promise<{
        aiFeedback: string;
        id: string;
        userId: string;
        user: import("../auth/entities/user.entity").User;
        exerciseId: string;
        exercise: import("../exercises/entities/exercise.entity").Exercise;
        phase: import("./entities/user-exercise.entity").LearningPhase;
        score: number;
        timeSpent: number;
        status: import("./entities/user-exercise.entity").UserExerciseStatus;
        startedAt: Date;
        completedAt: Date;
        userAnswers: import("./entities/user-answer.entity").UserAnswer[];
    }>;
    getOverview(req: {
        user: {
            id: string;
        };
    }): Promise<{
        totalExercises: number;
        completedExercises: number;
        totalScore: number;
        totalErrors: number;
        currentPhase: number;
        exercises: import("./entities/user-exercise.entity").UserExercise[];
        recentErrors: import("./entities/user-error.entity").UserError[];
    }>;
    getErrors(req: {
        user: {
            id: string;
        };
    }): Promise<import("./entities/user-error.entity").UserError[]>;
}
