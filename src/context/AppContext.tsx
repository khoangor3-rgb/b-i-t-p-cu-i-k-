import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, CoachProfile, AvailabilitySlot, Booking, Review, 
  SkillRating, UserRole, BookingStatus, CoachClass 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COACHES, INITIAL_SLOTS, 
  INITIAL_BOOKINGS, INITIAL_REVIEWS, INITIAL_SKILL_RATINGS, INITIAL_CLASSES 
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
  
  // Role switcher & Auth
  switchRole: (role: UserRole) => void;
  login: (userId: string) => void;
  logout: () => void;
  
  // Actions for Student
  createBooking: (data: {
    coachId: string;
    slotId: string;
    packageTitle: string;
    sessionCount: number;
    totalPrice: number;
    notes?: string;
  }) => { success: boolean; message: string; bookingId?: string };
  
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
  replyToReview: (reviewId: string, reply: string) => void;
  
  // Actions for Admin
  verifyCoachProfile: (coachId: string, approve: boolean, rejectionReason?: string) => void;
  toggleUserStatus: (userId: string) => void;
  toggleFeaturedCoach: (coachId: string) => void;
  toggleHideReview: (reviewId: string, reason?: string) => void;
  
  // User Management & Profile
  addNewUser: (userData: Omit<User, 'id'>, coachDetails?: Partial<CoachProfile>) => User;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  
  // System reset
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'pickleconnect_users_v2',
  COACHES: 'pickleconnect_coaches_v2',
  SLOTS: 'pickleconnect_slots_v2',
  BOOKINGS: 'pickleconnect_bookings_v2',
  REVIEWS: 'pickleconnect_reviews_v2',
  SKILLS: 'pickleconnect_skills_v2',
  CLASSES: 'pickleconnect_classes_v2',
  CURRENT_USER_ID: 'pickleconnect_current_user_id_v2',
  IS_LOGGED_IN: 'pickleconnect_is_logged_in_v2',
  CURRENT_ROLE_MODE: 'pickleconnect_current_role_mode_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
    }
    return INITIAL_USERS;
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
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const loggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (loggedIn === 'false') return null;
    return saved || 'user_stu_1';
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
    notes
  }: {
    coachId: string;
    slotId: string;
    packageTitle: string;
    sessionCount: number;
    totalPrice: number;
    notes?: string;
  }) => {
    const coach = coaches.find(c => c.id === coachId);
    const coachUser = users.find(u => u.id === coach?.user_id);
    const slot = slots.find(s => s.id === slotId);

    if (!slot || slot.is_booked) {
      return { success: false, message: 'Khung giờ này vừa được người khác đặt hoặc không khả dụng!' };
    }

    const newBookingId = 'bk_' + Date.now();
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

    // Mark slot as booked
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, is_booked: true } : s));
    setBookings(prev => [newBooking, ...prev]);

    return { success: true, message: 'Yêu cầu đặt lịch đã được gửi thành công!', bookingId: newBookingId };
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', cancellation_reason: reason || 'Học viên hủy lịch' } : b));
    // Release slot
    if (booking.slot_id) {
      setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
    }
  };

  const submitReview = (bookingId: string, rating: number, comment: string, skillTags?: string[]) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

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
  };

  const updateCoachProfile = (profileId: string, updates: Partial<CoachProfile>) => {
    setCoaches(prev => prev.map(c => c.id === profileId ? { ...c, ...updates } : c));
  };

  const addAvailabilitySlot = (date: string, startTime: string, endTime: string, courtName: string) => {
    // find coach profile of current user
    const coachProfile = coaches.find(c => c.user_id === currentUser.id);
    if (!coachProfile) return;

    const newSlot: AvailabilitySlot = {
      id: 'slot_' + Date.now(),
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

    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      status, 
      cancellation_reason: rejectionReason || b.cancellation_reason 
    } : b));

    // If rejected or cancelled, release slot
    if (status === 'cancelled' && booking.slot_id) {
      setSlots(prev => prev.map(s => s.id === booking.slot_id ? { ...s, is_booked: false } : s));
    }

    // If completed, increment coach student count
    if (status === 'completed') {
      setCoaches(prev => prev.map(c => c.id === booking.coach_id ? { ...c, students_count: c.students_count + 1 } : c));
    }
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
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, coach_reply: reply } : r));
  };

  const verifyCoachProfile = (coachId: string, approve: boolean, rejectionReason?: string) => {
    setCoaches(prev => prev.map(c => {
      if (c.id === coachId) {
        return {
          ...c,
          verification_status: approve ? 'verified' : 'rejected',
          rejection_reason: approve ? undefined : rejectionReason,
          verified_at: approve ? new Date().toISOString().substring(0, 10) : undefined,
          verified_by: approve ? currentUser.id : undefined,
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
    setIsLoggedIn(true);
    setCurrentUserId('user_admin_long');
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
      switchRole,
      login,
      logout,
      createBooking,
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
