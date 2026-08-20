import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Users, Calendar, MapPin, CheckCircle2, 
  Sparkles, Filter, Search, ArrowRight, ShieldCheck, Award, 
  Clock, Star, ChevronRight, Check, AlertCircle, X, Shield, 
  HelpCircle, UserCheck, BookOpen, Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachClass, CoachProfile } from '../../types';

interface StudentCoursesViewProps {
  onSelectCoach?: (coach: CoachProfile) => void;
  onOpenSelfAssessment?: () => void;
}

export const StudentCoursesView: React.FC<StudentCoursesViewProps> = ({ 
  onSelectCoach,
  onOpenSelfAssessment 
}) => {
  const { classes, coaches, users, currentUser, enrollInClass, removeClassStudent } = useApp();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedClassForDetail, setSelectedClassForDetail] = useState<CoachClass | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getCoach = (coachId: string) => coaches.find(c => c.id === coachId);
  const getCoachUser = (coachId: string) => {
    const coach = getCoach(coachId);
    if (!coach) return null;
    return users.find(u => u.id === coach.user_id);
  };

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      const coach = getCoach(cls.coach_id);
      const coachUser = getCoachUser(cls.coach_id);
      const coachName = (coachUser?.full_name || cls.coach_name || '').toLowerCase();
      const title = (cls.name || (cls as any).title || '').toLowerCase();
      const desc = (cls.description || '').toLowerCase();
      const location = (cls.area || cls.court_name || (cls as any).location || '').toLowerCase();
      const query = (searchTerm || '').trim().toLowerCase();

      const matchesSearch = !query || 
        title.includes(query) || 
        desc.includes(query) || 
        location.includes(query) || 
        coachName.includes(query);

      const matchesLevel = selectedLevel === 'all' || (cls.level || '').includes(selectedLevel) || cls.level === selectedLevel;
      const matchesArea = selectedArea === 'all' || 
        (cls.area || '').includes(selectedArea) || 
        (cls.court_name || '').includes(selectedArea) || 
        ((cls as any).location || '').includes(selectedArea);
      const isFull = (cls.student_ids || []).length >= (cls.max_students || 1);
      const matchesAvail = !onlyAvailable || !isFull;

      return matchesSearch && matchesLevel && matchesArea && matchesAvail;
    });
  }, [classes, coaches, users, searchTerm, selectedLevel, selectedArea, onlyAvailable]);

  // Handle student enrollment
  const handleEnroll = (cls: CoachClass) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản học viên để đăng ký lớp học.');
      return;
    }
    const isAlreadyEnrolled = cls.student_ids.includes(currentUser.id);
    if (isAlreadyEnrolled) {
      if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học này?')) {
        removeClassStudent(cls.id, currentUser.id);
        showToast('Đã hủy đăng ký lớp học thành công.');
      }
      return;
    }

    const res = enrollInClass(cls.id, currentUser.id);
    if (res.success) {
      showToast(res.message);
      setSelectedClassForDetail(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-9 overflow-hidden shadow-xl border border-purple-900/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 top-6 opacity-10 hidden lg:block">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Lớp Học Nhóm & Khóa Huấn Luyện Kỹ Thuật
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            Khóa Học & Lớp Nhóm <span className="text-emerald-400">Phù Hợp Với Bạn</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Học nhóm nhỏ tối đa 4–6 học viên cùng trình độ DUPR. Tiết kiệm chi phí, rèn luyện tư duy đánh đôi thực chiến và được HLV theo sát từng buổi.
          </p>

          {/* Quick Search & Filters Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800">
            <div className="flex-1 flex items-center px-3 py-2 gap-2 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-4 h-4 text-purple-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm khóa Dinking, 3rd Drop, Chiến thuật đánh đôi..."
                className="w-full text-xs sm:text-sm outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1">
              <span className="text-xs text-slate-400 font-medium">Trình độ:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">Tất cả trình độ</option>
                <option value="Cơ bản (DUPR 2.0 - 2.5)">Cơ bản (2.0 - 2.5)</option>
                <option value="Trung cấp (DUPR 3.0 - 3.5)">Trung cấp (3.0 - 3.5)</option>
                <option value="Nâng cao (DUPR 3.5 - 4.5)">Nâng cao (3.5 - 4.5)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 border-t md:border-t-0 md:border-l border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">Toàn quốc</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Level Filter Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLevel === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả khóa ({classes.length})
          </button>
          <button
            onClick={() => setSelectedLevel('Cơ bản (DUPR 2.0 - 2.5)')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLevel === 'Cơ bản (DUPR 2.0 - 2.5)'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cơ bản (2.0 - 2.5)
          </button>
          <button
            onClick={() => setSelectedLevel('Trung cấp (DUPR 3.0 - 3.5)')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLevel === 'Trung cấp (DUPR 3.0 - 3.5)'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Trung cấp (3.0 - 3.5)
          </button>
          <button
            onClick={() => setSelectedLevel('Nâng cao (DUPR 3.5 - 4.5)')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLevel === 'Nâng cao (DUPR 3.5 - 4.5)'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Nâng cao & Chiến thuật (3.5+)
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
          />
          <span>Chỉ hiện lớp còn chỗ</span>
        </label>
      </div>

      {/* Course Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-800">Không tìm thấy khóa học phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1">
            Hãy thử chọn trình độ khác hoặc bỏ tích chọn bộ lọc để xem toàn bộ danh sách lớp.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
              setSelectedArea('all');
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredClasses.map((cls) => {
            const coach = getCoach(cls.coach_id);
            const coachUser = getCoachUser(cls.coach_id);
            const enrolledCount = cls.student_ids.length;
            const spotsLeft = Math.max(0, cls.max_students - enrolledCount);
            const isFull = spotsLeft === 0;
            const isEnrolled = currentUser ? cls.student_ids.includes(currentUser.id) : false;

            return (
              <div
                key={cls.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isEnrolled 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar: Level & Capacity Pill */}
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                      {cls.level}
                    </span>

                    {/* Capacity Indicator */}
                    {isFull ? (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        Hết chỗ ({cls.max_students}/{cls.max_students})
                      </span>
                    ) : spotsLeft === 1 ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Chỉ còn 1 chỗ duy nhất!
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Còn {spotsLeft} / {cls.max_students} chỗ
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    {/* Class Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {cls.name || (cls as any).title || 'Khóa Huấn Luyện Pickleball'}
                    </h3>

                    {/* Coach Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={coachUser?.avatar_url || cls.coach_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                        alt={coachUser?.full_name || cls.coach_name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">{coachUser?.full_name || cls.coach_name || 'HLV Pickleball'}</span>
                          {coach?.verification_status === 'verified' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">
                          DUPR {coach?.dupr_level ? coach.dupr_level.toFixed(1) : '4.5'} • {coach?.certifications?.[0]?.title || 'IPTPA Certified'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cls.description || 'Chương trình đào tạo kỹ thuật toàn diện'}
                    </p>

                    {/* Logistics: Schedule & Venue */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{cls.schedule}</span>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="break-words whitespace-normal leading-snug">{cls.court_name ? `${cls.court_name} (${cls.area})` : cls.area || (cls as any).location}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Sĩ số học viên</span>
                        <span>{enrolledCount} / {cls.max_students} học viên</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-rose-500' : spotsLeft === 1 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(enrolledCount / (cls.max_students || 5)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Price & CTA */}
                <div className="p-5 pt-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Học phí trọn khóa</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {(cls.fee_per_student || (cls as any).price || 0).toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-[11px] text-slate-500">/ khóa</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedClassForDetail(cls)}
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
                    >
                      Chi tiết
                    </button>

                    {isEnrolled ? (
                      <button
                        type="button"
                        onClick={() => handleEnroll(cls)}
                        className="px-4 py-2 bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Đăng Ký</span>
                      </button>
                    ) : isFull ? (
                      <button
                        type="button"
                        onClick={() => setSelectedClassForDetail(cls)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                      >
                        Đăng Ký Chờ
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEnroll(cls)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Tham Gia Lớp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Class Detail Drawer / Modal */}
      {selectedClassForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 via-slate-900 to-emerald-950 text-white flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  {selectedClassForDetail.level}
                </span>
                <h2 className="text-xl font-extrabold mt-2 leading-tight">
                  {selectedClassForDetail.name || (selectedClassForDetail as any).title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedClassForDetail.court_name ? `${selectedClassForDetail.court_name} (${selectedClassForDetail.area})` : selectedClassForDetail.area || (selectedClassForDetail as any).location}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedClassForDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Mục tiêu & Nội dung khóa học</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedClassForDetail.description}
                </p>
              </div>

              {/* Coach Trust Stack */}
              {(() => {
                const coach = getCoach(selectedClassForDetail.coach_id);
                const coachUser = getCoachUser(selectedClassForDetail.coach_id);
                return (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                        alt={coachUser?.full_name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-sm">{coachUser?.full_name}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          DUPR {coach?.dupr_level.toFixed(1)} • {coach?.experience_years} năm kinh nghiệm
                        </p>
                      </div>
                    </div>

                    {coach && onSelectCoach && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClassForDetail(null);
                          onSelectCoach(coach);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer shrink-0"
                      >
                        Xem Profile HLV
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Schedule & Syllabus Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Thời gian học</span>
                  </div>
                  <p className="text-slate-600 text-xs">{selectedClassForDetail.schedule}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cam kết chất lượng</span>
                  </div>
                  <p className="text-slate-600 text-xs">Bảo đảm hoàn tiền nếu không hài lòng buổi đầu</p>
                </div>
              </div>

              {/* Cancellation Policy Plain Language */}
              <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chính sách hoàn phí lớp học</span>
                </div>
                <p className="text-emerald-800/90 text-[11px] leading-relaxed">
                  Học viên được hủy trước ngày khai giảng tối thiểu 24 giờ để nhận lại 100% học phí về tài khoản ví. Tiền học được bảo lưu an toàn qua hệ thống Escrow.
                </p>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Tổng chi phí</div>
                <div className="text-lg font-black text-slate-900">
                  {(selectedClassForDetail.fee_per_student || (selectedClassForDetail as any).price || 0).toLocaleString('vi-VN')} đ
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClassForDetail(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => handleEnroll(selectedClassForDetail)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {currentUser && selectedClassForDetail.student_ids.includes(currentUser.id) 
                    ? 'Hủy Đăng Ký Lớp' 
                    : `Xác Nhận Tham Gia • ${(selectedClassForDetail.fee_per_student || (selectedClassForDetail as any).price || 0).toLocaleString('vi-VN')} đ`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
