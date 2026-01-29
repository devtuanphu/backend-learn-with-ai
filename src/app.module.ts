import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { ExercisesModule } from './exercises/exercises.module.js';
import { UserProgressModule } from './user-progress/user-progress.module.js';
import { LearningPathModule } from './learning-path/learning-path.module.js';
import { AiModule } from './ai/ai.module.js';
import { ExercisePoolModule } from './exercise-pool/exercise-pool.module.js';

// Entities
import { User } from './auth/entities/user.entity.js';
import { Exercise } from './exercises/entities/exercise.entity.js';
import { Question } from './exercises/entities/question.entity.js';
import { QuestionOption } from './exercises/entities/question-option.entity.js';
import { UserExercise } from './user-progress/entities/user-exercise.entity.js';
import { UserAnswer } from './user-progress/entities/user-answer.entity.js';
import { UserError } from './user-progress/entities/user-error.entity.js';
import { LearningSession } from './learning-path/entities/learning-session.entity.js';
import { ChatMessage } from './learning-path/entities/chat-message.entity.js';
import { ReadyExercise } from './exercise-pool/entities/ready-exercise.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', 'learn_with_ai'),
        entities: [
          User,
          Exercise,
          Question,
          QuestionOption,
          UserExercise,
          UserAnswer,
          UserError,
          LearningSession,
          ChatMessage,
          ReadyExercise,
        ],
        synchronize: true, // Dev only - use migrations in production
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ExercisesModule,
    UserProgressModule,
    LearningPathModule,
    AiModule,
    ExercisePoolModule,
  ],
})
export class AppModule {}
