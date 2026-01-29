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
exports.LearningPathController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const learning_path_service_1 = require("./learning-path.service");
let LearningPathController = class LearningPathController {
    learningPathService;
    constructor(learningPathService) {
        this.learningPathService = learningPathService;
    }
    async startPractice(req) {
        return this.learningPathService.startPracticePhase(req.user.id);
    }
    async startApplication(req) {
        return this.learningPathService.startApplicationPhase(req.user.id);
    }
    async chat(req, sessionId, body) {
        return this.learningPathService.chat(req.user.id, sessionId, body.message);
    }
    async getMessages(req, sessionId) {
        return this.learningPathService.getSessionMessages(req.user.id, sessionId);
    }
    async completeSession(req, sessionId) {
        return this.learningPathService.completeSession(req.user.id, sessionId);
    }
};
exports.LearningPathController = LearningPathController;
__decorate([
    (0, common_1.Post)('start-practice'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearningPathController.prototype, "startPractice", null);
__decorate([
    (0, common_1.Post)('start-application'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearningPathController.prototype, "startApplication", null);
__decorate([
    (0, common_1.Post)('chat/:sessionId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], LearningPathController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('session/:sessionId/messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearningPathController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('session/:sessionId/complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearningPathController.prototype, "completeSession", null);
exports.LearningPathController = LearningPathController = __decorate([
    (0, common_1.Controller)('learning'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [learning_path_service_1.LearningPathService])
], LearningPathController);
//# sourceMappingURL=learning-path.controller.js.map