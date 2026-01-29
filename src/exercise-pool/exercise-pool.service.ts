import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ReadyExercise,
  ReadyExerciseStatus,
  ReadyExerciseType,
  ERROR_PATTERNS,
} from './entities/ready-exercise.entity';
import { AiService } from '../ai/ai.service';
import { ExercisesService } from '../exercises/exercises.service';
import { ExerciseType } from '../exercises/entities/exercise.entity';
import { UserError } from '../user-progress/entities/user-error.entity';

interface PoolStats {
  phase1: number;
  phase2: { [key: string]: number };
  phase3: { [key: string]: number };
  total: number;
}

@Injectable()
export class ExercisePoolService {
  private readonly logger = new Logger(ExercisePoolService.name);

  // Cấu hình pool size
  private readonly PHASE1_TARGET = 20;
  private readonly PHASE2_TARGET_PER_ERROR = 10;
  private readonly PHASE3_TARGET_PER_ERROR = 10;

  constructor(
    @InjectRepository(ReadyExercise)
    private readyExerciseRepository: Repository<ReadyExercise>,
    private aiService: AiService,
    private exercisesService: ExercisesService,
  ) {}

  /**
   * Lấy bài tập Phase 1 từ pool và gán cho user
   */
  async getPhase1Exercise(userId: string): Promise<ReadyExercise | null> {
    const exercise = await this.readyExerciseRepository.findOne({
      where: {
        phase: 1,
        status: ReadyExerciseStatus.READY,
      },
      order: { createdAt: 'ASC' }, // FIFO
    });

    if (exercise) {
      await this.assignToUser(exercise.id, userId);
      return this.readyExerciseRepository.findOne({
        where: { id: exercise.id },
      });
    }

    return null;
  }

  /**
   * Lấy bài tập Phase 2/3 theo lỗi của user
   */
  async getExerciseByErrors(
    phase: 2 | 3,
    errorPatterns: string[],
    userId: string,
  ): Promise<ReadyExercise | null> {
    // Tìm bài tập có ít nhất 1 error pattern trùng
    const exercise = await this.readyExerciseRepository
      .createQueryBuilder('ready')
      .where('ready.phase = :phase', { phase })
      .andWhere('ready.status = :status', {
        status: ReadyExerciseStatus.READY,
      })
      .andWhere('ready.errorPatterns && :patterns', {
        patterns: errorPatterns,
      })
      .orderBy('ready.createdAt', 'ASC')
      .getOne();

    if (exercise) {
      await this.assignToUser(exercise.id, userId);
      return this.readyExerciseRepository.findOne({
        where: { id: exercise.id },
      });
    }

    return null;
  }

  /**
   * Gán bài tập cho user
   */
  private async assignToUser(
    exerciseId: string,
    userId: string,
  ): Promise<void> {
    await this.readyExerciseRepository.update(exerciseId, {
      status: ReadyExerciseStatus.USED,
      usedByUserId: userId,
      usedAt: new Date(),
    });
    this.logger.log(`Assigned exercise ${exerciseId} to user ${userId}`);
  }

  /**
   * Thêm bài tập Phase 1 vào pool
   */
  async generatePhase1Exercise(): Promise<ReadyExercise | null> {
    try {
      // Lấy template bài tập BASIC
      const templates = await this.exercisesService.getExercisesByType(
        ExerciseType.BASIC,
      );

      if (templates.length === 0) {
        this.logger.warn('No BASIC templates found');
        return null;
      }

      // Random chọn 1 template
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Gọi AI generate bài tập mới
      const generated =
        await this.aiService.generateExerciseFromTemplate(template);

      // Lưu vào pool
      const readyExercise = this.readyExerciseRepository.create({
        phase: 1,
        exerciseType: ReadyExerciseType.BASIC,
        topic: template.topic,
        scenario: generated.scenario,
        questions: generated.questions,
        status: ReadyExerciseStatus.READY,
      });

      const saved = await this.readyExerciseRepository.save(readyExercise);
      this.logger.log(`✅ Generated Phase 1 exercise: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error('Error generating Phase 1 exercise', error);
      return null;
    }
  }

  /**
   * Thêm bài tập Phase 2 theo error pattern vào pool
   */
  async generatePhase2Exercise(
    errorPattern: string,
  ): Promise<ReadyExercise | null> {
    try {
      // Tạo mock error để gọi AI
      const mockErrors: Partial<UserError>[] = [
        {
          id: 'mock',
          userId: 'system',
          errorType: errorPattern,
          errorDescription: this.getErrorDescription(errorPattern),
          phase: 1,
          createdAt: new Date(),
        },
      ];

      const generated = await this.aiService.generateErrorBasedExercise(
        mockErrors as UserError[],
        'APPLICATION',
      );

      const readyExercise = this.readyExerciseRepository.create({
        phase: 2,
        exerciseType: ReadyExerciseType.APPLICATION,
        topic: 'decimal_operations',
        errorPatterns: [errorPattern],
        scenario: generated.scenario,
        questions: generated.questions,
        status: ReadyExerciseStatus.READY,
      });

      const saved = await this.readyExerciseRepository.save(readyExercise);
      this.logger.log(
        `✅ Generated Phase 2 exercise for ${errorPattern}: ${saved.id}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(
        `Error generating Phase 2 exercise for ${errorPattern}`,
        error,
      );
      return null;
    }
  }

  /**
   * Thêm bài tập Phase 3 theo error patterns vào pool
   */
  async generatePhase3Exercise(
    errorPatterns: string[],
  ): Promise<ReadyExercise | null> {
    try {
      const mockErrors: Partial<UserError>[] = errorPatterns.map((pattern) => ({
        id: 'mock',
        userId: 'system',
        errorType: pattern,
        errorDescription: this.getErrorDescription(pattern),
        phase: 2,
        createdAt: new Date(),
      }));

      const generated = await this.aiService.generateErrorBasedExercise(
        mockErrors as UserError[],
        'COMPREHENSIVE',
      );

      const readyExercise = this.readyExerciseRepository.create({
        phase: 3,
        exerciseType: ReadyExerciseType.PROBLEM_SOLVING,
        topic: 'decimal_comprehensive',
        errorPatterns: errorPatterns,
        scenario: generated.scenario,
        questions: generated.questions,
        status: ReadyExerciseStatus.READY,
      });

      const saved = await this.readyExerciseRepository.save(readyExercise);
      this.logger.log(
        `✅ Generated Phase 3 exercise for ${errorPatterns.join(', ')}: ${saved.id}`,
      );

      return saved;
    } catch (error) {
      this.logger.error('Error generating Phase 3 exercise', error);
      return null;
    }
  }

  /**
   * Lấy thống kê pool
   */
  async getPoolStats(): Promise<PoolStats> {
    const phase1Count = await this.readyExerciseRepository.count({
      where: { phase: 1, status: ReadyExerciseStatus.READY },
    });

    const phase2Stats: { [key: string]: number } = {};
    const phase3Stats: { [key: string]: number } = {};

    for (const pattern of ERROR_PATTERNS) {
      phase2Stats[pattern] = await this.readyExerciseRepository
        .createQueryBuilder('ready')
        .where('ready.phase = 2')
        .andWhere('ready.status = :status', {
          status: ReadyExerciseStatus.READY,
        })
        .andWhere(':pattern = ANY(ready.errorPatterns)', { pattern })
        .getCount();

      phase3Stats[pattern] = await this.readyExerciseRepository
        .createQueryBuilder('ready')
        .where('ready.phase = 3')
        .andWhere('ready.status = :status', {
          status: ReadyExerciseStatus.READY,
        })
        .andWhere(':pattern = ANY(ready.errorPatterns)', { pattern })
        .getCount();
    }

    return {
      phase1: phase1Count,
      phase2: phase2Stats,
      phase3: phase3Stats,
      total:
        phase1Count +
        Object.values(phase2Stats).reduce((a, b) => a + b, 0) +
        Object.values(phase3Stats).reduce((a, b) => a + b, 0),
    };
  }

  /**
   * Kiểm tra và duy trì pool size
   */
  async maintainPool(): Promise<void> {
    const stats = await this.getPoolStats();
    this.logger.log(`Pool stats: ${JSON.stringify(stats)}`);

    // Maintain Phase 1
    if (stats.phase1 < this.PHASE1_TARGET) {
      const needed = this.PHASE1_TARGET - stats.phase1;
      this.logger.log(`Phase 1 needs ${needed} more exercises`);

      for (let i = 0; i < Math.min(needed, 5); i++) {
        await this.generatePhase1Exercise();
      }
    }

    // Maintain Phase 2
    for (const pattern of ERROR_PATTERNS) {
      if (stats.phase2[pattern] < this.PHASE2_TARGET_PER_ERROR) {
        const needed = this.PHASE2_TARGET_PER_ERROR - stats.phase2[pattern];
        this.logger.log(`Phase 2 [${pattern}] needs ${needed} more exercises`);

        for (let i = 0; i < Math.min(needed, 3); i++) {
          await this.generatePhase2Exercise(pattern);
        }
      }
    }

    // Maintain Phase 3 - tạo cho các combo lỗi phổ biến
    const commonCombos = [
      ['decimal_placement', 'multiplication_error'],
      ['calculation_error', 'division_error'],
      ['misunderstanding', 'unit_conversion'],
    ];

    for (const combo of commonCombos) {
      const key = combo.join('_');
      if ((stats.phase3[combo[0]] || 0) < this.PHASE3_TARGET_PER_ERROR) {
        this.logger.log(`Phase 3 [${key}] needs more exercises`);
        await this.generatePhase3Exercise(combo);
      }
    }
  }

  private getErrorDescription(pattern: string): string {
    const descriptions: { [key: string]: string } = {
      decimal_placement: 'Học sinh đặt sai vị trí dấu phẩy thập phân',
      multiplication_error: 'Học sinh tính sai phép nhân',
      division_error: 'Học sinh tính sai phép chia',
      misunderstanding: 'Học sinh hiểu sai yêu cầu đề bài',
      calculation_error: 'Học sinh mắc lỗi tính toán chung',
      unit_conversion: 'Học sinh đổi sai đơn vị đo lường',
    };
    return descriptions[pattern] || 'Lỗi chung';
  }
}
