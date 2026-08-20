import React, { useState } from 'react';
import { 
  Flag, AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert, 
  Search, Filter, User, UserX, MessageSquare, Shield, Info, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserReport, ReportStatus, ReportReasonCategory } from '../../types';

interface AdminReportsTabProps {
  onSuspendCoach?: (coachId: string) => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ onSuspendCoach }) => {
  const { 
    currentUser, 
    reports, 
    coaches, 
    updateReportStatus, 
    updateCoachApproval,
    hasAdminPermission 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // RBAC permission check (TC4: Only support_admin and super_admin can handle reports)
  const isFinanceAdmin = currentUser?.role === 'admin' && currentUser.admin_role === 'finance_admin';
  const canHandleReports = !isFinanceAdmin;

  const filteredReports = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.reason_category === categoryFilter;
    if (!searchQuery) return matchesStatus && matchesCategory;
    const q = (searchQuery || '').trim().toLowerCase();
    const reportedUserName = (r.reported_user_name || '').toLowerCase();
    const reporterName = (r.reporter_name || '').toLowerCase();
    const description = (r.description || '').toLowerCase();
    const id = (r.id || '').toLowerCase();
    const matchesSearch = 
      reportedUserName.includes(q) ||
      reporterName.includes(q) ||
      description.includes(q) ||
      id.includes(q);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: ReportReasonCategory) => {
    switch (category) {
      case 'inappropriate_behavior':
        return { label: 'Thái độ / Hành vi không chuẩn', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'fake_profile':
        return { label: 'Hồ sơ / Chứng chỉ giả mạo', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'harassment':
        return { label: 'Quấy rối / Xúc phạm', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'other':
      default:
        return { label: 'Vi phạm quy chế khác', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            Mới tiếp nhận (Open)
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Shield className="w-3 h-3 text-blue-600" />
            Đang xác minh (Reviewing)
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Đã xử lý (Resolved)
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-slate-500" />
            Bác bỏ / Không vi phạm
          </span>
        );
    }
  };

  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus) => {
    setActionError(null);
    setActionSuccess(null);

    // RBAC validation
    if (isFinanceAdmin) {
      setActionError('Lỗi phân quyền (403 Forbidden): Finance Admin chỉ phụ trách tài chính/ký quỹ, không có quyền xử lý Báo cáo vi phạm hành vi!');
      return;
    }

    const res = updateReportStatus(reportId, newStatus, resolutionNote || undefined);
    if (!res.success) {
      setActionError(res.message);
    } else {
      setActionSuccess(res.message);
      setSelectedReport(null);
      setResolutionNote('');
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleSuspendDirectly = (reportedUserId: string) => {
    const coach = coaches.find(c => c.user_id === reportedUserId || c.id === reportedUserId);
    if (coach) {
      updateCoachApproval(coach.id, 'suspended', 'Tạm đình chỉ do nhận nhiều báo cáo vi phạm hành vi nghiêm trọng từ học viên.');
      setActionSuccess(`Đã tạm đình chỉ HLV ${coach.user?.full_name || coach.id} thành công.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Quản Lý Báo Cáo Vi Phạm & Hành Vi (Quick Reports)</h2>
              <p className="text-xs text-slate-500">Tiếp nhận và xử lý khiếu nại thái độ, quấy rối, thông tin sai lệch từ cộng đồng</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
            Tổng {reports.length} báo cáo ({reports.filter(r => r.status === 'open').length} chưa xử lý)
          </span>
        </div>
      </div>

      {/* RBAC Warning for Finance Admin */}
      {isFinanceAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Lưu ý quyền hạn RBAC (Finance Admin):</strong> Bạn đang xem ở chế độ Chỉ Đọc (Read-Only). Quyền xử lý và cập nhật Báo cáo hành vi chỉ dành cho <strong>Support Admin</strong> và <strong>Super Admin</strong>.
          </div>
        </div>
      )}

      {/* Action Success / Error Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'open', label: 'Mới (Open)' },
              { id: 'reviewing', label: 'Đang xác minh' },
              { id: 'resolved', label: 'Đã giải quyết' },
              { id: 'dismissed', label: 'Bác bỏ' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 outline-none"
          >
            <option value="all">Mọi loại vi phạm</option>
            <option value="inappropriate_behavior">Thái độ / Hành vi</option>
            <option value="fake_profile">Hồ sơ giả mạo</option>
            <option value="harassment">Quấy rối / Xúc phạm</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học viên, HLV, nội dung..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>
      </div>

      {/* Reports Table / Card List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-2">
          <Flag className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Không có báo cáo nào</h4>
          <p className="text-xs text-slate-500">Hệ thống đang hoạt động an toàn và không có khiếu nại chưa xử lý.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map(report => {
            const cat = getCategoryLabel(report.reason_category);
            
            // Check how many reports this reported user has
            const totalReportsForUser = reports.filter(r => r.reported_user_id === report.reported_user_id).length;
            const hasMultipleViolations = totalReportsForUser >= 2;

            return (
              <div 
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {report.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                      {cat.label}
                    </span>
                    {getStatusBadge(report.status)}

                    {hasMultipleViolations && (
                      <span className="text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Đã có {totalReportsForUser} báo cáo vi phạm
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    {report.created_at}
                  </span>
                </div>

                {/* Parties Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Người gửi báo cáo:</span>
                    <span className="font-bold text-slate-900">{report.reporter_name}</span>
                    <span className="text-slate-500 capitalize"> ({report.reporter_role})</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Đối tượng bị phản ánh:</span>
                    <span className="font-bold text-rose-900">{report.reported_user_name}</span>
                    <span className="text-slate-500 capitalize"> ({report.reported_user_role || 'user'})</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Buổi học liên quan:</span>
                    <span className="font-mono text-slate-700">{report.booking_id || 'Không đính kèm đơn'}</span>
                  </div>
                </div>

                {/* Description Body */}
                <div className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Nội dung chi tiết:</span>
                  <p className="leading-relaxed whitespace-pre-wrap">{report.description}</p>
                </div>

                {/* Resolution note if any */}
                {report.resolution_note && (
                  <div className="text-xs text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Ghi chú thụ lý của Admin ({report.handler_name || 'Support'}):</span>
                      <p className="mt-0.5">{report.resolution_note}</p>
                    </div>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {hasMultipleViolations && report.reported_user_role === 'coach' && (
                      <button
                        onClick={() => handleSuspendDirectly(report.reported_user_id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                        title="Tạm đình chỉ HLV do có nhiều vi phạm"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Đình Chỉ HLV Này</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {report.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'reviewing')}
                          disabled={!canHandleReports}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200 transition cursor-pointer disabled:opacity-50"
                        >
                          Tiếp nhận xác minh
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setResolutionNote('Đã nhắc nhở và cập nhật hồ sơ HLV.');
                          }}
                          disabled={!canHandleReports}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          Giải quyết (Resolve)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                          disabled={!canHandleReports}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          Bác bỏ
                        </button>
                      </>
                    )}

                    {report.status === 'reviewing' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setResolutionNote('Đã xác minh và xử lý kỷ luật theo quy chế sàn.');
                          }}
                          disabled={!canHandleReports}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          Hoàn tất xử lý (Resolve)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                          disabled={!canHandleReports}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          Bác bỏ
                        </button>
                      </>
                    )}

                    {(report.status === 'resolved' || report.status === 'dismissed') && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'open')}
                        disabled={!canHandleReports}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-medium underline cursor-pointer disabled:opacity-50"
                      >
                        Mở lại báo cáo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolution Note Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Hoàn Tất Xử Lý Báo Cáo Vi Phạm</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Mã báo cáo: <strong className="font-mono">{selectedReport.id}</strong> đối với <strong>{selectedReport.reported_user_name}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú phương án giải quyết (Audit Note):
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ghi rõ biện pháp: Cảnh cáo, yêu cầu sửa đổi hồ sơ, hoặc đình chỉ..."
              />
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-3.5 py-2 text-slate-600 font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Lưu & Đánh dấu Đã Xử Lý
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
