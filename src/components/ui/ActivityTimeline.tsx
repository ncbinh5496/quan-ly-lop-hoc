import { useMemo, memo } from 'react';
import { Star, Award, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { PointTransaction, StudentBadge, RewardTransaction, Student, Badge, Reward } from '../../types';
import { cn, formatDate } from '../../utils/helpers';

interface ActivityTimelineProps {
  transactions: PointTransaction[];
  badges: StudentBadge[];
  rewardTransactions: RewardTransaction[];
  students: Student[];
  badgeCatalog: Badge[];
  rewardCatalog: Reward[];
  onViewAll?: () => void;
}

export const ActivityTimeline = memo(function ActivityTimeline({
  transactions,
  badges,
  rewardTransactions,
  students,
  badgeCatalog,
  rewardCatalog,
  onViewAll
}: ActivityTimelineProps) {
  // Combine all activities into a unified chronologically sorted list
  const allEvents = useMemo(() => {
    return [
      ...transactions.map(t => ({
        id: `pt-${t.id}`,
        type: 'point' as const,
        timestamp: t.timestamp,
        studentId: t.studentId,
        amount: t.amount,
        reason: t.reason,
        badgeId: undefined,
        rewardId: undefined,
        cost: undefined,
      })),
      ...badges.map(b => ({
        id: `bd-${b.id}`,
        type: 'badge' as const,
        timestamp: b.timestamp,
        studentId: b.studentId,
        badgeId: b.badgeId,
        amount: undefined,
        reason: undefined,
        rewardId: undefined,
        cost: undefined,
      })),
      ...rewardTransactions.map(r => ({
        id: `rw-${r.id}`,
        type: 'reward' as const,
        timestamp: r.timestamp,
        studentId: r.studentId,
        rewardId: r.rewardId,
        cost: r.cost,
        amount: undefined,
        reason: undefined,
        badgeId: undefined,
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 7);
  }, [transactions, badges, rewardTransactions]);

  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const badgeMap = useMemo(() => new Map(badgeCatalog.map(b => [b.id, b])), [badgeCatalog]);
  const rewardMap = useMemo(() => new Map(rewardCatalog.map(r => [r.id, r])), [rewardCatalog]);

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.06)] h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-sm shadow-amber-500/20">
            ⚡
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              Hoạt động gần đây
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ghi nhận điểm & phần thưởng trực tiếp
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
          >
            Xem tất cả
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {allEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <Sparkles className="mx-auto mb-2 text-purple-300 w-8 h-8 opacity-60" />
            Chưa có hoạt động nào trong lớp hôm nay.
          </div>
        ) : (
          allEvents.map(event => {
            const student = studentMap.get(event.studentId);
            const studentName = student?.name || 'Học sinh';

            if (event.type === 'point') {
              const isPositive = (event.amount || 0) > 0;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 transition-colors"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs",
                    isPositive 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                      : "bg-rose-100 text-rose-700 border border-rose-200"
                  )}>
                    {isPositive ? `+${event.amount}` : event.amount}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-slate-800 truncate">
                        {studentName}
                      </span>
                      <ArrowRight size={10} className="text-slate-300 shrink-0" />
                      <span className="text-xs text-slate-600 font-medium truncate">
                        {event.reason}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            }

            if (event.type === 'badge') {
              const badge = event.badgeId ? badgeMap.get(event.badgeId) : undefined;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
                    {badge?.icon || '🏆'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-slate-800 truncate">
                        {studentName}
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 truncate">
                        nhận huy hiệu {badge?.name || 'Danh dự'}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-600/70">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            }

            if (event.type === 'reward') {
              const reward = event.rewardId ? rewardMap.get(event.rewardId) : undefined;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-pink-50/50 hover:bg-pink-50 border border-pink-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
                    {reward?.icon || '🎁'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-slate-800 truncate">
                        {studentName}
                      </span>
                      <span className="text-[11px] font-bold text-pink-800 truncate">
                        đổi quà {reward?.name || 'Phần thưởng'} (-{event.cost} sao)
                      </span>
                    </div>
                    <span className="text-[10px] text-pink-600/70">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </div>
  );
});
