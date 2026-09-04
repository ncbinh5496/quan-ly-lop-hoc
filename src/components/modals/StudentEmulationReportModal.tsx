import React, { useState, useMemo, useRef } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  Award, 
  Star, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Gift,
  Share2,
  ChevronRight,
  Filter,
  GraduationCap
} from 'lucide-react';
import { useStore } from '../../store';
import { cn, getAvatarUrl, getLevelForPoints, formatDate } from '../../utils/helpers';
import { Student, Badge } from '../../types';

interface StudentEmulationReportModalProps {
  studentId: string | null;
  onClose: () => void;
}

export function StudentEmulationReportModal({ studentId, onClose }: StudentEmulationReportModalProps) {
  const { classes, activeClassId, levels, badges: allBadges, rewards, teacher, userRole, setPinAuthModal } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  const printRef = useRef<HTMLDivElement>(null);

  const activeClass = classes.find(c => c.id === activeClassId);
  const student = activeClass?.students.find(s => s.id === studentId);
  const group = activeClass?.groups.find(g => g.id === student?.groupId);

  // Student level & progress
  const level = student ? getLevelForPoints(student.points, levels) : levels[0];
  const currentIndex = levels.findIndex(l => l.id === level.id);
  const nextLevel = levels[currentIndex + 1];
  const progressPercent = nextLevel && student
    ? Math.max(5, Math.min(100, ((student.points - level.minPoints) / Math.max(1, (nextLevel.minPoints - level.minPoints))) * 100))
    : 100;

  // Student rank in class
  const classRank = useMemo(() => {
    if (!activeClass || !student) return null;
    const sorted = [...activeClass.students].sort((a, b) => b.points - a.points);
    const index = sorted.findIndex(s => s.id === student.id);
    return index !== -1 ? index + 1 : null;
  }, [activeClass, student]);

  // Student rank in group
  const groupRank = useMemo(() => {
    if (!activeClass || !student || !student.groupId) return null;
    const groupStudents = activeClass.students
      .filter(s => s.groupId === student.groupId)
      .sort((a, b) => b.points - a.points);
    const index = groupStudents.findIndex(s => s.id === student.id);
    return index !== -1 ? index + 1 : null;
  }, [activeClass, student]);

  // Student badges
  const studentBadges = useMemo(() => {
    if (!student) return [];
    return (student.badgeIds || [])
      .map(id => allBadges.find(b => b.id === id))
      .filter((b): b is Badge => Boolean(b));
  }, [student, allBadges]);

  // Student transactions
  const studentTransactions = useMemo(() => {
    if (!activeClass || !student) return [];
    return (activeClass.transactions || [])
      .filter(t => t.studentId === student.id)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [activeClass, student]);

  // Student reward redemptions
  const studentRewards = useMemo(() => {
    if (!activeClass || !student) return [];
    return (activeClass.rewardTransactions || [])
      .filter(t => t.studentId === student.id)
      .map(t => {
        const reward = rewards.find(r => r.id === t.rewardId);
        return {
          ...t,
          rewardName: reward?.name || 'Phần quà thưởng',
          rewardIcon: reward?.icon || '🎁',
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [activeClass, student, rewards]);

  // Attendance for student
  const studentAttendanceStats = useMemo(() => {
    if (!activeClass || !student || !activeClass.attendanceRecords) return { present: 0, late: 0, absent: 0, total: 0 };
    let present = 0;
    let late = 0;
    let absent = 0;
    const total = activeClass.attendanceRecords.length;

    activeClass.attendanceRecords.forEach(rec => {
      const status = rec.studentStatuses?.[student.id] || 'present';
      if (status === 'present') present++;
      else if (status === 'late') late++;
      else absent++;
    });

    return { present, late, absent, total };
  }, [activeClass, student]);

  const filteredTransactions = useMemo(() => {
    if (filterType === 'positive') return studentTransactions.filter(t => t.amount > 0);
    if (filterType === 'negative') return studentTransactions.filter(t => t.amount < 0);
    return studentTransactions;
  }, [studentTransactions, filterType]);

  if (!studentId || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const isTopRank = classRank && classRank <= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        ref={printRef}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 p-5 sm:p-6 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-5">
              {/* Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-xl shrink-0">
                <img
                  src={getAvatarUrl(student.avatarId, activeClass?.customAvatars)}
                  alt={student.name}
                  className="w-full h-full rounded-full object-cover bg-white ring-2 ring-white/80"
                />
                {classRank && (
                  <span className={cn(
                    "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-md",
                    classRank === 1 ? "bg-amber-400 text-amber-950" :
                    classRank === 2 ? "bg-slate-200 text-slate-900" :
                    classRank === 3 ? "bg-orange-400 text-orange-950" :
                    "bg-purple-900 text-purple-100"
                  )}>
                    Top {classRank}
                  </span>
                )}
              </div>

              {/* Student info */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-purple-100">
                    {activeClass?.name} {group ? `• ${group.name}` : ''}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles size={12} /> {level.name} {level.icon}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {student.name}
                </h2>
                <p className="text-xs text-purple-100/90 mt-0.5 flex items-center gap-2">
                  <span>{student.gender === 'Nữ' ? '👧 Học sinh nữ' : '👦 Học sinh nam'}</span>
                  {teacher && (
                    <span>• GVCN: <strong className="text-white">{teacher.name}</strong></span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="In phiếu báo kết quả thi đua"
              >
                <Printer size={15} />
                <span>In phiếu</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Current Star Points */}
            <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Điểm sao hiện tại</span>
              <div className="flex items-center gap-1.5 my-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">{student.points}</span>
                <Star size={20} className="text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold text-amber-800/80">
                {classRank ? `Hạng ${classRank} toàn lớp` : 'Đang thi đua'}
              </span>
            </div>

            {/* Positive Points */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Điểm cộng việc tốt</span>
              <div className="flex items-center gap-1 my-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">+{student.totalPositivePoints || 0}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800/80">
                {studentTransactions.filter(t => t.amount > 0).length} lần khen thưởng
              </span>
            </div>

            {/* Need Improvement */}
            <div className="p-3.5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Điểm cần rèn luyện</span>
              <div className="flex items-center gap-1 my-1">
                <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">{student.totalNegativePoints || 0}</span>
              </div>
              <span className="text-[11px] font-bold text-rose-800/80">
                {studentTransactions.filter(t => t.amount < 0).length} lần nhắc nhở
              </span>
            </div>

            {/* Attendance & Badges */}
            <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Huy hiệu & Quà</span>
              <div className="flex items-center gap-1.5 my-1">
                <span className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">{studentBadges.length}</span>
                <Award size={20} className="text-purple-500" />
              </div>
              <span className="text-[11px] font-bold text-purple-800/80">
                {studentRewards.length} phần thưởng đã đổi
              </span>
            </div>
          </div>

          {/* LEVEL PROGRESS */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={15} className="text-purple-600" />
                Cấp bậc hiện tại: <strong className="text-purple-700">{level.name} {level.icon}</strong>
              </span>
              <span className="text-slate-400">
                {nextLevel ? `Cần thêm ${Math.max(0, nextLevel.minPoints - student.points)} sao để lên ${nextLevel.name}` : 'Cấp bậc tối đa 🏆'}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* BADGES COLLECTION */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Award size={16} className="text-amber-500" />
                Bộ sưu tập Huy hiệu danh dự ({studentBadges.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Ghi nhận sự nỗ lực vượt bậc</span>
            </div>

            {studentBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {studentBadges.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2.5 shadow-2xs hover:scale-102 transition-transform"
                  >
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-amber-950 truncate">{b.name}</p>
                      <p className="text-[10px] text-amber-800/80 line-clamp-1">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                Bé chưa có huy hiệu nào. Hãy cùng cố gắng thi đua trong các tuần tới nhé!
              </div>
            )}
          </div>

          {/* REWARDS REDEEMED */}
          {studentRewards.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5 mb-3">
                <Gift size={16} className="text-pink-500" />
                Quà thưởng đã đổi ({studentRewards.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {studentRewards.map((r) => (
                  <div 
                    key={r.id}
                    className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200/70 text-xs font-bold text-pink-900 flex items-center gap-1.5"
                  >
                    <span>{r.rewardIcon}</span>
                    <span>{r.rewardName}</span>
                    <span className="text-[10px] text-pink-600 font-normal">({formatDate(r.timestamp)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAILED EMULATION TIMELINE */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Clock size={16} className="text-purple-600" />
                Nhật ký nề nếp & thi đua chi tiết ({filteredTransactions.length})
              </h4>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setFilterType('all')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                    filterType === 'all' ? "bg-white text-purple-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Tất cả ({studentTransactions.length})
                </button>
                <button
                  onClick={() => setFilterType('positive')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                    filterType === 'positive' ? "bg-emerald-500 text-white shadow-2xs" : "text-slate-500 hover:text-emerald-700"
                  )}
                >
                  Việc tốt (+)
                </button>
                <button
                  onClick={() => setFilterType('negative')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                    filterType === 'negative' ? "bg-rose-500 text-white shadow-2xs" : "text-slate-500 hover:text-rose-700"
                  )}
                >
                  Cần rèn luyện (-)
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const isPositive = t.amount > 0;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between gap-3 transition-all",
                        isPositive 
                          ? "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70" 
                          : "bg-rose-50/40 border-rose-100 hover:bg-rose-50/70"
                      )}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black shadow-2xs mt-0.5",
                          isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {isPositive ? '+' : '-'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-snug">
                            {t.reason}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} /> {formatDate(t.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={cn(
                          "text-sm font-black px-2.5 py-1 rounded-xl shadow-2xs",
                          isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {isPositive ? `+${t.amount}` : t.amount} sao
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs italic">
                  Chưa có dữ liệu ghi nhận trong mục này.
                </div>
              )}
            </div>
          </div>

          {/* TEACHER NOTE & PARENT ACKNOWLEDGEMENT */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-2xl border border-purple-200/80 flex items-start gap-3">
            <ShieldCheck size={22} className="text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-purple-900">
                Thông điệp từ Giáo viên chủ nhiệm:
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {student.note 
                  ? student.note 
                  : "Mỗi ngày đến trường là một ngày vui. Kính mong Quý phụ huynh luôn đồng hành, động viên và khích lệ các con rèn luyện nếp học tập và đạo đức tốt!"}
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            {userRole === 'parent' ? '👨‍👩‍👧 Bạn đang xem ở Chế độ Phụ huynh (Chỉ đọc)' : '👩‍🏫 Quyền hạn: Giáo viên chủ nhiệm'}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            {userRole === 'parent' && (
              <button
                onClick={() => {
                  onClose();
                  setPinAuthModal({ isOpen: true, title: 'Đăng nhập Giáo viên để chỉnh sửa' });
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Giáo viên đăng nhập
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
