/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CoachList } from './components/StudentView/CoachList';
import { CoachDetailModal } from './components/StudentView/CoachDetailModal';
import { StudentBookings } from './components/StudentView/StudentBookings';
import { StudentDUPRProfile } from './components/StudentView/StudentDUPRProfile';
import { CoachScheduleManager } from './components/CoachView/CoachScheduleManager';
import { CoachProfileEditor } from './components/CoachView/CoachProfileEditor';
import { CoachStats } from './components/CoachView/CoachStats';
import { CoachAssessmentModal } from './components/CoachView/CoachAssessmentModal';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { ClassManagementView } from './components/ClassManagementView';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { ReviewModal } from './components/ReviewModal';
import { VideoModal } from './components/VideoModal';
import { DUPRSelfAssessmentModal } from './components/StudentView/DUPRSelfAssessmentModal';
import { AccountModal } from './components/AccountModal';
import { AuthLandingView } from './components/AuthLandingView';
import { CoachProfile, Booking, UserRole } from './types';
import { CheckCircle2, ShieldCheck, Heart, Award, Sparkles, LogIn, Lock } from 'lucide-react';

function MainApp() {
  const { currentUser, currentRoleMode, isLoggedIn } = useApp();
  
  // Active role mode
  const activeRole: UserRole = currentUser?.role || currentRoleMode || 'student';

  // Navigation tabs: 'home' | 'bookings' | 'dupr' | 'coach_schedule' | 'coach_profile' | 'coach_stats' | 'admin_dashboard' | 'admin_verify' | 'admin_users'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Sync tab with role
  React.useEffect(() => {
    if (activeRole === 'coach' && (currentTab === 'home' || currentTab === 'bookings' || currentTab === 'dupr' || currentTab === 'classes')) {
      setCurrentTab('coach_classes');
    } else if (activeRole === 'admin' && (currentTab === 'home' || currentTab === 'bookings' || currentTab === 'dupr' || currentTab === 'coach_classes')) {
      setCurrentTab('admin_dashboard');
    } else if (activeRole === 'student' && (currentTab === 'coach_classes' || currentTab === 'admin_dashboard' || currentTab === 'coach_schedule')) {
      setCurrentTab('home');
    }
  }, [activeRole]);

  // Modals state
  const [selectedCoachForDetail, setSelectedCoachForDetail] = useState<CoachProfile | null>(null);
  const [videoModalData, setVideoModalData] = useState<{ url: string; name: string } | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSelfAssessmentOpen, setIsSelfAssessmentOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [assessmentData, setAssessmentData] = useState<{ studentId: string; studentName: string } | null>(null);

  // Global toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // IF NOT LOGGED IN -> RENDER AUTH LANDING PAGE (NO ACCESS TO INTERNAL APP)
  if (!isLoggedIn || !currentUser) {
    return <AuthLandingView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 pb-24 md:pb-8">
        
        {/* STUDENT VIEWS */}
        {activeRole === 'student' && (
          <>
            {currentTab === 'home' && (
              <CoachList
                onSelectCoach={(coach) => setSelectedCoachForDetail(coach)}
                onWatchVideo={(url, name) => setVideoModalData({ url, name })}
                onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
              />
            )}

            {currentTab === 'classes' && (
              <ClassManagementView 
                userRoleContext="student" 
                onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
                onSelectCoach={(coach) => setSelectedCoachForDetail(coach)}
              />
            )}

            {currentTab === 'bookings' && (
              <StudentBookings
                onOpenReviewModal={(booking) => setReviewBooking(booking)}
                onExploreCoaches={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'dupr' && (
              <StudentDUPRProfile
                onFindCoach={() => setCurrentTab('home')}
                onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
              />
            )}
          </>
        )}

        {/* COACH VIEWS */}
        {activeRole === 'coach' && (
          <>
            {currentTab === 'coach_classes' && (
              <ClassManagementView 
                userRoleContext="coach" 
                onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
              />
            )}

            {currentTab === 'coach_schedule' && (
              <CoachScheduleManager
                onOpenAssessmentModal={(studentId, studentName) => setAssessmentData({ studentId, studentName })}
              />
            )}

            {currentTab === 'coach_profile' && (
              <CoachProfileEditor />
            )}

            {currentTab === 'coach_stats' && (
              <CoachStats />
            )}
          </>
        )}

        {/* ADMIN VIEWS */}
        {activeRole === 'admin' && (
          <>
            {currentTab === 'admin_dashboard' && (
              <AdminDashboard initialTab="dashboard" />
            )}
            {currentTab === 'admin_classes' && (
              <ClassManagementView 
                userRoleContext="admin" 
                onOpenSelfAssessment={() => setIsSelfAssessmentOpen(true)}
              />
            )}
            {currentTab === 'admin_verify' && (
              <AdminDashboard initialTab="verify" />
            )}
            {currentTab === 'admin_users' && (
              <AdminDashboard initialTab="users" />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="font-bold text-gray-800">PickleConnect VN</span>
            <span>• Nền tảng kết nối Huấn luyện viên Pickleball chuẩn Quốc Tế & DUPR</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Xem Báo Cáo Đồ Án & Test Plan</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Chính sách Love Your Lesson Guarantee
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedCoachForDetail && (
        <CoachDetailModal
          coach={selectedCoachForDetail}
          onClose={() => setSelectedCoachForDetail(null)}
          onWatchVideo={(url, name) => setVideoModalData({ url, name })}
          onBookingSuccess={() => {
            showToast('Yêu cầu đặt lịch học đã được gửi thành công! HLV sẽ xác nhận sớm nhất.');
            setCurrentTab('bookings');
          }}
        />
      )}

      {videoModalData && (
        <VideoModal
          videoUrl={videoModalData.url}
          coachName={videoModalData.name}
          onClose={() => setVideoModalData(null)}
        />
      )}

      {isDocsOpen && (
        <ProjectDocsModal
          onClose={() => setIsDocsOpen(false)}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            showToast('Đánh giá của bạn đã được đăng thành công và cập nhật điểm trung bình của HLV!');
          }}
        />
      )}

      {assessmentData && (
        <CoachAssessmentModal
          studentId={assessmentData.studentId}
          studentName={assessmentData.studentName}
          onClose={() => setAssessmentData(null)}
          onSuccess={() => {
            showToast(`Đã gửi bảng thẩm định trình độ DUPR & bài tập cho học viên ${assessmentData.studentName}!`);
          }}
        />
      )}

      {/* DUPR SELF-ASSESSMENT MODAL */}
      <DUPRSelfAssessmentModal
        isOpen={isSelfAssessmentOpen}
        onClose={() => setIsSelfAssessmentOpen(false)}
        onViewClasses={() => {
          setIsSelfAssessmentOpen(false);
          setCurrentTab('classes');
        }}
        onViewCoaches={() => {
          setIsSelfAssessmentOpen(false);
          setCurrentTab('home');
        }}
      />

      {/* Standalone Login Modal when needed */}
      <AccountModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectRoleTab={(tab) => setCurrentTab(tab)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
