import { User } from '../../auth/entities/user.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { UserAnswer } from './user-answer.entity';
export declare enum UserExerciseStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}
export declare enum LearningPhase {
    WARM_UP = 1,
    PRACTICE = 2,
    APPLICATION = 3
}
export declare class UserExercise {
    id: string;
    userId: string;
    user: User;
    exerciseId: string;
    exercise: Exercise;
    phase: LearningPhase;
    score: number;
    timeSpent: number;
    status: UserExerciseStatus;
    startedAt: Date;
    completedAt: Date;
    userAnswers: UserAnswer[];
}
