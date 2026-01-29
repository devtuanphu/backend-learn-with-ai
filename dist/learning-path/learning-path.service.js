"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningPathService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const learning_session_entity_1 = require("./entities/learning-session.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const user_progress_service_1 = require("../user-progress/user-progress.service");
const exercises_service_1 = require("../exercises/exercises.service");
const ai_service_1 = require("../ai/ai.service");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
const user_exercise_entity_1 = require("../user-progress/entities/user-exercise.entity");
const exercise_pool_service_1 = require("../exercise-pool/exercise-pool.service");
let LearningPathService = class LearningPathService {
    sessionRepository;
    messageRepository;
    userProgressService;
    exercisesService;
    aiService;
    exercisePoolService;
    constructor(sessionRepository, messageRepository, userProgressService, exercisesService, aiService, exercisePoolService) {
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.userProgressService = userProgressService;
        this.exercisesService = exercisesService;
        this.aiService = aiService;
        this.exercisePoolService = exercisePoolService;
    }
    async startPracticePhase(userId) {
        const errors = await this.userProgressService.getUserErrors(userId, user_exercise_entity_1.LearningPhase.WARM_UP);
        const errorTypes = [...new Set(errors.map((e) => e.errorType))];
        let exerciseData;
        const poolExercise = await this.exercisePoolService.getExerciseByErrors(2, errorTypes, userId);
        if (poolExercise) {
            console.log('✅ Got Phase 2 exercise from pool:', poolExercise.id);
            exerciseData = {
                scenario: poolExercise.scenario,
                questions: poolExercise.questions,
            };
        }
        else {
            console.warn('⚠️ Pool empty for Phase 2, falling back to AI...');
            exerciseData = await this.aiService.generateErrorBasedExercise(errors, 'APPLICATION');
        }
        const exercise = await this.exercisesService.createExercise({
            type: exercise_entity_1.ExerciseType.APPLICATION,
            topic: 'phep-nhan-so-thap-phan',
            scenario: exerciseData.scenario,
            isTemplate: false,
            questions: exerciseData.questions.map((q) => ({
                content: q.content,
                options: q.options,
            })),
        });
        const session = this.sessionRepository.create({
            userId,
            phase: user_exercise_entity_1.LearningPhase.PRACTICE,
            userErrors: errors.map((e) => e.id),
            status: learning_session_entity_1.SessionStatus.ACTIVE,
        });
        const savedSession = await this.sessionRepository.save(session);
        const welcomeMessage = `Chào bạn! Mình là Trợ lí Học tập Ảo của bạn đây! 🌟

Mình đã xem qua kết quả ở phần Khởi động rồi. Bạn làm tốt lắm! Nhưng mình thấy có vài chỗ bạn còn nhầm lẫn một chút. Đừng lo, cùng nhau luyện tập để tiến bộ hơn nhé!

📝 **Bài toán:**
${exerciseData.scenario}

Bạn hãy đọc kỹ bài toán, sau đó trả lời mình nhé:
**Bài toán trên cho ta biết điều gì? Bài toán yêu cầu ta làm gì?**`;
        await this.messageRepository.save({
            sessionId: savedSession.id,
            role: chat_message_entity_1.MessageRole.AI,
            content: welcomeMessage,
            promptType: chat_message_entity_1.PromptType.SCAFFOLDING_1,
        });
        return {
            session: savedSession,
            exercise,
            welcomeMessage,
        };
    }
    async chat(userId, sessionId, message) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId, userId },
            relations: ['messages'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        await this.messageRepository.save({
            sessionId,
            role: chat_message_entity_1.MessageRole.USER,
            content: message,
            promptType: chat_message_entity_1.PromptType.GENERAL,
        });
        const errors = await this.userProgressService.getUserErrors(userId, session.phase);
        const aiMessages = session.messages.filter((m) => m.role === chat_message_entity_1.MessageRole.AI);
        const lastAiMessage = aiMessages[aiMessages.length - 1];
        let currentStep = 1;
        if (lastAiMessage) {
            switch (lastAiMessage.promptType) {
                case chat_message_entity_1.PromptType.SCAFFOLDING_1:
                    currentStep = 2;
                    break;
                case chat_message_entity_1.PromptType.SCAFFOLDING_2:
                    currentStep = 3;
                    break;
                case chat_message_entity_1.PromptType.SCAFFOLDING_3:
                    currentStep = 4;
                    break;
                default:
                    currentStep = 1;
            }
        }
        const history = session.messages.map((m) => ({
            role: m.role === chat_message_entity_1.MessageRole.USER ? 'user' : 'model',
            content: m.content,
        }));
        const problem = session.aiContext?.problem ||
            'Bài toán về phép nhân số thập phân';
        const aiResult = await this.aiService.scaffoldingChat(currentStep, problem, message, errors, history);
        let nextPromptType;
        switch (currentStep) {
            case 1:
                nextPromptType = chat_message_entity_1.PromptType.SCAFFOLDING_2;
                break;
            case 2:
                nextPromptType = chat_message_entity_1.PromptType.SCAFFOLDING_3;
                break;
            case 3:
                nextPromptType = chat_message_entity_1.PromptType.SCAFFOLDING_4;
                break;
            default:
                nextPromptType = chat_message_entity_1.PromptType.FEEDBACK;
        }
        await this.messageRepository.save({
            sessionId,
            role: chat_message_entity_1.MessageRole.AI,
            content: aiResult.message,
            promptType: nextPromptType,
            emotion: aiResult.emotion,
        });
        return {
            aiResponse: aiResult.message,
            promptType: nextPromptType,
            emotion: aiResult.emotion,
            evaluation: aiResult.evaluation,
        };
    }
    async startApplicationPhase(userId) {
        const errors = await this.userProgressService.getUserErrors(userId);
        const errorTypes = [...new Set(errors.map((e) => e.errorType))];
        let exerciseData;
        const poolExercise = await this.exercisePoolService.getExerciseByErrors(3, errorTypes, userId);
        if (poolExercise) {
            console.log('✅ Got Phase 3 exercise from pool:', poolExercise.id);
            exerciseData = {
                scenario: poolExercise.scenario,
                questions: poolExercise.questions,
            };
        }
        else {
            console.warn('⚠️ Pool empty for Phase 3, falling back to AI...');
            exerciseData = await this.aiService.generateErrorBasedExercise(errors, 'COMPREHENSIVE');
        }
        const exercise = await this.exercisesService.createExercise({
            type: exercise_entity_1.ExerciseType.PROBLEM_SOLVING,
            topic: 'phep-nhan-so-thap-phan',
            scenario: exerciseData.scenario,
            isTemplate: false,
            questions: exerciseData.questions.map((q) => ({
                content: q.content,
                options: q.options,
            })),
        });
        const session = this.sessionRepository.create({
            userId,
            phase: user_exercise_entity_1.LearningPhase.APPLICATION,
            userErrors: errors.map((e) => e.id),
            status: learning_session_entity_1.SessionStatus.ACTIVE,
        });
        const savedSession = await this.sessionRepository.save(session);
        const welcomeMessage = `Tuyệt vời! Bạn đã hoàn thành phần Luyện tập rồi! 🎉

Bây giờ chúng ta sẽ cùng nhau thử thách với một bài toán thực tế nhé!

📝 **Bài toán vận dụng:**
${exerciseData.scenario}

Đây là bài toán tổng hợp những gì bạn đã học. Hãy đọc kỹ và cho mình biết:
**Bài toán cho ta biết điều gì? Yêu cầu ta làm gì?**`;
        await this.messageRepository.save({
            sessionId: savedSession.id,
            role: chat_message_entity_1.MessageRole.AI,
            content: welcomeMessage,
            promptType: chat_message_entity_1.PromptType.SCAFFOLDING_1,
        });
        return {
            session: savedSession,
            exercise,
            welcomeMessage,
        };
    }
    async getSessionMessages(userId, sessionId) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        return this.messageRepository.find({
            where: { sessionId },
            order: { createdAt: 'ASC' },
        });
    }
    async completeSession(userId, sessionId) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        session.status = learning_session_entity_1.SessionStatus.COMPLETED;
        return this.sessionRepository.save(session);
    }
};
exports.LearningPathService = LearningPathService;
exports.LearningPathService = LearningPathService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(learning_session_entity_1.LearningSession)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => exercise_pool_service_1.ExercisePoolService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_progress_service_1.UserProgressService,
        exercises_service_1.ExercisesService,
        ai_service_1.AiService,
        exercise_pool_service_1.ExercisePoolService])
], LearningPathService);
//# sourceMappingURL=learning-path.service.js.map