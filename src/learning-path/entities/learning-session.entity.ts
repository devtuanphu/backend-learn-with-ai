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
import type { ChatMessage } from './chat-message.entity.js';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

@Entity('learning_sessions')
export class LearningSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne('User', 'learningSessions')
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' }) // 2 = Practice, 3 = Application
  phase: number;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @Column({ type: 'jsonb', nullable: true })
  aiContext: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  userErrors: string[]; // Error IDs from previous phases

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany('ChatMessage', 'session', { cascade: true })
  messages: ChatMessage[];
}
