import { User } from '../../auth/entities/user.entity';
export declare enum ReadyExerciseStatus {
    READY = "READY",
    USED = "USED"
}
export declare enum ReadyExerciseType {
    BASIC = "BASIC",
    APPLICATION = "APPLICATION",
    PROBLEM_SOLVING = "PROBLEM_SOLVING"
}
export declare const ERROR_PATTERNS: readonly ["decimal_placement", "multiplication_error", "division_error", "misunderstanding", "calculation_error", "unit_conversion"];
export type ErrorPattern = (typeof ERROR_PATTERNS)[number];
export declare class ReadyExercise {
    id: string;
    phase: number;
    exerciseType: ReadyExerciseType;
    topic: string;
    errorPatterns: string[];
    scenario: string;
    questions: {
        content: string;
        options: {
            content: string;
            isCorrect: boolean;
            errorType?: string;
            errorDescription?: string;
        }[];
    }[];
    status: ReadyExerciseStatus;
    usedByUserId: string;
    usedByUser: User;
    createdAt: Date;
    usedAt: Date;
}
