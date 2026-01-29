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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const exercise_entity_1 = require("../exercises/entities/exercise.entity");
let AiService = AiService_1 = class AiService {
    configService;
    logger = new common_1.Logger(AiService_1.name);
    genAI;
    model;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-lite',
            });
            this.logger.log('Google Gemini configured with model: gemini-2.0-flash');
        }
        else {
            this.logger.warn('GEMINI_API_KEY không được cấu hình');
        }
    }
    formatQuestionForPrompt(q, i) {
        const optionsStr = q.options
            ?.map((o) => `${o.content} (${o.isCorrect ? 'Đúng' : 'Sai - ' + o.errorType})`)
            .join(', ') || '';
        return `${i + 1}. ${q.content}\nĐáp án: ${optionsStr}`;
    }
    async generateExerciseFromTemplate(template) {
        const questions = template.questions || [];
        const numQuestions = questions.length;
        const difficultyMap = {
            [exercise_entity_1.ExerciseType.BASIC]: 'Cơ bản - phép tính đơn giản, số liệu dễ',
            [exercise_entity_1.ExerciseType.APPLICATION]: 'Vận dụng - áp dụng vào tình huống thực tế',
            [exercise_entity_1.ExerciseType.PROBLEM_SOLVING]: 'Giải quyết vấn đề - phân tích nhiều bước',
        };
        const prompt = `Bạn là giáo viên toán tiểu học sáng tạo. Hãy tạo 1 BÀI TẬP TOÁN LỚP 5 VỀ PHÉP NHÂN SỐ THẬP PHÂN.

🎯 YÊU CẦU:
- Độ khó: ${difficultyMap[template.type] || 'Vừa phải'}
- Số câu hỏi: ${numQuestions}
- Chủ đề: Phép nhân số thập phân (VD: 2,5 × 3 = ?; 0,4 × 1,2 = ?)

🌟 HÃY TỰ DO SÁNG TẠO:
- Nghĩ ra BẤT KỲ ngữ cảnh nào hấp dẫn, gần gũi với học sinh lớp 5
- Đặt tên nhân vật tự nhiên (An, Bình, Minh, Hoa, Mai, Nam...)
- Sử dụng số thập phân thực tế

📋 MỖI CÂU HỎI GỒM 4 ĐÁP ÁN (1 đúng, 3 sai):
- Đáp án sai phải có LỖI CỤ THỂ
- Ghi rõ errorType: "decimal_placement" | "calculation_error" | "misunderstanding" | "multiplication_error" | "division_error"
- Ghi rõ errorDescription giải thích lỗi

📋 TRẢ VỀ JSON:
{
  "scenario": "Tình huống thú vị, sinh động (2-3 câu)",
  "questions": [
    {
      "content": "Câu hỏi rõ ràng",
      "options": [
        { "content": "Đáp án", "isCorrect": true },
        { "content": "Đáp án sai", "isCorrect": false, "errorType": "...", "errorDescription": "..." },
        { "content": "Đáp án sai", "isCorrect": false, "errorType": "...", "errorDescription": "..." },
        { "content": "Đáp án sai", "isCorrect": false, "errorType": "...", "errorDescription": "..." }
      ]
    }
  ]
}

⚠️ CHỈ TRẢ VỀ JSON THUẦN TÚY.`;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid JSON response');
        }
        catch (error) {
            this.logger.error('Error generating exercise', error);
            throw error;
        }
    }
    async evaluateAnswer(questionContent, correctAnswer, studentAnswer, errorTypes) {
        const prompt = `Đánh giá câu trả lời của học sinh lớp 5 Việt Nam.

Câu hỏi: ${questionContent}
Đáp án đúng: ${correctAnswer}
Học sinh trả lời: ${studentAnswer}
Các loại lỗi có thể: ${errorTypes.join(', ')}

Phân tích:
1. Đúng/Sai?
2. Nếu sai, lỗi thuộc loại nào?
3. Nhận xét khích lệ phù hợp lứa tuổi

Trả về JSON:
{
  "isCorrect": true/false,
  "errorType": "loại lỗi nếu sai",
  "errorDescription": "mô tả chi tiết lỗi",
  "feedback": "nhận xét thân thiện cho học sinh"
}

CHỈ TRẢ VỀ JSON.`;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid JSON response');
        }
        catch (error) {
            this.logger.error('Error evaluating answer', error);
            throw error;
        }
    }
    async scaffoldingChat(stepNumber, problem, studentMessage, errors, conversationHistory) {
        const stepDescriptions = {
            1: 'Bài toán cho biết gì? Yêu cầu gì?',
            2: 'Để giải quyết được vấn đề, bạn sẽ thực hiện như thế nào?',
            3: 'Hãy trình bày các lời giải của bạn nhé!',
            4: 'Kết quả này có hợp lý không? Vì sao?',
        };
        const errorSummary = errors.length > 0
            ? errors
                .map((e) => `- ${e.errorType}: ${e.errorDescription}`)
                .join('\n')
            : 'Chưa có lỗi sai được ghi nhận';
        const systemPrompt = `Bạn là Trợ lí Học tập Ảo thân thiện cho học sinh lớp 5.
Đang ở bước ${stepNumber}/4 của quy trình scaffolding:
Bước hiện tại: ${stepDescriptions[stepNumber]}

⚠️ LỖI SAI CỦA HỌC SINH TỪ LỘ TRÌNH TRƯỚC:
${errorSummary}

Bài toán hiện tại: ${problem}

🎯 ĐÁNH GIÁ CÂU TRẢ LỜI - trả về JSON:
{
  "message": "Phản hồi thân thiện cho học sinh",
  "evaluation": "correct" | "incorrect" | "partial" | "unclear",
  "emotion": "celebrating" | "encouraging" | "thinking" | "happy" | "idle"
}

Quy tắc:
- "correct" + "celebrating": Đúng hoàn toàn
- "partial" + "happy": Đúng một phần
- "incorrect" + "encouraging": Sai (KHÔNG dùng happy/celebrating)
- "unclear" + "thinking": Không rõ (KHÔNG dùng happy/celebrating)

CHỈ TRẢ VỀ JSON.`;
        try {
            const chat = this.model.startChat({
                history: [
                    { role: 'user', parts: [{ text: systemPrompt }] },
                    {
                        role: 'model',
                        parts: [
                            {
                                text: '{"message": "Tôi hiểu. Tôi sẽ hỗ trợ học sinh.", "evaluation": "unclear", "emotion": "idle"}',
                            },
                        ],
                    },
                    ...conversationHistory.map((m) => ({
                        role: m.role,
                        parts: [{ text: m.content }],
                    })),
                ],
            });
            const result = await chat.sendMessage(studentMessage);
            const responseText = result.response.text();
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    const evaluation = parsed.evaluation || 'unclear';
                    let emotion = parsed.emotion || 'idle';
                    if (evaluation === 'incorrect') {
                        if (emotion === 'happy' || emotion === 'celebrating') {
                            emotion = 'encouraging';
                        }
                    }
                    else if (evaluation === 'unclear') {
                        if (emotion === 'happy' || emotion === 'celebrating') {
                            emotion = 'thinking';
                        }
                    }
                    return {
                        message: parsed.message || responseText,
                        evaluation: evaluation,
                        emotion: emotion,
                    };
                }
            }
            catch {
                this.logger.warn('Failed to parse AI response as JSON, using fallback');
            }
            return {
                message: responseText,
                evaluation: 'unclear',
                emotion: 'idle',
            };
        }
        catch (error) {
            this.logger.error('Error in scaffolding chat', error);
            throw error;
        }
    }
    async generateErrorBasedExercise(errors, exerciseType) {
        const errorSummary = errors
            .reduce((acc, e) => {
            const existing = acc.find((x) => x.type === e.errorType);
            if (existing) {
                existing.count++;
            }
            else {
                acc.push({
                    type: e.errorType,
                    description: e.errorDescription,
                    count: 1,
                });
            }
            return acc;
        }, [])
            .map((e) => `- ${e.type}: ${e.description} (${e.count} lần)`)
            .join('\n');
        const typeDescriptions = {
            APPLICATION: 'Bài tập vận dụng, ứng dụng thực tế',
            PROBLEM_SOLVING: 'Bài tập giải quyết vấn đề phức tạp',
            COMPREHENSIVE: 'Bài tập tổng hợp, vận dụng thực tiễn',
        };
        const prompt = `Dựa trên các LỖI SAI của học sinh lớp 5, tạo bài tập phù hợp.

📋 DANH SÁCH LỖI SAI:
${errorSummary || 'Chưa có lỗi cụ thể, tạo bài tập về phép nhân số thập phân'}

📌 YÊU CẦU:
- Loại: ${typeDescriptions[exerciseType]}
- Tập trung vào dạng toán HS hay mắc lỗi
- 3-4 câu hỏi, mỗi câu 4 đáp án

Trả về JSON:
{
  "scenario": "tình huống thực tế",
  "questions": [
    {
      "content": "nội dung câu hỏi",
      "options": [
        { "content": "đáp án A", "isCorrect": false, "errorType": "loại lỗi", "errorDescription": "mô tả" },
        { "content": "đáp án B", "isCorrect": true },
        ...
      ]
    }
  ]
}

CHỈ TRẢ VỀ JSON.`;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid JSON response');
        }
        catch (error) {
            this.logger.error('Error generating error-based exercise', error);
            throw error;
        }
    }
    async generateFinalFeedback(answers) {
        const prompt = `Bạn là Trợ lí Học tập Ảo cho học sinh lớp 5.
Hãy đưa ra nhận xét tổng kết cho bài làm của học sinh.

Kết quả bài làm:
${answers.map((a, i) => `Câu ${i + 1}: ${a.isCorrect ? '✓ Đúng' : `✗ Sai (${a.errorType})`}`).join('\n')}

Yêu cầu:
- Khen ngợi những điểm tốt
- Nhẹ nhàng chỉ ra lỗi sai
- Đưa ra lời khuyên cụ thể
- Động viên học sinh
- Gọi là "bạn"

Viết nhận xét trực tiếp (không dùng JSON).`;
        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            this.logger.error('Error generating feedback', error);
            throw error;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map