export type UserRole = 'student' | 'coach' | 'admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
  status: 'active' | 'suspended';
  dupr_rating?: number;
  location?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string; // e.g. "IPTPA", "PPR", "VPA - Liên đoàn Pickleball VN"
  year: number;
  proof_url: string;
  verified: boolean;
}

export interface LessonPackage {
  id: string;
  title: string;
  sessions: number;
  discount_percent: number;
  description: string;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  user?: User;
  bio: string;
  experience_years: number;
  certifications: Certification[];
  price_per_session: number; // VND per hour/session
  area: string; // e.g. "Quận 7, TP.HCM", "Cầu Giấy, Hà Nội"
  courts: string[]; // Danh sách các sân quen thuộc
  specialties: string[]; // e.g. "Dinking", "Third Shot Drop", "Chiến thuật Đôi", "Người mới bắt đầu", "Luyện thi DUPR"
  teaching_style: string;
  video_intro_url?: string;
  gallery_urls: string[];
  packages: LessonPackage[];
  verification_status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  is_featured?: boolean;
  rating_avg: number;
  review_count: number;
  students_count: number;
  dupr_level: number;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  coach_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  court_name?: string;
  is_booked: boolean;
  recurring_day?: string; // 'Monday', 'Tuesday', etc.
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  student_phone: string;
  student_email: string;
  coach_id: string;
  coach_name: string;
  coach_avatar: string;
  slot_id: string;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  court_name: string;
  package_title: string;
  session_count: number;
  total_price: number;
  status: BookingStatus;
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  has_reviewed?: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  coach_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
  is_hidden: boolean;
  hide_reason?: string;
  coach_reply?: string;
  skill_tags?: string[];
}

export interface SkillRating {
  id: string;
  student_id: string;
  student_name: string;
  coach_id: string;
  coach_name: string;
  assessed_at: string;
  dupr_score: number; // 2.0 to 6.0
  metrics: {
    serve_and_return: number; // 1-10
    dinking_control: number; // 1-10
    third_shot_drop: number; // 1-10
    volleys_and_resets: number; // 1-10
    court_positioning: number; // 1-10
    match_strategy: number; // 1-10
  };
  notes: string;
  recommended_drills: string[];
}

export interface TestCaseItem {
  id: string;
  title: string;
  module: string;
  steps: string;
  expected: string;
  actual: string;
  status: 'Pass' | 'Fail' | 'Fixed';
  tested_by: string;
}

export interface CoachClass {
  id: string;
  name: string;
  coach_id: string;
  coach_name: string;
  coach_avatar: string;
  level: string;
  schedule: string;
  court_name: string;
  area: string;
  max_students: number; // Tối đa 5 học viên
  student_ids: string[]; // Danh sách ID học viên
  fee_per_student: number;
  total_sessions: number;
  start_date: string;
  status: 'active' | 'upcoming' | 'completed';
  description: string;
}
