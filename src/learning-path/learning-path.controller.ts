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
import { LearningPathService } from './learning-path.service.js';

@Controller('learning')
@UseGuards(AuthGuard('jwt'))
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Post('start-practice')
  async startPractice(@Request() req: { user: { id: string } }) {
    return this.learningPathService.startPracticePhase(req.user.id);
  }

  @Post('start-application')
  async startApplication(@Request() req: { user: { id: string } }) {
    return this.learningPathService.startApplicationPhase(req.user.id);
  }

  @Post('chat/:sessionId')
  async chat(
    @Request() req: { user: { id: string } },
    @Param('sessionId') sessionId: string,
    @Body() body: { message: string },
  ) {
    return this.learningPathService.chat(req.user.id, sessionId, body.message);
  }

  @Get('session/:sessionId/messages')
  async getMessages(
    @Request() req: { user: { id: string } },
    @Param('sessionId') sessionId: string,
  ) {
    return this.learningPathService.getSessionMessages(req.user.id, sessionId);
  }

  @Post('session/:sessionId/complete')
  async completeSession(
    @Request() req: { user: { id: string } },
    @Param('sessionId') sessionId: string,
  ) {
    return this.learningPathService.completeSession(req.user.id, sessionId);
  }
}
