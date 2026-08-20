import React, { useState } from 'react';
import { 
  Star, MessageSquare, CheckCircle2, Send, ShieldCheck, 
  TrendingUp, Users, Calendar, Award, AlertCircle, Heart,
  Sparkles, Filter, ChevronRight, ThumbsUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';

export const CoachReviewsView: React.FC = () => {
  const { currentUser, coaches, reviews, bookings, replyToReview, users } = useApp();
  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  const coachUser = users.find(u => u.id === coach.user_id) || currentUser;

  const coachReviews = reviews.filter(r => r.coach_id === coach.id);
  const coachBookings = bookings.filter(b => b.coach_id === coach.id);
  const completedBookings = coachBookings.filter(b => b.status === 'completed');

  // Filter state
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const filteredReviews = coachReviews.filter(r => {
    if (starFilter === 'all') return true;
    return Math.floor(r.rating) === starFilter;
  });

  // Rating breakdown stats
  const fiveStars = coachReviews.filter(r => Math.floor(r.rating) === 5).length;
  const fourStars = coachReviews.filter(r => Math.floor(r.rating) === 4).length;
  const threeStars = coachReviews.filter(r => Math.floor(r.rating) === 3).length;
  const lowStars = coachReviews.filter(r => Math.floor(r.rating) <= 2).length;

  const handleSendReply = (reviewId: string) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim()) return;

    replyToReview(reviewId, text.trim());
    setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
    setActiveReplyId(null);
    setToastMsg('✓ Đã đăng câu trả lời công khai đến học viên!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-900 text-white text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Performance & Student Feedback
            </span>
            <span className="text-xs text-slate-400 font-medium">Đánh Giá & Phản Hồi Học Viên</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Hiệu Suất Huấn Luyện & Đánh Giá Thực
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Điểm đánh giá trung bình từ học viên đã hoàn thành buổi học thực tế trên sân.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Điểm trung bình</div>
            <div className="text-2xl font-black text-slate-900 flex items-center gap-1 justify-end">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{coach.rating_avg.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* RATING BREAKDOWN & KPI SUMMARY (Section 46) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Overall Rating Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Phân Phối Đánh Giá</h3>
          
          <div className="space-y-2 text-xs">
            {/* 5 stars */}
            <div className="flex items-center gap-2">
              <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                <span>5</span> <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${coachReviews.length > 0 ? (fiveStars / coachReviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-slate-500">{fiveStars}</span>
            </div>

            {/* 4 stars */}
            <div className="flex items-center gap-2">
              <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                <span>4</span> <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${coachReviews.length > 0 ? (fourStars / coachReviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-slate-500">{fourStars}</span>
            </div>

            {/* 3 stars */}
            <div className="flex items-center gap-2">
              <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                <span>3</span> <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${coachReviews.length > 0 ? (threeStars / coachReviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-slate-500">{threeStars}</span>
            </div>

            {/* <= 2 stars */}
            <div className="flex items-center gap-2">
              <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                <span>≤2</span> <Star className="w-3 h-3 fill-slate-300 text-slate-300" />
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-400 h-full rounded-full" 
                  style={{ width: `${coachReviews.length > 0 ? (lowStars / coachReviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-slate-500">{lowStars}</span>
            </div>
          </div>
        </div>

        {/* Middle: Performance Highlights */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Chỉ Số Vận Hành</h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Tỷ lệ phản hồi booking:</span>
              <span className="font-black text-emerald-700">100% (trong vòng 15p)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Buổi học hoàn thành:</span>
              <span className="font-black text-slate-900">{completedBookings.length} buổi</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Tỷ lệ học viên quay lại:</span>
              <span className="font-black text-purple-700">84% tái đăng ký</span>
            </div>
          </div>
        </div>

        {/* Right: Growth & Tips */}
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Mẹo Nâng Cao Đánh Giá</span>
          </div>
          <h4 className="font-black text-white text-sm">Viết Session Recap Giúp Tăng 40% Đánh Giá 5 Sao</h4>
          <p className="text-xs text-purple-200/90 leading-relaxed">
            Học viên đánh giá rất cao việc HLV dành 2 phút sau buổi học để ghi chú lỗi kỹ thuật và bài tập về nhà.
          </p>
        </div>

      </div>

      {/* REVIEWS LIST & REPLY COMPOSER (Section 48-50) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Chi Tiết Nhận Xét Từ Học Viên</h3>
            <p className="text-xs text-slate-500">{coachReviews.length} lượt đánh giá công khai</p>
          </div>

          {/* Star Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStarFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                starFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStarFilter(5)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                starFilter === 5 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              5 sao ({fiveStars})
            </button>
            <button
              onClick={() => setStarFilter(4)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                starFilter === 4 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              4 sao ({fourStars})
            </button>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="space-y-4">
          {filteredReviews.map(rev => (
            <div key={rev.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
              
              {/* Review Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{rev.student_name}</div>
                    <div className="text-[11px] text-slate-400">{rev.created_at?.substring(0, 10) || '2026-08-16'}</div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(st => (
                    <Star
                      key={st}
                      className={`w-4 h-4 ${
                        st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-slate-700 leading-relaxed font-medium">
                "{rev.comment}"
              </p>

              {/* Existing Coach Reply if any */}
              {rev.coach_reply && (
                <div className="p-3.5 bg-white border border-emerald-200 rounded-2xl space-y-1 text-slate-800">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phản hồi từ HLV {coachUser?.full_name || 'Đăng Khoa'}:</span>
                  </div>
                  <p className="text-slate-600 italic">"{rev.coach_reply}"</p>
                </div>
              )}

              {/* Reply Box Button / Toggle */}
              {!rev.coach_reply && activeReplyId !== rev.id && (
                <button
                  onClick={() => setActiveReplyId(rev.id)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Viết phản hồi công khai cho học viên</span>
                </button>
              )}

              {/* Active Reply Composer (Section 50) */}
              {!rev.coach_reply && activeReplyId === rev.id && (
                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 animate-in fade-in">
                  <label className="font-bold text-slate-700 text-[11px]">
                    Viết phản hồi (Phản hồi lịch thiệp & chuyên nghiệp sẽ hiển thị công khai trên hồ sơ của bạn):
                  </label>
                  <textarea
                    value={replyTextMap[rev.id] || ''}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                    placeholder="Cảm ơn bạn đã tập luyện cùng mình! Buổi tới chúng ta sẽ tiếp tục cải thiện cú Drop..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    rows={2}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng phản hồi</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-2 text-xs">
              <Star className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">Chưa có nhận xét nào trong mục này</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
