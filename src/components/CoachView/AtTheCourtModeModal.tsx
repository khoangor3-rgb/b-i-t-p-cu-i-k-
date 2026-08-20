import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, UserCheck, UserX, Clock, AlertTriangle, 
  MapPin, Play, Square, FileText, ChevronRight, Sparkles, Trophy
} from 'lucide-react';
import { Booking, User } from '../../types';

interface AtTheCourtModeModalProps {
  session: Booking;
  student?: User;
  onClose: () => void;
  onCheckIn: (bookingId: string) => void;
  onCompleteSession: (booking: Booking) => void;
  onReportNoShow: (bookingId: string) => void;
}

export const AtTheCourtModeModal: React.FC<AtTheCourtModeModalProps> = ({
  session,
  student,
  onClose,
  onCheckIn,
  onCompleteSession,
  onReportNoShow
}) => {
  // Session Attendance State
  const [attendance, setAttendance] = useState<'present' | 'absent' | 'late'>(
    session.check_in_time || session.coach_checked_in_at ? 'present' : 'present'
  );
  const [isCheckedIn, setIsCheckedIn] = useState(Boolean(session.check_in_time || session.coach_checked_in_at));
  
  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [courtNotes, setCourtNotes] = useState('');
  const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePerformCheckIn = () => {
    onCheckIn(session.id);
    setIsCheckedIn(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Bar: Court Mode Indicator & Close */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between py-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="text-white">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              CHẾ ĐỘ SÂN ĐẤU (AT THE COURT MODE)
            </span>
            <div className="text-[11px] text-slate-400 font-mono">Giao diện tối giản tác vụ nhanh cho HLV</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Thoát chế độ
        </button>
      </div>

      {/* Main Focus Screen */}
      <div className="max-w-3xl w-full mx-auto my-auto space-y-6 py-4">
        
        {/* Big Live Timer & Venue Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-3 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian buổi học: {session.start_time} – {session.end_time}</span>
          </div>

          <div className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">
            {formatTimer(elapsedSeconds)}
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{session.court_name}</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              {isTimerRunning ? <Square className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isTimerRunning ? 'Tạm dừng đếm' : 'Tiếp tục đếm'}</span>
            </button>
          </div>
        </div>

        {/* Student Attendance & Check-in Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Điểm Danh & Học Viên Có Mặt
            </h3>
            {isCheckedIn && (
              <span className="px-2.5 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-bold rounded-full">
                ✓ Đã Check-in
              </span>
            )}
          </div>

          {/* Student Item */}
          <div className="p-4 bg-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <img
                src={session.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500"
              />
              <div>
                <div className="font-bold text-white text-sm sm:text-base">{session.student_name}</div>
                <div className="text-xs text-slate-400">
                  {session.package_title} • SĐT: {session.student_phone || '0901234567'}
                </div>
              </div>
            </div>

            {/* Attendance Switcher */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setAttendance('present');
                  if (!isCheckedIn) handlePerformCheckIn();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  attendance === 'present' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Có mặt</span>
              </button>

              <button
                onClick={() => setAttendance('late')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  attendance === 'late' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Đi muộn
              </button>

              <button
                onClick={() => setShowNoShowConfirm(true)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-rose-400 hover:bg-rose-950/60`}
              >
                Vắng (No-show)
              </button>
            </div>
          </div>

          {/* Quick Note at the court */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Ghi chú nhanh khi đang hướng dẫn (Live Notes):</label>
            <input
              type="text"
              value={courtNotes}
              onChange={(e) => setCourtNotes(e.target.value)}
              placeholder="VD: Cần sửa lỗi mở vợt muộn khi phòng thủ dink, tiến bộ cú giao bóng xoáy..."
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Primary Operational Completion Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {!isCheckedIn && (
            <button
              onClick={handlePerformCheckIn}
              className="w-full sm:w-1/2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>Xác Nhận Check-in Sân</span>
            </button>
          )}

          <button
            onClick={() => {
              onCompleteSession(session);
              onClose();
            }}
            className={`w-full ${!isCheckedIn ? 'sm:w-1/2' : 'w-full'} py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2`}
          >
            <Trophy className="w-5 h-5 text-amber-300" />
            <span>Kết Thúc Buổi Học & Viết Recap</span>
          </button>
        </div>

      </div>

      {/* No-Show Confirmation Dialog */}
      {showNoShowConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-200">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-white text-base">Xác nhận báo học viên Vắng mặt (No-Show)?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn đang báo cáo học viên <strong>{session.student_name}</strong> không có mặt sau 15 phút bắt đầu buổi học. Hệ thống sẽ ghi nhận biên bản và đối soát theo chính sách hoàn/hủy bảo lưu.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNoShowConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onReportNoShow(session.id);
                  setShowNoShowConfirm(false);
                  onClose();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Xác nhận No-Show
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="max-w-3xl w-full mx-auto text-center text-[11px] text-slate-500 shrink-0">
        PickleConnect Coach OS • Học phí được giải ngân tự động sau khi kết thúc buổi học.
      </div>

    </div>
  );
};
