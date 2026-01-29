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
exports.ReadyExercise = exports.ERROR_PATTERNS = exports.ReadyExerciseType = exports.ReadyExerciseStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
var ReadyExerciseStatus;
(function (ReadyExerciseStatus) {
    ReadyExerciseStatus["READY"] = "READY";
    ReadyExerciseStatus["USED"] = "USED";
})(ReadyExerciseStatus || (exports.ReadyExerciseStatus = ReadyExerciseStatus = {}));
var ReadyExerciseType;
(function (ReadyExerciseType) {
    ReadyExerciseType["BASIC"] = "BASIC";
    ReadyExerciseType["APPLICATION"] = "APPLICATION";
    ReadyExerciseType["PROBLEM_SOLVING"] = "PROBLEM_SOLVING";
})(ReadyExerciseType || (exports.ReadyExerciseType = ReadyExerciseType = {}));
exports.ERROR_PATTERNS = [
    'decimal_placement',
    'multiplication_error',
    'division_error',
    'misunderstanding',
    'calculation_error',
    'unit_conversion',
];
let ReadyExercise = class ReadyExercise {
    id;
    phase;
    exerciseType;
    topic;
    errorPatterns;
    scenario;
    questions;
    status;
    usedByUserId;
    usedByUser;
    createdAt;
    usedAt;
};
exports.ReadyExercise = ReadyExercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReadyExercise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ReadyExercise.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReadyExerciseType,
        default: ReadyExerciseType.BASIC,
    }),
    __metadata("design:type", String)
], ReadyExercise.prototype, "exerciseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'decimal_multiplication' }),
    __metadata("design:type", String)
], ReadyExercise.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], ReadyExercise.prototype, "errorPatterns", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ReadyExercise.prototype, "scenario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], ReadyExercise.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReadyExerciseStatus,
        default: ReadyExerciseStatus.READY,
    }),
    __metadata("design:type", String)
], ReadyExercise.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReadyExercise.prototype, "usedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'usedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], ReadyExercise.prototype, "usedByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReadyExercise.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ReadyExercise.prototype, "usedAt", void 0);
exports.ReadyExercise = ReadyExercise = __decorate([
    (0, typeorm_1.Entity)('ready_exercises')
], ReadyExercise);
//# sourceMappingURL=ready-exercise.entity.js.map