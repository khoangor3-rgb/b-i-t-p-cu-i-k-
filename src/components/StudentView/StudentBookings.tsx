import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, XCircle, 
  AlertCircle, Star, Phone, Mail, ShieldAlert, MessageSquare, 
  ChevronRight, RefreshCw, Sparkles, Filter 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';

interface StudentBookingsProps {
  onOpenReviewModal: (booking: Booking) => void;
  onExploreCoaches: () => void;
}

export const StudentBookings: React.FC<StudentBookingsProps> = ({ 
  onOpenReviewModal,
  onExploreCoaches
}) => {
  const { currentUser, bookings, cancelBooking } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  // Filter bookings for current student
  const myBookings = currentUser ? bookings.filter(b => b.student_id === currentUser.id) : [];

  const filteredBookings = myBookings.filter(b => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu đặt lịch này không? Khung giờ sẽ được mở lại cho người khác.')) {
      cancelBooking(bookingId, 'Học viên chủ động hủy hẹn');
    }
  };

  const handleLoveLessonClaim = (booking: Booking) => {
    setClaimSuccessMsg(`Yêu cầu bảo hành bài học cho buổi ngày ${booking.date} đã được gửi tới Ban Quản Trị PickleConnect! Đội ngũ hỗ trợ sẽ liên hệ với bạn trong 24h.`);
    setTimeout(() => setClaimSuccessMsg(''), 6000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lịch Sử Bài Học Của Bạn</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {myBookings.length} buổi đã đặt
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Theo dõi trạng thái các buổi học Pickleball 1-1 và gửi đánh giá chất lượng cho HLV.
          </p>
        </div>

        <button
          onClick={onExploreCoaches}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Đặt Thêm Buổi Học Mới</span>
        </button>
      </div>

      {/* Claim Success Notification */}
      {claimSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-bold">Cam kết "Love Your Lesson Guarantee":</strong>
            {claimSuccessMsg}
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: 'Tất cả buổi học', count: myBookings.length },
          { id: 'pending', label: 'Chờ xác nhận', count: myBookings.filter(b => b.status === 'pending').length },
          { id: 'confirmed', label: 'Đã xác nhận', count: myBookings.filter(b => b.status === 'confirmed').length },
          { id: 'completed', label: 'Đã hoàn thành', count: myBookings.filter(b => b.status === 'completed').length },
          { id: 'cancelled', label: 'Đã hủy', count: myBookings.filter(b => b.status === 'cancelled').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">Không có buổi học nào trong mục này</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Khám phá danh sách các Huấn Luyện Viên Pickleball chuẩn quốc tế và đặt lịch ngay hôm nay!
          </p>
          <button
            onClick={onExploreCoaches}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Tìm HLV ngay
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
                  src={booking.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                  alt={booking.coach_name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-100 shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {booking.coach_name}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-lg inline-block">
                    {booking.package_title} ({booking.session_count} buổi)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{booking.date} • {booking.start_time} - {booking.end_time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{booking.court_name}</span>
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
                  <div className="text-[11px] text-gray-400">Tổng học phí</div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {booking.total_price.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Actions for Pending */}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition cursor-pointer"
                    >
                      Hủy yêu cầu
                    </button>
                  )}

                  {/* Actions for Confirmed */}
                  {booking.status === 'confirmed' && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:0908123456`}
                        className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                        title="Gọi điện cho HLV"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => alert(`Thông tin liên hệ HLV ${booking.coach_name}:\nSĐT/Zalo: 0933.112.233\nSân tập: ${booking.court_name}\nVui lòng đến sớm 10 phút để khởi động!`)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Chi tiết sân
                      </button>
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
    </div>
  );
};
