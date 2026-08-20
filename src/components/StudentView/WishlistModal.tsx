import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Heart, Star, MapPin, Award, 
  ArrowRight, Trash2, Calendar 
} from 'lucide-react';
import { CoachProfile } from '../../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoach?: (coach: CoachProfile) => void;
  onBookCoach?: (coach: CoachProfile) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectCoach,
  onBookCoach
}) => {
  const { getWishlistCoaches, toggleWishlist, currentUser } = useApp();

  if (!isOpen) return null;

  const wishlistCoaches = getWishlistCoaches();

  return (
    <div id="wishlist_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="wishlist_modal_content"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                HLV Yêu Thích Của Bạn
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  {wishlistCoaches.length}
                </span>
              </h2>
              <p className="text-xs text-rose-100/90">
                Danh sách huấn luyện viên bạn đã lưu để tiện theo dõi và đặt lịch
              </p>
            </div>
          </div>
          <button 
            id="btn_close_wishlist_modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {wishlistCoaches.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <h3 className="text-base font-semibold text-slate-700">Chưa có HLV nào trong danh sách yêu thích</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bấm vào biểu tượng trái tim trên thẻ của Huấn luyện viên để lưu họ vào danh sách này nhé!
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
              >
                Khám Phá Huấn Luyện Viên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistCoaches.map((coach) => {
                const user = coach.user;
                return (
                  <div
                    key={coach.id}
                    id={`wishlist_coach_card_${coach.id}`}
                    className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl transition shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                            alt={user?.full_name || 'Coach'}
                            className="w-12 h-12 rounded-xl object-cover object-top border border-slate-200 shadow-xs"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1">
                              {user?.full_name}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{coach.rating_avg.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({coach.review_count} đánh giá)</span>
                            </div>
                          </div>
                        </div>

                        <button
                          id={`btn_remove_wishlist_${coach.id}`}
                          onClick={() => toggleWishlist(coach.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa khỏi danh sách yêu thích"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{coach.area}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>DUPR {coach.dupr_level} • {coach.experience_years} năm kinh nghiệm</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-700 pt-1">
                          {coach.price_per_session.toLocaleString('vi-VN')}đ <span className="text-[10px] text-slate-400 font-normal">/ buổi</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-slate-200/60">
                      {onSelectCoach && (
                        <button
                          onClick={() => {
                            onSelectCoach(coach);
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-xs border border-slate-200 transition text-center"
                        >
                          Xem Hồ Sơ
                        </button>
                      )}
                      {onBookCoach && (
                        <button
                          onClick={() => {
                            onBookCoach(coach);
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Đặt Lịch</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
