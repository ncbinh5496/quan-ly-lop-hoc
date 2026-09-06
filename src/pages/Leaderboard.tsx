import type { ClassData } from '../types';
import { useState, useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { Trophy, Medal, Search, Filter, Calendar, Award, Sparkles, TrendingUp, Star, Crown } from 'lucide-react';
import { cn, getAvatarUrl, getLevelForPoints } from '../utils/helpers';
import { useClassroomDate } from '../utils/useClassroomDate';
import { filterTransactionsByTime } from '../utils/scoreCalculator';

type TimeFilterType = 'today' | 'week' | 'month' | 'all';

function LeaderboardContent({ activeClass }: { activeClass: ClassData }) {
  const levels = useStore(state => state.levels);
  const badges = useStore(state => state.badges);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const today = useClassroomDate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  




  // Filter transactions by time with O(T + S) pre-aggregation
  const timeFilteredData = useMemo(() => {
    if (timeFilter === 'all') {
      return activeClass.students.map(student => ({
        ...student,
        displayPoints: student.points,
        displayPositive: student.totalPositivePoints || 0,
        displayNegative: student.totalNegativePoints || 0,
      }));
    }

    const filteredTransactions = filterTransactionsByTime(activeClass.transactions || [], timeFilter);


    // Single pass aggregation for O(1) per-student lookups
    const txStatsMap = new Map<string, { positive: number; negative: number }>();
    for (let i = 0; i < filteredTransactions.length; i++) {
      const tx = filteredTransactions[i];
      let stat = txStatsMap.get(tx.studentId);
      if (!stat) {
        stat = { positive: 0, negative: 0 };
        txStatsMap.set(tx.studentId, stat);
      }
      if (tx.amount > 0) {
        stat.positive += tx.amount;
      } else if (tx.amount < 0) {
        stat.negative += Math.abs(tx.amount);
      }
    }

    return activeClass.students.map(student => {
      const stat = txStatsMap.get(student.id) || { positive: 0, negative: 0 };
      const net = stat.positive - stat.negative;

      return {
        ...student,
        displayPoints: net,
        displayPositive: stat.positive,
        displayNegative: stat.negative,
      };
    });
  }, [activeClass.students, activeClass.transactions, timeFilter, today]);

  // Pre-index groups for O(1) group name lookups
  const groupsMap = useMemo(() => {
    const map = new Map<string, string>();
    activeClass.groups.forEach(g => map.set(g.id, g.name));
    return map;
  }, [activeClass.groups]);

  // Search and group filtering
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = timeFilteredData;

    if (term) {
      list = list.filter(s => s.name.toLowerCase().includes(term));
    }

    if (selectedGroup !== 'all') {
      list = list.filter(s => s.groupId === selectedGroup);
    }

    return [...list].sort((a, b) =>
      b.displayPoints - a.displayPoints || 
      b.displayPositive - a.displayPositive || 
      b.points - a.points
    );
  }, [timeFilteredData, searchTerm, selectedGroup]);

  const getTimeFilterLabel = (t: TimeFilterType) => {
    switch (t) {
      case 'today': return 'Hôm nay';
      case 'week': return 'Tuần này';
      case 'month': return 'Tháng này';
      default: return 'Toàn thời gian';
    }
  };

  const top1 = filteredStudents[0];
  const top2 = filteredStudents[1];
  const top3 = filteredStudents[2];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-sm shadow-amber-500/25">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Bảng xếp hạng thi đua
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Lớp {activeClass.name} • {filteredStudents.length} học sinh đang thi đua
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Time Filter Pill Buttons */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/70">
            {(['today', 'week', 'month', 'all'] as TimeFilterType[]).map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                  timeFilter === t 
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm scale-[1.02]" 
                    : "text-slate-600 hover:text-purple-700 hover:bg-white/80"
                )}
              >
                {t === 'today' ? 'Hôm nay' : t === 'week' ? 'Tuần này' : t === 'month' ? 'Tháng này' : 'Toàn khóa'}
              </button>
            ))}
          </div>

          {/* Group Filter */}
          <select 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value="all">Tất cả các tổ</option>
            {activeClass.groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Tìm theo tên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-36 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Podium Showcase for Top 3 */}
      {filteredStudents.length >= 3 && !searchTerm && selectedGroup === 'all' && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 pt-4 pb-2 items-end">
          {/* Top 2 (Silver) */}
          {top2 && (
            <div className="bg-white/95 rounded-[28px] p-4 sm:p-5 border-2 border-slate-200 shadow-[0_10px_25px_rgba(100,116,139,0.12)] flex flex-col items-center text-center relative order-1 sm:order-1 h-[210px] justify-between">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-300 shadow-sm flex items-center justify-center font-black text-slate-700 text-sm">
                🥈
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-slate-300 to-slate-400 shadow-md">
                <img 
                  src={getAvatarUrl(top2.avatarId, activeClass?.customAvatars)} 
                  alt={top2.name} 
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white" 
                />
              </div>
              <div className="w-full">
                <p className="font-black text-slate-800 text-xs sm:text-sm truncate w-full">{top2.name}</p>
                <div className="mt-1 px-3 py-0.5 bg-slate-100 text-slate-700 rounded-full font-black text-xs inline-block">
                  {top2.displayPoints} sao
                </div>
              </div>
            </div>
          )}

          {/* Top 1 (Gold / Crown) */}
          {top1 && (
            <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-[32px] p-5 sm:p-6 border-4 border-amber-300 shadow-[0_16px_36px_rgba(245,158,11,0.20)] ring-4 ring-amber-100/70 flex flex-col items-center text-center relative order-2 sm:order-2 h-[250px] justify-between">
              <div className="absolute -top-7 w-13 h-13 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center font-black text-amber-950 text-2xl animate-bounce">
                👑
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 shadow-lg">
                <img 
                  src={getAvatarUrl(top1.avatarId, activeClass?.customAvatars)} 
                  alt={top1.name} 
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white" 
                />
              </div>
              <div className="w-full">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Quán quân
                </span>
                <p className="font-black text-slate-900 text-sm sm:text-base truncate w-full mt-1">{top1.name}</p>
                <div className="mt-1 px-4 py-1 bg-amber-400 text-amber-950 rounded-full font-black text-sm shadow-xs inline-block">
                  {top1.displayPoints} sao ⭐
                </div>
              </div>
            </div>
          )}

          {/* Top 3 (Bronze) */}
          {top3 && (
            <div className="bg-white/95 rounded-[28px] p-4 sm:p-5 border-2 border-orange-200 shadow-[0_10px_25px_rgba(249,115,22,0.12)] flex flex-col items-center text-center relative order-3 sm:order-3 h-[190px] justify-between">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-300 shadow-sm flex items-center justify-center font-black text-orange-900 text-sm">
                🥉
              </div>
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-tr from-orange-300 to-amber-500 shadow-md">
                <img 
                  src={getAvatarUrl(top3.avatarId, activeClass?.customAvatars)} 
                  alt={top3.name} 
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white" 
                />
              </div>
              <div className="w-full">
                <p className="font-black text-slate-800 text-xs sm:text-sm truncate w-full">{top3.name}</p>
                <div className="mt-1 px-3 py-0.5 bg-orange-50 text-orange-800 rounded-full font-black text-xs inline-block">
                  {top3.displayPoints} sao
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Ranking Table Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-purple-100">
                <th className="p-4 font-black text-center w-16">Hạng</th>
                <th className="p-4 font-black">Học sinh</th>
                <th className="p-4 font-black text-center">
                  {timeFilter === 'all' ? 'Tổng Sao' : `Điểm (${getTimeFilterLabel(timeFilter)})`}
                </th>
                <th className="p-4 font-black text-center hidden md:table-cell">Điểm cộng</th>
                <th className="p-4 font-black text-center hidden md:table-cell">Điểm trừ</th>
                <th className="p-4 font-black">Cấp độ danh hiệu</th>
                <th className="p-4 font-black hidden sm:table-cell">Huy hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const level = getLevelForPoints(student.points, levels);
                  const isTop1 = index === 0;
                  const isTop2 = index === 1;
                  const isTop3 = index === 2;

                  return (
                    <tr 
                      key={student.id} 
                      className={cn(
                        "hover:bg-purple-50/50 transition-colors group",
                        isTop1 ? "bg-amber-50/20" : isTop2 ? "bg-slate-50/20" : isTop3 ? "bg-orange-50/15" : ""
                      )}
                    >
                      <td className="p-4 text-center">
                        {isTop1 ? <span className="text-xl">🥇</span> :
                         isTop2 ? <span className="text-xl">🥈</span> :
                         isTop3 ? <span className="text-xl">🥉</span> :
                         <span className="font-black text-slate-400 text-xs">#{index + 1}</span>}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-purple-100 p-0.5 overflow-hidden shrink-0">
                            <img 
                              src={getAvatarUrl(student.avatarId, activeClass?.customAvatars)} 
                              alt={student.name} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          </div>
                          <div>
                            <span className="font-black text-slate-800 text-sm block group-hover:text-purple-600 transition-colors">
                              {student.name}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {student.gender} {student.groupId ? `• ${groupsMap.get(student.groupId) || ''}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center min-w-[3.5rem] px-3 py-1 rounded-full font-black text-xs sm:text-sm shadow-2xs",
                          student.displayPoints > 0 ? "bg-emerald-100 text-emerald-700" : 
                          student.displayPoints < 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {student.displayPoints > 0 ? `+${student.displayPoints}` : student.displayPoints}
                        </span>
                      </td>

                      <td className="p-4 text-center hidden md:table-cell">
                        <span className="text-emerald-600 font-bold text-sm">+{student.displayPositive}</span>
                      </td>

                      <td className="p-4 text-center hidden md:table-cell">
                        <span className="text-rose-500 font-bold text-sm">-{student.displayNegative}</span>
                      </td>

                      <td className="p-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black", level.color)}>
                          <span>{level.icon}</span>
                          <span className="hidden lg:inline">{level.name.replace(/^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')}</span>
                        </div>
                      </td>

                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex -space-x-1.5">
                          {student.badgeIds.slice(0, 4).map((id, i) => {
                            const b = badges.find(x => x.id === id);
                            return b ? (
                              <div 
                                key={i} 
                                className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-2xs text-xs hover:scale-125 transition-transform cursor-pointer" 
                                title={`${b.name}: ${b.description}`}
                              >
                                {b.icon}
                              </div>
                            ) : null;
                          })}
                          {student.badgeIds.length > 4 && (
                            <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shadow-2xs text-[10px] font-black text-slate-600">
                              +{student.badgeIds.length - 4}
                            </div>
                          )}
                          {student.badgeIds.length === 0 && (
                            <span className="text-[11px] text-slate-300 italic">--</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold text-sm">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default function Leaderboard() {
  const activeClass = useActiveClass();
  return activeClass ? <LeaderboardContent activeClass={activeClass} /> : null;
}
