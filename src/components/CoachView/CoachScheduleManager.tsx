import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Plus, 
  Trash2, User, MapPin, AlertCircle, Sparkles, Filter 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, AvailabilitySlot } from '../../types';

interface CoachScheduleManagerProps {
  onOpenAssessmentModal: (studentId: string, studentName: string) => void;
}

export const CoachScheduleManager: React.FC<CoachScheduleManagerProps> = ({
  onOpenAssessmentModal
}) => {
  const { 
    currentUser, coaches, slots, bookings, 
    addAvailabilitySlot, deleteAvailabilitySlot, updateBookingStatus 
  } = useApp();

  const coachProfile = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  
  // Slots & bookings for this coach
  const coachSlots = slots.filter(s => s.coach_id === coachProfile.id);
  const coachBookings = bookings.filter(b => b.coach_id === coachProfile.id);

  // Filter tab for bookings
  const [bookingTab, setBookingTab] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');

  // Add new slot modal state
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [newStartTime, setNewStartTime] = useState('07:00');
  const [newEndTime, setNewEndTime] = useState('08:30');
  const [newCourt, setNewCourt] = useState(coachProfile.courts[0] || 'Sân Saigon South Q7');
  const [slotMsg, setSlotMsg] = useState('');

  // Rejection modal
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('HLV bận lịch đột xuất');

  const filteredBookings = coachBookings.filter(b => {
    if (bookingTab === 'all') return true;
    return b.status === bookingTab;
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newStartTime || !newEndTime) return;

    addAvailabilitySlot(newDate, newStartTime, newEndTime, newCourt);
    setSlotMsg('Đã thêm khung giờ rảnh thành công!');
    setTimeout(() => setSlotMsg(''), 3000);
    setIsAddSlotOpen(false);
  };

  const handleQuickAddSlotsWeek = () => {
    // Generate 3 upcoming day slots
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dateStr = nextDay.toISOString().substring(0, 10);
      addAvailabilitySlot(dateStr, '07:30', '09:00', coachProfile.courts[0] || 'Sân tiêu chuẩn');
      addAvailabilitySlot(dateStr, '18:00', '19:30', coachProfile.courts[0] || 'Sân tiêu chuẩn');
    }
    setSlotMsg('Đã tự động tạo các khung giờ rảnh sáng & tối cho 3 ngày tới!');
    setTimeout(() => setSlotMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản Lý Lịch Dạy & Đặt Chỗ</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {coachBookings.filter(b => b.status === 'pending').length} yêu cầu mới
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Duyệt yêu cầu của học viên, thiết lập khung giờ rảnh và chấm điểm DUPR sau buổi tập.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleQuickAddSlotsWeek}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="Tự động tạo slot sáng & tối"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tạo nhanh lịch tuần</span>
          </button>

          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khung Giờ Rảnh</span>
          </button>
        </div>
      </div>

      {slotMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{slotMsg}</span>
        </div>
      )}

      {/* Main Grid: Pending Bookings on Left (7 cols), Availability Slots on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Bookings Management (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Booking filter tabs */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'pending', label: 'Chờ xác nhận', count: coachBookings.filter(b => b.status === 'pending').length },
                { id: 'confirmed', label: 'Đã xác nhận', count: coachBookings.filter(b => b.status === 'confirmed').length },
                { id: 'completed', label: 'Hoàn thành', count: coachBookings.filter(b => b.status === 'completed').length },
                { id: 'all', label: 'Tất cả', count: coachBookings.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBookingTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    bookingTab === tab.id 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    bookingTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Không có yêu cầu nào trong mục này</p>
              <p className="text-xs text-gray-400 mt-1">Khi học viên đặt lịch hẹn, yêu cầu sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map(booking => (
                <div 
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:border-emerald-300 transition duration-150 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.student_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                        alt="" 
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-100"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{booking.student_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>SĐT: {booking.student_phone}</span>
                          <span>•</span>
                          <span>{booking.package_title}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                      {booking.total_price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.date} • {booking.start_time} - {booking.end_time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{booking.court_name}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="text-xs text-gray-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                      Ghi chú học viên: "{booking.notes}"
                    </div>
                  )}

                  {/* Actions for Coach */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400 text-[11px]">Mã đơn: {booking.id}</span>
                    
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setRejectBookingId(booking.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl border border-red-200 transition cursor-pointer"
                          >
                            Từ chối
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Xác nhận lịch
                          </button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đánh dấu Đã Dạy Xong
                          </button>
                          <button
                            onClick={() => onOpenAssessmentModal(booking.student_id, booking.student_name)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
                          >
                            Chấm DUPR
                          </button>
                        </>
                      )}

                      {booking.status === 'completed' && (
                        <button
                          onClick={() => onOpenAssessmentModal(booking.student_id, booking.student_name)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Chấm DUPR & Ra Bài Tập
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right: Availability Slots List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Khung Giờ Rảnh Của Bạn ({coachSlots.length})</span>
              </h2>
              <p className="text-xs text-gray-500">Học viên chỉ có thể đặt trong khung giờ này</p>
            </div>
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition cursor-pointer"
              title="Thêm slot mới"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {coachSlots.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-6">
              Bạn chưa có khung giờ rảnh nào. Hãy bấm "Thêm Khung Giờ Rảnh" để học viên có thể tìm và đặt lịch học!
            </p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {coachSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    slot.is_booked 
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                      : 'bg-gray-50 hover:bg-emerald-50/40 border-gray-200 text-gray-800'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{slot.date}</span>
                      <span>•</span>
                      <span className="text-emerald-700">{slot.start_time} - {slot.end_time}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{slot.court_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {slot.is_booked ? (
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded">
                        Đã giữ chỗ
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Đang rảnh
                      </span>
                    )}

                    {!slot.is_booked && (
                      <button
                        onClick={() => deleteAvailabilitySlot(slot.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
                        title="Xóa khung giờ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Add Availability Slot */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Thêm Khung Giờ Rảnh Mới</span>
              </h3>
              <button onClick={() => setIsAddSlotOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ngày rảnh</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giờ bắt đầu</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giờ kết thúc</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Sân huấn luyện</label>
                <select
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none cursor-pointer"
                >
                  {coachProfile.courts.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                  <option value="Sân Thảo Điền City">Sân Thảo Điền City</option>
                  <option value="Sân Pickleball Sala Q2">Sân Pickleball Sala Q2</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Lưu Khung Giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rejection Reason */}
      {rejectBookingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Nhập lý do từ chối yêu cầu đặt lịch</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="VD: Khung giờ này sân bận giải đấu, hẹn học viên buổi khác..."
              rows={3}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectBookingId(null)}
                className="px-3 py-1.5 text-gray-600 font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  updateBookingStatus(rejectBookingId, 'cancelled', rejectReason);
                  setRejectBookingId(null);
                }}
                className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-xl"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
