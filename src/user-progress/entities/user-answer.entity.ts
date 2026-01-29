import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserExercise } from './user-exercise.entity';
import { Question } from '../../exercises/entities/question.entity';
import { UserError } from './user-error.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.userAnswers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userExerciseId: string;

  @ManyToOne(() => UserExercise, (ue) => ue.userAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userExerciseId' })
  userExercise: UserExercise;

  @Column()
  questionId: string;

  @ManyToOne(() => Question, (q) => q.userAnswers)
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

  @OneToMany(() => UserError, (ue) => ue.userAnswer, { cascade: true })
  errors: UserError[];
}
