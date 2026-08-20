import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Mail, Lock, User, Phone, MapPin, Award, 
  DollarSign, CheckCircle, AlertTriangle, KeyRound, 
  ArrowRight, ShieldCheck, Sparkles, LogIn, UserPlus 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { loginUser, registerUser, requestPasswordReset, resetPasswordWithToken, users, login } = useApp();
  
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  
  // Register form state
  const [regRole, setRegRole] = useState<'student' | 'coach'>('student');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regArea, setRegArea] = useState('Quận 7, TP.HCM');
  const [regExp, setRegExp] = useState<number>(3);
  const [regPrice, setRegPrice] = useState<number>(350000);
  const [regBio, setRegBio] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [demoTokenHint, setDemoTokenHint] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!loginEmail || !loginPassword) {
      setLoginError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    const res = loginUser(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  const handleQuickLogin = (email: string) => {
    const target = (email || '').trim().toLowerCase();
    const matched = users.find(u => (u.email || '').toLowerCase() === target);
    if (matched) {
      login(matched.id);
      setLoginSuccess(`Đăng nhập nhanh thành công với quyền ${matched.role.toUpperCase()}!`);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
      return;
    }

    const res = registerUser({
      full_name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      role: regRole,
      area: regArea,
      experience_years: regExp,
      price_per_session: regPrice,
      bio: regBio
    });

    if (!res.success) {
      setRegError(res.message);
    } else {
      setRegSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail) {
      setForgotError('Vui lòng nhập địa chỉ email tài khoản!');
      return;
    }

    const res = requestPasswordReset(forgotEmail);
    if (!res.success) {
      setForgotError(res.message);
    } else {
      setForgotSuccess(res.message);
      setDemoTokenHint(res.resetToken || null);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setForgotStep(2);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!resetToken || !newPassword || !confirmNewPassword) {
      setForgotError('Vui lòng nhập đầy đủ mã xác thực và mật khẩu mới!');
      return;
    }

    const res = resetPasswordWithToken(forgotEmail, resetToken, newPassword, confirmNewPassword);
    if (!res.success) {
      setForgotError(res.message);
    } else {
      setForgotSuccess(res.message);
      setTimeout(() => {
        setTab('login');
        setLoginEmail(forgotEmail);
        setForgotStep(1);
      }, 1200);
    }
  };

  return (
    <div id="auth_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="auth_modal_content"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              {tab === 'login' && <LogIn className="w-5 h-5 text-white" />}
              {tab === 'register' && <UserPlus className="w-5 h-5 text-white" />}
              {tab === 'forgot' && <KeyRound className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {tab === 'login' && 'Đăng Nhập PickleConnect'}
                {tab === 'register' && 'Đăng Ký Thành Viên'}
                {tab === 'forgot' && 'Khôi Phục Mật Khẩu'}
              </h2>
              <p className="text-xs text-emerald-100/90">
                {tab === 'login' && 'Truy cập hệ thống huấn luyện viên & học viên'}
                {tab === 'register' && 'Bảo vệ học phí Escrow & huấn luyện chuẩn DUPR'}
                {tab === 'forgot' && 'Xác thực OTP 6 số an toàn trong 15 phút'}
              </p>
            </div>
          </div>
          <button 
            id="btn_close_auth_modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 text-sm font-semibold">
          <button
            id="tab_auth_login"
            onClick={() => { setTab('login'); setLoginError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              tab === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            id="tab_auth_register"
            onClick={() => { setTab('register'); setRegError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              tab === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Đăng Ký Mới
          </button>
          <button
            id="tab_auth_forgot"
            onClick={() => { setTab('forgot'); setForgotError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              tab === 'forgot'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Quên Mật Khẩu
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>{loginError}</div>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <div>{loginSuccess}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email đăng nhập <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input_login_email"
                    type="email"
                    required
                    placeholder="vidu@pickleconnect.vn"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setForgotEmail(loginEmail); }}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input_login_password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Nhập sai quá 5 lần tài khoản sẽ tự động khóa 15 phút.
                </p>
              </div>

              <button
                id="btn_submit_login"
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
              >
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Switcher */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600 font-medium mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Đăng nhập nhanh tài khoản mẫu:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('minh.tri@example.com')}
                    className="p-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-center font-medium transition"
                  >
                    Học viên (Trí)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('nguyen.vannam@example.com')}
                    className="p-2 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-center font-medium transition border border-emerald-200"
                  >
                    HLV (Nam)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@pickleconnect.vn')}
                    className="p-2 text-xs bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-center font-medium transition"
                  >
                    Admin Quản Trị
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>{regError}</div>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <div>{regSuccess}</div>
                </div>
              )}

              {/* Role selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bạn muốn đăng ký với vai trò:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                      regRole === 'student'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <User className={`w-5 h-5 ${regRole === 'student' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Học Viên</div>
                      <div className="text-[10px] text-slate-500">Tìm HLV, bảo vệ Escrow</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('coach')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                      regRole === 'coach'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Award className={`w-5 h-5 ${regRole === 'coach' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Huấn Luyện Viên</div>
                      <div className="text-[10px] text-slate-500">Nhận lịch, duyệt bằng cấp</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0901234567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email đăng ký <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="email@vidu.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu (≥ 8 ký tự) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Tối thiểu 8 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Khu vực hoạt động / Thành phố
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="VD: Quận 7, TP.HCM hoặc Cầu Giấy, Hà Nội"
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Coach Specific fields */}
              {regRole === 'coach' && (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Thông Tin Huấn Luyện Viên</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Kinh nghiệm (năm)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={regExp}
                        onChange={(e) => setRegExp(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Học phí 1 buổi (VNĐ)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          step="50000"
                          value={regPrice}
                          onChange={(e) => setRegPrice(Number(e.target.value))}
                          className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Giới thiệu phong cách huấn luyện
                    </label>
                    <textarea
                      rows={2}
                      placeholder="VD: Chuyên đào tạo DUPR 3.0 lên 4.5, chỉnh bộ chân thực chiến..."
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <p className="text-[10px] text-emerald-700 leading-tight">
                    * Hồ sơ HLV sau khi đăng ký sẽ được gửi tới Ban Quản Trị để kiểm duyệt chứng chỉ & kích hoạt huy hiệu "Đã duyệt bằng cấp".
                  </p>
                </div>
              )}

              <button
                id="btn_submit_register"
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
              >
                <span>Đăng Ký Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              {forgotError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>{forgotError}</div>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <div>{forgotSuccess}</div>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestToken} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nhập email đã đăng ký của bạn. Hệ thống sẽ tạo mã xác thực 6 số có hiệu lực trong vòng 15 phút.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email tài khoản <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="minh.tri@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <span>Nhận Mã Xác Thực (OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {demoTokenHint && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                      <span className="font-bold">Mã xác thực OTP demo của bạn là:</span>{' '}
                      <span className="font-mono font-extrabold text-sm text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                        {demoTokenHint}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã xác thực 6 số <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center tracking-widest font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mật khẩu mới (≥ 8 ký tự) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Xác nhận lại <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Nhập lại mật khẩu"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                    >
                      Quay Lại
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
                    >
                      Đổi Mật Khẩu & Mở Khóa
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
