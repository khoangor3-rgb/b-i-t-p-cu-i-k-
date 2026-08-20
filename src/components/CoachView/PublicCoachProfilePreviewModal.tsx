import React from 'react';
import { 
  X, Star, MapPin, Award, ShieldCheck, CheckCircle2, 
  Calendar, Clock, Video, Sparkles, Check, Heart, Eye
} from 'lucide-react';
import { CoachProfile, User } from '../../types';
import { CoachBadge } from '../Common/CoachBadge';

interface PublicCoachProfilePreviewModalProps {
  coach: CoachProfile;
  user?: User;
  onClose: () => void;
}

export const PublicCoachProfilePreviewModal: React.FC<PublicCoachProfilePreviewModalProps> = ({
  coach,
  user,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header Bar with Marketplace Badge */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Giao Diện Học Viên Nhìn Thấy (Public Preview)
              </div>
              <h2 className="text-sm font-black text-white">
                Hồ sơ công khai của {user?.full_name || 'Huấn luyện viên'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Public Profile Card Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Hero Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="relative shrink-0">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                alt={user?.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top ring-4 ring-white shadow-md"
              />
              {coach.verification_status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {user?.full_name}
                </h3>
                <CoachBadge coach={coach} />
                {coach.verification_status === 'verified' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Đã xác minh bởi PickleConnect
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{coach.rating_avg.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({coach.review_count} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">DUPR {coach.dupr_level.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{coach.area}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-1">
                Kinh nghiệm: <strong>{coach.experience_years} năm</strong> • Đã dạy: <strong>{coach.total_sessions_taught || coach.students_count || 45} buổi</strong>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Học phí niêm yết</div>
              <div className="text-lg font-black text-slate-900">{coach.price_per_session.toLocaleString('vi-VN')} đ</div>
              <div className="text-[10px] text-emerald-700 font-bold">Bảo hành 100% Love Your Lesson</div>
            </div>
          </div>

          {/* Bio & Teaching Methodology */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Giới thiệu & Phương pháp giảng dạy</h4>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-700">
              <p className="font-medium text-slate-900">{coach.bio}</p>
              {coach.teaching_style && (
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <strong className="text-slate-800">Phương pháp: </strong>
                  {coach.teaching_style}
                </div>
              )}
            </div>
          </div>

          {/* Specialties / Skills */}
          {coach.specialties && coach.specialties.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Kỹ năng thế mạnh (Specialties)</h4>
              <div className="flex flex-wrap gap-1.5">
                {coach.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold rounded-xl">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Familiar Courts */}
          {coach.courts && coach.courts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sân tập thường xuyên</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coach.courts.map((court, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{court}</span>
                    {i === 0 && <span className="ml-auto text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">Sân chính</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications with Verified Badges */}
          {coach.certifications && coach.certifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Chứng chỉ & Bằng cấp đã xác thực</h4>
              <div className="space-y-2">
                {coach.certifications.map(cert => (
                  <div key={cert.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">{cert.title}</div>
                        <div className="text-[11px] text-slate-500">{cert.issuer} • Cấp năm {cert.year}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                      ✓ Đã xác minh
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Preview if available */}
          {coach.video_intro_url && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Video giới thiệu kỹ thuật</h4>
              <div className="p-3 bg-slate-900 rounded-2xl text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Video thực hành & thị phạm bài tập</span>
                </div>
                <a
                  href={coach.video_intro_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] transition"
                >
                  Xem video ↗
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">
            Học viên sẽ đặt lịch thông qua nút <strong>Đặt Buổi Học</strong> trên card này.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Đóng xem trước
          </button>
        </div>

      </div>
    </div>
  );
};
