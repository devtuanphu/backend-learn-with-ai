/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenRouter } from '@openrouter/sdk';
import {
  Exercise,
  ExerciseType,
} from '../exercises/entities/exercise.entity.js';
import { UserError } from '../user-progress/entities/user-error.entity.js';

interface QuestionOption {
  content: string;
  isCorrect: boolean;
  errorType?: string;
  errorDescription?: string;
}

interface Question {
  content: string;
  options?: QuestionOption[];
}

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private openRouter: OpenRouter | null = null;
  private model: string;
  private apiKey: string | undefined;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    this.model =
      this.configService.get<string>('OPENROUTER_MODEL') ||
      'google/gemma-3-4b-it:free';
  }

  onModuleInit(): void {
    if (this.apiKey) {
      this.openRouter = new OpenRouter({ apiKey: this.apiKey });
      this.logger.log(`OpenRouter configured with model: ${this.model}`);
    } else {
      this.logger.warn('OPENROUTER_API_KEY không được cấu hình');
    }
  }

  private async chat(
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    if (!this.openRouter) {
      throw new Error('OpenRouter SDK not initialized');
    }
    const completion = await this.openRouter.chat.send({
      model: this.model,
      messages,
      stream: false,
    });
    const content = completion.choices[0]?.message?.content;
    return typeof content === 'string' ? content : '';
  }

  private formatQuestionForPrompt(q: Question, i: number): string {
    const optionsStr =
      q.options
        ?.map(
          (o: QuestionOption) =>
            `${o.content} (${o.isCorrect ? 'Đúng' : 'Sai - ' + o.errorType})`,
        )
        .join(', ') || '';
    return `${i + 1}. ${q.content}\nĐáp án: ${optionsStr}`;
  }

  // 1. Generate exercise từ template - ĐỂ AI TỰ SÁNG TẠO
  async generateExerciseFromTemplate(template: Exercise): Promise<{
    scenario: string;
    questions: {
      content: string;
      options: QuestionOption[];
    }[];
  }> {
    const questions = (template.questions as Question[]) || [];
    const numQuestions = questions.length;

    const difficultyMap = {
      [ExerciseType.BASIC]: 'Cơ bản - phép tính đơn giản, số liệu dễ',
      [ExerciseType.APPLICATION]: 'Vận dụng - áp dụng vào tình huống thực tế',
      [ExerciseType.PROBLEM_SOLVING]:
        'Giải quyết vấn đề - phân tích nhiều bước',
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
      const response = await this.chat([{ role: 'user', content: prompt }]);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      this.logger.error('Error generating exercise', error);
      throw error;
    }
  }

  // 2. Đánh giá câu trả lời
  async evaluateAnswer(
    questionContent: string,
    correctAnswer: string,
    studentAnswer: string,
    errorTypes: string[],
  ): Promise<{
    isCorrect: boolean;
    errorType?: string;
    errorDescription?: string;
    feedback: string;
  }> {
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
      const response = await this.chat([{ role: 'user', content: prompt }]);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      this.logger.error('Error evaluating answer', error);
      throw error;
    }
  }

  // 3. Chat với TLHTA (Scaffolding)
  async scaffoldingChat(
    stepNumber: 1 | 2 | 3 | 4,
    problem: string,
    studentMessage: string,
    errors: UserError[],
    conversationHistory: { role: 'user' | 'model'; content: string }[],
  ): Promise<{
    message: string;
    evaluation: 'correct' | 'incorrect' | 'partial' | 'unclear';
    emotion: 'celebrating' | 'encouraging' | 'thinking' | 'happy' | 'idle';
  }> {
    const stepDescriptions = {
      1: 'Bài toán cho biết gì? Yêu cầu gì?',
      2: 'Để giải quyết được vấn đề, bạn sẽ thực hiện như thế nào?',
      3: 'Hãy trình bày các lời giải của bạn nhé!',
      4: 'Kết quả này có hợp lý không? Vì sao?',
    };

    const errorSummary =
      errors.length > 0
        ? errors
            .map((e: UserError) => `- ${e.errorType}: ${e.errorDescription}`)
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
      // Build messages array with history
      const messages: { role: 'user' | 'assistant'; content: string }[] = [
        { role: 'user', content: systemPrompt },
        {
          role: 'assistant',
          content:
            '{"message": "Tôi hiểu. Tôi sẽ hỗ trợ học sinh.", "evaluation": "unclear", "emotion": "idle"}',
        },
        ...conversationHistory.map((m) => ({
          role: m.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: m.content,
        })),
        { role: 'user', content: studentMessage },
      ];

      const responseText = await this.chat(messages);

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as {
            message: string;
            evaluation?: 'correct' | 'incorrect' | 'partial' | 'unclear';
            emotion?:
              | 'celebrating'
              | 'encouraging'
              | 'thinking'
              | 'happy'
              | 'idle';
          };
          const evaluation = parsed.evaluation || 'unclear';
          let emotion = parsed.emotion || 'idle';

          // FORCE OVERRIDE: If incorrect/unclear, DO NOT ALLOW happy/celebrating
          if (evaluation === 'incorrect') {
            if (emotion === 'happy' || emotion === 'celebrating') {
              emotion = 'encouraging';
            }
          } else if (evaluation === 'unclear') {
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
      } catch {
        this.logger.warn('Failed to parse AI response as JSON, using fallback');
      }

      return {
        message: responseText,
        evaluation: 'unclear',
        emotion: 'idle',
      };
    } catch (error) {
      this.logger.error('Error in scaffolding chat', error);
      throw error;
    }
  }

  // 4. Tạo bài tập dựa trên lỗi sai (LỘ TRÌNH 2 & 3)
  async generateErrorBasedExercise(
    errors: UserError[],
    exerciseType: 'APPLICATION' | 'PROBLEM_SOLVING' | 'COMPREHENSIVE',
  ): Promise<{
    scenario: string;
    questions: {
      content: string;
      options: QuestionOption[];
    }[];
  }> {
    const errorSummary = errors
      .reduce(
        (acc, e: UserError) => {
          const existing = acc.find((x) => x.type === e.errorType);
          if (existing) {
            existing.count++;
          } else {
            acc.push({
              type: e.errorType,
              description: e.errorDescription,
              count: 1,
            });
          }
          return acc;
        },
        [] as { type: string; description: string; count: number }[],
      )
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
      const response = await this.chat([{ role: 'user', content: prompt }]);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      this.logger.error('Error generating error-based exercise', error);
      throw error;
    }
  }

  // 5. Tạo nhận xét tổng kết
  async generateFinalFeedback(
    answers: {
      question: string;
      studentAnswer: string;
      isCorrect: boolean;
      errorType?: string;
    }[],
  ): Promise<string> {
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
      const response = await this.chat([{ role: 'user', content: prompt }]);
      return response;
    } catch (error) {
      this.logger.error('Error generating feedback', error);
      throw error;
    }
  }
}
