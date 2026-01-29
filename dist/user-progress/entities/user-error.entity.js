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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const user_answer_entity_1 = require("./user-answer.entity");
let UserError = class UserError {
    id;
    userId;
    user;
    userAnswerId;
    userAnswer;
    errorType;
    errorDescription;
    aiAnalysis;
    phase;
    createdAt;
};
exports.UserError = UserError;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserError.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserError.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.userErrors),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserError.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserError.prototype, "userAnswerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_answer_entity_1.UserAnswer, (ua) => ua.errors, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userAnswerId' }),
    __metadata("design:type", user_answer_entity_1.UserAnswer)
], UserError.prototype, "userAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserError.prototype, "errorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], UserError.prototype, "errorDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserError.prototype, "aiAnalysis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], UserError.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserError.prototype, "createdAt", void 0);
exports.UserError = UserError = __decorate([
    (0, typeorm_1.Entity)('user_errors')
], UserError);
//# sourceMappingURL=user-error.entity.js.map