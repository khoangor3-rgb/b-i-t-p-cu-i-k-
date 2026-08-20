import React, { useState } from 'react';
import { 
  Bell, BellRing, Clock, CheckCircle2, AlertTriangle, 
  Search, Filter, Play, RefreshCw, Calendar, User, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SessionReminder } from '../../types';

export const AdminRemindersTab: React.FC = () => {
  const { reminders, bookings, triggerCronSessionReminders } = useApp();
  const [recipientFilter, setRecipientFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cronResult, setCronResult] = useState<string | null>(null);
  const [isRunningCron, setIsRunningCron] = useState(false);

  const handleRunCron = () => {
    setIsRunningCron(true);
    setTimeout(() => {
      const res = triggerCronSessionReminders();
      setIsRunningCron(false);
      setCronResult(res.message);
      setTimeout(() => setCronResult(null), 6000);
    }, 400);
  };

  const filteredReminders = reminders.filter(r => {
    const matchesRecipient = recipientFilter === 'all' || r.recipient_type === recipientFilter;
    const matchesType = typeFilter === 'all' || r.reminder_type === typeFilter;
    if (!searchQuery) return matchesRecipient && matchesType;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = 
      (r.recipient_name || '').toLowerCase().includes(q) ||
      (r.booking_id || '').toLowerCase().includes(q) ||
      (r.booking_summary || '').toLowerCase().includes(q);
    return matchesRecipient && matchesType && matchesSearch;
  });

  const count24h = reminders.filter(r => r.reminder_type === '24h_before').length;
  const count1h = reminders.filter(r => r.reminder_type === '1h_before').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hệ Thống Nhắc Lịch Tự Động (Session Reminders Scheduler)</h2>
              <p className="text-xs text-slate-500">Giám sát và kiểm tra tiến trình gửi thông báo tự động trước 24 giờ và 1 giờ (Cron Job Idempotent)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCron}
            disabled={isRunningCron}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            {isRunningCron ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>{isRunningCron ? 'Đang quét cron...' : 'Kích Hoạt Quét Cron Ngay'}</span>
          </button>
        </div>
      </div>

      {/* Cron Result Alert */}
      {cronResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{cronResult}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Tổng Lời Nhắc Đã Gửi</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{reminders.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Không trùng lặp (Idempotent)</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Nhắc Lịch 24 Giờ Trước</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{count24h}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Khoảng cửa sổ 1h - 25h</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Nhắc Lịch 1 Giờ Trước</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{count1h}</div>
          <div className="text-[11px] text-rose-700 mt-0.5">Khoảng cửa sổ 15m - 75m</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          
          {/* Recipient Type filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Tất cả đối tượng' },
              { id: 'student', label: 'Học viên' },
              { id: 'coach', label: 'Huấn luyện viên' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRecipientFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  recipientFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reminder Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 outline-none"
          >
            <option value="all">Mọi loại nhắc lịch</option>
            <option value="24h_before">Nhắc 24 giờ trước (24h_before)</option>
            <option value="1h_before">Nhắc 1 giờ trước (1h_before)</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên người nhận, mã đơn..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>
      </div>

      {/* Reminders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Mã & Loại Nhắc</th>
                <th className="p-3.5">Người Nhận</th>
                <th className="p-3.5">Thông Tin Buổi Học</th>
                <th className="p-3.5">Giờ Bắt Đầu</th>
                <th className="p-3.5">Thời Điểm Gửi</th>
                <th className="p-3.5">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReminders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Chưa có bản ghi nhắc lịch nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredReminders.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5">
                      <div className="font-mono text-slate-500">{item.id}</div>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        item.reminder_type === '24h_before'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {item.reminder_type === '24h_before' ? '24 Giờ Trước' : '1 Giờ Trước'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.recipient_name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {item.recipient_type === 'student' ? 'Học Viên' : 'Huấn Luyện Viên'}
                      </div>
                    </td>

                    <td className="p-3.5 max-w-[260px]">
                      <div className="font-medium text-slate-800 truncate">{item.booking_summary}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Đơn: {item.booking_id}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-700">
                      {item.session_start_time}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-500">
                      {item.sent_at}
                    </td>

                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Đã gửi
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
