import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReadyExercise } from './entities/ready-exercise.entity';
import { ExercisePoolService } from './exercise-pool.service';
import { ExercisePoolScheduler } from './exercise-pool.scheduler';
import { AiModule } from '../ai/ai.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadyExercise]),
    ScheduleModule.forRoot(),
    AiModule,
    ExercisesModule,
  ],
  providers: [ExercisePoolService, ExercisePoolScheduler],
  exports: [ExercisePoolService],
})
export class ExercisePoolModule {}
