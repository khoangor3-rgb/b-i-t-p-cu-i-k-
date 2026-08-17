import React from 'react';
import { X, Play, Award, ShieldCheck } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  coachName: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  videoUrl,
  coachName,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Play className="w-4 h-4 fill-emerald-400" />
            </span>
            <div>
              <h3 className="text-sm font-bold">Vet 'Em Video: {coachName}</h3>
              <p className="text-[11px] text-emerald-400">Giới thiệu kinh nghiệm & phong cách giảng dạy trực quan</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <iframe
            src={videoUrl}
            title={`Video ${coachName}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Description */}
        <div className="p-4 bg-slate-900/90 text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Video được kiểm duyệt trực tiếp bởi đội ngũ chuyên gia PickleConnect</span>
          </div>
          <span className="text-slate-400 text-[11px]">Định Dạng Video Chuẩn Quốc Tế</span>
        </div>

      </div>
    </div>
  );
};
