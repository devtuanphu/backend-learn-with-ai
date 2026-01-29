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
exports.UserProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_exercise_entity_1 = require("./entities/user-exercise.entity");
const user_answer_entity_1 = require("./entities/user-answer.entity");
const user_error_entity_1 = require("./entities/user-error.entity");
const exercises_service_1 = require("../exercises/exercises.service");
const ai_service_1 = require("../ai/ai.service");
const exercise_pool_service_1 = require("../exercise-pool/exercise-pool.service");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
let UserProgressService = class UserProgressService {
    userExerciseRepository;
    userAnswerRepository;
    userErrorRepository;
    exercisesService;
    aiService;
    exercisePoolService;
    constructor(userExerciseRepository, userAnswerRepository, userErrorRepository, exercisesService, aiService, exercisePoolService) {
        this.userExerciseRepository = userExerciseRepository;
        this.userAnswerRepository = userAnswerRepository;
        this.userErrorRepository = userErrorRepository;
        this.exercisesService = exercisesService;
        this.aiService = aiService;
        this.exercisePoolService = exercisePoolService;
    }
    async startWarmUpPhase(userId) {
        const savedIds = [];
        const exerciseTypes = [
            exercise_entity_1.ExerciseType.BASIC,
            exercise_entity_1.ExerciseType.APPLICATION,
            exercise_entity_1.ExerciseType.PROBLEM_SOLVING,
        ];
        const templates = await this.exercisesService.getTemplateExercises('phep-nhan-so-thap-phan');
        for (const type of exerciseTypes) {
            const template = templates.find((t) => t.type === type);
            if (!template) {
                console.warn(`⚠️ No template found for type: ${type}`);
                continue;
            }
            let exerciseId;
            try {
                const exercise = await this.exercisesService.createExercise({
                    type: template.type,
                    topic: template.topic,
                    scenario: template.scenario,
                    timeLimit: template.timeLimit,
                    bonusTime: template.bonusTime,
                    isTemplate: false,
                    generatedFromId: template.id,
                    questions: template.questions.map((q) => ({
                        content: q.content,
                        correctPoints: q.correctPoints,
                        wrongPoints: q.wrongPoints,
                        bonusPoints: q.bonusPoints,
                        options: q.options.map((opt) => ({
                            content: opt.content,
                            isCorrect: opt.isCorrect,
                            errorType: opt.errorType,
                            errorDescription: opt.errorDescription,
                        })),
                    })),
                });
                exerciseId = exercise.id;
                console.log(`✅ Created exercise ${type}:`, exercise.id);
            }
            catch (error) {
                console.warn(`⚠️ Failed to create exercise for ${type}:`, error);
                exerciseId = template.id;
            }
            const userExercise = this.userExerciseRepository.create({
                userId,
                exerciseId,
                phase: user_exercise_entity_1.LearningPhase.WARM_UP,
                status: user_exercise_entity_1.UserExerciseStatus.IN_PROGRESS,
            });
            const saved = await this.userExerciseRepository.save(userExercise);
            savedIds.push(saved.id);
        }
        return this.userExerciseRepository.find({
            where: savedIds.map((id) => ({ id })),
            relations: [
                'exercise',
                'exercise.questions',
                'exercise.questions.options',
            ],
            order: { startedAt: 'ASC' },
        });
    }
    async submitAnswer(userId, userExerciseId, questionId, selectedOptionIds, textAnswer, timeSpent) {
        const userExercise = await this.userExerciseRepository.findOne({
            where: { id: userExerciseId, userId },
            relations: [
                'exercise',
                'exercise.questions',
                'exercise.questions.options',
            ],
        });
        if (!userExercise) {
            throw new common_1.NotFoundException('User exercise not found');
        }
        const question = userExercise.exercise.questions.find((q) => q.id === questionId);
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        const correctOptions = question.options.filter((o) => o.isCorrect);
        const correctOptionIds = correctOptions.map((o) => o.id);
        const isCorrect = selectedOptionIds.length === correctOptionIds.length &&
            selectedOptionIds.every((id) => correctOptionIds.includes(id));
        let earnedPoints = isCorrect
            ? question.correctPoints
            : question.wrongPoints;
        if (isCorrect && timeSpent && timeSpent < userExercise.exercise.bonusTime) {
            earnedPoints += question.bonusPoints;
        }
        const answer = this.userAnswerRepository.create({
            userId,
            userExerciseId,
            questionId,
            selectedOptions: selectedOptionIds,
            textAnswer,
            isCorrect,
            earnedPoints,
            timeSpent: timeSpent ?? 0,
        });
        const savedAnswer = await this.userAnswerRepository.save(answer);
        if (!isCorrect) {
            const selectedOption = question.options.find((o) => selectedOptionIds.includes(o.id));
            if (selectedOption?.errorType) {
                const errorType = selectedOption.errorType;
                const errorDescription = selectedOption.errorDescription ?? 'Lỗi không xác định';
                const error = this.userErrorRepository.create({
                    userId,
                    userAnswerId: savedAnswer.id,
                    errorType,
                    errorDescription,
                    phase: userExercise.phase,
                });
                await this.userErrorRepository.save(error);
            }
        }
        await this.userExerciseRepository.update(userExerciseId, {
            score: () => `score + ${earnedPoints}`,
            timeSpent: () => `"timeSpent" + ${timeSpent ?? 0}`,
        });
        return savedAnswer;
    }
    async completeExercise(userId, userExerciseId) {
        const userExercise = await this.userExerciseRepository.findOne({
            where: { id: userExerciseId, userId },
        });
        if (!userExercise) {
            throw new common_1.NotFoundException('User exercise not found');
        }
        userExercise.status = user_exercise_entity_1.UserExerciseStatus.COMPLETED;
        userExercise.completedAt = new Date();
        return this.userExerciseRepository.save(userExercise);
    }
    async getUserErrors(userId, phase) {
        const query = this.userErrorRepository
            .createQueryBuilder('error')
            .where('error.userId = :userId', { userId });
        if (phase !== undefined) {
            query.andWhere('error.phase <= :phase', { phase });
        }
        return query.orderBy('error.createdAt', 'DESC').getMany();
    }
    async getExerciseResult(userId, userExerciseId) {
        const userExercise = await this.userExerciseRepository.findOne({
            where: { id: userExerciseId, userId },
            relations: [
                'exercise',
                'userAnswers',
                'userAnswers.question',
                'userAnswers.errors',
            ],
        });
        if (!userExercise) {
            throw new common_1.NotFoundException('User exercise not found');
        }
        const feedbackData = userExercise.userAnswers.map((a) => ({
            question: a.question?.content ?? '',
            studentAnswer: a.selectedOptions?.join(', ') || a.textAnswer || '',
            isCorrect: a.isCorrect,
            errorType: a.errors?.[0]?.errorType ?? undefined,
        }));
        const aiFeedback = await this.aiService.generateFinalFeedback(feedbackData);
        return {
            ...userExercise,
            aiFeedback,
        };
    }
    async getUserProgress(userId) {
        const exercises = await this.userExerciseRepository.find({
            where: { userId },
            relations: ['exercise'],
            order: { startedAt: 'ASC' },
        });
        const errors = await this.getUserErrors(userId);
        return {
            totalExercises: exercises.length,
            completedExercises: exercises.filter((e) => e.status === user_exercise_entity_1.UserExerciseStatus.COMPLETED).length,
            totalScore: exercises.reduce((sum, e) => sum + e.score, 0),
            totalErrors: errors.length,
            currentPhase: exercises.length > 0
                ? Math.max(...exercises.map((e) => e.phase))
                : 0,
            exercises,
            recentErrors: errors.slice(0, 5),
        };
    }
};
exports.UserProgressService = UserProgressService;
exports.UserProgressService = UserProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_exercise_entity_1.UserExercise)),
    __param(1, (0, typeorm_1.InjectRepository)(user_answer_entity_1.UserAnswer)),
    __param(2, (0, typeorm_1.InjectRepository)(user_error_entity_1.UserError)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => exercise_pool_service_1.ExercisePoolService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        exercises_service_1.ExercisesService,
        ai_service_1.AiService,
        exercise_pool_service_1.ExercisePoolService])
], UserProgressService);
//# sourceMappingURL=user-progress.service.js.map