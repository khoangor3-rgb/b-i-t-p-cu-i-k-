import React, { useState } from 'react';
import { 
  Users, Award, CheckCircle2, XCircle, ShieldAlert, 
  Sparkles, Star, Eye, EyeOff, Lock, Unlock, AlertTriangle, 
  ExternalLink, Check, TrendingUp, DollarSign, ShieldCheck, 
  Clock, RotateCcw, FileText, ArrowRight, Shield, UserCheck, 
  UserX, History, Scale, Flag, BellRing, LayoutDashboard,
  Layers, ChevronRight, Filter, Search, UserMinus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile, User, Review, Payment, CoachApprovalStatus, AdminRoleName } from '../../types';
import { ClassManagementView } from '../ClassManagementView';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminRemindersTab } from './AdminRemindersTab';
import { AdminWaitlistTab } from './AdminWaitlistTab';
import { AdminStatusBadge, AdminFilterBar, AdminEmptyState } from './AdminSharedComponents';
import { AdminActionCenter } from './AdminActionCenter';
import { AdminDetailDrawer } from './AdminDetailDrawer';

interface AdminDashboardProps {
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const { 
    currentUser, users, coaches, bookings, reviews, classes, payments, adminLogs, reports, reminders,
    waitlistEntries, cancellationRules, verifyCoachProfile, updateCoachApproval, toggleUserStatus, 
    toggleFeaturedCoach, toggleHideReview, getPlatformStats, resolveDispute,
    logAdminAction, updateUserProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialTab || 'dashboard');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'payment' | 'coach' | 'dispute' | 'general'>('general');
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerSubtitle, setDrawerSubtitle] = useState('');
  const [drawerData, setDrawerData] = useState<any>(null);

  // Verification & status modal state
  const [rejectCoachId, setRejectCoachId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Chứng chỉ tải lên không rõ ràng hoặc chưa đạt chuẩn hiệp hội.');
  const [suspendCoachId, setSuspendCoachId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('Có dấu hiệu vi phạm quy tắc ứng xử hoặc nhận nhiều phản ánh tiêu cực.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Coach filter
  const [coachSearch, setCoachSearch] = useState('');
  const [coachStatusFilter, setCoachStatusFilter] = useState<string>('all');

  // Dispute resolution modal state
  const [resolvingPaymentId, setResolvingPaymentId] = useState<string | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'refund_student' | 'release_coach'>('refund_student');
  const [adminNotes, setAdminNotes] = useState('Đã xác minh theo chính sách bảo hành bài học Love Your Lesson.');

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Payment search/filter
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // Audit log filter
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('all');

  // Stats calculation
  const totalCoaches = coaches.length;
  const verifiedCoaches = coaches.filter(c => c.verification_status === 'verified' || c.approval_status === 'approved').length;
  const pendingCoaches = coaches.filter(c => c.approval_status === 'pending' || c.verification_status === 'pending');
  const suspendedCoaches = coaches.filter(c => c.approval_status === 'suspended');
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  
  const platformStats = getPlatformStats();
  const disputedPayments = payments.filter(p => p.status === 'disputed');
  const openReports = reports.filter(r => r.status === 'open');

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const handleApproveCoach = (coachId: string) => {
    updateCoachApproval(coachId, 'approved');
    verifyCoachProfile(coachId, true);
    setDrawerOpen(false);
    showNotification('Đã phê duyệt hồ sơ HLV và cấp huy hiệu Xác Thực (Tick Xanh) thành công!');
  };

  const handleRejectCoach = () => {
    if (!rejectCoachId) return;
    updateCoachApproval(rejectCoachId, 'rejected', rejectReason);
    setRejectCoachId(null);
    setDrawerOpen(false);
    showNotification('Đã gửi thông báo từ chối hồ sơ kèm lý do cho HLV.');
  };

  const handleSuspendCoach = () => {
    if (!suspendCoachId) return;
    updateCoachApproval(suspendCoachId, 'suspended', suspendReason);
    setSuspendCoachId(null);
    showNotification('Đã tạm đình chỉ HLV và khóa quyền nhận lịch học mới.');
  };

  const handleReactivateCoach = (coachId: string) => {
    updateCoachApproval(coachId, 'approved');
    showNotification('Đã kích hoạt lại tài khoản HLV thành công!');
  };

  const handleResolveDisputeSubmit = () => {
    if (!resolvingPaymentId) return;
    resolveDispute(resolvingPaymentId, resolutionAction, adminNotes);
    setResolvingPaymentId(null);
    setDrawerOpen(false);
    showNotification(
      resolutionAction === 'refund_student'
        ? 'Đã phân xử hoàn tiền 100% về cho Học viên!'
        : 'Đã phân xử giải ngân 90% cho HLV thành công!'
    );
  };

  const handleAdminSubRoleSwitch = (newSubRole: AdminRoleName) => {
    if (!currentUser) return;
    updateUserProfile(currentUser.id, { admin_role: newSubRole });
    logAdminAction('SWITCH_ADMIN_ROLE', 'system', currentUser.id, `Chuyển quyền quản trị sang: ${newSubRole}`);
    showNotification(`Đã chuyển đổi vai trò sang: ${newSubRole === 'super_admin' ? 'Super Admin' : newSubRole === 'support_admin' ? 'Support Admin' : 'Finance Admin'}`);
  };

  // Open Drawer Helpers
  const openPaymentDrawer = (payment: Payment) => {
    setDrawerType('payment');
    setDrawerTitle(`Giao Dịch Escrow #${payment.id}`);
    setDrawerSubtitle(`Học viên ${payment.student_name} • HLV ${payment.coach_name}`);
    setDrawerData(payment);
    setDrawerOpen(true);
  };

  const openCoachDrawer = (coach: CoachProfile) => {
    const u = users.find(user => user.id === coach.user_id);
    setDrawerType('coach');
    setDrawerTitle(`Hồ Sơ HLV: ${u?.full_name || 'Huấn luyện viên'}`);
    setDrawerSubtitle(`DUPR ${coach.dupr_level.toFixed(1)} • ${coach.area}`);
    setDrawerData(coach);
    setDrawerOpen(true);
  };

  const filteredUsers = users.filter(u => {
    const q = (userSearch || '').trim().toLowerCase();
    const matchesSearch = !q || (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredPayments = payments.filter(p => {
    const q = (paymentSearch || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (p.id || '').toLowerCase().includes(q) ||
      (p.student_name || '').toLowerCase().includes(q) ||
      (p.coach_name || '').toLowerCase().includes(q);
    const matchesStatus = paymentStatusFilter === 'all' || p.status === paymentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCoaches = coaches.filter(c => {
    const q = (coachSearch || '').trim().toLowerCase();
    const coachUser = users.find(u => u.id === c.user_id);
    const matchesSearch = !q || 
      (coachUser?.full_name || '').toLowerCase().includes(q) ||
      (coachUser?.email || '').toLowerCase().includes(q) ||
      (c.area || '').toLowerCase().includes(q);
    const status = c.approval_status || (c.verification_status === 'verified' ? 'approved' : 'pending');
    const matchesStatus = coachStatusFilter === 'all' || status === coachStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = adminLogs.filter(log => {
    const q = (logSearch || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (log.admin_name || '').toLowerCase().includes(q) ||
      (log.details || '').toLowerCase().includes(q) ||
      (log.target_id || '').toLowerCase().includes(q);
    const matchesAction = logActionFilter === 'all' || log.action === logActionFilter;
    return matchesSearch && matchesAction;
  });

  const currentAdminRole = (currentUser?.admin_role as AdminRoleName) || 'super_admin';

  // Grouped Navigation Structure (Mental Model)
  const navigationGroups = [
    {
      group: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Tổng Quan & Action Center', badge: pendingCoaches.length + disputedPayments.length + openReports.length }
      ]
    },
    {
      group: 'Operations',
      items: [
        { id: 'classes', label: 'Phân Bổ Lớp Học' },
        { id: 'waitlists', label: 'Hàng Chờ Waitlist', badge: waitlistEntries.filter(w => w.status === 'waiting' || w.status === 'offered').length },
        { id: 'reminders', label: 'Nhắc Lịch Cron', badge: reminders.length }
      ]
    },
    {
      group: 'Coaches & Users',
      items: [
        { id: 'verify', label: 'Duyệt & Quản Lý HLV', badge: pendingCoaches.length },
        { id: 'users', label: 'Quản Trị Thành Viên' }
      ]
    },
    {
      group: 'Finance',
      items: [
        { id: 'payments', label: 'Quỹ Escrow & Khiếu Nại', badge: disputedPayments.length }
      ]
    },
    {
      group: 'Moderation & Safety',
      items: [
        { id: 'reports', label: 'Báo Cáo Vi Phạm', badge: openReports.length },
        { id: 'reviews', label: 'Kiểm Duyệt Đánh Giá' }
      ]
    },
    {
      group: 'System',
      items: [
        { id: 'audit_logs', label: 'Nhật Ký Quản Trị' },
        { id: 'policies', label: 'Chính Sách & Hủy Lịch' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & BREADCRUMB / RBAC SWITCHER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bảng Điều Khiển Quản Trị Hệ Thống
            </h1>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300/60">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Portal</span>
            </span>
            
            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              currentAdminRole === 'super_admin' ? 'bg-amber-50 text-amber-900 border-amber-300' :
              currentAdminRole === 'support_admin' ? 'bg-blue-50 text-blue-900 border-blue-300' :
              'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}>
              {currentAdminRole === 'super_admin' ? '👑 Super Admin (Full)' :
               currentAdminRole === 'support_admin' ? '🛡️ Support Admin' :
               '💰 Finance Admin'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Trung tâm vận hành: Kiểm duyệt HLV, phân xử Escrow bảo vệ Love Your Lesson và giám sát hệ thống.
          </p>

          {/* RBAC Tester Switcher */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-500">Giả lập vai trò Admin:</span>
            <button
              onClick={() => handleAdminSubRoleSwitch('super_admin')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                currentAdminRole === 'super_admin' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleAdminSubRoleSwitch('support_admin')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                currentAdminRole === 'support_admin' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Support Admin
            </button>
            <button
              onClick={() => handleAdminSubRoleSwitch('finance_admin')}
              className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                currentAdminRole === 'finance_admin' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Finance Admin
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Control Center</span>
          </button>
        </div>
      </div>

      {/* 2. STRUCTURED INFORMATION ARCHITECTURE NAVIGATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navigationGroups.map((group, gIdx) => (
            <React.Fragment key={gIdx}>
              {gIdx > 0 && <div className="h-5 w-px bg-slate-200 mx-1.5 shrink-0" />}
              {group.items.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-white text-emerald-900' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ==================== TAB CONTENT ==================== */}

      {/* TAB: DASHBOARD / CONTROL CENTER (Overview + Action Center + Activity) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Section 1: KPI Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase text-slate-500">Tổng Huấn Luyện Viên</span>
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalCoaches}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <span>{verifiedCoaches} đã duyệt chính thức</span>
                {pendingCoaches.length > 0 && (
                  <span className="text-amber-600 font-bold">• {pendingCoaches.length} chờ duyệt</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase text-slate-500">Tổng Học Viên</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalStudents}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Tỷ lệ tương tác 100%
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase text-slate-500">Lượt Đặt Buổi Học</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalBookings}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {completedBookings} buổi đã hoàn thành
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase text-slate-500">Doanh Số Sàn (GMV)</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950">
                {platformStats.totalVolume > 0 ? platformStats.totalVolume.toLocaleString('vi-VN') : '7.440.000'} đ
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                Hoa hồng sàn 10%: {platformStats.platformCommission.toLocaleString('vi-VN')} đ
              </div>
            </div>

          </div>

          {/* Section 2 & 3: Action Center & Activity Feed */}
          <AdminActionCenter
            pendingCoaches={pendingCoaches}
            disputedPayments={disputedPayments}
            openReports={openReports}
            users={users}
            recentLogs={adminLogs}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            onQuickApproveCoach={handleApproveCoach}
            onInspectCoach={openCoachDrawer}
            onInspectPayment={openPaymentDrawer}
          />
        </div>
      )}

      {/* TAB: Hàng Chờ Waitlist */}
      {activeTab === 'waitlists' && <AdminWaitlistTab />}

      {/* TAB: Báo Cáo Vi Phạm */}
      {activeTab === 'reports' && <AdminReportsTab onSuspendCoach={(coachId) => setSuspendCoachId(coachId)} />}

      {/* TAB: Lịch Nhắc Tự Động */}
      {activeTab === 'reminders' && <AdminRemindersTab />}

      {/* TAB: Phân Bổ Lớp Học */}
      {activeTab === 'classes' && <ClassManagementView userRoleContext="admin" />}

      {/* TAB: Duyệt & Quản Lý HLV */}
      {activeTab === 'verify' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Danh Sách Huấn Luyện Viên & Trạng Thái Hoạt Động</h2>
            <p className="text-xs text-slate-500">Thẩm định chứng chỉ, phê duyệt hồ sơ hoặc quản lý trạng thái HLV</p>
          </div>

          {/* Reusable Filter Bar */}
          <AdminFilterBar
            searchValue={coachSearch}
            onSearchChange={setCoachSearch}
            searchPlaceholder="Tìm HLV theo tên, email, khu vực..."
            statusFilter={coachStatusFilter}
            onStatusChange={setCoachStatusFilter}
            statusOptions={[
              { id: 'all', label: 'Tất cả trạng thái', count: coaches.length },
              { id: 'pending', label: 'Chờ duyệt', count: pendingCoaches.length },
              { id: 'approved', label: 'Đã duyệt', count: verifiedCoaches },
              { id: 'suspended', label: 'Đình chỉ', count: suspendedCoaches.length },
              { id: 'rejected', label: 'Đã từ chối' },
            ]}
            activeFilterCount={(coachSearch ? 1 : 0) + (coachStatusFilter !== 'all' ? 1 : 0)}
            onClearFilters={() => { setCoachSearch(''); setCoachStatusFilter('all'); }}
            totalResultsText={`Hiển thị ${filteredCoaches.length} trên tổng số ${coaches.length} HLV`}
          />

          {filteredCoaches.length === 0 ? (
            <AdminEmptyState
              title="Không tìm thấy huấn luyện viên"
              description="Không có huấn luyện viên nào khớp với tiêu chí tìm kiếm hiện tại."
              actionText="Xóa bộ lọc"
              onAction={() => { setCoachSearch(''); setCoachStatusFilter('all'); }}
            />
          ) : (
            <div className="space-y-3">
              {filteredCoaches.map(coach => {
                const coachUser = users.find(u => u.id === coach.user_id);
                const approvalStatus = coach.approval_status || (coach.verification_status === 'verified' ? 'approved' : 'pending');

                return (
                  <div key={coach.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={coachUser?.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover object-top ring-2 ring-slate-200" />
                        <div>
                          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>{coachUser?.full_name}</span>
                            <AdminStatusBadge status={approvalStatus} />
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {coachUser?.email} • {coach.area} • DUPR {coach.dupr_level.toFixed(1)} • {coach.total_sessions_taught || 0} buổi đã dạy
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => openCoachDrawer(coach)}
                          className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
                        >
                          Xem chi tiết
                        </button>

                        <button
                          onClick={() => toggleFeaturedCoach(coach.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 border ${
                            coach.is_featured 
                              ? 'bg-amber-100 text-amber-900 border-amber-300' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{coach.is_featured ? 'Nổi bật' : 'Ghim nổi bật'}</span>
                        </button>

                        {approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => setRejectCoachId(coach.id)}
                              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-semibold rounded-xl border border-rose-200 transition cursor-pointer"
                            >
                              Từ chối
                            </button>
                            <button
                              onClick={() => handleApproveCoach(coach.id)}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                            >
                              Duyệt & Cấp Tick
                            </button>
                          </>
                        )}

                        {approvalStatus === 'approved' && (
                          <button
                            onClick={() => setSuspendCoachId(coach.id)}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition cursor-pointer flex items-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Tạm đình chỉ</span>
                          </button>
                        )}

                        {(approvalStatus === 'suspended' || approvalStatus === 'rejected') && (
                          <button
                            onClick={() => handleReactivateCoach(coach.id)}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Kích hoạt lại</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Certifications preview */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1">Bằng cấp & Chứng chỉ:</div>
                      <div className="space-y-1">
                        {coach.certifications?.map(cert => (
                          <div key={cert.id} className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                            <span className="font-medium">{cert.title} ({cert.issuer} - {cert.year})</span>
                            <a href={cert.proof_url} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                              <span>Xem ảnh bằng chứng</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Quản Trị Thành Viên */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Quản Lý Toàn Bộ Người Dùng ({users.length})</h2>
            <p className="text-xs text-slate-500">Kiểm soát tài khoản, phân quyền RBAC và xử lý vi phạm</p>
          </div>

          <AdminFilterBar
            searchValue={userSearch}
            onSearchChange={setUserSearch}
            searchPlaceholder="Tìm theo họ tên, email..."
            secondaryFilter={userRoleFilter}
            onSecondaryChange={setUserRoleFilter}
            secondaryPlaceholder="Tất cả vai trò"
            secondaryOptions={[
              { id: 'student', label: 'Học viên' },
              { id: 'coach', label: 'Huấn luyện viên' },
              { id: 'admin', label: 'Quản trị viên' },
            ]}
            activeFilterCount={(userSearch ? 1 : 0) + (userRoleFilter !== 'all' ? 1 : 0)}
            onClearFilters={() => { setUserSearch(''); setUserRoleFilter('all'); }}
            totalResultsText={`Hiển thị ${filteredUsers.length} tài khoản`}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Người dùng</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">SĐT & Khu vực</th>
                  <th className="p-3">Ngày tạo</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover object-top ring-1 ring-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900">{u.full_name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'coach' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role} {u.admin_role ? `(${u.admin_role})` : ''}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{u.phone}</div>
                      <div className="text-[10px] text-slate-400">{u.location || 'Chưa cập nhật'}</div>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{u.created_at}</td>
                    <td className="p-3">
                      <AdminStatusBadge status={u.status === 'active' ? 'active' : 'suspended'} label={u.status === 'active' ? 'Hoạt động' : 'Đã khóa'} />
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            toggleUserStatus(u.id);
                            showNotification(`Đã ${u.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản ${u.full_name}!`);
                          }}
                          className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer inline-flex items-center gap-1 ${
                            u.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'active' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{u.status === 'active' ? 'Khóa TK' : 'Mở khóa'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Quỹ Escrow & Khiếu Nại */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Escrow Financial KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Tổng Dòng Tiền (GMV)</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {platformStats.totalVolume.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{payments.length} giao dịch</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Hoa Hồng Sàn (10%)</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                {platformStats.platformCommission.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Doanh thu thực sàn</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Đang Giữ Escrow</span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
                {platformStats.escrowHeld.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Chờ hoàn thành buổi học</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Đã Giải Ngân HLV</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {platformStats.totalPayouts.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">90% học phí buổi học</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Đã Hoàn Học Viên</span>
              <div className="text-xl sm:text-2xl font-black text-purple-900 mt-1">
                {platformStats.totalRefunded.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Love Your Lesson</div>
            </div>
          </div>

          {/* Sổ cái giao dịch Escrow Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Sổ Cái Giao Dịch Escrow & Đối Soát</h2>
                <p className="text-xs text-slate-500">Giám sát trạng thái dòng tiền ký quỹ và đối soát giải ngân</p>
              </div>
            </div>

            <AdminFilterBar
              searchValue={paymentSearch}
              onSearchChange={setPaymentSearch}
              searchPlaceholder="Tìm mã GD, học viên, HLV..."
              statusFilter={paymentStatusFilter}
              onStatusChange={setPaymentStatusFilter}
              statusOptions={[
                { id: 'all', label: 'Tất cả trạng thái', count: payments.length },
                { id: 'held', label: 'Tạm giữ Escrow', count: payments.filter(p => p.status === 'held').length },
                { id: 'released', label: 'Đã giải ngân', count: payments.filter(p => p.status === 'released').length },
                { id: 'refunded', label: 'Đã hoàn tiền', count: payments.filter(p => p.status === 'refunded').length },
                { id: 'disputed', label: 'Đang khiếu nại', count: disputedPayments.length },
              ]}
              activeFilterCount={(paymentSearch ? 1 : 0) + (paymentStatusFilter !== 'all' ? 1 : 0)}
              onClearFilters={() => { setPaymentSearch(''); setPaymentStatusFilter('all'); }}
              totalResultsText={`Hiển thị ${filteredPayments.length} giao dịch`}
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Mã GD</th>
                    <th className="p-3">Học viên</th>
                    <th className="p-3">Huấn luyện viên</th>
                    <th className="p-3">Tổng tiền</th>
                    <th className="p-3">Phí sàn (10%)</th>
                    <th className="p-3">HLV nhận (90%)</th>
                    <th className="p-3">Trạng thái Escrow</th>
                    <th className="p-3">Thời gian</th>
                    <th className="p-3 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => openPaymentDrawer(p)}>
                      <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="p-3 font-bold text-slate-900">{p.student_name}</td>
                      <td className="p-3 text-slate-700">{p.coach_name}</td>
                      <td className="p-3 font-bold text-slate-900">{p.amount.toLocaleString('vi-VN')} đ</td>
                      <td className="p-3 text-emerald-700 font-semibold">+{p.commission_amount.toLocaleString('vi-VN')} đ</td>
                      <td className="p-3 text-slate-800">{p.payout_amount.toLocaleString('vi-VN')} đ</td>
                      <td className="p-3">
                        <AdminStatusBadge status={p.status} />
                      </td>
                      <td className="p-3 text-slate-400 font-mono">{p.paid_at}</td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer">
                          Đối soát
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Kiểm Duyệt Đánh Giá */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Kiểm Duyệt Toàn Bộ Đánh Giá Trên Hệ Thống</h2>
            <p className="text-xs text-slate-500">
              Nguyên tắc minh bạch: Ẩn review vi phạm quy tắc nhưng <strong>KHÔNG ĐƯỢC XÓA</strong> phản ánh tiêu cực hợp lệ.
            </p>
          </div>

          <div className="space-y-3">
            {reviews.map(rev => {
              const coach = coaches.find(c => c.id === rev.coach_id);
              const coachUser = users.find(u => u.id === coach?.user_id);

              return (
                <div key={rev.id} className={`p-4 rounded-2xl border text-xs space-y-2 transition ${rev.is_hidden ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>Học viên: {rev.student_name}</span>
                        <span>➔</span>
                        <span className="text-emerald-700">HLV: {coachUser?.full_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{rev.created_at}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          toggleHideReview(rev.id);
                          showNotification(rev.is_hidden ? 'Đã bỏ ẩn đánh giá' : 'Đã ẩn đánh giá khỏi giao diện công khai.');
                        }}
                        className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 border ${
                          rev.is_hidden ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {rev.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{rev.is_hidden ? 'Hiển thị lại' : 'Ẩn review'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Nhật Ký Thao Tác Quản Trị Hệ Thống (Audit Trail)</h2>
            <p className="text-xs text-slate-500">Lưu vết toàn bộ hành vi duyệt HLV, xử lý Escrow, đổi quyền và chính sách</p>
          </div>

          <AdminFilterBar
            searchValue={logSearch}
            onSearchChange={setLogSearch}
            searchPlaceholder="Tìm theo quản trị viên, chi tiết..."
            secondaryFilter={logActionFilter}
            onSecondaryChange={setLogActionFilter}
            secondaryPlaceholder="Tất cả hành động"
            secondaryOptions={[
              { id: 'APPROVE_COACH', label: 'Duyệt HLV' },
              { id: 'SUSPEND_COACH', label: 'Đình chỉ HLV' },
              { id: 'RESOLVE_DISPUTE', label: 'Phân xử Escrow' },
              { id: 'REPORT_NO_SHOW', label: 'Báo cáo No-show' },
              { id: 'HIDE_REVIEW', label: 'Ẩn review' },
            ]}
            activeFilterCount={(logSearch ? 1 : 0) + (logActionFilter !== 'all' ? 1 : 0)}
            onClearFilters={() => { setLogSearch(''); setLogActionFilter('all'); }}
            totalResultsText={`Ghi nhận ${filteredLogs.length} sự kiện hệ thống`}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Quản trị viên</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">Hành động</th>
                  <th className="p-3">Đối tượng</th>
                  <th className="p-3">Chi tiết nghiệp vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.admin_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.role_name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      <span className="capitalize">{log.target_type}</span>: <strong className="font-mono text-slate-900">{log.target_id}</strong>
                    </td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Policies & Rules */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Quy Định Huỷ Lịch, Hoàn Tiền & Bảo Vệ Escrow</h2>
              <p className="text-xs text-slate-500">Chính sách vận hành tự động cho Học viên và Huấn luyện viên</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cancellationRules.map(rule => (
              <div key={rule.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{rule.title}</span>
                  <span className="font-mono font-bold text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {rule.trigger_condition}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rule.description}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200 font-semibold">
                  <span className="text-purple-900">Học viên nhận hoàn: <strong>{rule.student_refund_percent}%</strong></span>
                  <span className="text-emerald-700">HLV nhận: <strong>{rule.coach_payout_percent}%</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-2 text-purple-950">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <span>Chính Sách Cam Kết "Love Your Lesson Guarantee" (Bảo Hành 100%)</span>
            </div>
            <p className="leading-relaxed">
              Nếu học viên không hài lòng sau buổi học đầu tiên hoặc HLV vắng mặt không lý do (No-show), 
              học viên được quyền khiếu nại trong vòng 24 giờ để nhận lại <strong>100% học phí</strong> hoặc được hỗ trợ chuyển sang Huấn luyện viên khác hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER */}
      <AdminDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle}
        subtitle={drawerSubtitle}
        type={drawerType}
        data={drawerData}
        users={users}
        onApproveCoach={handleApproveCoach}
        onRejectCoach={(coachId) => { setRejectCoachId(coachId); setDrawerOpen(false); }}
        onResolveDispute={(paymentId, action) => {
          setResolvingPaymentId(paymentId);
          setResolutionAction(action);
          setAdminNotes(action === 'refund_student' ? 'Hoàn tiền 100% cho Học viên theo Love Your Lesson.' : 'Giải ngân 90% cho HLV.');
          handleResolveDisputeSubmit();
        }}
      />

      {/* Rejection Modal */}
      {rejectCoachId && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Lý do từ chối phê duyệt hồ sơ HLV</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setRejectCoachId(null)} className="px-3 py-1.5 text-slate-600 font-semibold cursor-pointer">
                Hủy
              </button>
              <button onClick={handleRejectCoach} className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspension Modal */}
      {suspendCoachId && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <UserX className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Tạm đình chỉ tài khoản Huấn Luyện Viên</h3>
            </div>
            <p className="text-xs text-slate-500">
              HLV bị đình chỉ sẽ không xuất hiện trên danh sách tìm kiếm và không thể nhận thêm lịch học mới.
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setSuspendCoachId(null)} className="px-3 py-1.5 text-slate-600 font-semibold cursor-pointer">
                Hủy
              </button>
              <button onClick={handleSuspendCoach} className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer">
                Xác nhận đình chỉ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
