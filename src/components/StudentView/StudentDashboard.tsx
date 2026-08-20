import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, XCircle, 
  AlertCircle, Star, Phone, Mail, ShieldAlert, MessageSquare, 
  ChevronRight, RefreshCw, Sparkles, Filter, ShieldCheck, FileText, 
  Lock, RotateCcw, Award, TrendingUp, DollarSign, User, Flag,
  GraduationCap, BellRing, AlertTriangle, ArrowRight, Shield,
  Layers, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus, Payment, CoachProfile } from '../../types';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { RescheduleModal } from './RescheduleModal';
import { CancellationModal } from './CancellationModal';
import { QuickReportModal } from './QuickReportModal';
import { StudentRecapsView } from './StudentRecapsView';
import { StudentWaitlistView } from './StudentWaitlistView';

interface StudentDashboardProps {
  onOpenReviewModal: (booking: Booking) => void;
  onExploreCoaches: () => void;
  onSelectCoach?: (coach: CoachProfile) => void;
  onOpenSelfAssessment?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onOpenReviewModal,
  onExploreCoaches,
  onSelectCoach,
  onOpenSelfAssessment
}) => {
  const { 
    currentUser, 
    bookings, 
    coaches, 
    sessionRecaps,
    waitlistEntries,
    getPaymentForBooking, 
    getStudentStats,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'recaps' | 'waitlist' | 'finance'>('upcoming');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [selectedReceiptData, setSelectedReceiptData] = useState<{ payment?: Payment; booking?: Booking } | null>(null);
  const [rescheduleTargetBooking, setRescheduleTargetBooking] = useState<Booking | null>(null);
  const [cancellationTargetBooking, setCancellationTargetBooking] = useState<Booking | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    userId: string;
    userName: string;
    userRole?: string;
    bookingId?: string | null;
    bookingSummary?: string;
  } | null>(null);

  // IDOR Protection: Always retrieve bookings and stats strictly for the logged-in student
  const studentId = currentUser?.id || '';
  const myBookings = bookings.filter(b => b.student_id === studentId);
  const stats = getStudentStats(studentId);

  // Student specific recaps and waitlists
  const myRecaps = sessionRecaps.filter(r => r.student_id === studentId);
  const myWaitlist = waitlistEntries.filter(w => w.student_id === studentId && (w.status === 'waiting' || w.status === 'offered'));

  // Filter lists
  const upcomingBookings = myBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'pending'
  ).sort((a, b) => (a.slot?.date || '').localeCompare(b.slot?.date || ''));

  const historyBookings = myBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected' || b.status === 'no_show'
  );

  const getCoach = (coachId: string) => coaches.find(c => c.id === coachId);
  const getCoachUser = (coachId: string) => {
    const coach = getCoach(coachId);
    if (!coach) return null;
    return users.find(u => u.id === coach.user_id);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Chờ HLV xác nhận
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Sắp diễn ra (Đã xác nhận)
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            Đang diễn ra trên sân
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Đã hoàn thành
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Vắng mặt (No-Show)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Đã hủy lịch
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            HLV từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER SUMMARY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Lịch Học & Hoạt Động Của Tôi
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              Học Viên
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý lịch học sắp tới, xem tóm tắt tiến bộ kỹ thuật sau buổi học và kiểm tra trạng thái thanh toán Escrow an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExploreCoaches}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt Thêm Buổi Học Mới</span>
          </button>
        </div>
      </div>

      {/* 2. 4 CORE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Buổi học sắp tới</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {upcomingBookings.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Đã lên lịch</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Buổi học hoàn thành</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {stats.completedLessons}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Đã cấp chứng nhận</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bảo chứng Escrow</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {stats.totalSpent.toLocaleString('vi-VN')} đ
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% An toàn</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trình độ DUPR</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {currentUser?.dupr_rating ? currentUser.dupr_rating.toFixed(1) : '3.0'}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Trung cấp DUPR</span>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'upcoming'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sắp Tới ({upcomingBookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Lịch Sử ({historyBookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recaps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recaps'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-purple-600" />
          <span>Recap Buổi Học ({myRecaps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('waitlist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'waitlist'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BellRing className="w-3.5 h-3.5 text-amber-600" />
          <span>Danh Sách Chờ ({myWaitlist.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'finance'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Thanh Toán & Escrow</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      
      {/* 4A. UPCOMING TAB */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-slate-800">Không có buổi học sắp tới</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tìm kiếm Huấn luyện viên chuyên nghiệp và đặt lịch học để bắt đầu hành trình nâng cao DUPR.
              </p>
              <button
                onClick={onExploreCoaches}
                className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Khám Phá Huấn Luyện Viên
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((b) => {
                const coach = getCoach(b.coach_id);
                const coachUser = getCoachUser(b.coach_id);
                const payment = getPaymentForBooking(b.id);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 shadow-xs transition p-5 sm:p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                          alt={coachUser?.full_name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{coachUser?.full_name}</h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          </div>
                          <p className="text-xs text-slate-500">
                            {b.package_title} • DUPR HLV: {coach?.dupr_level.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(b.status)}
                      </div>
                    </div>

                    {/* Schedule & Logistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Ngày học</span>
                          <span className="font-bold text-slate-900 break-words whitespace-normal leading-snug">
                            {b.slot?.date || b.date || 'Hôm nay'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 min-w-0">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Thời gian</span>
                          <span className="font-bold text-slate-900 break-words whitespace-normal leading-snug">
                            {b.slot ? `${b.slot.start_time} - ${b.slot.end_time}` : (b.start_time && b.end_time ? `${b.start_time} - ${b.end_time}` : (b.start_time || 'Chưa xếp giờ'))}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 min-w-0">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Địa điểm sân</span>
                          <span className="font-bold text-slate-900 break-words whitespace-normal leading-snug block">
                            {b.court_name || b.slot?.court_name || (b.notes?.startsWith('[Sân:') ? b.notes.split(']')[0].replace('[Sân: ', '') : '') || coach?.area || 'Sân Pickleball tiêu chuẩn'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Student Notes / Goal if available */}
                    {b.notes && !b.notes.startsWith('[Sân:') && (
                      <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 flex items-start gap-2.5">
                        <div className="text-amber-700 font-bold shrink-0 text-[11px] mt-0.5 flex items-center gap-1">
                          <span>🎯 Ghi chú & Mục tiêu:</span>
                        </div>
                        <div className="text-slate-700 font-medium break-words whitespace-normal flex-1 leading-relaxed">
                          {b.notes}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Học phí {b.total_price.toLocaleString('vi-VN')} đ được bảo chứng trong Escrow</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {b.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setRescheduleTargetBooking(b)}
                              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                            >
                              Đổi Giờ Học
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancellationTargetBooking(b)}
                              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                            >
                              Hủy Buổi Học
                            </button>
                          </>
                        )}
                        {payment && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptData({ payment, booking: b })}
                            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                          >
                            Biên Lai Thu Tiền
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4B. HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-slate-800">Chưa có lịch sử buổi học</h3>
              <p className="text-xs text-slate-500 mt-1">
                Các buổi học đã hoàn thành sẽ hiển thị tại đây kèm tóm tắt và đánh giá.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyBookings.map((b) => {
                const coach = getCoach(b.coach_id);
                const coachUser = getCoachUser(b.coach_id);
                const isCompleted = b.status === 'completed';

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                        alt={coachUser?.full_name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">{coachUser?.full_name}</span>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 break-words whitespace-normal leading-relaxed">
                          {b.slot?.date || b.date} ({b.slot ? `${b.slot.start_time} - ${b.slot.end_time}` : `${b.start_time} - ${b.end_time}`}) • <span className="font-semibold text-slate-700">{b.court_name || b.slot?.court_name || coach?.area || 'Sân tiêu chuẩn'}</span> • {b.total_price.toLocaleString('vi-VN')} đ
                        </p>
                        {b.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic break-words whitespace-normal">
                            Ghi chú: {b.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => onOpenReviewModal(b)}
                          className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>Đánh Giá HLV</span>
                        </button>
                      )}
                      {coach && onSelectCoach && (
                        <button
                          type="button"
                          onClick={() => onSelectCoach(coach)}
                          className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                        >
                          Đặt Lại Buổi Mới
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4C. RECAPS TAB */}
      {activeTab === 'recaps' && (
        <StudentRecapsView
          onExploreCoaches={onExploreCoaches}
          onSelectCoach={onSelectCoach}
        />
      )}

      {/* 4D. WAITLIST TAB */}
      {activeTab === 'waitlist' && (
        <StudentWaitlistView
          onExploreCoaches={onExploreCoaches}
        />
      )}

      {/* 4E. FINANCE & ESCROW TAB */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Cơ Chế Bảo Vệ Học Viên & Quỹ Tạm Giữ Escrow</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Toàn bộ học phí bạn thanh toán được lưu trữ an toàn trong ví Escrow trung gian. Tiền chỉ được giải ngân cho HLV sau khi buổi học hoàn thành và bạn không có khiếu nại.
            </p>
          </div>

          {/* Dispute / Issue Reporting Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 text-xs block">Bạn gặp vấn đề về buổi học hoặc HLV vắng mặt?</span>
              <span className="text-[11px] text-slate-500">PickleConnect hỗ trợ hoàn tiền 100% theo chính sách bảo vệ học viên.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setReportTarget({
                  userId: 'system_admin',
                  userName: 'Admin PickleConnect',
                  userRole: 'admin',
                  bookingSummary: 'Yêu cầu kiểm tra & hoàn tiền Escrow'
                });
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              Gửi Yêu Cầu Hỗ Trợ / Hoàn Phí
            </button>
          </div>

          {/* Payment History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold">Mã GD</th>
                  <th className="p-3 font-bold">Buổi Học / HLV</th>
                  <th className="p-3 font-bold">Số Tiền</th>
                  <th className="p-3 font-bold">Phương Thức</th>
                  <th className="p-3 font-bold">Trạng Thái Escrow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myBookings.map((b) => {
                  const coach = getCoach(b.coach_id);
                  const coachUser = getCoachUser(b.coach_id);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.id.slice(0, 8)}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{coachUser?.full_name}</span>
                        <span className="text-[11px] text-slate-400">{b.package_title}</span>
                      </td>
                      <td className="p-3 font-black text-slate-900">
                        {b.total_price.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-3 font-medium">QR Escrow</td>
                      <td className="p-3">
                        {b.status === 'completed' ? (
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            Đã giải ngân
                          </span>
                        ) : b.status === 'cancelled' ? (
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Đã hoàn tiền
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Đang tạm giữ an toàn
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-modals */}
      {selectedReceiptData && (
        <PaymentReceiptModal
          payment={selectedReceiptData.payment}
          booking={selectedReceiptData.booking}
          onClose={() => setSelectedReceiptData(null)}
        />
      )}

      {rescheduleTargetBooking && (
        <RescheduleModal
          booking={rescheduleTargetBooking}
          onClose={() => setRescheduleTargetBooking(null)}
          onSuccess={(msg) => {
            setSuccessMsg(msg);
            setRescheduleTargetBooking(null);
          }}
        />
      )}

      {cancellationTargetBooking && (
        <CancellationModal
          booking={cancellationTargetBooking}
          onClose={() => setCancellationTargetBooking(null)}
          onSuccess={(msg) => {
            setSuccessMsg(msg);
            setCancellationTargetBooking(null);
          }}
        />
      )}

      {reportTarget && (
        <QuickReportModal
          reportedUserId={reportTarget.userId}
          reportedUserName={reportTarget.userName}
          reportedUserRole={reportTarget.userRole}
          bookingId={reportTarget.bookingId}
          bookingSummary={reportTarget.bookingSummary}
          onClose={() => setReportTarget(null)}
          onSuccess={(msg) => {
            setSuccessMsg(msg);
            setReportTarget(null);
          }}
        />
      )}

    </div>
  );
};
