import { Question } from './question.entity';
export declare class QuestionOption {
    id: string;
    questionId: string;
    question: Question;
    content: string;
    isCorrect: boolean;
    errorType: string;
    errorDescription: string;
}
