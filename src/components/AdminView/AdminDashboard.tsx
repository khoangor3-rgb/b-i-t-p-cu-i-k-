import React, { useState } from 'react';
import { 
  Users, Award, CheckCircle2, XCircle, ShieldAlert, 
  Sparkles, Star, Eye, EyeOff, Lock, Unlock, AlertTriangle, 
  ExternalLink, Search, Filter, Check, TrendingUp, GraduationCap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile, User, Review } from '../../types';
import { ClassManagementView } from '../ClassManagementView';

interface AdminDashboardProps {
  initialTab?: 'dashboard' | 'verify' | 'users' | 'classes';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const { 
    users, coaches, bookings, reviews, classes,
    verifyCoachProfile, toggleUserStatus, toggleFeaturedCoach, toggleHideReview 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'verify' | 'users' | 'reviews' | 'classes'>(
    initialTab === 'verify' ? 'verify' : initialTab === 'users' ? 'users' : initialTab === 'classes' ? 'classes' : 'dashboard'
  );

  // Verification modal state
  const [rejectCoachId, setRejectCoachId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Chứng chỉ tải lên không rõ ràng hoặc chưa đạt chuẩn hiệp hội.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Stats calculation
  const totalCoaches = coaches.length;
  const verifiedCoaches = coaches.filter(c => c.verification_status === 'verified').length;
  const pendingCoaches = coaches.filter(c => c.verification_status === 'pending');
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const platformRevenue = completedBookings * 450000;

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const handleApproveCoach = (coachId: string) => {
    verifyCoachProfile(coachId, true);
    showNotification('Đã phê duyệt hồ sơ HLV và cấp huy hiệu Xác Thực (Tick Xanh) thành công!');
  };

  const handleRejectCoach = () => {
    if (!rejectCoachId) return;
    verifyCoachProfile(rejectCoachId, false, rejectReason);
    setRejectCoachId(null);
    showNotification('Đã gửi thông báo từ chối hồ sơ kèm lý do cho HLV.');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bảng Điều Khiển Quản Trị Hệ Thống</h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Kiểm duyệt hồ sơ HLV, quản trị người dùng và giám sát chất lượng theo chuẩn đề án CNTT.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto max-w-full">
          {[
            { id: 'dashboard', label: 'Tổng Quan KPI' },
            { id: 'classes', label: 'Phân Bổ Lớp Học' },
            { id: 'verify', label: 'Kiểm Duyệt HLV' },
            { id: 'users', label: 'Quản Trị Thành Viên' },
            { id: 'reviews', label: 'Kiểm Duyệt Đánh Giá' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900 shadow-xs border border-gray-200/70 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* TAB: Lớp Học & 50 Học Viên */}
      {activeTab === 'classes' && (
        <ClassManagementView userRoleContext="admin" />
      )}

      {/* TAB 1: KPI Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-bold uppercase text-gray-500">Tổng Huấn Luyện Viên</span>
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {totalCoaches} <span className="text-xs text-emerald-600 font-semibold">• {verifiedCoaches} đã xác thực</span>
              </div>
              <div className="text-[11px] text-amber-600 font-bold mt-1">
                {pendingCoaches.length} hồ sơ đang chờ kiểm duyệt
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-bold uppercase text-gray-500">Tổng Học Viên</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {totalStudents}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                Tỷ lệ hoạt động 100%
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-bold uppercase text-gray-500">Lượt Đặt Buổi Học</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {totalBookings}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {completedBookings} buổi hoàn thành tốt đẹp
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-xs font-bold uppercase text-gray-500">Doanh Số Nền Tảng (GMV)</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-900">
                {platformRevenue > 0 ? platformRevenue.toLocaleString('vi-VN') : '4.500.000'}đ
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Tổng giá trị khớp lệnh thành công
              </div>
            </div>

          </div>

          {/* Pending Coach Quick Queue */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-gray-900">
                  Hồ Sơ HLV Chờ Phê Duyệt Cấp Tick Xanh
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('verify')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            {pendingCoaches.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                Hiện không có hồ sơ nào đang chờ duyệt. Tất cả HLV đã được xác thực!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCoaches.map(coach => {
                  const coachUser = users.find(u => u.id === coach.user_id);
                  return (
                    <div key={coach.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="flex items-start gap-3">
                        <img 
                          src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} 
                          alt="" 
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-300 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>{coachUser?.full_name}</span>
                            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">Chờ thẩm định</span>
                          </div>
                          <div className="text-gray-600">
                            Khu vực: {coach.area} • Kinh nghiệm: {coach.experience_years} năm • Học phí: {coach.price_per_session.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="text-gray-500 italic line-clamp-1">"{coach.bio}"</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setRejectCoachId(coach.id)}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-700 font-semibold rounded-xl border border-red-200 transition cursor-pointer"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleApproveCoach(coach.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Duyệt & Cấp Tick Xanh</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Class Allocation Management */}
      {activeTab === 'classes' && (
        <ClassManagementView userRoleContext="admin" />
      )}

      {/* TAB 2: Verification Management */}
      {activeTab === 'verify' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Danh Sách Toàn Bộ Huấn Luyện Viên & Bằng Cấp Thẩm Định</h2>
            <p className="text-xs text-gray-500">Xem xét ảnh chứng chỉ IPTPA / PPR / VPA và xét duyệt minh bạch</p>
          </div>

          <div className="space-y-4">
            {coaches.map(coach => {
              const coachUser = users.find(u => u.id === coach.user_id);
              return (
                <div key={coach.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={coachUser?.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-100" />
                      <div>
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                          <span>{coachUser?.full_name}</span>
                          {coach.verification_status === 'verified' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Đã Xác Thực
                            </span>
                          )}
                          {coach.verification_status === 'pending' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Chờ Thẩm Định
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-[11px]">
                          {coachUser?.email} • {coach.area} • DUPR {coach.dupr_level.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeaturedCoach(coach.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 border ${
                          coach.is_featured 
                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{coach.is_featured ? 'Đã ghim nổi bật' : 'Ghim nổi bật'}</span>
                      </button>

                      {coach.verification_status !== 'verified' && (
                        <button
                          onClick={() => handleApproveCoach(coach.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                        >
                          Phê duyệt hồ sơ
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Certifications preview */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-800 mb-1">Bằng cấp & Minh chứng đính kèm:</div>
                    <div className="space-y-1.5">
                      {coach.certifications?.map(cert => (
                        <div key={cert.id} className="flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                          <span className="font-medium">{cert.title} ({cert.issuer} - {cert.year})</span>
                          <a 
                            href={cert.proof_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>Xem ảnh gốc</span>
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
        </div>
      )}

      {/* TAB 3: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Quản Lý Toàn Bộ Người Dùng</h2>
              <p className="text-xs text-gray-500">Khóa hoặc mở tài khoản khi có dấu hiệu vi phạm điều khoản</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Tìm theo tên/email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-transparent outline-none text-gray-800"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs outline-none font-medium cursor-pointer"
              >
                <option value="all">Tất cả role</option>
                <option value="student">Học viên</option>
                <option value="coach">Huấn luyện viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3">Người dùng</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">SĐT & Khu vực</th>
                  <th className="p-3">Ngày tạo</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200" />
                      <div>
                        <div className="font-bold text-gray-900">{u.full_name}</div>
                        <div className="text-[11px] text-gray-400">{u.email}</div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'coach' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      <div>{u.phone}</div>
                      <div className="text-[10px] text-gray-400">{u.location || 'Chưa cập nhật'}</div>
                    </td>

                    <td className="p-3 text-gray-500">{u.created_at}</td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            toggleUserStatus(u.id);
                            showNotification(`Đã ${u.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản ${u.full_name}!`);
                          }}
                          className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer inline-flex items-center gap-1 ${
                            u.status === 'active'
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
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

      {/* TAB 4: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Kiểm Duyệt Toàn Bộ Đánh Giá Trên Hệ Thống</h2>
            <p className="text-xs text-gray-500">
              Nguyên tắc minh bạch: Có thể ẩn review vi phạm nhưng <strong>KHÔNG ĐƯỢC XÓA</strong> đánh giá tiêu cực hợp lệ để bảo vệ tính khách quan.
            </p>
          </div>

          <div className="space-y-3">
            {reviews.map(rev => {
              const coach = coaches.find(c => c.id === rev.coach_id);
              const coachUser = users.find(u => u.id === coach?.user_id);

              return (
                <div 
                  key={rev.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                    rev.is_hidden 
                      ? 'bg-red-50/50 border-red-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <span>Học viên: {rev.student_name}</span>
                        <span>➔</span>
                        <span className="text-emerald-700">HLV: {coachUser?.full_name}</span>
                      </div>
                      <div className="text-[11px] text-gray-400">{rev.created_at}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          toggleHideReview(rev.id);
                          showNotification(rev.is_hidden ? 'Đã bỏ ẩn đánh giá' : 'Đã ẩn đánh giá khỏi giao diện công khai do vi phạm quy chuẩn.');
                        }}
                        className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 border ${
                          rev.is_hidden
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {rev.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{rev.is_hidden ? 'Hiển thị lại' : 'Ẩn review vi phạm'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {rev.is_hidden && (
                    <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Đánh giá này đang bị ẩn công khai (Lý do: {rev.hide_reason || 'Vi phạm chính sách'}).</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejection Modal for Coach Approval */}
      {rejectCoachId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Lý do từ chối phê duyệt hồ sơ HLV</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setRejectCoachId(null)} className="px-3 py-1.5 text-gray-600 font-semibold">
                Hủy
              </button>
              <button onClick={handleRejectCoach} className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-xl">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
