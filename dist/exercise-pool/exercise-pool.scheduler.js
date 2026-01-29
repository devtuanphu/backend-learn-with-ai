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
var ExercisePoolScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisePoolScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const exercise_pool_service_1 = require("./exercise-pool.service");
let ExercisePoolScheduler = ExercisePoolScheduler_1 = class ExercisePoolScheduler {
    poolService;
    logger = new common_1.Logger(ExercisePoolScheduler_1.name);
    isRunning = false;
    constructor(poolService) {
        this.poolService = poolService;
    }
    async onModuleInit() {
        this.logger.log('🚀 ExercisePoolScheduler initialized');
        this.logger.log('Checking initial pool status...');
        try {
            const stats = await this.poolService.getPoolStats();
            this.logger.log(`Initial pool stats: ${JSON.stringify(stats)}`);
            if (stats.total === 0) {
                this.logger.log('📦 Pool is empty, starting initial generation (this may take a few minutes)...');
                await this.maintainPool();
            }
        }
        catch (error) {
            this.logger.error('Error during initial pool check', error);
        }
    }
    async handleCron() {
        if (this.isRunning) {
            this.logger.log('Previous job still running, skipping...');
            return;
        }
        this.logger.log('⏰ Cron job triggered: maintaining exercise pool...');
        await this.maintainPool();
    }
    async maintainPool() {
        this.isRunning = true;
        try {
            await this.poolService.maintainPool();
            const stats = await this.poolService.getPoolStats();
            this.logger.log(`✅ Pool maintenance complete. Stats: ${JSON.stringify(stats)}`);
        }
        catch (error) {
            this.logger.error('❌ Error during pool maintenance', error);
        }
        finally {
            this.isRunning = false;
        }
    }
    async triggerGeneration(phase, count = 1, errorPattern) {
        this.logger.log(`Manual trigger: Phase ${phase}, count=${count}, pattern=${errorPattern}`);
        for (let i = 0; i < count; i++) {
            if (phase === 1) {
                await this.poolService.generatePhase1Exercise();
            }
            else if (phase === 2 && errorPattern) {
                await this.poolService.generatePhase2Exercise(errorPattern);
            }
            else if (phase === 3 && errorPattern) {
                await this.poolService.generatePhase3Exercise([errorPattern]);
            }
        }
    }
};
exports.ExercisePoolScheduler = ExercisePoolScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExercisePoolScheduler.prototype, "handleCron", null);
exports.ExercisePoolScheduler = ExercisePoolScheduler = ExercisePoolScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [exercise_pool_service_1.ExercisePoolService])
], ExercisePoolScheduler);
//# sourceMappingURL=exercise-pool.scheduler.js.map