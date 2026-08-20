import React, { useState } from 'react';
import { 
  UserCheck, Award, Plus, Trash2, CheckCircle2, 
  Clock, ShieldAlert, Sparkles, Image, Video, Save, AlertCircle,
  Eye, Check, MapPin, DollarSign, BookOpen, Layers, ShieldCheck,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certification, LessonPackage } from '../../types';
import { PublicCoachProfilePreviewModal } from './PublicCoachProfilePreviewModal';

export const CoachProfileEditor: React.FC = () => {
  const { currentUser, coaches, updateCoachProfile, users } = useApp();
  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  const coachUser = users.find(u => u.id === coach.user_id) || currentUser;

  // Active section inside Profile Editor
  const [activeSection, setActiveSection] = useState<'basic' | 'bio' | 'specialties' | 'courts' | 'certs' | 'media'>('basic');

  // Form states
  const [bio, setBio] = useState(coach.bio || '');
  const [experienceYears, setExperienceYears] = useState(coach.experience_years || 3);
  const [pricePerSession, setPricePerSession] = useState(coach.price_per_session || 450000);
  const [area, setArea] = useState(coach.area || 'Quận 7, TP.HCM');
  const [teachingStyle, setTeachingStyle] = useState(coach.teaching_style || '');
  const [videoIntroUrl, setVideoIntroUrl] = useState(coach.video_intro_url || '');
  const [duprLevel, setDuprLevel] = useState(coach.dupr_level || 4.5);

  // Specialty & Courts
  const [specialties, setSpecialties] = useState<string[]>(coach.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  
  const [courts, setCourts] = useState<string[]>(coach.courts || []);
  const [newCourt, setNewCourt] = useState('');

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>(coach.certifications || []);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('IPTPA Level 2');
  const [newCertYear, setNewCertYear] = useState(2024);
  const [newCertProof, setNewCertProof] = useState('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600');

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Suggested popular specialties for Pickleball
  const popularSpecialties = [
    'Dinking & Kitchen Control',
    'Third Shot Drop',
    'Serve & Deep Return',
    'Volley & Hand Speed',
    'Chiến thuật Đôi (Doubles Strategy)',
    'Người mới bắt đầu (Beginners)',
    'Luyện thi DUPR (DUPR Prep)',
    'Footwork & Court Coverage'
  ];

  // Suggested popular courts in VN
  const popularCourts = [
    'Sân Pickleball Sala, TP. Thủ Đức',
    'Sân Saigon South Q7, TP.HCM',
    'Sân Pickleball D-Joy Cầu Giấy, Hà Nội',
    'Sân Pickleball Lan Anh, Q10, TP.HCM',
    'Sân V-Pickleball Thảo Điền, Q2'
  ];

  // Calculate Completeness
  let completeness = 40;
  if (bio.length > 50) completeness += 15;
  if (specialties.length >= 3) completeness += 15;
  if (courts.length >= 1) completeness += 10;
  if (certifications.length >= 1) completeness += 10;
  if (videoIntroUrl.length > 5) completeness += 10;

  const handleAddSpecialty = (item?: string) => {
    const specToAdd = item || newSpecialty.trim();
    if (specToAdd && !specialties.includes(specToAdd)) {
      setSpecialties([...specialties, specToAdd]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialties(specialties.filter(s => s !== spec));
  };

  const handleAddCourt = (courtName?: string) => {
    const courtToAdd = courtName || newCourt.trim();
    if (courtToAdd && !courts.includes(courtToAdd)) {
      setCourts([...courts, courtToAdd]);
      setNewCourt('');
    }
  };

  const handleRemoveCourt = (court: string) => {
    setCourts(courts.filter(c => c !== court));
  };

  const handleAddCert = () => {
    if (!newCertTitle.trim()) return;
    const newCert: Certification = {
      id: 'cert_' + Date.now(),
      title: newCertTitle,
      issuer: newCertIssuer,
      year: newCertYear,
      proof_url: newCertProof,
      verified: coach.verification_status === 'verified'
    };
    setCertifications([...certifications, newCert]);
    setNewCertTitle('');
  };

  const handleRemoveCert = (id: string) => {
    setCertifications(certifications.filter(c => c !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCoachProfile(coach.id, {
      bio,
      experience_years: Number(experienceYears),
      price_per_session: Number(pricePerSession),
      area,
      teaching_style: teachingStyle,
      video_intro_url: videoIntroUrl,
      dupr_level: Number(duprLevel),
      specialties,
      courts,
      certifications
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER & PREVIEW BUTTON */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Coach Profile & Verification
            </span>
            <span className="text-xs text-slate-400 font-medium">Hồ Sơ Chuyên Môn & Chứng Chỉ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chỉnh Sửa Hồ Sơ Huấn Luyện Viên
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Hồ sơ đầy đủ, có video thị phạm và chứng chỉ IPTPA/PPR giúp bạn tăng 3x tỷ lệ học viên đặt lịch.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Xem Profile Công Khai</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>

      {/* SAVE TOAST */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-lg animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>✓ Đã lưu hồ sơ thành công! Dữ liệu hiển thị công khai trên Marketplace ngay lập tức.</span>
        </div>
      )}

      {/* PROFILE COMPLETENESS PROGRESS BAR (Section 30) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Độ Hoàn Thiện Hồ Sơ (Profile Completeness)
            </h3>
          </div>
          <span className="text-sm font-black text-purple-900">{completeness}% Hoàn tất</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>

        {/* Checklist of Completeness */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
          <div className={`flex items-center gap-1.5 ${bio.length > 50 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span>{bio.length > 50 ? '✓' : '○'}</span>
            <span>Tiểu sử chi tiết</span>
          </div>

          <div className={`flex items-center gap-1.5 ${specialties.length >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span>{specialties.length >= 3 ? '✓' : '○'}</span>
            <span>Ít nhất 3 kỹ năng</span>
          </div>

          <div className={`flex items-center gap-1.5 ${certifications.length >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span>{certifications.length >= 1 ? '✓' : '○'}</span>
            <span>Bằng cấp & Chứng chỉ</span>
          </div>

          <div className={`flex items-center gap-1.5 ${videoIntroUrl ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span>{videoIntroUrl ? '✓' : '○'}</span>
            <span>Video clip thị phạm</span>
          </div>
        </div>
      </div>

      {/* VERIFICATION BADGE STATUS BANNER */}
      <div className={`rounded-3xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        coach.verification_status === 'verified'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : coach.verification_status === 'pending'
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-rose-50 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center gap-3">
          {coach.verification_status === 'verified' ? (
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : coach.verification_status === 'pending' ? (
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span>Trạng thái kiểm định:</span>
              <span className="font-bold">
                {coach.verification_status === 'verified' ? 'Đã Xác Thực (Tick Xanh Chính Thức)' : coach.verification_status === 'pending' ? 'Đang Chờ Admin Phê Duyệt' : 'Bị Từ Chối'}
              </span>
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {coach.verification_status === 'verified'
                ? 'Hồ sơ và bằng cấp của bạn đã được Admin phê duyệt. Bạn được xếp hạng ưu tiên trên Marketplace.'
                : 'Ban quản trị đang thẩm định bằng cấp & minh chứng trong vòng 24h làm việc.'}
            </p>
          </div>
        </div>

        {coach.verification_status === 'verified' && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300 self-start sm:self-auto shrink-0">
            ✓ Top Rated Coach
          </span>
        )}
      </div>

      {/* SECTIONED PROFILE FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
        
        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-4 text-xs font-bold">
          {[
            { id: 'basic', label: '1. Cơ Bản & DUPR' },
            { id: 'bio', label: '2. Tiểu Sử & Phương Pháp' },
            { id: 'specialties', label: '3. Kỹ Năng Thế Mạnh' },
            { id: 'courts', label: '4. Sân Tập Thường Xuyên' },
            { id: 'certs', label: '5. Chứng Chỉ & Bằng Cấp' },
            { id: 'media', label: '6. Học Phí & Video' }
          ].map(sec => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: BASIC INFO & DUPR */}
        {activeSection === 'basic' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900">Thông Tin Cơ Bản & Trình Độ DUPR</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Họ và tên HLV (Khóa theo tài khoản):</label>
                <input
                  type="text"
                  value={coachUser?.full_name || 'Huấn luyện viên'}
                  disabled
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Điểm trình DUPR chính thức:</label>
                <input
                  type="number"
                  step="0.1"
                  min="2.0"
                  max="6.0"
                  value={duprLevel}
                  onChange={(e) => setDuprLevel(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[11px] text-slate-400">Ví dụ: 4.5 hoặc 5.0 theo bảng điểm DUPR Quốc tế</div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Khu vực hoạt động chính:</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="VD: Quận 7 & TP. Thủ Đức, TP.HCM"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Số năm kinh nghiệm huấn luyện:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: BIO & TEACHING STYLE */}
        {activeSection === 'bio' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900">Tiểu Sử Chuyên Môn & Triết Lý Huấn Luyện</h3>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Giới thiệu bản thân (Bio):</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Chia sẻ về thành tích thi đấu, phong cách giảng dạy và lý do học viên nên đồng hành cùng bạn..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <div className="text-[11px] text-slate-400">Tối thiểu 50 ký tự để đạt điểm hoàn thiện hồ sơ.</div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Phương pháp & Triết lý giảng dạy (Teaching Methodology):</label>
              <textarea
                value={teachingStyle}
                onChange={(e) => setTeachingStyle(e.target.value)}
                rows={3}
                placeholder="VD: Tập trung chỉnh sửa bộ chân và độ mở vợt; phân tích video quay chậm sau mỗi 30 phút..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>
        )}

        {/* SECTION 3: SPECIALTIES (INTERACTIVE CHIPS) */}
        {activeSection === 'specialties' && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900">Kỹ Năng Thế Mạnh (Specialties)</h3>
              <p className="text-slate-500 text-[11px]">Học viên tìm kiếm HLV theo các kỹ năng này trên bộ lọc Marketplace.</p>
            </div>

            {/* Current Selected Chips */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Kỹ năng đang hiển thị ({specialties.length}):</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[50px]">
                {specialties.map(spec => (
                  <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-300">
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      className="hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Nhập kỹ năng khác (vd: Cắt xoáy Forehand)..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={() => handleAddSpecialty()}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                + Thêm
              </button>
            </div>

            {/* Popular Suggestions Chips */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-slate-500">Gợi ý kỹ năng phổ biến (Bấm để thêm nhanh):</label>
              <div className="flex flex-wrap gap-1.5">
                {popularSpecialties.filter(s => !specialties.includes(s)).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSpecialty(s)}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 rounded-xl text-slate-700 font-medium transition cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: COURTS */}
        {activeSection === 'courts' && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900">Sân Tập Thường Xuyên (Venues)</h3>
              <p className="text-slate-500 text-[11px]">Danh sách các cụm sân bạn nhận hướng dẫn trực tiếp.</p>
            </div>

            {/* Selected Courts */}
            <div className="space-y-2">
              {courts.map((court, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">{court}</span>
                    {i === 0 && <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">Sân chính</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourt(court)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Court */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
                placeholder="Nhập tên sân và địa chỉ..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={() => handleAddCourt()}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                + Thêm sân
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-slate-500">Sân tập đối tác phổ biến:</label>
              <div className="flex flex-wrap gap-1.5">
                {popularCourts.filter(c => !courts.includes(c)).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleAddCourt(c)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-medium transition cursor-pointer"
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: CERTIFICATIONS */}
        {activeSection === 'certs' && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900">Bằng Cấp & Chứng Chỉ Quốc Tế</h3>
              <p className="text-slate-500 text-[11px]">Chứng chỉ được Admin đối soát xác thực để cấp huy hiệu Tick Xanh.</p>
            </div>

            {/* Certs List */}
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{cert.title}</div>
                      <div className="text-slate-500 text-[11px]">{cert.issuer} • Cấp năm {cert.year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      ✓ Đã xác minh
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Certification Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800">Thêm bằng cấp / chứng chỉ mới:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  placeholder="Tên chứng chỉ (vd: IPTPA Level 2)..."
                  className="p-2.5 bg-white border border-slate-200 rounded-xl"
                />

                <select
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium"
                >
                  <option value="IPTPA">IPTPA (International Pickleball Teaching)</option>
                  <option value="PPR">PPR (Professional Pickleball Registry)</option>
                  <option value="VPA">VPA - Liên đoàn Pickleball VN</option>
                  <option value="USAPA">USA Pickleball Association</option>
                </select>

                <input
                  type="number"
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(Number(e.target.value))}
                  placeholder="Năm cấp (2024)..."
                  className="p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={handleAddCert}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                + Lưu Chứng Chỉ Vào Hồ Sơ
              </button>
            </div>
          </div>
        )}

        {/* SECTION 6: PRICING & VIDEO */}
        {activeSection === 'media' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900">Học Phí & Video Giới Thiệu</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Học phí niêm yết 1 buổi (VNĐ / Buổi):</label>
                <input
                  type="number"
                  step="50000"
                  value={pricePerSession}
                  onChange={(e) => setPricePerSession(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[11px] text-slate-400">
                  HLV thực nhận: <strong>{Math.round(pricePerSession * 0.9).toLocaleString('vi-VN')} đ</strong> (sau 10% phí sàn bảo chứng)
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Link video clip thị phạm kỹ thuật (YouTube / Drive):</label>
                <input
                  type="url"
                  value={videoIntroUrl}
                  onChange={(e) => setVideoIntroUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
                <div className="text-[11px] text-slate-400">Video giúp học viên tin tưởng và đánh giá phong thái của HLV</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước profile công khai</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
          >
            Lưu Toàn Bộ Hồ Sơ
          </button>
        </div>

      </form>

      {/* PUBLIC PREVIEW MODAL */}
      {isPreviewOpen && (
        <PublicCoachProfilePreviewModal
          coach={coach}
          user={coachUser}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

    </div>
  );
};
