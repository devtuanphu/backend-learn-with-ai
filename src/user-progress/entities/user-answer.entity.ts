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
import type { UserExercise } from './user-exercise.entity.js';
import type { Question } from '../../exercises/entities/question.entity.js';
import type { UserError } from './user-error.entity.js';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne('User', 'userAnswers')
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userExerciseId: string;

  @ManyToOne('UserExercise', 'userAnswers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userExerciseId' })
  userExercise: UserExercise;

  @Column()
  questionId: string;

  @ManyToOne('Question', 'userAnswers')
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'jsonb', nullable: true })
  selectedOptions: string[]; // array of option IDs

  @Column({ type: 'text', nullable: true })
  textAnswer: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ default: 0 })
  earnedPoints: number;

  @Column({ default: 0 })
  timeSpent: number; // seconds

  @CreateDateColumn()
  answeredAt: Date;

  @OneToMany('UserError', 'userAnswer', { cascade: true })
  errors: UserError[];
}
