"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const exercises_module_1 = require("./exercises/exercises.module");
const user_progress_module_1 = require("./user-progress/user-progress.module");
const learning_path_module_1 = require("./learning-path/learning-path.module");
const ai_module_1 = require("./ai/ai.module");
const exercise_pool_module_1 = require("./exercise-pool/exercise-pool.module");
const user_entity_1 = require("./auth/entities/user.entity");
const exercise_entity_1 = require("./exercises/entities/exercise.entity");
const question_entity_1 = require("./exercises/entities/question.entity");
const question_option_entity_1 = require("./exercises/entities/question-option.entity");
const user_exercise_entity_1 = require("./user-progress/entities/user-exercise.entity");
const user_answer_entity_1 = require("./user-progress/entities/user-answer.entity");
const user_error_entity_1 = require("./user-progress/entities/user-error.entity");
const learning_session_entity_1 = require("./learning-path/entities/learning-session.entity");
const chat_message_entity_1 = require("./learning-path/entities/chat-message.entity");
const ready_exercise_entity_1 = require("./exercise-pool/entities/ready-exercise.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST', 'localhost'),
                    port: configService.get('DATABASE_PORT', 5432),
                    username: configService.get('DATABASE_USERNAME', 'postgres'),
                    password: configService.get('DATABASE_PASSWORD', 'postgres'),
                    database: configService.get('DATABASE_NAME', 'learn_with_ai'),
                    entities: [
                        user_entity_1.User,
                        exercise_entity_1.Exercise,
                        question_entity_1.Question,
                        question_option_entity_1.QuestionOption,
                        user_exercise_entity_1.UserExercise,
                        user_answer_entity_1.UserAnswer,
                        user_error_entity_1.UserError,
                        learning_session_entity_1.LearningSession,
                        chat_message_entity_1.ChatMessage,
                        ready_exercise_entity_1.ReadyExercise,
                    ],
                    synchronize: true,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            exercises_module_1.ExercisesModule,
            user_progress_module_1.UserProgressModule,
            learning_path_module_1.LearningPathModule,
            ai_module_1.AiModule,
            exercise_pool_module_1.ExercisePoolModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map