import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPathController } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';
import { LearningSession } from './entities/learning-session.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { UserProgressModule } from '../user-progress/user-progress.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { AiModule } from '../ai/ai.module';
import { ExercisePoolModule } from '../exercise-pool/exercise-pool.module';

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
