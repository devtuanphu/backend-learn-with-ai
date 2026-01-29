import { Repository } from 'typeorm';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { Question, QuestionType } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
export declare class ExercisesService {
    private exerciseRepository;
    private questionRepository;
    private optionRepository;
    constructor(exerciseRepository: Repository<Exercise>, questionRepository: Repository<Question>, optionRepository: Repository<QuestionOption>);
    getTemplateExercises(topic?: string): Promise<Exercise[]>;
    getExerciseById(id: string): Promise<Exercise>;
    createExercise(data: {
        type: ExerciseType;
        topic: string;
        scenario: string;
        timeLimit?: number;
        bonusTime?: number;
        isTemplate?: boolean;
        generatedFromId?: string;
        questions: {
            content: string;
            type?: QuestionType;
            correctPoints?: number;
            wrongPoints?: number;
            bonusPoints?: number;
            aiRecognitionRules?: Record<string, unknown>;
            options?: {
                content: string;
                isCorrect: boolean;
                errorType?: string;
                errorDescription?: string;
            }[];
        }[];
    }): Promise<Exercise>;
    getExercisesByType(type: ExerciseType): Promise<Exercise[]>;
}
