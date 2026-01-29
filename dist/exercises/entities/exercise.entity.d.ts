import { Question } from './question.entity';
import { UserExercise } from '../../user-progress/entities/user-exercise.entity';
export declare enum ExerciseType {
    BASIC = "BASIC",
    APPLICATION = "APPLICATION",
    PROBLEM_SOLVING = "PROBLEM_SOLVING"
}
export declare class Exercise {
    id: string;
    type: ExerciseType;
    topic: string;
    scenario: string;
    timeLimit: number;
    bonusTime: number;
    isTemplate: boolean;
    generatedFromId: string;
    generatedFrom: Exercise;
    questions: Question[];
    userExercises: UserExercise[];
}
