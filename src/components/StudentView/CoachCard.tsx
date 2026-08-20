import React, { useState } from 'react';
import { 
  Star, CheckCircle2, MapPin, Award, Play, 
  Sparkles, Calendar, ShieldCheck, ChevronRight,
  Heart, Clock, Check
} from 'lucide-react';
import { CoachProfile, User, Review } from '../../types';
import { useApp } from '../../context/AppContext';
import { CoachBadge } from '../Common/CoachBadge';

interface CoachCardProps {
  coach: CoachProfile;
  coachUser?: User;
  reviews?: Review[];
  onSelectCoach: (coach: CoachProfile) => void;
  onWatchVideo?: (videoUrl: string, coachName: string) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ 
  coach, 
  coachUser, 
  reviews = [],
  onSelectCoach,
  onWatchVideo 
}) => {
  const { isCoachWishlisted, toggleWishlist, slots } = useApp();
  const isVerified = coach.verification_status === 'verified';
  const isFavorited = isCoachWishlisted ? isCoachWishlisted(coach.id) : false;
  
  // Find available slots for this coach
  const coachSlots = slots.filter(s => s.coach_id === coach.id && !s.is_booked);
  const soonestSlot = coachSlots.length > 0 ? coachSlots[0] : null;

  // Filter reviews for this coach
  const coachReviews = reviews.filter(r => r.coach_id === coach.id && !r.is_hidden);
  const primaryCert = coach.certifications && coach.certifications.length > 0 ? coach.certifications[0] : null;
  const extraCertsCount = coach.certifications && coach.certifications.length > 1 ? coach.certifications.length - 1 : 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      <div>
        {/* 1. TOP HEADER: Trust Bar & Heart Action */}
        <div className="px-5 py-3 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Love Your Lesson • Đổi HLV nếu chưa hài lòng</span>
          </div>

          <button
            type="button"
            id={`btn_wishlist_${coach.id}`}
            aria-label={isFavorited ? 'Bỏ lưu HLV khỏi danh sách yêu thích' : 'Lưu HLV vào danh sách yêu thích'}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(coach.id);
            }}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isFavorited 
                ? 'text-rose-500 hover:text-rose-600 bg-rose-50' 
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
            }`}
            title={isFavorited ? 'Bỏ lưu HLV này' : 'Lưu HLV vào danh sách yêu thích'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-rose-500' : ''}`} />
          </button>
        </div>

        {/* 2. LEVEL 1 (WHO) & LEVEL 2 (WHY TRUST) */}
        <div className="p-5 pb-3">
          <div className="flex items-start gap-4">
            
            {/* Coach Avatar */}
            <div className="relative shrink-0">
              <img 
                src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80'} 
                alt={coachUser?.full_name || 'Coach'} 
                className="w-20 h-20 rounded-2xl object-cover object-top ring-2 ring-slate-100 shadow-xs"
              />
              <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Sẵn sàng nhận lịch"></span>
              
              {coach.video_intro_url && onWatchVideo && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatchVideo(coach.video_intro_url!, coachUser?.full_name || 'HLV');
                  }}
                  className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-1.5 rounded-full shadow-md transition flex items-center justify-center cursor-pointer"
                  title="Xem video giới thiệu"
                >
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </button>
              )}
            </div>

            {/* Identity & Credentials */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                  {coachUser?.full_name || 'HLV Pickleball'}
                </h3>
                {isVerified && (
                  <span title="Bằng cấp và danh tính đã được Admin phê duyệt">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white inline-block" />
                  </span>
                )}
              </div>

              {/* DUPR Rating & Experience */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-extrabold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/60 text-xs flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-700" />
                  DUPR {coach.dupr_level.toFixed(1)} {coach.dupr_level >= 5.0 ? 'Master' : 'Pro'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">{coach.experience_years} năm kinh nghiệm</span>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center text-amber-500 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{coach.rating_avg > 0 ? coach.rating_avg.toFixed(1) : '5.0'}</span>
                </div>
                <span className="text-slate-500">
                  ({coach.review_count > 0 ? coach.review_count : coachReviews.length} đánh giá)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-bold">{coach.students_count} học viên</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. LEVEL 3 (WHY FIT) & LEVEL 4 (LOGISTICS) */}
        <div className="px-5 py-2 space-y-2.5">
          
          {/* Primary Certification */}
          {primaryCert ? (
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">{primaryCert.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{primaryCert.issuer}</div>
                </div>
              </div>

              {extraCertsCount > 0 ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  +{extraCertsCount} chứng chỉ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded shrink-0">
                  Đã duyệt
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 italic p-2 bg-slate-50 rounded-xl border border-slate-100">
              Đang hoàn thiện chứng chỉ bổ sung
            </div>
          )}

          {/* Key Skill Badges */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {coach.specialties.slice(0, 3).map((spec, i) => (
              <span 
                key={i} 
                className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/60"
              >
                {spec}
              </span>
            ))}
            {coach.specialties.length > 3 && (
              <span className="text-[10px] bg-slate-50 text-slate-500 font-medium px-2 py-1 rounded-lg">
                +{coach.specialties.length - 3}
              </span>
            )}
          </div>

          {/* Location & Soonest Slot */}
          <div className="space-y-1 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">{coach.area}</span>
            </div>
            
            {soonestSlot && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Lịch sớm nhất: {soonestSlot.date} ({soonestSlot.start_time} - {soonestSlot.end_time})</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. LEVEL 5 (PRICE) & LEVEL 6 (ACTION) */}
      <div className="p-5 pt-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Học phí đào tạo</div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {coach.price_per_session.toLocaleString('vi-VN')} đ
            </span>
            <span className="text-xs text-slate-500 font-normal">/ buổi</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          id={`btn-book-coach-${coach.id}`}
          onClick={() => onSelectCoach(coach)}
          className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-emerald-200" />
          <span>Đặt Lịch Học</span>
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </button>
      </div>

    </div>
  );
};
