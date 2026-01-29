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
exports.ChatMessage = exports.PromptType = exports.MessageRole = void 0;
const typeorm_1 = require("typeorm");
const learning_session_entity_1 = require("./learning-session.entity");
var MessageRole;
(function (MessageRole) {
    MessageRole["USER"] = "USER";
    MessageRole["AI"] = "AI";
})(MessageRole || (exports.MessageRole = MessageRole = {}));
var PromptType;
(function (PromptType) {
    PromptType["SCAFFOLDING_1"] = "SCAFFOLDING_1";
    PromptType["SCAFFOLDING_2"] = "SCAFFOLDING_2";
    PromptType["SCAFFOLDING_3"] = "SCAFFOLDING_3";
    PromptType["SCAFFOLDING_4"] = "SCAFFOLDING_4";
    PromptType["FEEDBACK"] = "FEEDBACK";
    PromptType["ENCOURAGEMENT"] = "ENCOURAGEMENT";
    PromptType["GENERAL"] = "GENERAL";
})(PromptType || (exports.PromptType = PromptType = {}));
let ChatMessage = class ChatMessage {
    id;
    sessionId;
    session;
    role;
    content;
    promptType;
    emotion;
    createdAt;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => learning_session_entity_1.LearningSession, (ls) => ls.messages, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sessionId' }),
    __metadata("design:type", learning_session_entity_1.LearningSession)
], ChatMessage.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MessageRole }),
    __metadata("design:type", String)
], ChatMessage.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PromptType, default: PromptType.GENERAL }),
    __metadata("design:type", String)
], ChatMessage.prototype, "promptType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], ChatMessage.prototype, "emotion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)('chat_messages')
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map