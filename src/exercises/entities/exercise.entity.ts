import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Question } from './question.entity.js';
import type { UserExercise } from '../../user-progress/entities/user-exercise.entity.js';

export enum ExerciseType {
  BASIC = 'BASIC',
  APPLICATION = 'APPLICATION',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
}

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ExerciseType })
  type: ExerciseType;

  @Column()
  topic: string;

  @Column({ type: 'text' })
  scenario: string;

  @Column({ default: 90 }) // seconds
  timeLimit: number;

  @Column({ default: 30 }) // seconds for bonus
  bonusTime: number;

  @Column({ default: true })
  isTemplate: boolean;

  @Column({ nullable: true })
  generatedFromId: string;

  @ManyToOne(() => Exercise, { nullable: true })
  @JoinColumn({ name: 'generatedFromId' })
  generatedFrom: Exercise;

  @OneToMany('Question', 'exercise', { cascade: true })
  questions: Question[];

  @OneToMany('UserExercise', 'exercise')
  userExercises: UserExercise[];
}
