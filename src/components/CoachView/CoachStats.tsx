import React, { useState } from 'react';
import { 
  Award, Star, Users, DollarSign, Calendar, 
  MessageSquare, CheckCircle2, Send, ShieldCheck, TrendingUp,
  Wallet, Clock, ArrowDownRight, CreditCard, Lock, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CoachStats: React.FC = () => {
  const { currentUser, coaches, reviews, bookings, replyToReview, getCoachEarnings, payments } = useApp();
  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];

  const coachReviews = reviews.filter(r => r.coach_id === coach.id);
  const coachBookings = bookings.filter(b => b.coach_id === coach.id);
  const coachEarnings = getCoachEarnings(coach.id);

  const completedBookings = coachBookings.filter(b => b.status === 'completed');
  const coachPayments = payments.filter(p => p.coach_id === coach.id);

  // Reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replySuccessMsg, setReplySuccessMsg] = useState('');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  const handleSendReply = (reviewId: string) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim()) return;

    replyToReview(reviewId, text.trim());
    setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
    setReplySuccessMsg('Đã đăng phản hồi công khai cho học viên!');
    setTimeout(() => setReplySuccessMsg(''), 3000);
  };

  const handleRequestWithdrawal = () => {
    if (coachEarnings.totalEarnings <= 0) {
      alert('Số dư khả dụng hiện tại là 0đ. Thu nhập sẽ tự động chuyển sang số dư khả dụng ngay khi bạn hoàn thành buổi học!');
      return;
    }
    setPayoutSuccessMsg(`Lệnh rút ${coachEarnings.totalEarnings.toLocaleString('vi-VN')}đ về tài khoản ngân hàng đã được tiếp nhận! Hệ thống tự động chuyển khoản trong vòng 2-4 giờ làm việc.`);
    setTimeout(() => setPayoutSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số buổi đã dạy</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {completedBookings.length + coach.students_count}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Tăng trưởng đều trong tháng</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Học viên tin tưởng</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {coach.students_count}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Tổng lượt học viên đã hướng dẫn
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Điểm đánh giá TB</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 flex items-baseline gap-1">
            <span>{coach.rating_avg.toFixed(1)}</span>
            <span className="text-xs font-normal text-gray-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {coach.review_count} lượt đánh giá thực
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thu nhập khả dụng</span>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800">
            {coachEarnings.totalEarnings.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Đã khấu trừ 10% phí sàn
          </div>
        </div>

      </div>

      {/* Coach Escrow & Payout Wallet Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Quản Lý Thu Nhập & Đối Soát Escrow</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Ví Thu Nhập Huấn Luyện Viên
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Toàn bộ học phí được bảo chứng qua Quỹ Escrow và tự động cộng vào số dư thực nhận (90%) khi buổi học hoàn thành.
            </p>
          </div>

          <button
            onClick={handleRequestWithdrawal}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Rút Tiền Về Ngân Hàng</span>
          </button>
        </div>

        {payoutSuccessMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{payoutSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-slate-400">Số dư khả dụng (Đã giải ngân)</div>
            <div className="text-2xl font-black text-emerald-400">{coachEarnings.totalEarnings.toLocaleString('vi-VN')}đ</div>
            <div className="text-[10px] text-slate-400 pt-1">Sẵn sàng rút về tài khoản bất cứ lúc nào</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-slate-400">Đang ký quỹ Escrow (Chờ buổi học)</div>
            <div className="text-2xl font-black text-amber-300">{coachEarnings.pendingEscrow.toLocaleString('vi-VN')}đ</div>
            <div className="text-[10px] text-slate-400 pt-1">Sẽ tự động mở khóa ngay khi bạn dạy xong</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-1">
            <div className="text-xs text-slate-400">Tỷ lệ chi trả nền tảng</div>
            <div className="text-2xl font-black text-white">90% <span className="text-xs font-normal text-slate-400">/ 10% phí sàn</span></div>
            <div className="text-[10px] text-slate-400 pt-1">Bao gồm bảo hiểm Love Your Lesson & CSKH</div>
          </div>
        </div>

        {/* Transactions Table for Coach */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Lịch Sử Giao Dịch & Khóa Ký Quỹ Escrow ({coachPayments.length})</span>
            </h3>
          </div>

          {coachPayments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs bg-slate-800/40 rounded-2xl border border-slate-700/60">
              Chưa có giao dịch ký quỹ nào ghi nhận cho hồ sơ của bạn.
            </div>
          ) : (
            <div className="overflow-x-auto bg-slate-800/40 rounded-2xl border border-slate-700/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Mã Giao Dịch</th>
                    <th className="py-3 px-4">Học Viên</th>
                    <th className="py-3 px-4">Tổng Học Phí</th>
                    <th className="py-3 px-4">Thực Nhận (90%)</th>
                    <th className="py-3 px-4">Trạng Thái Escrow</th>
                    <th className="py-3 px-4">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 font-medium">
                  {coachPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4 font-mono text-amber-300">{p.id}</td>
                      <td className="py-3 px-4 text-white font-bold">{p.student_name}</td>
                      <td className="py-3 px-4">{p.amount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{p.payout_amount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-3 px-4">
                        {p.status === 'held' && (
                          <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Đang giữ Escrow
                          </span>
                        )}
                        {p.status === 'released' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã giải ngân
                          </span>
                        )}
                        {p.status === 'refunded' && (
                          <span className="inline-flex items-center gap-1 bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Đã hoàn tiền
                          </span>
                        )}
                        {p.status === 'disputed' && (
                          <span className="inline-flex items-center gap-1 bg-red-950 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Đang khiếu nại
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{p.paid_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {replySuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{replySuccessMsg}</span>
        </div>
      )}

      {/* Reviews Feedback Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Đánh Giá Minh Bạch Từ Học Viên ({coachReviews.length})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Theo quy định minh bạch của PickleConnect, HLV không thể xóa đánh giá xấu mà có thể trả lời phản hồi công khai.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tiêu chuẩn minh bạch 100%</span>
          </div>
        </div>

        {coachReviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs italic">
            Chưa có đánh giá nào cho hồ sơ của bạn.
          </div>
        ) : (
          <div className="space-y-4">
            {coachReviews.map(rev => (
              <div 
                key={rev.id} 
                className={`p-4 rounded-2xl border transition ${
                  rev.is_hidden 
                    ? 'bg-gray-100 border-gray-200 opacity-60' 
                    : 'bg-gray-50/70 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rev.student_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                      alt="" 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{rev.student_name}</div>
                      <div className="text-[11px] text-gray-400">{rev.created_at}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 mb-3">
                  {rev.comment}
                </p>

                {/* Skill tags */}
                {rev.skill_tags && rev.skill_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {rev.skill_tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Coach existing reply */}
                {rev.coach_reply ? (
                  <div className="bg-emerald-50/80 border-l-3 border-emerald-500 p-3 rounded-r-xl text-xs text-emerald-900">
                    <span className="font-bold block mb-0.5">Phản hồi của bạn:</span>
                    <span>{rev.coach_reply}</span>
                  </div>
                ) : (
                  /* Reply input */
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <input
                      type="text"
                      value={replyTextMap[rev.id] || ''}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                      placeholder="Viết phản hồi cảm ơn hoặc hướng dẫn thêm cho học viên..."
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Gửi</span>
                    </button>
                  </div>
                )}

                {rev.is_hidden && (
                  <div className="text-[10px] text-red-600 font-bold mt-2">
                    [Đánh giá này đang bị Admin ẩn do: {rev.hide_reason || 'Vi phạm chính sách'}]
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

