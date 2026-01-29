"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgressModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_progress_controller_1 = require("./user-progress.controller");
const user_progress_service_1 = require("./user-progress.service");
const user_exercise_entity_1 = require("./entities/user-exercise.entity");
const user_answer_entity_1 = require("./entities/user-answer.entity");
const user_error_entity_1 = require("./entities/user-error.entity");
const exercises_module_1 = require("../exercises/exercises.module");
const ai_module_1 = require("../ai/ai.module");
const exercise_pool_module_1 = require("../exercise-pool/exercise-pool.module");
let UserProgressModule = class UserProgressModule {
};
exports.UserProgressModule = UserProgressModule;
exports.UserProgressModule = UserProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_exercise_entity_1.UserExercise, user_answer_entity_1.UserAnswer, user_error_entity_1.UserError]),
            exercises_module_1.ExercisesModule,
            ai_module_1.AiModule,
            (0, common_1.forwardRef)(() => exercise_pool_module_1.ExercisePoolModule),
        ],
        controllers: [user_progress_controller_1.UserProgressController],
        providers: [user_progress_service_1.UserProgressService],
        exports: [user_progress_service_1.UserProgressService],
    })
], UserProgressModule);
//# sourceMappingURL=user-progress.module.js.map