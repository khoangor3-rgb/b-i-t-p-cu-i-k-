import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Clock, Calendar, MapPin, CheckCircle2, 
  XCircle, AlertTriangle, ArrowRight, ShieldCheck
} from 'lucide-react';

export const StudentWaitlistView: React.FC = () => {
  const { currentUser, waitlistEntries, acceptWaitlistOffer, declineWaitlistOffer, leaveWaitlist } = useApp();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter student entries
  const studentEntries = waitlistEntries.filter(w => w.student_id === currentUser?.id);

  const activeOffered = studentEntries.filter(w => w.status === 'offered');
  const activeWaiting = studentEntries.filter(w => w.status === 'waiting');
  const historyEntries = studentEntries.filter(w => w.status !== 'waiting' && w.status !== 'offered');

  // Trigger state refresh for countdown every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const handleAccept = (entryId: string) => {
    const res = acceptWaitlistOffer(entryId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleDecline = (entryId: string) => {
    const res = declineWaitlistOffer(entryId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleLeave = (entryId: string) => {
    const res = leaveWaitlist(entryId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const getRemainingTimeText = (expiresAtStr?: string | null) => {
    if (!expiresAtStr) return '2 giờ';
    const exp = new Date(expiresAtStr).getTime();
    const diff = exp - Date.now();
    if (diff <= 0) return 'Đã hết hạn';
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours} giờ ${mins} phút`;
    return `${mins} phút`;
  };

  return (
    <div className="space-y-6" id="student-waitlist-view">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-amber-100 mb-2">
              <Users size={14} />
              <span>Hệ thống hàng chờ tự động FIFO</span>
            </div>
            <h2 className="text-2xl font-bold">Danh sách Ca tập Đang chờ (Waitlist)</h2>
            <p className="text-sm text-amber-100 mt-1 max-w-2xl">
              Khi các ca tập của HLV yêu thích đã kín chỗ, bạn được tự động xếp hàng và ưu tiên nhận suất ngay khi có người hủy lịch.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-200">{activeOffered.length}</div>
              <div className="text-[11px] uppercase tracking-wider text-amber-100 font-medium">Suất chờ nhận</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">{activeWaiting.length}</div>
              <div className="text-[11px] uppercase tracking-wider text-amber-100 font-medium">Đang xếp hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs underline hover:no-underline">
            Đóng
          </button>
        </div>
      )}

      {/* URGENT OFFERS SECTION (ACTION REQUIRED) */}
      {activeOffered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900 uppercase tracking-wide">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span>Khẩn cấp: Có suất trống dành riêng cho bạn!</span>
          </div>

          <div className="space-y-4">
            {activeOffered.map((entry) => (
              <div
                key={entry.id}
                id={`waitlist-offer-${entry.id}`}
                className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5 shadow-md relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={entry.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                      alt={entry.coach_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-300 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full font-bold">
                          Ưu tiên #1
                        </span>
                        <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Clock size={12} />
                          <span>Hết hạn sau: {getRemainingTimeText(entry.offer_expires_at)}</span>
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{entry.session_summary}</h4>
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar size={13} className="text-amber-600" />
                          {entry.date} ({entry.time})
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin size={13} className="text-amber-600" />
                          {entry.court_name}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          {entry.price?.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-amber-200">
                    <button
                      id={`decline-wl-btn-${entry.id}`}
                      onClick={() => handleDecline(entry.id)}
                      className="flex-1 lg:flex-none px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all"
                    >
                      Từ chối / Nhường
                    </button>
                    <button
                      id={`accept-wl-btn-${entry.id}`}
                      onClick={() => handleAccept(entry.id)}
                      className="flex-1 lg:flex-none px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>Xác nhận nhận suất</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE WAITING QUEUE */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Users size={16} className="text-amber-600" />
          <span>Ca tập đang trong hàng chờ ({activeWaiting.length})</span>
        </h3>

        {activeWaiting.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">Bạn không có ca tập nào đang chờ</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Khi tìm thấy ca tập kín chỗ của HLV, hãy bấm nút "Gia nhập danh sách chờ" để nhận thông báo sớm nhất.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeWaiting.map((entry) => (
              <div
                key={entry.id}
                id={`wait-item-${entry.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                        alt={entry.coach_name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{entry.coach_name}</h4>
                        <div className="text-xs text-slate-500">{entry.session_summary}</div>
                      </div>
                    </div>
                    <div className="text-center px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="text-xs font-bold text-amber-800">Vị trí</div>
                      <div className="text-base font-black text-amber-900">#{entry.position}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Ngày học: <strong>{entry.date} ({entry.time})</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400" />
                      <span>Địa điểm: <strong>{entry.court_name}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    <span>Nộp lúc: {entry.created_at}</span>
                  </span>
                  <button
                    id={`leave-wl-btn-${entry.id}`}
                    onClick={() => handleLeave(entry.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
                  >
                    Rút khỏi hàng chờ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HISTORY / RESOLVED WAITLIST */}
      {historyEntries.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Lịch sử danh sách chờ ({historyEntries.length})
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {historyEntries.map((entry) => {
              const statusLabels: Record<string, { text: string; class: string }> = {
                accepted: { text: 'Đã nhận suất thành công', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                expired: { text: 'Quá hạn xác nhận 2h', class: 'bg-slate-100 text-slate-600 border-slate-200' },
                cancelled: { text: 'Đã hủy', class: 'bg-rose-50 text-rose-600 border-rose-200' }
              };
              const badge = statusLabels[entry.status] || { text: entry.status, class: 'bg-slate-100 text-slate-600' };

              return (
                <div key={entry.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{entry.session_summary}</div>
                    <div className="text-slate-500 mt-0.5">
                      Ngày {entry.date} ({entry.time}) - {entry.court_name}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-semibold border ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
