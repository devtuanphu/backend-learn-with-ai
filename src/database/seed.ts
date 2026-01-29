import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { Exercise } from '../exercises/entities/exercise.entity.js';
import { Question } from '../exercises/entities/question.entity.js';
import { QuestionOption } from '../exercises/entities/question-option.entity.js';
import { UserExercise } from '../user-progress/entities/user-exercise.entity.js';
import { UserAnswer } from '../user-progress/entities/user-answer.entity.js';
import { UserError } from '../user-progress/entities/user-error.entity.js';
import { LearningSession } from '../learning-path/entities/learning-session.entity.js';
import { ChatMessage } from '../learning-path/entities/chat-message.entity.js';
import { seedExercises } from './seed-exercises.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'learn_with_ai',
  entities: [
    User,
    Exercise,
    Question,
    QuestionOption,
    UserExercise,
    UserAnswer,
    UserError,
    LearningSession,
    ChatMessage,
  ],
  synchronize: true,
});

async function main() {
  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    await seedExercises(dataSource);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

void main();
