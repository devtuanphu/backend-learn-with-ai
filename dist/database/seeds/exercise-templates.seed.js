"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedExerciseTemplates = seedExerciseTemplates;
const exercise_entity_1 = require("../../exercises/entities/exercise.entity");
const question_entity_1 = require("../../exercises/entities/question.entity");
const question_option_entity_1 = require("../../exercises/entities/question-option.entity");
async function seedExerciseTemplates(dataSource) {
    const exerciseRepo = dataSource.getRepository(exercise_entity_1.Exercise);
    const questionRepo = dataSource.getRepository(question_entity_1.Question);
    const optionRepo = dataSource.getRepository(question_option_entity_1.QuestionOption);
    const existingTemplates = await exerciseRepo.count({
        where: { isTemplate: true },
    });
    if (existingTemplates > 0) {
        console.log('📦 Exercise templates already exist, skipping seed...');
        return;
    }
    console.log('🌱 Seeding exercise templates...');
    const exercise1 = exerciseRepo.create({
        type: exercise_entity_1.ExerciseType.BASIC,
        topic: 'phep-nhan-so-thap-phan',
        scenario: 'Chọn đúng đáp án cho các phép tính nhân số thập phân. AI sẽ nhận diện: HS sử dụng quy tắc nhân số thập phân ở mức nào? Có thể có lỗi sai: Không nhân đúng, đặt sai dấu phẩy, nhầm bản chất phép tính,...',
        timeLimit: 90,
        bonusTime: 30,
        isTemplate: true,
    });
    const savedExercise1 = await exerciseRepo.save(exercise1);
    const q1_1 = questionRepo.create({
        exerciseId: savedExercise1.id,
        content: 'Theo bạn, những phép tính nào dưới đây là đúng? (Bạn có thể chọn nhiều đáp án)',
        orderIndex: 1,
        correctPoints: 30,
        wrongPoints: 5,
        bonusPoints: 10,
    });
    const savedQ1_1 = await questionRepo.save(q1_1);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ1_1.id,
            content: '3,4 × 1,2 = 40,8',
            isCorrect: false,
            errorType: 'decimal_placement',
            errorDescription: 'Đặt sai dấu phẩy. Kết quả đúng là 4,08 (có 2 chữ số thập phân)',
        }),
        optionRepo.create({
            questionId: savedQ1_1.id,
            content: '4,3 × 3 = 12,9',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ1_1.id,
            content: '2 × 3,9 = 7,82',
            isCorrect: false,
            errorType: 'multiplication_error',
            errorDescription: 'Nhân không đúng. Kết quả đúng là 7,8',
        }),
    ]);
    const exercise2 = exerciseRepo.create({
        type: exercise_entity_1.ExerciseType.APPLICATION,
        topic: 'phep-nhan-so-thap-phan',
        scenario: 'Để chuẩn bị cho tiết mục múa chào mừng ngày 20/11, cô giáo cần mua vải để may khăn quàng cho đội văn nghệ của lớp. Hỏi cô giáo cần mua tất cả bao nhiêu mét vải để may khăn quàng cho 19 bạn, biết rằng mỗi khăn cần 0,75 m vải.',
        timeLimit: 120,
        bonusTime: 60,
        isTemplate: true,
    });
    const savedExercise2 = await exerciseRepo.save(exercise2);
    const q2_1 = questionRepo.create({
        exerciseId: savedExercise2.id,
        content: 'Để giải được bài toán trên, bạn cần thực hiện phép tính nào?',
        orderIndex: 1,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ2_1 = await questionRepo.save(q2_1);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ2_1.id,
            content: '0,75 + 19',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Hiểu sai yêu cầu bài toán, nhầm bản chất phép tính cần dùng',
        }),
        optionRepo.create({
            questionId: savedQ2_1.id,
            content: '0,75 × 19',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ2_1.id,
            content: '19 – 0,75',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Hiểu sai yêu cầu bài toán, nhầm bản chất phép tính cần dùng',
        }),
        optionRepo.create({
            questionId: savedQ2_1.id,
            content: '19 : 0,75',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Hiểu sai yêu cầu bài toán, nhầm bản chất phép tính cần dùng',
        }),
    ]);
    const q2_2 = questionRepo.create({
        exerciseId: savedExercise2.id,
        content: 'Kết quả của phép tính vừa tìm được ở câu a là:',
        orderIndex: 2,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ2_2 = await questionRepo.save(q2_2);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ2_2.id,
            content: '14',
            isCorrect: false,
            errorType: 'calculation_error',
            errorDescription: 'Nhân nhẩm sai',
        }),
        optionRepo.create({
            questionId: savedQ2_2.id,
            content: '14,25',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ2_2.id,
            content: '15',
            isCorrect: false,
            errorType: 'calculation_error',
            errorDescription: 'Làm tròn không phù hợp',
        }),
        optionRepo.create({
            questionId: savedQ2_2.id,
            content: '19,25',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Nhầm bản chất trong việc lựa chọn bài toán',
        }),
    ]);
    const q2_3 = questionRepo.create({
        exerciseId: savedExercise2.id,
        content: 'Kết quả 14,25 m cho ta biết điều gì?',
        orderIndex: 3,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ2_3 = await questionRepo.save(q2_3);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ2_3.id,
            content: 'Chỉ cần mua 14 m vải là đủ.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS hiểu mơ hồ số thập phân',
        }),
        optionRepo.create({
            questionId: savedQ2_3.id,
            content: 'Cần mua hơn 14 m vải một chút.',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ2_3.id,
            content: 'Cần mua đúng 19 m vải.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS nhầm đại lượng giữa số mét với số lượng khăn',
        }),
        optionRepo.create({
            questionId: savedQ2_3.id,
            content: 'Mình chưa chắc chắn.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định ý nghĩa của kết quả vào thực tiễn',
        }),
    ]);
    const exercise3 = exerciseRepo.create({
        type: exercise_entity_1.ExerciseType.PROBLEM_SOLVING,
        topic: 'phep-nhan-so-thap-phan',
        scenario: 'Lớp 5A được giao trang trí gian hàng "Sắc màu ước mơ". Cả lớp quyết định mua 16 dây đèn led mini để trang trí. Cửa hàng A bán đèn với giá 11,2 nghìn đồng mỗi dây. Cửa hàng A có chương trình ưu đãi: giảm 0,7 nghìn đồng/dây. Cửa hàng B bán đèn với giá 10,8 nghìn đồng mỗi dây nhưng tặng 1 dây khi mua 15 dây. Vậy mua ở cửa hàng nào sẽ tiết kiệm hơn?',
        timeLimit: 210,
        bonusTime: 90,
        isTemplate: true,
    });
    const savedExercise3 = await exerciseRepo.save(exercise3);
    const q3_1 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Để biết mua ở đâu tiết kiệm hơn, bạn cần làm gì trước?',
        orderIndex: 1,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_1 = await questionRepo.save(q3_1);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_1.id,
            content: 'Tính tổng số tiền phải trả ở mỗi cửa hàng',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_1.id,
            content: 'So sánh giá một dây đèn',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Nhìn giá 1 dây chưa biết được phải trả số tiền 16 dây là bao nhiêu',
        }),
        optionRepo.create({
            questionId: savedQ3_1.id,
            content: 'Chọn cửa hàng có khuyến mãi',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Mỗi cửa hàng đều có chương trình khuyến mãi khác nhau',
        }),
        optionRepo.create({
            questionId: savedQ3_1.id,
            content: 'Mình chưa chắc chắn.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được cách giải quyết vấn đề',
        }),
    ]);
    const q3_2 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Sau khi giảm giá, mỗi dây đèn ở cửa hàng A có giá là:',
        orderIndex: 2,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_2 = await questionRepo.save(q3_2);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_2.id,
            content: '10,5 nghìn đồng',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_2.id,
            content: '11,9 nghìn đồng',
            isCorrect: false,
            errorType: 'calculation_error',
            errorDescription: 'Cộng nhầm 11,2 + 0,7 thay vì trừ',
        }),
        optionRepo.create({
            questionId: savedQ3_2.id,
            content: '11,2 nghìn đồng',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'Chưa trừ tiền được giảm giá',
        }),
        optionRepo.create({
            questionId: savedQ3_2.id,
            content: 'Mình chưa chắc.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được phép tính thích hợp',
        }),
    ]);
    const q3_3 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Số tiền mua 16 dây ở cửa hàng A là:',
        orderIndex: 3,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_3 = await questionRepo.save(q3_3);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_3.id,
            content: '16,8 nghìn đồng',
            isCorrect: false,
            errorType: 'decimal_placement',
            errorDescription: 'Đặt sai dấu phẩy trong quá trình nhân số thập phân',
        }),
        optionRepo.create({
            questionId: savedQ3_3.id,
            content: '105,16 nghìn đồng',
            isCorrect: false,
            errorType: 'multiplication_error',
            errorDescription: 'HS sai quy tắc nhân số thập phân',
        }),
        optionRepo.create({
            questionId: savedQ3_3.id,
            content: '168 nghìn đồng',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_3.id,
            content: 'Mình chưa chắc.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được phép tính thích hợp',
        }),
    ]);
    const q3_4 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Nếu mua ở cửa hàng B, để có đủ 16 dây đèn thì lớp phải trả tiền cho bao nhiêu dây:',
        orderIndex: 4,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_4 = await questionRepo.save(q3_4);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_4.id,
            content: '15 dây',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_4.id,
            content: '16 dây',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa nắm được dữ kiện đề bài: Cửa hàng khuyến mãi mua 15 tặng 1',
        }),
        optionRepo.create({
            questionId: savedQ3_4.id,
            content: '14 dây',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa nắm được dữ kiện đề bài: Không đúng với điều kiện cửa hàng đưa ra',
        }),
        optionRepo.create({
            questionId: savedQ3_4.id,
            content: 'Mình chưa chắc.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được dữ kiện đề bài đã cho',
        }),
    ]);
    const q3_5 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Số tiền mua 16 dây ở cửa hàng B là:',
        orderIndex: 5,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_5 = await questionRepo.save(q3_5);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_5.id,
            content: '172,8 nghìn đồng',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS không hiểu khuyến mãi – nhân nhầm cho 16 dây',
        }),
        optionRepo.create({
            questionId: savedQ3_5.id,
            content: '162 nghìn đồng',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_5.id,
            content: '16,2 nghìn đồng',
            isCorrect: false,
            errorType: 'decimal_placement',
            errorDescription: 'Đặt sai dấu phẩy thập phân',
        }),
        optionRepo.create({
            questionId: savedQ3_5.id,
            content: 'Mình chưa chắc.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được phép tính thích hợp',
        }),
    ]);
    const q3_6 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Theo bạn, lớp 5A nên mua đèn ở đâu để tiết kiệm hơn?',
        orderIndex: 6,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_6 = await questionRepo.save(q3_6);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_6.id,
            content: 'Cửa hàng A',
            isCorrect: false,
            errorType: 'calculation_error',
            errorDescription: 'Mỗi dây sau giảm còn 10,5 nghìn đồng, khi mua 16 dây thì tổng là 168 nghìn đồng. Còn ở cửa hàng B chỉ có 10,8 x 15 = 162 nghìn đồng',
        }),
        optionRepo.create({
            questionId: savedQ3_6.id,
            content: 'Cửa hàng B',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_6.id,
            content: 'Hai cửa hàng như nhau',
            isCorrect: false,
            errorType: 'calculation_error',
            errorDescription: 'Giá 16 dây ở 2 cửa hàng khác nhau',
        }),
        optionRepo.create({
            questionId: savedQ3_6.id,
            content: 'Mình chưa chắc chắn.',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa xác định được kết quả',
        }),
    ]);
    const q3_7 = questionRepo.create({
        exerciseId: savedExercise3.id,
        content: 'Vì sao bạn chọn đáp án như vậy ở câu 6?',
        orderIndex: 7,
        correctPoints: 12,
        wrongPoints: 2,
        bonusPoints: 4,
    });
    const savedQ3_7 = await questionRepo.save(q3_7);
    await optionRepo.save([
        optionRepo.create({
            questionId: savedQ3_7.id,
            content: 'Vì cửa hàng A giá mỗi dây rẻ hơn sau khi ưu đãi',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS giải thích chưa hợp lí',
        }),
        optionRepo.create({
            questionId: savedQ3_7.id,
            content: 'Vì cửa hàng B có tặng thêm dây',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS giải thích chưa hợp lí',
        }),
        optionRepo.create({
            questionId: savedQ3_7.id,
            content: 'Vì cửa hàng B có tổng số tiền phải trả ít hơn',
            isCorrect: true,
        }),
        optionRepo.create({
            questionId: savedQ3_7.id,
            content: 'Mình chưa giải thích được',
            isCorrect: false,
            errorType: 'misunderstanding',
            errorDescription: 'HS chưa giải thích được kết quả đã chọn',
        }),
    ]);
    console.log('✅ Seeded 3 exercise templates successfully!');
    console.log('   - Bài 1: BT Cơ bản (1 câu)');
    console.log('   - Bài 2: BT Vận dụng (3 câu)');
    console.log('   - Bài 3: BT Giải quyết vấn đề (7 câu)');
}
//# sourceMappingURL=exercise-templates.seed.js.map