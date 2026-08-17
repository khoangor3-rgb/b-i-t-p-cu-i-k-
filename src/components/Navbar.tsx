import React, { useState } from 'react';
import { 
  Users, Award, Calendar, CheckCircle2, ShieldAlert, Sparkles, 
  RotateCcw, FileText, ChevronDown, Flame, UserCheck, Search,
  GraduationCap, Download, User as UserIcon, Shield, LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountModal } from './AccountModal';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenDocs: () => void;
  onOpenSelfAssessment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenDocs, onOpenSelfAssessment }) => {
  const { currentUser, isLoggedIn, currentRoleMode, switchRole, resetDatabase, users } = useApp();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const activeRole: UserRole = currentUser?.role || currentRoleMode || 'student';

  const handleSwitchRoleClick = (role: UserRole) => {
    switchRole(role);
    if (role === 'student') setCurrentTab('home');
    else if (role === 'coach') setCurrentTab('coach_schedule');
    else setCurrentTab('admin_dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top Enterprise Bar */}
        <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1.5 text-[11px] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Chuẩn Quốc Tế & DUPR
              </span>
              <span className="hidden md:inline text-slate-300 text-xs truncate">
                Chính sách <span className="font-semibold text-white">Love Your Lesson</span>: Đổi HLV hoặc hoàn phí 100% nếu chưa hài lòng trong buổi đầu tiên.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenSelfAssessment && (
                <button
                  onClick={onOpenSelfAssessment}
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] sm:text-xs px-3 py-1 rounded-lg transition cursor-pointer shadow-xs"
                  title="Thẩm định trình độ DUPR 6 kỹ năng tiêu chuẩn"
                >
                  <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                  <span>Đánh Giá DUPR</span>
                </button>
              )}

              <a
                href="/pickleconnect-standalone.html"
                download="PickleConnect_Enterprise.html"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] sm:text-xs px-2.5 py-1 rounded-lg transition cursor-pointer"
                title="Tải về bản HTML độc lập hoàn chỉnh"
              >
                <Download className="w-3 h-3 text-slate-300" />
                <span>Xuất File HTML</span>
              </a>

              <button
                onClick={onOpenDocs}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] sm:text-xs px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <FileText className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Tài Liệu Đồ Án & Báo Cáo</span>
                <span className="sm:hidden">Tài Liệu</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Navbar Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand Identity */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => {
                if (activeRole === 'student') setCurrentTab('home');
                else if (activeRole === 'coach') setCurrentTab('coach_schedule');
                else setCurrentTab('admin_dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-800 group-hover:bg-emerald-600 transition-colors duration-200">
                <span className="font-extrabold text-xl tracking-tight text-emerald-400 group-hover:text-white">P</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">Pickle<span className="text-emerald-600">Connect</span></span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded">VN</span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Hệ Thống Huấn Luyện Viên & Lớp Học Chuyên Nghiệp</p>
              </div>
            </div>

            {/* Desktop Clean Navigation Tabs (No Clunky Parentheses) */}
            <nav className="hidden md:flex items-center space-x-1">
              {activeRole === 'student' && (
                <>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'home' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Tìm Huấn Luyện Viên</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('classes')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'classes' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Khóa Học & Lớp Nhóm</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('bookings')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'bookings' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lịch Học Của Tôi</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('dupr')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'dupr' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Hồ Sơ DUPR</span>
                  </button>
                </>
              )}

              {activeRole === 'coach' && (
                <>
                  <button
                    onClick={() => setCurrentTab('coach_classes')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'coach_classes' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Quản Lý Lớp Học</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_schedule')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'coach_schedule' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lịch Dạy & Đặt Chỗ</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_profile')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'coach_profile' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Hồ Sơ Huấn Luyện</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_stats')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'coach_stats' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Hiệu Suất & Đánh Giá</span>
                  </button>
                </>
              )}

              {activeRole === 'admin' && (
                <>
                  <button
                    onClick={() => setCurrentTab('admin_dashboard')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'admin_dashboard' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Bảng Chỉ Số Doanh Thu</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_classes')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'admin_classes' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Điều Phối Lớp Học</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_verify')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'admin_verify' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Xác Thực Huấn Luyện Viên</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_users')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                      currentTab === 'admin_users' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Cơ Sở Dữ Liệu Thành Viên</span>
                  </button>
                </>
              )}
            </nav>

            {/* Quick Segmented Role Switcher + User Profile Pill */}
            <div className="flex items-center space-x-3">
              
              {/* Segmented Role Switcher Controller (Clean Enterprise Style) */}
              <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
                <button
                  onClick={() => handleSwitchRoleClick('admin')}
                  className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    activeRole === 'admin' 
                      ? 'bg-purple-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title="Chuyển sang phân hệ Quản Trị Viên"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Quản Trị</span>
                </button>

                <button
                  onClick={() => handleSwitchRoleClick('coach')}
                  className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    activeRole === 'coach' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title="Chuyển sang phân hệ Huấn Luyện Viên"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Huấn Luyện Viên</span>
                </button>

                <button
                  onClick={() => handleSwitchRoleClick('student')}
                  className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    activeRole === 'student' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title="Chuyển sang phân hệ Học Viên"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Học Viên</span>
                </button>
              </div>

              {/* Main User Profile Button / Login CTA */}
              {isLoggedIn && currentUser ? (
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all duration-150 cursor-pointer group"
                  title="Hồ sơ tài khoản, ưu đãi & cài đặt"
                >
                  <div className="relative">
                    <img 
                      src={currentUser.avatar_url} 
                      alt={currentUser.full_name} 
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shadow-2xs group-hover:scale-105 transition"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {currentUser.full_name.split('(')[0].trim()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentUser.role === 'admin' ? 'bg-purple-600' :
                        currentUser.role === 'coach' ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}></span>
                      <span className="font-semibold text-slate-600">
                        {currentUser.role === 'admin' ? 'Quản Trị' : currentUser.role === 'coach' ? 'HLV' : 'Học Viên'}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition" />
                </button>
              ) : (
                /* When Logged Out: Clean Enterprise Login Button */
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all duration-150 cursor-pointer font-semibold text-xs"
                  title="Đăng nhập tài khoản"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Đăng Nhập</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Clean & Modern) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-around">
        {activeRole === 'student' && (
          <>
            <button 
              onClick={() => setCurrentTab('home')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'home' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span>Tìm HLV</span>
            </button>
            <button 
              onClick={() => setCurrentTab('classes')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'classes' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-0.5" />
              <span>Khóa Học</span>
            </button>
            <button 
              onClick={() => setCurrentTab('bookings')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'bookings' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4 mb-0.5" />
              <span>Lịch Học</span>
            </button>
            <button 
              onClick={() => setIsAccountModalOpen(true)} 
              className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-emerald-700"
            >
              {isLoggedIn ? <UserIcon className="w-4 h-4 mb-0.5" /> : <LogIn className="w-4 h-4 mb-0.5 text-slate-900" />}
              <span>{isLoggedIn ? 'Tài Khoản' : 'Đăng Nhập'}</span>
            </button>
          </>
        )}

        {activeRole === 'coach' && (
          <>
            <button 
              onClick={() => setCurrentTab('coach_classes')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_classes' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-0.5" />
              <span>Lớp Học</span>
            </button>
            <button 
              onClick={() => setCurrentTab('coach_schedule')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_schedule' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4 mb-0.5" />
              <span>Lịch Dạy</span>
            </button>
            <button 
              onClick={() => setCurrentTab('coach_profile')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_profile' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <UserCheck className="w-4 h-4 mb-0.5" />
              <span>Hồ Sơ HLV</span>
            </button>
            <button 
              onClick={() => setIsAccountModalOpen(true)} 
              className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-emerald-700"
            >
              {isLoggedIn ? <UserIcon className="w-4 h-4 mb-0.5" /> : <LogIn className="w-4 h-4 mb-0.5 text-slate-900" />}
              <span>{isLoggedIn ? 'Tài Khoản' : 'Đăng Nhập'}</span>
            </button>
          </>
        )}

        {activeRole === 'admin' && (
          <>
            <button 
              onClick={() => setCurrentTab('admin_dashboard')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'admin_dashboard' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'
              }`}
            >
              <Flame className="w-4 h-4 mb-0.5" />
              <span>Báo Cáo</span>
            </button>
            <button 
              onClick={() => setCurrentTab('admin_classes')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'admin_classes' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-0.5" />
              <span>Lớp Học</span>
            </button>
            <button 
              onClick={() => setCurrentTab('admin_verify')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'admin_verify' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-0.5" />
              <span>Duyệt HLV</span>
            </button>
            <button 
              onClick={() => setIsAccountModalOpen(true)} 
              className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-purple-700"
            >
              {isLoggedIn ? <UserIcon className="w-4 h-4 mb-0.5" /> : <LogIn className="w-4 h-4 mb-0.5 text-purple-700" />}
              <span>{isLoggedIn ? 'Tài Khoản' : 'Đăng Nhập'}</span>
            </button>
          </>
        )}
      </div>

      {/* Account Switcher Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSelectRoleTab={(tab) => setCurrentTab(tab)}
      />
    </>
  );
};
