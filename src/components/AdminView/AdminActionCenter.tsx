import React from 'react';
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, 
  ArrowRight, FileText, Sparkles, UserX, RotateCcw,
  Bell, ChevronRight, Activity, DollarSign
} from 'lucide-react';
import { CoachProfile, Payment, UserReport, User, AdminActionLog } from '../../types';

interface AdminActionCenterProps {
  pendingCoaches: CoachProfile[];
  disputedPayments: Payment[];
  openReports: UserReport[];
  users: User[];
  recentLogs: AdminActionLog[];
  onNavigateTab: (tabId: string) => void;
  onQuickApproveCoach: (coachId: string) => void;
  onInspectCoach: (coach: CoachProfile) => void;
  onInspectPayment: (payment: Payment) => void;
}

export const AdminActionCenter: React.FC<AdminActionCenterProps> = ({
  pendingCoaches,
  disputedPayments,
  openReports,
  users,
  recentLogs,
  onNavigateTab,
  onQuickApproveCoach,
  onInspectCoach,
  onInspectPayment
}) => {
  const hasActions = pendingCoaches.length > 0 || disputedPayments.length > 0 || openReports.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 Cols: Action Center (Needs Attention) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Trung Tâm Xử Lý Ưu Tiên (Action Center)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {hasActions ? 'Cần ban quản trị xử lý' : 'Tất cả đã hoàn tất'}
          </span>
        </div>

        {!hasActions ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
            <h4 className="text-xs font-bold text-slate-800">Không có việc tồn đọng (You're all caught up)</h4>
            <p className="text-xs text-slate-500">Toàn bộ hồ sơ HLV, khiếu nại Escrow và báo cáo vi phạm đã được giải quyết.</p>
          </div>
        ) : (
          <div className="space-y-3">
            
            {/* 1. Pending Coaches Item */}
            {pendingCoaches.length > 0 && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                    {pendingCoaches.length}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {pendingCoaches.length} hồ sơ HLV đang chờ thẩm định chứng chỉ
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Ứng viên mới: {pendingCoaches.slice(0, 2).map(c => users.find(u => u.id === c.user_id)?.full_name).filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onInspectCoach(pendingCoaches[0])}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100/60 text-slate-800 font-bold rounded-xl border border-amber-200 transition cursor-pointer"
                  >
                    Xem xét hồ sơ
                  </button>
                  <button
                    onClick={() => onNavigateTab('verify')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Mở hàng đợi
                  </button>
                </div>
              </div>
            )}

            {/* 2. Escrow Disputes Item */}
            {disputedPayments.length > 0 && (
              <div className="p-4 bg-rose-50/70 border border-rose-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 font-bold">
                    {disputedPayments.length}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {disputedPayments.length} khiếu nại tranh chấp Escrow cần phân xử
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Cam kết xử lý trong 24h theo bảo hành Love Your Lesson
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onInspectPayment(disputedPayments[0])}
                    className="px-3 py-1.5 bg-white hover:bg-rose-100/60 text-slate-800 font-bold rounded-xl border border-rose-200 transition cursor-pointer"
                  >
                    Đối soát ngay
                  </button>
                  <button
                    onClick={() => onNavigateTab('payments')}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Phân xử Escrow
                  </button>
                </div>
              </div>
            )}

            {/* 3. Open Reports Item */}
            {openReports.length > 0 && (
              <div className="p-4 bg-purple-50/70 border border-purple-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold">
                    {openReports.length}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {openReports.length} phản ánh hành vi / vi phạm từ người dùng
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Báo cáo gần nhất: {openReports[0].description || openReports[0].reason_category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigateTab('reports')}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Xem báo cáo
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right 1 Col: Compact Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Nhật Ký Gần Đây (Activity Feed)
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('audit_logs')}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Tất cả →
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 divide-y divide-slate-100 text-xs">
          {recentLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="pt-2.5 first:pt-0 space-y-1">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="font-bold text-slate-900 truncate">{log.admin_name}</span>
                <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
