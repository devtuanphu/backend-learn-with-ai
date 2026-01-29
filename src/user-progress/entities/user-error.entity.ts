import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { User } from '../../auth/entities/user.entity.js';
import type { UserAnswer } from './user-answer.entity.js';

@Entity('user_errors')
export class UserError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne('User', 'userErrors')
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userAnswerId: string;

  @ManyToOne('UserAnswer', 'errors', {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userAnswerId' })
  userAnswer: UserAnswer;

  @Column()
  errorType: string;

  @Column({ type: 'text' })
  errorDescription: string;

  @Column({ type: 'text', nullable: true })
  aiAnalysis: string;

  @Column({ type: 'int', default: 1 })
  phase: number;

  @CreateDateColumn()
  createdAt: Date;
}
