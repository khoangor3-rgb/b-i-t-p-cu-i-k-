import React, { useState } from 'react';
import { 
  X, CheckCircle2, Star, MapPin, Award, Play, 
  Calendar, Clock, ShieldCheck, Check, Sparkles, AlertCircle, Send, Lock,
  ChevronRight, Heart, FileText, ChevronDown, ChevronUp, Download, Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile, CoachPackage, AvailabilitySlot } from '../../types';
import { EscrowPaymentModal } from './EscrowPaymentModal';

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
  const { users, slots, reviews, createBooking, isCoachWishlisted, toggleWishlist, currentUser } = useApp();
  const coachUser = users.find(u => u.id === coach.user_id);
  const isFavorited = isCoachWishlisted ? isCoachWishlisted(coach.id) : false;

  // Available slots for this coach
  const coachSlots = slots.filter(s => s.coach_id === coach.id && !s.is_booked);
  
  // Coach reviews
  const coachReviews = reviews.filter(r => r.coach_id === coach.id && !r.is_hidden);

  // Selected package / service
  const [selectedPackage, setSelectedPackage] = useState<CoachPackage>(coach.packages[0] || {
    id: 'default',
    title: 'Buổi Học Đơn (1 buổi)',
    sessions: 1,
    discount_percent: 0,
    description: '1 buổi huấn luyện 1-1 chuyên sâu'
  });

  // Selected slot & court
  const [selectedSlotId, setSelectedSlotId] = useState<string>(coachSlots[0]?.id || '');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<string>(coach.courts[0] || 'Sân tiêu chuẩn');
  
  // Modals & Certificate preview
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<{ title: string; issuer: string; year: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);

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

  const selectedSlotObj = coachSlots.find(s => s.id === selectedSlotId) || displayedSlots[0];

  const handleOpenPaymentStep = () => {
    setErrorMsg('');
    const slotIdToUse = selectedSlotId || displayedSlots[0]?.id;
    if (!slotIdToUse) {
      setErrorMsg('Hiện tại HLV chưa có khung giờ rảnh nào khả dụng!');
      return;
    }
    if (!selectedSlotId && displayedSlots.length > 0) {
      setSelectedSlotId(displayedSlots[0].id);
    }
    setIsEscrowModalOpen(true);
  };

  const handleConfirmEscrowPayment = (paymentMethod: 'qr_escrow' | 'pickle_wallet' | 'card_visa') => {
    const slotIdToUse = selectedSlotId || displayedSlots[0]?.id;
    if (!slotIdToUse) {
      setErrorMsg('Vui lòng chọn khung giờ học!');
      setIsEscrowModalOpen(false);
      return;
    }

    const res = createBooking({
      coachId: coach.id,
      slotId: slotIdToUse,
      packageTitle: selectedPackage.title,
      sessionCount: selectedPackage.sessions,
      totalPrice: finalPrice,
      notes: notes.trim() ? `[Sân: ${selectedCourt}] ${notes.trim()}` : `[Sân: ${selectedCourt}] Mục tiêu: Nâng cao kỹ thuật thi đấu`,
      paymentMethod
    });

    if (res.success) {
      setIsEscrowModalOpen(false);
      onBookingSuccess();
      onClose();
    } else {
      setIsEscrowModalOpen(false);
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* 1. HERO HEADER */}
        <div className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-7 border-b border-emerald-900/40">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={coachUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'}
                  alt={coachUser?.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top ring-4 ring-white/20 shadow-lg"
                />
                {coach.video_intro_url && (
                  <button
                    type="button"
                    onClick={() => onWatchVideo(coach.video_intro_url!, coachUser?.full_name || 'HLV')}
                    className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded-full shadow-md transition flex items-center justify-center cursor-pointer"
                    title="Xem Video giới thiệu phương pháp"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black">{coachUser?.full_name}</h2>
                  {coach.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã Xác Thực
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/90 mb-2 flex-wrap font-medium">
                  <span className="bg-emerald-800/80 px-2.5 py-0.5 rounded-md font-bold text-white">
                    DUPR {coach.dupr_level.toFixed(1)} {coach.dupr_level >= 5.0 ? 'Master' : 'Pro'}
                  </span>
                  <span>•</span>
                  <span>{coach.experience_years} năm đào tạo</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {coach.area}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{coach.rating_avg > 0 ? coach.rating_avg.toFixed(1) : '5.0'}</span>
                  </div>
                  <span className="text-slate-300">({coachReviews.length} đánh giá học viên)</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-300 font-bold">{coach.students_count} học viên đã học</span>
                </div>
              </div>
            </div>

            {/* Actions: Wishlist & Close */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleWishlist(coach.id)}
                className={`p-2 rounded-full transition cursor-pointer ${
                  isFavorited ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isFavorited ? 'Bỏ lưu yêu thích' : 'Lưu vào danh sách yêu thích'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          
          {/* "Why this coach may be right for you" Highlight Box */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 p-4 rounded-2xl border border-emerald-200/80">
            <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Tại sao HLV {coachUser?.full_name} phù hợp với bạn?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                <span>Giảng dạy từ Cơ bản đến Nâng cao (DUPR 2.0 - 4.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                <span>Thế mạnh kỹ thuật: {coach.specialties.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                <span>Đạt chứng nhận {coach.certifications[0]?.title || 'IPTPA Certified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                <span>Bảo đảm đổi HLV theo chính sách Love Your Lesson</span>
              </div>
            </div>
          </div>

          {/* Coach Trust Stack & Certifications */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Hồ Sơ Năng Lực & Bằng Cấp Đã Được Thẩm Định</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coach.certifications.map((cert, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCertForPreview(cert)}
                  className="bg-slate-50 hover:bg-emerald-50/40 p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">{cert.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">Cấp bởi {cert.issuer} • Năm {cert.year}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Xem bằng
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio & Specialties */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Giới thiệu & Triết lý huấn luyện</h3>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {coach.bio}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {coach.specialties.map((spec, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-semibold border border-slate-200">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Availability Slot Picker */}
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Khung Giờ Rảnh Của HLV (Chọn để đặt lịch)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn khung giờ trống phù hợp với thời gian biểu của bạn
                </p>
              </div>

              {/* Date Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedDateFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedDateFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ngày
                </button>
                {uniqueDates.slice(0, 4).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDateFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedDateFilter === d
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {displayedSlots.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                <Clock className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                <p className="font-semibold">Chưa có khung giờ rảnh vào ngày đã chọn.</p>
                <p className="mt-0.5">Vui lòng chọn ngày khác hoặc liên hệ bộ phận CSKH để hỗ trợ xếp lịch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {displayedSlots.map((slot, sIdx) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={`${slot.id}_${sIdx}`}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className={`text-[10px] font-bold mb-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {slot.date}
                      </div>
                      <div className="text-xs font-black">
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-emerald-100' : 'text-emerald-700'}`}>
                        Khả dụng
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Package Selection */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Chọn gói dịch vụ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {coach.packages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{pkg.title}</span>
                      {pkg.discount_percent > 0 && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                          -{pkg.discount_percent}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{pkg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Court & Goals Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Địa điểm / Sân tập ưu tiên</label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none font-medium cursor-pointer"
              >
                {coach.courts.map((court, i) => (
                  <option key={i} value={court}>{court}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Ghi chú mục tiêu học tập (Tùy chọn)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Cải thiện cú thả bóng 3rd shot drop..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Student Reviews & Ratings */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Đánh Giá Thực Tế Từ Học Viên ({coachReviews.length})</span>
            </h3>

            {coachReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                Chưa có đánh giá nào cho Huấn luyện viên này.
              </p>
            ) : (
              <div className="space-y-3">
                {coachReviews.slice(0, 3).map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{rev.student_name}</span>
                        <span className="text-[10px] text-slate-400">• {rev.created_at}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 text-xs italic">"{rev.comment}"</p>
                    {rev.coach_reply && (
                      <div className="mt-2 pl-3 py-1 border-l-2 border-emerald-500 bg-white/80 rounded-r-lg text-[11px] text-emerald-900">
                        <span className="font-bold">HLV phản hồi:</span> {rev.coach_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* 3. STICKY BOOKING SUMMARY FOOTER */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tổng thanh toán:</span>
              {selectedPackage.discount_percent > 0 && (
                <span className="text-xs line-through text-slate-400 font-medium">
                  {rawTotal.toLocaleString('vi-VN')} đ
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {finalPrice.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo chứng an toàn Escrow • Hoàn tiền nếu không hài lòng</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              id="btn-proceed-escrow-booking"
              onClick={handleOpenPaymentStep}
              className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Tiếp Tục Đặt Lịch ({selectedSlotObj ? `${selectedSlotObj.date} ${selectedSlotObj.start_time}` : 'Chọn giờ'})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Escrow Modal Step */}
      {isEscrowModalOpen && (
        <EscrowPaymentModal
          isOpen={isEscrowModalOpen}
          coach={coach}
          coachUser={coachUser}
          packageTitle={selectedPackage.title}
          sessionCount={selectedPackage.sessions}
          totalPrice={finalPrice}
          slotDate={selectedSlotObj?.date || 'Hôm nay'}
          slotTime={`${selectedSlotObj?.start_time || '08:00'} - ${selectedSlotObj?.end_time || '09:00'}`}
          courtName={selectedCourt}
          onClose={() => setIsEscrowModalOpen(false)}
          onConfirmPayment={handleConfirmEscrowPayment}
        />
      )}

      {/* Certificate Viewer Modal */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-9 h-9 text-emerald-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Chứng chỉ đã được Admin xác thực
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">{selectedCertForPreview.title}</h3>
              <p className="text-xs text-slate-600 mt-1">
                Đơn vị cấp bằng: <strong>{selectedCertForPreview.issuer}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Năm cấp chứng nhận: {selectedCertForPreview.year}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block mr-1" />
              Bằng cấp đã được đối chiếu trực tiếp với tổ chức cấp bằng quốc tế.
            </div>
            <button
              type="button"
              onClick={() => setSelectedCertForPreview(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Đóng xem chứng chỉ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
