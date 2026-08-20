import React, { useState } from 'react';
import { 
  Users, Award, Calendar, CheckCircle2, ShieldAlert, Sparkles, 
  RotateCcw, FileText, ChevronDown, Flame, UserCheck, Search,
  GraduationCap, Download, User as UserIcon, Shield, LogIn, Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountModal } from './AccountModal';
import { NotificationDropdown } from './Notifications/NotificationDropdown';
import { WishlistModal } from './StudentView/WishlistModal';
import { AuthModal } from './Auth/AuthModal';
import { UserRole, CoachProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenDocs: () => void;
  onOpenSelfAssessment?: () => void;
  onSelectCoach?: (coach: CoachProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenDocs, onOpenSelfAssessment, onSelectCoach }) => {
  const { currentUser, isLoggedIn, currentRoleMode, switchRole, resetDatabase, users, wishlist } = useApp();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const activeRole: UserRole = currentUser?.role || currentRoleMode || 'student';
  const myWishlistCount = currentUser ? wishlist.filter(w => w.user_id === currentUser.id).length : 0;

  const handleSwitchRoleClick = (role: UserRole) => {
    switchRole(role);
    if (role === 'student') setCurrentTab('home');
    else if (role === 'coach') setCurrentTab('coach_home');
    else setCurrentTab('admin_dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Main Navbar Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand Identity */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group shrink-0" 
              onClick={() => {
                if (activeRole === 'student') setCurrentTab('home');
                else if (activeRole === 'coach') setCurrentTab('coach_home');
                else setCurrentTab('admin_dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-800 group-hover:bg-emerald-600 transition-colors duration-200">
                <span className="font-extrabold text-xl tracking-tight text-emerald-400 group-hover:text-white">P</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight whitespace-nowrap">Pickle<span className="text-emerald-600">Connect</span></span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded">VN</span>
                </div>
                <p className="text-[11px] text-slate-500 hidden 2xl:block font-medium truncate max-w-[220px]">Hệ Thống Huấn Luyện Viên & Lớp</p>
              </div>
            </div>

            {/* Desktop Clean Navigation Tabs (No Clunky Parentheses) */}
            <nav className="hidden lg:flex items-center space-x-1 shrink-0 overflow-x-auto no-scrollbar">
              {activeRole === 'student' && (
                <>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'home' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Search className="w-4 h-4 text-emerald-500" />
                    <span>Tìm HLV</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('classes')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'classes' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span>Lớp Học & Khóa</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('bookings')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'bookings' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Lịch Của Tôi</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('dupr')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'dupr' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Hồ Sơ DUPR</span>
                  </button>
                </>
              )}

              {activeRole === 'coach' && (
                <>
                  <button
                    onClick={() => setCurrentTab('coach_home')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_home' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tổng Quan</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_schedule')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_schedule' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Lịch Dạy</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_students')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_students' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                    <span>Học Viên</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_earnings')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_earnings' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Thu Nhập</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_profile')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_profile' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hồ Sơ HLV</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('coach_stats')}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'coach_stats' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-rose-500" />
                    <span>Đánh Giá</span>
                  </button>
                </>
              )}

              {activeRole === 'admin' && (
                <>
                  <button
                    onClick={() => setCurrentTab('admin_dashboard')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'admin_dashboard' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Doanh Thu</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_classes')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'admin_classes' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Điều Phối Lớp</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_verify')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'admin_verify' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Duyệt HLV</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('admin_users')}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      currentTab === 'admin_users' 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Thành Viên</span>
                  </button>
                </>
              )}
            </nav>

            {/* Quick Segmented Role Switcher + User Profile Pill + Notifications + Wishlist */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Wishlist Button (for students) */}
              {activeRole === 'student' && (
                <button
                  id="btn_navbar_wishlist"
                  onClick={() => setIsWishlistModalOpen(true)}
                  className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors flex items-center justify-center focus:outline-none"
                  title="HLV Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${myWishlistCount > 0 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
                  {myWishlistCount > 0 && (
                    <span 
                      id="badge_wishlist_count"
                      className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                    >
                      {myWishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* Notification Center Dropdown */}
              {isLoggedIn && <NotificationDropdown />}

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
                      className="w-8 h-8 rounded-lg object-cover object-top ring-1 ring-slate-200 shadow-2xs group-hover:scale-105 transition"
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
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
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
              onClick={() => setCurrentTab('coach_home')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_home' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-0.5" />
              <span>Tổng Quan</span>
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
              onClick={() => setCurrentTab('coach_students')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_students' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-0.5" />
              <span>Học Viên</span>
            </button>
            <button 
              onClick={() => setCurrentTab('coach_earnings')} 
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-semibold transition ${
                currentTab === 'coach_earnings' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mb-0.5" />
              <span>Thu Nhập</span>
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

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        onSelectCoach={(coach) => {
          if (onSelectCoach) {
            onSelectCoach(coach);
          }
        }}
        onBookCoach={(coach) => {
          if (onSelectCoach) {
            onSelectCoach(coach);
          }
        }}
      />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};
