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
exports.QuestionOption = void 0;
const typeorm_1 = require("typeorm");
const question_entity_1 = require("./question.entity");
let QuestionOption = class QuestionOption {
    id;
    questionId;
    question;
    content;
    isCorrect;
    errorType;
    errorDescription;
};
exports.QuestionOption = QuestionOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionOption.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (q) => q.options, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], QuestionOption.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], QuestionOption.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], QuestionOption.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuestionOption.prototype, "errorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuestionOption.prototype, "errorDescription", void 0);
exports.QuestionOption = QuestionOption = __decorate([
    (0, typeorm_1.Entity)('question_options')
], QuestionOption);
//# sourceMappingURL=question-option.entity.js.map