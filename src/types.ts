export type UserRole = 'student' | 'coach' | 'admin';

export type AdminRoleName = 'super_admin' | 'support_admin' | 'finance_admin';

export type AdminPermissionCode = 
  | 'approve_coach' 
  | 'resolve_dispute' 
  | 'view_finance' 
  | 'manage_admins' 
  | 'manual_refund' 
  | 'suspend_coach'
  | 'hide_review'
  | 'handle_reports';

export interface AdminUser {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role_name: AdminRoleName;
  permissions: AdminPermissionCode[];
  created_at: string;
}

export interface AdminActionLog {
  id: string;
  admin_id: string;
  admin_name: string;
  role_name: AdminRoleName;
  action: string;
  target_type: 'coach' | 'student' | 'booking' | 'payment' | 'user' | 'review' | 'system';
  target_id: string;
  details: string;
  timestamp: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'competitive';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  admin_role?: AdminRoleName;
  created_at: string;
  status: 'active' | 'suspended';
  dupr_rating?: number;
  skill_level?: SkillLevel | null;
  location?: string;
  password?: string;
  failed_login_attempts?: number;
  locked_until?: string | null;
}

export interface PasswordReset {
  id: string;
  user_id: string;
  email: string;
  reset_token: string;
  expires_at: string;
  used: boolean;
}

export type NotificationType = 'booking' | 'payment' | 'payout' | 'dispute' | 'review' | 'verification' | 'system';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  student_id: string;
  coach_id: string;
  created_at: string;
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

export type CoachPackage = LessonPackage;

export type CoachApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface CoachProfile {
  id: string;
  user_id: string;
  user?: User;
  bio: string;
  experience_years: number;
  certifications: Certification[];
  price_per_session: number; // VND per hour/session
  commission_rate?: number; // % hoa hồng nền tảng (mặc định 0.10 tức 10%)
  area: string; // e.g. "Quận 7, TP.HCM", "Cầu Giấy, Hà Nội"
  courts: string[]; // Danh sách các sân quen thuộc
  specialties: string[]; // e.g. "Dinking", "Third Shot Drop", "Chiến thuật Đôi", "Người mới bắt đầu", "Luyện thi DUPR"
  skill_levels_taught?: string[]; // ["Mới bắt đầu", "Trung cấp", "Nâng cao"]
  languages?: string[]; // ["Tiếng Việt", "English"]
  teaching_style: string;
  video_intro_url?: string;
  gallery_urls: string[];
  packages: LessonPackage[];
  verification_status: 'pending' | 'verified' | 'rejected';
  approval_status?: CoachApprovalStatus;
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  approved_at?: string;
  approved_by?: string;
  is_featured?: boolean;
  rating_avg: number;
  review_count: number;
  students_count: number;
  total_sessions_taught?: number;
  response_rate_percent?: number;
  dupr_level: number;
  created_at: string;
}

export type PaymentStatus = 'held' | 'released' | 'refunded' | 'disputed';

export interface Payment {
  id: string;
  booking_id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  coach_id: string;
  coach_name: string;
  amount: number; // Tổng số tiền học viên trả
  commission_rate: number; // % hoa hồng (vd: 0.10)
  commission_amount: number; // amount * commission_rate
  payout_amount: number; // amount - commission_amount (số HLV thực nhận)
  status: PaymentStatus;
  paid_at: string; // thời điểm học viên thanh toán (mock)
  released_at?: string; // thời điểm giải ngân cho HLV
  refunded_at?: string; // thời điểm hoàn tiền
  refund_reason?: string; // lý do hoàn tiền
  refund_percent_applied?: number; // % hoàn tiền theo rule (0, 50, 100)
  rule_id_applied?: string; // mã quy tắc hủy/hoàn áp dụng
  dispute_reason?: string; // lý do khiếu nại của học viên
  admin_resolution_notes?: string; // ghi chú xử lý của Admin
  payment_method?: 'qr_escrow' | 'pickle_wallet' | 'card_visa';
}

export interface PayoutHistory {
  id: string;
  coach_id: string;
  payment_id: string;
  booking_id: string;
  amount: number;
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

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CoachAvailabilityRule {
  id: string;
  coach_id: string;
  rule_type?: 'recurring_weekly' | 'specific_date_block';
  day_of_week?: DayOfWeek | number | null; // 0-6 (0=Sun, 1=Mon, ..., 6=Sat)
  specific_date?: string | null; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  court_name: string;
  is_blocked?: boolean; // TRUE = khoảng thời gian HLV chủ động CHẶN (nghỉ lễ, bận đột xuất)
  is_active?: boolean;
  created_at?: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress'
  | 'awaiting_confirmation'
  | 'completed' 
  | 'cancelled' 
  | 'rejected' 
  | 'auto_rejected' 
  | 'no_show' 
  | 'disputed';

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
  reschedule_count?: number;
  original_slot_id?: string;

  // Session Check-in / Confirmation & Attendance
  check_in_time?: string;
  no_show_party?: 'student' | 'coach';
  coach_checked_in_at?: string;
  student_checked_in_at?: string;
  confirmation_status?: string;

  // SLA & Resolution fields
  coach_confirmed_at?: string;
  student_confirmed_at?: string;
  auto_completed_at?: string;
  no_show_reported_by?: 'coach' | 'student';
  no_show_reason?: string;
  coach_response_deadline?: string; // created_at + 24h
  rejection_reason?: string;
  responded_at?: string;
}

export interface CancellationPolicyRule {
  id: string;
  hours_before_session?: number; // e.g. 24, 2, 0
  refund_percent?: number; // 100, 50, 0
  applies_to?: 'student_cancel' | 'coach_cancel' | 'no_show' | string;
  title: string;
  description: string;
  trigger_condition?: string;
  student_refund_percent?: number;
  coach_payout_percent?: number;
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
  coach_reply_at?: string;
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

// ==========================================
// SESSION REMINDERS (CRON SCHEDULER)
// ==========================================
export type ReminderType = '24h_before' | '1h_before';
export type ReminderRecipientType = 'student' | 'coach';
export type ReminderStatus = 'pending' | 'sent' | 'skipped';

export interface SessionReminder {
  id: string;
  booking_id: string;
  reminder_type: ReminderType;
  recipient_type: ReminderRecipientType;
  recipient_id?: string;
  recipient_name?: string;
  booking_summary?: string;
  session_start_time?: string;
  sent_at?: string | null;
  status: ReminderStatus;
  created_at: string;
}

// ==========================================
// QUICK REPORTS (BEHAVIOR & VIOLATIONS)
// ==========================================
export type ReportReasonCategory = 
  | 'inappropriate_behavior' 
  | 'fake_profile' 
  | 'harassment' 
  | 'other';

export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface UserReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reporter_role: UserRole;
  reported_user_id: string;
  reported_user_name: string;
  reported_user_role?: UserRole;
  booking_id?: string | null;
  reason_category: ReportReasonCategory;
  description: string;
  status: ReportStatus;
  handled_by?: string | null; // admin_id
  handler_name?: string | null;
  resolution_note?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

// ==========================================
// 1. SESSION RECAP (NOTES & 4 SKILLS RATING)
// ==========================================
export interface SessionRecap {
  id: string;
  booking_id: string; // UNIQUE constraint: 1 booking = tối đa 1 recap
  coach_id: string;
  coach_name: string;
  coach_avatar?: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  note: string; // nhận xét ngắn dạng tự do
  skill_serve: number; // 1-5 (Serve)
  skill_dink: number; // 1-5 (Dink)
  skill_volley: number; // 1-5 (Volley)
  skill_positioning: number; // 1-5 (Positioning)
  created_at: string; // DATETIME
  is_late?: boolean; // Nếu recap quá 7 ngày kể từ khi completed
  booking_date?: string;
  booking_court?: string;
}

// ==========================================
// 2. WAITLIST (FIFO QUEUE FOR SLOTS/HOT COACHES)
// ==========================================
export type WaitlistStatus = 'waiting' | 'offered' | 'accepted' | 'expired' | 'cancelled';

export interface WaitlistEntry {
  id: string;
  booking_id: string; // slot/buổi mà học viên muốn chờ (UNIQUE với student_id)
  coach_id: string;
  coach_name: string;
  coach_avatar?: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  student_phone?: string;
  position: number; // thứ tự trong hàng chờ (1, 2, 3...)
  status: WaitlistStatus;
  offered_at?: string | null; // thời điểm hệ thống mời khi có slot trống
  offer_expires_at?: string | null; // deadline xác nhận (vd: offered_at + 2h)
  created_at: string;
  session_summary: string;
  date: string;
  time: string;
  court_name: string;
  price?: number;
}

// ==========================================
// 4. BADGE HLV (DERIVED DATA: Top Rated > Verified > Newcomer)
// ==========================================
export type CoachBadgeType = 'top_rated' | 'verified' | 'newcomer' | null;

export interface CoachBadgeInfo {
  type: CoachBadgeType;
  label: string;
  badgeClass: string;
  iconName: string;
  description: string;
}


