import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, CoachProfile, AvailabilitySlot, Booking, Review, 
  SkillRating, UserRole, BookingStatus, CoachClass, Payment, PayoutHistory,
  AppNotification, NotificationType, WishlistItem, PasswordReset,
  CoachApprovalStatus, CoachAvailabilityRule, CancellationPolicyRule,
  AdminUser, AdminActionLog, AdminPermissionCode, AdminRoleName,
  SessionReminder, UserReport, ReportReasonCategory, ReportStatus,
  SessionRecap, WaitlistEntry, WaitlistStatus, SkillLevel
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COACHES, INITIAL_SLOTS, 
  INITIAL_BOOKINGS, INITIAL_REVIEWS, INITIAL_SKILL_RATINGS, INITIAL_CLASSES,
  INITIAL_PAYMENTS, INITIAL_PAYOUTS, INITIAL_NOTIFICATIONS, INITIAL_WISHLISTS,
  INITIAL_COACH_AVAILABILITY_RULES, INITIAL_CANCELLATION_RULES,
  INITIAL_ADMIN_USERS, INITIAL_ADMIN_LOGS, INITIAL_REMINDERS, INITIAL_REPORTS,
  INITIAL_SESSION_RECAPS, INITIAL_WAITLIST_ENTRIES
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  currentRoleMode: UserRole;
  setCurrentUser: (user: User | null) => void;
  setCurrentRoleMode: (role: UserRole) => void;
  users: User[];
  coaches: CoachProfile[];
  slots: AvailabilitySlot[];
  bookings: Booking[];
  reviews: Review[];
  skillRatings: SkillRating[];
  classes: CoachClass[];
  payments: Payment[];
  payouts: PayoutHistory[];
  notifications: AppNotification[];
  wishlist: WishlistItem[];
  passwordResets: PasswordReset[];
  adminLogs: AdminActionLog[];
  adminUsers: AdminUser[];
  availabilityRules: CoachAvailabilityRule[];
  cancellationRules: CancellationPolicyRule[];
  reminders: SessionReminder[];
  reports: UserReport[];
  sessionRecaps: SessionRecap[];
  waitlistEntries: WaitlistEntry[];
  
  // Role switcher & Auth
  switchRole: (role: UserRole) => void;
  login: (userId: string) => void;
  logout: () => void;
  registerUser: (data: {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: 'student' | 'coach';
    area?: string;
    experience_years?: number;
    price_per_session?: number;
    bio?: string;
    specialties?: string[];
  }) => { success: boolean; message: string; user?: User };
  loginUser: (email: string, password: string) => { success: boolean; message: string; user?: User; lockedUntil?: string };
  requestPasswordReset: (email: string) => { success: boolean; resetToken?: string; message: string };
  resetPasswordWithToken: (email: string, resetToken: string, newPassword: string, confirmNewPassword: string) => { success: boolean; message: string };
  
  // RBAC & Admin Permissions
  hasAdminPermission: (permission: AdminPermissionCode) => boolean;
  logAdminAction: (action: string, targetType: 'coach' | 'student' | 'booking' | 'payment' | 'user' | 'review' | 'system', targetId: string, details: string) => void;
  updateCoachApproval: (coachId: string, status: CoachApprovalStatus, reason?: string) => void;
  
  // Availability Rules (2-tier)
  addAvailabilityRule: (coachIdOrRule: string | Omit<CoachAvailabilityRule, 'id' | 'created_at'>, maybeRule?: Omit<CoachAvailabilityRule, 'id' | 'coach_id' | 'created_at'>) => void;
  removeAvailabilityRule: (ruleId: string) => void;
  
  // Session Check-In & No-Show
  checkInBooking: (bookingId: string, role?: 'student' | 'coach') => { success: boolean; message: string };
  reportNoShow: (bookingId: string, reportedBy?: 'student' | 'coach', reason?: string) => { success: boolean; message: string };
  calculateRefund: (bookingOrId: Booking | string, cancelledBy?: 'student' | 'coach') => { 
    refundPercent: number; 
    refundAmount: number; 
    coachAmount: number; 
    ruleDescription: string;
    policyDescription: string;
    hoursRemaining: number;
  };
  
  // Notifications & Reminders Scheduler (Cron)
  createNotification: (userId: string, title: string, message: string, type: NotificationType, relatedId?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  getUserNotifications: (userId: string) => AppNotification[];
  triggerCronSessionReminders: () => { sentCount: number; skippedCount: number; message: string; generatedReminders: SessionReminder[] };

  // Quick Reports (Behavior & Harassment)
  createReport: (data: {
    reported_user_id: string;
    booking_id?: string | null;
    reason_category: ReportReasonCategory;
    description: string;
  }) => { success: boolean; message: string };
  updateReportStatus: (reportId: string, status: ReportStatus, resolutionNote?: string) => { success: boolean; message: string };

  // Student Analytics & IDOR-Protected Stats
  getStudentStats: (studentId: string) => {
    totalSessionsCompleted: number;
    totalSpent: number;
    upcomingCount: number;
    cancelledCount: number;
    mostFrequentCoach: { id: string; name: string; avatar: string; count: number } | null;
    duprRating: number;
  };
  
  // Wishlist
  toggleWishlist: (coachId: string) => { isInWishlist: boolean; message: string };
  isCoachWishlisted: (coachId: string) => boolean;
  getWishlistCoaches: () => CoachProfile[];

  // Session Recaps (4 Skills & Notes)
  createSessionRecap: (data: {
    booking_id: string;
    note: string;
    skill_serve: number;
    skill_dink: number;
    skill_volley: number;
    skill_positioning: number;
  }) => { success: boolean; message: string; recap?: SessionRecap };
  getSessionRecapByBooking: (bookingId: string) => SessionRecap | undefined;
  getStudentRecaps: (studentId: string) => SessionRecap[];

  // Waitlist (FIFO Queue & Slot Allocation)
  joinWaitlist: (data: {
    booking_id: string;
    coach_id: string;
    date: string;
    time: string;
    court_name: string;
    session_summary: string;
    price?: number;
  }) => { success: boolean; message: string; entry?: WaitlistEntry };
  leaveWaitlist: (entryId: string) => { success: boolean; message: string };
  acceptWaitlistOffer: (entryId: string) => { success: boolean; message: string };
  declineWaitlistOffer: (entryId: string) => { success: boolean; message: string };
  inviteNextInWaitlist: (bookingId: string) => WaitlistEntry | null;

  // Student Profile & Skill Level
  updateStudentSkillLevel: (studentId: string, skillLevel: SkillLevel) => { success: boolean; message: string };

  // Actions for Student
  createBooking: (data: {
    coachId: string;
    slotId: string;
    packageTitle: string;
    sessionCount: number;
    totalPrice: number;
    notes?: string;
    paymentMethod?: 'qr_escrow' | 'pickle_wallet' | 'card_visa';
  }) => { success: boolean; message: string; bookingId?: string; paymentId?: string };
  
  rescheduleBooking: (bookingId: string, newSlotId: string) => { success: boolean; message: string };
  cancelBooking: (bookingId: string, reason?: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string, skillTags?: string[]) => void;
  enrollInClass: (classId: string, studentId: string) => { success: boolean; message: string };
  selfAssessDUPR: (data: {
    studentId: string;
    duprScore: number;
    metrics: SkillRating['metrics'];
    notes?: string;
    recommendedDrills?: string[];
  }) => void;
  
  // Actions for Coach & Admin
  addClassStudent: (classId: string, studentId: string) => { success: boolean; message: string };
  removeClassStudent: (classId: string, studentId: string) => void;
  createCoachClass: (data: Omit<CoachClass, 'id'>) => void;
  updateCoachProfile: (profileId: string, updates: Partial<CoachProfile>) => void;
  addAvailabilitySlot: (date: string, startTime: string, endTime: string, courtName: string) => void;
  deleteAvailabilitySlot: (slotId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus, rejectionReason?: string) => void;
  submitSkillAssessment: (data: Omit<SkillRating, 'id' | 'assessed_at'>) => void;
  replyToReview: (reviewId: string, reply: string) => { success: boolean; message: string };
  
  // Actions for Admin & Payment Escrow
  verifyCoachProfile: (coachId: string, approve: boolean, rejectionReason?: string) => void;
  toggleUserStatus: (userId: string) => void;
  toggleFeaturedCoach: (coachId: string) => void;
  toggleHideReview: (reviewId: string, reason?: string) => void;
  disputePayment: (paymentId: string, reason: string) => void;
  resolveDispute: (paymentId: string, resolution: 'release_coach' | 'refund_student' | 'release_to_coach' | 'refund_to_student', notes?: string) => void;
  getPaymentForBooking: (bookingId: string) => Payment | undefined;
  getCoachEarnings: (coachId: string) => { 
    totalEarnings: number; 
    pendingEscrow: number; 
    totalSessionsCompleted: number; 
    payoutHistory: PayoutHistory[] 
  };
  getPlatformStats: () => { 
    totalVolume: number;
    gmv: number; 
    escrowHeld: number; 
    platformCommission: number; 
    totalPayouts: number;
    totalRefunded: number; 
    refundedTotal: number; 
    totalTransactions: number 
  };
  
  // User Management & Profile
  addNewUser: (userData: Omit<User, 'id'>, coachDetails?: Partial<CoachProfile>) => User;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  
  // System reset
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'pickleconnect_users_v6',
  COACHES: 'pickleconnect_coaches_v6',
  SLOTS: 'pickleconnect_slots_v6',
  BOOKINGS: 'pickleconnect_bookings_v6',
  REVIEWS: 'pickleconnect_reviews_v6',
  SKILLS: 'pickleconnect_skills_v6',
  CLASSES: 'pickleconnect_classes_v6',
  PAYMENTS: 'pickleconnect_payments_v6',
  PAYOUTS: 'pickleconnect_payouts_v6',
  NOTIFICATIONS: 'pickleconnect_notifications_v6',
  WISHLISTS: 'pickleconnect_wishlists_v6',
  PASSWORD_RESETS: 'pickleconnect_resets_v6',
  ADMIN_LOGS: 'pickleconnect_admin_logs_v6',
  ADMIN_USERS: 'pickleconnect_admin_users_v6',
  AVAILABILITY_RULES: 'pickleconnect_av_rules_v6',
  CANCELLATION_RULES: 'pickleconnect_cancel_rules_v6',
  REMINDERS: 'pickleconnect_reminders_v6',
  REPORTS: 'pickleconnect_reports_v6',
  SESSION_RECAPS: 'pickleconnect_session_recaps_v6',
  WAITLIST_ENTRIES: 'pickleconnect_waitlist_v6',
  CURRENT_USER_ID: 'pickleconnect_current_user_id_v6',
  IS_LOGGED_IN: 'pickleconnect_is_logged_in_v6',
  CURRENT_ROLE_MODE: 'pickleconnect_current_role_mode_v6',
};

// Helper to ensure avatar images have sufficient headroom (facepad >= 5, 400x400)
export const sanitizeAvatarUrl = (url?: string): string => {
  if (!url) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80';
  if (url.includes('images.unsplash.com')) {
    let clean = url;
    if (clean.includes('facepad=3')) {
      clean = clean.replace('facepad=3', 'facepad=5');
    }
    if (clean.includes('w=300&h=300') || clean.includes('w=150')) {
      clean = clean.replace(/w=(300|150)(&h=(300|150))?/, 'w=400&h=400');
    }
    if (!clean.includes('facepad=')) {
      clean += clean.includes('?') ? '&crop=faces&facepad=5' : '?auto=format&fit=crop&crop=faces&facepad=5&w=400&h=400&q=80';
    }
    return clean;
  }
  return url;
};

// Collision-proof unique ID generator
export const generateUniqueId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 50) {
        return parsed.map(u => ({ ...u, avatar_url: sanitizeAvatarUrl(u.avatar_url) }));
      }
    }
    return INITIAL_USERS.map(u => ({ ...u, avatar_url: sanitizeAvatarUrl(u.avatar_url) }));
  });

  const [coaches, setCoaches] = useState<CoachProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COACHES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
    }
    return INITIAL_COACHES;
  });

  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    const rawList: AvailabilitySlot[] = saved ? JSON.parse(saved) : INITIAL_SLOTS;
    const seenIds = new Set<string>();
    return (Array.isArray(rawList) ? rawList : INITIAL_SLOTS).map((slot, index) => {
      let uniqueId = slot.id;
      if (!uniqueId || seenIds.has(uniqueId)) {
        uniqueId = `slot_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`;
      }
      seenIds.add(uniqueId);
      return { ...slot, id: uniqueId };
    });
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [skillRatings, setSkillRatings] = useState<SkillRating[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return saved ? JSON.parse(saved) : INITIAL_SKILL_RATINGS;
  });

  const [classes, setClasses] = useState<CoachClass[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PAYMENTS;
  });

  const [payouts, setPayouts] = useState<PayoutHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PAYOUTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLISTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_WISHLISTS;
  });

  const [passwordResets, setPasswordResets] = useState<PasswordReset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_ADMIN_USERS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminActionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_ADMIN_LOGS;
  });

  const [availabilityRules, setAvailabilityRules] = useState<CoachAvailabilityRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AVAILABILITY_RULES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_COACH_AVAILABILITY_RULES;
  });

  const [cancellationRules, setCancellationRules] = useState<CancellationPolicyRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANCELLATION_RULES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_CANCELLATION_RULES;
  });

  const [reminders, setReminders] = useState<SessionReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_REMINDERS;
  });

  const [reports, setReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_REPORTS;
  });

  const [sessionRecaps, setSessionRecaps] = useState<SessionRecap[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION_RECAPS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_SESSION_RECAPS;
  });

  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WAITLIST_ENTRIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_WAITLIST_ENTRIES;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const loggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (loggedIn === 'false') return null;
    return saved || 'user_student_1';
  });

  const [currentRoleMode, setCurrentRoleMode] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE_MODE) as UserRole;
    return saved || 'student';
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skillRatings));
  }, [skillRatings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLISTS, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(passwordResets));
  }, [passwordResets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVAILABILITY_RULES, JSON.stringify(availabilityRules));
  }, [availabilityRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANCELLATION_RULES, JSON.stringify(cancellationRules));
  }, [cancellationRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSION_RECAPS, JSON.stringify(sessionRecaps));
  }, [sessionRecaps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WAITLIST_ENTRIES, JSON.stringify(waitlistEntries));
  }, [waitlistEntries]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE_MODE, currentRoleMode);
  }, [currentRoleMode]);

  const currentUser: User | null = React.useMemo(() => {
    if (!isLoggedIn || !currentUserId) return null;
    return users.find(u => u.id === currentUserId) || null;
  }, [users, currentUserId, isLoggedIn]);

  // ==========================================
  // RBAC & ADMIN PERMISSION ENGINE
  // ==========================================
  const hasAdminPermission = (permission: AdminPermissionCode): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    // Check if user is super_admin or matches in adminUsers table
    if (currentUser.admin_role === 'super_admin' || currentUser.id === 'user_admin_1') {
      return true; // Super admin has full access
    }

    const matchedAdmin = adminUsers.find(a => a.user_id === currentUser.id);
    if (!matchedAdmin) {
      // Fallback check on admin_role from user model
      if (currentUser.admin_role === 'support_admin') {
        return ['approve_coach', 'resolve_dispute', 'suspend_coach', 'hide_review'].includes(permission);
      }
      if (currentUser.admin_role === 'finance_admin') {
        return ['view_finance', 'manual_refund', 'resolve_dispute'].includes(permission);
      }
      return false;
    }

    if (matchedAdmin.role_name === 'super_admin') return true;
    return matchedAdmin.permissions.includes(permission);
  };

  const logAdminAction = (
    action: string,
    targetType: 'coach' | 'student' | 'booking' | 'payment' | 'user' | 'review' | 'system',
    targetId: string,
    details: string
  ) => {
    const adminName = currentUser?.full_name || 'Admin System';
    const roleName = (currentUser?.admin_role as AdminRoleName) || 'super_admin';
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newLog: AdminActionLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      admin_id: currentUser?.id || 'admin_user_super',
      admin_name: adminName,
      role_name: roleName,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: nowStr
    };

    setAdminLogs(prev => [newLog, ...prev]);
  };

  const updateCoachApproval = (coachId: string, status: CoachApprovalStatus, reason?: string) => {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const adminId = currentUser?.id || 'user_admin_1';

    setCoaches(prev => prev.map(c => {
      if (c.id === coachId) {
        return {
          ...c,
          approval_status: status,
          rejection_reason: reason,
          approved_at: status === 'approved' ? nowStr : c.approved_at,
          approved_by: status === 'approved' ? adminId : c.approved_by,
          verification_status: status === 'approved' ? 'verified' : (status === 'rejected' ? 'rejected' : c.verification_status)
        };
      }
      return c;
    }));

    // Log admin action
    const actionLabel = status === 'approved' ? 'APPROVE_COACH' : (status === 'suspended' ? 'SUSPEND_COACH' : 'REJECT_COACH');
    const actionDetails = status === 'approved' 
      ? `Phê duyệt hồ sơ HLV và kích hoạt hiển thị tìm kiếm` 
      : (status === 'suspended' ? `Tạm đình chỉ HLV: ${reason || 'Vi phạm điều khoản'}` : `Từ chối hồ sơ: ${reason || 'Không đạt chuẩn'}`);

    logAdminAction(actionLabel, 'coach', coachId, actionDetails);

    // Notify Coach
    if (coach.user_id) {
      let notifTitle = 'Cập nhật trạng thái hồ sơ HLV';
      let notifMessage = '';
      if (status === 'approved') {
        notifTitle = '🎉 Chúc mừng! Hồ sơ HLV đã được duyệt';
        notifMessage = 'Hồ sơ của bạn đã được Admin phê duyệt thành công. Bạn đã có thể mở lịch rảnh và nhận học viên mới!';
      } else if (status === 'suspended') {
        notifTitle = '⚠️ Tài khoản HLV bị tạm ngưng';
        notifMessage = `Tài khoản của bạn tạm thời bị khóa nhận lịch mới do: ${reason || 'Vi phạm chính sách sàn'}. Vui lòng liên hệ bộ phận hỗ trợ.`;
      } else if (status === 'rejected') {
        notifTitle = '❌ Hồ sơ HLV chưa được duyệt';
        notifMessage = `Hồ sơ HLV chưa đạt yêu cầu. Lý do: ${reason || 'Thông tin hoặc chứng chỉ chưa hợp lệ'}.`;
      }

      createNotification(coach.user_id, notifTitle, notifMessage, 'system', coachId);
    }
  };

  // ==========================================
  // AVAILABILITY RULES (2-TIER ENGINE)
  // ==========================================
  const addAvailabilityRule = (
    coachIdOrRule: string | Omit<CoachAvailabilityRule, 'id' | 'created_at'>,
    maybeRule?: Omit<CoachAvailabilityRule, 'id' | 'coach_id' | 'created_at'>
  ) => {
    let ruleData: Omit<CoachAvailabilityRule, 'id' | 'created_at'>;

    if (typeof coachIdOrRule === 'string' && maybeRule) {
      ruleData = {
        ...maybeRule,
        coach_id: coachIdOrRule
      };
    } else {
      ruleData = coachIdOrRule as Omit<CoachAvailabilityRule, 'id' | 'created_at'>;
    }

    const newRule: CoachAvailabilityRule = {
      ...ruleData,
      id: 'rule_av_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setAvailabilityRules(prev => [newRule, ...prev]);

    // If it is an open specific date slot, also generate/sync to slots array for immediate booking
    if (ruleData.specific_date && !ruleData.is_blocked) {
      const newSlot: AvailabilitySlot = {
        id: generateUniqueId('slot'),
        coach_id: ruleData.coach_id,
        date: ruleData.specific_date,
        start_time: ruleData.start_time,
        end_time: ruleData.end_time,
        court_name: ruleData.court_name,
        is_booked: false
      };
      setSlots(prev => [...prev, newSlot]);
    }
  };

  const removeAvailabilityRule = (ruleId: string) => {
    setAvailabilityRules(prev => prev.filter(r => r.id !== ruleId));
  };

  // ==========================================
  // SESSION CHECK-IN & NO-SHOW
  // ==========================================
  const checkInBooking = (bookingId: string, role: 'student' | 'coach' = 'coach') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Buổi học không tồn tại!' };

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedBooking: Booking = {
      ...booking,
      check_in_time: nowStr,
      status: 'in_progress',
      student_checked_in_at: role === 'student' ? nowStr : booking.student_checked_in_at,
      coach_checked_in_at: role === 'coach' ? nowStr : booking.coach_checked_in_at,
    };

    // If both checked in, mark confirmation
    if (
      (role === 'student' && updatedBooking.coach_checked_in_at) ||
      (role === 'coach' && updatedBooking.student_checked_in_at)
    ) {
      updatedBooking.confirmation_status = 'confirmed';
    }

    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));

    const roleName = role === 'student' ? 'Học viên' : 'HLV';
    return {
      success: true,
      message: `${roleName} đã điểm danh (Check-in) thành công lúc ${nowStr.substring(11)}!`
    };
  };

  const reportNoShow = (bookingId: string, reportedBy: 'student' | 'coach' = 'coach', reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Buổi học không tồn tại!' };

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'no_show',
      no_show_reported_by: reportedBy,
      no_show_party: reportedBy === 'coach' ? 'student' : 'coach',
      no_show_reason: reason || `Báo cáo vắng mặt không báo trước (No-show) bởi ${reportedBy === 'student' ? 'Học viên' : 'HLV'}`,
      cancellation_reason: reason || `Báo cáo vắng mặt không báo trước (No-show) bởi ${reportedBy === 'student' ? 'Học viên' : 'HLV'}`
    } : b));

    // Handle Payment escrow based on no-show policy
    const matchedPayment = payments.find(p => p.booking_id === bookingId);
    if (matchedPayment && matchedPayment.status === 'held') {
      if (reportedBy === 'student') {
        // Coach didn't show up -> Refund 100% to student
        setPayments(prev => prev.map(p => p.id === matchedPayment.id ? {
          ...p,
          status: 'refunded',
          refunded_at: nowStr,
          refund_reason: 'HLV vắng mặt không báo trước (No-show) - Hoàn tiền 100% cho học viên'
        } : p));
      } else {
        // Student didn't show up -> Release payout to coach
        const payoutAmount = Math.round(matchedPayment.amount * (1 - (matchedPayment.commission_rate ?? 0.10)));
        setPayments(prev => prev.map(p => p.id === matchedPayment.id ? {
          ...p,
          status: 'released',
          released_at: nowStr
        } : p));

        const newPayout: PayoutHistory = {
          id: generateUniqueId('payout'),
          coach_id: booking.coach_id,
          payment_id: matchedPayment.id,
          booking_id: booking.id,
          amount: payoutAmount,
          created_at: nowStr
        };
        setPayouts(prev => [newPayout, ...prev]);
      }
    }

    // Release slot
    if (booking.slot_id) {
      setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
    }

    // Log admin action
    logAdminAction(
      'REPORT_NO_SHOW',
      'booking',
      bookingId,
      `Báo cáo No-show bởi ${reportedBy === 'student' ? 'Học viên ' + booking.student_name : 'HLV'}`
    );

    return {
      success: true,
      message: `Đã ghi nhận báo cáo No-show thành công và xử lý quỹ Escrow tương ứng!`
    };
  };

  // ==========================================
  // REFUND CALCULATION ENGINE
  // ==========================================
  const calculateRefund = (
    bookingOrId: Booking | string,
    cancelledBy: 'student' | 'coach' = 'student'
  ) => {
    const booking = typeof bookingOrId === 'string' 
      ? bookings.find(b => b.id === bookingOrId)
      : bookingOrId;

    if (!booking) {
      return { 
        refundPercent: 100, 
        refundAmount: 0, 
        coachAmount: 0, 
        ruleDescription: 'Mặc định hoàn 100%',
        policyDescription: 'Chính sách tiêu chuẩn',
        hoursRemaining: 999
      };
    }

    const totalPrice = booking.total_price || 0;

    if (cancelledBy === 'coach') {
      return {
        refundPercent: 100,
        refundAmount: totalPrice,
        coachAmount: 0,
        ruleDescription: 'HLV chủ động hủy: Học viên nhận hoàn tiền 100% qua Escrow.',
        policyDescription: 'HLV hủy lịch - Bảo đảm quyền lợi người học 100%',
        hoursRemaining: 999
      };
    }

    // Calculate hours remaining
    const bookingDateTimeStr = `${booking.date}T${booking.start_time}:00`;
    const bookingTime = new Date(bookingDateTimeStr).getTime();
    const now = Date.now();
    const hoursDiff = Math.max(0, (bookingTime - now) / (1000 * 60 * 60));

    if (hoursDiff >= 24) {
      return {
        refundPercent: 100,
        refundAmount: totalPrice,
        coachAmount: 0,
        ruleDescription: 'Học viên hủy trước ≥ 24 giờ: Hoàn tiền 100% học phí về tài khoản/ví.',
        policyDescription: 'Hủy trước 24 giờ: Hoàn 100%',
        hoursRemaining: Math.round(hoursDiff * 10) / 10
      };
    } else if (hoursDiff >= 2) {
      const refundAmount = Math.round(totalPrice * 0.5);
      const coachAmount = Math.round(totalPrice * 0.5 * 0.9); // after 10% platform fee
      return {
        refundPercent: 50,
        refundAmount,
        coachAmount,
        ruleDescription: 'Học viên hủy trong khoảng 2h - 24h: Hoàn tiền 50% cho học viên, 50% bồi hoàn HLV (trừ phí sàn).',
        policyDescription: 'Hủy từ 2h - 24h: Hoàn 50%',
        hoursRemaining: Math.round(hoursDiff * 10) / 10
      };
    } else {
      const coachAmount = Math.round(totalPrice * 0.9);
      return {
        refundPercent: 0,
        refundAmount: 0,
        coachAmount,
        ruleDescription: 'Học viên hủy sát giờ (< 2 giờ): Hoàn tiền 0%. 90% học phí được giải ngân cho HLV.',
        policyDescription: 'Hủy dưới 2 giờ: Hoàn 0%',
        hoursRemaining: Math.round(hoursDiff * 10) / 10
      };
    }
  };

  // Notification methods
  const createNotification = (
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    relatedId?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      title,
      message,
      type,
      related_id: relatedId,
      is_read: false,
      created_at: nowStr
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => n.user_id === userId ? { ...n, is_read: true } : n));
  };

  const getUserNotifications = (userId: string) => {
    return notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Wishlist methods
  const toggleWishlist = (coachId: string) => {
    if (!currentUser) {
      return { isInWishlist: false, message: 'Vui lòng đăng nhập để lưu HLV yêu thích!' };
    }
    const existingIndex = wishlist.findIndex(w => w.student_id === currentUser.id && w.coach_id === coachId);
    if (existingIndex >= 0) {
      setWishlist(prev => prev.filter((_, idx) => idx !== existingIndex));
      return { isInWishlist: false, message: 'Đã xóa HLV khỏi danh sách yêu thích' };
    } else {
      const newItem: WishlistItem = {
        id: 'wish_' + Date.now(),
        student_id: currentUser.id,
        coach_id: coachId,
        created_at: new Date().toISOString().substring(0, 10)
      };
      setWishlist(prev => [newItem, ...prev]);
      return { isInWishlist: true, message: 'Đã lưu HLV vào danh sách yêu thích thành công!' };
    }
  };

  const isCoachWishlisted = (coachId: string): boolean => {
    if (!currentUser) return false;
    return wishlist.some(w => w.student_id === currentUser.id && w.coach_id === coachId);
  };

  const getWishlistCoaches = (): CoachProfile[] => {
    if (!currentUser) return [];
    const coachIds = wishlist
      .filter(w => w.student_id === currentUser.id)
      .map(w => w.coach_id);
    return coaches.filter(c => coachIds.includes(c.id));
  };

  // ==========================================
  // SESSION REMINDERS CRON SCHEDULER ENGINE
  // ==========================================
  const triggerCronSessionReminders = () => {
    const now = Date.now();
    let sentCount = 0;
    let skippedCount = 0;
    const generated: SessionReminder[] = [];

    // Filter confirmed & in_progress bookings
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

    confirmedBookings.forEach(booking => {
      const bookingDateTimeStr = `${booking.date}T${booking.start_time}:00`;
      const sessionTime = new Date(bookingDateTimeStr).getTime();
      const diffHours = (sessionTime - now) / (1000 * 60 * 60);

      // Recipient student & coach
      const coachProfile = coaches.find(c => c.id === booking.coach_id);
      const coachUser = users.find(u => u.id === coachProfile?.user_id || u.full_name === booking.coach_name);

      // Edge case: if booking is cancelled/rejected -> skip
      if (booking.status === 'cancelled' || booking.status === 'rejected') {
        return;
      }

      // 1. 24h reminder window (~1h to 25h)
      if (diffHours <= 25 && diffHours > 1.0) {
        // Check student 24h idempotent unique
        const student24hExists = reminders.some(
          r => r.booking_id === booking.id && r.reminder_type === '24h_before' && r.recipient_type === 'student'
        );
        if (!student24hExists) {
          const newReminder: SessionReminder = {
            id: 'rem_' + Date.now() + '_s24_' + Math.random().toString(36).substring(2, 5),
            booking_id: booking.id,
            reminder_type: '24h_before',
            recipient_type: 'student',
            recipient_id: booking.student_id,
            recipient_name: booking.student_name,
            booking_summary: `${booking.package_title} (${booking.start_time} - ${booking.court_name})`,
            session_start_time: `${booking.date} ${booking.start_time}`,
            sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'sent',
            created_at: new Date().toISOString().substring(0, 10)
          };
          generated.push(newReminder);
          sentCount++;
          createNotification(
            booking.student_id,
            '⏰ Nhắc lịch học (Còn 24 giờ)',
            `Bạn có buổi tập "${booking.package_title}" với HLV ${booking.coach_name} vào lúc ${booking.start_time} ngày ${booking.date} tại ${booking.court_name}.`,
            'booking',
            booking.id
          );
        }

        // Check coach 24h idempotent unique
        if (coachUser) {
          const coach24hExists = reminders.some(
            r => r.booking_id === booking.id && r.reminder_type === '24h_before' && r.recipient_type === 'coach'
          );
          if (!coach24hExists) {
            const newReminder: SessionReminder = {
              id: 'rem_' + Date.now() + '_c24_' + Math.random().toString(36).substring(2, 5),
              booking_id: booking.id,
              reminder_type: '24h_before',
              recipient_type: 'coach',
              recipient_id: coachUser.id,
              recipient_name: coachUser.full_name,
              booking_summary: `Dạy học viên ${booking.student_name} (${booking.start_time} - ${booking.court_name})`,
              session_start_time: `${booking.date} ${booking.start_time}`,
              sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              status: 'sent',
              created_at: new Date().toISOString().substring(0, 10)
            };
            generated.push(newReminder);
            sentCount++;
            createNotification(
              coachUser.id,
              '⏰ Nhắc lịch dạy (Còn 24 giờ)',
              `Lịch dạy học viên ${booking.student_name} lúc ${booking.start_time} ngày ${booking.date} tại ${booking.court_name}.`,
              'booking',
              booking.id
            );
          }
        }
      }

      // 2. 1h reminder window (~0.25h to 1.25h)
      if (diffHours <= 1.25 && diffHours >= 0.25) {
        // Check student 1h idempotent unique
        const student1hExists = reminders.some(
          r => r.booking_id === booking.id && r.reminder_type === '1h_before' && r.recipient_type === 'student'
        );
        if (!student1hExists) {
          const newReminder: SessionReminder = {
            id: 'rem_' + Date.now() + '_s1_' + Math.random().toString(36).substring(2, 5),
            booking_id: booking.id,
            reminder_type: '1h_before',
            recipient_type: 'student',
            recipient_id: booking.student_id,
            recipient_name: booking.student_name,
            booking_summary: `Sắp bắt đầu: ${booking.package_title} tại ${booking.court_name}`,
            session_start_time: `${booking.date} ${booking.start_time}`,
            sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'sent',
            created_at: new Date().toISOString().substring(0, 10)
          };
          generated.push(newReminder);
          sentCount++;
          createNotification(
            booking.student_id,
            '🚨 Sắp đến giờ tập (Còn 1 giờ)!',
            `Buổi tập với HLV ${booking.coach_name} bắt đầu lúc ${booking.start_time}. Đừng quên mang vợt & bóng chuẩn bị khởi động tại ${booking.court_name}.`,
            'booking',
            booking.id
          );
        }

        // Check coach 1h idempotent unique
        if (coachUser) {
          const coach1hExists = reminders.some(
            r => r.booking_id === booking.id && r.reminder_type === '1h_before' && r.recipient_type === 'coach'
          );
          if (!coach1hExists) {
            const newReminder: SessionReminder = {
              id: 'rem_' + Date.now() + '_c1_' + Math.random().toString(36).substring(2, 5),
              booking_id: booking.id,
              reminder_type: '1h_before',
              recipient_type: 'coach',
              recipient_id: coachUser.id,
              recipient_name: coachUser.full_name,
              booking_summary: `Chuẩn bị ca dạy: ${booking.student_name} (${booking.court_name})`,
              session_start_time: `${booking.date} ${booking.start_time}`,
              sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              status: 'sent',
              created_at: new Date().toISOString().substring(0, 10)
            };
            generated.push(newReminder);
            sentCount++;
            createNotification(
              coachUser.id,
              '🚨 Sắp đến giờ dạy (Còn 1 giờ)!',
              `Buổi dạy học viên ${booking.student_name} bắt đầu lúc ${booking.start_time} tại ${booking.court_name}. Nhớ thực hiện Check-in khi đến sân!`,
              'booking',
              booking.id
            );
          }
        }
      }

      // Edge case: if session starts in < 15 mins (0.25h) -> skip
      if (diffHours < 0.25 && diffHours > 0) {
        skippedCount++;
      }
    });

    if (generated.length > 0) {
      setReminders(prev => [...generated, ...prev]);
    }

    return {
      sentCount,
      skippedCount,
      message: `Cron job nhắc lịch hoàn tất: Đã quét & gửi ${sentCount} thông báo (đảm bảo Idempotent), bỏ qua ${skippedCount} ca sát giờ.`,
      generatedReminders: generated
    };
  };

  // ==========================================
  // QUICK REPORTS (BEHAVIOR VIOLATIONS)
  // ==========================================
  const createReport = (data: {
    reported_user_id: string;
    booking_id?: string | null;
    reason_category: ReportReasonCategory;
    description: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Vui lòng đăng nhập để gửi báo cáo vi phạm!' };
    }

    // Validation rule: Chặn người dùng tự báo cáo chính mình (TC3)
    if (currentUser.id === data.reported_user_id) {
      return { 
        success: false, 
        message: 'Lỗi xác thực (Validation Error): Người dùng không thể tự báo cáo chính mình!' 
      };
    }

    const reportedUser = users.find(u => u.id === data.reported_user_id);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newReport: UserReport = {
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      reporter_id: currentUser.id,
      reporter_name: currentUser.full_name,
      reporter_role: currentUser.role,
      reported_user_id: data.reported_user_id,
      reported_user_name: reportedUser?.full_name || 'Người dùng hệ thống',
      reported_user_role: reportedUser?.role,
      booking_id: data.booking_id || null,
      reason_category: data.reason_category,
      description: data.description,
      status: 'open',
      created_at: nowStr
    };

    setReports(prev => [newReport, ...prev]);

    logAdminAction(
      'CREATE_USER_REPORT',
      'user',
      data.reported_user_id,
      `Báo cáo vi phạm hành vi [${data.reason_category}] gửi bởi ${currentUser.full_name} (${currentUser.role})`
    );

    // Notify support admins
    const supportAdmins = users.filter(u => u.role === 'admin' && (u.admin_role === 'support_admin' || u.admin_role === 'super_admin'));
    supportAdmins.forEach(adm => {
      createNotification(
        adm.id,
        '🚨 Báo cáo vi phạm hành vi mới',
        `${currentUser.full_name} đã báo cáo người dùng ${reportedUser?.full_name || 'Unknown'}: "${data.description.substring(0, 60)}..."`,
        'system',
        newReport.id
      );
    });

    return {
      success: true,
      message: 'Báo cáo vi phạm của bạn đã được tiếp nhận! Ban Quản Trị / Hỗ Trợ sẽ xác minh trong vòng 24 giờ làm việc.'
    };
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, resolutionNote?: string) => {
    // RBAC check: only support_admin and super_admin (TC4)
    if (currentUser?.role === 'admin') {
      const adminRole = currentUser.admin_role || 'super_admin';
      if (adminRole === 'finance_admin') {
        return {
          success: false,
          message: 'Lỗi phân quyền (403 Forbidden): Finance Admin chỉ phụ trách tài chính/ký quỹ, không có quyền xử lý Báo cáo vi phạm hành vi (Quick Reports)!'
        };
      }
    }

    const report = reports.find(r => r.id === reportId);
    if (!report) return { success: false, message: 'Báo cáo không tồn tại!' };

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const adminName = currentUser?.full_name || 'Support Admin';

    setReports(prev => prev.map(r => r.id === reportId ? {
      ...r,
      status,
      handled_by: currentUser?.id || 'admin_support',
      handler_name: adminName,
      resolution_note: resolutionNote || r.resolution_note,
      resolved_at: (status === 'resolved' || status === 'dismissed') ? nowStr : r.resolved_at
    } : r));

    logAdminAction(
      `HANDLE_REPORT_${status.toUpperCase()}`,
      'user',
      report.reported_user_id,
      `Xử lý báo cáo [${reportId}] chuyển sang ${status}. Ghi chú: ${resolutionNote || 'Đã thụ lý'}`
    );

    // If report resolved against a coach, check if coach has >= 2 reports -> suggest suspend
    const coachReports = reports.filter(r => r.reported_user_id === report.reported_user_id && (r.status === 'resolved' || r.status === 'open' || r.id === reportId));
    let extraNotice = '';
    if (coachReports.length >= 2) {
      extraNotice = ` (⚠️ Cảnh báo: HLV này đã nhận ${coachReports.length} báo cáo vi phạm — Khuyến nghị xem xét Đình chỉ)`;
    }

    return {
      success: true,
      message: `Đã cập nhật trạng thái báo cáo sang "${status}" thành công!${extraNotice}`
    };
  };

  // ==========================================
  // STUDENT STATS & IDOR-PROTECTED ANALYTICS
  // ==========================================
  const getStudentStats = (studentId: string) => {
    const studentBookings = bookings.filter(b => b.student_id === studentId);
    const completedBookings = studentBookings.filter(b => b.status === 'completed');
    const upcomingBookings = studentBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
    const cancelledBookings = studentBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected' || b.status === 'no_show');

    // Total spent: Sum of payments where status is released or held
    const studentPayments = payments.filter(p => p.student_id === studentId && (p.status === 'released' || p.status === 'held'));
    const totalSpent = studentPayments.reduce((sum, p) => sum + p.amount, 0);

    // Most frequent coach
    const coachCounts: { [id: string]: { name: string; avatar: string; count: number } } = {};
    completedBookings.forEach(b => {
      if (!coachCounts[b.coach_id]) {
        coachCounts[b.coach_id] = { name: b.coach_name, avatar: b.coach_avatar, count: 0 };
      }
      coachCounts[b.coach_id].count += 1;
    });

    let mostFrequentCoach: { id: string; name: string; avatar: string; count: number } | null = null;
    let maxCount = 0;
    Object.entries(coachCounts).forEach(([id, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        mostFrequentCoach = { id, name: data.name, avatar: data.avatar, count: data.count };
      }
    });

    const studentUser = users.find(u => u.id === studentId);

    return {
      totalSessionsCompleted: completedBookings.length,
      totalSpent,
      upcomingCount: upcomingBookings.length,
      cancelledCount: cancelledBookings.length,
      mostFrequentCoach,
      duprRating: studentUser?.dupr_rating || 3.2
    };
  };

  // Auth methods
  const registerUser = (data: {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: 'student' | 'coach';
    area?: string;
    experience_years?: number;
    price_per_session?: number;
    bio?: string;
    specialties?: string[];
  }) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: 'Định dạng email không hợp lệ!' };
    }

    // Validate duplicate email
    const regEmail = (data.email || '').trim().toLowerCase();
    const existing = users.find(u => (u.email || '').toLowerCase() === regEmail);
    if (existing) {
      return { success: false, message: 'Email này đã tồn tại trong hệ thống!' };
    }

    // Validate password
    if (!data.password || data.password.length < 8) {
      return { success: false, message: 'Mật khẩu phải có tối thiểu 8 ký tự!' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Xác nhận mật khẩu không khớp!' };
    }

    const newUserId = `user_${data.role}_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || '0901234567',
      avatar_url: sanitizeAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400'),
      role: data.role,
      status: 'active',
      created_at: new Date().toISOString().substring(0, 10),
      dupr_rating: data.role === 'student' ? 3.0 : 4.5,
      location: data.area || 'TP.HCM',
      password: data.password,
      failed_login_attempts: 0,
      locked_until: null
    };

    setUsers(prev => [newUser, ...prev]);

    // If Coach: create pending coach profile
    if (data.role === 'coach') {
      const newCoachProfile: CoachProfile = {
        id: `coach_${Date.now()}`,
        user_id: newUserId,
        user: newUser,
        bio: data.bio || 'Huấn luyện viên Pickleball nhiệt tình, chuyên nghiệp.',
        experience_years: data.experience_years || 2,
        price_per_session: data.price_per_session || 350000,
        commission_rate: 0.10,
        area: data.area || 'Quận 7, TP.HCM',
        courts: ['Sân PMH Sports Arena Q7', 'Sân D-Joy Pickleball'],
        specialties: data.specialties && data.specialties.length > 0 ? data.specialties : ['Người mới bắt đầu', 'Kỹ thuật Dinking & Drop Shot'],
        teaching_style: 'Thực chiến thi đấu, chỉnh sửa tư thế bộ chân chi tiết.',
        gallery_urls: [
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'
        ],
        certifications: [
          {
            id: `cert_${Date.now()}`,
            title: 'Chứng chỉ HLV Pickleball VPA',
            issuer: 'Hiệp hội Pickleball Việt Nam',
            year: 2025,
            proof_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
            verified: false
          }
        ],
        packages: [
          { id: `pkg_1_${Date.now()}`, title: 'Buổi Trải Nghiệm (1 buổi)', sessions: 1, discount_percent: 0, description: '1 buổi làm quen kỹ thuật' },
          { id: `pkg_3_${Date.now()}`, title: 'Gói Cơ Bản (3 buổi)', sessions: 3, discount_percent: 5, description: '3 buổi nắm vững kỹ năng cơ bản' },
          { id: `pkg_10_${Date.now()}`, title: 'Khóa Toàn Diện (10 buổi)', sessions: 10, discount_percent: 12, description: '10 buổi làm chủ chiến thuật thực chiến' }
        ],
        verification_status: 'pending',
        approval_status: 'pending',
        is_featured: false,
        rating_avg: 5.0,
        review_count: 0,
        students_count: 0,
        dupr_level: 4.5,
        created_at: new Date().toISOString().substring(0, 10)
      };

      setCoaches(prev => [newCoachProfile, ...prev]);

      // Notify Admin
      createNotification(
        'user_admin_1',
        'Hồ sơ HLV mới chờ duyệt',
        `Có hồ sơ HLV mới đăng ký: ${data.full_name} (${data.area || 'TP.HCM'}). Vui lòng kiểm tra chứng chỉ.`,
        'verification',
        newCoachProfile.id
      );
    }

    login(newUserId);
    return { 
      success: true, 
      message: data.role === 'coach' 
        ? 'Đăng ký thành công! Hồ sơ HLV của bạn đã được tạo và đang chờ Admin duyệt chứng chỉ.' 
        : 'Đăng ký tài khoản học viên thành công!',
      user: newUser 
    };
  };

  const loginUser = (email: string, password: string) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => (u.email || '').toLowerCase() === inputEmail);
    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
    }

    // Check brute force lock
    const now = Date.now();
    if (user.locked_until) {
      const lockExpiry = new Date(user.locked_until).getTime();
      if (lockExpiry > now) {
        const remainingMinutes = Math.ceil((lockExpiry - now) / (60 * 1000));
        return { 
          success: false, 
          message: `Tài khoản đã bị tạm khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${remainingMinutes} phút!`,
          lockedUntil: user.locked_until 
        };
      } else {
        // Unlock expired
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, failed_login_attempts: 0, locked_until: null } : u));
      }
    }

    // Check password (for demo purposes, accepts stored password or default '12345678' or password matches)
    const validPassword = user.password ? user.password === password : (password === '12345678' || password.length >= 6);

    if (!validPassword) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockTime: string | null = null;
      let alertMsg = `Mật khẩu không chính xác! (Lần thử sai: ${attempts}/5)`;

      if (attempts >= 5) {
        // Lock for 15 minutes
        lockTime = new Date(now + 15 * 60 * 1000).toISOString();
        alertMsg = 'Bạn đã nhập sai mật khẩu 5 lần liên tiếp. Tài khoản bị tạm khóa 15 phút để bảo vệ an toàn.';
      }

      setUsers(prev => prev.map(u => u.id === user.id ? {
        ...u,
        failed_login_attempts: attempts,
        locked_until: lockTime
      } : u));

      return { success: false, message: alertMsg, lockedUntil: lockTime || undefined };
    }

    // Reset failed attempts on success
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, failed_login_attempts: 0, locked_until: null } : u));
    login(user.id);
    return { success: true, message: `Chào mừng trở lại, ${user.full_name}!`, user };
  };

  const requestPasswordReset = (email: string) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => (u.email || '').toLowerCase() === inputEmail);
    if (!user) {
      return { success: false, message: 'Email này không tồn tại trong hệ thống!' };
    }

    // Generate 6-digit mock OTP/token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const newReset: PasswordReset = {
      id: 'reset_' + Date.now(),
      user_id: user.id,
      email: user.email,
      reset_token: resetToken,
      expires_at: expiresAt,
      used: false
    };

    setPasswordResets(prev => [newReset, ...prev]);

    return { 
      success: true, 
      resetToken, 
      message: 'Mã xác thực đặt lại mật khẩu đã được khởi tạo thành công!' 
    };
  };

  const resetPasswordWithToken = (email: string, resetToken: string, newPassword: string, confirmNewPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 8 ký tự!' };
    }

    if (newPassword !== confirmNewPassword) {
      return { success: false, message: 'Xác nhận mật khẩu mới không khớp!' };
    }

    const inputEmail = (email || '').trim().toLowerCase();
    const resetRecord = passwordResets.find(r => 
      (r.email || '').toLowerCase() === inputEmail && 
      r.reset_token === resetToken && 
      !r.used
    );

    if (!resetRecord) {
      return { success: false, message: 'Mã xác thực không hợp lệ hoặc đã được sử dụng!' };
    }

    const now = Date.now();
    if (new Date(resetRecord.expires_at).getTime() < now) {
      return { success: false, message: 'Mã xác thực đã hết hạn (quá 15 phút)! Vui lòng yêu cầu mã mới.' };
    }

    // Update user password and unlock
    setUsers(prev => prev.map(u => u.id === resetRecord.user_id ? {
      ...u,
      password: newPassword,
      failed_login_attempts: 0,
      locked_until: null
    } : u));

    // Invalidate reset token
    setPasswordResets(prev => prev.map(r => r.id === resetRecord.id ? { ...r, used: true } : r));

    return { success: true, message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
  };

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUserId(user.id);
      setCurrentRoleMode(user.role);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRoleMode(role);
    if (isLoggedIn) {
      // Find a user of that specific role
      const matchedUser = users.find(u => u.role === role);
      if (matchedUser) {
        setCurrentUserId(matchedUser.id);
      }
    }
  };

  const createBooking = ({
    coachId,
    slotId,
    packageTitle,
    sessionCount,
    totalPrice,
    notes,
    paymentMethod = 'qr_escrow'
  }: {
    coachId: string;
    slotId: string;
    packageTitle: string;
    sessionCount: number;
    totalPrice: number;
    notes?: string;
    paymentMethod?: 'qr_escrow' | 'pickle_wallet' | 'card_visa';
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Vui lòng đăng nhập để thực hiện đặt lịch!' };
    }

    const coach = coaches.find(c => c.id === coachId);
    const coachUser = users.find(u => u.id === coach?.user_id);
    const slot = slots.find(s => s.id === slotId);

    if (!slot || slot.is_booked) {
      return { success: false, message: 'Khung giờ này vừa được người khác đặt hoặc không khả dụng!' };
    }

    const newBookingId = generateUniqueId('bk');
    const newBooking: Booking = {
      id: newBookingId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_avatar: currentUser.avatar_url,
      student_phone: currentUser.phone,
      student_email: currentUser.email,
      coach_id: coachId,
      coach_name: coachUser?.full_name || 'Huấn luyện viên',
      coach_avatar: coachUser?.avatar_url || '',
      slot_id: slotId,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      court_name: slot.court_name || 'Sân tiêu chuẩn',
      package_title: packageTitle,
      session_count: sessionCount,
      total_price: totalPrice,
      status: 'pending',
      notes,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      has_reviewed: false
    };

    // Safe commission calculation (default 10% / 0.10)
    const commissionRate = typeof coach?.commission_rate === 'number' && !isNaN(coach.commission_rate) 
      ? coach.commission_rate 
      : 0.10;
    const commissionAmount = Math.round(totalPrice * commissionRate);
    const payoutAmount = totalPrice - commissionAmount;

    const newPaymentId = generateUniqueId('pay');
    const newPayment: Payment = {
      id: newPaymentId,
      booking_id: newBookingId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_avatar: currentUser.avatar_url,
      coach_id: coachId,
      coach_name: coachUser?.full_name || 'Huấn luyện viên',
      amount: totalPrice,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      payout_amount: payoutAmount,
      status: 'held',
      paid_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      payment_method: paymentMethod
    };

    // Mark slot as booked
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, is_booked: true } : s));
    setBookings(prev => [newBooking, ...prev]);
    setPayments(prev => [newPayment, ...prev]);

    // Notify coach about new booking & held escrow
    if (coach?.user_id) {
      createNotification(
        coach.user_id,
        'Có đơn đặt lịch mới (Escrow bảo chứng)',
        `Học viên ${currentUser.full_name} đã đặt lịch học "${packageTitle}" ngày ${slot.date} (${slot.start_time} - ${slot.end_time}). Học phí ${totalPrice.toLocaleString('vi-VN')}đ đã được tạm giữ an toàn trong quỹ Escrow.`,
        'booking',
        newBookingId
      );
    }

    return { 
      success: true, 
      message: 'Thanh toán Escrow thành công! Học phí được tạm giữ an toàn trong quỹ bảo chứng.', 
      bookingId: newBookingId,
      paymentId: newPaymentId
    };
  };

  const rescheduleBooking = (bookingId: string, newSlotId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Buổi học không tồn tại!' };
    
    // Check reschedule count (max 1 time)
    if ((booking.reschedule_count || 0) >= 1) {
      return { success: false, message: 'Mỗi buổi học chỉ được phép dời/đổi lịch tối đa 1 lần theo quy định!' };
    }

    // Check time limit: minimum 12h before original start time
    const bookingDateTimeStr = `${booking.date}T${booking.start_time}:00`;
    const bookingTime = new Date(bookingDateTimeStr).getTime();
    const now = Date.now();
    const hoursDiff = (bookingTime - now) / (1000 * 60 * 60);

    if (hoursDiff < 12) {
      return { 
        success: false, 
        message: 'Chỉ được phép đổi lịch trước giờ học tối thiểu 12 tiếng! Buổi học này không đủ điều kiện đổi lịch.' 
      };
    }

    const newSlot = slots.find(s => s.id === newSlotId);
    if (!newSlot || newSlot.is_booked) {
      return { success: false, message: 'Khung giờ mới này đã có người đặt hoặc không khả dụng!' };
    }

    // Free old slot
    if (booking.slot_id) {
      setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
    }
    // Book new slot
    setSlots(prev => prev.map(s => s.id === newSlotId ? { ...s, is_booked: true } : s));

    // Update booking
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      slot_id: newSlotId,
      date: newSlot.date,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      court_name: newSlot.court_name || b.court_name,
      status: 'pending',
      reschedule_count: (b.reschedule_count || 0) + 1,
      original_slot_id: b.original_slot_id || b.slot_id
    } : b));

    // Notify Coach
    const coach = coaches.find(c => c.id === booking.coach_id);
    if (coach?.user_id) {
      createNotification(
        coach.user_id,
        'Yêu cầu đổi lịch học',
        `Học viên ${booking.student_name} đã đổi lịch sang ngày ${newSlot.date} (${newSlot.start_time} - ${newSlot.end_time}). Vui lòng xác nhận lại.`,
        'booking',
        bookingId
      );
    }

    return { 
      success: true, 
      message: `Đổi lịch thành công sang ngày ${newSlot.date} (${newSlot.start_time} - ${newSlot.end_time})! Trạng thái đã chuyển sang chờ HLV xác nhận.` 
    };
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const cancelReason = reason || 'Học viên hủy lịch (Hoàn 100% Escrow)';

    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      status: 'cancelled', 
      cancellation_reason: cancelReason 
    } : b));

    // Release slot
    if (booking.slot_id) {
      setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
    }

    // Auto Refund Payment held in Escrow
    setPayments(prev => prev.map(p => {
      if (p.booking_id === bookingId && (p.status === 'held' || p.status === 'disputed')) {
        return {
          ...p,
          status: 'refunded',
          refunded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          refund_reason: cancelReason
        };
      }
      return p;
    }));

    // Notify coach and student
    const coach = coaches.find(c => c.id === booking.coach_id);
    if (coach?.user_id) {
      createNotification(
        coach.user_id,
        'Buổi học đã bị hủy',
        `Buổi học ngày ${booking.date} (${booking.start_time}) với học viên ${booking.student_name} đã bị hủy. Lý do: ${cancelReason}`,
        'booking',
        bookingId
      );
    }

    createNotification(
      booking.student_id,
      'Hủy lịch & Hoàn tiền Escrow',
      `Đã hủy thành công buổi học ngày ${booking.date}. Học phí ${booking.total_price.toLocaleString('vi-VN')}đ đã được hoàn 100% về tài khoản.`,
      'payment',
      bookingId
    );

    // AUTO-TRIGGER WAITLIST: If there is someone in waitlist for this slot/coach, offer it immediately!
    const targetWaitlistKey = booking.slot_id || booking.id;
    setTimeout(() => {
      inviteNextInWaitlist(targetWaitlistKey);
    }, 100);
  };

  // ==========================================
  // SESSION RECAPS (4 SKILLS & NOTES)
  // ==========================================
  const createSessionRecap = (data: {
    booking_id: string;
    note: string;
    skill_serve: number;
    skill_dink: number;
    skill_volley: number;
    skill_positioning: number;
  }) => {
    const booking = bookings.find(b => b.id === data.booking_id);
    if (!booking) {
      return { success: false, message: 'Không tìm thấy thông tin buổi học!' };
    }

    // Constraint 1: Chỉ tạo sau khi booking.status === 'completed'
    if (booking.status !== 'completed') {
      return { success: false, message: 'Chỉ có thể tạo Session Recap sau khi buổi học đã hoàn thành (Status: Completed)!' };
    }

    // Constraint 2: 1 booking_id chỉ có tối đa 1 recap (UNIQUE)
    const existingRecap = sessionRecaps.find(r => r.booking_id === data.booking_id);
    if (existingRecap) {
      return { success: false, message: 'Buổi học này đã được tạo Session Recap trước đó!' };
    }

    // Constraint 3: Điểm kỹ năng 1-5 (CHECK)
    const { skill_serve, skill_dink, skill_volley, skill_positioning } = data;
    const skills = [skill_serve, skill_dink, skill_volley, skill_positioning];
    if (skills.some(s => typeof s !== 'number' || s < 1 || s > 5 || isNaN(s))) {
      return { success: false, message: 'Điểm đánh giá các kỹ năng (Serve, Dink, Volley, Positioning) phải trong thang điểm từ 1 đến 5!' };
    }

    // Check if late (> 7 days from booking date)
    let isLate = false;
    if (booking.date) {
      const bDate = new Date(booking.date).getTime();
      const now = Date.now();
      const diffDays = (now - bDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) {
        isLate = true;
      }
    }

    const coach = coaches.find(c => c.id === booking.coach_id);
    const newRecap: SessionRecap = {
      id: 'recap_' + Date.now(),
      booking_id: data.booking_id,
      coach_id: booking.coach_id,
      coach_name: coach?.user?.full_name || 'HLV PickleConnect',
      coach_avatar: coach?.user?.avatar_url,
      student_id: booking.student_id,
      student_name: booking.student_name,
      student_avatar: booking.student_avatar,
      note: data.note.trim() || 'Buổi tập kỹ thuật đạt yêu cầu.',
      skill_serve: Math.round(skill_serve),
      skill_dink: Math.round(skill_dink),
      skill_volley: Math.round(skill_volley),
      skill_positioning: Math.round(skill_positioning),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      is_late: isLate,
      booking_date: booking.date,
      booking_court: booking.court_name
    };

    setSessionRecaps(prev => [newRecap, ...prev]);

    // Send notification to student
    createNotification(
      booking.student_id,
      'HLV đã gửi Session Recap & Chấm điểm',
      `HLV ${newRecap.coach_name} vừa gửi nhận xét chi tiết và đánh giá 4 kỹ năng cho buổi tập ngày ${booking.date}. Bấm để xem quá trình tiến bộ của bạn!`,
      'review',
      newRecap.id
    );

    return { 
      success: true, 
      message: isLate 
        ? 'Đã tạo Session Recap thành công (Ghi nhận: Recap gửi sau 7 ngày kể từ buổi học).' 
        : 'Đã tạo Session Recap và cập nhật chỉ số kỹ năng cho học viên thành công!',
      recap: newRecap 
    };
  };

  const getSessionRecapByBooking = (bookingId: string): SessionRecap | undefined => {
    return sessionRecaps.find(r => r.booking_id === bookingId);
  };

  const getStudentRecaps = (studentId: string): SessionRecap[] => {
    return sessionRecaps
      .filter(r => r.student_id === studentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // ==========================================
  // WAITLIST (FIFO QUEUE & SLOT ALLOCATION)
  // ==========================================
  const joinWaitlist = (data: {
    booking_id: string;
    coach_id: string;
    date: string;
    time: string;
    court_name: string;
    session_summary: string;
    price?: number;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Vui lòng đăng nhập để tham gia hàng chờ!' };
    }

    // Constraint: Chặn join trùng (UNIQUE (booking_id, student_id))
    const existing = waitlistEntries.find(
      w => w.booking_id === data.booking_id && 
           w.student_id === currentUser.id && 
           (w.status === 'waiting' || w.status === 'offered')
    );
    if (existing) {
      return { success: false, message: `Bạn đã nằm trong danh sách chờ của ca tập này ở vị trí #${existing.position}!` };
    }

    const coach = coaches.find(c => c.id === data.coach_id);
    
    // Position = max position in waiting + 1
    const waitingForSlot = waitlistEntries.filter(w => w.booking_id === data.booking_id && (w.status === 'waiting' || w.status === 'offered'));
    const nextPosition = waitingForSlot.length > 0 ? Math.max(...waitingForSlot.map(w => w.position)) + 1 : 1;

    const newEntry: WaitlistEntry = {
      id: 'wait_' + Date.now(),
      booking_id: data.booking_id,
      coach_id: data.coach_id,
      coach_name: coach?.user?.full_name || 'HLV PickleConnect',
      coach_avatar: coach?.user?.avatar_url,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_avatar: currentUser.avatar_url,
      student_phone: currentUser.phone,
      position: nextPosition,
      status: 'waiting',
      offered_at: null,
      offer_expires_at: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      session_summary: data.session_summary,
      date: data.date,
      time: data.time,
      court_name: data.court_name,
      price: data.price || coach?.price_per_session || 400000
    };

    setWaitlistEntries(prev => [...prev, newEntry]);

    createNotification(
      currentUser.id,
      'Gia nhập danh sách chờ thành công',
      `Bạn đang ở vị trí #${nextPosition} trong hàng chờ ca tập "${data.session_summary}" ngày ${data.date}. Hệ thống sẽ thông báo ngay khi có suất trống!`,
      'booking',
      newEntry.id
    );

    return { 
      success: true, 
      message: `Đã tham gia danh sách chờ thành công! Bạn đang ở vị trí thứ #${nextPosition}.`,
      entry: newEntry 
    };
  };

  const leaveWaitlist = (entryId: string) => {
    const entry = waitlistEntries.find(w => w.id === entryId);
    if (!entry) return { success: false, message: 'Không tìm thấy mục hàng chờ!' };

    setWaitlistEntries(prev => prev.map(w => w.id === entryId ? { ...w, status: 'cancelled' } : w));
    return { success: true, message: 'Đã hủy khỏi danh sách chờ thành công.' };
  };

  const inviteNextInWaitlist = (bookingId: string): WaitlistEntry | null => {
    // Find next eligible entry in 'waiting' state with lowest position
    const eligible = waitlistEntries
      .filter(w => w.booking_id === bookingId && w.status === 'waiting')
      .sort((a, b) => a.position - b.position);

    if (eligible.length === 0) return null;

    const nextCandidate = eligible[0];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours deadline

    const offeredAtStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const expiresAtStr = expiresAt.toISOString().replace('T', ' ').substring(0, 16);

    setWaitlistEntries(prev => prev.map(w => w.id === nextCandidate.id ? {
      ...w,
      status: 'offered',
      offered_at: offeredAtStr,
      offer_expires_at: expiresAtStr
    } : w));

    // Send urgent notification
    createNotification(
      nextCandidate.student_id,
      '🎉 Có suất tập trống dành cho bạn!',
      `Một suất tập ca "${nextCandidate.session_summary}" ngày ${nextCandidate.date} vừa được giải phóng! Bạn có 2 GIỜ (hạn chót: ${expiresAtStr.split(' ')[1]}) để xác nhận giữ chỗ trước khi chuyển cho người tiếp theo.`,
      'booking',
      nextCandidate.id
    );

    return {
      ...nextCandidate,
      status: 'offered',
      offered_at: offeredAtStr,
      offer_expires_at: expiresAtStr
    };
  };

  const acceptWaitlistOffer = (entryId: string) => {
    const entry = waitlistEntries.find(w => w.id === entryId);
    if (!entry) return { success: false, message: 'Không tìm thấy mục hàng chờ!' };

    if (entry.status !== 'offered') {
      return { success: false, message: 'Suất tập hiện không ở trạng thái chờ xác nhận của bạn!' };
    }

    // Check if expired
    if (entry.offer_expires_at && new Date(entry.offer_expires_at).getTime() < Date.now()) {
      setWaitlistEntries(prev => prev.map(w => w.id === entryId ? { ...w, status: 'expired' } : w));
      inviteNextInWaitlist(entry.booking_id);
      return { success: false, message: 'Suất tập đã hết hạn 2 giờ xác nhận. Hệ thống đã chuyển cho người tiếp theo trong hàng chờ.' };
    }

    // Mark as accepted
    setWaitlistEntries(prev => prev.map(w => w.id === entryId ? { ...w, status: 'accepted' } : w));

    // Create booking automatically for the student
    const newBookingId = 'bk_wl_' + Date.now();
    const totalPrice = entry.price || 450000;
    const newBooking: Booking = {
      id: newBookingId,
      coach_id: entry.coach_id,
      coach_name: entry.coach_name,
      coach_avatar: entry.coach_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      student_id: entry.student_id,
      student_name: entry.student_name,
      student_avatar: entry.student_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      student_phone: entry.student_phone || '0912345678',
      student_email: `${entry.student_id}@pickleconnect.vn`,
      slot_id: entry.booking_id,
      date: entry.date,
      start_time: entry.time.split(' - ')[0] || '17:00',
      end_time: entry.time.split(' - ')[1] || '18:30',
      court_name: entry.court_name,
      total_price: totalPrice,
      status: 'confirmed',
      package_title: 'Nhận suất từ Danh sách chờ (Waitlist)',
      session_count: 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reschedule_count: 0
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create payment in Escrow
    const newPayment: Payment = {
      id: 'pay_wl_' + Date.now(),
      booking_id: newBookingId,
      student_id: entry.student_id,
      student_name: entry.student_name,
      student_avatar: entry.student_avatar,
      coach_id: entry.coach_id,
      coach_name: entry.coach_name,
      amount: totalPrice,
      commission_rate: 0.1,
      commission_amount: totalPrice * 0.1,
      payout_amount: totalPrice * 0.9,
      status: 'held',
      paid_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      payment_method: 'pickle_wallet'
    };
    setPayments(prev => [newPayment, ...prev]);

    createNotification(
      entry.student_id,
      'Xác nhận suất tập thành công!',
      `Bạn đã nhận thành công ca tập ngày ${entry.date} (${entry.time}) tại ${entry.court_name}. Tiền học phí đã được tạm giữ an toàn trong Escrow.`,
      'booking',
      newBookingId
    );

    const coach = coaches.find(c => c.id === entry.coach_id);
    if (coach?.user_id) {
      createNotification(
        coach.user_id,
        'Học viên nhận slot từ hàng chờ',
        `Học viên ${entry.student_name} vừa nhận suất tập trống ngày ${entry.date} (${entry.time}).`,
        'booking',
        newBookingId
      );
    }

    return { success: true, message: 'Chúc mừng bạn! Đã nhận suất tập thành công và tạo lịch đặt.' };
  };

  const declineWaitlistOffer = (entryId: string) => {
    const entry = waitlistEntries.find(w => w.id === entryId);
    if (!entry) return { success: false, message: 'Không tìm thấy mục hàng chờ!' };

    setWaitlistEntries(prev => prev.map(w => w.id === entryId ? { ...w, status: 'cancelled' } : w));
    // Invite the next person in line
    inviteNextInWaitlist(entry.booking_id);

    return { success: true, message: 'Bạn đã từ chối suất tập. Hệ thống đã chuyển cơ hội cho người tiếp theo.' };
  };

  const updateStudentSkillLevel = (studentId: string, skillLevel: SkillLevel) => {
    setUsers(prev => prev.map(u => u.id === studentId ? { ...u, skill_level: skillLevel } : u));
    return { success: true, message: 'Đã cập nhật trình độ kỹ năng thành công!' };
  };

  const submitReview = (bookingId: string, rating: number, comment: string, skillTags?: string[]) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !currentUser) return;

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      booking_id: bookingId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_avatar: currentUser.avatar_url,
      coach_id: booking.coach_id,
      rating,
      comment,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      is_hidden: false,
      skill_tags: skillTags || []
    };

    setReviews(prev => [newReview, ...prev]);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, has_reviewed: true } : b));

    // Update coach's average rating
    setCoaches(prev => prev.map(c => {
      if (c.id === booking.coach_id) {
        const coachRevs = [...reviews.filter(r => r.coach_id === c.id && !r.is_hidden), newReview];
        const avg = coachRevs.reduce((acc, curr) => acc + curr.rating, 0) / coachRevs.length;
        return {
          ...c,
          rating_avg: Number(avg.toFixed(1)),
          review_count: coachRevs.length
        };
      }
      return c;
    }));

    // Notify coach about new review
    const coach = coaches.find(c => c.id === booking.coach_id);
    if (coach?.user_id) {
      createNotification(
        coach.user_id,
        'Bạn nhận được đánh giá mới',
        `Học viên ${currentUser.full_name} đã đánh giá ${rating} sao cho buổi học ngày ${booking.date}: "${comment}"`,
        'system',
        newReview.id
      );
    }
  };

  const updateCoachProfile = (profileId: string, updates: Partial<CoachProfile>) => {
    setCoaches(prev => prev.map(c => c.id === profileId ? { ...c, ...updates } : c));
  };

  const addAvailabilitySlot = (date: string, startTime: string, endTime: string, courtName: string) => {
    if (!currentUser) return;
    const coachProfile = coaches.find(c => c.user_id === currentUser.id);
    if (!coachProfile) return;

    const newSlot: AvailabilitySlot = {
      id: generateUniqueId('slot'),
      coach_id: coachProfile.id,
      date,
      start_time: startTime,
      end_time: endTime,
      court_name: courtName,
      is_booked: false
    };

    setSlots(prev => [...prev, newSlot]);
  };

  const deleteAvailabilitySlot = (slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId));
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, rejectionReason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      status, 
      cancellation_reason: rejectionReason || b.cancellation_reason 
    } : b));

    const coach = coaches.find(c => c.id === booking.coach_id);

    // If accepted/confirmed: notify student
    if (status === 'confirmed') {
      createNotification(
        booking.student_id,
        'HLV đã xác nhận lịch học!',
        `Huấn luyện viên ${booking.coach_name} đã xác nhận buổi học ngày ${booking.date} (${booking.start_time} - ${booking.end_time}) tại ${booking.court_name}.`,
        'booking',
        bookingId
      );
    }

    // If rejected or cancelled, release slot & auto-refund
    if (status === 'cancelled') {
      if (booking.slot_id) {
        setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
      }
      setPayments(prev => prev.map(p => {
        if (p.booking_id === bookingId && p.status === 'held') {
          return {
            ...p,
            status: 'refunded',
            refunded_at: nowStr,
            refund_reason: rejectionReason || 'HLV từ chối hoặc hủy đơn (Hoàn 100% Escrow)'
          };
        }
        return p;
      }));

      createNotification(
        booking.student_id,
        'Buổi học không được tiếp nhận / Đã hủy',
        `HLV ${booking.coach_name} đã hủy/từ chối buổi học ngày ${booking.date}. Học phí ${booking.total_price.toLocaleString('vi-VN')}đ đã được hoàn 100% Escrow về ví của bạn. Lý do: ${rejectionReason || 'HLV bận đột xuất'}`,
        'payment',
        bookingId
      );
    }

    // If completed: auto-release escrow to coach + create payout record
    if (status === 'completed') {
      setCoaches(prev => prev.map(c => c.id === booking.coach_id ? { ...c, students_count: c.students_count + 1 } : c));
      
      setPayments(prev => prev.map(p => {
        if (p.booking_id === bookingId && p.status === 'held') {
          const releasedPayment: Payment = {
            ...p,
            status: 'released',
            released_at: nowStr
          };

          // Record payout for coach
          const newPayout: PayoutHistory = {
            id: 'payout_' + Date.now(),
            coach_id: p.coach_id,
            payment_id: p.id,
            booking_id: p.booking_id,
            amount: p.payout_amount,
            created_at: nowStr
          };
          setPayouts(payoutPrev => [newPayout, ...payoutPrev]);

          // Notify Coach
          if (coach?.user_id) {
            createNotification(
              coach.user_id,
              'Giải ngân thu nhập Escrow thành công',
              `Buổi học với học viên ${booking.student_name} đã hoàn tất. Số tiền ${p.payout_amount.toLocaleString('vi-VN')}đ (đã trừ 10% phí nền tảng) đã được chuyển về tài khoản của bạn.`,
              'payout',
              p.id
            );
          }

          return releasedPayment;
        }
        return p;
      }));

      // Notify student to review
      createNotification(
        booking.student_id,
        'Buổi học hoàn tất - Mời đánh giá',
        `Buổi học ngày ${booking.date} với HLV ${booking.coach_name} đã hoàn thành. Hãy để lại đánh giá và nhận xét trải nghiệm nhé!`,
        'booking',
        bookingId
      );
    }
  };

  const disputePayment = (paymentId: string, reason: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'disputed',
          dispute_reason: reason
        };
      }
      return p;
    }));

    // Notify Admin
    createNotification(
      'user_admin_1',
      'Có khiếu nại giao dịch Escrow',
      `Giao dịch mã ${paymentId} vừa phát sinh khiếu nại. Lý do: "${reason}". Vui lòng kiểm tra và xử lý.`,
      'dispute',
      paymentId
    );
  };

  const resolveDispute = (
    paymentId: string, 
    resolution: 'release_coach' | 'refund_student' | 'release_to_coach' | 'refund_to_student', 
    notes?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const isRelease = resolution === 'release_coach' || resolution === 'release_to_coach';
        if (isRelease) {
          const newPayout: PayoutHistory = {
            id: 'payout_' + Date.now(),
            coach_id: p.coach_id,
            payment_id: p.id,
            booking_id: p.booking_id,
            amount: p.payout_amount,
            created_at: nowStr
          };
          setPayouts(payoutPrev => [newPayout, ...payoutPrev]);

          const coach = coaches.find(c => c.id === p.coach_id);
          if (coach?.user_id) {
            createNotification(
              coach.user_id,
              'Khiếu nại đã xử lý: Giải ngân học phí',
              `Admin đã kiểm tra và giải ngân ${p.payout_amount.toLocaleString('vi-VN')}đ cho bạn sau khi giải quyết khiếu nại. Ghi chú: ${notes || 'Hợp lệ'}`,
              'payout',
              p.id
            );
          }

          return {
            ...p,
            status: 'released',
            released_at: nowStr,
            admin_resolution_notes: notes || 'Admin đã duyệt giải ngân cho HLV sau khi xác minh buổi học'
          };
        } else {
          createNotification(
            p.student_id,
            'Khiếu nại được chấp thuận: Hoàn tiền Escrow',
            `Admin đã đồng ý hoàn trả 100% (${p.amount.toLocaleString('vi-VN')}đ) về tài khoản của bạn. Ghi chú: ${notes || 'Đã chấp thuận khiếu nại'}`,
            'payment',
            p.id
          );

          return {
            ...p,
            status: 'refunded',
            refunded_at: nowStr,
            refund_reason: 'Admin chấp thuận hoàn tiền theo khiếu nại của học viên',
            admin_resolution_notes: notes || 'Admin đã duyệt hoàn trả 100% cho học viên'
          };
        }
      }
      return p;
    }));
  };

  const getPaymentForBooking = (bookingId: string): Payment | undefined => {
    return payments.find(p => p.booking_id === bookingId);
  };

  const getCoachEarnings = (coachId: string) => {
    const coachPayments = payments.filter(p => p.coach_id === coachId);
    const totalEarnings = coachPayments
      .filter(p => p.status === 'released')
      .reduce((sum, p) => sum + p.payout_amount, 0);
    const pendingEscrow = coachPayments
      .filter(p => p.status === 'held')
      .reduce((sum, p) => sum + p.payout_amount, 0);
    const totalSessionsCompleted = bookings.filter(b => b.coach_id === coachId && b.status === 'completed').length;
    const coachPayouts = payouts.filter(p => p.coach_id === coachId);

    return {
      totalEarnings,
      pendingEscrow,
      totalSessionsCompleted,
      payoutHistory: coachPayouts
    };
  };

  const getPlatformStats = () => {
    const gmv = payments.reduce((sum, p) => sum + p.amount, 0);
    const escrowHeld = payments
      .filter(p => p.status === 'held')
      .reduce((sum, p) => sum + p.amount, 0);
    const platformCommission = payments
      .filter(p => p.status === 'released')
      .reduce((sum, p) => sum + p.commission_amount, 0);
    const totalPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);
    const refundedTotal = payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = payments.length;

    return {
      totalVolume: gmv,
      gmv,
      escrowHeld,
      platformCommission,
      totalPayouts,
      totalRefunded: refundedTotal,
      refundedTotal,
      totalTransactions
    };
  };

  const submitSkillAssessment = (data: Omit<SkillRating, 'id' | 'assessed_at'>) => {
    const newRating: SkillRating = {
      ...data,
      id: 'skill_' + Date.now(),
      assessed_at: new Date().toISOString().substring(0, 10),
    };
    setSkillRatings(prev => [newRating, ...prev]);
    // update student's dupr rating
    setUsers(prev => prev.map(u => u.id === data.student_id ? { ...u, dupr_rating: data.dupr_score } : u));

    // Notify student
    createNotification(
      data.student_id,
      'Đánh giá trình độ DUPR mới',
      `Bạn vừa nhận được chứng chỉ thẩm định trình độ DUPR ${data.dupr_score.toFixed(2)} từ HLV ${data.coach_name}.`,
      'system',
      newRating.id
    );
  };

  const replyToReview = (reviewId: string, reply: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return { success: false, message: 'Đánh giá không tồn tại!' };
    if (review.coach_reply_at) {
      return { success: false, message: 'Bạn đã phản hồi đánh giá này rồi. Mỗi đánh giá chỉ được phản hồi 1 lần!' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      coach_reply: reply,
      coach_reply_at: nowStr
    } : r));

    // Notify Student
    createNotification(
      review.student_id,
      'HLV đã phản hồi nhận xét của bạn',
      `Huấn luyện viên đã gửi phản hồi: "${reply.length > 60 ? reply.substring(0, 60) + '...' : reply}"`,
      'system',
      reviewId
    );

    return { success: true, message: 'Gửi phản hồi cho đánh giá của học viên thành công!' };
  };

  const verifyCoachProfile = (coachId: string, approve: boolean, rejectionReason?: string) => {
    setCoaches(prev => prev.map(c => {
      if (c.id === coachId) {
        if (c.user_id) {
          createNotification(
            c.user_id,
            approve ? 'Hồ sơ HLV đã được xác thực chính thức!' : 'Hồ sơ HLV bị từ chối xác minh',
            approve 
              ? 'Chúc mừng! Hồ sơ HLV của bạn đã được kiểm duyệt bằng cấp và huy hiệu "Đã duyệt bằng cấp" chính thức kích hoạt.' 
              : `Hồ sơ HLV chưa đạt yêu cầu kiểm duyệt. Lý do: ${rejectionReason || 'Chứng chỉ chưa hợp lệ'}`,
            'verification',
            coachId
          );
        }

        return {
          ...c,
          verification_status: approve ? 'verified' : 'rejected',
          rejection_reason: approve ? undefined : rejectionReason,
          verified_at: approve ? new Date().toISOString().substring(0, 10) : undefined,
          verified_by: approve ? currentUser?.id : undefined,
          certifications: c.certifications.map(cert => ({ ...cert, verified: approve }))
        };
      }
      return c;
    }));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: u.status === 'active' ? 'suspended' : 'active'
    } : u));
  };

  const toggleFeaturedCoach = (coachId: string) => {
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, is_featured: !c.is_featured } : c));
  };

  const toggleHideReview = (reviewId: string, reason?: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      is_hidden: !r.is_hidden,
      hide_reason: !r.is_hidden ? (reason || 'Vi phạm tiêu chuẩn cộng đồng') : undefined
    } : r));
  };

  const enrollInClass = (classId: string, studentId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) return { success: false, message: 'Lớp học không tồn tại.' };
    if (targetClass.student_ids.includes(studentId)) {
      return { success: false, message: 'Học viên đã có trong danh sách lớp này rồi.' };
    }
    if (targetClass.student_ids.length >= targetClass.max_students) {
      return { success: false, message: `Lớp đã đủ sĩ số tối đa (${targetClass.max_students} học viên).` };
    }

    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return { ...c, student_ids: [...c.student_ids, studentId] };
      }
      return c;
    }));

    return { success: true, message: `Đã xếp học viên vào lớp ${targetClass.name} thành công!` };
  };

  const addClassStudent = (classId: string, studentId: string) => {
    return enrollInClass(classId, studentId);
  };

  const removeClassStudent = (classId: string, studentId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return { ...c, student_ids: c.student_ids.filter(id => id !== studentId) };
      }
      return c;
    }));
  };

  const selfAssessDUPR = (data: {
    studentId: string;
    duprScore: number;
    metrics: SkillRating['metrics'];
    notes?: string;
    recommendedDrills?: string[];
  }) => {
    const student = users.find(u => u.id === data.studentId);
    const newRating: SkillRating = {
      id: 'skill_self_' + Date.now(),
      student_id: data.studentId,
      student_name: student?.full_name || currentUser.full_name,
      coach_id: 'coach_system_dupr',
      coach_name: 'Hệ Thống Thẩm Định DUPR Chuẩn Quốc Tế',
      assessed_at: new Date().toISOString().substring(0, 10),
      dupr_score: data.duprScore,
      metrics: data.metrics,
      notes: data.notes || 'Kết quả kiểm tra & chẩn đoán trình độ trực tiếp trên nền tảng PickleConnect.',
      recommended_drills: data.recommendedDrills || [
        'Drill Dinking 7-11 chéo sân tại Kitchen',
        'Drill Third Shot Drop từ Baseline vào vùng Non-Volley Zone',
        'Drill Phản xạ bắt Volley & Reset bóng tốc độ cao tại lưới'
      ]
    };

    setSkillRatings(prev => [newRating, ...prev]);
    setUsers(prev => prev.map(u => u.id === data.studentId ? { ...u, dupr_rating: data.duprScore } : u));
  };

  const createCoachClass = (data: Omit<CoachClass, 'id'>) => {
    const newClass: CoachClass = {
      ...data,
      id: `class_${Date.now()}`
    };
    setClasses(prev => [newClass, ...prev]);
  };

  const addNewUser = (userData: Omit<User, 'id'>, coachDetails?: Partial<CoachProfile>): User => {
    const newId = `user_${userData.role}_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      status: userData.status || 'active'
    };

    setUsers(prev => [newUser, ...prev]);

    // If role is coach, create a corresponding coach profile
    if (userData.role === 'coach') {
      const newCoachProfile: CoachProfile = {
        id: `coach_profile_${Date.now()}`,
        user_id: newId,
        bio: coachDetails?.bio || 'Huấn luyện viên Pickleball nhiệt huyết, giàu kinh nghiệm đào tạo kỹ thuật cơ bản và nâng cao chuẩn quốc tế.',
        experience_years: coachDetails?.experience_years || 3,
        price_per_session: coachDetails?.price_per_session || 350000,
        area: coachDetails?.area || userData.location || 'Quận 7, TP.HCM',
        courts: coachDetails?.courts || (userData.location ? [userData.location] : ['Sân Pickleball Chuẩn Quốc Tế']),
        specialties: coachDetails?.specialties || ['Kỹ thuật Cơ bản', 'Dinking', 'Third Shot Drop', 'Chiến thuật Đôi'],
        certifications: coachDetails?.certifications || [
          {
            id: `cert_${Date.now()}`,
            title: 'PPR Certified Coach Level 1',
            issuer: 'PPR Pickleball',
            year: 2024,
            proof_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600',
            verified: true
          }
        ],
        teaching_style: coachDetails?.teaching_style || 'Tận tâm, chi tiết, kèm cặp chỉnh sửa từng góc chạm bóng thực chiến.',
        video_intro_url: coachDetails?.video_intro_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        gallery_urls: coachDetails?.gallery_urls || [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600'
        ],
        packages: coachDetails?.packages || [
          { id: `pkg_1_${Date.now()}`, title: 'Buổi trải nghiệm kỹ năng', sessions: 1, discount_percent: 0, description: '1 buổi làm quen kỹ thuật cơ bản' },
          { id: `pkg_2_${Date.now()}`, title: 'Gói Nền tảng DUPR (3 buổi)', sessions: 3, discount_percent: 10, description: '3 buổi rèn giũa kỹ chiến thuật căn bản' },
          { id: `pkg_3_${Date.now()}`, title: 'Gói Chiến thuật Chuyên sâu (5 buổi)', sessions: 5, discount_percent: 15, description: '5 buổi huấn luyện thực chiến và kiểm tra DUPR' }
        ],
        verification_status: 'verified',
        is_featured: false,
        rating_avg: 5.0,
        review_count: 0,
        students_count: 0,
        dupr_level: coachDetails?.dupr_level || 4.5,
        created_at: new Date().toISOString()
      };
      setCoaches(prev => [newCoachProfile, ...prev]);
    }

    login(newId);
    return newUser;
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const resetDatabase = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COACHES);
    localStorage.removeItem(STORAGE_KEYS.SLOTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.PAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERS);
    localStorage.removeItem(STORAGE_KEYS.AVAILABILITY_RULES);
    localStorage.removeItem(STORAGE_KEYS.CANCELLATION_RULES);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SESSION_RECAPS);
    localStorage.removeItem(STORAGE_KEYS.WAITLIST_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE_MODE);

    setUsers(INITIAL_USERS);
    setCoaches(INITIAL_COACHES);
    setSlots(INITIAL_SLOTS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setSkillRatings(INITIAL_SKILL_RATINGS);
    setClasses(INITIAL_CLASSES);
    setPayments(INITIAL_PAYMENTS);
    setPayouts(INITIAL_PAYOUTS);
    setAdminLogs(INITIAL_ADMIN_LOGS);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setAvailabilityRules(INITIAL_COACH_AVAILABILITY_RULES);
    setCancellationRules(INITIAL_CANCELLATION_RULES);
    setReminders(INITIAL_REMINDERS);
    setReports(INITIAL_REPORTS);
    setSessionRecaps(INITIAL_SESSION_RECAPS);
    setWaitlistEntries(INITIAL_WAITLIST_ENTRIES);
    setIsLoggedIn(true);
    setCurrentUserId('user_admin_1');
    setCurrentRoleMode('admin');
  };

  const coachesWithUsers: CoachProfile[] = React.useMemo(() => {
    return coaches.map(coach => {
      const matchedUser = users.find(u => u.id === coach.user_id);
      return {
        ...coach,
        user: coach.user || matchedUser
      };
    });
  }, [coaches, users]);

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoggedIn,
      currentRoleMode,
      setCurrentUser: (u) => {
        if (u) {
          login(u.id);
        } else {
          logout();
        }
      },
      setCurrentRoleMode,
      users,
      coaches: coachesWithUsers,
      slots,
      bookings,
      reviews,
      skillRatings,
      classes,
      payments,
      payouts,
      notifications,
      wishlist,
      passwordResets,
      adminLogs,
      adminUsers,
      availabilityRules,
      cancellationRules,
      reminders,
      reports,
      sessionRecaps,
      waitlistEntries,
      switchRole,
      login,
      logout,
      registerUser,
      loginUser,
      requestPasswordReset,
      resetPasswordWithToken,
      hasAdminPermission,
      logAdminAction,
      updateCoachApproval,
      addAvailabilityRule,
      removeAvailabilityRule,
      checkInBooking,
      reportNoShow,
      calculateRefund,
      createNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getUserNotifications,
      triggerCronSessionReminders,
      createReport,
      updateReportStatus,
      getStudentStats,
      toggleWishlist,
      isCoachWishlisted,
      getWishlistCoaches,
      createSessionRecap,
      getSessionRecapByBooking,
      getStudentRecaps,
      joinWaitlist,
      leaveWaitlist,
      acceptWaitlistOffer,
      declineWaitlistOffer,
      inviteNextInWaitlist,
      updateStudentSkillLevel,
      createBooking,
      rescheduleBooking,
      cancelBooking,
      submitReview,
      enrollInClass,
      addClassStudent,
      removeClassStudent,
      createCoachClass,
      updateCoachProfile,
      addAvailabilitySlot,
      deleteAvailabilitySlot,
      updateBookingStatus,
      submitSkillAssessment,
      selfAssessDUPR,
      replyToReview,
      verifyCoachProfile,
      toggleUserStatus,
      toggleFeaturedCoach,
      toggleHideReview,
      disputePayment,
      resolveDispute,
      getPaymentForBooking,
      getCoachEarnings,
      getPlatformStats,
      addNewUser,
      updateUserProfile,
      resetDatabase,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
