"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
const question_entity_1 = require("../exercises/entities/question.entity");
const question_option_entity_1 = require("../exercises/entities/question-option.entity");
const user_exercise_entity_1 = require("../user-progress/entities/user-exercise.entity");
const user_answer_entity_1 = require("../user-progress/entities/user-answer.entity");
const user_error_entity_1 = require("../user-progress/entities/user-error.entity");
const learning_session_entity_1 = require("../learning-path/entities/learning-session.entity");
const chat_message_entity_1 = require("../learning-path/entities/chat-message.entity");
const seed_exercises_1 = require("./seed-exercises");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'learn_with_ai',
    entities: [
        user_entity_1.User,
        exercise_entity_1.Exercise,
        question_entity_1.Question,
        question_option_entity_1.QuestionOption,
        user_exercise_entity_1.UserExercise,
        user_answer_entity_1.UserAnswer,
        user_error_entity_1.UserError,
        learning_session_entity_1.LearningSession,
        chat_message_entity_1.ChatMessage,
    ],
    synchronize: true,
});
async function main() {
    try {
        console.log('🔌 Connecting to database...');
        await dataSource.initialize();
        console.log('✅ Connected to database');
        await (0, seed_exercises_1.seedExercises)(dataSource);
        console.log('🎉 Seed completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
void main();
//# sourceMappingURL=seed.js.map