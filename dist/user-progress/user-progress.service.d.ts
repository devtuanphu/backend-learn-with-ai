import { Repository } from 'typeorm';
import { UserExercise, UserExerciseStatus, LearningPhase } from './entities/user-exercise.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { UserError } from './entities/user-error.entity';
import { ExercisesService } from '../exercises/exercises.service';
import { AiService } from '../ai/ai.service';
import { ExercisePoolService } from '../exercise-pool/exercise-pool.service';
export declare class UserProgressService {
    private userExerciseRepository;
    private userAnswerRepository;
    private userErrorRepository;
    private exercisesService;
    private aiService;
    private exercisePoolService;
    constructor(userExerciseRepository: Repository<UserExercise>, userAnswerRepository: Repository<UserAnswer>, userErrorRepository: Repository<UserError>, exercisesService: ExercisesService, aiService: AiService, exercisePoolService: ExercisePoolService);
    startWarmUpPhase(userId: string): Promise<UserExercise[]>;
    submitAnswer(userId: string, userExerciseId: string, questionId: string, selectedOptionIds: string[], textAnswer?: string, timeSpent?: number): Promise<UserAnswer>;
    completeExercise(userId: string, userExerciseId: string): Promise<UserExercise>;
    getUserErrors(userId: string, phase?: number): Promise<UserError[]>;
    getExerciseResult(userId: string, userExerciseId: string): Promise<{
        aiFeedback: string;
        id: string;
        userId: string;
        user: import("../auth/entities/user.entity").User;
        exerciseId: string;
        exercise: import("../exercises/entities/exercise.entity").Exercise;
        phase: LearningPhase;
        score: number;
        timeSpent: number;
        status: UserExerciseStatus;
        startedAt: Date;
        completedAt: Date;
        userAnswers: UserAnswer[];
    }>;
    getUserProgress(userId: string): Promise<{
        totalExercises: number;
        completedExercises: number;
        totalScore: number;
        totalErrors: number;
        currentPhase: number;
        exercises: UserExercise[];
        recentErrors: UserError[];
    }>;
}
