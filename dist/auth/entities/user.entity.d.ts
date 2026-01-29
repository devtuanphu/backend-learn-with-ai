import { UserExercise } from '../../user-progress/entities/user-exercise.entity';
import { UserAnswer } from '../../user-progress/entities/user-answer.entity';
import { UserError } from '../../user-progress/entities/user-error.entity';
import { LearningSession } from '../../learning-path/entities/learning-session.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    userExercises: UserExercise[];
    userAnswers: UserAnswer[];
    userErrors: UserError[];
    learningSessions: LearningSession[];
}
