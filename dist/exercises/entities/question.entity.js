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
exports.Question = exports.QuestionType = void 0;
const typeorm_1 = require("typeorm");
const exercise_entity_1 = require("./exercise.entity");
const question_option_entity_1 = require("./question-option.entity");
const user_answer_entity_1 = require("../../user-progress/entities/user-answer.entity");
var QuestionType;
(function (QuestionType) {
    QuestionType["SINGLE"] = "SINGLE";
    QuestionType["MULTIPLE"] = "MULTIPLE";
    QuestionType["TEXT"] = "TEXT";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
let Question = class Question {
    id;
    exerciseId;
    exercise;
    orderIndex;
    content;
    type;
    correctPoints;
    wrongPoints;
    bonusPoints;
    aiRecognitionRules;
    options;
    userAnswers;
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Question.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Question.prototype, "exerciseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exercise_entity_1.Exercise, (e) => e.questions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'exerciseId' }),
    __metadata("design:type", exercise_entity_1.Exercise)
], Question.prototype, "exercise", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Question.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Question.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuestionType, default: QuestionType.SINGLE }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 12 }),
    __metadata("design:type", Number)
], Question.prototype, "correctPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 2 }),
    __metadata("design:type", Number)
], Question.prototype, "wrongPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4 }),
    __metadata("design:type", Number)
], Question.prototype, "bonusPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Question.prototype, "aiRecognitionRules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_option_entity_1.QuestionOption, (o) => o.question, { cascade: true }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_answer_entity_1.UserAnswer, (ua) => ua.question),
    __metadata("design:type", Array)
], Question.prototype, "userAnswers", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)('questions')
], Question);
//# sourceMappingURL=question.entity.js.map