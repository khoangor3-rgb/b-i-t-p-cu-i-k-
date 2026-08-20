import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Clock, Send, ShieldCheck, CheckCircle2, 
  XCircle, AlertTriangle, ArrowRight, UserCheck
} from 'lucide-react';

export const AdminWaitlistTab: React.FC = () => {
  const { waitlistEntries, inviteNextInWaitlist, logAdminAction } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionFeedback, setActionFeedback] = useState<string>('');

  const filtered = waitlistEntries.filter(w => {
    if (filterStatus === 'all') return true;
    return w.status === filterStatus;
  });

  const stats = {
    total: waitlistEntries.length,
    waiting: waitlistEntries.filter(w => w.status === 'waiting').length,
    offered: waitlistEntries.filter(w => w.status === 'offered').length,
    accepted: waitlistEntries.filter(w => w.status === 'accepted').length,
    expired: waitlistEntries.filter(w => w.status === 'expired').length,
  };

  const handleManualInvite = (bookingId: string) => {
    const invited = inviteNextInWaitlist(bookingId);
    if (invited) {
      logAdminAction('TRIGGER_WAITLIST_INVITE', 'waitlist', invited.id, {
        student_name: invited.student_name,
        booking_id: bookingId
      });
      setActionFeedback(`Đã chuyển trạng thái và gửi thông báo ưu tiên 2h cho học viên ${invited.student_name} (#${invited.position})!`);
      setTimeout(() => setActionFeedback(''), 4000);
    } else {
      setActionFeedback('Không có ứng viên nào đang trong hàng chờ của ca tập này.');
      setTimeout(() => setActionFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6" id="admin-waitlist-tab">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tổng lượt chờ</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-amber-600 uppercase">Đang xếp hàng</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.waiting}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-orange-600 uppercase">Đang giữ chỗ (2h)</div>
          <div className="text-2xl font-black text-orange-600 mt-1">{stats.offered}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-600 uppercase">Đã nhận suất</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.accepted}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Quá hạn / Hủy</div>
          <div className="text-2xl font-black text-slate-500 mt-1">{stats.expired}</div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: `Tất cả (${stats.total})` },
            { id: 'waiting', label: `Đang chờ (${stats.waiting})` },
            { id: 'offered', label: `Chờ duyệt 2h (${stats.offered})` },
            { id: 'accepted', label: `Thành công (${stats.accepted})` },
            { id: 'expired', label: `Hết hạn (${stats.expired})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              <tr>
                <th className="p-4">Hàng chờ & Vị trí</th>
                <th className="p-4">Học viên</th>
                <th className="p-4">Huấn luyện viên & Ca tập</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Không có bản ghi hàng chờ nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const statusColors: Record<string, string> = {
                    waiting: 'bg-amber-100 text-amber-800 border-amber-200',
                    offered: 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse',
                    accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    expired: 'bg-slate-100 text-slate-600 border-slate-200',
                    cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
                  };

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 font-extrabold text-amber-900 text-xs">
                          #{entry.position} FIFO
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={entry.student_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'}
                            alt={entry.student_name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-800">{entry.student_name}</div>
                            <div className="text-[11px] text-slate-400">{entry.student_phone || '0912345678'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-800">{entry.coach_name}</div>
                          <div className="text-[11px] text-slate-500">{entry.session_summary}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-700">{entry.date} ({entry.time})</div>
                          <div className="text-[11px] text-slate-400">{entry.court_name}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${statusColors[entry.status] || 'bg-slate-100 text-slate-700'}`}>
                          {entry.status === 'waiting' && 'Đang xếp hàng'}
                          {entry.status === 'offered' && 'Đã mở suất (2h)'}
                          {entry.status === 'accepted' && 'Đã chốt nhận'}
                          {entry.status === 'expired' && 'Hết hạn'}
                          {entry.status === 'cancelled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {entry.status === 'waiting' && (
                          <button
                            id={`manual-invite-${entry.id}`}
                            onClick={() => handleManualInvite(entry.booking_id)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-xs inline-flex items-center gap-1 transition-all"
                            title="Gửi ngay lời mời nhận suất cho ứng viên này"
                          >
                            <Send size={12} />
                            <span>Mời nhận suất</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
