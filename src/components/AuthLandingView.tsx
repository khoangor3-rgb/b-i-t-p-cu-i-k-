import React, { useState } from 'react';
import { 
  ShieldCheck, Award, GraduationCap, Users, LogIn, 
  Sparkles, CheckCircle2, Lock, ArrowRight, Star,
  Calendar, Check, Shield, Search, ChevronRight, UserPlus, KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './Auth/AuthModal';
import { UserRole } from '../types';

export const AuthLandingView: React.FC = () => {
  const { users, coaches, login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  // 1. Admin account
  const adminUser = users.find(u => u.role === 'admin') || users[0];

  // 2. Coaches
  const coachUsers = users.filter(u => u.role === 'coach');

  // 3. Students
  const studentUsers = users.filter(u => u.role === 'student');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) {
      alert('Vui lòng nhập Email hoặc chọn một tài khoản mẫu bên dưới.');
      return;
    }
    const inputEmail = (customEmail || '').trim().toLowerCase();
    const matched = users.find(u => (u.email || '').toLowerCase() === inputEmail);
    if (matched) {
      login(matched.id);
    } else {
      // Pick first user of selected role
      const fallback = users.find(u => u.role === selectedRole);
      if (fallback) login(fallback.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Enterprise Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-900/30">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">PickleConnect</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.2 rounded">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Hệ Thống Quản Trị & Đào Tạo Pickleball Chuẩn Quốc Tế</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition hover:bg-emerald-900/60"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Ký Tài Khoản</span>
            </button>
            <button
              onClick={() => {
                setAuthModalTab('forgot');
                setIsAuthModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl font-medium cursor-pointer transition hover:bg-slate-700/60"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quên Mật Khẩu</span>
            </button>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-full font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Bảo Mật DUPR
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300 font-semibold mb-4 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bạn đã đăng xuất an toàn khỏi hệ thống</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Cổng Đăng Nhập <span className="text-emerald-400">PickleConnect</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Hệ thống phân quyền nghiêm ngặt dành riêng cho <strong>Học viên</strong>, <strong>Huấn luyện viên</strong> và <strong>Quản trị viên</strong>. Vui lòng chọn phân quyền để tiếp tục truy cập dữ liệu đào tạo.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 max-w-xl mx-auto mb-8 grid grid-cols-3 gap-1 shadow-lg">
          <button
            onClick={() => setSelectedRole('student')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Học Viên</span>
            <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded font-mono">50</span>
          </button>

          <button
            onClick={() => setSelectedRole('coach')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'coach'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Huấn Luyện Viên</span>
            <span className="text-[10px] bg-purple-700/80 px-1.5 py-0.2 rounded font-mono">10</span>
          </button>

          <button
            onClick={() => setSelectedRole('admin')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Quản Trị Viên</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* CASE 1: STUDENT SELECTION (50 STUDENTS LIST + FORM)       */}
        {/* ========================================================= */}
        {selectedRole === 'student' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  Đăng Nhập Tài Khoản Học Viên (50 Thành Viên)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chọn nhanh học viên bất kỳ để vào trải nghiệm đặt lịch, tự thẩm định DUPR và đăng ký lớp học.
                </p>
              </div>

              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm học viên theo tên, email, khu vực..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Quick 1-Click Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {studentUsers
                .filter(st => {
                  if (!searchQuery) return true;
                  const q = (searchQuery || '').trim().toLowerCase();
                  const name = (st.full_name || '').toLowerCase();
                  const email = (st.email || '').toLowerCase();
                  const loc = (st.location || '').toLowerCase();
                  return name.includes(q) || email.includes(q) || loc.includes(q);
                })
                .map((student, idx) => {
                  return (
                    <div
                      key={student.id}
                      onClick={() => login(student.id)}
                      className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/50 p-3.5 rounded-xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={student.avatar_url}
                          alt={student.full_name}
                          className="w-10 h-10 rounded-full object-cover object-top ring-1 ring-slate-700 group-hover:ring-emerald-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition">
                            {student.full_name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate font-mono">
                            {student.phone}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {student.dupr_rating && (
                              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-slate-700">
                                DUPR {student.dupr_rating}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 truncate">
                              {student.location || 'TP.HCM'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition shrink-0 p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 2: COACH SELECTION (10 PROFESSIONAL COACHES)         */}
        {/* ========================================================= */}
        {selectedRole === 'coach' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Đăng Nhập Huấn Luyện Viên Chuyên Nghiệp (10 HLV)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chọn huấn luyện viên để truy cập lịch dạy, học viên lớp phụ trách và thống kê doanh thu.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm HLV theo tên, chuyên môn, khu vực..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {coaches
                .filter(coach => {
                  if (!searchQuery) return true;
                  const q = (searchQuery || '').trim().toLowerCase();
                  const cUser = coach.user || users.find(u => u.id === coach.user_id);
                  const name = (cUser?.full_name || '').toLowerCase();
                  const area = (coach.area || '').toLowerCase();
                  const specialties = coach.specialties || [];
                  return (
                    name.includes(q) ||
                    area.includes(q) ||
                    specialties.some(s => (s || '').toLowerCase().includes(q))
                  );
                })
                .map((coach) => {
                  const coachUser = coach.user || users.find(u => u.id === coach.user_id);
                  if (!coachUser) return null;

                  return (
                    <div
                      key={coach.id}
                      onClick={() => login(coachUser.id)}
                      className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-purple-500/50 p-4 rounded-xl transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={coachUser.avatar_url}
                          alt={coachUser.full_name}
                          className="w-12 h-12 rounded-xl object-cover object-top ring-1 ring-slate-700 group-hover:ring-purple-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-white group-hover:text-purple-300 transition truncate">
                              {coachUser.full_name}
                            </span>
                            <span className="bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[10px] font-bold px-1.5 py-0.2 rounded">
                              DUPR {coach.dupr_level}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {coach.area}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                            {coach.price_per_session.toLocaleString('vi-VN')} đ / giờ
                          </div>
                        </div>
                      </div>

                      <button className="text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition shrink-0 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 3: ADMIN SELECTION (ADMIN LEAD)                      */}
        {/* ========================================================= */}
        {selectedRole === 'admin' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl mx-auto w-full space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Quản Trị Viên Trưởng (Admin Lead)</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Tài khoản toàn quyền điều phối 50 học viên, phân bổ 9 lớp học, duyệt hồ sơ 10 huấn luyện viên và kiểm soát chất lượng toàn hệ thống.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <img
                  src={adminUser.avatar_url}
                  alt={adminUser.full_name}
                  className="w-11 h-11 rounded-full object-cover object-top ring-1 ring-blue-500"
                />
                <div>
                  <div className="font-bold text-sm text-white">{adminUser.full_name}</div>
                  <div className="text-xs text-slate-400">{adminUser.email}</div>
                  <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Toàn Quyền Quản Trị Hệ Thống</div>
                </div>
              </div>

              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-1 rounded">
                Admin
              </span>
            </div>

            <button
              onClick={() => login(adminUser.id)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/30"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Vào Ban Quản Trị</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>PickleConnect VN • Nền tảng kết nối Huấn luyện viên Pickleball chuẩn Quốc Tế & DUPR</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </div>
  );
};
