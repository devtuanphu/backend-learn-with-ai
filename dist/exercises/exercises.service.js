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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_entity_1 = require("./entities/exercise.entity");
const question_entity_1 = require("./entities/question.entity");
const question_option_entity_1 = require("./entities/question-option.entity");
let ExercisesService = class ExercisesService {
    exerciseRepository;
    questionRepository;
    optionRepository;
    constructor(exerciseRepository, questionRepository, optionRepository) {
        this.exerciseRepository = exerciseRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }
    async getTemplateExercises(topic) {
        const query = this.exerciseRepository
            .createQueryBuilder('exercise')
            .leftJoinAndSelect('exercise.questions', 'questions')
            .leftJoinAndSelect('questions.options', 'options')
            .where('exercise.isTemplate = :isTemplate', { isTemplate: true })
            .orderBy('exercise.type', 'ASC')
            .addOrderBy('questions.orderIndex', 'ASC');
        if (topic) {
            query.andWhere('exercise.topic = :topic', { topic });
        }
        return query.getMany();
    }
    async getExerciseById(id) {
        const exercise = await this.exerciseRepository.findOne({
            where: { id },
            relations: ['questions', 'questions.options'],
        });
        if (!exercise) {
            throw new common_1.NotFoundException('Bài tập không tồn tại');
        }
        return exercise;
    }
    async createExercise(data) {
        const exercise = this.exerciseRepository.create({
            type: data.type,
            topic: data.topic,
            scenario: data.scenario,
            timeLimit: data.timeLimit ?? 90,
            bonusTime: data.bonusTime ?? 30,
            isTemplate: data.isTemplate ?? false,
            generatedFromId: data.generatedFromId,
        });
        const savedExercise = await this.exerciseRepository.save(exercise);
        for (let i = 0; i < data.questions.length; i++) {
            const qData = data.questions[i];
            const question = this.questionRepository.create({
                exerciseId: savedExercise.id,
                orderIndex: i + 1,
                content: qData.content,
                type: qData.type ?? question_entity_1.QuestionType.SINGLE,
                correctPoints: qData.correctPoints ?? 12,
                wrongPoints: qData.wrongPoints ?? 2,
                bonusPoints: qData.bonusPoints ?? 4,
                aiRecognitionRules: qData.aiRecognitionRules,
            });
            const savedQuestion = await this.questionRepository.save(question);
            if (qData.options) {
                for (const optData of qData.options) {
                    const option = this.optionRepository.create({
                        questionId: savedQuestion.id,
                        content: optData.content,
                        isCorrect: optData.isCorrect,
                        errorType: optData.errorType,
                        errorDescription: optData.errorDescription,
                    });
                    await this.optionRepository.save(option);
                }
            }
        }
        return this.getExerciseById(savedExercise.id);
    }
    async getExercisesByType(type) {
        return this.exerciseRepository.find({
            where: { type, isTemplate: true },
            relations: ['questions', 'questions.options'],
        });
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_entity_1.Exercise)),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(question_option_entity_1.QuestionOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map