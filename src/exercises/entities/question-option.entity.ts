import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @ManyToOne(() => Question, (q) => q.options, { onDelete: 'CASCADE' })
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
