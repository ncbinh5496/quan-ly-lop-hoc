import React, { useState, memo, useMemo } from 'react';
import { Plus, Minus, Pencil, Camera, Award, Star, Users, FileText, Eye } from 'lucide-react';
import { cn, getAvatarUrl, getLevelForPoints } from '../../utils/helpers';
import { Student, Badge, CustomAvatar } from '../../types';
import { useStore } from '../../store';
import { AvatarModal } from '../modals/AvatarModal';
import { BadgeCelebrationModal } from '../modals/BadgeCelebrationModal';
import { AwardBadgeModal } from '../modals/AwardBadgeModal';

interface StudentCardProps {
  student: Student;
  groupName?: string;
  customAvatars?: CustomAvatar[];
  onAddPoint: () => void;
  onMinusPoint: () => void;
  onEdit?: () => void;
  showRank?: number;
}

export const StudentCard = memo(function StudentCard({ 
  student, 
  groupName, 
  customAvatars, 
  onAddPoint, 
  onMinusPoint, 
  onEdit, 
  showRank 
}: StudentCardProps) {
  const levels = useStore(state => state.levels);
  const allBadges = useStore(state => state.badges);
  const activeClassId = useStore(state => state.activeClassId);
  const userRole = useStore(state => state.userRole);
  const setStudentReportModal = useStore(state => state.setStudentReportModal);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [previewBadge, setPreviewBadge] = useState<Badge | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const isParent = userRole === 'parent';
  const level = useMemo(() => getLevelForPoints(student.points, levels), [student.points, levels]);
  
  // Progress to next level
  const progressPercent = useMemo(() => {
    const currentIndex = levels.findIndex(l => l.id === level.id);
    const nextLevel = levels[currentIndex + 1];
    return nextLevel 
      ? Math.max(5, Math.min(100, ((student.points - level.minPoints) / Math.max(1, (nextLevel.minPoints - level.minPoints))) * 100))
      : 100;
  }, [levels, level.id, level.minPoints, student.points]);

  // All badges owned by the student
  const studentBadges = useMemo(() => {
    return (student.badgeIds || [])
      .map(id => allBadges.find(b => b.id === id))
      .filter((b): b is Badge => Boolean(b));
  }, [student.badgeIds, allBadges]);

  const isTop1 = showRank === 1;
  const isTop2 = showRank === 2;
  const isTop3 = showRank === 3;

  const handleBadgeClick = (badge: Badge, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewBadge(badge);
  };

  const handleOpenReport = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStudentReportModal(student.id);
  };

  return (
    <>
      <div
        onClick={isParent ? handleOpenReport : undefined}
        className={cn(
          "group relative overflow-hidden bg-white/95 rounded-[24px] p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between select-none",
          isParent && "cursor-pointer hover:border-purple-300 hover:shadow-[0_16px_36px_rgba(124,58,237,0.12)]",
          isTop1 
            ? "border-amber-300 shadow-[0_12px_30px_rgba(245,158,11,0.15)] ring-2 ring-amber-200/60" 
            : isTop2 
            ? "border-slate-300 shadow-[0_10px_25px_rgba(100,116,139,0.12)]" 
            : isTop3 
            ? "border-orange-300 shadow-[0_10px_25px_rgba(249,115,22,0.12)]" 
            : "border-purple-100/80 shadow-[0_8px_24px_rgba(124,58,237,0.05)] hover:border-purple-200",
          "hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(124,58,237,0.10)]"
        )}
      >
        {/* Top Header Row: Rank Badge / Group Pill + Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {showRank ? (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs",
                isTop1 ? "bg-amber-100 text-amber-900 border border-amber-300" :
                isTop2 ? "bg-slate-100 text-slate-800 border border-slate-300" :
                isTop3 ? "bg-orange-100 text-orange-900 border border-orange-300" :
                "bg-purple-50 text-purple-700 border border-purple-100"
              )}>
                {isTop1 ? '👑 Top 1' : isTop2 ? '🥈 Top 2' : isTop3 ? '🥉 Top 3' : `#${showRank}`}
              </span>
            ) : groupName ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                <Users size={11} /> {groupName}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">
                {student.gender === 'Nữ' ? '👧 Bạn nữ' : '👦 Bạn nam'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* View Emulation Report Button */}
            <button
              onClick={handleOpenReport}
              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200/80 shadow-2xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Xem hồ sơ & nhật ký thi đua của học sinh"
            >
              <FileText size={14} />
            </button>

            {!isParent && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAwardModalOpen(true);
                  }}
                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200/80 shadow-2xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Trao huy hiệu cho học sinh"
                >
                  <Award size={14} />
                </button>
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-200/70 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Chỉnh sửa thông tin học sinh"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Avatar & Student Name */}
        <div className="flex flex-col items-center text-center my-1">
          <div
            onClick={(e) => {
              if (isParent) {
                handleOpenReport(e);
              } else {
                e.stopPropagation();
                setIsAvatarModalOpen(true);
              }
            }}
            className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-400 via-pink-400 to-amber-300 shadow-md cursor-pointer group/avatar transition-transform hover:scale-105"
            title={isParent ? "Bấm để xem chi tiết học tập & thi đua" : "Bấm để thay đổi ảnh đại diện"}
          >
            <img
              src={getAvatarUrl(student.avatarId, customAvatars)}
              alt={student.name}
              className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white"
            />
            {!isParent ? (
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white">
                <Camera size={18} className="mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-tight">Đổi ảnh</span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-purple-900/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white">
                <Eye size={18} className="mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-tight">Xem hồ sơ</span>
              </div>
            )}
          </div>

          <h3
            onClick={(e) => {
              if (isParent) {
                handleOpenReport(e);
              } else if (onEdit) {
                e.stopPropagation();
                onEdit();
              }
            }}
            className="text-base font-black text-slate-800 tracking-tight mt-2.5 truncate w-full cursor-pointer hover:text-purple-600 transition-colors"
            title={student.name}
          >
            {student.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-bold text-slate-400">
              {level.name}
            </span>
            <span className="text-xs">{level.icon}</span>
          </div>
        </div>

        {/* Badges Carousel / Showcase */}
        <div className="w-full flex items-center justify-center gap-1.5 my-2.5 min-h-[28px] px-1 flex-wrap">
          {studentBadges.length > 0 ? (
            studentBadges.map((b) => (
              <button
                key={b.id}
                onClick={(e) => handleBadgeClick(b, e)}
                className="w-7 h-7 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 shadow-2xs flex items-center justify-center text-base transform hover:scale-125 hover:rotate-6 transition-all cursor-pointer"
                title={`${b.name}: ${b.description} (Bấm để xem)`}
              >
                <span>{b.icon}</span>
              </button>
            ))
          ) : (
            <span className="text-[11px] font-medium text-slate-300 italic">
              Chưa có huy hiệu
            </span>
          )}
        </div>

        {/* Level Progress Bar */}
        <div className="w-full mb-3.5">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 mb-1">
            <span>Tiến độ cấp độ</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                level.color.split(' ')[0] || "bg-gradient-to-r from-purple-500 to-pink-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Points & Pastel Increment/Decrement Buttons OR Parent Emulation Summary */}
        {!isParent ? (
          <div className="flex items-center justify-between gap-2 p-2 bg-purple-50/50 rounded-2xl border border-purple-100/60 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinusPoint();
              }}
              className="w-10 h-10 rounded-xl bg-rose-100 hover:bg-rose-500 text-rose-700 hover:text-white font-black text-lg transition-all shadow-2xs flex items-center justify-center active:scale-90 cursor-pointer"
              title="Trừ điểm"
            >
              <Minus size={18} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Điểm
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black text-purple-700 tracking-tight">
                  {student.points}
                </span>
                <Star size={14} className="text-amber-400 fill-amber-400" />
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddPoint();
              }}
              className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-500 text-emerald-700 hover:text-white font-black text-lg transition-all shadow-2xs flex items-center justify-center active:scale-90 cursor-pointer"
              title="Cộng điểm tốt"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleOpenReport}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl border border-purple-200/80 flex items-center justify-between gap-2 transition-all shadow-2xs group/btn cursor-pointer"
            title="Bấm để xem đầy đủ sổ nề nếp và lịch sử thi đua"
          >
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-500 fill-amber-400" />
              <span className="text-base font-black text-purple-900 tracking-tight">
                {student.points} sao
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-purple-700 group-hover/btn:text-purple-900">
              <span>Xem sổ nề nếp</span>
              <FileText size={13} />
            </div>
          </button>
        )}
      </div>

      {/* Avatar Modal (Teacher Only) */}
      {!isParent && (
        <AvatarModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          student={student}
          targetClassId={activeClassId || undefined}
        />
      )}

      {/* Badge Celebration Modal */}
      {previewBadge && (
        <BadgeCelebrationModal
          isOpen={Boolean(previewBadge)}
          onClose={() => setPreviewBadge(null)}
          badge={previewBadge}
          student={student}
          currentClass={useStore.getState().classes.find(c => c.id === activeClassId) || null}
          teacher={useStore.getState().teacher}
          soundEnabled={useStore.getState().soundEnabled}
        />
      )}

      {/* Award Badge Modal (Teacher Only) */}
      {!isParent && (
        <AwardBadgeModal
          isOpen={isAwardModalOpen}
          onClose={() => setIsAwardModalOpen(false)}
          targetStudent={student}
        />
      )}
    </>
  );
});

