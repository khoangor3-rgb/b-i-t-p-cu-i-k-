import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MapPin, Award, CheckCircle2, 
  Sparkles, SlidersHorizontal, ArrowUpDown, Shield, ThumbsUp, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile } from '../../types';
import { CoachCard } from './CoachCard';

interface CoachListProps {
  onSelectCoach: (coach: CoachProfile) => void;
  onWatchVideo: (url: string, name: string) => void;
  onOpenSelfAssessment?: () => void;
}

export const CoachList: React.FC<CoachListProps> = ({ onSelectCoach, onWatchVideo, onOpenSelfAssessment }) => {
  const { coaches, users } = useApp();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [priceMax, setPriceMax] = useState<number>(800000);
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'experience'>('recommended');

  // Extract unique areas & specialties for filters
  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    coaches.forEach(c => {
      if (c.area.includes('TP.HCM') || c.area.includes('Q7') || c.area.includes('Q2') || c.area.includes('Thủ Đức') || c.area.includes('Quận 1') || c.area.includes('Tân Bình') || c.area.includes('Phú Nhuận')) areas.add('TP. Hồ Chí Minh');
      if (c.area.includes('Hà Nội') || c.area.includes('Tây Hồ') || c.area.includes('Cầu Giấy') || c.area.includes('Nam Từ Liêm')) areas.add('Hà Nội');
      if (c.area.includes('Đà Nẵng') || c.area.includes('Hải Châu') || c.area.includes('Sơn Trà') || c.area.includes('Ngũ Hành Sơn')) areas.add('Đà Nẵng');
    });
    return Array.from(areas);
  }, [coaches]);

  const allSpecialties = useMemo(() => {
    const specs = new Set<string>();
    coaches.forEach(c => c.specialties.forEach(s => specs.add(s)));
    return Array.from(specs);
  }, [coaches]);

  // Filtered coaches
  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
      const coachUser = users.find(u => u.id === coach.user_id);
      const name = coachUser?.full_name.toLowerCase() || '';
      const bio = coach.bio.toLowerCase();
      const area = coach.area.toLowerCase();
      const query = searchTerm.toLowerCase();

      // Search match
      const matchesSearch = !searchTerm || name.includes(query) || bio.includes(query) || area.includes(query);

      // Area filter
      const matchesArea = selectedArea === 'all' || 
        (selectedArea === 'TP. Hồ Chí Minh' && (coach.area.includes('TP.HCM') || coach.area.includes('Q7') || coach.area.includes('Q2') || coach.area.includes('Thủ Đức') || coach.area.includes('Bình Thạnh') || coach.area.includes('Quận 1') || coach.area.includes('Tân Bình') || coach.area.includes('Nhà Bè'))) ||
        (selectedArea === 'Hà Nội' && (coach.area.includes('Hà Nội') || coach.area.includes('Tây Hồ') || coach.area.includes('Cầu Giấy') || coach.area.includes('Nam Từ Liêm') || coach.area.includes('Ba Đình'))) ||
        (selectedArea === 'Đà Nẵng' && (coach.area.includes('Đà Nẵng') || coach.area.includes('Hải Châu') || coach.area.includes('Sơn Trà') || coach.area.includes('Ngũ Hành Sơn')));

      // Price filter
      const matchesPrice = coach.price_per_session <= priceMax;

      // Rating filter
      const matchesRating = minRating === 0 || coach.rating_avg >= minRating;

      // Verified filter
      const matchesVerified = !verifiedOnly || coach.verification_status === 'verified';

      // Specialty filter
      const matchesSpecialty = selectedSpecialty === 'all' || coach.specialties.includes(selectedSpecialty);

      return matchesSearch && matchesArea && matchesPrice && matchesRating && matchesVerified && matchesSpecialty;
    }).sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.rating_avg - a.rating_avg;
      }
      if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
      if (sortBy === 'price_asc') return a.price_per_session - b.price_per_session;
      if (sortBy === 'price_desc') return b.price_per_session - a.price_per_session;
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      return 0;
    });
  }, [coaches, users, searchTerm, selectedArea, priceMax, minRating, verifiedOnly, selectedSpecialty, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setPriceMax(800000);
    setMinRating(0);
    setVerifiedOnly(false);
    setSelectedSpecialty('all');
    setSortBy('recommended');
  };

  return (
    <div className="space-y-6">
      {/* Hero / Value Proposition Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 top-6 opacity-10 hidden lg:block">
          <Award className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            Nền tảng HLV Pickleball số 1 Việt Nam
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Tìm Huấn Luyện Viên Pickleball <br className="hidden sm:inline" />
            <span className="text-emerald-400">Đã Xác Thực Chứng Chỉ & Chuẩn DUPR</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
            Giải quyết triệt để nỗi lo HLV không rõ nguồn gốc trên MXH. 100% hồ sơ tại PickleConnect được Admin kiểm duyệt bằng cấp IPTPA/PPR, đánh giá công khai minh bạch và bảo đảm hoàn tiền <strong>Love Your Lesson</strong>.
          </p>

          {/* Quick Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center px-3 py-2 text-gray-800 gap-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên HLV, kỹ thuật Dinking, Reset, khu vực..."
                className="w-full text-sm outline-none placeholder:text-gray-400 text-gray-900"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs sm:text-sm text-gray-700 bg-transparent outline-none font-medium cursor-pointer"
              >
                <option value="all">Toàn quốc</option>
                {allAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {}}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-md shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-emerald-700/50 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bằng cấp IPTPA / PPR chuẩn hóa</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chính sách đổi HLV nếu không hài lòng</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <ThumbsUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đánh giá thật 100% từ học viên đã học</span>
            </div>
          </div>
        </div>
      </div>

      {/* DUPR Skill Level Self-Assessment Banner for All Students */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Dành Cho Học Viên Mới
              </span>
              <span className="text-emerald-300 text-xs font-semibold">Chưa biết điểm DUPR của mình?</span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
              Chấm Trình Độ DUPR Nhanh • Chuẩn Quốc Tế
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Khảo sát 6 kỹ năng Serve, Dinking, 3rd Drop, Volley, Footwork và Chiến Thuật để nhận xếp hạng DUPR và gợi ý HLV phù hợp.
            </p>
          </div>
        </div>

        {onOpenSelfAssessment && (
          <button
            onClick={onOpenSelfAssessment}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Chấm Trình Độ Ngay</span>
          </button>
        )}
      </div>

      {/* Filter & Toolbar Area */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Bộ lọc:</span>
            </div>

            {/* Verified Only Toggle */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border ${
                verifiedOnly 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-emerald-600' : 'text-gray-400'}`} />
              Đã xác thực chứng chỉ
            </button>

            {/* Specialty select */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs rounded-xl border border-gray-200 font-medium outline-none cursor-pointer"
            >
              <option value="all">Kỹ năng đào tạo: Tất cả</option>
              {allSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Rating select */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs rounded-xl border border-gray-200 font-medium outline-none cursor-pointer"
            >
              <option value={0}>Đánh giá sao: Tất cả</option>
              <option value={4.5}>⭐ Từ 4.5 sao trở lên</option>
              <option value={4.8}>⭐ Từ 4.8 sao trở lên</option>
            </select>

            {/* Price Max slider popup/inline */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
              <span className="text-gray-500">Giá dưới:</span>
              <span className="font-bold text-gray-800">{(priceMax / 1000).toLocaleString('vi-VN')}k</span>
              <input
                type="range"
                min="200000"
                max="800000"
                step="50000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-20 accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Reset button */}
            {(searchTerm || selectedArea !== 'all' || priceMax < 800000 || minRating > 0 || verifiedOnly || selectedSpecialty !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Xóa lọc
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center justify-end gap-2 border-t lg:border-t-0 pt-2 lg:pt-0">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sắp xếp:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 outline-none cursor-pointer"
            >
              <option value="recommended">Đề xuất hàng đầu</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price_asc">Học phí: Thấp đến Cao</option>
              <option value="price_desc">Học phí: Cao đến Thấp</option>
              <option value="experience">Kinh nghiệm nhiều năm nhất</option>
            </select>
          </div>

        </div>
      </div>

      {/* Coaches Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Danh sách Huấn Luyện Viên</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredCoaches.length} HLV
            </span>
          </h2>
          <span className="text-xs text-gray-500">
            Hiển thị theo dữ liệu thời gian thực
          </span>
        </div>

        {filteredCoaches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Không tìm thấy Huấn luyện viên phù hợp</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
              Hãy thử điều chỉnh lại mức giá, khu vực hoặc xóa bộ lọc để xem thêm các huấn luyện viên khác.
            </p>
            <button
              onClick={resetFilters}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map(coach => {
              const coachUser = users.find(u => u.id === coach.user_id);
              return (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  coachUser={coachUser}
                  onSelectCoach={onSelectCoach}
                  onWatchVideo={onWatchVideo}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
