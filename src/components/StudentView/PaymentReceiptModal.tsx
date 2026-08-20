import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, X, Clock, 
  RotateCcw, DollarSign, ArrowRight, ShieldAlert, FileText, Check, Copy
} from 'lucide-react';
import { Payment, Booking } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentReceiptModalProps {
  payment?: Payment;
  booking?: Booking;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  booking,
  onClose
}) => {
  const { disputePayment, cancelBooking, currentUser } = useApp();
  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!payment && !booking) return null;

  const currentPayment = payment || {
    id: 'pay_sample',
    booking_id: booking?.id || '',
    student_id: booking?.student_id || '',
    student_name: booking?.student_name || '',
    coach_id: booking?.coach_id || '',
    coach_name: booking?.coach_name || '',
    amount: booking?.total_price || 0,
    commission_rate: 0.10,
    commission_amount: Math.round((booking?.total_price || 0) * 0.10),
    payout_amount: (booking?.total_price || 0) - Math.round((booking?.total_price || 0) * 0.10),
    status: (booking?.status === 'completed' ? 'released' : booking?.status === 'cancelled' ? 'refunded' : 'held') as any,
    paid_at: booking?.created_at || 'Vừa xong',
    payment_method: 'qr_escrow' as any
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    disputePayment(currentPayment.id, disputeReason.trim());
    setIsDisputing(false);
    setDisputeSuccess(true);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'held':
        return {
          label: 'Đang tạm giữ an toàn trong Quỹ Escrow',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          desc: 'Số tiền đang được giữ tại Quỹ Bảo Chứng PickleConnect. Tiền chỉ được giải ngân cho HLV sau khi buổi học hoàn tất.'
        };
      case 'released':
        return {
          label: 'Đã giải ngân cho HLV (Hoàn tất)',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          desc: 'Buổi học đã hoàn thành. Học phí đã được khấu trừ 10% phí dịch vụ và thanh toán 90% vào tài khoản của HLV.'
        };
      case 'refunded':
        return {
          label: 'Đã hoàn tiền 100% cho Học viên',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
          desc: 'Theo chính sách Love Your Lesson Guarantee hoặc thỏa thuận hủy lịch, toàn bộ số tiền đã được hoàn trả.'
        };
      case 'disputed':
        return {
          label: 'Đang khiếu nại (Admin đang thụ lý)',
          badgeClass: 'bg-red-50 text-red-800 border-red-200',
          desc: 'Học viên đã mở yêu cầu khiếu nại. Quỹ Escrow đã bị khóa để Ban Quản Trị xác minh và phân xử trong 24h.'
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          desc: ''
        };
    }
  };

  const statusInfo = getStatusDisplay(currentPayment.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Biên Lai Giao Dịch Escrow</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Chi Tiết Thanh Toán & Bảo Chứng
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">Mã giao dịch:</span>
            <span className="font-mono text-xs text-amber-300 font-bold">{currentPayment.id}</span>
            <button
              onClick={() => handleCopy(currentPayment.id)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert Box */}
          <div className={`p-4 rounded-2xl border ${statusInfo.badgeClass} space-y-1`}>
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{statusInfo.label}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {statusInfo.desc}
            </p>
            {currentPayment.dispute_reason && (
              <div className="mt-2 pt-2 border-t border-red-200 text-xs text-red-900">
                <strong>Lý do khiếu nại:</strong> {currentPayment.dispute_reason}
              </div>
            )}
            {currentPayment.admin_resolution_notes && (
              <div className="mt-2 pt-2 border-t border-emerald-200 text-xs text-emerald-950">
                <strong>Ghi chú phân xử của Admin:</strong> {currentPayment.admin_resolution_notes}
              </div>
            )}
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Học viên:</span>
              <span className="font-bold text-slate-900">{currentPayment.student_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Huấn luyện viên:</span>
              <span className="font-bold text-slate-900">{currentPayment.coach_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Phương thức thanh toán:</span>
              <span className="font-semibold text-slate-800">
                {currentPayment.payment_method === 'qr_escrow' ? 'VietQR Tự Động (Escrow)' : currentPayment.payment_method === 'pickle_wallet' ? 'Ví Tín Thác PicklePay' : 'Thẻ Quốc Tế Visa/Mastercard'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Thời gian ký quỹ:</span>
              <span className="font-medium text-slate-800">{currentPayment.paid_at}</span>
            </div>
            {currentPayment.released_at && (
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Thời gian giải ngân HLV:</span>
                <span className="font-medium text-emerald-700">{currentPayment.released_at}</span>
              </div>
            )}
            {currentPayment.refunded_at && (
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Thời gian hoàn tiền:</span>
                <span className="font-medium text-purple-700">{currentPayment.refunded_at}</span>
              </div>
            )}

            {/* Financial Math */}
            <div className="pt-1 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Tổng học phí thanh toán:</span>
                <span className="font-bold text-slate-900">{currentPayment.amount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Phí dịch vụ nền tảng ({Math.round(currentPayment.commission_rate * 100)}%):</span>
                <span>{currentPayment.commission_amount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-xs pt-1 border-t border-slate-200">
                <span>Số tiền HLV thực nhận (90%):</span>
                <span>{currentPayment.payout_amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* Dispute Notice if success */}
          {disputeSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã gửi khiếu nại tới Ban Quản Trị thành công! Quỹ Escrow đã được khóa lại.</span>
            </div>
          )}

          {/* Dispute Input Section */}
          {isDisputing && (
            <form onSubmit={handleSubmitDispute} className="space-y-3 bg-red-50/70 border border-red-200 rounded-2xl p-4">
              <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Mở Yêu Cầu Khiếu Nại & Yêu Cầu Hoàn Tiền Escrow</span>
              </div>
              <p className="text-[11px] text-red-800">
                Theo cam kết "Love Your Lesson Guarantee", bạn được quyền yêu cầu hoàn trả 100% học phí nếu HLV vắng mặt, không đạt chất lượng hoặc vi phạm cam kết buổi học.
              </p>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Vui lòng nêu rõ lý do (VD: HLV không đến sân, hoặc buổi học không đúng cam kết...)"
                rows={3}
                required
                className="w-full bg-white text-xs border border-red-300 rounded-xl p-2.5 outline-none placeholder:text-gray-400"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisputing(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Xác Nhận Gửi Khiếu Nại
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          {/* Dispute button for students when status is held or completed */}
          {currentPayment.status === 'held' && !isDisputing && (
            <button
              type="button"
              onClick={() => setIsDisputing(true)}
              className="text-xs text-red-600 hover:text-red-800 font-semibold underline cursor-pointer flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Khiếu nại / Yêu cầu hoàn tiền Escrow</span>
            </button>
          )}

          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng biên lai
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
