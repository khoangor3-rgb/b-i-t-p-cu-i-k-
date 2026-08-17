import React, { useState } from 'react';
import { X, Star, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  const { submitReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Nhiệt tình 10/10', 'Chỉnh dáng chuẩn']);

  const availableTags = [
    'Nhiệt tình 10/10', 'Chỉnh dáng chuẩn', 'Phân tích video slow-mo', 
    'Third Shot Drop dễ hiểu', 'Dink Kitchen đỉnh', 'Thân thiện, vui tính', 'Đúng giờ'
  ];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview(booking.id, rating, comment.trim(), selectedTags);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Đánh Giá Buổi Học</h2>
              <p className="text-xs text-emerald-200">HLV: <strong>{booking.coach_name}</strong> • {booking.date}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Star rating selector */}
          <div className="text-center py-2 space-y-2">
            <div className="text-xs font-bold text-gray-700 uppercase">
              Mức độ hài lòng của bạn
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-125 cursor-pointer"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-600">
              {rating === 5 && '⭐ Rất xuất sắc (5/5) - Rất khuyến khích!'}
              {rating === 4 && '⭐ Tốt & Nhiệt tình (4/5)'}
              {rating === 3 && '⭐ Bình thường (3/5)'}
              {rating === 2 && '⭐ Cần cải thiện (2/5)'}
              {rating === 1 && '⭐ Không hài lòng (1/5)'}
            </div>
          </div>

          {/* Quick tags */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-700">Điểm nổi bật của HLV trong buổi tập:</label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment text */}
          <div className="space-y-1">
            <label className="block font-bold text-gray-700">Nhận xét chi tiết của bạn</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận về kỹ năng, thái độ giảng dạy, sự tiến bộ của bạn sau buổi học này..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs outline-none leading-relaxed focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
            🔒 Đánh giá của bạn sẽ được hiển thị công khai trên hồ sơ HLV nhằm đảm bảo tính minh bạch 100% theo quy chuẩn PickleConnect.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Đánh Giá</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
