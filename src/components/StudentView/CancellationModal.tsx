import React, { useState } from 'react';
import { 
  X, AlertTriangle, CheckCircle2, RotateCcw, Clock, 
  ShieldCheck, Info, ArrowRight, DollarSign 
} from 'lucide-react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';

interface CancellationModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  const { calculateRefund, cancelBooking } = useApp();
  const [reason, setReason] = useState('Học viên có việc đột xuất không thể tham gia');

  // Calculate dynamic refund
  const refundInfo = calculateRefund(booking);

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, reason);
    onSuccess(`Đã hủy lịch thành công! Học viên được hoàn ${refundInfo.refundPercent}% (${refundInfo.refundAmount.toLocaleString('vi-VN')}đ) về ví.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-gray-900">Xác Nhận Hủy Lịch Buổi Học</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
          <div className="font-bold text-gray-900 text-sm">{booking.package_title}</div>
          <div className="text-gray-600">Huấn luyện viên: <strong className="text-gray-800">{booking.coach_name}</strong></div>
          <div className="text-gray-600">Thời gian: <strong>{booking.date} ({booking.start_time} - {booking.end_time})</strong></div>
          <div className="text-gray-600">Sân tập: {booking.court_name}</div>
          <div className="text-gray-900 font-bold pt-1 border-t border-gray-200 flex justify-between">
            <span>Tổng học phí Escrow đã đóng:</span>
            <span className="text-emerald-700">{booking.total_price.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Refund Policy Calculation Breakdown */}
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs space-y-3 text-purple-950">
          <div className="flex items-center justify-between font-bold text-purple-900">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Thời gian còn lại: ~{Math.max(0, Math.round(refundInfo.hoursRemaining))} giờ</span>
            </span>
            <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded text-[11px] font-mono">
              Chính sách áp dụng
            </span>
          </div>

          <p className="text-purple-800 text-[11px] leading-relaxed">
            {refundInfo.policyDescription}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-200/80">
            <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Hoàn trả học viên ({refundInfo.refundPercent}%)</div>
              <div className="text-base font-black text-purple-900">{refundInfo.refundAmount.toLocaleString('vi-VN')}đ</div>
              <div className="text-[10px] text-purple-700">Tự động hoàn về số dư ví</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Thù lao HLV ({100 - refundInfo.refundPercent}%)</div>
              <div className="text-base font-black text-emerald-700">{refundInfo.coachAmount.toLocaleString('vi-VN')}đ</div>
              <div className="text-[10px] text-emerald-700">Đền bù thời gian giữ sân</div>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy lịch:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-medium outline-none cursor-pointer mb-2"
          >
            <option value="Học viên có việc đột xuất không thể tham gia">Học viên có việc đột xuất không thể tham gia</option>
            <option value="Thời tiết mưa bão sân không đủ điều kiện">Thời tiết mưa bão sân không đủ điều kiện</option>
            <option value="Muốn đổi sang huấn luyện viên khác">Muốn đổi sang huấn luyện viên khác</option>
            <option value="Lý do sức khỏe cá nhân">Lý do sức khỏe cá nhân</option>
            <option value="Khác">Lý do khác...</option>
          </select>

          {reason === 'Khác' && (
            <textarea
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do cụ thể..."
              rows={2}
              className="w-full text-xs p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold cursor-pointer"
          >
            Giữ lại lịch học
          </button>
          <button
            onClick={handleConfirmCancel}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xác Nhận Hủy & Hoàn Tiền</span>
          </button>
        </div>

      </div>
    </div>
  );
};
