import { DataSource } from 'typeorm';
import { Exercise, ExerciseType } from '../exercises/entities/exercise.entity';
import { Question, QuestionType } from '../exercises/entities/question.entity';
import { QuestionOption } from '../exercises/entities/question-option.entity';

/**
 * Seed data cho 3 bài tập mẫu về phép nhân số thập phân
 * Dựa trên file require.md
 */
export async function seedExercises(dataSource: DataSource): Promise<void> {
  const exerciseRepo = dataSource.getRepository(Exercise);
  const questionRepo = dataSource.getRepository(Question);
  const optionRepo = dataSource.getRepository(QuestionOption);

  // Check if already seeded
  const existing = await exerciseRepo.count({ where: { isTemplate: true } });
  if (existing > 0) {
    console.log('✅ Exercises already seeded');
    return;
  }

  console.log('🌱 Seeding exercises...');

  // =====================
  // BÀI 1: BT Cơ bản (1p30s)
  // =====================
  const exercise1 = await exerciseRepo.save({
    type: ExerciseType.BASIC,
    topic: 'phep-nhan-so-thap-phan',
    scenario: 'Chọn đúng đáp án cho các phép tính nhân số thập phân.',
    timeLimit: 90,
    bonusTime: 30,
    isTemplate: true,
  });

  const q1 = await questionRepo.save({
    exerciseId: exercise1.id,
    orderIndex: 1,
    content:
      'Theo bạn, những phép tính nào dưới đây là đúng? (Bạn có thể chọn nhiều đáp án)',
    type: QuestionType.MULTIPLE,
    correctPoints: 30,
    wrongPoints: 5,
    bonusPoints: 10,
  });

  await optionRepo.save([
    {
      questionId: q1.id,
      content: '3,4 × 1,2 = 40,8',
      isCorrect: false,
      errorType: 'ĐẶT SAI DẤU PHẨY',
      errorDescription: 'HS đặt sai dấu phẩy trong kết quả (đúng là 4,08)',
    },
    {
      questionId: q1.id,
      content: '4,3 × 3 = 12,9',
      isCorrect: true,
    },
    {
      questionId: q1.id,
      content: '2 × 3,9 = 7,82',
      isCorrect: false,
      errorType: 'NHÂN KHÔNG ĐÚNG',
      errorDescription: 'HS nhân không đúng (đúng là 7,8)',
    },
  ]);

  // =====================
  // BÀI 2: BT Vận dụng (2p)
  // =====================
  const exercise2 = await exerciseRepo.save({
    type: ExerciseType.APPLICATION,
    topic: 'phep-nhan-so-thap-phan',
    scenario:
      'Để chuẩn bị cho tiết mục múa chào mừng ngày 20/11, cô giáo cần mua vải để may khăn quàng cho đội văn nghệ của lớp. Hỏi cô giáo cần mua tất cả bao nhiêu mét vải để may khăn quàng cho 19 bạn, biết rằng mỗi khăn cần 0,75 m vải.',
    timeLimit: 120,
    bonusTime: 60,
    isTemplate: true,
  });

  const q2_1 = await questionRepo.save({
    exerciseId: exercise2.id,
    orderIndex: 1,
    content: 'Để giải được bài toán trên, bạn cần thực hiện phép tính nào?',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q2_1.id,
      content: '0,75 + 19',
      isCorrect: false,
      errorType: 'NHẦM BẢN CHẤT PHÉP TÍNH',
      errorDescription:
        'HS hiểu sai yêu cầu bài toán, chọn phép cộng thay vì phép nhân',
    },
    {
      questionId: q2_1.id,
      content: '0,75 × 19',
      isCorrect: true,
    },
    {
      questionId: q2_1.id,
      content: '19 – 0,75',
      isCorrect: false,
      errorType: 'NHẦM BẢN CHẤT PHÉP TÍNH',
      errorDescription: 'HS hiểu sai yêu cầu bài toán, chọn phép trừ',
    },
    {
      questionId: q2_1.id,
      content: '19 : 0,75',
      isCorrect: false,
      errorType: 'NHẦM BẢN CHẤT PHÉP TÍNH',
      errorDescription: 'HS hiểu sai yêu cầu bài toán, chọn phép chia',
    },
  ]);

  const q2_2 = await questionRepo.save({
    exerciseId: exercise2.id,
    orderIndex: 2,
    content: 'Kết quả của phép tính vừa tìm được ở câu a là:',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q2_2.id,
      content: '14',
      isCorrect: false,
      errorType: 'NHÂN NHẨM SAI',
      errorDescription: 'HS nhân nhẩm sai',
    },
    {
      questionId: q2_2.id,
      content: '14,25',
      isCorrect: true,
    },
    {
      questionId: q2_2.id,
      content: '15',
      isCorrect: false,
      errorType: 'LÀM TRÒN KHÔNG PHÙ HỢP',
      errorDescription: 'HS làm tròn không phù hợp ngữ cảnh',
    },
    {
      questionId: q2_2.id,
      content: '19,25',
      isCorrect: false,
      errorType: 'NHẦM BẢN CHẤT PHÉP TÍNH',
      errorDescription: 'HS thực hiện sai phép tính',
    },
  ]);

  const q2_3 = await questionRepo.save({
    exerciseId: exercise2.id,
    orderIndex: 3,
    content: 'Kết quả 14,25 m cho ta biết điều gì?',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q2_3.id,
      content: 'Chỉ cần mua 14 m vải là đủ.',
      isCorrect: false,
      errorType: 'HIỂU MƠ HỒ SỐ THẬP PHÂN',
      errorDescription: 'HS hiểu mơ hồ về ý nghĩa số thập phân trong thực tế',
    },
    {
      questionId: q2_3.id,
      content: 'Cần mua hơn 14 m vải một chút.',
      isCorrect: true,
    },
    {
      questionId: q2_3.id,
      content: 'Cần mua đúng 19 m vải.',
      isCorrect: false,
      errorType: 'NHẦM ĐẠI LƯỢNG',
      errorDescription: 'HS nhầm lẫn giữa số mét vải và số lượng khăn',
    },
    {
      questionId: q2_3.id,
      content: 'Mình chưa chắc chắn.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH Ý NGHĨA',
      errorDescription:
        'HS chưa xác định được ý nghĩa của kết quả trong thực tiễn',
    },
  ]);

  // =====================
  // BÀI 3: BT GQVĐ (3p30s)
  // =====================
  const exercise3 = await exerciseRepo.save({
    type: ExerciseType.PROBLEM_SOLVING,
    topic: 'phep-nhan-so-thap-phan',
    scenario:
      'Lớp 5A được giao trang trí gian hàng "Sắc màu ước mơ". Cả lớp quyết định mua 16 dây đèn led mini để trang trí. Cửa hàng A bán đèn với giá 11,2 nghìn đồng mỗi dây. Cửa hàng A có chương trình ưu đãi: giảm 0,7 nghìn đồng/dây. Cửa hàng B bán đèn với giá 10,8 nghìn đồng mỗi dây nhưng tặng 1 dây khi mua 15 dây. Vậy mua ở cửa hàng nào sẽ tiết kiệm hơn?',
    timeLimit: 210,
    bonusTime: 90,
    isTemplate: true,
  });

  const q3_1 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 1,
    content: 'Để biết mua ở đâu tiết kiệm hơn, bạn cần làm gì trước?',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_1.id,
      content: 'Tính tổng số tiền phải trả ở mỗi cửa hàng',
      isCorrect: true,
    },
    {
      questionId: q3_1.id,
      content: 'So sánh giá một dây đèn',
      isCorrect: false,
      errorType: 'PHÂN TÍCH CHƯA ĐẦY ĐỦ',
      errorDescription:
        'Nhìn giá 1 dây chưa biết được phải trả số tiền 16 dây là bao nhiêu',
    },
    {
      questionId: q3_1.id,
      content: 'Chọn cửa hàng có khuyến mãi',
      isCorrect: false,
      errorType: 'SUY LUẬN CHƯA CHÍNH XÁC',
      errorDescription: 'Mỗi cửa hàng đều có chương trình khuyến mãi khác nhau',
    },
    {
      questionId: q3_1.id,
      content: 'Mình chưa chắc chắn.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH CÁCH GIẢI',
      errorDescription: 'HS chưa xác định được cách giải quyết vấn đề',
    },
  ]);

  const q3_2 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 2,
    content: 'Sau khi giảm giá, mỗi dây đèn ở cửa hàng A có giá là:',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_2.id,
      content: '10,5 nghìn đồng',
      isCorrect: true,
    },
    {
      questionId: q3_2.id,
      content: '11,9 nghìn đồng',
      isCorrect: false,
      errorType: 'NHẦM PHÉP TÍNH',
      errorDescription: 'HS cộng nhầm 11,2 + 0,7 thay vì trừ',
    },
    {
      questionId: q3_2.id,
      content: '11,2 nghìn đồng',
      isCorrect: false,
      errorType: 'BỎ QUA DỮ KIỆN',
      errorDescription: 'Chưa trừ tiền được giảm giá',
    },
    {
      questionId: q3_2.id,
      content: 'Mình chưa chắc.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH PHÉP TÍNH',
      errorDescription: 'HS chưa xác định được phép tính thích hợp',
    },
  ]);

  const q3_3 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 3,
    content: 'Số tiền mua 16 dây ở cửa hàng A là:',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_3.id,
      content: '16,8 nghìn đồng',
      isCorrect: false,
      errorType: 'ĐẶT SAI DẤU PHẨY',
      errorDescription: 'Đặt sai dấu phẩy trong quá trình nhân số thập phân',
    },
    {
      questionId: q3_3.id,
      content: '105,16 nghìn đồng',
      isCorrect: false,
      errorType: 'SAI QUY TẮC NHÂN',
      errorDescription: 'HS sai quy tắc nhân số thập phân',
    },
    {
      questionId: q3_3.id,
      content: '168 nghìn đồng',
      isCorrect: true,
    },
    {
      questionId: q3_3.id,
      content: 'Mình chưa chắc.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH PHÉP TÍNH',
      errorDescription: 'HS chưa xác định được phép tính thích hợp',
    },
  ]);

  const q3_4 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 4,
    content:
      'Nếu mua ở cửa hàng B, để có đủ 16 dây đèn thì lớp phải trả tiền cho bao nhiêu dây:',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_4.id,
      content: '15 dây',
      isCorrect: true,
    },
    {
      questionId: q3_4.id,
      content: '16 dây',
      isCorrect: false,
      errorType: 'BỎ QUA DỮ KIỆN',
      errorDescription: 'HS chưa nắm được dữ kiện đề bài: mua 15 tặng 1',
    },
    {
      questionId: q3_4.id,
      content: '14 dây',
      isCorrect: false,
      errorType: 'HIỂU SAI KHUYẾN MÃI',
      errorDescription: 'HS chưa nắm được dữ kiện đề bài về khuyến mãi',
    },
    {
      questionId: q3_4.id,
      content: 'Mình chưa chắc.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH DỮ KIỆN',
      errorDescription: 'HS chưa xác định được dữ kiện đề bài đã cho',
    },
  ]);

  const q3_5 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 5,
    content: 'Số tiền mua 16 dây ở cửa hàng B là:',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_5.id,
      content: '172,8 nghìn đồng',
      isCorrect: false,
      errorType: 'KHÔNG HIỂU KHUYẾN MÃI',
      errorDescription: 'HS không hiểu khuyến mãi – nhân nhầm cho 16 dây',
    },
    {
      questionId: q3_5.id,
      content: '162 nghìn đồng',
      isCorrect: true,
    },
    {
      questionId: q3_5.id,
      content: '16,2 nghìn đồng',
      isCorrect: false,
      errorType: 'ĐẶT SAI DẤU PHẨY',
      errorDescription: 'Đặt sai dấu phẩy thập phân',
    },
    {
      questionId: q3_5.id,
      content: 'Mình chưa chắc.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH PHÉP TÍNH',
      errorDescription: 'HS chưa xác định được phép tính thích hợp',
    },
  ]);

  const q3_6 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 6,
    content: 'Theo bạn, lớp 5A nên mua đèn ở đâu để tiết kiệm hơn?',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_6.id,
      content: 'Cửa hàng A',
      isCorrect: false,
      errorType: 'SO SÁNH SAI',
      errorDescription:
        'Mỗi dây sau giảm còn 10,5 nghìn đồng, khi mua 16 dây = 168 nghìn đồng > 162 nghìn đồng ở cửa hàng B',
    },
    {
      questionId: q3_6.id,
      content: 'Cửa hàng B',
      isCorrect: true,
    },
    {
      questionId: q3_6.id,
      content: 'Hai cửa hàng như nhau',
      isCorrect: false,
      errorType: 'TÍNH TOÁN SAI',
      errorDescription: 'Giá 16 dây ở 2 cửa hàng khác nhau',
    },
    {
      questionId: q3_6.id,
      content: 'Mình chưa chắc.',
      isCorrect: false,
      errorType: 'CHƯA XÁC ĐỊNH KẾT QUẢ',
      errorDescription: 'HS chưa xác định được kết quả',
    },
  ]);

  const q3_7 = await questionRepo.save({
    exerciseId: exercise3.id,
    orderIndex: 7,
    content: 'Vì sao bạn chọn đáp án như vậy ở câu 6?',
    type: QuestionType.SINGLE,
    correctPoints: 12,
    wrongPoints: 2,
    bonusPoints: 4,
  });

  await optionRepo.save([
    {
      questionId: q3_7.id,
      content: 'Vì cửa hàng A giá mỗi dây rẻ hơn sau khi ưu đãi',
      isCorrect: false,
      errorType: 'GIẢI THÍCH CHƯA HỢP LÝ',
      errorDescription:
        'HS giải thích chưa hợp lí - giá 1 dây không quyết định tổng chi phí',
    },
    {
      questionId: q3_7.id,
      content: 'Vì cửa hàng B có tặng thêm dây',
      isCorrect: false,
      errorType: 'GIẢI THÍCH CHƯA HỢP LÝ',
      errorDescription: 'HS giải thích chưa hợp lí - cần so sánh tổng tiền',
    },
    {
      questionId: q3_7.id,
      content: 'Vì cửa hàng B có tổng số tiền phải trả ít hơn',
      isCorrect: true,
    },
    {
      questionId: q3_7.id,
      content: 'Mình chưa giải thích được',
      isCorrect: false,
      errorType: 'CHƯA GIẢI THÍCH ĐƯỢC',
      errorDescription: 'HS chưa giải thích được kết quả đã chọn',
    },
  ]);

  console.log('✅ Seeded 3 exercises with questions and options');
}
