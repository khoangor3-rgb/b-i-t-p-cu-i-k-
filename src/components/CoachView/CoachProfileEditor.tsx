import React, { useState } from 'react';
import { 
  UserCheck, Award, Plus, Trash2, CheckCircle2, 
  Clock, ShieldAlert, Sparkles, Image, Video, Save, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certification, LessonPackage } from '../../types';

export const CoachProfileEditor: React.FC = () => {
  const { currentUser, coaches, updateCoachProfile } = useApp();
  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];

  const [bio, setBio] = useState(coach.bio);
  const [experienceYears, setExperienceYears] = useState(coach.experience_years);
  const [pricePerSession, setPricePerSession] = useState(coach.price_per_session);
  const [area, setArea] = useState(coach.area);
  const [teachingStyle, setTeachingStyle] = useState(coach.teaching_style || '');
  const [videoIntroUrl, setVideoIntroUrl] = useState(coach.video_intro_url || '');
  const [duprLevel, setDuprLevel] = useState(coach.dupr_level);

  // Specialty & Courts
  const [specialties, setSpecialties] = useState<string[]>(coach.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  
  const [courts, setCourts] = useState<string[]>(coach.courts || []);
  const [newCourt, setNewCourt] = useState('');

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>(coach.certifications || []);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('IPTPA');
  const [newCertYear, setNewCertYear] = useState(2024);
  const [newCertProof, setNewCertProof] = useState('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600');

  // Success message
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialties(specialties.filter(s => s !== spec));
  };

  const handleAddCourt = () => {
    if (newCourt.trim() && !courts.includes(newCourt.trim())) {
      setCourts([...courts, newCourt.trim()]);
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
    setCertifications(certifications.filter(c => c.id !== id));
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
      {/* Verification Status Banner */}
      <div className={`rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        coach.verification_status === 'verified'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : coach.verification_status === 'pending'
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}>
        <div className="flex items-center gap-3">
          {coach.verification_status === 'verified' ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : coach.verification_status === 'pending' ? (
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="text-sm font-black flex items-center gap-2">
              <span>Trạng thái hồ sơ:</span>
              <span className="uppercase tracking-wider">
                {coach.verification_status === 'verified' ? 'Đã Xác Thực (Tick Xanh)' : coach.verification_status === 'pending' ? 'Đang Chờ Admin Kiểm Duyệt' : 'Bị Từ Chối'}
              </span>
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {coach.verification_status === 'verified' 
                ? 'Hồ sơ và chứng chỉ của bạn đã được Admin phê duyệt, hiển thị công khai trên danh sách tìm kiếm.'
                : 'Ban quản trị đang thẩm định bằng cấp & minh chứng của bạn trong vòng 24h.'}
            </p>
            {coach.rejection_reason && (
              <p className="text-xs text-red-700 font-bold mt-1">Lý do từ chối: {coach.rejection_reason}</p>
            )}
          </div>
        </div>

        {coach.verification_status === 'pending' && (
          <span className="text-xs bg-amber-200 text-amber-950 font-bold px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
            Hàng đợi kiểm duyệt
          </span>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Hồ sơ huấn luyện viên đã được cập nhật thành công!</span>
        </div>
      )}

      {/* Form Editor */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Thông Tin Hồ Sơ Chuyên Môn</h2>
            <p className="text-xs text-gray-500">Chuẩn hóa thông tin theo chuẩn Quốc tế & DUPR</p>
          </div>
          
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Hồ Sơ</span>
          </button>
        </div>

        {/* Basic numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Số năm kinh nghiệm giảng dạy</label>
            <input
              type="number"
              min={1}
              max={30}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Trình độ DUPR cá nhân</label>
            <input
              type="number"
              step="0.1"
              min={2.0}
              max={6.5}
              value={duprLevel}
              onChange={(e) => setDuprLevel(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Học phí cơ bản (VNĐ / buổi)</label>
            <input
              type="number"
              step={10000}
              min={100000}
              max={2000000}
              value={pricePerSession}
              onChange={(e) => setPricePerSession(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>
        </div>

        {/* Area & Video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Khu vực hoạt động chính</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="VD: Quận 7 & Quận 2, TP.HCM"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Link Video giới thiệu ("Vet 'Em Video" YouTube Embed)</label>
            <input
              type="url"
              value={videoIntroUrl}
              onChange={(e) => setVideoIntroUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium outline-none"
            />
          </div>
        </div>

        {/* Bio & Teaching philosophy */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Tiểu sử & Thành tích chuyên môn (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phong cách và phương pháp giảng dạy 1-1</label>
            <textarea
              rows={2}
              value={teachingStyle}
              onChange={(e) => setTeachingStyle(e.target.value)}
              placeholder="VD: Phương pháp phân tích video quay chậm, chỉnh lỗi cầm vợt và bài tập thực chiến..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Specialties Tags */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-gray-700">Kỹ năng chuyên sâu đào tạo (Specialties)</label>
          <div className="flex flex-wrap gap-2 items-center">
            {specialties.map(spec => (
              <span key={spec} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-semibold">
                <span>{spec}</span>
                <button type="button" onClick={() => handleRemoveSpecialty(spec)} className="text-emerald-500 hover:text-red-500">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Thêm kỹ năng mới..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Courts List */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-gray-700">Danh sách các sân tập quen thuộc</label>
          <div className="space-y-1.5">
            {courts.map(court => (
              <div key={court} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <span className="font-medium text-gray-800">{court}</span>
                <button type="button" onClick={() => handleRemoveCourt(court)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
                placeholder="Nhập tên sân (VD: Sân PickleClub Sala...)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddCourt}
                className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm sân
              </button>
            </div>
          </div>
        </div>

        {/* Certifications Management */}
        <div className="space-y-3 text-xs border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Bằng cấp & Chứng chỉ huấn luyện</h3>
              <p className="text-gray-500">Admin sẽ kiểm tra ảnh minh chứng trước khi cấp tick xanh</p>
            </div>
          </div>

          <div className="space-y-2">
            {certifications.map(cert => (
              <div key={cert.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{cert.title}</div>
                    <div className="text-gray-500 text-[11px]">{cert.issuer} • Năm {cert.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a href={cert.proof_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline text-[11px]">
                    Xem ảnh chứng chỉ
                  </a>
                  <button type="button" onClick={() => handleRemoveCert(cert.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add certification inline box */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 space-y-2 mt-2">
            <div className="font-bold text-emerald-950 text-xs">Thêm chứng chỉ mới:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newCertTitle}
                onChange={(e) => setNewCertTitle(e.target.value)}
                placeholder="Tên chứng chỉ (VD: IPTPA Level 2)"
                className="bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none"
              />
              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Tổ chức cấp (IPTPA, PPR, VPA...)"
                className="bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(Number(e.target.value))}
                  placeholder="Năm cấp"
                  className="w-24 bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Thêm chứng chỉ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Toàn Bộ Hồ Sơ</span>
          </button>
        </div>
      </form>
    </div>
  );
};
