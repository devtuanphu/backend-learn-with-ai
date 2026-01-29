import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { Exercise } from './exercise.entity.js';
import type { QuestionOption } from './question-option.entity.js';
import type { UserAnswer } from '../../user-progress/entities/user-answer.entity.js';

export enum QuestionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
  TEXT = 'TEXT',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exerciseId: string;

  @ManyToOne('Exercise', 'questions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column()
  orderIndex: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.SINGLE })
  type: QuestionType;

  @Column({ default: 12 })
  correctPoints: number;

  @Column({ default: 2 })
  wrongPoints: number;

  @Column({ default: 4 })
  bonusPoints: number;

  @Column({ type: 'jsonb', nullable: true })
  aiRecognitionRules: Record<string, any>;

  @OneToMany('QuestionOption', 'question', { cascade: true })
  options: QuestionOption[];

  @OneToMany('UserAnswer', 'question')
  userAnswers: UserAnswer[];
}
