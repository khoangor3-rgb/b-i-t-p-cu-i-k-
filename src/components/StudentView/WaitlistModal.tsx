import React, { useState } from 'react';
import { CoachProfile, AvailabilitySlot } from '../../types';
import { useApp } from '../../context/AppContext';
import { Users, Clock, MapPin, X, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface WaitlistModalProps {
  coach: CoachProfile;
  slot?: AvailabilitySlot;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  coach,
  slot,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, joinWaitlist, waitlistEntries } = useApp();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const slotKey = slot?.id || `coach_${coach.id}_general`;
  const dateStr = slot?.date || new Date().toISOString().split('T')[0];
  const timeStr = slot ? `${slot.start_time} - ${slot.end_time}` : '17:00 - 18:30';
  const courtStr = slot?.court_name || 'Sân Pickleball Chuẩn Quốc Tế';
  const sessionSummary = `${coach.user?.full_name || 'HLV'} - Ca ${timeStr}`;

  // Check current queue count
  const currentQueueCount = waitlistEntries.filter(
    w => w.booking_id === slotKey && (w.status === 'waiting' || w.status === 'offered')
  ).length;

  const handleJoin = () => {
    if (!currentUser) {
      setErrorMessage('Vui lòng đăng nhập tài khoản học viên để tham gia hàng chờ.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const result = joinWaitlist({
      booking_id: slotKey,
      coach_id: coach.id,
      date: dateStr,
      time: timeStr,
      court_name: courtStr,
      session_summary: sessionSummary,
      price: coach.price_per_session || 400000
    });

    setIsSubmitting(false);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Gia nhập Danh sách chờ (Waitlist)</h3>
              <p className="text-xs text-orange-100">Cơ chế giữ chỗ FIFO ưu tiên tự động</p>
            </div>
          </div>
          <button
            id="close-waitlist-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
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

          {/* Coach & Slot info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={coach.user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                alt={coach.user?.full_name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{coach.user?.full_name}</h4>
                <div className="text-xs text-slate-500">{coach.teaching_style || 'HLV Pickleball Chuyên nghiệp'}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400" />
                <span>Thời gian: <strong>{dateStr} ({timeStr})</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-slate-400" />
                <span>Địa điểm: <strong>{courtStr}</strong></span>
              </div>
            </div>
          </div>

          {/* How Waitlist Works */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Sparkles size={14} className="text-amber-600" />
              <span>Quy trình hoạt động:</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-[11px] leading-relaxed text-amber-800">
              <li>Bạn sẽ được xếp vào hàng chờ theo thứ tự nộp (vị trí dự kiến: <strong>#{currentQueueCount + 1}</strong>).</li>
              <li>Khi có học viên khác hủy lịch, hệ thống sẽ <strong>tự động gửi thông báo</strong> cho bạn.</li>
              <li>Bạn có <strong>2 giờ</strong> để bấm "Xác nhận nhận suất". Quá 2 giờ suất sẽ được chuyển cho người tiếp theo.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-waitlist-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              id="confirm-join-waitlist-btn"
              onClick={handleJoin}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Users size={14} />
              <span>{isSubmitting ? 'Đang tham gia...' : `Xác nhận giữ chỗ (#${currentQueueCount + 1})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
