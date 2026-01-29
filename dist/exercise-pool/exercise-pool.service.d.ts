import { Repository } from 'typeorm';
import { ReadyExercise } from './entities/ready-exercise.entity';
import { AiService } from '../ai/ai.service';
import { ExercisesService } from '../exercises/exercises.service';
interface PoolStats {
    phase1: number;
    phase2: {
        [key: string]: number;
    };
    phase3: {
        [key: string]: number;
    };
    total: number;
}
export declare class ExercisePoolService {
    private readyExerciseRepository;
    private aiService;
    private exercisesService;
    private readonly logger;
    private readonly PHASE1_TARGET;
    private readonly PHASE2_TARGET_PER_ERROR;
    private readonly PHASE3_TARGET_PER_ERROR;
    constructor(readyExerciseRepository: Repository<ReadyExercise>, aiService: AiService, exercisesService: ExercisesService);
    getPhase1Exercise(userId: string): Promise<ReadyExercise | null>;
    getExerciseByErrors(phase: 2 | 3, errorPatterns: string[], userId: string): Promise<ReadyExercise | null>;
    private assignToUser;
    generatePhase1Exercise(): Promise<ReadyExercise | null>;
    generatePhase2Exercise(errorPattern: string): Promise<ReadyExercise | null>;
    generatePhase3Exercise(errorPatterns: string[]): Promise<ReadyExercise | null>;
    getPoolStats(): Promise<PoolStats>;
    private delay;
    maintainPool(): Promise<void>;
    private getErrorDescription;
}
export {};
