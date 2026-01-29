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
exports.UserProgressController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_progress_service_1 = require("./user-progress.service");
let UserProgressController = class UserProgressController {
    userProgressService;
    constructor(userProgressService) {
        this.userProgressService = userProgressService;
    }
    async startWarmUp(req) {
        return this.userProgressService.startWarmUpPhase(req.user.id);
    }
    async submitAnswer(req, body) {
        return this.userProgressService.submitAnswer(req.user.id, body.userExerciseId, body.questionId, body.selectedOptionIds, body.textAnswer, body.timeSpent);
    }
    async completeExercise(req, userExerciseId) {
        return this.userProgressService.completeExercise(req.user.id, userExerciseId);
    }
    async getResult(req, userExerciseId) {
        return this.userProgressService.getExerciseResult(req.user.id, userExerciseId);
    }
    async getOverview(req) {
        return this.userProgressService.getUserProgress(req.user.id);
    }
    async getErrors(req) {
        return this.userProgressService.getUserErrors(req.user.id);
    }
};
exports.UserProgressController = UserProgressController;
__decorate([
    (0, common_1.Post)('start-warmup'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "startWarmUp", null);
__decorate([
    (0, common_1.Post)('submit-answer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('complete/:userExerciseId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userExerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "completeExercise", null);
__decorate([
    (0, common_1.Get)('result/:userExerciseId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userExerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "getResult", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('errors'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProgressController.prototype, "getErrors", null);
exports.UserProgressController = UserProgressController = __decorate([
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [user_progress_service_1.UserProgressService])
], UserProgressController);
//# sourceMappingURL=user-progress.controller.js.map