import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Users, Calendar, MapPin, CheckCircle2, 
  AlertCircle, PlusCircle, UserPlus, Sparkles, Filter, 
  Search, ArrowRight, ShieldCheck, Award, Phone, Mail,
  UserCheck, Shield, Lock, Eye, LogIn, Clock, ChevronRight,
  Check, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CoachClass, CoachProfile, User, UserRole } from '../types';

interface ClassManagementViewProps {
  userRoleContext?: 'student' | 'coach' | 'admin';
  onOpenSelfAssessment?: (studentId?: string) => void;
  onSelectCoach?: (coach: CoachProfile) => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({ 
  userRoleContext = 'student',
  onOpenSelfAssessment,
  onSelectCoach 
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    classes, 
    users, 
    coaches, 
    addClassStudent, 
    removeClassStudent, 
    enrollInClass 
  } = useApp();

  const effectiveRole: UserRole = currentUser?.role || userRoleContext || 'student';

  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'unassigned' | 'all_students' | 'coaches'>('classes');
  const [selectedClassForEnroll, setSelectedClassForEnroll] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-correct tab if role is not admin and tries to access admin-only tabs
  const currentTab = (effectiveRole !== 'admin' && (activeSubTab === 'unassigned' || activeSubTab === 'all_students')) 
    ? 'classes' 
    : activeSubTab;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 50 Students list
  const allStudents = useMemo(() => {
    return users.filter(u => u.role === 'student');
  }, [users]);

  // Enrolled student IDs
  const enrolledStudentIds = useMemo(() => {
    const ids = new Set<string>();
    classes.forEach(c => c.student_ids.forEach(id => ids.add(id)));
    return ids;
  }, [classes]);

  const enrolledStudents = useMemo(() => {
    return allStudents.filter(st => enrolledStudentIds.has(st.id));
  }, [allStudents, enrolledStudentIds]);

  const unassignedStudents = useMemo(() => {
    return allStudents.filter(st => !enrolledStudentIds.has(st.id));
  }, [allStudents, enrolledStudentIds]);

  // Coach Profile if logged in as coach
  const currentCoachProfile = useMemo(() => {
    if (effectiveRole !== 'coach') return null;
    return coaches.find(c => c.user_id === currentUser?.id);
  }, [effectiveRole, currentUser, coaches]);

  // My classes if coach
  const myCoachClasses = useMemo(() => {
    if (!currentCoachProfile) return [];
    return classes.filter(c => c.coach_id === currentCoachProfile.id);
  }, [currentCoachProfile, classes]);

  const totalStudentsInMyClasses = useMemo(() => {
    return myCoachClasses.reduce((sum, c) => sum + c.student_ids.length, 0);
  }, [myCoachClasses]);

  const totalSlotsAvailableInMyClasses = useMemo(() => {
    return myCoachClasses.reduce((sum, c) => sum + Math.max(0, c.max_students - c.student_ids.length), 0);
  }, [myCoachClasses]);

  // My classes if student
  const myEnrolledClasses = useMemo(() => {
    if (effectiveRole !== 'student' || !currentUser) return [];
    return classes.filter(c => c.student_ids.includes(currentUser.id));
  }, [effectiveRole, currentUser, classes]);

  const getStudent = (id: string) => users.find(u => u.id === id);
  const getCoachProfile = (coachId: string) => coaches.find(c => c.id === coachId);

  // Admin / Manual Enroll
  const handleEnrollStudent = (classId: string, studentId: string) => {
    const res = addClassStudent(classId, studentId);
    if (res.success) {
      showToast(res.message);
      setSelectedClassForEnroll(null);
    } else {
      alert(res.message);
    }
  };

  // Student Direct Enroll
  const handleStudentSelfEnroll = (classId: string) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản học viên để đăng ký lớp học.');
      return;
    }
    const res = enrollInClass(classId, currentUser.id);
    if (res.success) {
      showToast(res.message);
    } else {
      alert(res.message);
    }
  };

  // Student Cancel Enroll
  const handleStudentCancelEnroll = (classId: string) => {
    if (!currentUser) return;
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học này?')) {
      removeClassStudent(classId, currentUser.id);
      showToast('Đã hủy đăng ký lớp học thành công.');
    }
  };

  // Remove student (Admin)
  const handleRemoveStudent = (classId: string, studentId: string, studentName: string) => {
    if (window.confirm(`Xác nhận rút học viên ${studentName} khỏi lớp này?`)) {
      removeClassStudent(classId, studentId);
      showToast(`Đã rút học viên ${studentName} khỏi lớp thành công.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-emerald-300 px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Stats Card - Tailored dynamically to each role */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {effectiveRole === 'admin' && 'Hệ Thống Phân Bổ Lớp Học (Toàn Quyền Quản Trị)'}
                  {effectiveRole === 'coach' && 'Quản Lý Lớp Học & Đội Ngũ HLV'}
                  {effectiveRole === 'student' && 'Khóa Học Nhóm & Lớp Đào Tạo Kỹ Thuật'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {effectiveRole === 'admin' && 'Điều Phối & Phân Bổ Học Viên'}
                {effectiveRole === 'coach' && 'Lớp Học & Mạng Lưới Huấn Luyện Viên'}
                {effectiveRole === 'student' && 'Khóa Học Nhóm & Đội Ngũ HLV'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
                {effectiveRole === 'admin' && 'Phân bổ học viên vào các lớp đào tạo chuyên sâu theo huấn luyện viên, tối ưu hóa thời gian đào tạo và nâng cao chất lượng bài giảng.'}
                {effectiveRole === 'coach' && 'Theo dõi các lớp học phụ trách, nắm bắt sĩ số học viên và dễ dàng tra cứu, liên hệ với các huấn luyện viên khác trong hệ thống.'}
                {effectiveRole === 'student' && 'Khám phá các khóa học nhóm cùng đội ngũ HLV chuyên nghiệp, đảm bảo bạn nhận được sự chỉ dẫn chi tiết và tiến bộ nhanh nhất.'}
              </p>
            </div>
          </div>

          {/* Role-Specific Metric Cards */}
          {effectiveRole === 'admin' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold">Tổng Học Viên</span>
                  <GraduationCap className="w-4 h-4 text-slate-300" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{allStudents.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Thành viên toàn hệ thống</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-semibold">Đã Xếp Lớp</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{enrolledStudents.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{classes.length} Lớp đang hoạt động</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs font-semibold">Đang Tìm Lớp</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{unassignedStudents.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sẵn sàng phân bổ</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-purple-400 mb-1">
                  <span className="text-xs font-semibold">Huấn Luyện Viên</span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">{coaches.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Chứng chỉ Quốc tế & DUPR</div>
              </div>
            </div>
          )}

          {effectiveRole === 'coach' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold">Lớp Của Tôi</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{myCoachClasses.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Lớp đang trực tiếp giảng dạy</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-semibold">Học Viên Của Tôi</span>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalStudentsInMyClasses}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Học viên đang theo học</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs font-semibold">Chỗ Còn Trống</span>
                  <UserPlus className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{totalSlotsAvailableInMyClasses}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Có thể tiếp nhận thêm</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-purple-400 mb-1">
                  <span className="text-xs font-semibold">Đội Ngũ HLV</span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">{coaches.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">HLV trong mạng lưới PickleConnect</div>
              </div>
            </div>
          )}

          {effectiveRole === 'student' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold">Lớp Học Đang Mở</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{classes.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Khóa học nhóm tại các sân</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-semibold">Lớp Tôi Đã Tham Gia</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{myEnrolledClasses.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Khóa học đang hoạt động</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs font-semibold">Tỷ Lệ Đào Tạo</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">Nhóm Nhỏ</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Kèm sát sao từng học viên</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-purple-400 mb-1">
                  <span className="text-xs font-semibold">Đội Ngũ HLV</span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">{coaches.length}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">HLV có chứng chỉ quốc tế</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub Tab Navigation - STRICT ROLE-BASED VISIBILITY */}
      <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {/* TAB 1: Lớp Học Theo HLV (Visible to ALL roles) */}
          <button
            onClick={() => setActiveSubTab('classes')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'classes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lớp Học Theo HLV</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${currentTab === 'classes' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
              {classes.length}
            </span>
          </button>

          {/* TAB 2: Học Viên Đang Tìm Lớp - ADMIN ONLY */}
          {effectiveRole === 'admin' && (
            <button
              onClick={() => setActiveSubTab('unassigned')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                currentTab === 'unassigned'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Học Viên Đang Tìm Lớp</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${currentTab === 'unassigned' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {unassignedStudents.length}
              </span>
            </button>
          )}

          {/* TAB 3: Toàn Bộ Học Viên - ADMIN ONLY */}
          {effectiveRole === 'admin' && (
            <button
              onClick={() => setActiveSubTab('all_students')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                currentTab === 'all_students'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Toàn Bộ Học Viên</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${currentTab === 'all_students' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {allStudents.length}
              </span>
            </button>
          )}

          {/* TAB 4: Đội Ngũ Huấn Luyện Viên (Visible to ALL roles) */}
          <button
            onClick={() => setActiveSubTab('coaches')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'coaches'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Đội Ngũ Huấn Luyện Viên</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${currentTab === 'coaches' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {coaches.length}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, HLV, lớp, khu vực..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LỚP HỌC THEO HLV                                  */}
      {/* ========================================================= */}
      {currentTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs font-medium text-slate-500 px-1 gap-2">
            <span>Danh sách các khóa học nhóm theo huấn luyện viên:</span>
            <span className="text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">
              Chương trình đào tạo chuẩn quốc tế
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {classes
              .filter(cls => {
                if (!searchQuery) return true;
                const q = (searchQuery || '').trim().toLowerCase();
                const name = (cls.name || '').toLowerCase();
                const coachName = (cls.coach_name || '').toLowerCase();
                const area = (cls.area || '').toLowerCase();
                const courtName = (cls.court_name || '').toLowerCase();
                const level = (cls.level || '').toLowerCase();
                return name.includes(q) || coachName.includes(q) || area.includes(q) || courtName.includes(q) || level.includes(q);
              })
              .map((cls) => {
                const coach = getCoachProfile(cls.coach_id);
                const isFull = cls.student_ids.length >= cls.max_students;
                const fillPercent = (cls.student_ids.length / cls.max_students) * 100;
                
                const isMyCoachClass = effectiveRole === 'coach' && currentCoachProfile && cls.coach_id === currentCoachProfile.id;
                const isEnrolledAsStudent = effectiveRole === 'student' && currentUser && cls.student_ids.includes(currentUser.id);

                return (
                  <div 
                    key={cls.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded">
                              {cls.level}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                              isFull 
                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}>
                              {isFull ? 'Lớp Đã Đầy' : `Còn ${cls.max_students - cls.student_ids.length} Chỗ`}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {cls.total_sessions} Buổi Học
                            </span>
                            {isMyCoachClass && (
                              <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded">
                                Lớp Của Bạn
                              </span>
                            )}
                            {isEnrolledAsStudent && (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Đã Đăng Ký
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-base text-slate-900 leading-snug">{cls.name}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[11px] text-slate-400">Học phí trọn khóa</div>
                          <div className="text-base font-extrabold text-slate-900">
                            {cls.fee_per_student.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      </div>

                      {/* Coach Info (Standard Public Card) */}
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3.5">
                        <img 
                          src={cls.coach_avatar} 
                          alt={cls.coach_name} 
                          className="w-11 h-11 rounded-lg object-cover object-top ring-1 ring-slate-200 shadow-2xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">HLV {cls.coach_name}</span>
                            {coach && (
                              <span className="bg-slate-900 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                DUPR {coach.dupr_level}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5 min-w-0">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span className="break-words whitespace-normal leading-snug">{cls.court_name} • {cls.area}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{cls.schedule}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mb-3.5 line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>

                      {/* ========================================================= */}
                      {/* ROSTER / SĨ SỐ SECTION (ROLE-BASED PRIVACY ENFORCED)     */}
                      {/* ========================================================= */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            Sĩ số lớp: {cls.student_ids.length} / {cls.max_students} học viên
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{fillPercent}% chỉ tiêu</span>
                        </div>

                        {/* Progress Bar with Cohesive Brand Gradient */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"
                            style={{ width: `${Math.min(100, fillPercent)}%` }}
                          ></div>
                        </div>

                        {/* CASE 1: ADMIN -> FULL VISIBILITY (Can view all students, login as student, remove student) */}
                        {effectiveRole === 'admin' && (
                          <div className="space-y-1.5">
                            {cls.student_ids.map((stId, idx) => {
                              const student = getStudent(stId);
                              if (!student) return null;
                              return (
                                <div 
                                  key={stId}
                                  className="flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60 text-xs transition"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <img 
                                      src={student.avatar_url} 
                                      alt={student.full_name} 
                                      className="w-6 h-6 rounded-full object-cover object-top shrink-0 ring-1 ring-slate-300"
                                    />
                                    <span className="font-semibold text-slate-900 truncate">{student.full_name}</span>
                                    {student.dupr_rating && (
                                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded shrink-0">
                                        DUPR {student.dupr_rating}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 hidden sm:inline truncate">{student.phone}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => setCurrentUser(student)}
                                      className="text-[10px] text-slate-700 hover:text-slate-900 font-semibold px-2 py-0.5 bg-white rounded border border-slate-200 transition cursor-pointer"
                                      title="Chuyển đăng nhập sang học viên này"
                                    >
                                      Đăng nhập
                                    </button>
                                    <button
                                      onClick={() => handleRemoveStudent(cls.id, student.id, student.full_name)}
                                      className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold px-1.5 py-0.5 rounded transition cursor-pointer"
                                      title="Rút học viên khỏi lớp"
                                    >
                                      Rút tên
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* CASE 2: COACH -> IF MY CLASS: Show my students; IF OTHER COACH'S CLASS: Show only quantity with privacy shield */}
                        {effectiveRole === 'coach' && (
                          <>
                            {isMyCoachClass ? (
                              <div className="space-y-1.5">
                                <div className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded border border-purple-100 flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Danh sách học viên lớp bạn trực tiếp phụ trách:</span>
                                </div>
                                {cls.student_ids.map((stId, idx) => {
                                  const student = getStudent(stId);
                                  if (!student) return null;
                                  return (
                                    <div 
                                      key={stId}
                                      className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60 text-xs"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                          {idx + 1}
                                        </span>
                                        <img 
                                          src={student.avatar_url} 
                                          alt={student.full_name} 
                                          className="w-6 h-6 rounded-full object-cover object-top shrink-0"
                                        />
                                        <span className="font-semibold text-slate-900 truncate">{student.full_name}</span>
                                        {student.dupr_rating && (
                                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                                            DUPR {student.dupr_rating}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono">
                                        {student.phone || student.email}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                <div className="text-[11px]">
                                  <span className="font-semibold text-slate-700">Sĩ số hiện tại: {cls.student_ids.length} / {cls.max_students} học viên.</span>
                                  <p className="text-slate-400 mt-0.5">Danh sách học viên và thông tin liên hệ được bảo mật nội bộ bởi HLV phụ trách.</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* CASE 3: STUDENT -> ONLY SHOW QUANTITY / REMAINING SLOTS (NO student names or private details) */}
                        {effectiveRole === 'student' && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-500" />
                                Đã đăng ký: {cls.student_ids.length} / {cls.max_students} học viên
                              </span>
                              <span className={`font-bold ${isFull ? 'text-amber-700' : 'text-emerald-700'}`}>
                                {isFull ? 'Hết chỗ' : `Còn trống ${cls.max_students - cls.student_ids.length} chỗ`}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Lớp học duy trì quy mô đào tạo chuẩn nhằm tối ưu chất lượng chỉnh sửa kỹ thuật cá nhân.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Left status badge */}
                      {isFull ? (
                        <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          Lớp đã đủ học viên
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                          Còn trống {cls.max_students - cls.student_ids.length} vị trí
                        </div>
                      )}

                      {/* Right role-specific buttons */}
                      {/* ADMIN: Button to assign unassigned student */}
                      {effectiveRole === 'admin' && !isFull && (
                        <button
                          onClick={() => {
                            setSelectedClassForEnroll(cls.id);
                            setActiveSubTab('unassigned');
                          }}
                          className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Xếp Học Viên Vào Lớp</span>
                        </button>
                      )}

                      {/* STUDENT: Direct Enroll / Cancel Registration */}
                      {effectiveRole === 'student' && (
                        <div>
                          {isEnrolledAsStudent ? (
                            <button
                              onClick={() => handleStudentCancelEnroll(cls.id)}
                              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Hủy Đăng Ký
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStudentSelfEnroll(cls.id)}
                              disabled={isFull}
                              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                isFull
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>{isFull ? 'Lớp Đã Đầy' : 'Đăng Ký Tham Gia Lớp'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: HỌC VIÊN ĐANG TÌM LỚP (ADMIN ONLY)                 */}
      {/* ========================================================= */}
      {currentTab === 'unassigned' && effectiveRole === 'admin' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Danh Sách Học Viên Đang Tìm Lớp</span>
                <p className="text-slate-500 text-[11px]">Các thành viên sẵn sàng xếp vào lớp đào tạo kỹ năng hoặc khóa học nhóm mới.</p>
              </div>
            </div>

            {selectedClassForEnroll && (
              <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 font-semibold flex items-center gap-2">
                <span>Đang chọn học viên cho lớp mục tiêu</span>
                <button 
                  onClick={() => setSelectedClassForEnroll(null)}
                  className="text-amber-700 hover:text-amber-950 underline font-bold cursor-pointer"
                >
                  Hủy chọn
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unassignedStudents
              .filter(st => {
                if (!searchQuery) return true;
                const q = (searchQuery || '').trim().toLowerCase();
                const name = (st.full_name || '').toLowerCase();
                const email = (st.email || '').toLowerCase();
                const loc = (st.location || '').toLowerCase();
                return name.includes(q) || email.includes(q) || loc.includes(q);
              })
              .map((student) => {
                return (
                  <div 
                    key={student.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-2.5">
                        <img 
                          src={student.avatar_url} 
                          alt={student.full_name} 
                          className="w-12 h-12 rounded-full object-cover object-top ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{student.full_name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{student.email}</div>
                          <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{student.location || 'TP. Hồ Chí Minh'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {student.dupr_rating ? (
                          <span className="bg-slate-900 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded">
                            DUPR {student.dupr_rating}
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 font-semibold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                            Chưa thẩm định DUPR
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {student.phone}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 space-y-2">
                      {selectedClassForEnroll ? (
                        <button
                          onClick={() => handleEnrollStudent(selectedClassForEnroll, student.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Xếp Vào Lớp Đang Chọn</span>
                        </button>
                      ) : (
                        <div>
                          <div className="text-[10px] font-semibold text-slate-500 mb-1">Xếp nhanh vào lớp còn chỗ:</div>
                          <div className="flex flex-wrap gap-1">
                            {classes
                              .filter(c => c.student_ids.length < c.max_students)
                              .slice(0, 3)
                              .map(c => (
                                <button
                                  key={c.id}
                                  onClick={() => handleEnrollStudent(c.id, student.id)}
                                  className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded border border-slate-200 transition cursor-pointer truncate max-w-full"
                                  title={`Xếp vào lớp ${c.name} của HLV ${c.coach_name}`}
                                >
                                  + {c.name.split('-')[0]}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setCurrentUser(student)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Đăng nhập tài khoản này</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TOÀN BỘ HỌC VIÊN (ADMIN ONLY)                      */}
      {/* ========================================================= */}
      {currentTab === 'all_students' && effectiveRole === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Danh Sách Toàn Bộ Học Viên</h3>
              <p className="text-xs text-slate-500">Bảng dữ liệu theo dõi phân bổ lớp học và tiến độ đào tạo</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-1 rounded-md">
                Đã vào lớp: {enrolledStudents.length}
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2.5 py-1 rounded-md">
                Chưa có lớp: {unassignedStudents.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Học Viên</th>
                  <th className="py-3 px-4">DUPR</th>
                  <th className="py-3 px-4">Khu Vực</th>
                  <th className="py-3 px-4">Liên Hệ</th>
                  <th className="py-3 px-4">Tình Trạng Lớp & HLV</th>
                  <th className="py-3 px-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allStudents
                  .filter(st => {
                    if (!searchQuery) return true;
                    const q = (searchQuery || '').trim().toLowerCase();
                    const name = (st.full_name || '').toLowerCase();
                    const email = (st.email || '').toLowerCase();
                    const loc = (st.location || '').toLowerCase();
                    return name.includes(q) || email.includes(q) || loc.includes(q);
                  })
                  .map((student, index) => {
                    const studentClass = classes.find(c => c.student_ids.includes(student.id));
                    const isEnrolled = !!studentClass;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-400">
                          #{index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={student.avatar_url} 
                              alt={student.full_name} 
                              className="w-8 h-8 rounded-full object-cover object-top ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{student.full_name}</div>
                              <div className="text-[10px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {student.dupr_rating ? (
                            <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {student.dupr_rating}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Chưa kiểm tra</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {student.location || 'TP.HCM'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {student.phone}
                        </td>
                        <td className="py-3 px-4">
                          {isEnrolled ? (
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{studentClass.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                HLV: <span className="font-semibold text-slate-700">{studentClass.coach_name}</span> • {studentClass.student_ids.length} Học viên
                              </div>
                            </div>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Đang tìm lớp phù hợp
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setCurrentUser(student)}
                            className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                          >
                            Đăng nhập
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ĐỘI NGŨ HUẤN LUYỆN VIÊN (ROLE-BASED VIEW)          */}
      {/* ========================================================= */}
      {currentTab === 'coaches' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs font-medium text-slate-500 px-1 gap-2">
            <span>
              {effectiveRole === 'admin' && 'Danh sách toàn bộ huấn luyện viên kèm công cụ quản trị hệ thống:'}
              {effectiveRole === 'coach' && 'Đội ngũ huấn luyện viên trong mạng lưới PickleConnect (Thông tin liên hệ & Chứng chỉ):'}
              {effectiveRole === 'student' && 'Đội ngũ huấn luyện viên chuyên nghiệp tiêu chuẩn DUPR & Quốc tế:'}
            </span>
            <span className="text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">
              {coaches.length} Huấn Luyện Viên
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches
              .filter(coach => {
                if (!searchQuery) return true;
                const q = (searchQuery || '').trim().toLowerCase();
                const coachUser = coach.user || users.find(u => u.id === coach.user_id);
                const coachName = (coachUser?.full_name || '').toLowerCase();
                const coachEmail = (coachUser?.email || '').toLowerCase();
                const coachPhone = (coachUser?.phone || '').toLowerCase();
                const area = (coach.area || '').toLowerCase();
                const specialties = coach.specialties || [];
                return (
                  coachName.includes(q) ||
                  coachEmail.includes(q) ||
                  coachPhone.includes(q) ||
                  area.includes(q) ||
                  specialties.some(s => (s || '').toLowerCase().includes(q))
                );
              })
              .map((coach) => {
                const coachUser = coach.user || users.find(u => u.id === coach.user_id);
                const coachName = coachUser?.full_name || 'Huấn Luyện Viên Pickleball';
                const coachAvatar = coachUser?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150';
                const coachPhone = coachUser?.phone || '';
                const coachEmail = coachUser?.email || '';

                const coachClasses = classes.filter(c => c.coach_id === coach.id);
                const totalStudentsInCoachClasses = coachClasses.reduce((sum, c) => sum + c.student_ids.length, 0);

                return (
                  <div 
                    key={coach.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Coach Header */}
                      <div className="flex items-start gap-3.5 mb-3.5">
                        <img 
                          src={coachAvatar} 
                          alt={coachName} 
                          className="w-14 h-14 rounded-2xl object-cover object-top ring-2 ring-slate-100 shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-sm text-slate-900 truncate">{coachName}</h4>
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              DUPR {coach.dupr_level}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{coach.area}</span>
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 mt-1.5 flex items-center gap-1.5">
                            <span className="text-emerald-700">{coach.price_per_session.toLocaleString('vi-VN')} đ</span>
                            <span className="text-slate-400 font-normal text-[10px]">/ giờ đào tạo</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info (Phone & Email) */}
                      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 mb-3 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Thông Tin Liên Hệ</span>
                          <span className="text-[10px] text-emerald-700 font-semibold lowercase">xác thực ✓</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {coachPhone ? (
                              <a href={`tel:${coachPhone}`} className="hover:underline hover:text-emerald-700">
                                {coachPhone}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic font-sans text-[11px]">Đang cập nhật</span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-xs text-slate-800 truncate font-mono">
                            {coachEmail ? (
                              <a href={`mailto:${coachEmail}`} className="hover:underline hover:text-blue-700">
                                {coachEmail}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic font-sans text-[11px]">Đang cập nhật</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Coach Classes Count & Certifications */}
                      <div className="space-y-2 mb-3 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200/60">
                          <span className="font-medium">Lớp đang giảng dạy:</span>
                          <span className="font-bold text-slate-900">
                            {coachClasses.length} Lớp ({totalStudentsInCoachClasses} học viên)
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">Chứng chỉ: <strong className="text-slate-800">{coach.certifications[0]?.title || coach.certifications[0]?.issuer || 'IPTPA / PPR Certified'}</strong></span>
                        </div>

                        {/* Specialties Tags */}
                        {coach.specialties && coach.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {coach.specialties.slice(0, 3).map((spec, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions based on Role */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* ADMIN: Can switch login to this coach */}
                      {effectiveRole === 'admin' && coachUser && (
                        <button
                          onClick={() => setCurrentUser(coachUser)}
                          className="w-full text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
                        >
                          <LogIn className="w-3.5 h-3.5 text-slate-600" />
                          <span>Đăng nhập quyền HLV này</span>
                        </button>
                      )}

                      {/* COACH: View colleague contact */}
                      {effectiveRole === 'coach' && (
                        <div className="w-full flex items-center justify-between text-[11px] text-slate-500 py-1">
                          <span className="text-slate-600 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Đồng nghiệp mạng lưới
                          </span>
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                            Đã xác thực DUPR
                          </span>
                        </div>
                      )}

                      {/* STUDENT: Book / View Detail */}
                      {effectiveRole === 'student' && onSelectCoach && (
                        <button
                          onClick={() => onSelectCoach(coach)}
                          className="w-full text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>Xem Hồ Sơ & Đặt Buổi Học</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
