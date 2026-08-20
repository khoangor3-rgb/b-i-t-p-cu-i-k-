import { 
  User, CoachProfile, AvailabilitySlot, Booking, Review, 
  SkillRating, TestCaseItem, CoachClass, Payment, PayoutHistory,
  AdminUser, AdminActionLog, CoachAvailabilityRule, CancellationPolicyRule,
  SessionReminder, UserReport, SessionRecap, WaitlistEntry, SkillLevel
} from '../types';

// ==========================================
// 1. DANH SÁCH 50+ HỌC VIÊN & HLV & ADMIN
// ==========================================

const STUDENT_NAMES = [
  { name: 'Trần Thị Lan', email: 'lan.tran@gmail.com', phone: '0912345678', loc: 'Bình Thạnh, TP.HCM', dupr: 3.2, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lê Hoàng Minh', email: 'minh.le@gmail.com', phone: '0987654321', loc: 'Cầu Giấy, Hà Nội', dupr: 2.5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Nguyễn Văn Hùng', email: 'hung.nguyen@gmail.com', phone: '0903112233', loc: 'Quận 7, TP.HCM', dupr: 3.8, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Phạm Thu Trang', email: 'trang.pham@gmail.com', phone: '0918223344', loc: 'Tây Hồ, Hà Nội', dupr: 3.0, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Võ Minh Phúc', email: 'phuc.vo@gmail.com', phone: '0933445566', loc: 'Hải Châu, Đà Nẵng', dupr: 3.5, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đỗ Thanh Thảo', email: 'thao.do@gmail.com', phone: '0977889900', loc: 'Quận 2, TP.HCM', dupr: 2.8, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Bùi Anh Tuấn', email: 'tuan.bui@gmail.com', phone: '0966112233', loc: 'Ba Đình, Hà Nội', dupr: 4.1, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Hoàng Thùy Linh', email: 'linh.hoang@gmail.com', phone: '0909556677', loc: 'Thủ Đức, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Ngô Việt Đức', email: 'duc.ngo@gmail.com', phone: '0938114477', loc: 'Sơn Trà, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Dương Hải Đăng', email: 'dang.duong@gmail.com', phone: '0944332211', loc: 'Phú Nhuận, TP.HCM', dupr: 3.6, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Trịnh Thảo Vy', email: 'vy.trinh@gmail.com', phone: '0988112233', loc: 'Quận 1, TP.HCM', dupr: 2.7, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lý Quốc Long', email: 'long.ly@gmail.com', phone: '0911223344', loc: 'Nam Từ Liêm, Hà Nội', dupr: 3.4, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đặng Thái Sơn', email: 'son.dang@gmail.com', phone: '0937665544', loc: 'Tân Bình, TP.HCM', dupr: 3.7, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Mai Hải Yến', email: 'yen.mai@gmail.com', phone: '0965332211', loc: 'Thanh Xuân, Hà Nội', dupr: 2.6, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Phan Minh Quân', email: 'quan.phan@gmail.com', phone: '0944118899', loc: 'Ngũ Hành Sơn, Đà Nẵng', dupr: 4.0, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lê Kim Ngân', email: 'ngan.le@gmail.com', phone: '0977223344', loc: 'Quận 7, TP.HCM', dupr: 3.3, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Vũ Đức Tâm', email: 'tam.vu@gmail.com', phone: '0908776655', loc: 'Hoàn Kiếm, Hà Nội', dupr: 3.9, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Huỳnh Đăng Khoa', email: 'khoa.huynh@gmail.com', phone: '0919334455', loc: 'Quận 3, TP.HCM', dupr: 2.9, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Tạ Huy Hoàng', email: 'hoang.ta@gmail.com', phone: '0981223344', loc: 'Hà Đông, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Cao Khánh Ly', email: 'ly.cao@gmail.com', phone: '0934112233', loc: 'Quận 2, TP.HCM', dupr: 3.0, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đoàn Phương Nam', email: 'nam.doan@gmail.com', phone: '0962445566', loc: 'Hải Châu, Đà Nẵng', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lương Quốc Bảo', email: 'bao.luong@gmail.com', phone: '0943556677', loc: 'Thủ Đức, TP.HCM', dupr: 3.4, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Chu Thu Phương', email: 'phuong.chu@gmail.com', phone: '0978990011', loc: 'Cầu Giấy, Hà Nội', dupr: 2.8, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đinh Thành Duy', email: 'duy.dinh@gmail.com', phone: '0901223344', loc: 'Quận 10, TP.HCM', dupr: 4.2, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Nguyễn Thu Hương', email: 'huong.nguyen@gmail.com', phone: '0915667788', loc: 'Long Biên, Hà Nội', dupr: 3.1, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Phạm Đức Trọng', email: 'trong.pham@gmail.com', phone: '0983114455', loc: 'Gò Vấp, TP.HCM', dupr: 3.5, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lê Ngọc Ánh', email: 'anh.le@gmail.com', phone: '0936225588', loc: 'Thanh Khê, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Trần Tuấn Vũ', email: 'vu.tran@gmail.com', phone: '0969113355', loc: 'Tây Hồ, Hà Nội', dupr: 3.8, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Vũ Hương Giang', email: 'giang.vu@gmail.com', phone: '0948332211', loc: 'Quận 4, TP.HCM', dupr: 2.7, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Bùi Thái Bình', email: 'binh.bui@gmail.com', phone: '0971556677', loc: 'Thủ Dầu Một, Bình Dương', dupr: 3.3, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Hoàng Trung Kiên', email: 'kien.hoang@gmail.com', phone: '0904112299', loc: 'Đống Đa, Hà Nội', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Nguyễn Như Mai', email: 'mai.nguyen@gmail.com', phone: '0916335577', loc: 'Quận 7, TP.HCM', dupr: 3.0, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Phan Tùng Lâm', email: 'lam.phan@gmail.com', phone: '0984221100', loc: 'Ba Đình, Hà Nội', dupr: 3.7, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đặng Thùy Dung', email: 'dung.dang@gmail.com', phone: '0932446688', loc: 'Sơn Trà, Đà Nẵng', dupr: 2.6, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Võ Quốc Huy', email: 'huy.vo@gmail.com', phone: '0963114466', loc: 'Bình Thạnh, TP.HCM', dupr: 3.9, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lê Uyên Nhi', email: 'nhi.le@gmail.com', phone: '0941557799', loc: 'Tây Hồ, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Trương Hải Đăng', email: 'dang.truong@gmail.com', phone: '0975331199', loc: 'Quận 2, TP.HCM', dupr: 4.1, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Dương Mỹ Hạnh', email: 'hanh.duong@gmail.com', phone: '0907224466', loc: 'Hải Châu, Đà Nẵng', dupr: 2.9, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lý Gia Phát', email: 'phat.ly@gmail.com', phone: '0913889900', loc: 'Quận 1, TP.HCM', dupr: 3.5, img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Tô Như Quỳnh', email: 'quynh.to@gmail.com', phone: '0986442200', loc: 'Cầu Giấy, Hà Nội', dupr: 3.4, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Mai Thành Tín', email: 'tin.mai@gmail.com', phone: '0939113377', loc: 'Tân Phú, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Nguyễn Thị Kim Loan', email: 'loan.nguyen@gmail.com', phone: '0968224488', loc: 'Hoàng Mai, Hà Nội', dupr: 2.5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Phạm Tiến Thành', email: 'thanh.pham@gmail.com', phone: '0942558811', loc: 'Quận 7, TP.HCM', dupr: 3.8, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Vũ Hoàng Oanh', email: 'oanh.vu@gmail.com', phone: '0979336600', loc: 'Ngũ Hành Sơn, Đà Nẵng', dupr: 3.0, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Bùi Tuấn Việt', email: 'viet.bui@gmail.com', phone: '0902114488', loc: 'Thủ Đức, TP.HCM', dupr: 3.6, img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Đỗ Kiều Diễm', email: 'diem.do@gmail.com', phone: '0914668822', loc: 'Ba Đình, Hà Nội', dupr: 2.8, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Hồ Trọng Nghĩa', email: 'nghia.ho@gmail.com', phone: '0985227744', loc: 'Quận 5, TP.HCM', dupr: 3.3, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Trần Bích Trâm', email: 'tram.tran@gmail.com', phone: '0931448800', loc: 'Tây Hồ, Hà Nội', dupr: 3.2, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Lê Minh Hiếu', email: 'hieu.le@gmail.com', phone: '0967339911', loc: 'Hải Châu, Đà Nẵng', dupr: 3.7, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
  { name: 'Nguyễn Bảo Ngọc', email: 'ngoc.bao@gmail.com', phone: '0949115533', loc: 'Quận 2, TP.HCM', dupr: 3.1, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80' },
];

export const INITIAL_USERS: User[] = [
  // 1. ADMINS (RBAC)
  {
    id: 'user_admin_1',
    full_name: 'Nguyễn Hải Long (Super Admin Lead)',
    email: 'long.admin@pickleconnect.vn',
    phone: '0908123456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    role: 'admin',
    admin_role: 'super_admin',
    created_at: '2026-08-01',
    status: 'active',
    location: 'Quận 1, TP.HCM'
  },
  {
    id: 'user_admin_support',
    full_name: 'Trần Minh Support (Support Admin)',
    email: 'support.admin@pickleconnect.vn',
    phone: '0908998877',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    role: 'admin',
    admin_role: 'support_admin',
    created_at: '2026-08-05',
    status: 'active',
    location: 'Cầu Giấy, Hà Nội'
  },
  {
    id: 'user_admin_finance',
    full_name: 'Phạm Thu Finance (Finance Admin)',
    email: 'finance.admin@pickleconnect.vn',
    phone: '0918776655',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    role: 'admin',
    admin_role: 'finance_admin',
    created_at: '2026-08-05',
    status: 'active',
    location: 'Quận 3, TP.HCM'
  },
  
  // 2. 10 HUẤN LUYỆN VIÊN (COACHES)
  {
    id: 'user_coach_khoa',
    full_name: 'Nguyễn Đăng Khoa (Coach Khoa)',
    email: 'khoa.coach@pickleconnect.vn',
    phone: '0933112233',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    role: 'coach',
    created_at: '2026-08-16',
    status: 'active',
    location: 'Hải Châu, Đà Nẵng'
  },

  // 3. 50 HỌC VIÊN (STUDENTS)
  ...STUDENT_NAMES.map((s, idx) => {
    let skillLevel: SkillLevel = 'intermediate';
    if (s.dupr < 2.9) skillLevel = 'beginner';
    else if (s.dupr > 3.6) skillLevel = 'competitive';

    return {
      id: `user_student_${idx + 1}`,
      full_name: s.name,
      email: s.email,
      phone: s.phone,
      avatar_url: s.img,
      role: 'student' as const,
      created_at: `2026-08-${String((idx % 15) + 1).padStart(2, '0')}`,
      status: 'active' as const,
      dupr_rating: s.dupr,
      skill_level: skillLevel,
      location: s.loc
    };
  })
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
    approval_status: 'approved',
    verified_at: '2026-08-02',
    verified_by: 'user_admin_1',
    approved_at: '2026-08-02',
    approved_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 4.9,
    review_count: 38,
    students_count: 64,
    total_sessions_taught: 48,
    response_rate_percent: 98,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt', 'English'],
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
    approval_status: 'approved',
    verified_at: '2026-08-03',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 24,
    students_count: 42,
    total_sessions_taught: 35,
    response_rate_percent: 96,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp'],
    languages: ['Tiếng Việt'],
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
    approval_status: 'approved',
    verified_at: '2026-08-04',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 5.0,
    review_count: 51,
    students_count: 85,
    total_sessions_taught: 62,
    response_rate_percent: 100,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt', 'English'],
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
    approval_status: 'approved',
    verified_at: '2026-08-05',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 4.9,
    review_count: 42,
    students_count: 70,
    total_sessions_taught: 53,
    response_rate_percent: 97,
    skill_levels_taught: ['Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt'],
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
    approval_status: 'approved',
    verified_at: '2026-08-06',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.9,
    review_count: 31,
    students_count: 55,
    total_sessions_taught: 40,
    response_rate_percent: 95,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt', 'English'],
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
    approval_status: 'approved',
    verified_at: '2026-08-07',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 29,
    students_count: 48,
    total_sessions_taught: 38,
    response_rate_percent: 94,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp'],
    languages: ['Tiếng Việt'],
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
    approval_status: 'approved',
    verified_at: '2026-08-08',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.9,
    review_count: 36,
    students_count: 58,
    total_sessions_taught: 46,
    response_rate_percent: 98,
    skill_levels_taught: ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt'],
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
    approval_status: 'approved',
    verified_at: '2026-08-09',
    verified_by: 'user_admin_1',
    is_featured: true,
    rating_avg: 5.0,
    review_count: 65,
    students_count: 98,
    total_sessions_taught: 92,
    response_rate_percent: 100,
    skill_levels_taught: ['Trung cấp', 'Nâng cao'],
    languages: ['Tiếng Việt', 'English'],
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
    approval_status: 'approved',
    verified_at: '2026-08-10',
    verified_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 4.8,
    review_count: 18,
    students_count: 32,
    total_sessions_taught: 22,
    response_rate_percent: 92,
    skill_levels_taught: ['Mới bắt đầu'],
    languages: ['Tiếng Việt'],
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
    approval_status: 'pending',
    is_featured: false,
    rating_avg: 0,
    review_count: 0,
    students_count: 0,
    total_sessions_taught: 0,
    response_rate_percent: 100,
    skill_levels_taught: ['Mới bắt đầu'],
    languages: ['Tiếng Việt'],
    dupr_level: 4.0,
    created_at: '2026-08-16'
  },
  {
    id: 'coach_new_zero',
    user_id: 'user_coach_new_zero',
    bio: 'HLV trẻ nhiệt huyết vừa hoàn thành chứng chỉ IPTPA Level 1. Đam mê truyền tải kỹ thuật chuẩn chỉ cho học viên mới.',
    experience_years: 1,
    price_per_session: 280000,
    area: 'Quận 7, TP.HCM',
    courts: ['Sân Pickleball Saigon South Q7'],
    specialties: ['Người mới bắt đầu', 'Kỹ thuật Dinking căn bản'],
    teaching_style: 'Kiên nhẫn, chỉ dẫn từng động tác, hỗ trợ video quay chậm.',
    gallery_urls: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'],
    certifications: [
      {
        id: 'cert_zero_1',
        title: 'IPTPA Certified Instructor Level 1',
        issuer: 'IPTPA International',
        year: 2026,
        proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
        verified: true
      }
    ],
    packages: [
      { id: 'pkg_1', title: 'Buổi Trải Nghiệm Khởi Động (1 buổi)', sessions: 1, discount_percent: 0, description: 'Làm quen bộ môn Pickleball chuẩn quốc tế.' }
    ],
    verification_status: 'verified',
    approval_status: 'approved',
    approved_at: '2026-08-17',
    approved_by: 'user_admin_1',
    is_featured: false,
    rating_avg: 0,
    review_count: 0,
    students_count: 0,
    total_sessions_taught: 0,
    response_rate_percent: 100,
    skill_levels_taught: ['Mới bắt đầu'],
    languages: ['Tiếng Việt'],
    dupr_level: 3.8,
    created_at: '2026-08-17'
  },
  {
    id: 'coach_suspended',
    user_id: 'user_coach_suspended',
    bio: 'HLV từng hoạt động nhưng hiện đang bị tạm đình chỉ do vi phạm quy định sàn (bị học viên khiếu nại). Các booking cũ vẫn được giải quyết bình thường.',
    experience_years: 2,
    price_per_session: 320000,
    area: 'Quận 2, TP.HCM',
    courts: ['Sân V-Pickle Sala Q2'],
    specialties: ['Kỹ thuật nâng cao'],
    teaching_style: 'Thực chiến',
    gallery_urls: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600'],
    certifications: [],
    packages: [
      { id: 'pkg_1', title: 'Buổi Tập (1 buổi)', sessions: 1, discount_percent: 0, description: 'Tập kỹ thuật.' }
    ],
    verification_status: 'verified',
    approval_status: 'suspended',
    rejection_reason: 'Tài khoản đang bị tạm ngưng nhận lịch mới do có 2 khiếu nại chất lượng buổi học.',
    is_featured: false,
    rating_avg: 3.2,
    review_count: 5,
    students_count: 10,
    total_sessions_taught: 8,
    response_rate_percent: 60,
    skill_levels_taught: ['Trung cấp'],
    languages: ['Tiếng Việt'],
    dupr_level: 4.0,
    created_at: '2026-08-01'
  }
];

// ==========================================
// 2.1 BẢNG COACH AVAILABILITY (2 TẦNG: LẶP LẠI & NGÀY CỤ THỂ + BLOCKED)
// ==========================================
export const INITIAL_COACH_AVAILABILITY_RULES: CoachAvailabilityRule[] = [
  // HLV Khoa: Lịch rảnh lặp lại Thứ 2 (1), Thứ 4 (3), Thứ 6 (5), Chủ Nhật (0)
  { id: 'rule_av_1', coach_id: 'coach_khoa', day_of_week: 1, start_time: '07:30', end_time: '09:30', court_name: 'Sân Pickleball Saigon South Q7', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_2', coach_id: 'coach_khoa', day_of_week: 3, start_time: '18:00', end_time: '20:00', court_name: 'Sân V-Pickle Sala Q2', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_3', coach_id: 'coach_khoa', day_of_week: 5, start_time: '17:30', end_time: '19:30', court_name: 'Sân D-Pickle City Thảo Điền', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_4', coach_id: 'coach_khoa', day_of_week: 0, start_time: '08:00', end_time: '10:30', court_name: 'Sân Pickleball Saigon South Q7', is_blocked: false, created_at: '2026-08-01' },
  
  // Specific date rảnh: 2026-08-20, 2026-08-21, 2026-08-22, 2026-08-23
  { id: 'rule_av_5', coach_id: 'coach_khoa', specific_date: '2026-08-20', start_time: '08:00', end_time: '10:00', court_name: 'Sân Pickleball Saigon South Q7', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_6', coach_id: 'coach_khoa', specific_date: '2026-08-20', start_time: '17:00', end_time: '19:00', court_name: 'Sân V-Pickle Sala Q2', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_7', coach_id: 'coach_khoa', specific_date: '2026-08-21', start_time: '07:30', end_time: '09:30', court_name: 'Sân D-Pickle City Thảo Điền', is_blocked: false, created_at: '2026-08-01' },
  { id: 'rule_av_8', coach_id: 'coach_khoa', specific_date: '2026-08-21', start_time: '18:00', end_time: '20:00', court_name: 'Sân V-Pickle Sala Q2', is_blocked: false, created_at: '2026-08-01' },

  // Blocked date test (TC4 - Priority test): Ngày 2026-08-25 HLV Khoa bận việc riêng (is_blocked = true) ghi đè lịch lặp
  { id: 'rule_av_blocked_1', coach_id: 'coach_khoa', specific_date: '2026-08-25', start_time: '00:00', end_time: '23:59', court_name: 'Nghỉ cá nhân', is_blocked: true, created_at: '2026-08-02' }
];

// ==========================================
// 2.2 BẢNG QUY TẮC CHÍNH SÁCH HỦY & HOÀN TIỀN (CANCELLATION POLICY RULES)
// ==========================================
export const INITIAL_CANCELLATION_RULES: CancellationPolicyRule[] = [
  {
    id: 'rule_cancel_24h',
    hours_before_session: 24,
    refund_percent: 100,
    applies_to: 'student_cancel',
    title: 'Học viên hủy trước ≥ 24 giờ',
    description: 'Hoàn tiền 100% học phí về tài khoản/ví học viên. Không phát sinh bất kỳ khoản phí phạt nào.'
  },
  {
    id: 'rule_cancel_2_24h',
    hours_before_session: 2,
    refund_percent: 50,
    applies_to: 'student_cancel',
    title: 'Học viên hủy trong khoảng 2h - 24h',
    description: 'Hoàn tiền 50% cho học viên. 50% còn lại giải ngân cho HLV để bù đắp thời gian và giữ sân.'
  },
  {
    id: 'rule_cancel_under_2h',
    hours_before_session: 0,
    refund_percent: 0,
    applies_to: 'student_cancel',
    title: 'Học viên hủy sát giờ (< 2 giờ)',
    description: 'Hoàn tiền 0%. 90% học phí được giải ngân đầy đủ cho HLV (sau trừ 10% phí sàn).'
  },
  {
    id: 'rule_coach_cancel_anytime',
    hours_before_session: 0,
    refund_percent: 100,
    applies_to: 'coach_cancel',
    title: 'HLV chủ động hủy buổi học',
    description: 'Học viên luôn được hoàn tiền 100% học phí bất kể thời gian hủy. HLV có thể bị ghi nhận vi phạm tỷ lệ phục vụ.'
  },
  {
    id: 'rule_no_show_student',
    hours_before_session: 0,
    refund_percent: 0,
    applies_to: 'no_show',
    title: 'Học viên vắng mặt không báo trước (No-show)',
    description: 'Hoàn tiền 0%. HLV được giải ngân đầy đủ học phí do đã có mặt tại sân đúng giờ.'
  },
  {
    id: 'rule_no_show_coach',
    hours_before_session: 0,
    refund_percent: 100,
    applies_to: 'no_show',
    title: 'HLV vắng mặt không báo trước (No-show)',
    description: 'Hoàn tiền 100% cho học viên. HLV bị phạt cảnh cáo và tạm khóa nhận lịch mới.'
  }
];

// ==========================================
// 2.3 BẢNG ADMIN USERS & RBAC ROLES
// ==========================================
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin_user_super',
    user_id: 'user_admin_1',
    user_name: 'Nguyễn Hải Long (Super Admin Lead)',
    email: 'long.admin@pickleconnect.vn',
    role_name: 'super_admin',
    permissions: ['approve_coach', 'resolve_dispute', 'view_finance', 'manage_admins', 'manual_refund', 'suspend_coach', 'hide_review'],
    created_at: '2026-08-01'
  },
  {
    id: 'admin_user_support',
    user_id: 'user_admin_support',
    user_name: 'Trần Minh Support (Support Admin)',
    email: 'support.admin@pickleconnect.vn',
    role_name: 'support_admin',
    permissions: ['approve_coach', 'resolve_dispute', 'suspend_coach', 'hide_review'],
    created_at: '2026-08-05'
  },
  {
    id: 'admin_user_finance',
    user_id: 'user_admin_finance',
    user_name: 'Phạm Thu Finance (Finance Admin)',
    email: 'finance.admin@pickleconnect.vn',
    role_name: 'finance_admin',
    permissions: ['view_finance', 'manual_refund', 'resolve_dispute'],
    created_at: '2026-08-05'
  }
];

// ==========================================
// 2.4 BẢNG NHẬT KÝ ADMIN ACTION LOGS (AUDIT TRAIL)
// ==========================================
export const INITIAL_ADMIN_LOGS: AdminActionLog[] = [
  {
    id: 'log_1',
    admin_id: 'admin_user_super',
    admin_name: 'Nguyễn Hải Long',
    role_name: 'super_admin',
    action: 'APPROVE_COACH',
    target_type: 'coach',
    target_id: 'coach_khoa',
    details: 'Phê duyệt hồ sơ HLV IPTPA Level 2 và cấp huy hiệu Verified',
    timestamp: '2026-08-02 10:15'
  },
  {
    id: 'log_2',
    admin_id: 'admin_user_finance',
    admin_name: 'Phạm Thu Finance',
    role_name: 'finance_admin',
    action: 'RELEASE_ESCROW',
    target_type: 'payment',
    target_id: 'pay_2',
    details: 'Giải ngân 405.000đ cho HLV Nguyễn Đăng Khoa sau khi buổi học hoàn thành',
    timestamp: '2026-08-10 18:00'
  },
  {
    id: 'log_3',
    admin_id: 'admin_user_support',
    admin_name: 'Trần Minh Support',
    role_name: 'support_admin',
    action: 'VERIFY_DOCUMENTS',
    target_type: 'coach',
    target_id: 'coach_ha',
    details: 'Xác minh chứng chỉ PPR Level 2 Head Coach hợp lệ',
    timestamp: '2026-08-04 14:20'
  }
];

// ==========================================
// 2.5 BẢNG NHẮC LỊCH SESSION REMINDERS (CRON SCHEDULER)
// ==========================================
export const INITIAL_REMINDERS: SessionReminder[] = [
  {
    id: 'rem_1',
    booking_id: 'book_khoa_1',
    reminder_type: '24h_before',
    recipient_type: 'student',
    recipient_id: 'user_1',
    recipient_name: 'Trần Thị Lan',
    booking_summary: 'Buổi học Third Shot Drop & Kỹ thuật Dinking với HLV Nguyễn Đăng Khoa',
    session_start_time: '2026-08-20 08:00',
    sent_at: '2026-08-19 08:00',
    status: 'sent',
    created_at: '2026-08-18'
  },
  {
    id: 'rem_2',
    booking_id: 'book_khoa_1',
    reminder_type: '24h_before',
    recipient_type: 'coach',
    recipient_id: 'user_coach_khoa',
    recipient_name: 'Nguyễn Đăng Khoa',
    booking_summary: 'Buổi dạy học viên Trần Thị Lan lúc 08:00 tại Sân Saigon South Q7',
    session_start_time: '2026-08-20 08:00',
    sent_at: '2026-08-19 08:00',
    status: 'sent',
    created_at: '2026-08-18'
  }
];

// ==========================================
// 2.6 BẢNG BÁO CÁO HÀNH VI (QUICK REPORTS - KHÁC DISPUTE)
// ==========================================
export const INITIAL_REPORTS: UserReport[] = [
  {
    id: 'rep_1',
    reporter_id: 'user_1',
    reporter_name: 'Trần Thị Lan',
    reporter_role: 'student',
    reported_user_id: 'user_coach_hoang',
    reported_user_name: 'Lê Hoàng Nam',
    reported_user_role: 'coach',
    booking_id: null,
    reason_category: 'inappropriate_behavior',
    description: 'HLV có thái độ thiếu nhiệt tình và sử dụng điện thoại liên tục trong suốt 30 phút đầu buổi tập.',
    status: 'open',
    created_at: '2026-08-15 09:30'
  },
  {
    id: 'rep_2',
    reporter_id: 'user_2',
    reporter_name: 'Lê Hoàng Minh',
    reporter_role: 'student',
    reported_user_id: 'user_coach_duy',
    reported_user_name: 'Đinh Khắc Duy',
    reported_user_role: 'coach',
    booking_id: 'book_duy_1',
    reason_category: 'fake_profile',
    description: 'Thông tin chứng chỉ IPTPA trên hồ sơ không trùng khớp với tên thật khi xuất trình thẻ.',
    status: 'reviewing',
    handled_by: 'admin_user_support',
    handler_name: 'Trần Minh Support',
    resolution_note: 'Đang yêu cầu HLV gửi bản scan thẻ chứng chỉ gốc có mộc giáp lai để đối chiếu.',
    created_at: '2026-08-14 15:45'
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
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0912345678',
    student_email: 'lan.tran@gmail.com',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0912345678',
    student_email: 'lan.tran@gmail.com',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0987654321',
    student_email: 'minh.le@gmail.com',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0903112233',
    student_email: 'hung.nguyen@gmail.com',
    coach_id: 'coach_nam',
    coach_name: 'Lê Hoàng Nam',
    coach_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
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
  },
  {
    id: 'booking_sample_dispute',
    student_id: 'user_student_6',
    student_name: 'Đỗ Thanh Thảo',
    student_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0977889900',
    student_email: 'thao.do@gmail.com',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    slot_id: 'slot_6',
    date: '2026-08-14',
    start_time: '18:00',
    end_time: '19:30',
    court_name: 'Sân D-Pickle City Thảo Điền',
    package_title: 'Buổi Trải Nghiệm & Đánh Giá (1 buổi)',
    session_count: 1,
    total_price: 450000,
    status: 'confirmed',
    notes: 'Kiểm tra kỹ thuật dinking.',
    created_at: '2026-08-13',
    has_reviewed: false
  },
  {
    id: 'booking_sample_refund',
    student_id: 'user_student_4',
    student_name: 'Phạm Thu Trang',
    student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    student_phone: '0918223344',
    student_email: 'trang.pham@gmail.com',
    coach_id: 'coach_anh',
    coach_name: 'Phạm Tuấn Anh',
    coach_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    slot_id: 'slot_anh_2',
    date: '2026-08-12',
    start_time: '17:00',
    end_time: '18:30',
    court_name: 'Sân Pickleball Thảo Điền',
    package_title: 'Gói Cơ Bản Vững Vàng (3 buổi)',
    session_count: 3,
    total_price: 1083000,
    status: 'cancelled',
    cancellation_reason: 'Học viên hủy trước 48h (Hoàn 100% Escrow)',
    notes: 'Lịch công tác đột xuất.',
    created_at: '2026-08-10',
    has_reviewed: false
  }
];

// ==========================================
// 4.1. DANH SÁCH GIAO DỊCH THANH TOÁN TẠM GIỮ (ESCROW PAYMENTS)
// ==========================================

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    booking_id: 'booking_1',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    amount: 1282500,
    commission_rate: 0.10,
    commission_amount: 128250,
    payout_amount: 1154250,
    status: 'held',
    paid_at: '2026-08-15 08:30',
    payment_method: 'qr_escrow'
  },
  {
    id: 'pay_2',
    booking_id: 'booking_2',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    amount: 450000,
    commission_rate: 0.10,
    commission_amount: 45000,
    payout_amount: 405000,
    status: 'released',
    paid_at: '2026-08-08 14:00',
    released_at: '2026-08-10 18:00',
    payment_method: 'pickle_wallet'
  },
  {
    id: 'pay_3',
    booking_id: 'booking_3',
    student_id: 'user_student_2',
    student_name: 'Lê Hoàng Minh',
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    amount: 1410000,
    commission_rate: 0.10,
    commission_amount: 141000,
    payout_amount: 1269000,
    status: 'held',
    paid_at: '2026-08-16 10:15',
    payment_method: 'card_visa'
  },
  {
    id: 'pay_4',
    booking_id: 'booking_4',
    student_id: 'user_student_3',
    student_name: 'Nguyễn Văn Hùng',
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_nam',
    coach_name: 'Lê Hoàng Nam',
    amount: 1197000,
    commission_rate: 0.10,
    commission_amount: 119700,
    payout_amount: 1077300,
    status: 'held',
    paid_at: '2026-08-14 11:20',
    payment_method: 'qr_escrow'
  },
  {
    id: 'pay_5',
    booking_id: 'booking_sample_dispute',
    student_id: 'user_student_6',
    student_name: 'Đỗ Thanh Thảo',
    student_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    amount: 450000,
    commission_rate: 0.10,
    commission_amount: 45000,
    payout_amount: 405000,
    status: 'disputed',
    paid_at: '2026-08-13 14:20',
    dispute_reason: 'HLV đến trễ 20 phút do kẹt xe và buổi tập kết thúc vội, học viên đề nghị hoàn tiền hoặc sắp xếp 1 buổi học bù đảm bảo cam kết chất lượng.',
    payment_method: 'qr_escrow'
  },
  {
    id: 'pay_6',
    booking_id: 'booking_sample_refund',
    student_id: 'user_student_4',
    student_name: 'Phạm Thu Trang',
    student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80',
    coach_id: 'coach_anh',
    coach_name: 'Phạm Tuấn Anh',
    amount: 1083000,
    commission_rate: 0.10,
    commission_amount: 108300,
    payout_amount: 974700,
    status: 'refunded',
    paid_at: '2026-08-10 09:15',
    refunded_at: '2026-08-11 10:30',
    refund_reason: 'Học viên có lịch công tác đột xuất, thực hiện hủy trước 48h theo chính sách (Hoàn 100% qua Escrow).',
    payment_method: 'pickle_wallet'
  }
];

export const INITIAL_PAYOUTS: PayoutHistory[] = [
  {
    id: 'payout_1',
    coach_id: 'coach_khoa',
    payment_id: 'pay_2',
    booking_id: 'booking_2',
    amount: 405000,
    created_at: '2026-08-10 18:00'
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
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    student_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_khoa',
    rating: 5,
    comment: 'Khóa học chất lượng cao, đúng chuẩn quốc tế IPTPA. Thầy Khoa có bài tập drill với máy bắn bóng giúp phản xạ lưới tiến bộ trông thấy!',
    created_at: '2026-08-09',
    is_hidden: false,
    skill_tags: ['Tiến bộ nhanh', 'Drill thực chiến', 'Chuẩn IPTPA']
  },
  {
    id: 'rev_3',
    booking_id: 'booking_old_2',
    student_id: 'user_student_4',
    student_name: 'Phạm Thu Trang',
    student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_ha',
    rating: 5,
    comment: 'Cô Hà dạy cực kỳ dễ hiểu, truyền cảm hứng rất tốt cho các bạn nữ mới chơi. Sân tập đẹp, giáo án bài bản và tâm lý.',
    created_at: '2026-08-12',
    is_hidden: false,
    coach_reply: 'Cảm ơn Trang! Cố gắng duy trì phản xạ tay chân nhịp nhàng như buổi rồi là sẽ lên DUPR 3.5 sớm thôi.',
    skill_tags: ['Phù hợp cho nữ', 'Dễ hiểu & Chu đáo', 'Tâm lý & Kiên nhẫn']
  },
  {
    id: 'rev_4',
    booking_id: 'booking_old_3',
    student_id: 'user_student_2',
    student_name: 'Lê Hoàng Minh',
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_anh',
    rating: 5,
    comment: 'Thầy Tuấn Anh chỉ dẫn kỹ thuật Dinking góc chéo và Reset bóng cực kỳ chi tiết. Từ người chưa biết gì sau 5 buổi đã tự tin thi đấu giao lưu!',
    created_at: '2026-08-14',
    is_hidden: false,
    coach_reply: 'Tuyệt vời lắm Minh, cảm giác bóng của em đã lên tay rất nhiều!',
    skill_tags: ['Dinking đối kháng', 'Tận tình', 'Sửa dáng chuẩn']
  },
  {
    id: 'rev_5',
    booking_id: 'booking_old_4',
    student_id: 'user_student_5',
    student_name: 'Hoàng Quốc Bảo',
    student_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_long_pb',
    rating: 5,
    comment: 'Thầy Bảo Long ở đẳng cấp chuyên gia quốc tế thực thụ. Buổi thẩm định DUPR và giáo án chiến thuật đôi nam giúp team mình thắng giải cúp giao lưu CLB.',
    created_at: '2026-08-13',
    is_hidden: false,
    coach_reply: 'Chúc mừng Bảo và đồng đội, giữ vững phong độ thi đấu cự ly lưới nhé!',
    skill_tags: ['DUPR 5.0+ Đỉnh cao', 'Chiến thuật thi đấu', 'Chuyên gia Master']
  },
  {
    id: 'rev_6',
    booking_id: 'booking_old_5',
    student_id: 'user_student_3',
    student_name: 'Nguyễn Văn Hùng',
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_nam',
    rating: 5,
    comment: 'HLV Hoàng Nam ở Đà Nẵng dạy rất chuyên nghiệp. Sân bãi thoáng mát, bài tập di chuyển chân và cú Erne cực kỳ ăn điểm.',
    created_at: '2026-08-15',
    is_hidden: false,
    skill_tags: ['Chiến thuật Erne', 'Di chuyển Footwork', 'Đà Nẵng uy tín']
  },
  {
    id: 'rev_7',
    booking_id: 'booking_old_6',
    student_id: 'user_student_6',
    student_name: 'Đặng Thanh Thảo',
    student_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_ngoc',
    rating: 5,
    comment: 'Cô Ngọc rất nhẹ nhàng, chỉ bảo từng cú đập bóng và đỡ giao bóng cho người mới bắt đầu. Không hề bị áp lực hay sợ hãi.',
    created_at: '2026-08-16',
    is_hidden: false,
    coach_reply: 'Cảm ơn Thảo, tiếp tục phát huy sự tự tin trên sân nhé!',
    skill_tags: ['Nhập môn êm ái', 'Thân thiện', 'Chu đáo']
  },
  {
    id: 'rev_8',
    booking_id: 'booking_old_7',
    student_id: 'user_student_8',
    student_name: 'Vũ Đức Thịnh',
    student_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
    coach_id: 'coach_vinh',
    rating: 5,
    comment: 'Mình chuyển từ Tennis sang Pickleball hay bị lỗi vung vợt quá rộng, thầy Vinh chỉnh đúng 2 buổi là bóng vào form sắc bén ngay!',
    created_at: '2026-08-14',
    is_hidden: false,
    skill_tags: ['Chuyển từ Tennis', 'Sửa lỗi chuẩn xác', 'USPTA Pro']
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
  },
  {
    id: 'TC-P01',
    title: 'Học viên đặt lịch thành công -> payment.status = held',
    module: 'Thanh toán Escrow (Lan)',
    steps: '1. Học viên chọn HLV & gói học\n2. Bấm Xác nhận & Thanh toán Escrow\n3. Kiểm tra bản ghi payment',
    expected: 'payment.status = "held", số tiền gốc khớp 100%, hoa hồng 10% được tính toán trước',
    actual: 'Tạo bản ghi payment trạng thái held thành công, tiền lưu trong quỹ bảo chứng',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P02',
    title: 'HLV từ chối booking -> payment tự động chuyển refunded',
    module: 'Thanh toán Escrow (HLV Khoa)',
    steps: '1. HLV nhận yêu cầu đặt lịch\n2. HLV bấm Từ chối đơn\n3. Kiểm tra trạng thái payment',
    expected: 'payment.status tự động chuyển sang "refunded", hoàn tiền 100% cho học viên',
    actual: 'Hệ thống tự động refund, giải phóng slot và ghi nhận lý do từ chối',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P03',
    title: 'Học viên huỷ trước 24h -> hoàn 100%, payment.status = refunded',
    module: 'Thanh toán Escrow (Học viên)',
    steps: '1. Học viên vào Lịch học của tôi\n2. Chọn đơn Pending/Confirmed trước 24h\n3. Bấm Hủy lịch học',
    expected: 'Hệ thống hoàn tiền 100% qua Escrow, payment.status = "refunded"',
    actual: 'Hoàn trả 100% tiền tạm giữ, cập nhật badge Đã hoàn tiền',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P04',
    title: 'Học viên huỷ dưới 24h -> áp dụng chính sách hoàn theo quy định',
    module: 'Thanh toán Escrow (Học viên)',
    steps: '1. Học viên hủy sát giờ (<24h)\n2. Hệ thống kiểm tra điều kiện thời gian\n3. Tính toán tỷ lệ hoàn',
    expected: 'Hiển thị popup cảnh báo chính sách hoàn tiền sát giờ và xử lý đúng nghiệp vụ',
    actual: 'Áp dụng chính sách hoàn minh bạch, thông báo rõ ràng cho học viên',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P05',
    title: 'Booking chuyển completed -> payment tự động chuyển released',
    module: 'Thanh toán Escrow (HLV)',
    steps: '1. Buổi học diễn ra xong\n2. HLV/Hệ thống bấm Xác nhận hoàn thành\n3. Kiểm tra payout_amount',
    expected: 'payment.status = "released", payout_amount = amount * 0.9 (trừ 10% hoa hồng)',
    actual: 'Giải ngân thành công, cộng vào thu nhập thực nhận của HLV, tạo bản ghi payout_history',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P06',
    title: 'Admin xem trang giao dịch -> hiển thị đúng, đủ tất cả trạng thái',
    module: 'Admin (Long)',
    steps: '1. Đăng nhập quyền Admin\n2. Vào Quản lý Giao dịch Escrow\n3. Lọc theo held / released / refunded / disputed',
    expected: 'Hiển thị đầy đủ số liệu GMV, Quỹ Escrow, Doanh thu hoa hồng và bộ lọc trạng thái',
    actual: 'Thống kê chuẩn xác 100%, bộ lọc phản hồi tức thì',
    status: 'Pass',
    tested_by: 'Quân (Tester)'
  },
  {
    id: 'TC-P07',
    title: 'Validate an toàn commission_rate (Tránh lỗi NaN/Null)',
    module: 'Core System Backend',
    steps: '1. Giả lập trường hợp commission_rate = null khi tạo payment\n2. Hệ thống validate và gán mặc định 0.10\n3. Tính toán payout_amount',
    expected: 'Hệ thống tự động fallback về 10% (0.10), không phát sinh lỗi NaN',
    actual: 'Validation hoạt động an toàn tuyệt đối, payout_amount luôn tính toán chuẩn',
    status: 'Pass',
    tested_by: 'Long (Backend)'
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
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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
    coach_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&facepad=3&w=300&h=300&q=80',
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

// ==========================================
// 10. DANH SÁCH THÔNG BÁO HỆ THỐNG (NOTIFICATIONS)
// ==========================================
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    user_id: 'user_student_1',
    title: 'Xác nhận buổi học thành công',
    message: 'HLV Trần Minh Tuấn đã xác nhận buổi học ngày 2026-08-20 (08:00 - 09:30). Chúc bạn có buổi tập hiệu quả!',
    type: 'booking' as const,
    related_id: 'bk_1',
    is_read: false,
    created_at: '2026-08-18 09:30'
  },
  {
    id: 'notif_2',
    user_id: 'user_student_1',
    title: 'Ký quỹ Escrow an toàn',
    message: 'Học phí 1.200.000đ của bạn đang được tạm giữ an toàn trong Quỹ Bảo Chứng Escrow theo chính sách Love Your Lesson.',
    type: 'payment' as const,
    related_id: 'pay_1',
    is_read: false,
    created_at: '2026-08-18 09:28'
  },
  {
    id: 'notif_3',
    user_id: 'user_coach_1',
    title: 'Yêu cầu đặt lịch mới',
    message: 'Học viên Nguyễn Văn An vừa đặt lịch tập "Gói Nhập Môn Nhanh (3 buổi)" vào ngày 2026-08-20.',
    type: 'booking' as const,
    related_id: 'bk_1',
    is_read: false,
    created_at: '2026-08-18 09:25'
  },
  {
    id: 'notif_4',
    user_id: 'user_coach_1',
    title: 'Đã giải ngân thu nhập',
    message: 'Bạn vừa được giải ngân 405.000đ (90% học phí sau trừ 10% phí sàn) cho buổi học hoàn thành.',
    type: 'payment' as const,
    related_id: 'pay_3',
    is_read: true,
    created_at: '2026-08-17 17:00'
  },
  {
    id: 'notif_5',
    user_id: 'user_admin_1',
    title: 'Hồ sơ HLV mới chờ duyệt',
    message: 'Có hồ sơ HLV mới đang chờ duyệt: Vũ Hải Đăng (Đà Nẵng). Vui lòng kiểm tra chứng chỉ.',
    type: 'verification' as const,
    related_id: 'coach_pending',
    is_read: false,
    created_at: '2026-08-18 08:00'
  },
  {
    id: 'notif_6',
    user_id: 'user_coach_1',
    title: 'Đánh giá 5 sao mới',
    message: 'Học viên Lê Thị Bình vừa đánh giá 5 sao cho bạn: "Thầy Tuấn dạy dinking và drop shot siêu kỹ..."',
    type: 'review' as const,
    related_id: 'rev_1',
    is_read: false,
    created_at: '2026-08-18 07:15'
  }
];

// ==========================================
// 11. DANH SÁCH HLV YÊU THÍCH (WISHLISTS)
// ==========================================
export const INITIAL_WISHLISTS = [
  {
    id: 'wish_1',
    student_id: 'user_student_1',
    coach_id: 'coach_tuan',
    created_at: '2026-08-17'
  },
  {
    id: 'wish_2',
    student_id: 'user_student_1',
    coach_id: 'coach_huong',
    created_at: '2026-08-18'
  }
];

// ==========================================
// 12. DANH SÁCH SESSION RECAPS (HÀNH TRÌNH TIẾN BỘ 4 KỸ NĂNG)
// ==========================================
export const INITIAL_SESSION_RECAPS: SessionRecap[] = [
  {
    id: 'recap_1',
    booking_id: 'book_khoa_1',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    note: 'Học viên nắm bắt rất nhanh form chân dink chéo sân và bộ pháp Kitchen. Cần chú ý giữ mặt vợt mở và không vung vợt quá cao khi đối phương smash bóng mạnh.',
    skill_serve: 4,
    skill_dink: 5,
    skill_volley: 4,
    skill_positioning: 4,
    created_at: '2026-08-11 10:15',
    is_late: false,
    booking_date: '2026-08-11',
    booking_court: 'Sân Pickleball Saigon South Q7'
  },
  {
    id: 'recap_2',
    booking_id: 'book_khoa_2',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    student_id: 'user_student_2',
    student_name: 'Lê Hoàng Minh',
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    note: 'Tiến bộ rõ rệt ở kỹ năng Third Shot Drop từ vạch cuối sân (Baseline). Phát bóng cần mở rộng biên độ hông để tạo độ xoáy sâu hơn vào góc trái của đối thủ.',
    skill_serve: 3,
    skill_dink: 4,
    skill_volley: 4,
    skill_positioning: 3,
    created_at: '2026-08-14 18:30',
    is_late: false,
    booking_date: '2026-08-14',
    booking_court: 'Sân D-Pickle City Thảo Điền'
  },
  {
    id: 'recap_3',
    booking_id: 'book_ha_1',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    student_id: 'user_student_3',
    student_name: 'Nguyễn Văn Hùng',
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    note: 'Cú volley phản xạ trên lưới rất dứt khoát và chuẩn xác. Cần giữ thăng bằng tốt hơn khi lùi đón bóng bổng (lob) và phối hợp nhịp nhàng với đồng đội khi chuyển đổi trạng thái.',
    skill_serve: 5,
    skill_dink: 4,
    skill_volley: 5,
    skill_positioning: 4,
    created_at: '2026-08-12 16:45',
    is_late: false,
    booking_date: '2026-08-12',
    booking_court: 'Sân Westlake Pickleball Club'
  }
];

// ==========================================
// 13. DANH SÁCH CHỜ WAITLIST (FIFO CHO CA TẬP HOT)
// ==========================================
export const INITIAL_WAITLIST_ENTRIES: WaitlistEntry[] = [
  {
    id: 'wait_1',
    booking_id: 'slot_hot_khoa_sat',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    student_id: 'user_student_2',
    student_name: 'Lê Hoàng Minh',
    student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    student_phone: '0987654321',
    position: 1,
    status: 'waiting',
    created_at: '2026-08-18 07:30',
    session_summary: 'Ca Tập Chuyên Sâu Kỹ Thuật (17:00 - 18:30)',
    date: '2026-08-22',
    time: '17:00 - 18:30',
    court_name: 'Sân Pickleball Saigon South Q7',
    price: 450000
  },
  {
    id: 'wait_2',
    booking_id: 'slot_hot_khoa_sat',
    coach_id: 'coach_khoa',
    coach_name: 'Nguyễn Đăng Khoa',
    coach_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    student_id: 'user_student_3',
    student_name: 'Nguyễn Văn Hùng',
    student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    student_phone: '0903112233',
    position: 2,
    status: 'waiting',
    created_at: '2026-08-18 08:15',
    session_summary: 'Ca Tập Chuyên Sâu Kỹ Thuật (17:00 - 18:30)',
    date: '2026-08-22',
    time: '17:00 - 18:30',
    court_name: 'Sân Pickleball Saigon South Q7',
    price: 450000
  },
  {
    id: 'wait_3',
    booking_id: 'slot_hot_ha_sun',
    coach_id: 'coach_ha',
    coach_name: 'Vũ Thu Hà',
    coach_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    student_id: 'user_student_1',
    student_name: 'Trần Thị Lan',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    student_phone: '0912345678',
    position: 1,
    status: 'offered',
    offered_at: '2026-08-18 08:00',
    offer_expires_at: '2026-08-18 10:00',
    created_at: '2026-08-17 19:00',
    session_summary: 'Ca Tập Sáng Chủ Nhật (08:00 - 09:30)',
    date: '2026-08-23',
    time: '08:00 - 09:30',
    court_name: 'Sân Westlake Pickleball Club',
    price: 500000
  }
];


