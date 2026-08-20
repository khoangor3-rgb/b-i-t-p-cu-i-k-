import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Calendar, Clock, MapPin, AlertCircle, 
  CheckCircle, ArrowRight, ShieldCheck, RotateCcw 
} from 'lucide-react';
import { Booking } from '../../types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess?: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess
}) => {
  const { slots, rescheduleBooking } = useApp();
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  // Filter available slots of the same coach
  const availableSlots = slots.filter(
    s => s.coach_id === booking.coach_id && !s.is_booked && s.id !== booking.slot_id
  );

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedSlotId) {
      setErrorMsg('Vui lòng chọn một khung giờ mới!');
      return;
    }

    setIsSubmitting(true);
    const result = rescheduleBooking(booking.id, selectedSlotId);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessMsg(result.message);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    }
  };

  return (
    <div id="reschedule_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="reschedule_modal_content"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Đổi Lịch Học (Reschedule)
              </h2>
              <p className="text-xs text-amber-100/90">
                Chuyển buổi học sang khung giờ khả dụng khác của Huấn luyện viên
              </p>
            </div>
          </div>
          <button 
            id="btn_close_reschedule_modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleReschedule} className="p-6 overflow-y-auto space-y-4">
          {/* Policy banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chính sách đổi lịch bảo đảm Escrow:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800/90 pl-1">
              <li>Mỗi buổi học chỉ được phép đổi lịch <strong>tối đa 1 lần</strong>.</li>
              <li>Chỉ áp dụng đổi lịch trước giờ học <strong>tối thiểu 12 tiếng</strong>.</li>
              <li>Học phí được <strong>bảo lưu 100%</strong> trong quỹ Escrow cho đến khi buổi học hoàn tất.</li>
            </ul>
          </div>

          {/* Current Booking Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lịch học hiện tại:
            </span>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{booking.date}</span>
                <Clock className="w-4 h-4 text-emerald-600 ml-2" />
                <span>{booking.start_time} - {booking.end_time}</span>
              </div>
            </div>
            <div className="flex items-center text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <span className="truncate">{booking.court_name}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              HLV: <span className="font-semibold text-slate-700">{booking.coach_name}</span> • Gói: <span className="font-semibold text-slate-700">{booking.package_title}</span>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Chọn khung giờ mới khả dụng của HLV <span className="text-rose-500">*</span>
            </label>

            {availableSlots.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                HLV hiện chưa mở thêm khung giờ trống nào khác. Vui lòng liên hệ HLV hoặc thử lại sau.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                {availableSlots.map((slot, sIdx) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={`${slot.id}_${sIdx}`}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 text-amber-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          {slot.date}
                        </span>
                      </div>
                      <div className="flex items-center text-[11px] text-slate-600 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400 mr-1" />
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        {slot.court_name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting || availableSlots.length === 0 || !selectedSlotId}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <span>Xác Nhận Đổi Lịch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
