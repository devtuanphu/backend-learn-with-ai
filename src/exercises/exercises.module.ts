import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller.js';
import { ExercisesService } from './exercises.service.js';
import { Exercise } from './entities/exercise.entity.js';
import { Question } from './entities/question.entity.js';
import { QuestionOption } from './entities/question-option.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Question, QuestionOption])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
