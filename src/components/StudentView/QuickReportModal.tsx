import React, { useState } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, Flag, Send, CheckCircle2, 
  User, MessageSquare, Info, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportReasonCategory } from '../../types';

interface QuickReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserRole?: string;
  bookingId?: string | null;
  bookingSummary?: string;
  onSuccess?: () => void;
}

export const QuickReportModal: React.FC<QuickReportModalProps> = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  reportedUserRole = 'coach',
  bookingId = null,
  bookingSummary,
  onSuccess
}) => {
  const { currentUser, createReport } = useApp();
  const [reasonCategory, setReasonCategory] = useState<ReportReasonCategory>('inappropriate_behavior');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isSelf = currentUser?.id === reportedUserId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSelf) {
      setError('Lỗi xác thực: Bạn không thể tự gửi báo cáo vi phạm đối với chính tài khoản của mình!');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError('Vui lòng cung cấp mô tả chi tiết lý do báo cáo (tối thiểu 10 ký tự).');
      return;
    }

    setIsSubmitting(true);
    const res = createReport({
      reported_user_id: reportedUserId,
      booking_id: bookingId,
      reason_category: reasonCategory,
      description: description.trim()
    });

    setIsSubmitting(false);

    if (!res.success) {
      setError(res.message);
    } else {
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        setDescription('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Báo Cáo Hành Vi & Vi Phạm</h3>
              <p className="text-xs text-slate-400">Kênh tiếp nhận khiếu nại phi tài chính & chuẩn mực cộng đồng</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Báo Cáo Đã Được Tiếp Nhận</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Cảm ơn bạn đã đóng góp xây dựng môi trường Pickleball văn minh. Ban Quản Trị sẽ xác minh và phản hồi trong 24 giờ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Self-reporting warning */}
            {isSelf && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Quy tắc chống gian lận:</span> Bạn không thể tự tạo báo cáo vi phạm đối với chính tài khoản của mình.
                </div>
              </div>
            )}

            {/* Target Information Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{reportedUserName}</div>
                  <div className="text-slate-500 capitalize">Đối tượng: {reportedUserRole === 'coach' ? 'Huấn Luyện Viên' : 'Học Viên'}</div>
                </div>
              </div>
              {bookingSummary && (
                <div className="text-right max-w-[180px]">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    Buổi học liên kết
                  </span>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">{bookingSummary}</div>
                </div>
              )}
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Phân Loại Vi Phạm <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReasonCategory('inappropriate_behavior')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    reasonCategory === 'inappropriate_behavior'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Thái độ / Hành vi không chuẩn mực</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Sử dụng điện thoại, đi trễ, thiếu tôn trọng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setReasonCategory('fake_profile')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    reasonCategory === 'fake_profile'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Hồ sơ / Chứng chỉ giả mạo</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Khai khống DUPR, chứng chỉ không đúng thực tế</div>
                </button>

                <button
                  type="button"
                  onClick={() => setReasonCategory('harassment')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    reasonCategory === 'harassment'
                      ? 'border-rose-500 bg-rose-50/80 text-rose-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Quấy rối / Lời lẽ xúc phạm</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Vi phạm chuẩn mực ứng xử nghiêm trọng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setReasonCategory('other')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    reasonCategory === 'other'
                      ? 'border-slate-600 bg-slate-100 text-slate-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Vi phạm quy chế khác</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gạ gẫm giao dịch ngoài sàn, hủy ngoài giờ</div>
                </button>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mô Tả Chi Tiết Sự Việc <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể thời gian, địa điểm sân bãi và diễn biến hành vi vi phạm..."
                className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Thông tin này sẽ được bảo mật và gửi trực tiếp tới Ban Quản Trị (Support Admin).</span>
                <span>{description.length}/500</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Lưu ý quan trọng:</strong> Nếu bạn cần hoàn tiền hoặc khiếu nại tài chính do không hài lòng về chất lượng buổi học, vui lòng sử dụng tính năng <strong>"Yêu cầu Khiếu nại & Bảo hành Escrow"</strong> trong mục Lịch học.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSelf || !description.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang Gửi...' : 'Gửi Báo Cáo Vi Phạm'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
