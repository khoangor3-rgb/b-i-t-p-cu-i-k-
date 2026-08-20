import React, { useState } from 'react';
import { 
  DollarSign, ShieldCheck, ArrowUpRight, TrendingUp, Clock, 
  Calendar, CheckCircle2, AlertCircle, Search, Filter, 
  CreditCard, ChevronRight, X, Info, Download, ArrowDownRight,
  Sparkles, Lock, Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment, PayoutHistory } from '../../types';

export const CoachEarningsView: React.FC = () => {
  const { 
    currentUser, coaches, payments, bookings, getCoachEarnings 
  } = useApp();

  const coach = (currentUser && coaches.find(c => c.user_id === currentUser.id)) || coaches[0];
  const earningsData = getCoachEarnings(coach.id);
  const coachPayments = payments.filter(p => p.coach_id === coach.id);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Withdrawal Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(earningsData.totalEarnings);
  const [selectedBank, setSelectedBank] = useState('Vietcombank - •••• 5678 (NGUYEN DANG KHOA)');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredPayments = coachPayments.filter(p => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q || 
      (p.student_name || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate upcoming payouts (held escrow for upcoming sessions)
  const upcomingPayouts = coachPayments
    .filter(p => p.status === 'held')
    .reduce((sum, p) => sum + p.payout_amount, 0);

  // Calculate lifetime earnings (all released)
  const lifetimeEarnings = coachPayments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + p.payout_amount, 0);

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > earningsData.totalEarnings) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setIsWithdrawOpen(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & WITHDRAW CTA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Escrow & Payout Center
            </span>
            <span className="text-xs text-slate-400 font-medium">Đối Soát Tài Chính & Ví HLV</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Thu Nhập & Quỹ Bảo Chứng Escrow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Toàn bộ học phí được giữ an toàn trong Escrow và tự động chuyển về Số Dư Khả Dụng (90%) khi buổi học hoàn tất.
          </p>
        </div>

        <button
          onClick={() => {
            setWithdrawAmount(earningsData.totalEarnings);
            setIsWithdrawOpen(true);
          }}
          disabled={earningsData.totalEarnings <= 0}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer ${
            earningsData.totalEarnings > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Rút Tiền Về Ngân Hàng</span>
        </button>
      </div>

      {/* 4 CORE FINANCIAL NUMBERS (Section 38 & 82) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. AVAILABLE TO WITHDRAW (Hero Emerald) */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-3xl border border-emerald-700 shadow-md space-y-2">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>Khả Dụng (Available)</span>
            <Building2 className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {earningsData.totalEarnings.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-emerald-200 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Có thể rút về tài khoản ngay lập tức</span>
          </div>
        </div>

        {/* 2. PENDING IN ESCROW */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Đang giữ trong Escrow</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {earningsData.pendingEscrow.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ học viên hoàn tất buổi học</span>
          </div>
        </div>

        {/* 3. UPCOMING PAYOUTS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Sắp giải ngân (24h)</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {upcomingPayouts.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tự động giải ngân sau bảo hành
          </div>
        </div>

        {/* 4. LIFETIME EARNINGS */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Tổng tích lũy (Lifetime)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {lifetimeEarnings.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-purple-700 font-semibold">
            {coachPayments.filter(p => p.status === 'released').length} giao dịch thành công
          </div>
        </div>

      </div>

      {/* ESCROW EXPLANATION & PAYOUT BREAKDOWN (Section 42-44) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Cơ Chế Bảo Chứng Tài Chính PickleConnect Escrow
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>1. Học viên thanh toán (100%)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Tiền được khóa tạm thời trong Quỹ Tín Thác Escrow của sàn khi học viên xác nhận đặt slot.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>2. Hoàn tất buổi học & SLA</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              HLV check-in trên sân và hoàn tất buổi học. Thời gian bảo hành chất lượng 24h kích hoạt.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <span>3. Giải ngân 90% Net cho HLV</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Sàn thu 10% phí vận hành & bảo chứng. 90% học phí được cộng thẳng vào Số Dư Khả Dụng để rút 24/7.
            </p>
          </div>

        </div>
      </div>

      {/* TRANSACTION LEDGER TABLE (Section 44) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        
        {/* Table Title & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Sổ Cái Giao Dịch & Lịch Sử Escrow</h3>
            <p className="text-xs text-slate-500">Đối soát chi tiết từng buổi học và dòng tiền thực nhận</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã hoặc tên học viên..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="released">Đã giải ngân (90%)</option>
              <option value="held">Đang giữ Escrow</option>
              <option value="refunded">Đã hoàn tiền</option>
              <option value="disputed">Khiếu nại</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã GD / Ngày</th>
                <th className="py-3 px-4">Học Viên</th>
                <th className="py-3 px-4">Tổng Thu (Gross)</th>
                <th className="py-3 px-4">Phí Sàn (10%)</th>
                <th className="py-3 px-4">HLV Thực Nhận (90%)</th>
                <th className="py-3 px-4">Trạng Thái Escrow</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Chưa có dữ liệu giao dịch nào khớp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="font-bold text-slate-900">{p.id}</div>
                      <div className="text-slate-400 text-[10px]">{p.paid_at}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.student_name}</div>
                      <div className="text-[10px] text-slate-400">Booking: {p.booking_id}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {p.amount.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      -{p.commission_amount.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      +{p.payout_amount.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                        p.status === 'released'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : p.status === 'held'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : p.status === 'refunded'
                          ? 'bg-rose-50 text-rose-900 border-rose-200'
                          : 'bg-purple-50 text-purple-900 border-purple-200'
                      }`}>
                        {p.status === 'released' && '✓ Đã giải ngân'}
                        {p.status === 'held' && '⏳ Đang giữ Escrow'}
                        {p.status === 'refunded' && '✕ Đã hoàn tiền'}
                        {p.status === 'disputed' && '⚠ Đang tranh chấp'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold text-xs cursor-pointer"
                      >
                        Xem →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* WITHDRAWAL MODAL FLOW (Section 40) */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Rút Tiền Về Tài Khoản</h3>
              </div>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black">Lệnh rút tiền đã tiếp nhận!</h4>
                <p className="text-xs text-emerald-700">
                  Hệ thống tự động chuyển {withdrawAmount.toLocaleString('vi-VN')} đ qua Napas 24/7. Tiền sẽ vào tài khoản sau 1-3 phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
                
                {/* Available Balance Reminder */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Số dư khả dụng:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {earningsData.totalEarnings.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Bank Account Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Tài khoản nhận tiền đã xác minh:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="Vietcombank - •••• 5678 (NGUYEN DANG KHOA)">Vietcombank - •••• 5678 (NGUYEN DANG KHOA)</option>
                    <option value="Techcombank - •••• 9921 (NGUYEN DANG KHOA)">Techcombank - •••• 9921 (NGUYEN DANG KHOA)</option>
                  </select>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Số tiền muốn rút (VNĐ):</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(earningsData.totalEarnings)}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      Rút tối đa
                    </button>
                  </div>
                  <input
                    type="number"
                    min="50000"
                    max={earningsData.totalEarnings}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                  <div className="text-[11px] text-slate-400">Phí giao dịch: <strong>0đ (Miễn phí qua Napas 24/7)</strong></div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > earningsData.totalEarnings}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Xác Nhận Rút Tiền'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* TRANSACTION DETAIL DRAWER */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-4">
          <div className="bg-white h-full max-h-[90vh] max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Chi Tiết Giao Dịch</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã Giao Dịch:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Học Viên:</span>
                  <span className="font-bold text-slate-900">{selectedPayment.student_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời Điểm Thanh Toán:</span>
                  <span className="text-slate-700">{selectedPayment.paid_at}</span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Học phí gốc (100%):</span>
                  <span className="font-bold">{selectedPayment.amount.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Phí nền tảng sàn (10%):</span>
                  <span className="font-bold">-{selectedPayment.commission_amount.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-emerald-900 text-sm">
                  <span>HLV Thực Nhận (90%):</span>
                  <span>+{selectedPayment.payout_amount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Escrow Status Explanation */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-emerald-900 text-[11px]">
                <div className="font-bold">Trạng thái: {selectedPayment.status === 'released' ? 'Đã giải ngân an toàn' : 'Đang ký quỹ Escrow'}</div>
                <p className="text-emerald-700 leading-relaxed">
                  {selectedPayment.status === 'released'
                    ? 'Khoản tiền đã được giải ngân vào số dư khả dụng sau khi hoàn thành buổi học và hết thời hạn khiếu nại.'
                    : 'Khoản tiền đang được giữ trong quỹ bảo chứng và sẽ giải ngân ngay khi HLV hoàn tất buổi học.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
