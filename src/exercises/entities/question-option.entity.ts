import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Question } from './question.entity.js';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @ManyToOne('Question', 'options', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ nullable: true })
  errorType: string;

  @Column({ type: 'text', nullable: true })
  errorDescription: string;
}
