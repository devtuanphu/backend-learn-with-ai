import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserExercise } from '../../user-progress/entities/user-exercise.entity';
import { UserAnswer } from '../../user-progress/entities/user-answer.entity';
import { UserError } from '../../user-progress/entities/user-error.entity';
import { LearningSession } from '../../learning-path/entities/learning-session.entity';

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

  @OneToMany(() => UserExercise, (ue) => ue.user)
  userExercises: UserExercise[];

  @OneToMany(() => UserAnswer, (ua) => ua.user)
  userAnswers: UserAnswer[];

  @OneToMany(() => UserError, (ue) => ue.user)
  userErrors: UserError[];

  @OneToMany(() => LearningSession, (ls) => ls.user)
  learningSessions: LearningSession[];
}
