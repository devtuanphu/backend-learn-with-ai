import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ReadyExerciseStatus {
  READY = 'READY',
  USED = 'USED',
}

export enum ReadyExerciseType {
  BASIC = 'BASIC',
  APPLICATION = 'APPLICATION',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
}

/**
 * Các loại lỗi phổ biến của học sinh lớp 5
 */
export const ERROR_PATTERNS = [
  'decimal_placement', // Đặt sai dấu phẩy
  'multiplication_error', // Nhân sai
  'division_error', // Chia sai
  'misunderstanding', // Hiểu sai đề
  'calculation_error', // Tính toán sai
  'unit_conversion', // Đổi đơn vị sai
] as const;

export type ErrorPattern = (typeof ERROR_PATTERNS)[number];

@Entity('ready_exercises')
export class ReadyExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  phase: number; // 1, 2, or 3

  @Column({
    type: 'enum',
    enum: ReadyExerciseType,
    default: ReadyExerciseType.BASIC,
  })
  exerciseType: ReadyExerciseType;

  @Column({ default: 'decimal_multiplication' })
  topic: string;

  @Column({ type: 'text', array: true, nullable: true })
  errorPatterns: string[]; // Các loại lỗi mà bài tập này target

  @Column({ type: 'text' })
  scenario: string;

  @Column({ type: 'jsonb' })
  questions: {
    content: string;
    options: {
      content: string;
      isCorrect: boolean;
      errorType?: string;
      errorDescription?: string;
    }[];
  }[];

  @Column({
    type: 'enum',
    enum: ReadyExerciseStatus,
    default: ReadyExerciseStatus.READY,
  })
  status: ReadyExerciseStatus;

  @Column({ nullable: true })
  usedByUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usedByUserId' })
  usedByUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;
}
