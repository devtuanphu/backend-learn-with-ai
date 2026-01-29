import { OnModuleInit } from '@nestjs/common';
import { ExercisePoolService } from './exercise-pool.service';
export declare class ExercisePoolScheduler implements OnModuleInit {
    private readonly poolService;
    private readonly logger;
    private isRunning;
    constructor(poolService: ExercisePoolService);
    onModuleInit(): Promise<void>;
    handleCron(): Promise<void>;
    maintainPool(): Promise<void>;
    triggerGeneration(phase: 1 | 2 | 3, count?: number, errorPattern?: string): Promise<void>;
}
