import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Award, CheckCircle2, 
  Sparkles, SlidersHorizontal, ArrowUpDown, Shield, ThumbsUp, RefreshCw, Zap,
  Star, Tag, X, ChevronDown, Check, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachProfile, SkillLevel } from '../../types';
import { CoachCard } from './CoachCard';

interface CoachListProps {
  onSelectCoach: (coach: CoachProfile) => void;
  onWatchVideo: (url: string, name: string) => void;
  onOpenSelfAssessment?: () => void;
  initialSkillFilter?: string;
}

export const CoachList: React.FC<CoachListProps> = ({ 
  onSelectCoach, 
  onWatchVideo, 
  onOpenSelfAssessment,
  initialSkillFilter 
}) => {
  const { coaches, users, reviews, currentUser } = useApp();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState(initialSkillFilter || '');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | 'all'>('all');
  const [priceMax, setPriceMax] = useState<number>(1000000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDupr, setMinDupr] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSkillFilter || 'all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'dupr_desc' | 'price_asc' | 'price_desc' | 'experience' | 'soonest'>('recommended');
  
  // Drawer Filter Modal
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync if initialSkillFilter passed
  useEffect(() => {
    if (initialSkillFilter) {
      setSelectedSpecialty(initialSkillFilter);
      setSearchTerm(initialSkillFilter);
    }
  }, [initialSkillFilter]);

  // Goal-based quick tags for rapid discovery
  const goalSkills = [
    { label: 'Dink & Kiểm Soát', key: 'Dink' },
    { label: 'Cú Đánh Thứ 3 Drop', key: '3rd Shot' },
    { label: 'Volley & Phản Xạ Lưới', key: 'Volley' },
    { label: 'Chiến Thuật Đánh Đôi', key: 'Chiến thuật' },
    { label: 'Giao Bóng & Trả Sâu', key: 'Giao bóng' },
    { label: 'Di Chuyển Footwork', key: 'Footwork' }
  ];

  // Auto-preselect filter based on student's profile skill_level
  useEffect(() => {
    if (currentUser?.skill_level && selectedSkillLevel === 'all') {
      setSelectedSkillLevel(currentUser.skill_level);
    }
  }, [currentUser]);

  // Extract unique areas
  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    coaches.forEach(c => {
      const areaStr = c.area || '';
      if (areaStr.includes('TP.HCM') || areaStr.includes('Q7') || areaStr.includes('Q2') || areaStr.includes('Thủ Đức') || areaStr.includes('Quận 1') || areaStr.includes('Tân Bình') || areaStr.includes('Phú Nhuận') || areaStr.includes('Bình Thạnh')) areas.add('TP. Hồ Chí Minh');
      if (areaStr.includes('Hà Nội') || areaStr.includes('Tây Hồ') || areaStr.includes('Cầu Giấy') || areaStr.includes('Nam Từ Liêm') || areaStr.includes('Ba Đình')) areas.add('Hà Nội');
      if (areaStr.includes('Đà Nẵng') || areaStr.includes('Hải Châu') || areaStr.includes('Sơn Trà') || areaStr.includes('Ngũ Hành Sơn')) areas.add('Đà Nẵng');
    });
    return Array.from(areas);
  }, [coaches]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== 'all') count++;
    if (selectedSkillLevel !== 'all') count++;
    if (priceMax < 1000000) count++;
    if (minRating > 0) count++;
    if (minDupr > 0) count++;
    if (verifiedOnly) count++;
    if (selectedSpecialty !== 'all') count++;
    if (searchTerm) count++;
    return count;
  }, [selectedArea, selectedSkillLevel, priceMax, minRating, minDupr, verifiedOnly, selectedSpecialty, searchTerm]);

  // Filtered coaches
  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
      const coachUser = coach.user || users.find(u => u.id === coach.user_id);
      const name = (coachUser?.full_name || '').toLowerCase();
      const bio = (coach.bio || '').toLowerCase();
      const area = (coach.area || '').toLowerCase();
      const certsText = (coach.certifications || []).map(c => ((c?.title || '') + ' ' + (c?.issuer || '')).toLowerCase()).join(' ');
      const query = (searchTerm || '').trim().toLowerCase();

      // Search match
      const matchesSearch = !query || 
        name.includes(query) || 
        bio.includes(query) || 
        area.includes(query) ||
        certsText.includes(query) ||
        (coach.specialties || []).some(s => (s || '').toLowerCase().includes(query));

      // Area filter
      const coachArea = coach.area || '';
      const matchesArea = selectedArea === 'all' || 
        (selectedArea === 'TP. Hồ Chí Minh' && (coachArea.includes('TP.HCM') || coachArea.includes('Q7') || coachArea.includes('Q2') || coachArea.includes('Thủ Đức') || coachArea.includes('Bình Thạnh') || coachArea.includes('Quận 1') || coachArea.includes('Tân Bình') || coachArea.includes('Nhà Bè') || coachArea.includes('Phú Nhuận'))) ||
        (selectedArea === 'Hà Nội' && (coachArea.includes('Hà Nội') || coachArea.includes('Tây Hồ') || coachArea.includes('Cầu Giấy') || coachArea.includes('Nam Từ Liêm') || coachArea.includes('Ba Đình'))) ||
        (selectedArea === 'Đà Nẵng' && (coachArea.includes('Đà Nẵng') || coachArea.includes('Hải Châu') || coachArea.includes('Sơn Trà') || coachArea.includes('Ngũ Hành Sơn')));

      // Price filter
      const matchesPrice = (coach.price_per_session || 0) <= priceMax;

      // Rating filter
      const matchesRating = minRating === 0 || (coach.rating_avg || 0) >= minRating;

      // DUPR filter
      const matchesDupr = minDupr === 0 || (coach.dupr_level || 0) >= minDupr;

      // Verified filter
      const matchesVerified = !verifiedOnly || coach.verification_status === 'verified';

      // Specialty filter
      const specTarget = (selectedSpecialty || '').toLowerCase();
      const matchesSpecialty = selectedSpecialty === 'all' || (coach.specialties || []).some(s => (s || '').toLowerCase().includes(specTarget));

      // Skill Level filter
      const matchesSkillLevel = (() => {
        if (selectedSkillLevel === 'all') return true;
        const coachBioLower = (coach.bio || '').toLowerCase();
        const coachSpecs = coach.specialties || [];
        if (selectedSkillLevel === 'beginner') {
          return coachSpecs.some(s => {
            const sl = (s || '').toLowerCase();
            return sl.includes('cơ bản') || sl.includes('nền tảng') || sl.includes('dink') || sl.includes('giao bóng');
          }) ||
                 coachBioLower.includes('người mới') ||
                 coachBioLower.includes('cơ bản') ||
                 (coach.dupr_level || 0) <= 4.6;
        }
        if (selectedSkillLevel === 'intermediate') {
          return coachSpecs.some(s => {
            const sl = (s || '').toLowerCase();
            return sl.includes('3rd shot') || sl.includes('chiến thuật') || sl.includes('reset') || sl.includes('nâng cao');
          }) ||
                 ((coach.dupr_level || 0) >= 4.0 && (coach.dupr_level || 0) <= 5.2);
        }
        if (selectedSkillLevel === 'competitive') {
          return (coach.dupr_level || 0) >= 4.8 || 
                 coachSpecs.some(s => {
                   const sl = (s || '').toLowerCase();
                   return sl.includes('thi đấu') || sl.includes('pro') || sl.includes('giải');
                 }) ||
                 (coach.experience_years || 0) >= 4;
        }
        return true;
      })();

      return matchesSearch && matchesArea && matchesPrice && matchesRating && matchesDupr && matchesVerified && matchesSpecialty && matchesSkillLevel;
    }).sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.rating_avg - a.rating_avg;
      }
      if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
      if (sortBy === 'dupr_desc') return b.dupr_level - a.dupr_level;
      if (sortBy === 'price_asc') return a.price_per_session - b.price_per_session;
      if (sortBy === 'price_desc') return b.price_per_session - a.price_per_session;
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      return 0;
    });
  }, [coaches, users, searchTerm, selectedArea, priceMax, minRating, minDupr, verifiedOnly, selectedSpecialty, selectedSkillLevel, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedSkillLevel('all');
    setPriceMax(1000000);
    setMinRating(0);
    setMinDupr(0);
    setVerifiedOnly(false);
    setSelectedSpecialty('all');
    setSortBy('recommended');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. GOAL-BASED DISCOVERY BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            Bạn muốn cải thiện kỹ năng gì hôm nay?
          </span>
          {selectedSpecialty !== 'all' && (
            <button
              onClick={() => { setSelectedSpecialty('all'); setSearchTerm(''); }}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Xem tất cả HLV
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {goalSkills.map((goal) => {
            const isActive = selectedSpecialty !== 'all' && (selectedSpecialty || '').toLowerCase().includes((goal.key || '').toLowerCase());
            return (
              <button
                key={goal.key}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setSelectedSpecialty('all');
                    setSearchTerm('');
                  } else {
                    setSelectedSpecialty(goal.key);
                    setSearchTerm(goal.key);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{goal.label}</span>
                {isActive && <Check className="w-3 h-3 text-emerald-200" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HERO / VALUE PROPOSITION SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-9 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 top-6 opacity-10 hidden lg:block">
          <Award className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            Nền tảng HLV Pickleball số 1 Việt Nam
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            Tìm Huấn Luyện Viên Pickleball <br className="hidden sm:inline" />
            <span className="text-emerald-400">Đã Xác Thực Chứng Chỉ & Chuẩn DUPR</span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6">
            100% hồ sơ HLV được Admin xác thực bằng cấp quốc tế (IPTPA / PPR / VPA). Bảo chứng thanh toán an toàn qua Escrow và chính sách <strong>Love Your Lesson</strong> đổi HLV nếu chưa hài lòng.
          </p>

          {/* Quick Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800">
            <div className="flex-1 flex items-center px-3 py-2 gap-2 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên HLV, kỹ thuật Dinking, 3rd Drop, sân tập..."
                className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 text-slate-900"
              />
              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedSpecialty('all'); }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs sm:text-sm text-slate-700 bg-transparent outline-none font-bold cursor-pointer"
              >
                <option value="all">Toàn quốc</option>
                {allAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {}}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-6 py-2.5 sm:py-3 rounded-xl transition shadow-md shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Tìm HLV</span>
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-800/60 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bằng cấp IPTPA / PPR chuẩn hóa</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảo chứng hoàn tiền Escrow</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <ThumbsUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đánh giá 100% từ học viên thật</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DUPR BANNER FOR NEW STUDENTS */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Dành Cho Học Viên
              </span>
              <span className="text-emerald-300 text-xs font-bold">Chưa biết điểm DUPR của mình?</span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
              Tự Đánh Giá Trình Độ DUPR • Chuẩn Quốc Tế
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Khảo sát 6 kỹ năng cơ bản để nhận xếp hạng DUPR và gợi ý HLV phù hợp với mục tiêu của bạn.
            </p>
          </div>
        </div>

        {onOpenSelfAssessment && (
          <button
            onClick={onOpenSelfAssessment}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Chấm Điểm DUPR Ngay</span>
          </button>
        )}
      </div>

      {/* 4. FILTER BAR & SORTING CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bộ lọc nâng cao</span>
            {activeFiltersCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              verifiedOnly 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chứng chỉ Verified</span>
          </button>

          <button
            type="button"
            onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              minRating === 4.8 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Đánh giá 4.8+</span>
          </button>

          <button
            type="button"
            onClick={() => setPriceMax(priceMax === 500000 ? 1000000 : 500000)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
              priceMax === 500000 
                ? 'bg-blue-100 text-blue-900 border border-blue-300' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Dưới 500.000₫ / buổi</span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Sắp xếp:</span>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            >
              <option value="recommended">Phù hợp nhất (Mặc định)</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="dupr_desc">Điểm DUPR cao nhất</option>
              <option value="price_asc">Học phí: Thấp đến Cao</option>
              <option value="price_desc">Học phí: Cao đến Thấp</option>
              <option value="experience">Nhiều năm kinh nghiệm</option>
            </select>
          </div>
        </div>

      </div>

      {/* Active Filters Summary Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between gap-2 px-1 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">{filteredCoaches.length} HLV phù hợp</span>
            <span>({activeFiltersCount} bộ lọc đang áp dụng)</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* 5. COACH LISTING GRID */}
      {filteredCoaches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-800">Không tìm thấy HLV phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Thử thay đổi khoảng giá, chọn tất cả khu vực hoặc giảm bớt điều kiện lọc để tìm được nhiều Huấn luyện viên hơn.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            Xóa bộ lọc & Xem tất cả HLV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => {
            const coachUser = coach.user || users.find(u => u.id === coach.user_id);
            return (
              <CoachCard
                key={coach.id}
                coach={coach}
                coachUser={coachUser}
                reviews={reviews}
                onSelectCoach={onSelectCoach}
                onWatchVideo={onWatchVideo}
              />
            );
          })}
        </div>
      )}

      {/* 6. ADVANCED FILTER DRAWER / MODAL */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm">Bộ Lọc Huấn Luyện Viên</h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Skill Level */}
              <div>
                <label className="font-bold text-slate-900 block mb-2">Trình độ học viên giảng dạy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'beginner', label: 'Cơ bản (2.0 - 2.5)' },
                    { id: 'intermediate', label: 'Trung cấp (3.0 - 3.5)' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedSkillLevel(lvl.id as any)}
                      className={`p-2.5 rounded-xl font-bold border transition text-center ${
                        selectedSkillLevel === lvl.id 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Max Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-slate-900">Mức học phí tối đa / buổi</label>
                  <span className="font-black text-emerald-700 text-sm">
                    {priceMax.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={1000000}
                  step={50000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>300.000 đ</span>
                  <span>650.000 đ</span>
                  <span>1.000.000 đ</span>
                </div>
              </div>

              {/* Min DUPR Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-slate-900">Trình độ HLV DUPR tối thiểu</label>
                  <span className="font-black text-slate-900">
                    {minDupr === 0 ? 'Tất cả' : `Từ ${minDupr.toFixed(1)} DUPR`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5.5}
                  step={0.5}
                  value={minDupr}
                  onChange={(e) => setMinDupr(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Verified Only Checkbox */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Chỉ hiện HLV đã xác thực chứng chỉ</span>
                    <span className="text-[11px] text-slate-500">Đã nộp và duyệt bằng IPTPA, PPR, VPA</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Đặt lại mặc định
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Áp Dụng ({filteredCoaches.length} kết quả)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
