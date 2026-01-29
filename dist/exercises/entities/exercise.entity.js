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
exports.Exercise = exports.ExerciseType = void 0;
const typeorm_1 = require("typeorm");
const question_entity_1 = require("./question.entity");
const user_exercise_entity_1 = require("../../user-progress/entities/user-exercise.entity");
var ExerciseType;
(function (ExerciseType) {
    ExerciseType["BASIC"] = "BASIC";
    ExerciseType["APPLICATION"] = "APPLICATION";
    ExerciseType["PROBLEM_SOLVING"] = "PROBLEM_SOLVING";
})(ExerciseType || (exports.ExerciseType = ExerciseType = {}));
let Exercise = class Exercise {
    id;
    type;
    topic;
    scenario;
    timeLimit;
    bonusTime;
    isTemplate;
    generatedFromId;
    generatedFrom;
    questions;
    userExercises;
};
exports.Exercise = Exercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Exercise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ExerciseType }),
    __metadata("design:type", String)
], Exercise.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exercise.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Exercise.prototype, "scenario", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 90 }),
    __metadata("design:type", Number)
], Exercise.prototype, "timeLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 30 }),
    __metadata("design:type", Number)
], Exercise.prototype, "bonusTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Exercise.prototype, "isTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Exercise.prototype, "generatedFromId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Exercise, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'generatedFromId' }),
    __metadata("design:type", Exercise)
], Exercise.prototype, "generatedFrom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, (q) => q.exercise, { cascade: true }),
    __metadata("design:type", Array)
], Exercise.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_exercise_entity_1.UserExercise, (ue) => ue.exercise),
    __metadata("design:type", Array)
], Exercise.prototype, "userExercises", void 0);
exports.Exercise = Exercise = __decorate([
    (0, typeorm_1.Entity)('exercises')
], Exercise);
//# sourceMappingURL=exercise.entity.js.map