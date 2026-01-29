import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Question } from '../exercises/entities/question.entity';
import { QuestionOption } from '../exercises/entities/question-option.entity';
import { UserExercise } from '../user-progress/entities/user-exercise.entity';
import { UserAnswer } from '../user-progress/entities/user-answer.entity';
import { UserError } from '../user-progress/entities/user-error.entity';
import { LearningSession } from '../learning-path/entities/learning-session.entity';
import { ChatMessage } from '../learning-path/entities/chat-message.entity';
import { seedExercises } from './seed-exercises';

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
