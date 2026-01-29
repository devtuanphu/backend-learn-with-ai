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
exports.UserAnswer = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const user_exercise_entity_1 = require("./user-exercise.entity");
const question_entity_1 = require("../../exercises/entities/question.entity");
const user_error_entity_1 = require("./user-error.entity");
let UserAnswer = class UserAnswer {
    id;
    userId;
    user;
    userExerciseId;
    userExercise;
    questionId;
    question;
    selectedOptions;
    textAnswer;
    isCorrect;
    earnedPoints;
    timeSpent;
    answeredAt;
    errors;
};
exports.UserAnswer = UserAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAnswer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.userAnswers),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserAnswer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAnswer.prototype, "userExerciseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_exercise_entity_1.UserExercise, (ue) => ue.userAnswers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userExerciseId' }),
    __metadata("design:type", user_exercise_entity_1.UserExercise)
], UserAnswer.prototype, "userExercise", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAnswer.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (q) => q.userAnswers),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], UserAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], UserAnswer.prototype, "selectedOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserAnswer.prototype, "textAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserAnswer.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserAnswer.prototype, "earnedPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserAnswer.prototype, "timeSpent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserAnswer.prototype, "answeredAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_error_entity_1.UserError, (ue) => ue.userAnswer, { cascade: true }),
    __metadata("design:type", Array)
], UserAnswer.prototype, "errors", void 0);
exports.UserAnswer = UserAnswer = __decorate([
    (0, typeorm_1.Entity)('user_answers')
], UserAnswer);
//# sourceMappingURL=user-answer.entity.js.map