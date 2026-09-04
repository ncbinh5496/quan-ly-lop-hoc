import React, { memo, useMemo } from 'react';
import { Award } from 'lucide-react';
import { Student, Group, CustomAvatar } from '../../types';
import { StudentCard } from '../ui/StudentCard';
import { useStore } from '../../store';

interface TopEmulationStarsProps {
  topStudents: Student[];
  totalStudents: number;
  groups?: Group[];
  customAvatars?: CustomAvatar[];
  onOpenAwardModal: () => void;
  onNavigateTab?: (tab: string) => void;
  onAddPoint: (studentId: string) => void;
  onMinusPoint: (studentId: string) => void;
}

export const TopEmulationStars = memo(function TopEmulationStars({
  topStudents,
  totalStudents,
  groups,
  customAvatars,
  onOpenAwardModal,
  onNavigateTab,
  onAddPoint,
  onMinusPoint,
}: TopEmulationStarsProps) {
  const userRole = useStore(state => state.userRole);
  const isParent = userRole === 'parent';

  const groupsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (groups) {
      groups.forEach(g => map.set(g.id, g.name));
    }
    return map;
  }, [groups]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base font-black shadow-2xs">
            ✨
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              Ngôi sao chăm ngoan
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Top học sinh tích cực dẫn đầu bảng thi đua
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isParent && (
            <button
              onClick={onOpenAwardModal}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Award size={14} /> Trao huy hiệu
            </button>
          )}
          <button
            onClick={() => onNavigateTab?.('students')}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            Xem tất cả ({totalStudents})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topStudents.map((student, idx) => (
          <StudentCard
            key={student.id}
            student={student}
            groupName={student.groupId ? groupsMap.get(student.groupId) : undefined}
            customAvatars={customAvatars}
            showRank={idx + 1}
            onAddPoint={() => onAddPoint(student.id)}
            onMinusPoint={() => onMinusPoint(student.id)}
          />
        ))}
      </div>
    </div>
  );
});
