import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserAnswer } from './user-answer.entity';

@Entity('user_errors')
export class UserError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.userErrors)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userAnswerId: string;

  @ManyToOne(() => UserAnswer, (ua) => ua.errors, {
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
