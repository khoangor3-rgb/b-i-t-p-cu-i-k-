import React, { useState } from 'react';
import { 
  X, CheckCircle2, Star, MapPin, Award, Play, 
  Calendar, Clock, ShieldCheck, Check, Sparkles, AlertCircle, Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile, LessonPackage, AvailabilitySlot } from '../../types';

interface CoachDetailModalProps {
  coach: CoachProfile;
  onClose: () => void;
  onWatchVideo: (url: string, name: string) => void;
  onBookingSuccess: () => void;
}

export const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  coach,
  onClose,
  onWatchVideo,
  onBookingSuccess
}) => {
  const { users, slots, reviews, createBooking } = useApp();
  const coachUser = users.find(u => u.id === coach.user_id);

  // Available slots for this coach
  const coachSlots = slots.filter(s => s.coach_id === coach.id && !s.is_booked);
  
  // Coach reviews
  const coachReviews = reviews.filter(r => r.coach_id === coach.id && !r.is_hidden);

  // Selected package
  const [selectedPackage, setSelectedPackage] = useState<LessonPackage>(coach.packages[0] || {
    id: 'default',
    title: 'Buổi Học Đơn (1 buổi)',
    sessions: 1,
    discount_percent: 0,
    description: '1 buổi huấn luyện 1-1 chuyên sâu'
  });

  // Selected slot
  const [selectedSlotId, setSelectedSlotId] = useState<string>(coachSlots[0]?.id || '');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<string>(coach.courts[0] || 'Sân tiêu chuẩn');
  
  // Status message
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const basePricePerSession = coach.price_per_session;
  const rawTotal = basePricePerSession * selectedPackage.sessions;
  const discountAmount = (rawTotal * selectedPackage.discount_percent) / 100;
  const finalPrice = rawTotal - discountAmount;

  // Filter slots by date
  const uniqueDates = Array.from(new Set(coachSlots.map(s => s.date))).sort();
  const displayedSlots = selectedDateFilter === 'all' 
    ? coachSlots 
    : coachSlots.filter(s => s.date === selectedDateFilter);

  const handleBookingSubmit = () => {
    setErrorMsg('');
    if (!selectedSlotId) {
      setErrorMsg('Vui lòng chọn một khung giờ rảnh khả dụng của HLV!');
      return;
    }

    setIsSubmitting(true);
    const res = createBooking({
      coachId: coach.id,
      slotId: selectedSlotId,
      packageTitle: selectedPackage.title,
      sessionCount: selectedPackage.sessions,
      totalPrice: finalPrice,
      notes: notes.trim() ? `[Sân: ${selectedCourt}] ${notes.trim()}` : `[Sân: ${selectedCourt}] Mục tiêu: Nâng cao kỹ thuật thi đấu`,
    });

    setIsSubmitting(false);
    if (res.success) {
      onBookingSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Background Accent */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={coachUser?.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              {coach.video_intro_url && (
                <button
                  onClick={() => onWatchVideo(coach.video_intro_url!, coachUser?.full_name || 'HLV')}
                  className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded-full shadow-md transition flex items-center justify-center cursor-pointer"
                  title="Xem Video giới thiệu"
                >
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black">{coachUser?.full_name}</h2>
                {coach.verification_status === 'verified' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    Đã kiểm duyệt chứng chỉ
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 mb-2">
                <span className="font-bold bg-white/15 px-2 py-0.5 rounded text-white">DUPR {coach.dupr_level.toFixed(1)} Pro</span>
                <span>•</span>
                <span>{coach.experience_years} năm kinh nghiệm</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  {coach.area}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{coach.rating_avg.toFixed(1)}</span>
                  <span>({coach.review_count} đánh giá)</span>
                </div>
                <span className="text-emerald-200">{coach.students_count} học viên đã hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Policy Banner */}
          <div className="mt-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-100">
                <strong>Cam kết Love Your Lesson Guarantee:</strong> Nếu buổi học đầu tiên không làm bạn hài lòng 100%, PickleConnect sẽ đổi HLV khác hoặc hoàn học phí.
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/30 font-bold px-2 py-0.5 rounded text-emerald-200 uppercase tracking-wider shrink-0">
              Bảo hành 100%
            </span>
          </div>
        </div>

        {/* Modal Body - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Bio, Certifications, Specialties, Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Giới thiệu & Triết lý dạy */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400 mb-2">
                Giới thiệu & Triết lý giảng dạy
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {coach.bio}
              </p>
            </div>

            {/* Phong cách đào tạo */}
            {coach.teaching_style && (
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
                <div className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Phương pháp hướng dẫn 1-1:
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {coach.teaching_style}
                </p>
              </div>
            )}

            {/* Bằng cấp & Chứng chỉ */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                <span>Bằng cấp & Chứng chỉ huấn luyện ({coach.certifications?.length || 0})</span>
                <span className="text-xs text-emerald-600 font-normal">Đã kiểm duyệt</span>
              </h3>
              <div className="space-y-2">
                {coach.certifications?.map(cert => (
                  <div key={cert.id} className="flex items-start justify-between gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{cert.title}</div>
                        <div className="text-[11px] text-gray-500">{cert.issuer} • Năm {cert.year}</div>
                      </div>
                    </div>
                    {cert.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full shrink-0">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kỹ năng chuyên sâu & Sân quen thuộc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thế mạnh đào tạo</h4>
                <div className="flex flex-wrap gap-1.5">
                  {coach.specialties.map((s, i) => (
                    <span key={i} className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Địa điểm sân tập quen thuộc</h4>
                <div className="space-y-1">
                  {coach.courts.map((court, i) => (
                    <div key={i} className="text-xs text-gray-700 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{court}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Đánh giá từ học viên */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400">
                  Đánh giá minh bạch từ học viên ({coachReviews.length})
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{coach.rating_avg.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {coachReviews.length === 0 ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl">Chưa có đánh giá nào cho HLV này.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {coachReviews.map(rev => (
                    <div key={rev.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img src={rev.student_avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-gray-900">{rev.student_name}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[10px] text-gray-400 ml-2">{rev.created_at}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                      
                      {rev.coach_reply && (
                        <div className="mt-2 pl-3 border-l-2 border-emerald-400 text-emerald-800 bg-emerald-50/50 p-1.5 rounded">
                          <span className="font-bold text-[11px]">Phản hồi từ HLV: </span>
                          <span>{rev.coach_reply}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Interactive Booking Widget (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
            
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Đặt Lịch Học Với HLV</span>
              </h3>

              {/* Step 1: Chọn gói bài học (Packages) */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  1. Chọn gói buổi học
                </label>
                <div className="space-y-2">
                  {coach.packages.map(pkg => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        selectedPackage.id === pkg.id 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{pkg.title}</span>
                          {pkg.discount_percent > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                              selectedPackage.id === pkg.id ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              -{pkg.discount_percent}%
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${selectedPackage.id === pkg.id ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {pkg.description}
                        </div>
                      </div>

                      <div className="text-right pl-2">
                        <div className={`text-xs font-black ${selectedPackage.id === pkg.id ? 'text-white' : 'text-gray-900'}`}>
                          {( (coach.price_per_session * pkg.sessions) * (1 - pkg.discount_percent/100) ).toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Chọn khung giờ rảnh */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    2. Chọn khung giờ rảnh
                  </label>
                  {uniqueDates.length > 0 && (
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="text-[11px] bg-white border border-gray-200 rounded px-1.5 py-0.5 outline-none font-medium cursor-pointer"
                    >
                      <option value="all">Tất cả ngày rảnh</option>
                      {uniqueDates.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  )}
                </div>

                {displayedSlots.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Hiện chưa có khung giờ rảnh nào khả dụng. Vui lòng quay lại sau hoặc liên hệ HLV.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-gray-200">
                    {displayedSlots.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-2 rounded-lg text-left text-xs transition cursor-pointer border ${
                          selectedSlotId === slot.id 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold ring-1 ring-emerald-500' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{slot.date}</div>
                        {slot.court_name && (
                          <div className="text-[9px] text-emerald-700 truncate mt-0.5">{slot.court_name.split('Sân ')[1] || slot.court_name}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Chọn sân & ghi chú */}
              <div className="space-y-2 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Địa điểm sân tập đề xuất</label>
                  <select
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2 font-medium outline-none cursor-pointer"
                  >
                    {coach.courts.map((court, i) => (
                      <option key={i} value={court}>{court}</option>
                    ))}
                    <option value="Sân do học viên chỉ định">Sân do học viên tự sắp xếp / chỉ định</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mục tiêu buổi học / Ghi chú</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="VD: Em muốn chỉnh kỹ thuật Drop shot và kiểm tra DUPR..."
                    rows={2}
                    className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-1.5 mb-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Total Price & Submit Button */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Tổng học phí ({selectedPackage.sessions} buổi):</span>
                {selectedPackage.discount_percent > 0 ? (
                  <div className="text-right">
                    <span className="line-through text-gray-400 mr-1.5">{rawTotal.toLocaleString('vi-VN')}đ</span>
                    <span className="font-extrabold text-emerald-700 text-base">{finalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                ) : (
                  <span className="font-extrabold text-gray-900 text-base">{finalPrice.toLocaleString('vi-VN')}đ</span>
                )}
              </div>

              <button
                type="button"
                disabled={isSubmitting || displayedSlots.length === 0}
                onClick={handleBookingSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 active:scale-98 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Đặt Lịch Học'}</span>
              </button>

              <p className="text-[10px] text-gray-500 text-center mt-2">
                Không cần thanh toán ngay • HLV sẽ xác nhận lịch trong 24h
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
