import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReadyExercise } from './entities/ready-exercise.entity.js';
import { ExercisePoolService } from './exercise-pool.service.js';
import { ExercisePoolScheduler } from './exercise-pool.scheduler.js';
import { AiModule } from '../ai/ai.module.js';
import { ExercisesModule } from '../exercises/exercises.module.js';

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
