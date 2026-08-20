import React from 'react';
import { 
  X, CheckCircle2, Clock, ShieldAlert, Award, 
  ExternalLink, User, DollarSign, Calendar, MapPin, 
  RotateCcw, AlertTriangle, ArrowRight, ShieldCheck, History
} from 'lucide-react';
import { Payment, CoachProfile, User as UserType } from '../../types';
import { AdminStatusBadge } from './AdminSharedComponents';

interface AdminDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type: 'payment' | 'coach' | 'dispute' | 'general';
  data?: any;
  users?: UserType[];
  onApproveCoach?: (coachId: string) => void;
  onRejectCoach?: (coachId: string) => void;
  onResolveDispute?: (paymentId: string, action: 'refund_student' | 'release_coach') => void;
}

export const AdminDetailDrawer: React.FC<AdminDetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  type,
  data,
  users = [],
  onApproveCoach,
  onRejectCoach,
  onResolveDispute
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-0.5">
              Chi tiết thực thể
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body based on Type */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          
          {/* PAYMENT & ESCROW DETAIL DRAWER */}
          {type === 'payment' && (
            <div className="space-y-6">
              {/* Top Amount & Escrow Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Số tiền giao dịch</span>
                  <span className="text-2xl font-black text-slate-900">
                    {(data as Payment).amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <AdminStatusBadge status={(data as Payment).status} />
              </div>

              {/* Lifecycle State Machine Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
                  Vòng đời thanh toán (Escrow State Machine)
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">1. Học viên thanh toán ký quỹ</div>
                      <div className="text-[10px] text-slate-400">Tiền được tạm giữ an toàn bởi PickleConnect</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">2. Huấn luyện viên xác nhận lịch</div>
                      <div className="text-[10px] text-slate-400">Khóa ca học vào lịch đào tạo chính thức</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      (data as Payment).status === 'held' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {(data as Payment).status === 'held' ? '⏳' : '✓'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">3. Diễn ra buổi học & Kiểm tra</div>
                      <div className="text-[10px] text-slate-400">Bảo hành 24h theo chính sách Love Your Lesson</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      (data as Payment).status === 'released' ? 'bg-emerald-600 text-white' : 
                      (data as Payment).status === 'refunded' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {(data as Payment).status === 'released' ? '✓' : (data as Payment).status === 'refunded' ? '↺' : '4'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        {(data as Payment).status === 'released' ? '4. Đã giải ngân cho HLV' :
                         (data as Payment).status === 'refunded' ? '4. Đã hoàn tiền cho học viên' : '4. Giải ngân học phí (90%)'}
                      </div>
                      <div className="text-[10px] text-slate-400">Tự động đối soát và chuyển vào ví HLV</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Allocation Split */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
                  Phân bổ dòng tiền chi tiết
                </h4>
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Học viên thanh toán:</span>
                    <span className="font-bold text-slate-900">{(data as Payment).student_name}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Huấn luyện viên phụ trách:</span>
                    <span className="font-bold text-slate-900">{(data as Payment).coach_name}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Phí hoa hồng nền tảng (10%):</span>
                    <span className="font-bold text-emerald-700">+{(data as Payment).commission_amount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Thực nhận HLV (90%):</span>
                    <span className="font-bold text-slate-900">{(data as Payment).payout_amount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Thời gian tạo giao dịch:</span>
                    <span className="text-slate-600 font-mono">{(data as Payment).paid_at}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COACH VERIFICATION DETAIL DRAWER */}
          {type === 'coach' && (
            <div className="space-y-6">
              {/* Profile Overview */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img 
                  src={users.find(u => u.id === (data as CoachProfile).user_id)?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} 
                  alt="" 
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200"
                />
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    {users.find(u => u.id === (data as CoachProfile).user_id)?.full_name}
                  </h4>
                  <div className="text-slate-500 text-xs">
                    {(data as CoachProfile).area} • {(data as CoachProfile).experience_years} năm kinh nghiệm
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      DUPR {(data as CoachProfile).dupr_level.toFixed(1)}
                    </span>
                    <AdminStatusBadge status={(data as CoachProfile).approval_status || 'pending'} />
                  </div>
                </div>
              </div>

              {/* Bio & Specialties */}
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">Giới thiệu & Kỹ năng</h5>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {(data as CoachProfile).bio}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(data as CoachProfile).specialties.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications Verification */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  Chứng chỉ & Hồ sơ pháp lý đã nộp
                </h5>
                <div className="space-y-2">
                  {(data as CoachProfile).certifications?.map((c) => (
                    <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{c.title}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Năm {c.year}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                      {c.proof_url && (
                        <a
                          href={c.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-semibold text-[11px] hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          <span>Xem văn bằng thẩm định</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISPUTE DETAIL DRAWER */}
          {type === 'dispute' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vấn đề khiếu nại của học viên:</span>
                </div>
                <p className="text-rose-950 italic leading-relaxed">
                  "{(data as Payment).dispute_reason || 'Học viên khiếu nại buổi học không đảm bảo chất lượng theo cam kết.'}"
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Thông tin đối soát</h5>
                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Học viên:</span>
                    <span className="font-bold text-slate-900">{(data as Payment).student_name}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Huấn luyện viên:</span>
                    <span className="font-bold text-slate-900">{(data as Payment).coach_name}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Khoản tiền ký quỹ:</span>
                    <span className="font-bold text-slate-900">{(data as Payment).amount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          {type === 'coach' && (data as CoachProfile).approval_status === 'pending' && onApproveCoach && onRejectCoach && (
            <>
              <button
                onClick={() => onRejectCoach((data as CoachProfile).id)}
                className="px-4 py-2 bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 rounded-xl font-bold transition cursor-pointer"
              >
                Từ chối hồ sơ
              </button>
              <button
                onClick={() => onApproveCoach((data as CoachProfile).id)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
              >
                Phê duyệt & Cấp Tick Xanh
              </button>
            </>
          )}

          {type === 'dispute' && onResolveDispute && (
            <>
              <button
                onClick={() => onResolveDispute((data as Payment).id, 'refund_student')}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Hoàn 100% cho Học viên
              </button>
              <button
                onClick={() => onResolveDispute((data as Payment).id, 'release_coach')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Giải ngân cho HLV
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-xl font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
