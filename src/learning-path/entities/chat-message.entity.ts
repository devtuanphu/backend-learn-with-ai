import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { LearningSession } from './learning-session.entity';

export enum MessageRole {
  USER = 'USER',
  AI = 'AI',
}

export enum PromptType {
  SCAFFOLDING_1 = 'SCAFFOLDING_1', // Bài toán cho biết gì?
  SCAFFOLDING_2 = 'SCAFFOLDING_2', // Thực hiện như thế nào?
  SCAFFOLDING_3 = 'SCAFFOLDING_3', // Trình bày lời giải
  SCAFFOLDING_4 = 'SCAFFOLDING_4', // Kết quả hợp lý không?
  FEEDBACK = 'FEEDBACK',
  ENCOURAGEMENT = 'ENCOURAGEMENT',
  GENERAL = 'GENERAL',
}

export type RobotEmotion =
  | 'celebrating'
  | 'encouraging'
  | 'thinking'
  | 'happy'
  | 'idle';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => LearningSession, (ls) => ls.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session: LearningSession;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PromptType, default: PromptType.GENERAL })
  promptType: PromptType;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emotion: RobotEmotion | null;

  @CreateDateColumn()
  createdAt: Date;
}
