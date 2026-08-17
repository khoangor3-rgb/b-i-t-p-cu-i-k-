import { User, CoachProfile, AvailabilitySlot, Booking, Review, SkillRating, TestCaseItem, CoachClass } from '../types';

// ==========================================
// 1. DANH SÁCH 50+ HỌC VIÊN & HLV & ADMIN
// ==========================================

const STUDENT_NAMES = [
  { name: 'Trần Thị Lan', email: 'lan.tran@gmail.com', phone: '0912345678', loc: 'Bình Thạnh, TP.HCM', dupr: 3.2, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { name: 'Lê Hoàng Minh', email: 'minh.le@gmail.com', phone: '0987654321', loc: 'Cầu Giấy, Hà Nội', dupr: 2.5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { name: 'Nguyễn Văn Hùng', email: 'hung.nguyen@gmail.com', phone: '0903112233', loc: 'Quận 7, TP.HCM', dupr: 3.8, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { name: 'Phạm Thu Trang', email: 'trang.pham@gmail.com', phone: '0918223344', loc: 'Tây Hồ, Hà Nội', dupr: 3.0, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { name: 'Võ Minh Phúc', email: 'phuc.vo@gmail.com', phone: '0933445566', loc: 'Hải Châu, Đà Nẵng', dupr: 3.5, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { name: 'Đỗ Thanh Thảo', email: 'thao.do@gmail.com', phone: '0977889900', loc: 'Quận 2, TP.HCM', dupr: 2.8, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { name: 'Bùi Anh Tuấn', email: 'tuan.bui@gmail.com', phone: '0966112233', loc: 'Ba Đình, Hà Nội', dupr: 4.1, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { name: 'Hoàng Thùy Linh', email: 'linh.hoang@gmail.com', phone: '0909556677', loc: 'Thủ Đức, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { name: 'Ngô Việt Đức', email: 'duc.ngo@gmail.com', phone: '0938114477', loc: 'Sơn Trà, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { name: 'Dương Hải Đăng', email: 'dang.duong@gmail.com', phone: '0944332211', loc: 'Phú Nhuận, TP.HCM', dupr: 3.6, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { name: 'Trịnh Thảo Vy', email: 'vy.trinh@gmail.com', phone: '0988112233', loc: 'Quận 1, TP.HCM', dupr: 2.7, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { name: 'Lý Quốc Long', email: 'long.ly@gmail.com', phone: '0911223344', loc: 'Nam Từ Liêm, Hà Nội', dupr: 3.4, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { name: 'Đặng Thái Sơn', email: 'son.dang@gmail.com', phone: '0937665544', loc: 'Tân Bình, TP.HCM', dupr: 3.7, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
  { name: 'Mai Hải Yến', email: 'yen.mai@gmail.com', phone: '0965332211', loc: 'Thanh Xuân, Hà Nội', dupr: 2.6, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { name: 'Phan Minh Quân', email: 'quan.phan@gmail.com', phone: '0944118899', loc: 'Ngũ Hành Sơn, Đà Nẵng', dupr: 4.0, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { name: 'Lê Kim Ngân', email: 'ngan.le@gmail.com', phone: '0977223344', loc: 'Quận 7, TP.HCM', dupr: 3.3, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { name: 'Vũ Đức Tâm', email: 'tam.vu@gmail.com', phone: '0908776655', loc: 'Hoàn Kiếm, Hà Nội', dupr: 3.9, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { name: 'Huỳnh Đăng Khoa', email: 'khoa.huynh@gmail.com', phone: '0919334455', loc: 'Quận 3, TP.HCM', dupr: 2.9, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { name: 'Tạ Huy Hoàng', email: 'hoang.ta@gmail.com', phone: '0981223344', loc: 'Hà Đông, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { name: 'Cao Khánh Ly', email: 'ly.cao@gmail.com', phone: '0934112233', loc: 'Quận 2, TP.HCM', dupr: 3.0, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { name: 'Đoàn Phương Nam', email: 'nam.doan@gmail.com', phone: '0962445566', loc: 'Hải Châu, Đà Nẵng', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { name: 'Lương Quốc Bảo', email: 'bao.luong@gmail.com', phone: '0943556677', loc: 'Thủ Đức, TP.HCM', dupr: 3.4, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { name: 'Chu Thu Phương', email: 'phuong.chu@gmail.com', phone: '0978990011', loc: 'Cầu Giấy, Hà Nội', dupr: 2.8, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { name: 'Đinh Thành Duy', email: 'duy.dinh@gmail.com', phone: '0901223344', loc: 'Quận 10, TP.HCM', dupr: 4.2, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { name: 'Nguyễn Thu Hương', email: 'huong.nguyen@gmail.com', phone: '0915667788', loc: 'Long Biên, Hà Nội', dupr: 3.1, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { name: 'Phạm Đức Trọng', email: 'trong.pham@gmail.com', phone: '0983114455', loc: 'Gò Vấp, TP.HCM', dupr: 3.5, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { name: 'Lê Ngọc Ánh', email: 'anh.le@gmail.com', phone: '0936225588', loc: 'Thanh Khê, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { name: 'Trần Tuấn Vũ', email: 'vu.tran@gmail.com', phone: '0969113355', loc: 'Tây Hồ, Hà Nội', dupr: 3.8, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { name: 'Vũ Hương Giang', email: 'giang.vu@gmail.com', phone: '0948332211', loc: 'Quận 4, TP.HCM', dupr: 2.7, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { name: 'Bùi Thái Bình', email: 'binh.bui@gmail.com', phone: '0971556677', loc: 'Thủ Dầu Một, Bình Dương', dupr: 3.3, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { name: 'Hoàng Trung Kiên', email: 'kien.hoang@gmail.com', phone: '0904112299', loc: 'Đống Đa, Hà Nội', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { name: 'Nguyễn Như Mai', email: 'mai.nguyen@gmail.com', phone: '0916335577', loc: 'Quận 7, TP.HCM', dupr: 3.0, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { name: 'Phan Tùng Lâm', email: 'lam.phan@gmail.com', phone: '0984221100', loc: 'Ba Đình, Hà Nội', dupr: 3.7, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { name: 'Đặng Thùy Dung', email: 'dung.dang@gmail.com', phone: '0932446688', loc: 'Sơn Trà, Đà Nẵng', dupr: 2.6, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { name: 'Võ Quốc Huy', email: 'huy.vo@gmail.com', phone: '0963114466', loc: 'Bình Thạnh, TP.HCM', dupr: 3.9, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { name: 'Lê Uyên Nhi', email: 'nhi.le@gmail.com', phone: '0941557799', loc: 'Tây Hồ, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { name: 'Trương Hải Đăng', email: 'dang.truong@gmail.com', phone: '0975331199', loc: 'Quận 2, TP.HCM', dupr: 4.1, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { name: 'Dương Mỹ Hạnh', email: 'hanh.duong@gmail.com', phone: '0907224466', loc: 'Hải Châu, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { name: 'Lý Gia Phát', email: 'phat.ly@gmail.com', phone: '0913889900', loc: 'Quận 1, TP.HCM', dupr: 3.5, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
  { name: 'Tô Như Quỳnh', email: 'quynh.to@gmail.com', phone: '0986442200', loc: 'Cầu Giấy, Hà Nội', dupr: 3.4, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { name: 'Mai Thành Tín', email: 'tin.mai@gmail.com', phone: '0939113377', loc: 'Tân Phú, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { name: 'Nguyễn Thị Kim Loan', email: 'loan.nguyen@gmail.com', phone: '0968224488', loc: 'Hoàng Mai, Hà Nội', dupr: 2.5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { name: 'Phạm Tiến Thành', email: 'thanh.pham@gmail.com', phone: '0942558811', loc: 'Quận 7, TP.HCM', dupr: 3.8, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { name: 'Vũ Hoàng Oanh', email: 'oanh.vu@gmail.com', phone: '0979336600', loc: 'Ngũ Hành Sơn, Đà Nẵng', dupr: 3.0, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { name: 'Bùi Tuấn Việt', email: 'viet.bui@gmail.com', phone: '0902114488', loc: 'Thủ Đức, TP.HCM', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { name: 'Đỗ Kiều Diễm', email: 'diem.do@gmail.com', phone: '0914668822', loc: 'Ba Đình, Hà Nội', dupr: 2.8, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { name: 'Hồ Trọng Nghĩa', email: 'nghia.ho@gmail.com', phone: '0985227744', loc: 'Quận 5, TP.HCM', dupr: 3.3, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { name: 'Trần Bích Trâm', email: 'tram.tran@gmail.com', phone: '0931448800', loc: 'Tây Hồ, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { name: 'Lê Minh Hiếu', email: 'hieu.le@gmail.com', phone: '0967339911', loc: 'Hải Châu, Đà Nẵng', dupr: 3.7, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { name: 'Nguyễn Bảo Ngọc', email: 'ngoc.bao@gmail.com', phone: '0949115533', loc: 'Quận 2, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
];

export const INITIAL_USERS: User[] = [
  // 1. ADMIN
  {
    id: 'user_admin_1',
    full_name: 'Nguyễn Hải Long (Admin Lead)',
    email: 'long.admin@pickleconnect.vn',
    phone: '0908123456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'admin',
    created_at: '2026-08-01',
    status: 'active',
    location: 'Quận 1, TP.HCM'
  },
  
  // 2. 10 HUẤN LUYỆN VIÊN (COACHES)
  {
    id: 'user_coach_khoa',
    full_name: 'Nguyễn Đăng Khoa (Coach Khoa)',
    email: 'khoa.coach@pickleconnect.vn',
    phone: '0933112233',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'coach',
    created_at: '2026-08-02',
    status: 'active',
    location: 'Quận 7 & Quận 2, TP.HCM'
  },
  {
    id: 'user_coach_anh',
    full_name: 'Phạm Tuấn Anh (IPTPA Coach)',
    email: 'tuananh.pickle@gmail.com',
    phone: '0909887766',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    role: 'coach',
    created_at: '2026-08-03',
    status: 'active',
    location: 'TP. Thủ Đức, TP.HCM'
  },
  {
    id: 'user_coach_ha',
    full_name: 'Vũ Thu Hà (PPR Pro Coach)',
    email: 'thuha.pickleball@gmail.com',
    phone: '0977443322',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'coach',
    created_at: '2026-08-04',
    status: 'active',
    location: 'Tây Hồ, Hà Nội'
  },
  {
    id: 'user_coach_nam',
    full_name: 'Lê Hoàng Nam (VPA Master Coach)',
    email: 'hoangnam.vpa@gmail.com',
    phone: '0912883311',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'coach',
    created_at: '2026-08-05',
    status: 'active',
    location: 'Hải Châu & Sơn Trà, Đà Nẵng'
  },
  {
    id: 'user_coach_quan',
    full_name: 'Đặng Minh Quân (IPTPA Level 2)',
    email: 'minhquan.pickle@gmail.com',
    phone: '0938445566',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'coach',
    created_at: '2026-08-06',
    status: 'active',
    location: 'Quận 1 & Quận 3, TP.HCM'
  },
  {
    id: 'user_coach_quynh',
    full_name: 'Hoàng Mai Quỳnh (PPR Certified)',
    email: 'maiquynh.pickle@gmail.com',
    phone: '0988771122',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'coach',
    created_at: '2026-08-07',
    status: 'active',
    location: 'Cầu Giấy, Hà Nội'
  },
  {
    id: 'user_coach_vinh',
    full_name: 'Trịnh Công Vinh (USPTA Pickleball)',
    email: 'congvinh.uspta@gmail.com',
    phone: '0903998877',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'coach',
    created_at: '2026-08-08',
    status: 'active',
    location: 'Tân Bình & Phú Nhuận, TP.HCM'
  },
  {
    id: 'user_coach_long_pb',
    full_name: 'Phan Bảo Long (Master DUPR Evaluator)',
    email: 'baolong.dupr@gmail.com',
    phone: '0944223311',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'coach',
    created_at: '2026-08-09',
    status: 'active',
    location: 'Quận 7 & Nhà Bè, TP.HCM'
  },
  {
    id: 'user_coach_ngoc',
    full_name: 'Đỗ Bích Ngọc (PPR Associate)',
    email: 'bichngoc.pickle@gmail.com',
    phone: '0971223344',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'coach',
    created_at: '2026-08-10',
    status: 'active',
    location: 'Ngũ Hành Sơn, Đà Nẵng'
  },
  {
    id: 'user_coach_pending',
    full_name: 'Đoàn Quang Dũng (HLV Chờ duyệt)',
    email: 'quangdung.pb@gmail.com',
    phone: '0944556677',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    role: 'coach',
    created_at: '2026-08-16',
    status: 'active',
    location: 'Hải Châu, Đà Nẵng'
  },

  // 3. 50 HỌC VIÊN (STUDENTS)
  ...STUDENT_NAMES.map((s, idx) => ({
    id: `user_student_${idx + 1}`,
    full_name: s.name,
    email: s.email,
    phone: s.phone,
    avatar_url: s.img,
    role: 'student' as const,
    created_at: `2026-08-${String((idx % 15) + 1).padStart(2, '0')}`,
    status: 'active' as const,
    dupr_rating: s.dupr,
    location: s.loc
  }))
];

// ==========================================
// 2. DANH SÁCH 10 HỒ SƠ HUẤN LUYỆN VIÊN (COACH PROFILES)
// ==========================================

export const INITIAL_COACHES: CoachProfile[] = [
  {
    id: 'coach_khoa',
    user_id: 'user_coach_khoa',
    bio: 'Cựu VĐV Quần vợt chuyển sang Pickleball chuyên nghiệp với hơn 4 năm giảng dạy. Đạt chứng chỉ HLV Quốc tế IPTPA Level 2 và HLV Trưởng giải Pickleball VĐQG 2025. Chuyên đào tạo kỹ thuật Third Shot Drop, Dink đối kháng chiến thuật và chuẩn bị DUPR thi đấu.',
    experience_years: 4,
    price_per_session: 450000,
    area: 'Quận 7 & Quận 2, TP.HCM',
    courts: ['Sân Pickleball Saigon South Q7', 'Sân D-Pickle City Thảo Điền', 'Sân V-Pickle Sala Q2'],
    specialties: ['Kỹ thuật Dinking đỉnh cao', 'Third Shot Drop & Reset', 'Chiến thuật Đôi giải đấu', 'Luyện thi DUPR 3.5 - 4.5'],
    teaching_style: 'Phương pháp trực quan 1-1, quay video slow-motion phân tích góc đánh, cam kết tiến bộ ngay sau 3 buổi theo chuẩn quốc tế.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600',
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600'
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'IPTPA Certified Teaching Professional Level 2',
        issuer: 'International Pickleball Teaching Professional Association',
        year: 2023,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      },
      {
        id: 'cert_2',
        title: 'DUPR Global Coach Rating Assessor',
        issuer: 'DUPR International',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Trải Nghiệm & Đánh Giá (1 buổi)', sessions: 1, discount_percent: 0, description: 'Kiểm tra trình độ DUPR khởi điểm, chỉnh form phát bóng & dink cơ bản.' },
      { id: 'pkg_3', title: 'Gói Nâng Tầm Kỹ Thuật (3 buổi)', sessions: 3, discount_percent: 5, description: 'Luyện sâu Third Shot Drop, Smash, phản xạ Volley trên lưới (Tiết kiệm 5%).' },
      { id: 'pkg_10', title: 'Khóa Chiến Thuật Toàn Diện (10 buổi)', sessions: 10, discount_percent: 15, description: 'Lộ trình từ 2.5 lên 3.5+ DUPR, chiến thuật di chuyển đôi, test giải đấu (Tiết kiệm 15%).' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-02',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 4.9,
    review_count: 38,
    students_count: 64,
    dupr_level: 5.2,
    created_at: '2026-08-02'
  },
  {
    id: 'coach_anh',
    user_id: 'user_coach_anh',
    bio: 'HLV chuyên nghiệp với 3 năm giảng dạy cho cả trẻ em và người lớn tại TP.Thủ Đức. Có chứng chỉ PPR Professional Coach và cựu VĐV đoạt Huy chương Bạc VĐQG đôi nam nữ 2024. Nhiệt tình, kiên nhẫn, thiết kế giáo trình riêng theo thể lực từng học viên.',
    experience_years: 3,
    price_per_session: 380000,
    area: 'TP. Thủ Đức & Bình Thạnh, TP.HCM',
    courts: ['Sân PickleClub Thảo Điền', 'Sân Bcons Pickleball Dĩ An', 'Sân VietPickle Bình Quới'],
    specialties: ['Người mới bắt đầu (Beginner)', 'Sửa lỗi cổ tay & tiếp xúc bóng', 'Chiến thuật đánh đơn', 'Phòng thủ phản công Reset'],
    teaching_style: 'Nhẹ nhàng, cởi mở, tập trung truyền cảm hứng và an toàn thể thao tránh chấn thương khớp vai gối.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600'
    ],
    certifications: [
      {
        id: 'cert_3',
        title: 'PPR Certified Coach - Professional Pickleball Registry',
        issuer: 'PPR Registry USA',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Khởi Động Nhập Môn (1 buổi)', sessions: 1, discount_percent: 0, description: 'Làm quen luật thi đấu, cầm vợt Continental & các bước chân cơ bản.' },
      { id: 'pkg_3', title: 'Gói Cơ Bản Vững Vàng (3 buổi)', sessions: 3, discount_percent: 5, description: 'Tự tin ra sân giao lưu phong trào không sợ hụt bóng (Giảm 5%).' },
      { id: 'pkg_10', title: 'Gói Tự Tin Thi Đấu (10 buổi)', sessions: 10, discount_percent: 12, description: 'Hoàn thiện toàn bộ kỹ năng & tư duy đánh đôi (Giảm 12%).' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-03',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 24,
    students_count: 42,
    dupr_level: 4.6,
    created_at: '2026-08-03'
  },
  {
    id: 'coach_ha',
    user_id: 'user_coach_ha',
    bio: 'Nữ HLV hàng đầu Hà Nội, đạt chứng chỉ PPR Pro và có 5 năm thi đấu tennis bán chuyên nghiệp. Đã đào tạo hơn 80 học viên nữ và cặp đôi đạt giải phong trào Hà Nội Pickleball Open. Phong cách hướng dẫn tỉ mỉ, nhấn mạnh tư duy phán đoán đường bóng.',
    experience_years: 5,
    price_per_session: 500000,
    area: 'Tây Hồ, Cầu Giấy & Ba Đình, Hà Nội',
    courts: ['Sân Westlake Pickleball Club', 'Sân Cầu Giấy Arena', 'Sân Ciputra Sports Complex'],
    specialties: ['Pickleball Nữ & Trẻ em', 'Speed-up & Phản xạ lưới Kitchen', 'Tâm lý thi đấu', 'Phát bóng xoáy Topspin/Sidespin'],
    teaching_style: 'Năng động, giáo án chi tiết từng phút, có bài tập phản xạ đèn màu và máy bắn bóng tự động.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600',
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600'
    ],
    certifications: [
      {
        id: 'cert_4',
        title: 'PPR Level 2 Head Coach Certification',
        issuer: 'PPR Pickleball Registry',
        year: 2023,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Thẩm Định & Chỉnh Lỗi (1 buổi)', sessions: 1, discount_percent: 0, description: 'Phân tích điểm nghẽn kỹ thuật và chỉnh sửa tư thế đánh lỗi.' },
      { id: 'pkg_3', title: 'Gói Chuyên Sâu Tốc Độ & Kitchen (3 buổi)', sessions: 3, discount_percent: 6, description: 'Làm chủ khu vực Kitchen, phản xạ bóng nhanh và tấn công dứt điểm.' },
      { id: 'pkg_10', title: 'Khóa Pro Athlete Mastery (10 buổi)', sessions: 10, discount_percent: 18, description: 'Cam kết nâng rating DUPR tối thiểu +0.6 sau khóa học.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-04',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 5.0,
    review_count: 51,
    students_count: 85,
    dupr_level: 5.0,
    created_at: '2026-08-04'
  },
  {
    id: 'coach_nam',
    user_id: 'user_coach_nam',
    bio: 'Vô địch Đôi Nam giải Pickleball Miền Trung 2025. HLV trưởng tại Đà Nẵng Pickleball Arena. Huấn luyện thực chiến các đòn Erne, ATP, Around-The-Post và kỹ thuật phòng thủ phản đòn tốc độ cao.',
    experience_years: 4,
    price_per_session: 420000,
    area: 'Hải Châu & Sơn Trà, Đà Nẵng',
    courts: ['Sân Pickleball Sông Hàn', 'Sân Danang Beach Arena', 'Sân Tuyên Sơn Club'],
    specialties: ['Erne & ATP Shot', 'Chiến thuật Đôi giải đấu', 'Luyện DUPR 4.0 - 5.5', 'Third Shot Drop'],
    teaching_style: 'Thực chiến 100%, giả lập tình huống thi đấu áp lực cao với các bài drill chuẩn Hoa Kỳ.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'
    ],
    certifications: [
      {
        id: 'cert_nam_1',
        title: 'VPA Master Coach & Referee Level 2',
        issuer: 'Vietnam Pickleball Association',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Trải Nghiệm Tốc Độ (1 buổi)', sessions: 1, discount_percent: 0, description: 'Làm quen nhịp độ bóng nhanh và chỉnh bước chân.' },
      { id: 'pkg_3', title: 'Gói Kỹ Thuật Nâng Cao (3 buổi)', sessions: 3, discount_percent: 5, description: 'Tập trung Erne, ATP và di chuyển bọc lót đồng đội.' },
      { id: 'pkg_10', title: 'Khóa Chiến Binh Giải Đấu (10 buổi)', sessions: 10, discount_percent: 15, description: 'Trang bị trọn gói tâm lý thi đấu và chiến thuật đỉnh cao.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-05',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 4.9,
    review_count: 42,
    students_count: 70,
    dupr_level: 5.6,
    created_at: '2026-08-05'
  },
  {
    id: 'coach_quan',
    user_id: 'user_coach_quan',
    bio: 'Chuyên gia huấn luyện Pickleball trung tâm TP.HCM. Từng tham gia các khóa đào tạo HLV tại Mỹ và Thái Lan. Chuyên bẻ khóa kỹ thuật khó, chỉnh sửa tư thế tay và nhịp thở khi thi đấu kéo dài.',
    experience_years: 3,
    price_per_session: 460000,
    area: 'Quận 1 & Quận 3, TP.HCM',
    courts: ['Sân Pickleball Hoa Lư Q1', 'Sân Tao Đàn Sports Complex', 'Sân Kỳ Hòa Q10'],
    specialties: ['Kỹ thuật Dinking', 'Phát bóng xoáy Topspin', 'Tăng tốc độ phản xạ Fast Hands', 'DUPR 3.0 - 4.5'],
    teaching_style: 'Khoa học, ứng dụng công nghệ đo tốc độ bóng và phân tích qua màn hình iPad ngay trên sân.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'
    ],
    certifications: [
      {
        id: 'cert_quan_1',
        title: 'IPTPA Level 2 Teaching Pro',
        issuer: 'IPTPA USA',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Test DUPR & Fix Form (1 buổi)', sessions: 1, discount_percent: 0, description: 'Phân tích thông số cú đánh và lên lộ trình tập.' },
      { id: 'pkg_3', title: 'Gói Fast Hands Kitchen (3 buổi)', sessions: 3, discount_percent: 5, description: 'Tối ưu tốc độ phản xạ trong cự ly gần.' },
      { id: 'pkg_10', title: 'Khóa Pro DUPR 4.0+ (10 buổi)', sessions: 10, discount_percent: 15, description: 'Đào tạo toàn diện đưa học viên lên đẳng cấp 4.0+.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-06',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.9,
    review_count: 31,
    students_count: 55,
    dupr_level: 5.4,
    created_at: '2026-08-06'
  },
  {
    id: 'coach_quynh',
    user_id: 'user_coach_quynh',
    bio: 'HLV chuyên trách các lớp Pickleball phong trào và doanh nghiệp tại Hà Nội. Phong cách năng động, truyền năng lượng tích cực, giúp người mới yêu thích môn thể thao ngay từ 15 phút đầu.',
    experience_years: 3,
    price_per_session: 390000,
    area: 'Cầu Giấy & Nam Từ Liêm, Hà Nội',
    courts: ['Sân Cầu Giấy Pickleball Club', 'Sân Mỹ Đình Sports Arena', 'Sân Keangnam Club'],
    specialties: ['Người mới bắt đầu (Beginner)', 'Pickleball Doanh nghiệp', 'Cầm vợt & Footwork', 'Đánh đôi ăn ý'],
    teaching_style: 'Nhiệt huyết, vui nhộn, tạo không khí giao lưu kết nối thoải mái.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600'
    ],
    certifications: [
      {
        id: 'cert_quynh_1',
        title: 'PPR Certified Associate Coach',
        issuer: 'PPR Pickleball Registry',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Trải Nghiệm Năng Lượng (1 buổi)', sessions: 1, discount_percent: 0, description: 'Làm quen vợt, bóng và luật chơi Non-Volley Zone.' },
      { id: 'pkg_3', title: 'Gói Cơ Bản Chuẩn Form (3 buổi)', sessions: 3, discount_percent: 5, description: 'Đánh bóng đều tay, tự tin ra sân thi đấu giao lưu.' },
      { id: 'pkg_10', title: 'Khóa Tự Tin Ra Sân (10 buổi)', sessions: 10, discount_percent: 12, description: 'Thành thạo toàn bộ chiến thuật đơn & đôi.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-07',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 29,
    students_count: 48,
    dupr_level: 4.8,
    created_at: '2026-08-07'
  },
  {
    id: 'coach_vinh',
    user_id: 'user_coach_vinh',
    bio: '10 năm kinh nghiệm HLV Quần vợt và 3 năm chuyên sâu Pickleball. Chứng chỉ USPTA Pickleball Professional. Chuyên trị các ca khó về chuyển đổi thói quen tennis sang pickleball.',
    experience_years: 5,
    price_per_session: 430000,
    area: 'Tân Bình, Phú Nhuận & Gò Vấp, TP.HCM',
    courts: ['Sân Pickleball Quân Khu 7', 'Sân Hoàng Hoa Thám Tân Bình', 'Sân Gia Định Park'],
    specialties: ['Chuyển từ Tennis sang Pickleball', 'Third Shot Drop', 'Cú đập Smash uy lực', 'Phòng ngự phản công'],
    teaching_style: 'Bài bản, kỷ luật cao, tập trung hoàn thiện kỹ thuật chuẩn từng milimet.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600'
    ],
    certifications: [
      {
        id: 'cert_vinh_1',
        title: 'USPTA Pickleball Professional Certification',
        issuer: 'United States Professional Tennis Association',
        year: 2023,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Khảo Sát Kỹ Thuật (1 buổi)', sessions: 1, discount_percent: 0, description: 'Phân tích lỗi cổ tay và thói quen vung vợt quá đà.' },
      { id: 'pkg_3', title: 'Gói Reset & Drop Chuyên Sâu (3 buổi)', sessions: 3, discount_percent: 5, description: 'Luyện kỹ năng thả bóng mềm mại vào Kitchen.' },
      { id: 'pkg_10', title: 'Khóa Chuyên Gia Pickleball (10 buổi)', sessions: 10, discount_percent: 15, description: 'Nắm vững 100% kỹ thuật và chiến thuật đối kháng.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-08',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.9,
    review_count: 36,
    students_count: 58,
    dupr_level: 5.1,
    created_at: '2026-08-08'
  },
  {
    id: 'coach_long_pb',
    user_id: 'user_coach_long_pb',
    bio: 'HLV cấp cao và Giám khảo chấm điểm DUPR Quốc tế tại Việt Nam. Đã đào tạo nhiều VĐV đạt huy chương quốc gia. Giáo trình chuyên sâu chuẩn bị giải đấu đỉnh cao.',
    experience_years: 6,
    price_per_session: 550000,
    area: 'Quận 7 & Nhà Bè, TP.HCM',
    courts: ['Sân Pickleball Nam Sài Gòn Q7', 'Sân PMH Sports Arena', 'Sân SSIS Court'],
    specialties: ['Huấn luyện VĐV Thi đấu', 'Thẩm định DUPR 5.0+', 'Chiến thuật Tâm lý', 'Third Shot Drop & Speed-up'],
    teaching_style: 'Chuyên nghiệp đỉnh cao, phân tích dữ liệu video, rèn luyện áp lực cực đại.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600'
    ],
    certifications: [
      {
        id: 'cert_long_1',
        title: 'IPTPA Master Teaching Professional',
        issuer: 'IPTPA International',
        year: 2022,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      },
      {
        id: 'cert_long_2',
        title: 'DUPR Certified Tournament Director',
        issuer: 'DUPR USA',
        year: 2024,
        proof_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Thẩm Định Chuyên Gia (1 buổi)', sessions: 1, discount_percent: 0, description: 'Chấm điểm 6 tiêu chí DUPR và lập hồ sơ thi đấu.' },
      { id: 'pkg_3', title: 'Gói Đột Phá Kỹ Năng Đỉnh Cao (3 buổi)', sessions: 3, discount_percent: 5, description: 'Xử lý các tình huống khó khăn nhất trên sân.' },
      { id: 'pkg_10', title: 'Khóa Đào Tạo Vô Địch (10 buổi)', sessions: 10, discount_percent: 20, description: 'Lộ trình cá nhân hóa đưa học viên chạm mốc DUPR 5.0+.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-09',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 5.0,
    review_count: 65,
    students_count: 98,
    dupr_level: 5.8,
    created_at: '2026-08-09'
  },
  {
    id: 'coach_ngoc',
    user_id: 'user_coach_ngoc',
    bio: 'Nữ HLV nhiệt tình tại Đà Nẵng, chuyên hướng dẫn các bạn trẻ, chị em phụ nữ và trẻ nhỏ. Hướng dẫn tỉ mỉ, giúp học viên cảm thấy thoải mái và tự tin sau mỗi buổi tập.',
    experience_years: 2,
    price_per_session: 350000,
    area: 'Ngũ Hành Sơn & Sơn Trà, Đà Nẵng',
    courts: ['Sân Danang Beach Pickleball', 'Sân An Thượng Sports Club'],
    specialties: ['Người mới bắt đầu', 'Pickleball Nữ & Trẻ em', 'Kỹ thuật Dink nhẹ nhàng', 'Di chuyển sân'],
    teaching_style: 'Thân thiện, chu đáo, không gian tập luyện thư giãn gần biển.',
    video_intro_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gallery_urls: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'
    ],
    certifications: [
      {
        id: 'cert_ngoc_1',
        title: 'PPR Associate Coach Certification',
        issuer: 'PPR Registry',
        year: 2025,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Trải Nghiệm Biển (1 buổi)', sessions: 1, discount_percent: 0, description: 'Khởi động nhẹ nhàng và học luật căn bản.' },
      { id: 'pkg_3', title: 'Gói Nắm Vững Căn Bản (3 buổi)', sessions: 3, discount_percent: 5, description: 'Làm chủ các cú đánh qua lưới an toàn.' },
      { id: 'pkg_10', title: 'Khóa Tự Tin Giao Lưu (10 buổi)', sessions: 10, discount_percent: 12, description: 'Tự tin tham gia các câu lạc bộ phong trào.' }
    ],
    verification_status: 'verified',
    verified_at: '2026-08-10',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 18,
    students_count: 32,
    dupr_level: 4.5,
    created_at: '2026-08-10'
  },
  {
    id: 'coach_pending',
    user_id: 'user_coach_pending',
    bio: 'Đam mê Pickleball 2 năm, từng đạt giải Nhất đôi nam phong trào Đà Nẵng 2025. Mong muốn hướng dẫn người mới chơi nắm vững căn bản, di chuyển sân chuẩn xác và không phạm lỗi Non-Volley Zone.',
    experience_years: 2,
    price_per_session: 300000,
    area: 'Hải Châu & Sơn Trà, Đà Nẵng',
    courts: ['Sân Pickleball Sông Hàn', 'Sân Tuyên Sơn Sports Center'],
    specialties: ['Người mới chơi căn bản', 'Di chuyển bộ chân Footwork', 'Giao lưu cộng đồng'],
    teaching_style: 'Vui vẻ, nhiệt tình, thực chiến thi đấu trực tiếp.',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600'
    ],
    certifications: [
      {
        id: 'cert_6',
        title: 'Giấy chứng nhận HLV Pickleball VPA Sơ cấp',
        issuer: 'Hiệp hội Pickleball Việt Nam VPA',
        year: 2025,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: false
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Gói Trải Nghiệm Đà Nẵng (1 buổi)', sessions: 1, discount_percent: 0, description: '1 tiếng luyện tập và giao lưu thực chiến.' },
      { id: 'pkg_3', title: 'Gói Nhập Môn Căn Bản (3 buổi)', sessions: 3, discount_percent: 5, description: '3 buổi nắm trọn kỹ năng đánh bóng bền.' }
    ],
    verification_status: 'pending',
    is_featured: false,
    rating_avg: 0,
    review_count: 0,
    students_count: 0,
    dupr_level: 4.0,
    created_at: '2026-08-16'
  }
];

// ==========================================
// 3. DANH SÁCH KHUNG GIỜ RẢNH (SLOTS)
// ==========================================

export const INITIAL_SLOTS: AvailabilitySlot[] = [
  // Slots cho HLV Khoa
  { id: 'slot_1', coach_id: 'coach_khoa', date: '2026-08-20', start_time: '08:00', end_time: '09:30', court_name: 'Sân Pickleball Saigon South Q7', is_booked: true },
  { id: 'slot_2', coach_id: 'coach_khoa', date: '2026-08-20', start_time: '17:00', end_time: '18:30', court_name: 'Sân V-Pickle Sala Q2', is_booked: false },
  { id: 'slot_3', coach_id: 'coach_khoa', date: '2026-08-21', start_time: '07:30', end_time: '09:00', court_name: 'Sân D-Pickle City Thảo Điền', is_booked: false },
  { id: 'slot_4', coach_id: 'coach_khoa', date: '2026-08-21', start_time: '18:00', end_time: '19:30', court_name: 'Sân V-Pickle Sala Q2', is_booked: false },
  { id: 'slot_5', coach_id: 'coach_khoa', date: '2026-08-22', start_time: '16:00', end_time: '17:30', court_name: 'Sân Pickleball Saigon South Q7', is_booked: true },
  { id: 'slot_6', coach_id: 'coach_khoa', date: '2026-08-23', start_time: '08:30', end_time: '10:00', court_name: 'Sân D-Pickle City Thảo Điền', is_booked: false },

  // Slots cho HLV Tuấn Anh
  { id: 'slot_anh_1', coach_id: 'coach_anh', date: '2026-08-20', start_time: '07:00', end_time: '08:30', court_name: 'Sân PickleClub Thảo Điền', is_booked: true },
  { id: 'slot_anh_2', coach_id: 'coach_anh', date: '2026-08-21', start_time: '16:30', end_time: '18:00', court_name: 'Sân VietPickle Bình Quới', is_booked: false },
  { id: 'slot_anh_3', coach_id: 'coach_anh', date: '2026-08-22', start_time: '08:00', end_time: '09:30', court_name: 'Sân PickleClub Thảo Điền', is_booked: false },

  // Slots cho HLV Thu Hà (Hà Nội)
  { id: 'slot_ha_1', coach_id: 'coach_ha', date: '2026-08-20', start_time: '06:30', end_time: '08:00', court_name: 'Sân Westlake Pickleball Club', is_booked: true },
  { id: 'slot_ha_2', coach_id: 'coach_ha', date: '2026-08-21', start_time: '17:30', end_time: '19:00', court_name: 'Sân Cầu Giấy Arena', is_booked: false },
  { id: 'slot_ha_3', coach_id: 'coach_ha', date: '2026-08-22', start_time: '08:00', end_time: '09:30', court_name: 'Sân Ciputra Sports Complex', is_booked: false },

  // Slots cho HLV Hoàng Nam (Đà Nẵng)
  { id: 'slot_nam_1', coach_id: 'coach_nam', date: '2026-08-20', start_time: '07:00', end_time: '08:30', court_name: 'Sân Pickleball Sông Hàn', is_booked: true },
  { id: 'slot_nam_2', coach_id: 'coach_nam', date: '2026-08-21', start_time: '16:30', end_time: '18:00', court_name: 'Sân Danang Beach Arena', is_booked: false },

  // Slots cho HLV Minh Quân (Q1 HCM)
  { id: 'slot_quan_1', coach_id: 'coach_quan', date: '2026-08-20', start_time: '08:00', end_time: '09:30', court_name: 'Sân Hoa Lư Q1', is_booked: false },
  { id: 'slot_quan_2', coach_id: 'coach_quan', date: '2026-08-22', start_time: '17:00', end_time: '18:30', court_name: 'Sân Kỳ Hòa Q10', is_booked: false },

  // Slots cho HLV Bảo Long (Q7 HCM)
  { id: 'slot_long_1', coach_id: 'coach_long_pb', date: '2026-08-21', start_time: '07:00', end_time: '08:30', court_name: 'Sân PMH Sports Arena', is_booked: false },
  { id: 'slot_long_2', coach_id: 'coach_long_pb', date: '2026-08-23', start_time: '16:00', end_time: '17:30', court_name: 'Sân Nam Sài Gòn Q7', is_booked: false }
];

// ==========================================
// 4. DANH SÁCH ĐƠN ĐẶT LỊCH HỌC (BOOKINGS)
// ==========================================

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking_1',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    student_phone: '0912345678',
    student_email: 'lan.tran@gmail.com',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    slot_id: 'slot_1',
    date: '2026-08-20',
    start_time: '08:00',
    end_time: '09:30',
    court_name: 'Sân Pickleball Saigon South Q7',
    package_title: 'Gói Nâng Tầm Kỹ Thuật (3 buổi)',
    session_count: 3,
    total_price: 1282500,
    status: 'confirmed',
    notes: 'Muốn tập trung sửa lỗi đánh bóng hay rúc lưới ở quả thứ 3 (Third shot drop).',
    created_at: '2026-08-15',
    has_reviewed: false
  },
  {
    id: 'booking_2',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    student_phone: '0912345678',
    student_email: 'lan.tran@gmail.com',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    slot_id: 'slot_5',
    date: '2026-08-10',
    start_time: '16:00',
    end_time: '17:30',
    court_name: 'Sân Pickleball Saigon South Q7',
    package_title: 'Buổi Trải Nghiệm & Đánh Giá (1 buổi)',
    session_count: 1,
    total_price: 450000,
    status: 'completed',
    notes: 'Buổi đánh giá đầu vào.',
    created_at: '2026-08-08',
    has_reviewed: true
  },
  {
    id: 'booking_3',
    student_id: 'user_student_2',
    student_name: 'Lê Hoàng Minh',
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    student_phone: '0987654321',
    student_email: 'minh.le@gmail.com',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    slot_id: 'slot_ha_1',
    date: '2026-08-20',
    start_time: '06:30',
    end_time: '08:00',
    court_name: 'Sân Westlake Pickleball Club',
    package_title: 'Gói Chuyên Sâu Tốc Độ & Kitchen (3 buổi)',
    session_count: 3,
    total_price: 1410000,
    status: 'pending',
    notes: 'Muốn học cách tăng tốc độ bóng trên lưới.',
    created_at: '2026-08-16',
    has_reviewed: false
  },
  {
    id: 'booking_4',
    student_id: 'user_student_3',
    student_name: 'Nguyễn Văn Hùng',
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    student_phone: '0903112233',
    student_email: 'hung.nguyen@gmail.com',
    coach_id: 'coach_nam',
    coach_name: 'Lê Hoàng Nam',
    coach_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    slot_id: 'slot_nam_1',
    date: '2026-08-20',
    start_time: '07:00',
    end_time: '08:30',
    court_name: 'Sân Pickleball Sông Hàn',
    package_title: 'Gói Kỹ Thuật Nâng Cao (3 buổi)',
    session_count: 3,
    total_price: 1197000,
    status: 'confirmed',
    notes: 'Luyện cú Erne chuẩn bị giải Đà Nẵng Open.',
    created_at: '2026-08-14',
    has_reviewed: false
  }
];

// ==========================================
// 5. DANH SÁCH ĐÁNH GIÁ & REVIEW
// ==========================================

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    booking_id: 'booking_2',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    coach_id: 'coach_khoa',
    rating: 5,
    comment: 'Thầy Khoa dạy cực kỳ tận tâm! Chỉ sau 1 buổi thầy đã chỉ ra lỗi xoay hông sai của mình khiến bóng hay rúc lưới. Video quay slow-motion phân tích rất trực quan. Chắc chắn sẽ đăng ký tiếp gói 10 buổi!',
    created_at: '2026-08-11',
    is_hidden: false,
    coach_reply: 'Cảm ơn Lan rất nhiều! Em tiếp thu rất nhanh, buổi tới chúng ta sẽ đẩy mạnh bài tập kiểm soát lực tay ở cự ly Kitchen nhé.',
    skill_tags: ['Nhiệt tình & Đúng giờ', 'Third Shot Drop chuẩn', 'Video phân tích chi tiết']
  },
  {
    id: 'rev_2',
    booking_id: 'booking_old_1',
    student_id: 'user_student_7',
    student_name: 'Bùi Anh Tuấn',
    student_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    coach_id: 'coach_khoa',
    rating: 5,
    comment: 'Khóa học chất lượng cao, đúng chuẩn quốc tế. Thầy Khoa có bài tập drill với máy bắn bóng giúp phản xạ lưới tiến bộ trông thấy!',
    created_at: '2026-08-09',
    is_hidden: false,
    skill_tags: ['Tiến bộ nhanh', 'Drill thực chiến']
  },
  {
    id: 'rev_3',
    booking_id: 'booking_old_2',
    student_id: 'user_student_4',
    student_name: 'Phạm Thu Trang',
    student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    coach_id: 'coach_ha',
    rating: 5,
    comment: 'Cô Hà dạy cực kỳ dễ hiểu, truyền cảm hứng rất tốt cho các bạn nữ mới chơi. Sân tập đẹp, giáo án bài bản.',
    created_at: '2026-08-12',
    is_hidden: false,
    skill_tags: ['Phù hợp cho nữ', 'Dễ hiểu & Chu đáo']
  }
];

// ==========================================
// 6. HỒ SƠ THẨM ĐỊNH KỸ NĂNG DUPR (SKILL RATINGS)
// ==========================================

export const INITIAL_SKILL_RATINGS: SkillRating[] = [
  {
    id: 'skill_1',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    assessed_at: '2026-08-10',
    dupr_score: 3.2,
    metrics: {
      serve_and_return: 7.5,
      dinking_control: 7.0,
      third_shot_drop: 5.5,
      volleys_and_resets: 6.5,
      court_positioning: 7.0,
      match_strategy: 6.0
    },
    notes: 'Lan có cảm giác bóng tốt và di chuyển nhịp nhàng. Cần luyện thêm lực cổ tay khi thực hiện Third Shot Drop từ cuối sân để bóng rơi mềm vào Kitchen.',
    recommended_drills: [
      'Drill 100 quả Dinking chéo sân liên tục không lỗi',
      'Drill Third Shot Drop từ vạch Baseline vào mục tiêu nón Kitchen',
      'Luyện phản xạ Volley 2 chạm tại lưới'
    ]
  }
];

// ==========================================
// 7. MA TRẬN 10 TEST CASES ĐỒ ÁN (TEST PLAN)
// ==========================================

export const INITIAL_TEST_CASES: TestCaseItem[] = [
  {
    id: 'TC-01',
    title: 'Tìm kiếm HLV theo địa điểm & mức giá',
    module: 'Học viên (Lan)',
    steps: '1. Vào trang Tìm HLV\n2. Chọn khu vực TP.HCM\n3. Kéo thanh giá max 500k',
    expected: 'Hiển thị danh sách HLV thỏa mãn bộ lọc',
    actual: 'Hiển thị chính xác 100% danh sách HLV phù hợp',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-02',
    title: 'Đặt lịch học & chọn gói khuyến mãi 3 buổi',
    module: 'Học viên (Lan)',
    steps: '1. Chọn HLV Khoa\n2. Chọn gói 3 buổi (giảm 5%)\n3. Chọn slot rảnh 20/08 và xác nhận',
    expected: 'Tạo booking trạng thái Pending, trừ slot rảnh',
    actual: 'Booking lưu thành công, hiển thị trong Lịch học của tôi',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-03',
    title: 'HLV duyệt đơn đặt chỗ của học viên',
    module: 'HLV (Khoa)',
    steps: '1. Đăng nhập HLV Khoa\n2. Vào mục Quản lý Lịch dạy\n3. Bấm [Xác nhận] đơn của Lan',
    expected: 'Đơn chuyển sang trạng thái Confirmed',
    actual: 'Trạng thái cập nhật tức thì, slot được khóa chính xác',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-04',
    title: 'HLV thêm khung giờ rảnh mới',
    module: 'HLV (Khoa)',
    steps: '1. Vào Lịch dạy\n2. Chọn ngày & giờ rảnh\n3. Bấm Thêm khung giờ',
    expected: 'Khung giờ rảnh mới xuất hiện cho học viên đặt',
    actual: 'Slot mới tạo thành công, không bị trùng lặp',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-05',
    title: 'HLV chấm điểm DUPR & giao bài tập sau buổi học',
    module: 'HLV (Khoa)',
    steps: '1. Vào buổi học đã Completed\n2. Nhập 6 tiêu chí DUPR\n3. Lưu thẩm định',
    expected: 'Hồ sơ DUPR của học viên được cập nhật biểu đồ radar',
    actual: 'Điểm DUPR 3.2 hiển thị trực quan và chi tiết bài drill',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-06',
    title: 'Học viên đánh giá sao & nhận xét sau khóa học',
    module: 'Học viên (Lan)',
    steps: '1. Vào Lịch học\n2. Chọn buổi đã hoàn tất\n3. Đánh giá 5 sao & viết review',
    expected: 'Review hiển thị trên trang cá nhân của HLV',
    actual: 'Điểm trung bình HLV cập nhật chính xác',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-07',
    title: 'Admin duyệt chứng chỉ HLV & cấp Tick Xanh',
    module: 'Admin (Long)',
    steps: '1. Vào Cổng Quản trị Duyệt HLV\n2. Xem ảnh chứng chỉ\n3. Bấm Duyệt hồ sơ',
    expected: 'HLV được cấp Tick Xanh và hiển thị ngoài trang chủ',
    actual: 'Huy hiệu Verified và Tick Xanh kích hoạt ngay',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-08',
    title: 'Admin ẩn đánh giá vi phạm tiêu chuẩn cộng đồng',
    module: 'Admin (Long)',
    steps: '1. Vào Quản lý Đánh giá\n2. Chọn review có nội dung spam\n3. Bấm Ẩn review',
    expected: 'Review bị ẩn khỏi hồ sơ công khai của HLV',
    actual: 'Đánh giá bị ẩn an toàn, có ghi nhận lý do',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-09',
    title: 'Chính sách Love Your Lesson Guarantee',
    module: 'Hệ thống',
    steps: '1. Kiểm tra chính sách hoàn tiền buổi đầu\n2. Học viên khiếu nại\n3. Hệ thống đổi HLV',
    expected: 'Học viên được hỗ trợ 100% đổi HLV miễn phí',
    actual: 'Luồng bảo vệ học viên hoạt động chuẩn cam kết 100%',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-10',
    title: 'Kiểm thử Responsive Mobile & Phân quyền',
    module: 'Toàn hệ thống',
    steps: '1. Thu nhỏ màn hình điện thoại (375px - 430px)\n2. Kiểm tra menu, modal, nút bấm\n3. Chuyển đổi tài khoản',
    expected: 'Giao diện không vỡ layout, menu kín đáo, cảm ứng mượt mà',
    actual: 'Layout mobile chuẩn 100%, chạm mượt mà, UX tự nhiên',
    status: 'Fixed',
    tested_by: 'Quân & Long'
  }
];

export const PROJECT_TEST_CASES = INITIAL_TEST_CASES;

// ==========================================
// 8. DANH SÁCH LỚP HỌC (COACH CLASSES) & PHÂN BỔ 42 HỌC VIÊN
// (Mỗi lớp tối đa 5 học viên, 8 học viên chưa có lớp đang tìm HLV)
// ==========================================

export const INITIAL_CLASSES: CoachClass[] = [
  {
    id: 'class_khoa_1',
    name: 'Lớp Chiến Thuật Dinking & Third Shot Drop',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    level: 'Trung cấp (DUPR 3.0 - 3.8)',
    schedule: 'Thứ 2 - Thứ 4 - Thứ 6 (18:00 - 19:30)',
    court_name: 'Sân Pickleball Saigon South Q7',
    area: 'Quận 7, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_1', 'user_student_2', 'user_student_3', 'user_student_4', 'user_student_5'],
    fee_per_student: 1200000,
    total_sessions: 6,
    start_date: '2026-08-20',
    status: 'active',
    description: 'Tập trung làm chủ đường bóng mềm dinking cự ly ngắn, phản xạ thả bóng rúc lưới an toàn từ vạch Baseline.'
  },
  {
    id: 'class_khoa_2',
    name: 'Lớp Đôi Nam Nữ Thực Chiến & Phản Xạ Kitchen',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    level: 'Nâng cao (DUPR 3.5 - 4.5)',
    schedule: 'Thứ 3 - Thứ 5 - Thứ 7 (07:30 - 09:00)',
    court_name: 'Sân V-Pickle Sala Q2',
    area: 'Quận 2, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_6', 'user_student_7', 'user_student_8', 'user_student_9'],
    fee_per_student: 1500000,
    total_sessions: 8,
    start_date: '2026-08-22',
    status: 'active',
    description: 'Chiến thuật phối hợp đôi, bọc lót di chuyển sân chữ Y, chống smash và phản xạ volley tốc độ cao.'
  },
  {
    id: 'class_anh_1',
    name: 'Lớp Nhập Môn Pickleball & Cầm Vợt Chuẩn IPTPA',
    coach_id: 'coach_anh',
    coach_name: 'Phạm Tuấn Anh',
    coach_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    level: 'Cơ bản (DUPR 2.0 - 2.8)',
    schedule: 'Thứ 3 - Thứ 5 (17:00 - 18:30)',
    court_name: 'Sân PickleClub Thảo Điền',
    area: 'TP. Thủ Đức, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_10', 'user_student_11', 'user_student_12', 'user_student_13', 'user_student_14'],
    fee_per_student: 950000,
    total_sessions: 6,
    start_date: '2026-08-21',
    status: 'active',
    description: 'Dành cho người mới bắt đầu: cầm vợt Continental, bước chân footwork, luật chơi Non-Volley Zone.'
  },
  {
    id: 'class_anh_2',
    name: 'Lớp Phòng Thủ Reset & Bước Chân Footwork',
    coach_id: 'coach_anh',
    coach_name: 'Phạm Tuấn Anh',
    coach_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    level: 'Cơ bản - Trung cấp (DUPR 2.5 - 3.2)',
    schedule: 'Thứ 7 - Chủ Nhật (08:00 - 09:30)',
    court_name: 'Sân VietPickle Bình Quới',
    area: 'Bình Thạnh, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_15', 'user_student_16', 'user_student_17', 'user_student_18'],
    fee_per_student: 1100000,
    total_sessions: 6,
    start_date: '2026-08-23',
    status: 'active',
    description: 'Chữa lỗi gồng cổ tay, hạ thấp trọng tâm khi đón bóng mạnh, hoàn thiện bộ chân di chuyển bao quát sân.'
  },
  {
    id: 'class_ha_1',
    name: 'Lớp Kỹ Thuật Chuyên Biệt Nữ & Tốc Độ Kitchen',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    level: 'Trung cấp (DUPR 2.8 - 3.6)',
    schedule: 'Thứ 2 - Thứ 4 (06:30 - 08:00)',
    court_name: 'Sân Westlake Pickleball Club',
    area: 'Tây Hồ, Hà Nội',
    max_students: 5,
    student_ids: ['user_student_19', 'user_student_20', 'user_student_21', 'user_student_22', 'user_student_23'],
    fee_per_student: 1350000,
    total_sessions: 6,
    start_date: '2026-08-20',
    status: 'active',
    description: 'Giáo án đặc biệt dành cho nữ học viên: phản xạ trên lưới Kitchen, tăng tốc độ xử lý bóng nhanh.'
  },
  {
    id: 'class_ha_2',
    name: 'Lớp Phát Bóng Xoáy Topspin & Smash Dứt Điểm',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    level: 'Trung - Cao cấp (DUPR 3.2 - 4.2)',
    schedule: 'Thứ 3 - Thứ 6 (18:00 - 19:30)',
    court_name: 'Sân Cầu Giấy Arena',
    area: 'Cầu Giấy, Hà Nội',
    max_students: 5,
    student_ids: ['user_student_24', 'user_student_25', 'user_student_26', 'user_student_27'],
    fee_per_student: 1400000,
    total_sessions: 6,
    start_date: '2026-08-22',
    status: 'active',
    description: 'Kỹ thuật giao bóng xoáy khó chịu, bật nhảy đập smash góc chết uy lực không cho đối phương cơ hội trả đòn.'
  },
  {
    id: 'class_nam_1',
    name: 'Lớp Đột Phá Erne & Kỹ Thuật ATP Miền Trung',
    coach_id: 'coach_nam',
    coach_name: 'Lê Hoàng Nam',
    coach_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    level: 'Nâng cao (DUPR 3.5 - 5.0)',
    schedule: 'Thứ 2 - Thứ 5 - Thứ 7 (07:00 - 08:30)',
    court_name: 'Sân Pickleball Sông Hàn',
    area: 'Hải Châu, Đà Nẵng',
    max_students: 5,
    student_ids: ['user_student_28', 'user_student_29', 'user_student_30', 'user_student_31', 'user_student_32'],
    fee_per_student: 1250000,
    total_sessions: 8,
    start_date: '2026-08-20',
    status: 'active',
    description: 'Huấn luyện đòn tuyệt chiêu Erne nhảy qua góc bếp và ATP (Around the Post) dứt điểm ngoài cột lưới.'
  },
  {
    id: 'class_quan_1',
    name: 'Lớp Phản Xạ Fast Hands & Tranh Chấp Lưới Kitchen',
    coach_id: 'coach_quan',
    coach_name: 'Đặng Minh Quân',
    coach_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    level: 'Trung cấp (DUPR 3.0 - 4.0)',
    schedule: 'Thứ 3 - Thứ 5 (18:30 - 20:00)',
    court_name: 'Sân Pickleball Hoa Lư Q1',
    area: 'Quận 1, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_33', 'user_student_34', 'user_student_35', 'user_student_36', 'user_student_37'],
    fee_per_student: 1300000,
    total_sessions: 6,
    start_date: '2026-08-21',
    status: 'active',
    description: 'Drill bài tập đèn màu và máy bắn bóng tự động để rèn tốc độ tay nhanh nhất khi đấu bóng giáp mặt.'
  },
  {
    id: 'class_long_1',
    name: 'Lớp Luyện Thi Đấu Đỉnh Cao DUPR 4.5+ (Chuyên Sâu)',
    coach_id: 'coach_long_pb',
    coach_name: 'Phan Bảo Long',
    coach_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    level: 'Chuyên nghiệp (DUPR 4.0 - 5.5)',
    schedule: 'Thứ 7 - Chủ Nhật (16:00 - 18:00)',
    court_name: 'Sân PMH Sports Arena Q7',
    area: 'Quận 7, TP.HCM',
    max_students: 5,
    student_ids: ['user_student_38', 'user_student_39', 'user_student_40', 'user_student_41', 'user_student_42'],
    fee_per_student: 1800000,
    total_sessions: 8,
    start_date: '2026-08-23',
    status: 'active',
    description: 'Chuẩn bị thi đấu các giải Open toàn quốc, chiến thuật áp đảo tâm lý, phân tích dữ liệu video cá nhân.'
  }
];

