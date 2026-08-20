import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, QrCode, CreditCard, Wallet, 
  AlertCircle, Lock, ArrowRight, X, Clock, HelpCircle, Sparkles, Copy, Check
} from 'lucide-react';
import { CoachProfile, CoachPackage, AvailabilitySlot } from '../../types';

interface EscrowPaymentModalProps {
  coach: CoachProfile;
  selectedPackage: CoachPackage;
  selectedSlot: AvailabilitySlot;
  notes?: string;
  onClose: () => void;
  onConfirmPayment: (paymentMethod: 'qr_escrow' | 'pickle_wallet' | 'card_visa') => void;
  isProcessing?: boolean;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  coach,
  selectedPackage,
  selectedSlot,
  notes,
  onClose,
  onConfirmPayment,
  isProcessing = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'qr_escrow' | 'pickle_wallet' | 'card_visa'>('qr_escrow');
  const [isCopied, setIsCopied] = useState(false);
  const [showQRPreview, setShowQRPreview] = useState(true);

  // Price calculations
  const rawPrice = coach.price_per_session * selectedPackage.sessions;
  const discountAmount = Math.round(rawPrice * (selectedPackage.discount_percent / 100));
  const finalPrice = rawPrice - discountAmount;
  const escrowFee = 0; // 100% Free for students

  const transactionCode = `PC-ESCROW-${Date.now().toString().slice(-6)}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(transactionCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Thanh Toán Bảo Chứng Escrow An Toàn 100%</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Xác Nhận Đặt Lịch & Ký Quỹ Học Phí
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Học phí được tạm giữ trong quỹ tín thác PickleConnect và chỉ giải ngân cho HLV sau khi buổi học hoàn tất.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Booking Summary Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={coach.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={coach.user?.full_name || 'Coach'}
                  className="w-11 h-11 rounded-xl object-cover object-top ring-2 ring-emerald-500/20 shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{coach.user?.full_name || 'Huấn luyện viên'}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{selectedPackage.title} ({selectedPackage.sessions} buổi)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Tổng thanh toán</div>
                <div className="text-base font-extrabold text-slate-900">{finalPrice.toLocaleString('vi-VN')}đ</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Thời gian:</span> <strong className="text-slate-700">{selectedSlot.start_time} - {selectedSlot.end_time}</strong>
              </div>
              <div>
                <span className="text-slate-400">Ngày:</span> <strong className="text-slate-700">{selectedSlot.date}</strong>
              </div>
              <div className="col-span-2 truncate">
                <span className="text-slate-400">Sân tập:</span> <strong className="text-slate-700">{selectedSlot.court_name || 'Sân tiêu chuẩn'}</strong>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Chọn Phương Thức Ký Quỹ Escrow
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Method 1: VietQR Escrow */}
              <button
                type="button"
                onClick={() => setPaymentMethod('qr_escrow')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'qr_escrow'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  {paymentMethod === 'qr_escrow' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">VietQR Tự Động</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Quét QR chuyển khoản 24/7</div>
                </div>
              </button>

              {/* Method 2: PickleWallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('pickle_wallet')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'pickle_wallet'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  {paymentMethod === 'pickle_wallet' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Ví PicklePay</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Số dư: 5.000.000đ</div>
                </div>
              </button>

              {/* Method 3: Card Visa/Mastercard */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card_visa')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'card_visa'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  {paymentMethod === 'card_visa' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Thẻ Quốc Tế</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Visa / Mastercard / JCB</div>
                </div>
              </button>

            </div>
          </div>

          {/* Dynamic Payment Detail View */}
          {paymentMethod === 'qr_escrow' && (
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
              {/* Simulated VietQR */}
              <div className="bg-white p-2.5 rounded-2xl shrink-0 shadow-lg text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=PICKLECONNECT_ESCROW_${transactionCode}_${finalPrice}`}
                  alt="VietQR Escrow"
                  className="w-28 h-28 mx-auto"
                />
                <div className="text-[9px] font-bold text-slate-800 mt-1 uppercase tracking-tight">VietQR Pro • Escrow</div>
              </div>

              <div className="space-y-1.5 text-xs flex-1 w-full">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                  <span className="text-slate-400">Tài khoản thụ hưởng:</span>
                  <span className="font-bold text-emerald-400">PickleConnect Escrow VN</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-semibold text-slate-200">MB Bank (Hội Sở)</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                  <span className="text-slate-400">Số tài khoản Escrow:</span>
                  <span className="font-mono font-bold text-amber-300">999888666888</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {transactionCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-slate-400 hover:text-emerald-300 p-1 cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'pickle_wallet' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                  <span>Ví Tín Thác PicklePay Của Bạn</span>
                </div>
                <div className="text-xs text-indigo-700">
                  Số dư ví hiện tại: <strong className="text-indigo-950">5.000.000đ</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Học phí <strong className="text-slate-800">{finalPrice.toLocaleString('vi-VN')}đ</strong> sẽ được tự động đóng băng chuyển vào Quỹ Escrow.
                </div>
              </div>
              <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg shrink-0">
                Đủ số dư
              </span>
            </div>
          )}

          {paymentMethod === 'card_visa' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Cổng thanh toán thẻ Quốc Tế (3D-Secure 2.0)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Hệ thống hỗ trợ thẻ Visa/Mastercard nội địa và quốc tế. Giao dịch được bảo chứng bằng mã hóa SSL 256-bit chuẩn PCI-DSS Level 1.
              </p>
            </div>
          )}

          {/* Pricing Breakdown Breakdown Table */}
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Học phí tiêu chuẩn ({selectedPackage.sessions} buổi):</span>
              <span>{rawPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Ưu đãi gói ({selectedPackage.discount_percent}%):</span>
                <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Phí dịch vụ bảo chứng Escrow:</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Miễn phí 100%</span>
              </span>
              <span className="text-emerald-700 font-bold">0đ</span>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Tổng số tiền Ký Quỹ Escrow:</span>
              <span className="text-lg font-black text-emerald-700">{finalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Love your lesson & Escrow Guarantee Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-900">Cam Kết Bảo Vệ Học Viên "Love Your Lesson Guarantee"</div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                HLV chỉ nhận học phí sau khi bạn xác nhận hoàn thành buổi học. Nếu bạn hủy lịch trước 24h hoặc không hài lòng với chất lượng buổi học đầu tiên, tiền ký quỹ sẽ được <strong>hoàn trả 100%</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Mã hóa bảo mật 256-bit SSL</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Quay lại
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onConfirmPayment(paymentMethod)}
              className="w-2/3 sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý Ký Quỹ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ký Quỹ & Hoàn Tất Đặt Lịch ({finalPrice.toLocaleString('vi-VN')}đ)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
