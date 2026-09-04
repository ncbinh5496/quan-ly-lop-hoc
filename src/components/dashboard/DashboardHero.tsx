import React, { useMemo, memo } from 'react';
import { Sparkles, UserCheck, Star } from 'lucide-react';
import { Teacher, ClassData } from '../../types';

interface DashboardHeroProps {
  teacher: Teacher | null;
  activeClass: ClassData;
  weeklyPoints: number;
  totalBadgesAwarded: number;
  onOpenAttendance: () => void;
  onQuickAddPoint: () => void;
}

export const DashboardHero = memo(function DashboardHero({
  teacher,
  activeClass,
  weeklyPoints,
  totalBadgesAwarded,
  onOpenAttendance,
  onQuickAddPoint,
}: DashboardHeroProps) {
  // Dynamic greeting based on current hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Chào buổi sáng';
    if (hour >= 11 && hour < 14) return 'Chào buổi trưa';
    if (hour >= 14 && hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  const currentDayFormatted = useMemo(() => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${dayName} thật hứng khởi · ${timeStr}`;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 p-6 sm:p-8 lg:p-10 text-white select-none transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.38),0_10px_20px_-6px_rgba(236,72,153,0.28),inset_0_1px_1px_rgba(255,255,255,0.6)] border-t border-l border-white/50 border-b-2 border-r-2 border-purple-900/40 ring-1 ring-purple-300/30">
      {/* 3D Top Light Bevel Sheen */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-t-[32px]" />
      
      {/* Subtle Background 3D Depth Spheres */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-pink-400/40 via-amber-300/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-indigo-950/60 blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-1/4 w-48 h-48 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column: Greeting, Badge, Subtitle & Action Buttons */}
        <div className="space-y-4 max-w-2xl">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/30 text-xs font-black text-amber-200 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>{currentDayFormatted}</span>
          </div>

          {/* Main Greeting Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
            {greeting}, {teacher?.name || 'Cô Phương Anh'}!
          </h1>

          {/* Subtitle */}
          <p className="text-purple-100 text-sm sm:text-base font-medium leading-relaxed max-w-xl drop-shadow-xs">
            Tuần 1 · 17/08–21/08 · Lớp {activeClass.name}. Hãy cùng tạo thêm những khoảnh khắc học tập đáng nhớ và tràn ngập niềm vui hôm nay nhé!
          </p>

          {/* Action Buttons: Yellow (Attendance) & Pink (Add Points) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onOpenAttendance}
              className="px-5 py-3 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-[0_6px_16px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] border-t border-white/60 border-b-2 border-amber-600 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <UserCheck size={18} className="text-amber-950" />
              <span>Điểm danh ngay</span>
            </button>

            <button
              onClick={onQuickAddPoint}
              className="px-5 py-3 rounded-2xl bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 text-white font-black text-xs sm:text-sm shadow-[0_6px_16px_rgba(236,72,153,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] border-t border-white/50 border-b-2 border-pink-700 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Star size={18} className="text-yellow-200 fill-yellow-200" />
              <span>Ghi nhận điểm tốt</span>
            </button>
          </div>
        </div>

        {/* Right Column: Gamified Badges & Visual Graphic */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-stretch gap-3.5 shrink-0">
          {/* Gamified Stat Capsule 1: Points this week */}
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border-t border-l border-white/40 border-b border-r border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 flex items-center justify-center text-2xl font-black shadow-md border border-white/60 shrink-0">
              ⭐
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200 drop-shadow-2xs">
                Tích lũy tuần này
              </p>
              <p className="text-xl font-black text-white drop-shadow-xs">
                +{weeklyPoints > 0 ? weeklyPoints : 600} điểm
              </p>
            </div>
          </div>

          {/* Gamified Stat Capsule 2: Badges Awarded */}
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border-t border-l border-white/40 border-b border-r border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-2xl font-black shadow-md border border-white/60 shrink-0">
              🎉
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200 drop-shadow-2xs">
                Huy hiệu vinh danh
              </p>
              <p className="text-xl font-black text-white drop-shadow-xs">
                {totalBadgesAwarded > 0 ? totalBadgesAwarded : 12} huy hiệu mới
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
