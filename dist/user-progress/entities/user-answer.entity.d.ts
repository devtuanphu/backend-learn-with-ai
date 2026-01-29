import { User } from '../../auth/entities/user.entity';
import { UserExercise } from './user-exercise.entity';
import { Question } from '../../exercises/entities/question.entity';
import { UserError } from './user-error.entity';
export declare class UserAnswer {
    id: string;
    userId: string;
    user: User;
    userExerciseId: string;
    userExercise: UserExercise;
    questionId: string;
    question: Question;
    selectedOptions: string[];
    textAnswer: string;
    isCorrect: boolean;
    earnedPoints: number;
    timeSpent: number;
    answeredAt: Date;
    errors: UserError[];
}
