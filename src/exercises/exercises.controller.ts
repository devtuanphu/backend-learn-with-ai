import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExercisesService } from './exercises.service';
import { ExerciseType } from './entities/exercise.entity';

@Controller('exercises')
@UseGuards(AuthGuard('jwt'))
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('templates')
  async getTemplates(@Query('topic') topic?: string) {
    return this.exercisesService.getTemplateExercises(topic);
  }

  @Get('by-type/:type')
  async getByType(@Param('type') type: ExerciseType) {
    return this.exercisesService.getExercisesByType(type);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.exercisesService.getExerciseById(id);
  }
}
