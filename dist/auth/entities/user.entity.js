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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const user_exercise_entity_1 = require("../../user-progress/entities/user-exercise.entity");
const user_answer_entity_1 = require("../../user-progress/entities/user-answer.entity");
const user_error_entity_1 = require("../../user-progress/entities/user-error.entity");
const learning_session_entity_1 = require("../../learning-path/entities/learning-session.entity");
let User = class User {
    id;
    email;
    password;
    name;
    createdAt;
    userExercises;
    userAnswers;
    userErrors;
    learningSessions;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_exercise_entity_1.UserExercise, (ue) => ue.user),
    __metadata("design:type", Array)
], User.prototype, "userExercises", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_answer_entity_1.UserAnswer, (ua) => ua.user),
    __metadata("design:type", Array)
], User.prototype, "userAnswers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_error_entity_1.UserError, (ue) => ue.user),
    __metadata("design:type", Array)
], User.prototype, "userErrors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => learning_session_entity_1.LearningSession, (ls) => ls.user),
    __metadata("design:type", Array)
], User.prototype, "learningSessions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map