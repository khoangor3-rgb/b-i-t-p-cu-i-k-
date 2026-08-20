import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, User, Award, Shield, Check, Search, 
  MapPin, Phone, Mail, RotateCcw, LogOut, LogIn, CheckCircle2,
  Edit3, Save, Tag, Gift, Bell, Lock, Key, PlusCircle, ArrowRight,
  Sparkles, Calendar, DollarSign, ChevronRight, Copy, AlertCircle, Eye, EyeOff, UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, User as UserType } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleTab: (tab: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80'
];

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSelectRoleTab }) => {
  const { 
    currentUser, isLoggedIn, currentRoleMode, setCurrentRoleMode,
    users, coaches, bookings, 
    updateUserProfile, updateCoachProfile, addNewUser, login, logout, resetDatabase 
  } = useApp();

  // Active Main Tab when logged in
  const [activeTab, setActiveTab] = useState<'profile' | 'vouchers' | 'settings' | 'add_account' | 'switch_account'>('profile');

  // Active Login Role Tab when logged out (matches currentRoleMode)
  const [loginRoleTab, setLoginRoleTab] = useState<UserRole>('student');
  const [loginSearchQuery, setLoginSearchQuery] = useState('');

  // Admin login form simulation
  const [adminPin, setAdminPin] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDupr, setEditDupr] = useState<number>(3.0);
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Coach-specific state
  const coachProfile = useMemo(() => {
    if (!currentUser) return null;
    return coaches.find(c => c.user_id === currentUser.id) || null;
  }, [coaches, currentUser]);

  const [editCoachBio, setEditCoachBio] = useState('');
  const [editCoachExp, setEditCoachExp] = useState(3);
  const [editCoachPrice, setEditCoachPrice] = useState(400000);

  // Notification / Feedback banner
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add Account Form State
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('Quận 1, TP.HCM');
  const [newDupr, setNewDupr] = useState<number>(3.0);
  const [newCoachPrice, setNewCoachPrice] = useState<number>(400000);
  const [newCoachExp, setNewCoachExp] = useState<number>(3);

  // Settings State
  const [smsNotif, setSmsNotif] = useState(true);
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [reminder2h, setReminder2h] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Switch Account Search
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize login role tab from currentRoleMode
  useEffect(() => {
    if (currentRoleMode) {
      setLoginRoleTab(currentRoleMode);
    }
  }, [currentRoleMode, isOpen]);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditFullName(currentUser.full_name);
      setEditEmail(currentUser.email);
      setEditPhone(currentUser.phone || '0901234567');
      setEditLocation(currentUser.location || 'Quận 7, TP.HCM');
      setEditDupr(currentUser.dupr_rating || 3.0);
      setEditAvatarUrl(currentUser.avatar_url);
      if (coachProfile) {
        setEditCoachBio(coachProfile.bio);
        setEditCoachExp(coachProfile.experience_years);
        setEditCoachPrice(coachProfile.price_per_session);
      }
    }
  }, [currentUser, coachProfile]);

  // Vouchers list
  const vouchers = [
    {
      code: 'PICKLE-NEW-20',
      title: 'Giảm 20% Buổi Học Đầu Tiên',
      desc: 'Áp dụng cho học viên mới đăng ký học kèm 1-1 với bất kỳ HLV nào.',
      discount: '20% OFF',
      expiry: '31/12/2026',
      badge: 'Dành cho bạn'
    },
    {
      code: 'DUPR-BOOST-15',
      title: 'Giảm 15% Gói Nâng Tầm Kỹ Năng',
      desc: 'Giảm 15% khi đăng ký trọn gói khóa học từ 5 buổi trở lên.',
      discount: '15% OFF',
      expiry: '15/10/2026',
      badge: 'Khóa trọn gói'
    },
    {
      code: 'LOVE-LESSON-100',
      title: 'Bảo Hành Love Your Lesson 100%',
      desc: 'Cam kết hoàn tiền 100% hoặc đổi HLV miễn phí nếu chưa hài lòng sau buổi 1.',
      discount: '100% An Tâm',
      expiry: 'Vĩnh viễn',
      badge: 'Bảo hành độc quyền'
    },
    {
      code: 'FRIEND-PASS-50K',
      title: 'Tặng 50.000đ Giới Thiệu Bạn Bè',
      desc: 'Nhận ngay 50k vào ví ưu đãi khi rủ bạn bè cùng tham gia tập Pickleball.',
      discount: '50.000đ',
      expiry: '30/11/2026',
      badge: 'Giới thiệu'
    }
  ];

  // Role-isolated users for switcher (WHEN LOGGED IN: strictly show same role only!)
  const sameRoleUsers = useMemo(() => {
    if (!currentUser) return [];
    const role = currentUser.role;
    return users.filter(u => {
      const matchRole = u.role === role;
      const matchQuery = !searchQuery || 
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRole && matchQuery;
    });
  }, [users, currentUser, searchQuery]);

  // Role-isolated users for Login screen (WHEN LOGGED OUT)
  const loginCandidates = useMemo(() => {
    return users.filter(u => {
      const matchRole = u.role === loginRoleTab;
      const matchQuery = !loginSearchQuery || 
        u.full_name.toLowerCase().includes(loginSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(loginSearchQuery.toLowerCase()) ||
        (u.location && u.location.toLowerCase().includes(loginSearchQuery.toLowerCase()));
      return matchRole && matchQuery;
    });
  }, [users, loginRoleTab, loginSearchQuery]);

  if (!isOpen) return null;

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUserProfile(currentUser.id, {
      full_name: editFullName,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      dupr_rating: editDupr,
      avatar_url: editAvatarUrl
    });

    if (currentUser.role === 'coach' && coachProfile) {
      updateCoachProfile(coachProfile.id, {
        bio: editCoachBio,
        experience_years: editCoachExp,
        price_per_session: editCoachPrice,
        area: editLocation
      });
    }

    setIsEditingProfile(false);
    setFeedbackNotice({ type: 'success', message: 'Thông tin cá nhân đã được lưu & cập nhật thành công!' });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Copy voucher
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setFeedbackNotice({ type: 'info', message: `Đã sao chép mã ưu đãi "${code}" vào bộ nhớ tạm!` });
    setTimeout(() => {
      setCopiedCode(null);
      setFeedbackNotice(null);
    }, 3000);
  };

  // Add new account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      alert('Vui lòng nhập họ tên và email hợp lệ.');
      return;
    }

    const newUser = addNewUser(
      {
        full_name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || '0912345678',
        role: newRole,
        location: newLocation,
        dupr_rating: newDupr,
        avatar_url: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]
      },
      newRole === 'coach' ? {
        price_per_session: newCoachPrice,
        experience_years: newCoachExp,
        area: newLocation
      } : undefined
    );

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setActiveTab('profile');
    if (newUser.role === 'student') onSelectRoleTab('home');
    else if (newUser.role === 'coach') onSelectRoleTab('coach_schedule');
    else onSelectRoleTab('admin_dashboard');

    setFeedbackNotice({ type: 'success', message: `Tài khoản mới "${newUser.full_name}" đã được tạo và tự động đăng nhập!` });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Handle Switch User (Same role)
  const handleSwitchUser = (u: UserType) => {
    login(u.id);
    setActiveTab('profile');
    setFeedbackNotice({ type: 'success', message: `Đã chuyển sang tài khoản: ${u.full_name}` });
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Handle Login User (From login candidates list)
  const handleLoginUser = (u: UserType) => {
    login(u.id);
    if (u.role === 'student') onSelectRoleTab('home');
    else if (u.role === 'coach') onSelectRoleTab('coach_schedule');
    else onSelectRoleTab('admin_dashboard');
    setActiveTab('profile');
    setFeedbackNotice({ type: 'success', message: `Đăng nhập thành công với tư cách ${u.role === 'admin' ? 'Admin' : u.role === 'coach' ? 'Huấn Luyện Viên' : 'Học Viên'}: ${u.full_name}!` });
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    setFeedbackNotice({ type: 'info', message: 'Bạn đã đăng xuất hoàn toàn khỏi hệ thống.' });
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Count bookings
  const userBookings = currentUser ? bookings.filter(b => b.student_id === currentUser.id) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner ${
              isLoggedIn && currentUser 
                ? 'bg-emerald-600/30 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-600/30 border-amber-500/30 text-amber-400'
            }`}>
              {isLoggedIn ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {isLoggedIn && currentUser ? 'Hồ Sơ & Tài Khoản Cá Nhân' : 'Đăng Nhập Hệ Thống PickleConnect'}
                </h3>
                {isLoggedIn && currentUser ? (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    currentUser.role === 'admin' ? 'bg-purple-500 text-white' :
                    currentUser.role === 'coach' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'coach' ? 'Huấn Luyện Viên' : 'Học Viên'}
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Chưa đăng nhập
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                {isLoggedIn ? 'Trung tâm quản lý thông tin cá nhân, ưu đãi & cài đặt' : 'Vui lòng chọn hoặc đăng nhập tài khoản theo đúng vai trò'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Notice */}
        {feedbackNotice && (
          <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-semibold shrink-0 animate-in slide-in-from-top-1 ${
            feedbackNotice.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200' :
            feedbackNotice.type === 'error' ? 'bg-rose-50 text-rose-900 border-b border-rose-200' :
            'bg-blue-50 text-blue-900 border-b border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackNotice.message}</span>
            </div>
            <button onClick={() => setFeedbackNotice(null)} className="text-[11px] text-slate-500 hover:underline cursor-pointer">Đóng</button>
          </div>
        )}

        {/* ======================================================== */}
        {/* LOGGED IN VIEW: Full Profile Tabs & Role-Isolated Switcher */}
        {/* ======================================================== */}
        {isLoggedIn && currentUser ? (
          <>
            {/* Navigation Tabs Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-5 py-2 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hồ Sơ Của Tôi</span>
              </button>

              <button
                onClick={() => setActiveTab('vouchers')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'vouchers' 
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>Ưu Đãi & Voucher</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">4</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Cài Đặt & Bảo Mật</span>
              </button>

              <button
                onClick={() => setActiveTab('add_account')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'add_account' 
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>Thêm Tài Khoản</span>
              </button>

              <button
                onClick={() => setActiveTab('switch_account')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'switch_account' 
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>
                  Chuyển Tài Khoản
                </span>
              </button>
            </div>

            {/* Modal Body Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* TAB 1: HỒ SƠ CÁ NHÂN */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  {/* Profile Card Summary Banner */}
                  <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img 
                            src={currentUser.avatar_url} 
                            alt={currentUser.full_name} 
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover object-top ring-2 ring-emerald-400/80 shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-lg sm:text-xl font-black text-white">{currentUser.full_name}</h4>
                            <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {currentUser.role === 'admin' ? 'Quản Trị Viên' : currentUser.role === 'coach' ? 'HLV Chuyên Nghiệp' : 'Học Viên Pickleball'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {currentUser.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {currentUser.phone || '0901.234.567'}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {currentUser.dupr_rating && (
                              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                DUPR Score: {currentUser.dupr_rating}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {currentUser.location || 'TP.HCM'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="self-start sm:self-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-white/15 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{isEditingProfile ? 'Hủy Chỉnh Sửa' : 'Chỉnh Sửa Thông Tin'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Statistics Overview */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                      <div className="text-xs text-slate-500 font-semibold">
                        {currentUser.role === 'coach' ? 'Học viên theo học' : currentUser.role === 'admin' ? 'Tổng HLV duyệt' : 'Buổi học đã đặt'}
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        {currentUser.role === 'coach' ? coachProfile?.students_count || 12 : currentUser.role === 'admin' ? 10 : userBookings.length}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                      <div className="text-xs text-slate-500 font-semibold">
                        {currentUser.role === 'coach' ? 'Đánh giá trung bình' : 'Trình độ DUPR'}
                      </div>
                      <div className="text-xl font-black text-emerald-700 mt-0.5">
                        {currentUser.role === 'coach' ? `${coachProfile?.rating_avg || 4.9} ⭐` : `${currentUser.dupr_rating || 3.0} Pro`}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                      <div className="text-xs text-slate-500 font-semibold">Ví Voucher</div>
                      <div className="text-xl font-black text-amber-600 mt-0.5">4 Mã Ưu Đãi</div>
                    </div>
                  </div>

                  {/* Edit Form or View Information */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-emerald-600" />
                          <span>Cập Nhật Thông Tin Cá Nhân</span>
                        </h5>
                        <span className="text-xs text-slate-400">Thay đổi sẽ lưu tức thì</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Họ và tên *</label>
                          <input 
                            type="text" 
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Email đăng nhập *</label>
                          <input 
                            type="email" 
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                          <input 
                            type="tel" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Khu vực / Quận sinh sống *</label>
                          <input 
                            type="text" 
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Trình độ DUPR cá nhân (1.0 - 6.0)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            min="1.0"
                            max="6.0"
                            value={editDupr}
                            onChange={(e) => setEditDupr(parseFloat(e.target.value) || 3.0)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Link Ảnh đại diện (Avatar URL)</label>
                          <input 
                            type="url" 
                            value={editAvatarUrl}
                            onChange={(e) => setEditAvatarUrl(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
                          />
                        </div>
                      </div>

                      {/* Preset Avatar Selector */}
                      <div>
                        <label className="font-bold text-slate-700 text-xs block mb-1.5">Hoặc chọn nhanh ảnh đại diện mẫu:</label>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {PRESET_AVATARS.map((url, idx) => (
                            <img 
                              key={idx}
                              src={url} 
                              alt="Avatar option" 
                              onClick={() => setEditAvatarUrl(url)}
                              className={`w-10 h-10 rounded-xl object-cover object-top cursor-pointer transition ring-2 ${
                                editAvatarUrl === url ? 'ring-emerald-600 scale-105 shadow-md' : 'ring-transparent opacity-70 hover:opacity-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* If Coach, edit Coach bio & fee */}
                      {currentUser.role === 'coach' && (
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="font-bold text-xs text-emerald-900">Thiết lập chuyên môn Huấn Luyện Viên:</div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="font-semibold text-slate-700 block mb-1">Học phí mỗi buổi (VNĐ)</label>
                              <input 
                                type="number" 
                                step="50000"
                                value={editCoachPrice}
                                onChange={(e) => setEditCoachPrice(parseInt(e.target.value) || 400000)}
                                className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                              />
                            </div>

                            <div>
                              <label className="font-semibold text-slate-700 block mb-1">Số năm kinh nghiệm giảng dạy</label>
                              <input 
                                type="number" 
                                value={editCoachExp}
                                onChange={(e) => setEditCoachExp(parseInt(e.target.value) || 3)}
                                className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 text-xs block mb-1">Lời giới thiệu & Triết lý đào tạo</label>
                            <textarea 
                              rows={3}
                              value={editCoachBio}
                              onChange={(e) => setEditCoachBio(e.target.value)}
                              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Lưu Thay Đổi</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Read-Only Details */
                    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-3">
                      <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">Thông Tin Chi Tiết Hồ Sơ</div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                          <strong className="text-slate-900 text-sm">{currentUser.full_name}</strong>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-slate-400 block text-[11px]">Email đăng nhập:</span>
                          <strong className="text-slate-900 text-sm">{currentUser.email}</strong>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                          <strong className="text-slate-900 text-sm">{currentUser.phone || '0901.234.567'}</strong>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-slate-400 block text-[11px]">Khu vực hoạt động:</span>
                          <strong className="text-slate-900 text-sm">{currentUser.location || 'TP. Hồ Chí Minh'}</strong>
                        </div>
                      </div>

                      {currentUser.role === 'coach' && coachProfile && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5 mt-2">
                          <div className="font-bold text-emerald-900">Giới thiệu chuyên môn HLV:</div>
                          <p className="italic">{coachProfile.bio}</p>
                          <div className="flex items-center gap-4 text-[11px] text-emerald-800 font-semibold pt-1">
                            <span>Học phí: {coachProfile.price_per_session.toLocaleString('vi-VN')} đ/buổi</span>
                            <span>•</span>
                            <span>{coachProfile.experience_years} năm kinh nghiệm</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: ƯU ĐÃI & VOUCHER */}
              {activeTab === 'vouchers' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 sm:p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-100 uppercase tracking-wider">Ví Ưu Đãi Thành Viên</div>
                      <div className="text-xl sm:text-2xl font-black mt-0.5">250.000 PicklePoints</div>
                      <p className="text-[11px] text-amber-100/90 mt-1">Đổi điểm lấy học phí hoặc vợt bóng tại sân liên kết</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-700">Danh Sách Mã Ưu Đãi Khả Dụng ({vouchers.length}):</div>

                  <div className="space-y-3">
                    {vouchers.map((v, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                              {v.badge}
                            </span>
                            <h6 className="font-extrabold text-sm text-slate-900">{v.title}</h6>
                          </div>
                          <p className="text-xs text-slate-500">{v.desc}</p>
                          <div className="text-[11px] text-slate-400">Hạn sử dụng: <strong>{v.expiry}</strong></div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <div className="bg-slate-100 px-3 py-1.5 rounded-xl font-mono font-bold text-xs text-slate-800 border border-slate-200">
                            {v.code}
                          </div>
                          <button
                            onClick={() => handleCopyVoucher(v.code)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer ${
                              copiedCode === v.code 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            {copiedCode === v.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode === v.code ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CÀI ĐẶT & BẢO MẬT */}
              {activeTab === 'settings' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>Cài Đặt Thông Báo & Nhắc Lịch</span>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                        <div>
                          <div className="font-bold text-slate-900">Thông báo SMS nhắc buổi học</div>
                          <div className="text-[11px] text-slate-500">Nhận tin nhắn trước giờ học 2 tiếng</div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={reminder2h} 
                          onChange={(e) => setReminder2h(e.target.checked)} 
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                        <div>
                          <div className="font-bold text-slate-900">Thông báo Zalo khi HLV duyệt lịch</div>
                          <div className="text-[11px] text-slate-500">Cập nhật tức thì khi có thay đổi trạng thái</div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={smsNotif} 
                          onChange={(e) => setSmsNotif(e.target.checked)} 
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                        <div>
                          <div className="font-bold text-slate-900">Biên lai & Hóa đơn điện tử qua Email</div>
                          <div className="text-[11px] text-slate-500">Gửi hóa đơn sau mỗi buổi học thành công</div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={emailReceipt} 
                          onChange={(e) => setEmailReceipt(e.target.checked)} 
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span>Bảo Mật & Mật Khẩu</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                        <input 
                          type="password" 
                          defaultValue="••••••••" 
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Mật khẩu mới</label>
                        <input 
                          type="password" 
                          placeholder="Nhập mật khẩu mới..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl mt-2">
                      <div>
                        <div className="font-bold text-slate-900">Xác thực 2 lớp (2FA OTP)</div>
                        <div className="text-[11px] text-slate-500">Bảo vệ tài khoản với mã OTP khi đăng nhập</div>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorAuth(!twoFactorAuth);
                          setFeedbackNotice({ type: 'info', message: twoFactorAuth ? 'Đã tắt xác thực 2 lớp.' : 'Đã kích hoạt xác thực 2 lớp qua SMS!' });
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                          twoFactorAuth ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {twoFactorAuth ? 'Đang bật' : 'Bật 2FA'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THÊM TÀI KHOẢN MỚI */}
              {activeTab === 'add_account' && (
                <form onSubmit={handleCreateAccount} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
                  <div>
                    <h5 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-purple-600" />
                      <span>Đăng Ký / Thêm Tài Khoản Mới</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">Tạo tài khoản mới cho vai trò tương ứng</p>
                  </div>

                  <div>
                    <label className="font-bold text-xs text-slate-700 block mb-1.5">Chọn vai trò tài khoản: *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewRole('student')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                          newRole === 'student' ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Học Viên</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewRole('coach')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                          newRole === 'coach' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Huấn Luyện Viên</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewRole('admin')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                          newRole === 'admin' ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Quản Trị Viên</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Họ và tên *</label>
                      <input 
                        type="text" 
                        placeholder="VD: Nguyễn Văn A"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email đăng nhập *</label>
                      <input 
                        type="email" 
                        placeholder="VD: nguyenvana@pickle.vn"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Số điện thoại</label>
                      <input 
                        type="tel" 
                        placeholder="VD: 0988123456"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Khu vực hoạt động</label>
                      <input 
                        type="text" 
                        placeholder="VD: Quận 1, TP.HCM"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                      />
                    </div>

                    {newRole === 'student' && (
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Trình độ DUPR ban đầu (1.0 - 5.5)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="1.0"
                          max="6.0"
                          value={newDupr}
                          onChange={(e) => setNewDupr(parseFloat(e.target.value) || 3.0)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                        />
                      </div>
                    )}

                    {newRole === 'coach' && (
                      <>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Học phí mỗi buổi (VNĐ)</label>
                          <input 
                            type="number" 
                            step="50000"
                            value={newCoachPrice}
                            onChange={(e) => setNewCoachPrice(parseInt(e.target.value) || 400000)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Số năm kinh nghiệm</label>
                          <input 
                            type="number" 
                            value={newCoachExp}
                            onChange={(e) => setNewCoachExp(parseInt(e.target.value) || 3)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Tạo Tài Khoản & Đăng Nhập Ngay</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: CHUYỂN TÀI KHOẢN (STRICTLY SAME ROLE ONLY) */}
              {activeTab === 'switch_account' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                          Danh Sách Tài Khoản {currentUser.role === 'student' ? 'Học Viên' : currentUser.role === 'coach' ? 'Huấn Luyện Viên' : 'Quản Trị Viên'}
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Phân quyền hệ thống: Chỉ chuyển đổi giữa các tài khoản thuộc nhóm vai trò <strong>{currentUser.role === 'student' ? 'Học Viên' : currentUser.role === 'coach' ? 'Huấn Luyện Viên' : 'Quản Trị Viên'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Tìm theo tên, email, khu vực...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-emerald-600 font-medium"
                    />
                  </div>

                  {/* List of Same-Role Users */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {sameRoleUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => handleSwitchUser(u)}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                            isCurrent 
                              ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/50' 
                              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={u.avatar_url} 
                              alt={u.full_name} 
                              className="w-10 h-10 rounded-xl object-cover object-top ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 truncate">{u.full_name}</span>
                                {isCurrent && (
                                  <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                                    Đang dùng
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                <span>{u.email}</span>
                                {u.location && <span>• {u.location}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {u.dupr_rating && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                                DUPR {u.dupr_rating}
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              u.role === 'coach' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {u.role === 'student' ? 'Học Viên' : u.role === 'coach' ? 'HLV' : 'Admin'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn khôi phục lại toàn bộ dữ liệu ban đầu? Tất cả chỉnh sửa thử nghiệm sẽ được đặt lại.')) {
                      resetDatabase();
                      setFeedbackNotice({ type: 'info', message: 'Đã khôi phục dữ liệu hệ thống về mặc định!' });
                      setTimeout(() => setFeedbackNotice(null), 3000);
                    }
                  }}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
                  title="Đặt lại toàn bộ cơ sở dữ liệu mẫu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu gốc</span>
                </button>

                <span className="text-slate-300">•</span>

                <button
                  onClick={handleLogout}
                  className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition"
                  title="Đăng xuất hoàn toàn khỏi phiên làm việc"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Đóng
              </button>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* LOGGED OUT VIEW: ROLE-AWARE LOGIN SYSTEM (3 SEPARATE ROLES)*/
          /* ======================================================== */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Role Tab Selector in Login Mode */}
            <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Chọn vai trò đăng nhập:</span>
              
              <div className="flex items-center gap-1.5 flex-1">
                <button
                  onClick={() => {
                    setLoginRoleTab('student');
                    setCurrentRoleMode('student');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginRoleTab === 'student' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Học Viên</span>
                </button>

                <button
                  onClick={() => {
                    setLoginRoleTab('coach');
                    setCurrentRoleMode('coach');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginRoleTab === 'coach' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Huấn Luyện Viên</span>
                </button>

                <button
                  onClick={() => {
                    setLoginRoleTab('admin');
                    setCurrentRoleMode('admin');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginRoleTab === 'admin' 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Quản Trị Viên</span>
                </button>
              </div>
            </div>

            {/* Login Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              
              {/* Role Context Heading */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900">
                    {loginRoleTab === 'student' && 'Cổng Đăng Nhập Học Viên'}
                    {loginRoleTab === 'coach' && 'Cổng Đăng Nhập Huấn Luyện Viên'}
                    {loginRoleTab === 'admin' && 'Cổng Đăng Nhập Quản Trị Hệ Thống'}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {loginRoleTab === 'student' && 'Chọn tài khoản học viên để truy cập lịch học, DUPR và đăng ký lớp'}
                    {loginRoleTab === 'coach' && 'Chọn hồ sơ Huấn luyện viên để quản lý lịch dạy, học viên và hiệu suất'}
                    {loginRoleTab === 'admin' && 'Truy cập trung tâm điều hành toàn diện hệ thống'}
                  </p>
                </div>
              </div>

              {/* Search Bar for Candidates */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, khu vực..."
                  value={loginSearchQuery}
                  onChange={(e) => setLoginSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-emerald-600 font-medium"
                />
              </div>

              {/* Candidate Accounts List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {loginCandidates.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleLoginUser(u)}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-xs transition flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={u.avatar_url} 
                        alt={u.full_name} 
                        className="w-11 h-11 rounded-2xl object-cover object-top ring-1 ring-slate-200 shrink-0 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{u.full_name}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-md uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'coach' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role === 'student' ? 'Học Viên' : u.role === 'coach' ? 'HLV' : 'Admin'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                          <span>{u.email}</span>
                          {u.location && <span>• {u.location}</span>}
                          {u.dupr_rating && <span className="font-bold text-emerald-700">DUPR {u.dupr_rating}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shrink-0 flex items-center gap-1 shadow-2xs"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Đăng nhập</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Register link */}
              <div className="pt-2 text-center text-xs text-slate-500">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    // Create quick account modal or tab
                    const newU = addNewUser({
                      full_name: 'Học Viên Mới ' + Math.floor(Math.random() * 100),
                      email: `hocvien.${Date.now()}@gmail.com`,
                      phone: '0909888999',
                      role: loginRoleTab,
                      location: 'TP. Hồ Chí Minh',
                      dupr_rating: 3.0,
                      avatar_url: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]
                    });
                    handleLoginUser(newU);
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Tạo nhanh tài khoản {loginRoleTab === 'student' ? 'Học viên' : loginRoleTab === 'coach' ? 'HLV' : 'Admin'} mới
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
              <button
                onClick={() => {
                  resetDatabase();
                  setFeedbackNotice({ type: 'info', message: 'Đã khôi phục dữ liệu hệ thống về mặc định!' });
                  setTimeout(() => setFeedbackNotice(null), 3000);
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục dữ liệu gốc</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
