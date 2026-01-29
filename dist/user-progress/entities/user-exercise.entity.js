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
exports.UserExercise = exports.LearningPhase = exports.UserExerciseStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const exercise_entity_1 = require("../../exercises/entities/exercise.entity");
const user_answer_entity_1 = require("./user-answer.entity");
var UserExerciseStatus;
(function (UserExerciseStatus) {
    UserExerciseStatus["IN_PROGRESS"] = "IN_PROGRESS";
    UserExerciseStatus["COMPLETED"] = "COMPLETED";
})(UserExerciseStatus || (exports.UserExerciseStatus = UserExerciseStatus = {}));
var LearningPhase;
(function (LearningPhase) {
    LearningPhase[LearningPhase["WARM_UP"] = 1] = "WARM_UP";
    LearningPhase[LearningPhase["PRACTICE"] = 2] = "PRACTICE";
    LearningPhase[LearningPhase["APPLICATION"] = 3] = "APPLICATION";
})(LearningPhase || (exports.LearningPhase = LearningPhase = {}));
let UserExercise = class UserExercise {
    id;
    userId;
    user;
    exerciseId;
    exercise;
    phase;
    score;
    timeSpent;
    status;
    startedAt;
    completedAt;
    userAnswers;
};
exports.UserExercise = UserExercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserExercise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserExercise.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.userExercises),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserExercise.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserExercise.prototype, "exerciseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exercise_entity_1.Exercise, (e) => e.userExercises),
    (0, typeorm_1.JoinColumn)({ name: 'exerciseId' }),
    __metadata("design:type", exercise_entity_1.Exercise)
], UserExercise.prototype, "exercise", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: LearningPhase.WARM_UP }),
    __metadata("design:type", Number)
], UserExercise.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserExercise.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserExercise.prototype, "timeSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserExerciseStatus,
        default: UserExerciseStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], UserExercise.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserExercise.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserExercise.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_answer_entity_1.UserAnswer, (ua) => ua.userExercise, { cascade: true }),
    __metadata("design:type", Array)
], UserExercise.prototype, "userAnswers", void 0);
exports.UserExercise = UserExercise = __decorate([
    (0, typeorm_1.Entity)('user_exercises')
], UserExercise);
//# sourceMappingURL=user-exercise.entity.js.map