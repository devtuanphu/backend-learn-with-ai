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
exports.ExercisesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const exercises_service_1 = require("./exercises.service");
const exercise_entity_1 = require("./entities/exercise.entity");
let ExercisesController = class ExercisesController {
    exercisesService;
    constructor(exercisesService) {
        this.exercisesService = exercisesService;
    }
    async getTemplates(topic) {
        return this.exercisesService.getTemplateExercises(topic);
    }
    async getByType(type) {
        return this.exercisesService.getExercisesByType(type);
    }
    async getById(id) {
        return this.exercisesService.getExerciseById(id);
    }
};
exports.ExercisesController = ExercisesController;
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Query)('topic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('by-type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getById", null);
exports.ExercisesController = ExercisesController = __decorate([
    (0, common_1.Controller)('exercises'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], ExercisesController);
//# sourceMappingURL=exercises.controller.js.map