import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, 
  MapPin, UserCheck, Play, ArrowRight, DollarSign, Award, 
  Users, Check, X, Star, FileText, ChevronRight, ShieldCheck, 
  Plus, Bell, Activity, Phone, Video, HelpCircle, Eye, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking, CoachProfile, User, SessionRecap } from '../../types';
import { AtTheCourtModeModal } from './AtTheCourtModeModal';
import { SessionRecapCreateModal } from './SessionRecapCreateModal';
import { PublicCoachProfilePreviewModal } from './PublicCoachProfilePreviewModal';

interface CoachDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onNavigateTab }) => {
  const { 
    currentUser, coaches, bookings, slots, reviews, payments, users,
    sessionRecaps, updateBookingStatus, checkInBooking, reportNoShow,
    getCoachEarnings
  } = useApp();

  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  const coachUser = users.find(u => u.id === coach?.user_id) || currentUser;

  // Filter bookings for this coach
  const coachBookings = bookings.filter(b => b.coach_id === coach.id);
  const pendingBookings = coachBookings.filter(b => b.status === 'pending');
  const confirmedBookings = coachBookings.filter(b => b.status === 'confirmed');
  const completedBookings = coachBookings.filter(b => b.status === 'completed');

  // Today's date string
  const todayStr = new Date().toISOString().substring(0, 10);
  const todaySessions = coachBookings.filter(b => b.date === todayStr && (b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'completed'));
  
  // If no sessions today, find closest upcoming
  const upcomingSessions = coachBookings
    .filter(b => b.date >= todayStr && b.status === 'confirmed')
    .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));

  // Next immediate session
  const nextSession = todaySessions.find(b => b.status === 'confirmed' || b.status === 'in_progress') || upcomingSessions[0];

  // Completed sessions without a session recap
  const completedWithoutRecap = completedBookings.filter(b => 
    !sessionRecaps.some(r => r.booking_id === b.id)
  );

  // Earnings calculations
  const earningsData = getCoachEarnings(coach.id);

  // Modals
  const [atCourtSession, setAtCourtSession] = useState<Booking | null>(null);
  const [recapBooking, setRecapBooking] = useState<Booking | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Quick Action feedback
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Decline Booking Modal
  const [decliningBooking, setDecliningBooking] = useState<Booking | null>(null);
  const [declineReason, setDeclineReason] = useState('Trùng lịch thi đấu hoặc bận đột xuất');
  const [declineNote, setDeclineNote] = useState('');

  // Confirmation Quick Modal
  const [confirmingBooking, setConfirmingBooking] = useState<Booking | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleConfirmBookingSubmit = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    setConfirmingBooking(null);
    showToast('✓ Đã xác nhận booking thành công! Lịch dạy đã được cập nhật vào thời khóa biểu.');
  };

  const handleDeclineBookingSubmit = () => {
    if (!decliningBooking) return;
    const finalReason = declineNote.trim() ? `${declineReason} - ${declineNote.trim()}` : declineReason;
    updateBookingStatus(decliningBooking.id, 'rejected', finalReason);
    setDecliningBooking(null);
    showToast('Đã từ chối booking và hệ thống đã hoàn lại 100% học phí Escrow cho học viên.');
  };

  const handleCheckInQuick = (bookingId: string) => {
    checkInBooking(bookingId, 'coach');
    showToast('✓ Đã xác nhận Check-in buổi học trên sân thành công!');
  };

  // Profile completeness calculation
  let completeness = 50;
  if (coach.bio && coach.bio.length > 30) completeness += 10;
  if (coach.certifications && coach.certifications.length > 0) completeness += 15;
  if (coach.specialties && coach.specialties.length >= 3) completeness += 10;
  if (coach.courts && coach.courts.length >= 1) completeness += 5;
  if (coach.video_intro_url) completeness += 10;

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {actionToast && (
        <div className="p-3.5 bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* TOP HEADER: Coach OS Persona Greeting & Fast Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              COACH OPERATING SYSTEM
            </span>
            <span className="text-xs text-slate-400 font-medium">
              PickleConnect Pro Workspace
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chào buổi sáng, HLV {coachUser?.full_name || 'Đăng Khoa'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {todaySessions.length > 0 
              ? `Hôm nay bạn có ${todaySessions.length} buổi học cần phụ trách trên sân.` 
              : `Lịch hôm nay thảnh thơi. Buổi học kế tiếp vào ${nextSession ? `${nextSession.date} (${nextSession.start_time})` : 'tuần này'}.`}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Xem Profile Công Khai</span>
          </button>

          <button
            onClick={() => onNavigateTab('coach_schedule')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Mở Lịch Dạy Tuần</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: TODAY / LIVE NEXT SESSION (Prominent Highlight) */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400">
              {todaySessions.length > 0 ? 'BUỔI HỌC HÔM NAY (TODAY SESSIONS)' : 'BUỔI HỌC KẾ TIẾP (NEXT UPCOMING SESSION)'}
            </h2>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {todaySessions.length} buổi hôm nay • {pendingBookings.length} booking chờ duyệt
          </div>
        </div>

        {nextSession ? (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Session Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold font-mono">
                  {nextSession.date === todayStr ? 'HÔM NAY' : nextSession.date} • {nextSession.start_time} – {nextSession.end_time}
                </span>

                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700">
                  {nextSession.package_title}
                </span>

                {nextSession.check_in_time && (
                  <span className="px-2.5 py-0.5 bg-emerald-900 text-emerald-300 text-[11px] font-bold rounded-lg flex items-center gap-1">
                    ✓ Đã Check-in sân
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <img
                  src={nextSession.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt=""
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500/50"
                />
                <div>
                  <div className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Học viên: {nextSession.student_name}</span>
                    <span className="text-xs font-normal text-slate-400">({nextSession.student_phone || '0901234567'})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{nextSession.court_name}</span>
                  </div>
                </div>
              </div>

              {nextSession.notes && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                  <strong className="text-slate-100">Yêu cầu từ học viên:</strong> "{nextSession.notes}"
                </div>
              )}
            </div>

            {/* Instant Operational CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => setAtCourtSession(nextSession)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Bật Chế Độ Sân Đấu (At Court)</span>
              </button>

              <div className="flex items-center gap-2">
                {!nextSession.check_in_time && (
                  <button
                    onClick={() => handleCheckInQuick(nextSession.id)}
                    className="flex-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Check-in nhanh</span>
                  </button>
                )}

                <button
                  onClick={() => setRecapBooking(nextSession)}
                  className="flex-1 px-3.5 py-2 bg-purple-900/60 hover:bg-purple-900 text-purple-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-purple-700/50"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-300" />
                  <span>Viết Session Recap</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Hiện không có buổi học nào sắp diễn ra</h4>
            <p className="text-xs text-slate-400">Hãy thêm khung giờ rảnh để học viên đặt lịch mới.</p>
            <button
              onClick={() => onNavigateTab('coach_schedule')}
              className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              + Thêm Khung Giờ Rảnh
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: ACTION CENTER / NEEDS ATTENTION (Task-oriented) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Action Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Việc Cần Bạn Xử Lý (Needs Your Attention)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {pendingBookings.length + completedWithoutRecap.length} việc đang chờ
            </span>
          </div>

          {/* Action List */}
          <div className="space-y-3">
            
            {/* 1. Pending Booking Requests */}
            {pendingBookings.length > 0 && pendingBookings.map(b => (
              <div key={b.id} className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <img
                    src={b.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>Yêu cầu đặt buổi học mới từ <strong>{b.student_name}</strong></span>
                      <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                        MỚI
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {b.date} • {b.start_time} – {b.end_time} • {b.package_title} • Học phí: <strong>{b.total_price.toLocaleString('vi-VN')} đ</strong> (Ký quỹ Escrow)
                    </div>
                    {b.notes && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">"{b.notes}"</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setDecliningBooking(b)}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-semibold rounded-xl border border-rose-200 transition cursor-pointer"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => setConfirmingBooking(b)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Xác Nhận Lịch
                  </button>
                </div>
              </div>
            ))}

            {/* 2. Unfinished Session Recaps */}
            {completedWithoutRecap.length > 0 && completedWithoutRecap.slice(0, 2).map(b => (
              <div key={b.id} className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      Chưa viết Session Recap cho buổi học với <strong>{b.student_name}</strong>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Buổi học ngày {b.date} • Đánh giá 4 kỹ năng giúp học viên theo dõi tiến độ DUPR
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setRecapBooking(b)}
                  className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  Viết Recap ngay
                </button>
              </div>
            ))}

            {/* 3. Profile Incomplete Prompt if < 100% */}
            {completeness < 100 && (
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                    {completeness}%
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      Hồ sơ HLV hoàn thiện {completeness}% (Profile Completeness)
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {!coach.video_intro_url ? 'Thêm video clip thị phạm bài tập & giới thiệu phương pháp dạy' : 'Cập nhật thêm chứng chỉ quốc tế để nhận huy hiệu Top Rated'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('coach_profile')}
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  Bổ sung hồ sơ
                </button>
              </div>
            )}

            {pendingBookings.length === 0 && completedWithoutRecap.length === 0 && completeness === 100 && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 text-xs">
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="font-bold text-slate-800">Tất cả tác vụ đã hoàn tất!</div>
                <div className="text-slate-500">Bạn đã xác nhận toàn bộ lịch và cập nhật đầy đủ recap bài học.</div>
              </div>
            )}

          </div>
        </div>

        {/* Right 1 Col: Mini Wallet & Financial Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Thu Nhập & Escrow (4 Con Số Cốt Lõi)
            </h3>
            <button
              onClick={() => onNavigateTab('coach_earnings')}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Chi tiết →
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            
            {/* 1. Available to withdraw */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase">
                Tiền có thể rút ngay (Available)
              </div>
              <div className="text-xl font-black text-emerald-900">
                {earningsData.totalEarnings.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-emerald-700">
                Đã khấu trừ 10% phí sàn • Rút về tài khoản 24/7
              </div>
            </div>

            {/* 2 & 3: Pending Escrow + Upcoming */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Đang giữ Escrow</div>
                <div className="font-black text-slate-900 text-sm">{earningsData.pendingEscrow.toLocaleString('vi-VN')} đ</div>
                <div className="text-[9px] text-amber-600 font-medium">Bảo chứng sàn</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Tổng đã dạy</div>
                <div className="font-black text-slate-900 text-sm">{completedBookings.length} buổi</div>
                <div className="text-[9px] text-emerald-700 font-medium">100% hoàn thành</div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('coach_earnings')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quản Lý Ví & Rút Tiền</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECTION 3: UPCOMING 7 DAYS SCHEDULE (Compact Preview) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Lịch Dạy Sắp Tới (Upcoming Sessions)</h3>
            <p className="text-xs text-slate-500">Các buổi học đã xác nhận trong tuần</p>
          </div>
          <button
            onClick={() => onNavigateTab('coach_schedule')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Xem lịch chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Chưa có lịch dạy sắp tới</div>
            <p className="text-xs text-slate-400">Hãy tạo thêm khung giờ rảnh để đón học viên mới.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingSessions.slice(0, 6).map(s => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition text-xs space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                    {s.date}
                  </span>
                  <span className="font-semibold text-slate-600">{s.start_time} – {s.end_time}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <img src={s.student_avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                  <div>
                    <div className="font-bold text-slate-900">{s.student_name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{s.court_name}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{s.package_title}</span>
                  <button
                    onClick={() => setAtCourtSession(s)}
                    className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    Vào sân →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CONFIRMATION MODAL (Lightweight) */}
      {/* ======================================================== */}
      {confirmingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">Xác nhận nhận buổi học này?</h3>
            </div>
            
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-700">
              <div>Học viên: <strong className="text-slate-900">{confirmingBooking.student_name}</strong></div>
              <div>Thời gian: <strong>{confirmingBooking.date} ({confirmingBooking.start_time} – {confirmingBooking.end_time})</strong></div>
              <div>Địa điểm: <strong>{confirmingBooking.court_name}</strong></div>
              <div>Học phí: <strong className="text-emerald-700">{confirmingBooking.total_price.toLocaleString('vi-VN')} đ</strong> (Escrow)</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmingBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleConfirmBookingSubmit(confirmingBooking.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Xác Nhận Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DECLINE MODAL WITH REQUIRED REASON (Section 13) */}
      {/* ======================================================== */}
      {decliningBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">Từ chối yêu cầu đặt chỗ</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Vui lòng chọn lý do từ chối để hệ thống gửi thông báo rõ ràng cho học viên <strong>{decliningBooking.student_name}</strong>:
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Trùng lịch thi đấu hoặc bận đột xuất',
                'Địa điểm sân không thuận tiện di chuyển',
                'Trình độ học viên không khớp chuyên môn lớp',
                'Lý do cá nhân khác'
              ].map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReason === reason}
                    onChange={() => setDeclineReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-medium text-slate-800">{reason}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Ghi chú bổ sung cho học viên (không bắt buộc):</label>
              <textarea
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                placeholder="VD: HLV xin lỗi vì tuần này đi thi đấu giải VPA, hẹn bạn tuần sau..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDecliningBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleDeclineBookingSubmit}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AT THE COURT FOCUS MODE MODAL */}
      {atCourtSession && (
        <AtTheCourtModeModal
          session={atCourtSession}
          onClose={() => setAtCourtSession(null)}
          onCheckIn={(id) => handleCheckInQuick(id)}
          onCompleteSession={(b) => setRecapBooking(b)}
          onReportNoShow={(id) => {
            reportNoShow(id, 'coach', 'Học viên vắng mặt không lý do');
            showToast('Đã gửi biên bản báo cáo No-show của học viên lên Admin.');
          }}
        />
      )}

      {/* SESSION RECAP CREATE MODAL */}
      {recapBooking && (
        <SessionRecapCreateModal
          booking={recapBooking}
          onClose={() => setRecapBooking(null)}
        />
      )}

      {/* PUBLIC PROFILE PREVIEW MODAL */}
      {isPreviewOpen && (
        <PublicCoachProfilePreviewModal
          coach={coach}
          user={coachUser}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

    </div>
  );
};
