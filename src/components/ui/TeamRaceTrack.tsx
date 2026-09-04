import { useMemo, memo } from 'react';
import { Trophy, ChevronRight, Award, Plus, Sparkles } from 'lucide-react';
import { Group, Student } from '../../types';
import { cn } from '../../utils/helpers';

interface TeamRaceTrackProps {
  groups: Group[];
  students: Student[];
  onViewDetails?: () => void;
  onQuickAddGroupPoints?: (groupId: string) => void;
}

export const TeamRaceTrack = memo(function TeamRaceTrack({
  groups,
  students,
  onViewDetails,
  onQuickAddGroupPoints
}: TeamRaceTrackProps) {
  // Calculate group scores with single-pass student aggregation
  const { teamData, maxScore, rankMap } = useMemo(() => {
    // Pre-aggregate student points per group
    const groupStats = new Map<string, { count: number; total: number }>();
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      if (s.groupId) {
        let st = groupStats.get(s.groupId);
        if (!st) {
          st = { count: 0, total: 0 };
          groupStats.set(s.groupId, st);
        }
        st.count++;
        st.total += s.points;
      }
    }

    const tData = groups.map((g, index) => {
      const st = groupStats.get(g.id) || { count: 0, total: 0 };
      const avgPoints = st.count > 0 ? Math.round(st.total / st.count) : 0;
      
      const colors = [
        {
          bg: 'from-violet-500 to-indigo-600',
          track: 'bg-indigo-100',
          bar: 'bg-gradient-to-r from-violet-500 to-indigo-500',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          mascot: '🚀',
          name: g.name
        },
        {
          bg: 'from-pink-500 to-rose-600',
          track: 'bg-pink-100',
          bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
          badge: 'bg-pink-50 text-pink-700 border-pink-200',
          mascot: '🦄',
          name: g.name
        },
        {
          bg: 'from-amber-400 to-orange-500',
          track: 'bg-amber-100',
          bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          mascot: '🦁',
          name: g.name
        },
        {
          bg: 'from-emerald-400 to-teal-500',
          track: 'bg-emerald-100',
          bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          mascot: '🐬',
          name: g.name
        },
        {
          bg: 'from-blue-400 to-cyan-500',
          track: 'bg-blue-100',
          bar: 'bg-gradient-to-r from-blue-400 to-cyan-500',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          mascot: '⭐',
          name: g.name
        }
      ][index % 5];

      return {
        id: g.id,
        name: g.name,
        studentCount: st.count,
        totalPoints: st.total,
        avgPoints,
        ...colors
      };
    });

    const mScore = Math.max(...tData.map(t => t.totalPoints), 50);
    const sortedRanks = [...tData].sort((a, b) => b.totalPoints - a.totalPoints);
    const rMap: Record<string, number> = {};
    sortedRanks.forEach((t, i) => {
      rMap[t.id] = i + 1;
    });

    return { teamData: tData, maxScore: mScore, rankMap: rMap };
  }, [groups, students]);

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.06)]">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm shadow-purple-500/20">
            🏁
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              Đường đua 4 tổ
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                Tuần thi đua
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Thi đua học tập & rèn luyện tích cực giữa các tổ
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer group"
          >
            <span>Chi tiết tổ</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {teamData.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-medium">
          Chưa có tổ nào được tạo trong lớp này.
        </div>
      ) : (
        <div className="space-y-4">
          {teamData.map((team) => {
            const rank = rankMap[team.id];
            const percentage = Math.min(Math.max((team.totalPoints / maxScore) * 100, 8), 100);

            const rankBadge = rank === 1 ? (
              <span className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Trophy size={11} className="text-amber-600 fill-amber-500" /> Hạng 1
              </span>
            ) : rank === 2 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Award size={11} className="text-slate-500" /> Hạng 2
              </span>
            ) : rank === 3 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                <Award size={11} className="text-orange-600" /> Hạng 3
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5">
                Hạng {rank}
              </span>
            );

            return (
              <div
                key={team.id}
                className="group p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-xs shrink-0",
                      team.badge
                    )}>
                      {team.mascot}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-800 tracking-tight truncate">
                          {team.name}
                        </span>
                        {rankBadge}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {team.studentCount} thành viên
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-purple-700">
                        {team.totalPoints}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 ml-1">
                        sao
                      </span>
                    </div>

                    {onQuickAddGroupPoints && (
                      <button
                        onClick={() => onQuickAddGroupPoints(team.id)}
                        className="p-1.5 bg-purple-100/80 hover:bg-purple-600 text-purple-700 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                        title="Cộng điểm cả tổ"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Animated Track Bar */}
                <div className="w-full h-3.5 bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out relative",
                      team.bar
                    )}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 25 && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse-subtle rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
