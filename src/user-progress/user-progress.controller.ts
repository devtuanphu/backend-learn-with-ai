import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProgressService } from './user-progress.service.js';

@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Post('start-warmup')
  async startWarmUp(@Request() req: { user: { id: string } }) {
    return this.userProgressService.startWarmUpPhase(req.user.id);
  }

  @Post('submit-answer')
  async submitAnswer(
    @Request() req: { user: { id: string } },
    @Body()
    body: {
      userExerciseId: string;
      questionId: string;
      selectedOptionIds: string[];
      textAnswer?: string;
      timeSpent?: number;
    },
  ) {
    return this.userProgressService.submitAnswer(
      req.user.id,
      body.userExerciseId,
      body.questionId,
      body.selectedOptionIds,
      body.textAnswer,
      body.timeSpent,
    );
  }

  @Post('complete/:userExerciseId')
  async completeExercise(
    @Request() req: { user: { id: string } },
    @Param('userExerciseId') userExerciseId: string,
  ) {
    return this.userProgressService.completeExercise(
      req.user.id,
      userExerciseId,
    );
  }

  @Get('result/:userExerciseId')
  async getResult(
    @Request() req: { user: { id: string } },
    @Param('userExerciseId') userExerciseId: string,
  ) {
    return this.userProgressService.getExerciseResult(
      req.user.id,
      userExerciseId,
    );
  }

  @Get('overview')
  async getOverview(@Request() req: { user: { id: string } }) {
    return this.userProgressService.getUserProgress(req.user.id);
  }

  @Get('errors')
  async getErrors(@Request() req: { user: { id: string } }) {
    return this.userProgressService.getUserErrors(req.user.id);
  }
}
