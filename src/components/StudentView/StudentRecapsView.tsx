import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, TrendingUp, Calendar, MapPin, 
  Clock, ShieldCheck, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';

interface StudentRecapsViewProps {
  studentId?: string;
}

export const StudentRecapsView: React.FC<StudentRecapsViewProps> = ({ studentId }) => {
  const { currentUser, getStudentRecaps, sessionRecaps } = useApp();

  const targetStudentId = studentId || currentUser?.id || 'user_student_1';
  const recaps = getStudentRecaps(targetStudentId);

  const [selectedRecapId, setSelectedRecapId] = useState<string | null>(
    recaps.length > 0 ? recaps[0].id : null
  );

  // Calculate average scores across all recaps
  const avgScores = (() => {
    if (recaps.length === 0) {
      return { serve: 0, dink: 0, volley: 0, positioning: 0, overall: 0 };
    }
    const totalServe = recaps.reduce((acc, r) => acc + r.skill_serve, 0);
    const totalDink = recaps.reduce((acc, r) => acc + r.skill_dink, 0);
    const totalVolley = recaps.reduce((acc, r) => acc + r.skill_volley, 0);
    const totalPos = recaps.reduce((acc, r) => acc + r.skill_positioning, 0);
    const count = recaps.length;

    const serve = +(totalServe / count).toFixed(1);
    const dink = +(totalDink / count).toFixed(1);
    const volley = +(totalVolley / count).toFixed(1);
    const pos = +(totalPos / count).toFixed(1);
    const overall = +((serve + dink + volley + pos) / 4).toFixed(1);

    return { serve, dink, volley, positioning: pos, overall };
  })();

  const activeRecap = recaps.find(r => r.id === selectedRecapId) || recaps[0];

  return (
    <div className="space-y-6" id="student-recaps-view">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-emerald-200 mb-2">
              <Sparkles size={14} />
              <span>Theo dõi tiến bộ kỹ năng chính thống</span>
            </div>
            <h2 className="text-2xl font-bold">Hồ sơ Session Recaps & Đánh giá 4 Kỹ năng</h2>
            <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
              Tổng hợp nhận xét chi tiết và chấm điểm kỹ năng trực tiếp từ các Huấn luyện viên sau mỗi buổi học đã hoàn thành.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-300">
                {avgScores.overall > 0 ? avgScores.overall : '--'}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-medium">Điểm TB / 5.0</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">{recaps.length}</div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-medium">Buổi có Recap</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Skills Summary Radar / Bar Metrics */}
      {recaps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Serve & Return</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                {avgScores.serve} / 5.0
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(avgScores.serve / 5) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Độ sâu, quỹ đạo và độ xoáy giao bóng</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Kitchen Dink</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                {avgScores.dink} / 5.0
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(avgScores.dink / 5) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Kiểm soát lực mềm & dink chéo góc NVZ</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Volley & Reset</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full">
                {avgScores.volley} / 5.0
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(avgScores.volley / 5) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Phản xạ bắt volley & chặn cú smash</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Footwork & Pos</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                {avgScores.positioning} / 5.0
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(avgScores.positioning / 5) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Bộ chân di chuyển & vị trí đứng đôi</p>
          </div>
        </div>
      )}

      {/* Recaps List & Active Details */}
      {recaps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có Session Recap nào</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Sau khi hoàn thành buổi học với Huấn luyện viên, HLV sẽ gửi nhận xét chi tiết và chấm điểm 4 kỹ năng chính tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of Recap Sessions */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-600" />
              <span>Danh sách các buổi học ({recaps.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {recaps.map((recap) => {
                const isSelected = activeRecap?.id === recap.id;
                const avg = ((recap.skill_serve + recap.skill_dink + recap.skill_volley + recap.skill_positioning) / 4).toFixed(1);

                return (
                  <div
                    key={recap.id}
                    id={`recap-item-${recap.id}`}
                    onClick={() => setSelectedRecapId(recap.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={recap.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                          alt={recap.coach_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800">{recap.coach_name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar size={12} />
                            <span>{recap.booking_date || recap.created_at}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {avg} ★
                        </span>
                        {recap.is_late && (
                          <div className="text-[10px] text-amber-600 font-medium mt-1">Recap sau 7 ngày</div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 bg-slate-50/80 p-2 rounded-lg italic">
                      "{recap.note}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Selected Recap Card */}
          {activeRecap && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeRecap.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                    alt={activeRecap.coach_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                      <ShieldCheck size={12} />
                      <span>Huấn luyện viên phụ trách</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{activeRecap.coach_name}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {activeRecap.booking_date || 'Buổi tập gần đây'}
                      </span>
                      {activeRecap.booking_court && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {activeRecap.booking_court}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Thời điểm gửi</div>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mt-0.5 justify-end">
                    <Clock size={12} />
                    <span>{activeRecap.created_at}</span>
                  </div>
                  {activeRecap.is_late && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium mt-1.5">
                      <AlertCircle size={10} />
                      <span>Gửi sau 7 ngày</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed 4-Skill Score Breakdown */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <span>Đánh giá chi tiết 4 Kỹ năng</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">1. Serve & Return</span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {activeRecap.skill_serve} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(activeRecap.skill_serve / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Độ chuẩn xác giao bóng và kiểm soát bóng dài.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">2. Kitchen Dink</span>
                      <span className="text-xs font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        {activeRecap.skill_dink} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${(activeRecap.skill_dink / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Cảm giác tay mềm, dink qua lưới rơi sát chân.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">3. Volley & Block</span>
                      <span className="text-xs font-extrabold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                        {activeRecap.skill_volley} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${(activeRecap.skill_volley / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Phản xạ trên lưới, cú đỡ bóng mạnh và reset vào bếp.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">4. Footwork & Vị trí</span>
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        {activeRecap.skill_positioning} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(activeRecap.skill_positioning / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Di chuyển đồng bộ đôi, bám vạch NVZ và phân chia sân.</p>
                  </div>
                </div>
              </div>

              {/* Coach Note & Recommendations */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-emerald-600" />
                  <span>Lời nhận xét & Hướng dẫn rèn luyện từ HLV</span>
                </h5>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 text-sm text-slate-800 leading-relaxed">
                  {activeRecap.note}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
