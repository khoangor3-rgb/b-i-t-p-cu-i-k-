import React from 'react';
import { CoachProfile } from '../../types';
import { getCoachBadge } from '../../utils/coachBadge';
import { Trophy, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CoachBadgeProps {
  coach: CoachProfile;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CoachBadge: React.FC<CoachBadgeProps> = ({
  coach,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const badgeInfo = getCoachBadge(coach);
  if (!badgeInfo) return null;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const getIcon = () => {
    switch (badgeInfo.type) {
      case 'top_rated':
        return <Trophy size={iconSizes[size]} className="shrink-0" />;
      case 'newcomer':
        return <Sparkles size={iconSizes[size]} className="shrink-0 animate-pulse" />;
      case 'verified':
        return <CheckCircle2 size={iconSizes[size]} className="shrink-0" />;
      default:
        return <ShieldCheck size={iconSizes[size]} className="shrink-0" />;
    }
  };

  return (
    <span
      id={`coach-badge-${coach.id}`}
      title={badgeInfo.description}
      className={`inline-flex items-center rounded-full font-medium shadow-xs transition-all duration-200 ${badgeInfo.badgeClass || ''} ${sizeClasses[size]} ${className}`}
    >
      {getIcon()}
      {showLabel && <span>{badgeInfo.label}</span>}
    </span>
  );
};
