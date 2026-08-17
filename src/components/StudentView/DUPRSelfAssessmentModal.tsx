import React, { useState, useMemo } from 'react';
import { 
  X, Award, Sparkles, CheckCircle2, Target, TrendingUp, 
  HelpCircle, ArrowRight, ArrowLeft, RefreshCw, BarChart3, 
  Flame, Zap, BookOpen, GraduationCap, ShieldCheck, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, SkillRating } from '../../types';

interface DUPRSelfAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewClasses?: () => void;
  onViewCoaches?: () => void;
}

interface QuestionOption {
  text: string;
  score: number; // 1 to 10
  desc: string;
}

interface AssessmentQuestion {
  key: keyof SkillRating['metrics'];
  title: string;
  subtitle: string;
  weight: number;
  options: QuestionOption[];
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    key: 'serve_and_return',
    title: '1. Phát Bóng & Trả Giao Bóng',
    subtitle: 'Độ sâu bóng, tính ổn định và khả năng đưa bóng an toàn qua lưới',
    weight: 0.15,
    options: [
      {
        score: 3.0,
        text: 'Mới tập chơi: Phát bóng sang sân nhưng bóng nông và hay đập lưới',
        desc: 'Trả giao bóng chưa kiểm soát được lực, thường trả bóng ngắn ở giữa sân khiến đối thủ dễ lên lưới tấn công.'
      },
      {
        score: 5.5,
        text: 'Cơ bản ổn định: Phát bóng và trả bóng qua lưới đạt tỷ lệ khoảng 70%',
        desc: 'Bóng thường rơi vào vùng giữa sân hoặc sâu vừa phải. Đã biết hướng bóng sang phía trái tay của đối phương.'
      },
      {
        score: 7.5,
        text: 'Nâng cao: Phát bóng sâu sát Baseline có lực xoáy, trả bóng hiểm hóc',
        desc: 'Trả bóng sâu sát vạch cuối sân đạt độ chuẩn xác 85%+, giúp bạn và đồng đội có đủ thời gian tiến thẳng lên vạch Kitchen.'
      },
      {
        score: 9.5,
        text: 'Chuyên gia: Phát bóng uy lực Topspin, Slice và trả bóng cực kỳ biến hóa',
        desc: 'Tự tin tấn công ngay từ cú phát bóng và trả giao bóng bóng xoáy cắm góc, đạt tỷ lệ chính xác trên 95%.'
      }
    ]
  },
  {
    key: 'dinking_control',
    title: '2. Đánh Bóng Ngắn Tại Vạch Kitchen',
    subtitle: 'Độ mềm tay, kiểm soát lực bóng và tính kiên nhẫn trong các loạt đấu bóng ngắn',
    weight: 0.20,
    options: [
      {
        score: 3.0,
        text: 'Chưa quen dink: Thường xuyên đập bóng mạnh hoặc lốp bóng bổng tại lưới',
        desc: 'Dễ mất kiên nhẫn khi đấu bóng ngắn, bóng dễ bị nảy cao quá mép lưới tạo cơ hội cho đối thủ smash dứt điểm.'
      },
      {
        score: 5.5,
        text: 'Biết dink cơ bản: Giữ được 3-5 nhịp bóng ngắn nhưng chưa linh hoạt',
        desc: 'Đưa được bóng rơi vào ô Kitchen đối phương nhưng bóng còn hơi cao, đôi lúc vẫn bị đánh bóng vào lưới khi bị ép góc.'
      },
      {
        score: 7.5,
        text: 'Kiểm soát tốt: Kiên nhẫn dink bền trên 10 nhịp, chủ động dink chéo sân',
        desc: 'Tạo độ xoáy chìm backspin và topspin, dink bóng thấp dưới mép lưới và chủ động di chuyển chân để mở góc ép đối thủ.'
      },
      {
        score: 9.5,
        text: 'Bậc thầy Soft Game: Điều tiết nhịp độ, đổi hướng dink và chớp thời cơ Speedup',
        desc: 'Hoàn toàn làm chủ vùng Kitchen, dink bóng sát lưới và bất ngờ tăng tốc tấn công khi đối thủ sơ hở.'
      }
    ]
  },
  {
    key: 'third_shot_drop',
    title: '3. Cú Đánh Thứ Ba Quyết Định',
    subtitle: 'Kỹ năng quan trọng nhất trong Pickleball hiện đại để chuyển trạng thái từ phòng thủ sang tấn công',
    weight: 0.25,
    options: [
      {
        score: 3.0,
        text: 'Chỉ biết Drive: Luôn đánh bóng đập mạnh hết sức từ cuối sân',
        desc: 'Chưa biết cách thực hiện cú thả bóng vòng cung mềm mại vào Kitchen, thường bị đối phương đứng lưới chặn đập lại.'
      },
      {
        score: 5.5,
        text: 'Đang tập Third Shot Drop: Tỷ lệ thành công khoảng 40-50%',
        desc: 'Đã hiểu mục đích của cú Drop nhưng bóng vẫn thường bị ngắn vào lưới hoặc rơi quá cao khiến đối thủ volley dễ dàng.'
      },
      {
        score: 7.5,
        text: 'Thuần thục: Third Shot Drop đạt độ chính xác trên 70%, tạo điều kiện lên lưới',
        desc: 'Thả bóng êm ái rơi bổng vào Kitchen giúp bạn và đồng đội an toàn tiến lên vạch Kitchen chiếm thế chủ động.'
      },
      {
        score: 9.5,
        text: 'Phối hợp linh hoạt Drop & Drive: Cú đánh thứ 3 như vũ khí chủ lực',
        desc: 'Tùy vào vị trí đối thủ để tung cú Drive xé gió xuyên nách hoặc cú Drop mượt mà rơi sát chân đối thủ ở tỷ lệ thành công 90%+.'
      }
    ]
  },
  {
    key: 'volleys_and_resets',
    title: '4. Bắt Volley & Đỡ Đập Phòng Thủ',
    subtitle: 'Phản xạ tốc độ cao tại lưới và kỹ năng hãm lực bóng đập mạnh',
    weight: 0.15,
    options: [
      {
        score: 3.0,
        text: 'Sợ bóng nhanh: Thường né người hoặc vung vợt quá rộng khi đứng lưới',
        desc: 'Chưa có kỹ thuật chặn bóng block volley, khi bị đối thủ đánh mạnh thường đánh bóng bay ra ngoài sân.'
      },
      {
        score: 5.5,
        text: 'Chặn bóng cơ bản: Đỡ được các cú volley tầm trung có tốc độ vừa phải',
        desc: 'Đã biết giữ mặt vợt ổn định trước ngực, nhưng gặp đối thủ đập bóng mạnh liên tục thì vẫn dễ bị vỡ trận.'
      },
      {
        score: 7.5,
        text: 'Phản xạ nhanh & Reset tốt: Hóa giải bóng đập mạnh thành cú bóng êm',
        desc: 'Thực hiện thuần thục cú Reset hãm lực rơi vào Kitchen khi đang bị tấn công, tự tin trong các pha đấu bóng tốc độ cao.'
      },
      {
        score: 9.5,
        text: 'Bức tường thép: Phản xạ tia chớp, bắt volley dứt điểm góc hiểm',
        desc: 'Thống trị các pha đối đầu trên không tại lưới, smash dứt điểm dũng mãnh và reset bóng từ mọi góc hẹp.'
      }
    ]
  },
  {
    key: 'court_positioning',
    title: '5. Vị Trí Sân & Bộ Chân Footwork',
    subtitle: 'Khả năng di chuyển, giữ thăng bằng và tuân thủ tuyệt đối quy định Non-Volley Zone',
    weight: 0.10,
    options: [
      {
        score: 3.0,
        text: 'Hay mắc lỗi chân: Thỉnh thoảng dẫm vạch Kitchen và đứng chôn chân',
        desc: 'Di chuyển còn vụng về, dễ bị đứng ở khu vực giữa sân Transition Zone khiến bị đối phương ép góc.'
      },
      {
        score: 5.5,
        text: 'Hiểu quy chuẩn sân: Biết đứng sát vạch Kitchen và di chuyển theo bóng',
        desc: 'Đã biết tư thế chuẩn bị Ready Stance, phối hợp di chuyển cùng đồng đội nhưng bộ chân lùi đón bóng lốp còn chậm.'
      },
      {
        score: 7.5,
        text: 'Bộ chân linh hoạt: Di chuyển song song cùng đồng đội, thoát vùng chết nhanh',
        desc: 'Giữ trọng tâm vững chắc, di chuyển ngang bước chữ V nhịp nhàng, bao bọc khu vực giữa sân cực kỳ chặt chẽ.'
      },
      {
        score: 9.5,
        text: 'Di chuyển chuẩn xác: Đọc trước hướng bóng, bọc lót đồng đội và bao sân tối đa',
        desc: 'Bộ chân nhẹ nhàng thanh thoát, không bao giờ phạm lỗi vạch Kitchen dù trong tư thế với bóng khó.'
      }
    ]
  },
  {
    key: 'match_strategy',
    title: '6. Tư Duy Chiến Thuật & Trận Đấu',
    subtitle: 'Khả năng đọc đối thủ, khai thác điểm yếu và giữ vững tâm lý thi đấu',
    weight: 0.15,
    options: [
      {
        score: 3.0,
        text: 'Chưa có chiến thuật: Đánh bóng theo cảm tính và chưa quen đếm điểm',
        desc: 'Mới làm quen với Pickleball phong trào, chơi giao lưu vui là chính, chưa biết phân tích điểm yếu của đối thủ.'
      },
      {
        score: 5.5,
        text: 'Chiến thuật cơ bản: Biết nhắm vào người chơi yếu hơn hoặc khoảng trống',
        desc: 'Nắm vững luật tính điểm 3 số, biết phối hợp giao tiếp với bạn cùng đôi.'
      },
      {
        score: 7.5,
        text: 'Chiến thuật nâng cao: Áp dụng kỹ thuật Stacking, kiên nhẫn chờ thời cơ',
        desc: 'Biết thay đổi nhịp độ trận đấu, đánh vào chân trái tay đối thủ, giữ tâm lý bình tĩnh khi bị dẫn điểm số.'
      },
      {
        score: 9.5,
        text: 'Bản lĩnh giải đấu: Làm chủ thế trận, đọc vị chiến thuật và thay đổi linh hoạt',
        desc: 'Dày dặn kinh nghiệm thi đấu các giải DUPR mở rộng, điều khiển nhịp độ trận đấu và dẫn dắt bạn cùng đôi đạt phong độ cao nhất.'
      }
    ]
  }
];

export const DUPRSelfAssessmentModal: React.FC<DUPRSelfAssessmentModalProps> = ({
  isOpen,
  onClose,
  onViewClasses,
  onViewCoaches
}) => {
  const { currentUser, users, setCurrentUser, selfAssessDUPR, coaches, classes } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentUser?.id || 'student-1');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assessmentMode, setAssessmentMode] = useState<'quiz' | 'slider'>('quiz');
  
  // Selected scores for 6 metrics (initialized to current rating equivalent or default 5.5)
  const [selectedScores, setSelectedScores] = useState<Record<keyof SkillRating['metrics'], number>>({
    serve_and_return: 5.5,
    dinking_control: 5.5,
    third_shot_drop: 5.5,
    volleys_and_resets: 5.5,
    court_positioning: 5.5,
    match_strategy: 5.5
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // When selected student changes, update state
  const targetStudent = useMemo(() => {
    return users.find(u => u.id === selectedStudentId) || currentUser;
  }, [users, selectedStudentId, currentUser]);

  // Calculate calculated DUPR rating
  const calculatedResult = useMemo(() => {
    let weightedSum = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      weightedSum += (selectedScores[q.key] || 5.0) * q.weight;
    });

    // Scale from 1-10 to DUPR (2.0 to 5.5)
    // 3.0 -> 2.2 DUPR, 5.5 -> 3.2 DUPR, 7.5 -> 4.2 DUPR, 9.5 -> 5.2 DUPR
    let dupr = 2.0 + (weightedSum - 2.5) * 0.45;
    if (dupr < 2.0) dupr = 2.0;
    if (dupr > 5.8) dupr = 5.8;
    const roundedDupr = Number(dupr.toFixed(1));

    // Identify strengths and weaknesses
    const sortedSkills = [...ASSESSMENT_QUESTIONS].sort((a, b) => 
      selectedScores[b.key] - selectedScores[a.key]
    );

    const topStrength = sortedSkills[0];
    const topWeakness = sortedSkills[sortedSkills.length - 1];

    let tierLabel = 'Người Mới Bắt Đầu (Novice 2.0 - 2.5)';
    let tierColor = 'text-blue-700 bg-blue-50 border-blue-200';
    if (roundedDupr >= 3.0 && roundedDupr < 4.0) {
      tierLabel = 'Trung Cấp (Intermediate 3.0 - 3.5)';
      tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (roundedDupr >= 4.0 && roundedDupr < 5.0) {
      tierLabel = 'Nâng Cao (Advanced 4.0 - 4.5)';
      tierColor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (roundedDupr >= 5.0) {
      tierLabel = 'Bán Chuyên / Pro (5.0+)';
      tierColor = 'text-purple-700 bg-purple-50 border-purple-200';
    }

    return {
      duprScore: roundedDupr,
      tierLabel,
      tierColor,
      topStrength,
      topWeakness
    };
  }, [selectedScores]);

  if (!isOpen) return null;

  const handleSelectOption = (key: keyof SkillRating['metrics'], score: number) => {
    setSelectedScores(prev => ({ ...prev, [key]: score }));
    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSaveResult = () => {
    const drills = [
      `Drill khắc phục ${calculatedResult.topWeakness.title.split('(')[0]}: Tập 100 bóng liên tục`,
      'Drill Third Shot Drop từ Baseline vào xô Non-Volley Zone',
      'Drill Fast-Hands phản xạ bóng tốc độ cao tại lưới Kitchen'
    ];

    selfAssessDUPR({
      studentId: targetStudent.id,
      duprScore: calculatedResult.duprScore,
      metrics: selectedScores,
      notes: `Học viên ${targetStudent.full_name} tự thực hiện bài test chuẩn hóa DUPR. Điểm mạnh: ${calculatedResult.topStrength.title.split('(')[0]} (${selectedScores[calculatedResult.topStrength.key]}/10). Điểm cần cải thiện: ${calculatedResult.topWeakness.title.split('(')[0]} (${selectedScores[calculatedResult.topWeakness.key]}/10).`,
      recommendedDrills: drills
    });

    setSaveNotice(`Đã cập nhật DUPR ${calculatedResult.duprScore} vào hồ sơ của ${targetStudent.full_name}!`);
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const currentQ = ASSESSMENT_QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Tiêu Chuẩn DUPR Toàn Cầu
                </span>
                <span className="bg-white/10 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Dành Cho Tất Cả Học Viên Mới
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">Chấm Điểm & Thẩm Định Trình Độ DUPR</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector Bar & Mode Switcher */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Đang chấm điểm cho:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const userObj = users.find(u => u.id === e.target.value);
                if (userObj) setCurrentUser(userObj);
              }}
              className="font-bold bg-white text-emerald-900 border border-emerald-300 rounded-xl px-3 py-1 cursor-pointer focus:outline-emerald-600"
            >
              {users.filter(u => u.role === 'student').map(s => (
                <option key={s.id} value={s.id}>
                  {s.full_name} {s.dupr_rating ? `(DUPR ${s.dupr_rating})` : '(Chưa có DUPR)'} - {s.location || 'TP.HCM'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl font-bold text-[11px]">
            <button
              onClick={() => {
                setAssessmentMode('quiz');
                setIsCompleted(false);
              }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                assessmentMode === 'quiz' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bài Khảo Sát 6 Câu
            </button>
            <button
              onClick={() => {
                setAssessmentMode('slider');
                setIsCompleted(true);
              }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                assessmentMode === 'slider' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thanh Trượt Chấm Nhanh
            </button>
          </div>
        </div>

        {/* Save Notice Banner */}
        {saveNotice && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveNotice}</span>
            </div>
            <button onClick={() => setSaveNotice(null)} className="text-white/80 hover:text-white underline">Đóng</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ========================================================= */}
          {/* MODE 1: STEP-BY-STEP QUIZ (NOT COMPLETED YET) */}
          {/* ========================================================= */}
          {assessmentMode === 'quiz' && !isCompleted && (
            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      {currentStep + 1}
                    </span>
                    Câu {currentStep + 1} / {ASSESSMENT_QUESTIONS.length}
                  </span>
                  <span className="text-slate-400">
                    {Math.round(((currentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100)}% hoàn thành
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1">
                  {currentQ.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* 4 Options */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-600">
                  Chọn mức độ mô tả chính xác nhất khả năng thực tế của bạn trên sân:
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedScores[currentQ.key] === opt.score;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQ.key, opt.score)}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-xs mt-0.5 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}>
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-slate-900 leading-snug">
                              {opt.text}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                              ~{opt.score < 4 ? '2.0-2.5' : opt.score < 6 ? '3.0-3.5' : opt.score < 8 ? '4.0-4.5' : '5.0+'} DUPR
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  onClick={() => {
                    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      setIsCompleted(true);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentStep === ASSESSMENT_QUESTIONS.length - 1 ? 'Xem Kết Quả DUPR' : 'Câu tiếp theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 2: RESULTS VIEW & QUICK SLIDER ADJUSTMENT */}
          {/* ========================================================= */}
          {(isCompleted || assessmentMode === 'slider') && (
            <div className="space-y-6">
              
              {/* Grand Score Display Box */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Kết Quả Thẩm Định Trình Độ Tức Thì
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {targetStudent.full_name}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      Dựa trên 6 thông số kỹ thuật thực tế theo chuẩn đánh giá DUPR Quốc Tế & USAP.
                    </p>
                  </div>

                  {/* Big DUPR Score Badge */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[200px] shadow-lg">
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Điểm Trình Độ DUPR
                    </div>
                    <div className="text-5xl font-black text-white my-1 flex items-baseline justify-center gap-1">
                      <span>{calculatedResult.duprScore.toFixed(1)}</span>
                      <span className="text-emerald-400 text-lg font-bold">DUPR</span>
                    </div>
                    <div className={`text-[11px] font-extrabold px-3 py-1 rounded-full mt-1 ${calculatedResult.tierColor}`}>
                      {calculatedResult.tierLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
                    <Flame className="w-4 h-4 text-emerald-600" />
                    <span>Điểm Mạnh Nổi Bật Nhất:</span>
                  </div>
                  <div className="font-bold text-sm text-emerald-950">
                    {calculatedResult.topStrength.title.split('(')[0]}
                  </div>
                  <div className="text-xs text-emerald-800 mt-1">
                    Điểm số: <strong className="text-emerald-900">{selectedScores[calculatedResult.topStrength.key]}/10</strong> — Bạn có lợi thế kiểm soát rất tốt ở kỹ năng này!
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs mb-1">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Kỹ Năng Cần Khắc Phục Ngay:</span>
                  </div>
                  <div className="font-bold text-sm text-amber-950">
                    {calculatedResult.topWeakness.title.split('(')[0]}
                  </div>
                  <div className="text-xs text-amber-800 mt-1">
                    Điểm số: <strong className="text-amber-900">{selectedScores[calculatedResult.topWeakness.key]}/10</strong> — Nên chọn HLV tập trung kèm riêng mục này để tăng nhanh DUPR.
                  </div>
                </div>
              </div>

              {/* 6 Skill Breakdown Sliders */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span>Chi Tiết Điểm 6 Kỹ Năng Cốt Lõi (Kéo để tinh chỉnh):</span>
                  </h4>
                  <button
                    onClick={() => {
                      setIsCompleted(false);
                      setCurrentStep(0);
                      setAssessmentMode('quiz');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Làm lại bài khảo sát</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {ASSESSMENT_QUESTIONS.map(q => {
                    const score = selectedScores[q.key] || 5.0;
                    const percent = (score / 10) * 100;
                    return (
                      <div key={q.key} className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{q.title}</span>
                            <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">({q.subtitle})</span>
                          </div>
                          <span className="font-black text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                            {score.toFixed(1)} / 10
                          </span>
                        </div>

                        {/* Slider control */}
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min="2.0"
                            max="10.0"
                            step="0.5"
                            value={score}
                            onChange={(e) => {
                              setSelectedScores(prev => ({
                                ...prev,
                                [q.key]: parseFloat(e.target.value)
                              }));
                            }}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Save & Explore */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleSaveResult}
                    className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Lưu DUPR {calculatedResult.duprScore} Vào Hồ Sơ Học Viên</span>
                  </button>

                  {onViewClasses && (
                    <button
                      onClick={() => {
                        handleSaveResult();
                        onClose();
                        onViewClasses();
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Xem Lớp Phù Hợp Trình Độ</span>
                    </button>
                  )}

                  {onViewCoaches && (
                    <button
                      onClick={() => {
                        handleSaveResult();
                        onClose();
                        onViewCoaches();
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Award className="w-4 h-4" />
                      <span>Tìm HLV DUPR</span>
                    </button>
                  )}
                </div>

                <div className="text-center text-[11px] text-slate-500">
                  Sau khi lưu, điểm DUPR sẽ tự động hiển thị trong hồ sơ cá nhân và danh sách quản lý lớp học.
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
