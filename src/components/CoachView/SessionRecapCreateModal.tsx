import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Award, Star, Clock, AlertTriangle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

interface SessionRecapCreateModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SessionRecapCreateModal: React.FC<SessionRecapCreateModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { createSessionRecap, getSessionRecapByBooking } = useApp();

  const existingRecap = getSessionRecapByBooking(booking.id);

  const [serveScore, setServeScore] = useState<number>(existingRecap?.skill_serve || 4);
  const [dinkScore, setDinkScore] = useState<number>(existingRecap?.skill_dink || 4);
  const [volleyScore, setVolleyScore] = useState<number>(existingRecap?.skill_volley || 3);
  const [positioningScore, setPositioningScore] = useState<number>(existingRecap?.skill_positioning || 4);
  const [note, setNote] = useState<string>(existingRecap?.note || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Check if session is > 7 days old
  const isLate = (() => {
    if (!booking.date) return false;
    const bDate = new Date(booking.date).getTime();
    const now = Date.now();
    return (now - bDate) / (1000 * 60 * 60 * 24) > 7;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!note.trim()) {
      setErrorMessage('Vui lòng nhập nhận xét và lời khuyên rèn luyện cho học viên.');
      return;
    }

    setIsSubmitting(true);
    const result = createSessionRecap({
      booking_id: booking.id,
      note: note.trim(),
      skill_serve: serveScore,
      skill_dink: dinkScore,
      skill_volley: volleyScore,
      skill_positioning: positioningScore
    });

    setIsSubmitting(false);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } else {
      setErrorMessage(result.message);
    }
  };

  const renderSkillRatingSelector = (
    id: string,
    label: string,
    description: string,
    currentVal: number,
    setter: (val: number) => void
  ) => {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span>{label}</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {currentVal} / 5
              </span>
            </div>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <div className="flex items-center gap-1" id={id}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                id={`${id}-star-${star}`}
                onClick={() => setter(star)}
                disabled={!!existingRecap}
                className={`p-1.5 rounded-lg transition-all ${
                  star <= currentVal
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                    : 'text-slate-300 hover:text-slate-400 bg-white'
                }`}
                title={`Đánh giá ${star}/5`}
              >
                <Star size={18} className={star <= currentVal ? 'fill-amber-400' : ''} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {existingRecap ? 'Chi tiết Session Recap' : 'Gửi Session Recap & Đánh giá 4 Kỹ năng'}
              </h2>
              <p className="text-xs text-emerald-100">
                Học viên: <span className="font-semibold">{booking.student_name}</span> | Ngày: {booking.date}
              </p>
            </div>
          </div>
          <button
            id="close-recap-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Late notification */}
          {isLate && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lưu ý về thời hạn:</span> Buổi học đã diễn ra quá 7 ngày. Việc gửi recap trễ có thể ảnh hưởng đến tỷ lệ phản hồi nhanh (SLA) của HLV.
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 4 Skills Scoring */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Đánh giá 4 Kỹ năng Trọng tâm (1-5 điểm)</span>
            </h3>

            {renderSkillRatingSelector(
              'skill-serve-rating',
              'Giao bóng & Trả giao (Serve / Return)',
              'Độ sâu, quỹ đạo thấp, độ xoáy và tính ổn định',
              serveScore,
              setServeScore
            )}

            {renderSkillRatingSelector(
              'skill-dink-rating',
              'Kỹ thuật Dink (Kitchen Soft Game)',
              'Cảm giác bóng mềm, kiểm soát lực dink chéo sân và dink thẳng',
              dinkScore,
              setDinkScore
            )}

            {renderSkillRatingSelector(
              'skill-volley-rating',
              'Cú đánh Volley & Đỡ đập (Reset / Block)',
              'Tốc độ phản xạ, chặn bóng đập và chuyển giao phòng thủ sang phản công',
              volleyScore,
              setVolleyScore
            )}

            {renderSkillRatingSelector(
              'skill-positioning-rating',
              'Bộ chân & Vị trí sân (Footwork / Positioning)',
              'Di chuyển tiến vạch NVZ, bao quát sân đôi và giữ khoảng cách với đồng đội',
              positioningScore,
              setPositioningScore
            )}
          </div>

          {/* Detailed Coaching Notes */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-emerald-600" />
              <span>Nhận xét chi tiết & Bài tập rèn luyện</span>
            </label>
            <textarea
              id="recap-note-input"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!!existingRecap}
              placeholder="Ghi nhận điểm mạnh của học viên, các lỗi kỹ thuật cần khắc phục và đề xuất bài tập tự luyện tại nhà..."
              className="w-full text-sm p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-600"
            />
          </div>

          {/* Existing recap metadata if viewed */}
          {existingRecap && (
            <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>Đã ghi nhận ngày: <strong>{existingRecap.created_at}</strong></span>
              </div>
              {existingRecap.is_late && (
                <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                  Gửi sau 7 ngày
                </span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              id="cancel-recap-btn"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              {existingRecap ? 'Đóng' : 'Để sau'}
            </button>
            {!existingRecap && (
              <button
                type="submit"
                id="submit-recap-btn"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Award size={16} />
                <span>{isSubmitting ? 'Đang lưu...' : 'Lưu & Gửi Recap'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
