import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import type { UserExercise } from '../../user-progress/entities/user-exercise.entity.js';
import type { UserAnswer } from '../../user-progress/entities/user-answer.entity.js';
import type { UserError } from '../../user-progress/entities/user-error.entity.js';
import type { LearningSession } from '../../learning-path/entities/learning-session.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany('UserExercise', 'user')
  userExercises: UserExercise[];

  @OneToMany('UserAnswer', 'user')
  userAnswers: UserAnswer[];

  @OneToMany('UserError', 'user')
  userErrors: UserError[];

  @OneToMany('LearningSession', 'user')
  learningSessions: LearningSession[];
}
