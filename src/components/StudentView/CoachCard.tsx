import React from 'react';
import { 
  Star, CheckCircle2, MapPin, Award, Play, 
  Sparkles, Calendar, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { CoachProfile, User } from '../../types';

interface CoachCardProps {
  coach: CoachProfile;
  coachUser?: User;
  onSelectCoach: (coach: CoachProfile) => void;
  onWatchVideo?: (videoUrl: string, coachName: string) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ 
  coach, 
  coachUser, 
  onSelectCoach,
  onWatchVideo 
}) => {
  const isVerified = coach.verification_status === 'verified';
  const lowestPackage = coach.packages && coach.packages.length > 0
    ? coach.packages.reduce((min, p) => p.discount_percent > min.discount_percent ? p : min, coach.packages[0])
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Guarantee Header (Above avatar, completely unobstructed) */}
      <div className="px-5 pt-3.5 pb-2 flex items-center justify-between gap-2 border-b border-gray-100 bg-emerald-50/30">
        <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-emerald-100" />
          Love Your Lesson • Đảm bảo hài lòng 100%
        </span>
        <span className="text-[10px] text-emerald-800 font-semibold hidden sm:inline">HLV Chuẩn Quốc Tế</span>
      </div>

      {/* Top Banner / Coach Profile area */}
      <div className="p-5 pt-4 pb-3">
        <div className="flex items-start gap-4">
          {/* Avatar with Video button overlay (100% unobstructed face) */}
          <div className="relative shrink-0">
            <img 
              src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={coachUser?.full_name} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-emerald-100 shadow-md group-hover:scale-105 transition duration-300"
            />
            {coach.video_intro_url && onWatchVideo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchVideo(coach.video_intro_url!, coachUser?.full_name || 'HLV');
                }}
                className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-full shadow-md transition flex items-center justify-center cursor-pointer group-hover:scale-110"
                title="Xem Video giới thiệu"
              >
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </button>
            )}
          </div>

          {/* Coach info header */}
          <div className="flex-1 min-w-0">
            {/* Featured Badge placed above Coach Name */}
            {coach.is_featured && (
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 fill-white" />
                  Nổi Bật
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {coachUser?.full_name}
              </h3>
              {isVerified && (
                <span className="text-emerald-600 shrink-0" title="Đã xác thực chứng chỉ bởi Admin">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white inline-block" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5 flex-wrap">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                DUPR {coach.dupr_level.toFixed(1)} Pro
              </span>
              <span>•</span>
              <span>{coach.experience_years} năm kinh nghiệm</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{coach.area}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Specialties */}
      <div className="px-5 py-2 flex-1 flex flex-col justify-between">
        {/* Rating & reviews counter */}
        <div className="flex items-center justify-between py-2 border-y border-gray-100 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-sm text-gray-900 ml-1">
                {coach.rating_avg > 0 ? coach.rating_avg.toFixed(1) : 'Mới'}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              • {coach.review_count} đánh giá
            </span>
          </div>

          <div className="text-xs text-gray-500">
            <strong className="text-gray-900 font-semibold">{coach.students_count}</strong> học viên đã học
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
          {coach.bio}
        </p>

        {/* Certifications preview */}
        {coach.certifications && coach.certifications.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100 truncate">
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{coach.certifications[0].title}</span>
            </div>
          </div>
        )}

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {coach.specialties.slice(0, 3).map((spec, i) => (
            <span 
              key={i} 
              className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
            >
              {spec}
            </span>
          ))}
          {coach.specialties.length > 3 && (
            <span className="text-[11px] text-gray-400 px-1 py-0.5">
              +{coach.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Price & Booking CTA */}
      <div className="p-5 pt-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-400">Học phí từ</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-gray-900">
              {coach.price_per_session.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs text-gray-500 font-normal">/buổi</span>
          </div>
          {lowestPackage && lowestPackage.discount_percent > 0 && (
            <div className="text-[10px] text-emerald-600 font-semibold">
              Gói {lowestPackage.sessions} buổi: Giảm {lowestPackage.discount_percent}%
            </div>
          )}
        </div>

        <button
          onClick={() => onSelectCoach(coach)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Đặt lịch học</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
