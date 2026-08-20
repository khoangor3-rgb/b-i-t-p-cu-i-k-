import React from 'react';
import { 
  CheckCircle2, Clock, ShieldAlert, AlertTriangle, 
  RotateCcw, Lock, UserX, UserCheck, XCircle, ShieldCheck
} from 'lucide-react';

export type StatusType = 
  | 'verified' | 'approved' | 'active' | 'completed' | 'released' | 'sent'
  | 'pending' | 'held' | 'waiting' | 'offered' | 'scheduled' | 'investigating'
  | 'rejected' | 'suspended' | 'disputed' | 'cancelled' | 'failed' | 'open' | 'resolved' | 'dismissed';

interface AdminStatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const norm = (status || '').toLowerCase();

  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let IconComponent: any = Clock;
  let displayLabel = label;

  // Semantic mappings
  if (['approved', 'verified', 'active', 'completed', 'released', 'sent', 'resolved'].includes(norm)) {
    colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    IconComponent = CheckCircle2;
    if (!displayLabel) {
      if (norm === 'approved') displayLabel = 'Đã phê duyệt';
      else if (norm === 'verified') displayLabel = 'Đã xác thực';
      else if (norm === 'active') displayLabel = 'Đang hoạt động';
      else if (norm === 'completed') displayLabel = 'Đã hoàn thành';
      else if (norm === 'released') displayLabel = 'Đã giải ngân';
      else if (norm === 'sent') displayLabel = 'Đã gửi';
      else if (norm === 'resolved') displayLabel = 'Đã xử lý';
    }
  } else if (['pending', 'held', 'waiting', 'offered', 'scheduled', 'investigating'].includes(norm)) {
    colorClass = 'bg-amber-50 text-amber-900 border-amber-300/70';
    IconComponent = Clock;
    if (!displayLabel) {
      if (norm === 'pending') displayLabel = 'Chờ thẩm định';
      else if (norm === 'held') displayLabel = 'Đang giữ Escrow';
      else if (norm === 'waiting') displayLabel = 'Đang chờ';
      else if (norm === 'offered') displayLabel = 'Đang giữ chỗ 2h';
      else if (norm === 'scheduled') displayLabel = 'Đã lên lịch';
      else if (norm === 'investigating') displayLabel = 'Đang điều tra';
    }
  } else if (['disputed', 'rejected', 'suspended', 'cancelled', 'failed', 'open'].includes(norm)) {
    colorClass = 'bg-rose-50 text-rose-800 border-rose-200/80';
    IconComponent = norm === 'disputed' ? ShieldAlert : norm === 'suspended' ? UserX : XCircle;
    if (!displayLabel) {
      if (norm === 'disputed') displayLabel = 'Đang khiếu nại';
      else if (norm === 'rejected') displayLabel = 'Đã từ chối';
      else if (norm === 'suspended') displayLabel = 'Tạm đình chỉ';
      else if (norm === 'cancelled') displayLabel = 'Đã hủy';
      else if (norm === 'failed') displayLabel = 'Thất bại';
      else if (norm === 'open') displayLabel = 'Mới tiếp nhận';
    }
  } else if (norm === 'refunded') {
    colorClass = 'bg-purple-50 text-purple-900 border-purple-200/80';
    IconComponent = RotateCcw;
    if (!displayLabel) displayLabel = 'Đã hoàn 100%';
  }

  const sizeClass = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-0.5 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${sizeClass} ${colorClass} font-semibold shrink-0`}>
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{displayLabel || status}</span>
    </span>
  );
};

// Reusable Filter Bar with explicit Search, status select, active counter & Clear all
interface AdminFilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder: string;
  statusFilter?: string;
  onStatusChange?: (val: string) => void;
  statusOptions?: { id: string; label: string; count?: number }[];
  secondaryFilter?: string;
  onSecondaryChange?: (val: string) => void;
  secondaryPlaceholder?: string;
  secondaryOptions?: { id: string; label: string }[];
  activeFilterCount: number;
  onClearFilters: () => void;
  totalResultsText?: string;
  rightAction?: React.ReactNode;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  statusFilter,
  onStatusChange,
  statusOptions,
  secondaryFilter,
  onSecondaryChange,
  secondaryPlaceholder = 'Tất cả phân loại',
  secondaryOptions,
  activeFilterCount,
  onClearFilters,
  totalResultsText,
  rightAction
}) => {
  return (
    <div className="bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200/90 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none text-slate-800 placeholder-slate-400"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions && onStatusChange && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium outline-none cursor-pointer hover:border-slate-300"
            >
              {statusOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} {opt.count !== undefined ? `(${opt.count})` : ''}
                </option>
              ))}
            </select>
          )}

          {secondaryOptions && onSecondaryChange && (
            <select
              value={secondaryFilter}
              onChange={(e) => onSecondaryChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium outline-none cursor-pointer hover:border-slate-300"
            >
              <option value="all">{secondaryPlaceholder}</option>
              {secondaryOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-rose-600 font-semibold bg-white border border-slate-200 hover:border-rose-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
              <span>Xóa bộ lọc</span>
            </button>
          )}

          {rightAction}
        </div>
      </div>

      {totalResultsText && (
        <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/50">
          {totalResultsText}
        </div>
      )}
    </div>
  );
};

// Reusable Empty State
export const AdminEmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
        {icon || <CheckCircle2 className="w-5 h-5 text-slate-400" />}
      </div>
      <h4 className="text-xs font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-xs font-bold text-slate-900 underline hover:text-emerald-700 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
