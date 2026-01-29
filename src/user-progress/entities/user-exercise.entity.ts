import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { User } from '../../auth/entities/user.entity.js';
import type { Exercise } from '../../exercises/entities/exercise.entity.js';
import type { UserAnswer } from './user-answer.entity.js';

export enum UserExerciseStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum LearningPhase {
  WARM_UP = 1, // Khởi động
  PRACTICE = 2, // Luyện tập - Sửa lỗi
  APPLICATION = 3, // Vận dụng
}

@Entity('user_exercises')
export class UserExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne('User', 'userExercises')
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  exerciseId: string;

  @ManyToOne('Exercise', 'userExercises')
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column({ type: 'int', default: LearningPhase.WARM_UP })
  phase: LearningPhase;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  timeSpent: number; // seconds

  @Column({
    type: 'enum',
    enum: UserExerciseStatus,
    default: UserExerciseStatus.IN_PROGRESS,
  })
  status: UserExerciseStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @OneToMany('UserAnswer', 'userExercise', { cascade: true })
  userAnswers: UserAnswer[];
}
