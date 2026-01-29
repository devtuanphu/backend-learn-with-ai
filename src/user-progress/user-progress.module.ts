import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgressController } from './user-progress.controller.js';
import { UserProgressService } from './user-progress.service.js';
import { UserExercise } from './entities/user-exercise.entity.js';
import { UserAnswer } from './entities/user-answer.entity.js';
import { UserError } from './entities/user-error.entity.js';
import { ExercisesModule } from '../exercises/exercises.module.js';
import { AiModule } from '../ai/ai.module.js';
import { ExercisePoolModule } from '../exercise-pool/exercise-pool.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserExercise, UserAnswer, UserError]),
    ExercisesModule,
    AiModule,
    forwardRef(() => ExercisePoolModule),
  ],
  controllers: [UserProgressController],
  providers: [UserProgressService],
  exports: [UserProgressService],
})
export class UserProgressModule {}
