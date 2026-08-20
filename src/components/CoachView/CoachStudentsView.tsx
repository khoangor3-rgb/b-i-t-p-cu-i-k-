import React, { useState } from 'react';
import { 
  Users, Award, Calendar, CheckCircle2, Search, 
  Filter, TrendingUp, Clock, FileText, ChevronRight,
  Sparkles, Star, ArrowRight, UserPlus, Phone, Mail, MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Booking, SessionRecap, CoachClass } from '../../types';
import { SessionRecapCreateModal } from './SessionRecapCreateModal';

interface CoachStudentsViewProps {
  onOpenRecapModal?: (booking: Booking) => void;
}

export const CoachStudentsView: React.FC<CoachStudentsViewProps> = () => {
  const { 
    currentUser, coaches, users, bookings, sessionRecaps, classes 
  } = useApp();

  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  const coachBookings = bookings.filter(b => b.coach_id === coach.id);
  const coachClasses = classes.filter(c => c.coach_id === coach.id);

  // Derive unique students who have booked with this coach
  const studentIds = Array.from(new Set(coachBookings.map(b => b.student_id)));
  const studentUsers = users.filter(u => studentIds.includes(u.id));

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [recapBooking, setRecapBooking] = useState<Booking | null>(null);

  // Group classes vs 1-on-1 toggle
  const [viewType, setViewType] = useState<'individual' | 'classes'>('individual');

  const filteredStudents = studentUsers.filter(s => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      ((s.phone || '').toLowerCase().includes(q));
    const matchesLevel = levelFilter === 'all' || s.skill_level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & View Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Student CRM & Continuity
            </span>
            <span className="text-xs text-slate-400 font-medium">Hồ Sơ Học Viên & Tiến Trình Kỹ Năng</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Học Viên & Lớp Huấn Luyện
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Theo dõi điểm DUPR, mức độ chuyên cần và ghi chú tính liên tục (Continuity) giữa các buổi học.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setViewType('individual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewType === 'individual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Học Viên Cá Nhân ({studentUsers.length})</span>
          </button>

          <button
            onClick={() => setViewType('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewType === 'classes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Lớp Nhóm ({coachClasses.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW: INDIVIDUAL STUDENTS */}
      {viewType === 'individual' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm học viên theo tên, SĐT, email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả trình độ</option>
                <option value="beginner">Nhập môn (Beginner)</option>
                <option value="intermediate">Trung cấp (Intermediate)</option>
                <option value="competitive">Thi đấu (Competitive)</option>
              </select>

              {(searchQuery || levelFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setLevelFilter('all'); }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>

          {/* Student Grid */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Chưa có học viên nào khớp tìm kiếm</h3>
              <p className="text-xs text-slate-500">Học viên đặt lịch hoặc đăng ký khóa học sẽ tự động hiển thị trong CRM.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(student => {
                const studentBookings = coachBookings.filter(b => b.student_id === student.id);
                const completedCount = studentBookings.filter(b => b.status === 'completed').length;
                const recaps = sessionRecaps.filter(r => r.student_id === student.id);
                const latestRecap = recaps[recaps.length - 1];

                // Calculate attendance
                const attendanceRate = studentBookings.length > 0
                  ? Math.round((completedCount / studentBookings.length) * 100)
                  : 100;

                return (
                  <div 
                    key={student.id} 
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition space-y-4 text-xs"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{student.full_name}</h4>
                          <div className="text-[11px] text-slate-500">{student.phone || '0901234567'}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 font-extrabold text-[10px] rounded-full">
                        DUPR {student.dupr_rating?.toFixed(1) || '2.8'}
                      </span>
                    </div>

                    {/* Fast Stats Row */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Buổi đã học</div>
                        <div className="font-black text-slate-900 text-xs mt-0.5">{completedCount} buổi</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Chuyên cần</div>
                        <div className="font-black text-emerald-700 text-xs mt-0.5">{attendanceRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Trình độ</div>
                        <div className="font-black text-slate-800 text-[11px] mt-0.5 capitalize">
                          {student.skill_level || 'Beginner'}
                        </div>
                      </div>
                    </div>

                    {/* Coaching Continuity Context (Section 94-95) */}
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1 text-[11px]">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kế thừa bài tập (Coaching Continuity):</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {latestRecap 
                          ? `Gần nhất: ${latestRecap.note || 'Cần luyện thêm cú Third Shot Drop và Footwork'}`
                          : 'Học viên mới: Bắt đầu từ định hình kỹ thuật cầm vợt Continental & cú Dink'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {recaps.length} phiếu đánh giá kỹ năng
                      </span>

                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xem chi tiết hồ sơ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: GROUP CLASSES */}
      {viewType === 'classes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coachClasses.map(cls => (
              <div key={cls.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 rounded-full font-bold text-[10px]">
                      {cls.level}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{cls.name}</h3>
                    <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cls.schedule}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Học phí / người</div>
                    <div className="text-sm font-black text-emerald-800">{cls.fee_per_student.toLocaleString('vi-VN')} đ</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Sĩ số lớp: {cls.student_ids.length} / {cls.max_students} học viên</span>
                    <span className="text-emerald-700">{cls.student_ids.length === cls.max_students ? 'Đã đủ chỗ' : 'Còn trống'}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${(cls.student_ids.length / cls.max_students) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Students list */}
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 text-[11px]">Danh sách học viên trong lớp:</div>
                  <div className="flex flex-wrap gap-2">
                    {cls.student_ids.map(sid => {
                      const st = users.find(u => u.id === sid);
                      return (
                        <div key={sid} className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl text-[11px]">
                          <img src={st?.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                          <span className="font-semibold text-slate-800">{st?.full_name || 'Học viên'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedStudent.avatar_url} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedStudent.full_name}</h3>
                  <div className="text-xs text-slate-500">{selectedStudent.email} • {selectedStudent.phone}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Qualitative Skill Radar / Progress (Section 28) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Đánh giá 4 kỹ năng cốt lõi</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Giao bóng (Serve)</span>
                    <span className="text-emerald-700">4.0 / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Đỡ & Kiểm soát Dink</span>
                    <span className="text-emerald-700">3.5 / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Cắt bóng & Volley</span>
                    <span className="text-emerald-700">4.5 / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Vị trí sân (Positioning)</span>
                    <span className="text-emerald-700">3.8 / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recaps History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lịch sử đánh giá sau buổi học (Session Recaps)</h4>
              <div className="space-y-2 text-xs">
                {sessionRecaps.filter(r => r.student_id === selectedStudent.id).map(recap => (
                  <div key={recap.id} className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                      <span>Buổi học ngày {recap.created_at?.substring(0, 10) || '2026-08-18'}</span>
                      <span>Dink: {recap.skill_dink}/5 • Serve: {recap.skill_serve}/5</span>
                    </div>
                    <p className="text-slate-700 italic leading-relaxed">"{recap.note}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SESSION RECAP MODAL */}
      {recapBooking && (
        <SessionRecapCreateModal
          booking={recapBooking}
          onClose={() => setRecapBooking(null)}
        />
      )}

    </div>
  );
};
