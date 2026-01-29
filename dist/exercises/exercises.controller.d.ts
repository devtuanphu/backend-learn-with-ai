import { ExercisesService } from './exercises.service';
import { ExerciseType } from './entities/exercise.entity';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    getTemplates(topic?: string): Promise<import("./entities/exercise.entity").Exercise[]>;
    getByType(type: ExerciseType): Promise<import("./entities/exercise.entity").Exercise[]>;
    getById(id: string): Promise<import("./entities/exercise.entity").Exercise>;
}
