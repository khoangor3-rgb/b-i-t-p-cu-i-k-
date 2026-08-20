import React from 'react';
import { 
  Award, TrendingUp, Target, CheckCircle2, 
  Sparkles, Calendar, BookOpen, ChevronRight, BarChart3, HelpCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentDUPRProfile: React.FC<{ 
  onFindCoach: () => void;
  onOpenSelfAssessment?: () => void;
}> = ({ onFindCoach, onOpenSelfAssessment }) => {
  const { currentUser, skillRatings, bookings } = useApp();

  // Find assessments for current student
  const studentAssessments = currentUser ? skillRatings.filter(s => s.student_id === currentUser.id) : skillRatings.slice(0, 1);
  const latestAssessment = studentAssessments[0];

  const currentDupr = currentUser?.dupr_rating || 3.0;

  // Tier calculation
  const getDuprTier = (rating: number) => {
    if (rating < 2.5) return { label: 'Trình Độ Nhập Môn • DUPR 2.0 - 2.5', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (rating < 3.5) return { label: 'Trình Độ Trung Cấp • DUPR 3.0 - 3.5', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (rating < 4.5) return { label: 'Trình Độ Nâng Cao • DUPR 4.0 - 4.5', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'Trình Độ Bán Chuyên • DUPR 5.0+', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' };
  };

  const tier = getDuprTier(currentDupr);

  const skillsConfig = [
    { key: 'serve_and_return', label: 'Phát bóng & Trả giao bóng', desc: 'Độ sâu bóng và điểm rơi an toàn' },
    { key: 'dinking_control', label: 'Kiểm soát bóng ngắn Kitchen', desc: 'Độ mềm tay, xoáy bóng tại vạch Kitchen' },
    { key: 'third_shot_drop', label: 'Cú đánh thứ ba Drop & Drive', desc: 'Thả bóng võng vào Kitchen để tiến lưới' },
    { key: 'volleys_and_resets', label: 'Bắt Volley & Đỡ đập bóng Resets', desc: 'Phản xạ tốc độ cao và giảm lực bóng nhanh' },
    { key: 'court_positioning', label: 'Vị trí & Di chuyển sân Footwork', desc: 'Phối hợp nhịp nhàng với đồng đội' },
    { key: 'match_strategy', label: 'Chiến thuật trận đấu & Khai thác sơ hở', desc: 'Khai thác điểm yếu đối thủ và chọn thời điểm tăng tốc' }
  ];

  const studentName = currentUser?.full_name || 'Học Viên Khách';
  const avatarUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80';
  const email = currentUser?.email || 'khach@pickleconnect.vn';
  const createdAt = currentUser?.created_at || '01/2026';

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={studentName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover object-top ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black">{studentName}</h1>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Học viên
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 mb-2">
                Tham gia: {createdAt} • Email: {email}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Mục tiêu: Đạt chuẩn DUPR 3.5+ trong 3 tháng tới</span>
              </div>
            </div>
          </div>

          {/* DUPR Rating Box */}
          <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl flex flex-col items-center sm:items-end justify-center">
            <span className="text-xs text-emerald-200 uppercase tracking-widest font-bold">
              Chỉ số DUPR Toàn Cầu
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white my-1 flex items-baseline gap-1">
              <span>{currentDupr.toFixed(1)}</span>
              <span className="text-emerald-400 text-lg font-bold">DUPR</span>
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${tier.bg} ${tier.color}`}>
              {tier.label}
            </div>

            {onOpenSelfAssessment && (
              <button
                onClick={onOpenSelfAssessment}
                className="mt-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Tự Chấm Điểm DUPR Mới</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DUPR Skills Assessment Matrix & Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 6 Core Skills Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Bảng Đánh Giá 6 Kỹ Năng Cốt Lõi (Theo My DUPR Coach)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Điểm số được Huấn luyện viên thẩm định sau các buổi tập thực tế
              </p>
            </div>
            {latestAssessment && (
              <span className="text-[11px] text-gray-400">
                Đánh giá: {latestAssessment.assessed_at}
              </span>
            )}
          </div>

          {/* Skill Bars */}
          <div className="space-y-4">
            {skillsConfig.map(skill => {
              const score = latestAssessment ? latestAssessment.metrics[skill.key as keyof typeof latestAssessment.metrics] : 6.0;
              const percentage = (score / 10) * 100;
              
              let barColor = 'bg-emerald-500';
              if (score < 6) barColor = 'bg-amber-500';
              if (score >= 8) barColor = 'bg-emerald-600';

              return (
                <div key={skill.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{skill.label}</span>
                      <span className="text-gray-400 text-[11px] block">{skill.desc}</span>
                    </div>
                    <span className="font-black text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                      {score.toFixed(1)} / 10
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coach Notes */}
          {latestAssessment && (
            <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Nhận xét chuyên môn từ {latestAssessment.coach_name}:
                </span>
                <span className="text-[11px] text-emerald-700">{latestAssessment.assessed_at}</span>
              </div>
              <p className="text-emerald-800 leading-relaxed italic">
                "{latestAssessment.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Right: Personalized Training Drills Roadmap (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Lộ Trình Bài Tập Đề Xuất (Roadmap)</span>
            </h3>
            <p className="text-xs text-gray-500">
              HLV đã thiết kế các bài tập bổ trợ để khắc phục điểm yếu và tối ưu hóa DUPR cho bạn:
            </p>

            <div className="space-y-2.5">
              {(latestAssessment?.recommended_drills || [
                'Drill 7-11: Luyện Dink chéo sân 100 bóng liên tục',
                'Drill Third Shot Drop từ Baseline vào xô Kitchen',
                'Drill Fast-Hands phản xạ bóng tốc độ cao tại lưới'
              ]).map((drill, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1 font-medium text-gray-800 leading-relaxed">
                    {drill}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onFindCoach}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Đặt Lịch HLV Luyện Bài Tập Này</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DUPR Level Explanation Guide */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Hệ thống DUPR Rating là gì?</span>
            </div>
            <p className="text-emerald-100/80 leading-relaxed">
              DUPR (Dynamic Universal Pickleball Rating) là thang điểm xếp hạng chuẩn hóa toàn cầu từ 2.0 đến 6.0+. Tại PickleConnect, các HLV đạt chuẩn DUPR Assessor sẽ thẩm định chính xác trình độ và định hướng thi đấu cho bạn.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
