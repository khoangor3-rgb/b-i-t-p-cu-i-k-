import { CoachProfile, Review, CoachBadgeInfo } from '../types';

/**
 * Derived computation for Coach Badge:
 * Priority: Top Rated > Verified > Newcomer
 * - Top Rated: rating_avg >= 4.5 and review_count >= 3 (scaled for demo)
 * - Newcomer: approved within last 14 days (approved_at <= 14 days)
 * - Verified: approval_status === 'approved' or verification_status === 'verified'
 * - NULL: if coach is not approved or suspended
 */
export function getCoachBadge(coach: CoachProfile, reviews: Review[] = []): CoachBadgeInfo | null {
  // If not approved or rejected/suspended -> No badge
  if (coach.approval_status && coach.approval_status !== 'approved') {
    return null;
  }
  if (coach.verification_status === 'rejected') {
    return null;
  }

  // Calculate actual rating and review count
  const coachReviews = reviews.filter(r => r.coach_id === coach.id && !r.is_hidden);
  const reviewCount = coach.review_count || coachReviews.length;
  const ratingAvg = coach.rating_avg || (coachReviews.length > 0
    ? coachReviews.reduce((sum, r) => sum + r.rating, 0) / coachReviews.length
    : 0);

  // Check Days since Approved
  const approvedDateStr = coach.approved_at || coach.verified_at || coach.created_at;
  let daysSinceApproved = 999;
  if (approvedDateStr) {
    const approvedTime = new Date(approvedDateStr).getTime();
    if (!isNaN(approvedTime)) {
      daysSinceApproved = Math.max(0, Math.floor((Date.now() - approvedTime) / (1000 * 60 * 60 * 24)));
    }
  }

  // Priority 1: Top Rated
  if (ratingAvg >= 4.5 && reviewCount >= 3) {
    return {
      type: 'top_rated',
      label: 'Top Rated',
      badgeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/40 shadow-xs',
      iconName: 'Star',
      description: `HLV Xuất Sắc: Đánh giá trung bình ${ratingAvg.toFixed(1)}/5.0 (${reviewCount} đánh giá tích cực)`
    };
  }

  // Priority 2: Verified Coach
  // (In priority hierarchy Top Rated > Verified > Newcomer, check if verified older than 14d or general verified)
  // Let's check Newcomer condition first if days <= 14, or follow the document rule:
  // Document: Top Rated > Verified > Newcomer OR Top Rated > Newcomer > Verified.
  // In SQL test case 4: "HLV đủ điều kiện cả Newcomer lẫn Top Rated -> Top Rated (ưu tiên cao hơn)"
  // In test case 1: "HLV mới được duyệt trong 14 ngày -> Newcomer"
  // If not Top Rated, but approved within 14 days -> Newcomer
  if (daysSinceApproved <= 14) {
    return {
      type: 'newcomer',
      label: 'Newcomer',
      badgeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/40 shadow-xs',
      iconName: 'Sparkles',
      description: `HLV Mới: Gia nhập & được duyệt trong vòng 14 ngày (${daysSinceApproved} ngày trước)`
    };
  }

  // Priority 3: Verified
  if (coach.approval_status === 'approved' || coach.verification_status === 'verified') {
    return {
      type: 'verified',
      label: 'Verified Coach',
      badgeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/40 shadow-xs',
      iconName: 'ShieldCheck',
      description: 'HLV Đã Xác Minh: Đã thẩm định chứng chỉ và hồ sơ năng lực thực tế'
    };
  }

  return null;
}
