import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, XCircle, 
  AlertCircle, Star, Phone, Mail, ShieldAlert, MessageSquare, 
  ChevronRight, RefreshCw, Sparkles, Filter, ShieldCheck, FileText, Lock, RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus, Payment } from '../../types';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { RescheduleModal } from './RescheduleModal';
import { CancellationModal } from './CancellationModal';

interface StudentBookingsProps {
  onOpenReviewModal: (booking: Booking) => void;
  onExploreCoaches: () => void;
}

export const StudentBookings: React.FC<StudentBookingsProps> = ({ 
  onOpenReviewModal,
  onExploreCoaches
}) => {
  const { currentUser, bookings, cancelBooking, getPaymentForBooking } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [selectedReceiptData, setSelectedReceiptData] = useState<{ payment?: Payment; booking?: Booking } | null>(null);
  const [rescheduleTargetBooking, setRescheduleTargetBooking] = useState<Booking | null>(null);
  const [cancellationTargetBooking, setCancellationTargetBooking] = useState<Booking | null>(null);

  // Filter bookings for current student
  const myBookings = currentUser ? bookings.filter(b => b.student_id === currentUser.id) : [];

  const filteredBookings = myBookings.filter(b => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const handleLoveLessonClaim = (booking: Booking) => {
    const payment = getPaymentForBooking(booking.id);
    setSelectedReceiptData({ payment, booking });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            Chờ HLV xác nhận
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã xác nhận lịch
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            Đang diễn ra (Check-in)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Đã hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            Đã hủy
          </span>
        );
    }
  };

  const getPaymentBadge = (payment?: Payment) => {
    if (!payment) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          Ký quỹ Escrow
        </span>
      );
    }

    switch (payment.status) {
      case 'held':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full" title="Tiền đang được giữ an toàn trong quỹ tín thác">
            <Lock className="w-3 h-3 text-amber-600" />
            Tạm giữ Escrow
          </span>
        );
      case 'released':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full" title="Đã giải ngân cho HLV sau buổi học">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Đã thanh toán HLV
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-800 border border-purple-200 font-semibold px-2 py-0.5 rounded-full" title="Đã hoàn tiền 100% về tài khoản học viên">
            <RotateCcw className="w-3 h-3 text-purple-600" />
            Đã hoàn tiền
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-800 border border-red-200 font-semibold px-2 py-0.5 rounded-full" title="Đang trong quá trình ban quản trị thụ lý khiếu nại">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Đang khiếu nại
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lịch Học Của Tôi</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {myBookings.length} đơn đặt chỗ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Quản lý các buổi tập đã đăng ký, đổi lịch linh hoạt hoặc yêu cầu bảo hành hài lòng 100%.
          </p>
        </div>

        <button
          onClick={onExploreCoaches}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tìm & Đặt Thêm HLV</span>
        </button>
      </div>

      {claimSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{claimSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả', count: myBookings.length },
            { id: 'pending', label: 'Chờ xác nhận', count: myBookings.filter(b => b.status === 'pending').length },
            { id: 'confirmed', label: 'Sắp diễn ra', count: myBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length },
            { id: 'completed', label: 'Đã hoàn thành', count: myBookings.filter(b => b.status === 'completed').length },
            { id: 'cancelled', label: 'Đã hủy', count: myBookings.filter(b => b.status === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === tab.id 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">Chưa có buổi học nào</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Khám phá danh sách các Huấn luyện viên tiêu chuẩn trên PickleConnect và bắt đầu nâng hạng DUPR ngay hôm nay!
          </p>
          <button
            onClick={onExploreCoaches}
            className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition cursor-pointer inline-flex items-center gap-1"
          >
            <span>Khám phá huấn luyện viên</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div 
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Coach & Booking Info */}
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={booking.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80'}
                  alt={booking.coach_name}
                  className="w-14 h-14 rounded-2xl object-cover object-top ring-2 ring-emerald-100 shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {booking.coach_name}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-lg inline-block">
                    {/\(\s*\d+\s*buổi\s*\)/i.test(booking.package_title)
                      ? booking.package_title
                      : `${booking.package_title} (${booking.session_count} buổi)`}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 pt-1">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="break-words whitespace-normal">{booking.date} • {booking.start_time} - {booking.end_time}</span>
                    </div>

                    <div className="flex items-start gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="break-words whitespace-normal leading-snug">{booking.court_name}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg mt-1 italic border border-gray-100">
                      Ghi chú: "{booking.notes}"
                    </div>
                  )}

                  {booking.cancellation_reason && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mt-1 border border-red-100">
                      Lý do hủy: {booking.cancellation_reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Actions Column */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-[11px] text-gray-400">Tổng học phí Ký Quỹ</div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {booking.total_price.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="mt-1">
                    {getPaymentBadge(getPaymentForBooking(booking.id))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Receipt Modal Trigger */}
                  <button
                    onClick={() => {
                      const payment = getPaymentForBooking(booking.id);
                      setSelectedReceiptData({ payment, booking });
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1"
                    title="Xem chi tiết giao dịch Escrow và quyền bảo chứng"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Biên lai</span>
                  </button>

                  {/* Actions for Pending */}
                  {booking.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      {(booking.reschedule_count || 0) < 1 ? (
                        <button
                          onClick={() => setRescheduleTargetBooking(booking)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition cursor-pointer flex items-center gap-1"
                          title="Đổi sang khung giờ khác (tối đa 1 lần, trước 12h)"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Đổi lịch</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          Đã dời (1/1)
                        </span>
                      )}

                      <button
                        onClick={() => setCancellationTargetBooking(booking)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition cursor-pointer"
                      >
                        Hủy lịch
                      </button>
                    </div>
                  )}

                  {/* Actions for Confirmed */}
                  {booking.status === 'confirmed' && (
                    <div className="flex items-center gap-2">
                      {(booking.reschedule_count || 0) < 1 ? (
                        <button
                          onClick={() => setRescheduleTargetBooking(booking)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition cursor-pointer flex items-center gap-1"
                          title="Đổi sang khung giờ khác (tối đa 1 lần, trước 12h)"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Đổi lịch</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          Đã dời (1/1)
                        </span>
                      )}

                      <button
                        onClick={() => setCancellationTargetBooking(booking)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition cursor-pointer"
                        title="Hủy lịch với chính sách hoàn tiền theo mốc thời gian"
                      >
                        Hủy lịch
                      </button>

                      <a
                        href={`tel:0908123456`}
                        className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                        title="Gọi điện cho HLV"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Actions for Completed */}
                  {booking.status === 'completed' && (
                    <div className="flex flex-col sm:flex-row items-end gap-2">
                      {!booking.has_reviewed ? (
                        <button
                          onClick={() => onOpenReviewModal(booking)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Đánh giá HLV</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-medium flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã đánh giá
                        </span>
                      )}

                      <button
                        onClick={() => handleLoveLessonClaim(booking)}
                        className="text-[11px] text-gray-500 hover:text-emerald-700 underline cursor-pointer"
                        title="Chính sách bảo hành hài lòng 100%"
                      >
                        Bảo hành bài học
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Receipt Modal */}
      {selectedReceiptData && (
        <PaymentReceiptModal
          payment={selectedReceiptData.payment}
          booking={selectedReceiptData.booking}
          onClose={() => setSelectedReceiptData(null)}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleTargetBooking && (
        <RescheduleModal
          isOpen={!!rescheduleTargetBooking}
          booking={rescheduleTargetBooking}
          onClose={() => setRescheduleTargetBooking(null)}
          onSuccess={() => {
            setClaimSuccessMsg('Đổi lịch thành công! Khung giờ mới đã được cập nhật.');
            setTimeout(() => setClaimSuccessMsg(''), 5000);
          }}
        />
      )}

      {/* Tiered Refund Cancellation Modal */}
      {cancellationTargetBooking && (
        <CancellationModal
          booking={cancellationTargetBooking}
          onClose={() => setCancellationTargetBooking(null)}
          onSuccess={(msg) => {
            setClaimSuccessMsg(msg);
            setTimeout(() => setClaimSuccessMsg(''), 5000);
          }}
        />
      )}
    </div>
  );
};
