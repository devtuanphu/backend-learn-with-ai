import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExercisePoolService } from './exercise-pool.service';

@Injectable()
export class ExercisePoolScheduler implements OnModuleInit {
  private readonly logger = new Logger(ExercisePoolScheduler.name);
  private isRunning = false;

  constructor(private readonly poolService: ExercisePoolService) {}

  /**
   * Khởi tạo pool khi module load (deploy lần đầu)
   */
  async onModuleInit() {
    this.logger.log('🚀 ExercisePoolScheduler initialized');
    this.logger.log('Checking initial pool status...');

    try {
      const stats = await this.poolService.getPoolStats();
      this.logger.log(`Initial pool stats: ${JSON.stringify(stats)}`);

      // Nếu pool trống, generate ban đầu
      if (stats.total === 0) {
        this.logger.log(
          '📦 Pool is empty, starting initial generation (this may take a few minutes)...',
        );
        await this.maintainPool();
      }
    } catch (error) {
      this.logger.error('Error during initial pool check', error);
    }
  }

  /**
   * Chạy mỗi 5 phút - kiểm tra và duy trì pool
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    if (this.isRunning) {
      this.logger.log('Previous job still running, skipping...');
      return;
    }

    this.logger.log('⏰ Cron job triggered: maintaining exercise pool...');
    await this.maintainPool();
  }

  /**
   * Logic maintain pool (có thể gọi từ cron hoặc manual)
   */
  async maintainPool() {
    this.isRunning = true;

    try {
      await this.poolService.maintainPool();

      const stats = await this.poolService.getPoolStats();
      this.logger.log(
        `✅ Pool maintenance complete. Stats: ${JSON.stringify(stats)}`,
      );
    } catch (error) {
      this.logger.error('❌ Error during pool maintenance', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * API để trigger manual generation (cho testing/admin)
   */
  async triggerGeneration(
    phase: 1 | 2 | 3,
    count: number = 1,
    errorPattern?: string,
  ): Promise<void> {
    this.logger.log(
      `Manual trigger: Phase ${phase}, count=${count}, pattern=${errorPattern}`,
    );

    for (let i = 0; i < count; i++) {
      if (phase === 1) {
        await this.poolService.generatePhase1Exercise();
      } else if (phase === 2 && errorPattern) {
        await this.poolService.generatePhase2Exercise(errorPattern);
      } else if (phase === 3 && errorPattern) {
        await this.poolService.generatePhase3Exercise([errorPattern]);
      }
    }
  }
}
