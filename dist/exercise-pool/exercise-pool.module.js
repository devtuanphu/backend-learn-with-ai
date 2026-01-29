"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisePoolModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const ready_exercise_entity_1 = require("./entities/ready-exercise.entity");
const exercise_pool_service_1 = require("./exercise-pool.service");
const exercise_pool_scheduler_1 = require("./exercise-pool.scheduler");
const ai_module_1 = require("../ai/ai.module");
const exercises_module_1 = require("../exercises/exercises.module");
let ExercisePoolModule = class ExercisePoolModule {
};
exports.ExercisePoolModule = ExercisePoolModule;
exports.ExercisePoolModule = ExercisePoolModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ready_exercise_entity_1.ReadyExercise]),
            schedule_1.ScheduleModule.forRoot(),
            ai_module_1.AiModule,
            exercises_module_1.ExercisesModule,
        ],
        providers: [exercise_pool_service_1.ExercisePoolService, exercise_pool_scheduler_1.ExercisePoolScheduler],
        exports: [exercise_pool_service_1.ExercisePoolService],
    })
], ExercisePoolModule);
//# sourceMappingURL=exercise-pool.module.js.map