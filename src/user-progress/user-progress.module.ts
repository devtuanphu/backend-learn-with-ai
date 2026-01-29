import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgressController } from './user-progress.controller';
import { UserProgressService } from './user-progress.service';
import { UserExercise } from './entities/user-exercise.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { UserError } from './entities/user-error.entity';
import { ExercisesModule } from '../exercises/exercises.module';
import { AiModule } from '../ai/ai.module';
import { ExercisePoolModule } from '../exercise-pool/exercise-pool.module';

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
