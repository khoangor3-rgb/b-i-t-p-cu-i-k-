import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Plus, 
  Trash2, User, MapPin, AlertCircle, Sparkles, Filter,
  CheckSquare, UserX, Repeat, SlidersHorizontal, ArrowRight, ShieldCheck,
  ChevronLeft, ChevronRight, Ban, Play, FileText, Check, X, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, AvailabilitySlot, DayOfWeek, CoachAvailabilityRule, Booking } from '../../types';
import { SessionRecapCreateModal } from './SessionRecapCreateModal';

interface CoachScheduleManagerProps {
  onOpenAssessmentModal?: (studentId: string, studentName: string) => void;
}

export const CoachScheduleManager: React.FC<CoachScheduleManagerProps> = ({
  onOpenAssessmentModal
}) => {
  const { 
    currentUser, coaches, slots, bookings, availabilityRules,
    addAvailabilitySlot, deleteAvailabilitySlot, updateBookingStatus,
    addAvailabilityRule, removeAvailabilityRule, checkInBooking, reportNoShow
  } = useApp();

  const coachProfile = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  
  // Slots & bookings for this coach
  const coachSlots = slots.filter(s => s.coach_id === coachProfile.id);
  const coachBookings = bookings.filter(b => b.coach_id === coachProfile.id);
  const coachRules = availabilityRules.filter(r => r.coach_id === coachProfile.id);

  // Main Tabs: 'calendar' (Lịch Tuần & Khung Giờ), 'requests' (Hàng Đợi Booking), 'rules' (Khung Giờ Cố Định)
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests' | 'rules'>('calendar');

  // Booking requests filter
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');

  // Week selection state for Calendar View
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = next week, etc.

  // Add Slot Modal
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [newStartTime, setNewStartTime] = useState('07:00');
  const [newEndTime, setNewEndTime] = useState('08:30');
  const [newCourt, setNewCourt] = useState(coachProfile.courts?.[0] || 'Sân Saigon South Q7');
  const [toastMsg, setToastMsg] = useState('');

  // Block Time Modal (Section 20)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockDate, setBlockDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [blockStartTime, setBlockStartTime] = useState('14:00');
  const [blockEndTime, setBlockEndTime] = useState('18:00');
  const [blockReason, setBlockReason] = useState('Bận việc cá nhân / Nghỉ lễ');

  // Add Recurring Rule state
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [ruleDayOfWeek, setRuleDayOfWeek] = useState<DayOfWeek>(1);
  const [ruleStartTime, setRuleStartTime] = useState('18:00');
  const [ruleEndTime, setRuleEndTime] = useState('19:30');
  const [ruleCourt, setRuleCourt] = useState(coachProfile.courts?.[0] || 'Sân Pickleball Sala Q2');

  // Decline Booking Modal with reasons
  const [decliningBooking, setDecliningBooking] = useState<Booking | null>(null);
  const [declineReason, setDeclineReason] = useState('Trùng lịch thi đấu hoặc bận đột xuất');
  const [declineCustomNote, setDeclineCustomNote] = useState('');

  // Session Recap modal state
  const [recapBooking, setRecapBooking] = useState<Booking | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Compute 7 days of current selected week
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday + weekOffset * 7);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = getWeekDates();
  const dayNamesVN = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newStartTime || !newEndTime) return;
    addAvailabilitySlot(newDate, newStartTime, newEndTime, newCourt);
    setIsAddSlotOpen(false);
    showToast('✓ Đã mở thêm khung giờ rảnh mới thành công!');
  };

  const handleBlockTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAvailabilityRule(coachProfile.id, {
      rule_type: 'specific_date_block',
      specific_date: blockDate,
      start_time: blockStartTime,
      end_time: blockEndTime,
      court_name: blockReason,
      is_blocked: true,
      is_active: true
    });
    setIsBlockModalOpen(false);
    showToast(`✓ Đã thiết lập chặn lịch (${blockReason}) từ ${blockStartTime} đến ${blockEndTime}`);
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAvailabilityRule(coachProfile.id, {
      rule_type: 'recurring_weekly',
      day_of_week: Number(ruleDayOfWeek) as DayOfWeek,
      start_time: ruleStartTime,
      end_time: ruleEndTime,
      court_name: ruleCourt,
      is_active: true
    });
    setIsAddRuleOpen(false);
    showToast('✓ Đã lưu quy tắc khung giờ rảnh hàng tuần!');
  };

  const handleApplyRulesToSlots = () => {
    if (coachRules.length === 0) {
      showToast('Chưa có quy tắc cố định nào. Hãy tạo quy tắc trước!');
      return;
    }

    const today = new Date();
    let generatedCount = 0;
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.getDay();
      
      coachRules.filter(r => r.is_active && !r.is_blocked && r.day_of_week === day).forEach(r => {
        const dateStr = d.toISOString().substring(0, 10);
        const exists = slots.some(s => s.coach_id === coachProfile.id && s.date === dateStr && s.start_time === r.start_time);
        if (!exists) {
          addAvailabilitySlot(dateStr, r.start_time, r.end_time, r.court_name);
          generatedCount++;
        }
      });
    }
    showToast(`✓ Đã đồng bộ quy tắc và tự động tạo ${generatedCount} khung giờ rảnh trong 14 ngày tới!`);
  };

  const handleConfirmBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    showToast('✓ Đã xác nhận buổi học! Học viên nhận được thông báo ngay lập tức.');
  };

  const handleDeclineBooking = () => {
    if (!decliningBooking) return;
    const finalReason = declineCustomNote.trim() ? `${declineReason} - ${declineCustomNote.trim()}` : declineReason;
    updateBookingStatus(decliningBooking.id, 'rejected', finalReason);
    setDecliningBooking(null);
    showToast('Đã từ chối booking và hệ thống đã hoàn tiền 100% cho học viên.');
  };

  const pendingCount = coachBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-900 text-white text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER & MAIN NAVIGATION TABS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Schedule & Availability Manager
            </span>
            <span className="text-xs text-slate-400 font-medium">Quản Lý Lịch & Khung Giờ Rảnh</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Thời Khóa Biểu & Quản Lý Đặt Lịch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Quản lý trực quan các khung giờ trống, lịch đã đặt, chặn lịch bận và phê duyệt yêu cầu từ học viên.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Lịch Tuần & Khung Giờ</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Yêu Cầu Booking</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-4 h-4 text-purple-600" />
            <span>Quy Tắc Lặp Lại</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: WEEK CALENDAR & AVAILABILITY SLOTS (Section 15-18) */}
      {/* ======================================================== */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          
          {/* Calendar Toolbar: Week Navigator + Action Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Week Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(prev => prev - 1)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-xs font-bold text-slate-800 px-2 text-center">
                <span>Tuần: {weekDays[0].toLocaleDateString('vi-VN')} – {weekDays[6].toLocaleDateString('vi-VN')}</span>
                {weekOffset === 0 && <span className="ml-1.5 text-emerald-700 font-extrabold text-[11px]">(Tuần hiện tại)</span>}
              </div>

              <button
                onClick={() => setWeekOffset(prev => prev + 1)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
                title="Tuần kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {weekOffset !== 0 && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 underline"
                >
                  Về hôm nay
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5 text-slate-500" />
                <span>Chặn Lịch Bận</span>
              </button>

              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Mở Khung Giờ Rảnh</span>
              </button>
            </div>
          </div>

          {/* Color Legend (Section 17) */}
          <div className="flex flex-wrap items-center gap-4 px-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span>Khung giờ rảnh (Available)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-100 border border-blue-300"></span>
              <span>Đã xác nhận (Booked)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span>
              <span>Chờ duyệt (Pending)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-400"></span>
              <span>Chặn lịch (Blocked)</span>
            </div>
          </div>

          {/* Week Grid (7 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map((day, idx) => {
              const dateStr = day.toISOString().substring(0, 10);
              const isToday = dateStr === new Date().toISOString().substring(0, 10);

              // Find slots for this date
              const daySlots = coachSlots.filter(s => s.date === dateStr);
              // Find bookings for this date
              const dayBookings = coachBookings.filter(b => b.date === dateStr && b.status !== 'cancelled' && b.status !== 'rejected');
              // Find blocked rules for this date
              const dayBlocks = coachRules.filter(r => r.is_blocked && r.specific_date === dateStr);

              return (
                <div 
                  key={dateStr}
                  className={`bg-white rounded-2xl border p-3.5 space-y-2.5 min-h-[220px] transition ${
                    isToday ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Day Header */}
                  <div className={`p-2 rounded-xl text-center ${isToday ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 text-slate-700'}`}>
                    <div className="text-[11px] font-bold uppercase">{dayNamesVN[idx]}</div>
                    <div className="text-sm font-black mt-0.5">
                      {day.getDate()}/{day.getMonth() + 1}
                    </div>
                  </div>

                  {/* Day Items List */}
                  <div className="space-y-1.5">
                    
                    {/* Booked Sessions */}
                    {dayBookings.map(b => (
                      <div
                        key={b.id}
                        className={`p-2 rounded-xl text-xs border space-y-1 ${
                          b.status === 'confirmed'
                            ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                            : b.status === 'pending'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>{b.start_time} – {b.end_time}</span>
                          <span className="text-[9px] uppercase px-1 rounded font-extrabold bg-white/70">
                            {b.status === 'confirmed' ? 'ĐÃ ĐẶT' : b.status === 'pending' ? 'CHỜ DUYỆT' : 'XONG'}
                          </span>
                        </div>
                        <div className="font-bold truncate">{b.student_name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{b.court_name}</div>
                      </div>
                    ))}

                    {/* Available Open Slots (not booked yet) */}
                    {daySlots.filter(s => !s.is_booked).map((slot, sIdx) => (
                      <div
                        key={`${slot.id}_${sIdx}`}
                        className="p-2 rounded-xl text-xs bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-[11px]">{slot.start_time} – {slot.end_time}</div>
                          <div className="text-[10px] text-emerald-700 truncate max-w-[90px]">{slot.court_name}</div>
                        </div>
                        <button
                          onClick={() => {
                            deleteAvailabilitySlot(slot.id);
                            showToast('Đã xóa khung giờ rảnh');
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Xóa slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Blocked Times */}
                    {dayBlocks.map(block => (
                      <div
                        key={block.id}
                        className="p-2 rounded-xl text-xs bg-slate-100 border border-slate-300 text-slate-700 space-y-0.5"
                      >
                        <div className="font-bold text-[11px] flex items-center gap-1">
                          <Ban className="w-3 h-3 text-slate-500" />
                          <span>{block.start_time} – {block.end_time}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 italic truncate">{block.court_name}</div>
                      </div>
                    ))}

                    {daySlots.length === 0 && dayBookings.length === 0 && dayBlocks.length === 0 && (
                      <div className="text-center py-6 text-slate-300 text-[11px] italic">
                        Trống lịch
                      </div>
                    )}

                  </div>

                  {/* Add slot quick button for this specific day */}
                  <button
                    onClick={() => {
                      setNewDate(dateStr);
                      setIsAddSlotOpen(true);
                    }}
                    className="w-full py-1 text-[11px] font-bold text-slate-400 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition text-center cursor-pointer"
                  >
                    + Thêm giờ
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BOOKING REQUESTS QUEUE & DECISION UI (Section 19) */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setBookingStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  bookingStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Chờ Phê Duyệt ({coachBookings.filter(b => b.status === 'pending').length})
              </button>

              <button
                onClick={() => setBookingStatusFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  bookingStatusFilter === 'confirmed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Đã Xác Nhận ({coachBookings.filter(b => b.status === 'confirmed').length})
              </button>

              <button
                onClick={() => setBookingStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  bookingStatusFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Đã Hoàn Thành ({coachBookings.filter(b => b.status === 'completed').length})
              </button>

              <button
                onClick={() => setBookingStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  bookingStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất Cả ({coachBookings.length})
              </button>
            </div>
          </div>

          {/* Bookings Queue */}
          <div className="space-y-3">
            {coachBookings
              .filter(b => bookingStatusFilter === 'all' || b.status === bookingStatusFilter)
              .map(booking => {
                const netCoachEarnings = Math.round(booking.total_price * 0.9);

                return (
                  <div 
                    key={booking.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    {/* Student & Session Info */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={booking.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{booking.student_name}</h4>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            booking.status === 'pending'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : booking.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {booking.status === 'pending' ? 'Chờ HLV duyệt' : booking.status === 'confirmed' ? 'Đã xác nhận' : 'Hoàn thành'}
                          </span>
                        </div>

                        <div className="text-slate-600 text-xs">
                          {booking.date} ({booking.start_time} – {booking.end_time}) • {booking.package_title}
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.court_name}</span>
                          <span className="text-slate-300">•</span>
                          <span>SĐT: {booking.student_phone || '0901234567'}</span>
                        </div>

                        {booking.notes && (
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] italic mt-1">
                            "{booking.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Financial Summary & Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-[11px] text-slate-400">Học phí Escrow</div>
                        <div className="text-sm font-black text-slate-900">{booking.total_price.toLocaleString('vi-VN')} đ</div>
                        <div className="text-[10px] text-emerald-700 font-bold">HLV thực nhận: {netCoachEarnings.toLocaleString('vi-VN')} đ (90%)</div>
                      </div>

                      {/* Decision buttons */}
                      {booking.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDecliningBooking(booking)}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold transition cursor-pointer"
                          >
                            Từ chối
                          </button>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
                          >
                            Chấp Nhận Lịch
                          </button>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRecapBooking(booking)}
                            className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Viết Recap</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {coachBookings.filter(b => bookingStatusFilter === 'all' || b.status === bookingStatusFilter).length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2 text-xs">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="font-bold text-slate-700">Không có yêu cầu booking nào trong mục này</div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: RECURRING WEEKLY RULES (Section 16) */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Quy Tắc Khung Giờ Cố Định Tuần</h3>
                <p className="text-xs text-slate-500">
                  Thiết lập các khung giờ rảnh lặp lại hàng tuần (vd: Mỗi Thứ 2, Thứ 4 từ 18:00 đến 19:30).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyRulesToSlots}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đồng Bộ Sang Lịch 14 Ngày</span>
                </button>

                <button
                  onClick={() => setIsAddRuleOpen(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Quy Tắc Mới</span>
                </button>
              </div>
            </div>

            {/* Rules List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {coachRules.filter(r => !r.is_blocked).map(rule => {
                const dayIndex = typeof rule.day_of_week === 'number' ? (rule.day_of_week === 0 ? 6 : rule.day_of_week - 1) : 0;
                const dayName = dayNamesVN[dayIndex] || 'Thứ 2';

                return (
                  <div key={rule.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg text-[10px]">
                        HÀNG TUẦN: {dayName}
                      </span>
                      <button
                        onClick={() => {
                          removeAvailabilityRule(rule.id);
                          showToast('Đã xóa quy tắc lặp lại');
                        }}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-black text-slate-900 text-sm">
                      {rule.start_time} – {rule.end_time}
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{rule.court_name}</span>
                    </div>
                  </div>
                );
              })}

              {coachRules.filter(r => !r.is_blocked).length === 0 && (
                <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700">Chưa có quy tắc cố định nào</div>
                  <div className="text-slate-500">Nhấn "+ Thêm Quy Tắc Mới" để thiết lập lịch cố định hàng tuần.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD AVAILABILITY SLOT */}
      {/* ======================================================== */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Mở Khung Giờ Rảnh Mới</h3>
              <button onClick={() => setIsAddSlotOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ngày mở slot:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Giờ bắt đầu:</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Giờ kết thúc:</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sân hướng dẫn:</label>
                <select
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  {(coachProfile.courts && coachProfile.courts.length > 0 ? coachProfile.courts : ['Sân Saigon South Q7', 'Sân Pickleball Sala Q2']).map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Lưu Khung Giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BLOCK TIME (Chặn lịch bận) */}
      {/* ======================================================== */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Ban className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-black">Chặn Lịch Bận / Nghỉ Phép</h3>
              </div>
              <button onClick={() => setIsBlockModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlockTimeSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ngày muốn chặn:</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Từ giờ:</label>
                  <input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Đến giờ:</label>
                  <input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Lý do chặn lịch:</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="VD: Thi đấu giải VPA, Bận việc gia đình..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Xác Nhận Chặn Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD RECURRING RULE */}
      {/* ======================================================== */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Thêm Quy Tắc Cố Định Tuần</h3>
              <button onClick={() => setIsAddRuleOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRuleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ngày lặp lại hàng tuần:</label>
                <select
                  value={ruleDayOfWeek}
                  onChange={(e) => setRuleDayOfWeek(Number(e.target.value) as DayOfWeek)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value={1}>Thứ Hai hàng tuần</option>
                  <option value={2}>Thứ Ba hàng tuần</option>
                  <option value={3}>Thứ Tư hàng tuần</option>
                  <option value={4}>Thứ Năm hàng tuần</option>
                  <option value={5}>Thứ Sáu hàng tuần</option>
                  <option value={6}>Thứ Bảy hàng tuần</option>
                  <option value={0}>Chủ Nhật hàng tuần</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Giờ bắt đầu:</label>
                  <input
                    type="time"
                    value={ruleStartTime}
                    onChange={(e) => setRuleStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Giờ kết thúc:</label>
                  <input
                    type="time"
                    value={ruleEndTime}
                    onChange={(e) => setRuleEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sân áp dụng:</label>
                <select
                  value={ruleCourt}
                  onChange={(e) => setRuleCourt(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {(coachProfile.courts && coachProfile.courts.length > 0 ? coachProfile.courts : ['Sân Saigon South Q7', 'Sân Pickleball Sala Q2']).map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Lưu Quy Tắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DECLINE WITH REASON */}
      {/* ======================================================== */}
      {decliningBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-black text-slate-900">Từ chối lịch học của {decliningBooking.student_name}</h3>
            </div>

            <p className="text-xs text-slate-500">
              Vui lòng chọn lý do để học viên nhận được thông báo giải thích cụ thể:
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Trùng lịch thi đấu hoặc bận đột xuất',
                'Địa điểm sân không thuận tiện di chuyển',
                'Trình độ học viên chưa phù hợp với lộ trình lớp',
                'Lý do cá nhân khác'
              ].map((r, i) => (
                <label key={i} className="flex items-center gap-2 p-2.5 border rounded-xl hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReason === r}
                    onChange={() => setDeclineReason(r)}
                  />
                  <span className="font-semibold text-slate-800">{r}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Lời nhắn bổ sung:</label>
              <textarea
                value={declineCustomNote}
                onChange={(e) => setDeclineCustomNote(e.target.value)}
                placeholder="Ghi chú thêm gửi đến học viên..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDecliningBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleDeclineBooking}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION RECAP CREATE MODAL */}
      {recapBooking && (
        <SessionRecapCreateModal
          booking={recapBooking}
          onClose={() => setRecapBooking(null)}
        />
      )}

    </div>
  );
};
