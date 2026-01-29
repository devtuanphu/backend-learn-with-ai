import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPathController } from './learning-path.controller.js';
import { LearningPathService } from './learning-path.service.js';
import { LearningSession } from './entities/learning-session.entity.js';
import { ChatMessage } from './entities/chat-message.entity.js';
import { UserProgressModule } from '../user-progress/user-progress.module.js';
import { ExercisesModule } from '../exercises/exercises.module.js';
import { AiModule } from '../ai/ai.module.js';
import { ExercisePoolModule } from '../exercise-pool/exercise-pool.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LearningSession, ChatMessage]),
    UserProgressModule,
    ExercisesModule,
    AiModule,
    forwardRef(() => ExercisePoolModule),
  ],
  controllers: [LearningPathController],
  providers: [LearningPathService],
  exports: [LearningPathService],
})
export class LearningPathModule {}
