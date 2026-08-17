import React, { useState } from 'react';
import { 
  X, Award, Sparkles, CheckCircle2, TrendingUp, 
  Send, Target, BookOpen 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CoachAssessmentModalProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CoachAssessmentModal: React.FC<CoachAssessmentModalProps> = ({
  studentId,
  studentName,
  onClose,
  onSuccess
}) => {
  const { currentUser, submitSkillAssessment } = useApp();

  // Metrics (1 to 10)
  const [metrics, setMetrics] = useState({
    serve_and_return: 7.0,
    dinking_control: 6.5,
    third_shot_drop: 6.0,
    volleys_and_resets: 6.5,
    court_positioning: 7.0,
    match_strategy: 6.5
  });

  // Calculate estimated DUPR score from metrics (e.g. 2.0 to 5.5)
  const metricValues = Object.values(metrics) as number[];
  const avgMetric = metricValues.reduce((a, b) => a + b, 0) / 6;
  const estimatedDupr = Number((2.0 + (avgMetric / 10) * 2.8).toFixed(1));

  const [notes, setNotes] = useState('Học viên có bộ chân tốt và tiếp thu nhanh. Cần chú trọng độ võng khi thực hiện Third Shot Drop để tránh bị đối phương bắt lưới.');
  const [drill1, setDrill1] = useState('Drill 7-11: Luyện Dink chéo sân 100 bóng liên tục');
  const [drill2, setDrill2] = useState('Drill Third Shot Drop từ vạch Baseline vào xô Kitchen');
  const [drill3, setDrill3] = useState('Drill Fast-Hands phản xạ bóng tốc độ cao tại vạch Kitchen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitSkillAssessment({
      student_id: studentId,
      student_name: studentName,
      coach_id: currentUser?.id || 'coach-1',
      coach_name: currentUser?.full_name || 'HLV Pickleball',
      dupr_score: estimatedDupr,
      metrics,
      notes,
      recommended_drills: [drill1, drill2, drill3].filter(d => d.trim().length > 0)
    });

    onSuccess();
    onClose();
  };

  const handleMetricChange = (key: keyof typeof metrics, val: number) => {
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center border border-emerald-400/40">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Chấm Trình Độ DUPR & Ra Lộ Trình</h2>
              <p className="text-xs text-emerald-200">Đánh giá kỹ năng cho học viên: <strong>{studentName}</strong></p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* Estimated DUPR display */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Điểm DUPR Ước Tính Sau Buổi Học:
              </span>
              <span className="text-xs text-emerald-600">
                Dựa trên điểm trung bình 6 tiêu chuẩn kỹ năng bên dưới
              </span>
            </div>
            <div className="flex items-baseline gap-1 text-3xl font-black text-emerald-900">
              <span>{estimatedDupr.toFixed(1)}</span>
              <span className="text-sm font-bold text-emerald-600">DUPR</span>
            </div>
          </div>

          {/* 6 Skill Sliders */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Thang Điểm 6 Kỹ Năng Cốt Lõi (1 - 10)</span>
            </h3>

            {[
              { key: 'serve_and_return', label: 'Phát bóng & Trả giao bóng (Serve & Return)' },
              { key: 'dinking_control', label: 'Kiểm soát bóng ngắn (Dinking Control)' },
              { key: 'third_shot_drop', label: 'Cú đánh thứ ba (Third Shot Drop)' },
              { key: 'volleys_and_resets', label: 'Bắt Volley & Đỡ đập bóng (Resets)' },
              { key: 'court_positioning', label: 'Vị trí & Di chuyển sân (Footwork)' },
              { key: 'match_strategy', label: 'Chiến thuật trận đấu (Strategy)' },
            ].map(item => (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{item.label}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {metrics[item.key as keyof typeof metrics].toFixed(1)} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={metrics[item.key as keyof typeof metrics]}
                  onChange={(e) => handleMetricChange(item.key as keyof typeof metrics, Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nhận xét chuyên môn & Điểm mạnh / Yếu</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>

          {/* Recommended Drills */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">Lộ trình 3 bài tập đề xuất (Drills Roadmap)</label>
            <input
              type="text"
              value={drill1}
              onChange={(e) => setDrill1(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium outline-none"
            />
            <input
              type="text"
              value={drill2}
              onChange={(e) => setDrill2(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium outline-none"
            />
            <input
              type="text"
              value={drill3}
              onChange={(e) => setDrill3(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium outline-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Đánh Giá DUPR Cho Học Viên</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
