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
var ExercisePoolService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisePoolService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ready_exercise_entity_1 = require("./entities/ready-exercise.entity");
const ai_service_1 = require("../ai/ai.service");
const exercises_service_1 = require("../exercises/exercises.service");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
let ExercisePoolService = ExercisePoolService_1 = class ExercisePoolService {
    readyExerciseRepository;
    aiService;
    exercisesService;
    logger = new common_1.Logger(ExercisePoolService_1.name);
    PHASE1_TARGET = 20;
    PHASE2_TARGET_PER_ERROR = 10;
    PHASE3_TARGET_PER_ERROR = 10;
    constructor(readyExerciseRepository, aiService, exercisesService) {
        this.readyExerciseRepository = readyExerciseRepository;
        this.aiService = aiService;
        this.exercisesService = exercisesService;
    }
    async getPhase1Exercise(userId) {
        const exercise = await this.readyExerciseRepository.findOne({
            where: {
                phase: 1,
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            },
            order: { createdAt: 'ASC' },
        });
        if (exercise) {
            await this.assignToUser(exercise.id, userId);
            return this.readyExerciseRepository.findOne({
                where: { id: exercise.id },
            });
        }
        return null;
    }
    async getExerciseByErrors(phase, errorPatterns, userId) {
        const exercise = await this.readyExerciseRepository
            .createQueryBuilder('ready')
            .where('ready.phase = :phase', { phase })
            .andWhere('ready.status = :status', {
            status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
        })
            .andWhere('ready.errorPatterns && :patterns', {
            patterns: errorPatterns,
        })
            .orderBy('ready.createdAt', 'ASC')
            .getOne();
        if (exercise) {
            await this.assignToUser(exercise.id, userId);
            return this.readyExerciseRepository.findOne({
                where: { id: exercise.id },
            });
        }
        return null;
    }
    async assignToUser(exerciseId, userId) {
        await this.readyExerciseRepository.update(exerciseId, {
            status: ready_exercise_entity_1.ReadyExerciseStatus.USED,
            usedByUserId: userId,
            usedAt: new Date(),
        });
        this.logger.log(`Assigned exercise ${exerciseId} to user ${userId}`);
    }
    async generatePhase1Exercise() {
        try {
            const templates = await this.exercisesService.getExercisesByType(exercise_entity_1.ExerciseType.BASIC);
            if (templates.length === 0) {
                this.logger.warn('No BASIC templates found');
                return null;
            }
            const template = templates[Math.floor(Math.random() * templates.length)];
            const generated = await this.aiService.generateExerciseFromTemplate(template);
            const readyExercise = this.readyExerciseRepository.create({
                phase: 1,
                exerciseType: ready_exercise_entity_1.ReadyExerciseType.BASIC,
                topic: template.topic,
                scenario: generated.scenario,
                questions: generated.questions,
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            });
            const saved = await this.readyExerciseRepository.save(readyExercise);
            this.logger.log(`✅ Generated Phase 1 exercise: ${saved.id}`);
            return saved;
        }
        catch (error) {
            this.logger.error('Error generating Phase 1 exercise', error);
            return null;
        }
    }
    async generatePhase2Exercise(errorPattern) {
        try {
            const mockErrors = [
                {
                    id: 'mock',
                    userId: 'system',
                    errorType: errorPattern,
                    errorDescription: this.getErrorDescription(errorPattern),
                    phase: 1,
                    createdAt: new Date(),
                },
            ];
            const generated = await this.aiService.generateErrorBasedExercise(mockErrors, 'APPLICATION');
            const readyExercise = this.readyExerciseRepository.create({
                phase: 2,
                exerciseType: ready_exercise_entity_1.ReadyExerciseType.APPLICATION,
                topic: 'decimal_operations',
                errorPatterns: [errorPattern],
                scenario: generated.scenario,
                questions: generated.questions,
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            });
            const saved = await this.readyExerciseRepository.save(readyExercise);
            this.logger.log(`✅ Generated Phase 2 exercise for ${errorPattern}: ${saved.id}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`Error generating Phase 2 exercise for ${errorPattern}`, error);
            return null;
        }
    }
    async generatePhase3Exercise(errorPatterns) {
        try {
            const mockErrors = errorPatterns.map((pattern) => ({
                id: 'mock',
                userId: 'system',
                errorType: pattern,
                errorDescription: this.getErrorDescription(pattern),
                phase: 2,
                createdAt: new Date(),
            }));
            const generated = await this.aiService.generateErrorBasedExercise(mockErrors, 'COMPREHENSIVE');
            const readyExercise = this.readyExerciseRepository.create({
                phase: 3,
                exerciseType: ready_exercise_entity_1.ReadyExerciseType.PROBLEM_SOLVING,
                topic: 'decimal_comprehensive',
                errorPatterns: errorPatterns,
                scenario: generated.scenario,
                questions: generated.questions,
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            });
            const saved = await this.readyExerciseRepository.save(readyExercise);
            this.logger.log(`✅ Generated Phase 3 exercise for ${errorPatterns.join(', ')}: ${saved.id}`);
            return saved;
        }
        catch (error) {
            this.logger.error('Error generating Phase 3 exercise', error);
            return null;
        }
    }
    async getPoolStats() {
        const phase1Count = await this.readyExerciseRepository.count({
            where: { phase: 1, status: ready_exercise_entity_1.ReadyExerciseStatus.READY },
        });
        const phase2Stats = {};
        const phase3Stats = {};
        for (const pattern of ready_exercise_entity_1.ERROR_PATTERNS) {
            phase2Stats[pattern] = await this.readyExerciseRepository
                .createQueryBuilder('ready')
                .where('ready.phase = 2')
                .andWhere('ready.status = :status', {
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            })
                .andWhere(':pattern = ANY(ready.errorPatterns)', { pattern })
                .getCount();
            phase3Stats[pattern] = await this.readyExerciseRepository
                .createQueryBuilder('ready')
                .where('ready.phase = 3')
                .andWhere('ready.status = :status', {
                status: ready_exercise_entity_1.ReadyExerciseStatus.READY,
            })
                .andWhere(':pattern = ANY(ready.errorPatterns)', { pattern })
                .getCount();
        }
        return {
            phase1: phase1Count,
            phase2: phase2Stats,
            phase3: phase3Stats,
            total: phase1Count +
                Object.values(phase2Stats).reduce((a, b) => a + b, 0) +
                Object.values(phase3Stats).reduce((a, b) => a + b, 0),
        };
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async maintainPool() {
        const stats = await this.getPoolStats();
        this.logger.log(`Pool stats: ${JSON.stringify(stats)}`);
        const DELAY_MS = 5000;
        const MAX_REQUESTS_PER_CYCLE = 10;
        let requestCount = 0;
        if (stats.phase1 < this.PHASE1_TARGET &&
            requestCount < MAX_REQUESTS_PER_CYCLE) {
            const needed = Math.min(this.PHASE1_TARGET - stats.phase1, 2, MAX_REQUESTS_PER_CYCLE - requestCount);
            this.logger.log(`Phase 1 needs ${this.PHASE1_TARGET - stats.phase1} more, generating ${needed}`);
            for (let i = 0; i < needed; i++) {
                await this.generatePhase1Exercise();
                requestCount++;
                if (requestCount < MAX_REQUESTS_PER_CYCLE) {
                    await this.delay(DELAY_MS);
                }
            }
        }
        for (const pattern of ready_exercise_entity_1.ERROR_PATTERNS) {
            if (requestCount >= MAX_REQUESTS_PER_CYCLE)
                break;
            if (stats.phase2[pattern] < this.PHASE2_TARGET_PER_ERROR) {
                const needed = Math.min(this.PHASE2_TARGET_PER_ERROR - stats.phase2[pattern], 1, MAX_REQUESTS_PER_CYCLE - requestCount);
                this.logger.log(`Phase 2 [${pattern}] needs ${this.PHASE2_TARGET_PER_ERROR - stats.phase2[pattern]} more, generating ${needed}`);
                for (let i = 0; i < needed; i++) {
                    await this.generatePhase2Exercise(pattern);
                    requestCount++;
                    if (requestCount < MAX_REQUESTS_PER_CYCLE) {
                        await this.delay(DELAY_MS);
                    }
                }
            }
        }
        const commonCombos = [
            ['decimal_placement', 'multiplication_error'],
            ['calculation_error', 'division_error'],
            ['misunderstanding', 'unit_conversion'],
        ];
        for (const combo of commonCombos) {
            if (requestCount >= MAX_REQUESTS_PER_CYCLE)
                break;
            const key = combo.join('_');
            if ((stats.phase3[combo[0]] || 0) < this.PHASE3_TARGET_PER_ERROR) {
                this.logger.log(`Phase 3 [${key}] needs more exercises`);
                await this.generatePhase3Exercise(combo);
                requestCount++;
                if (requestCount < MAX_REQUESTS_PER_CYCLE) {
                    await this.delay(DELAY_MS);
                }
            }
        }
        this.logger.log(`Maintenance cycle completed with ${requestCount} API calls`);
    }
    getErrorDescription(pattern) {
        const descriptions = {
            decimal_placement: 'Học sinh đặt sai vị trí dấu phẩy thập phân',
            multiplication_error: 'Học sinh tính sai phép nhân',
            division_error: 'Học sinh tính sai phép chia',
            misunderstanding: 'Học sinh hiểu sai yêu cầu đề bài',
            calculation_error: 'Học sinh mắc lỗi tính toán chung',
            unit_conversion: 'Học sinh đổi sai đơn vị đo lường',
        };
        return descriptions[pattern] || 'Lỗi chung';
    }
};
exports.ExercisePoolService = ExercisePoolService;
exports.ExercisePoolService = ExercisePoolService = ExercisePoolService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ready_exercise_entity_1.ReadyExercise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ai_service_1.AiService,
        exercises_service_1.ExercisesService])
], ExercisePoolService);
//# sourceMappingURL=exercise-pool.service.js.map