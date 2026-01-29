import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Question, QuestionOption])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
