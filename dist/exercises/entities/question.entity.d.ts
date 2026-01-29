import { Exercise } from './exercise.entity';
import { QuestionOption } from './question-option.entity';
import { UserAnswer } from '../../user-progress/entities/user-answer.entity';
export declare enum QuestionType {
    SINGLE = "SINGLE",
    MULTIPLE = "MULTIPLE",
    TEXT = "TEXT"
}
export declare class Question {
    id: string;
    exerciseId: string;
    exercise: Exercise;
    orderIndex: number;
    content: string;
    type: QuestionType;
    correctPoints: number;
    wrongPoints: number;
    bonusPoints: number;
    aiRecognitionRules: Record<string, any>;
    options: QuestionOption[];
    userAnswers: UserAnswer[];
}
