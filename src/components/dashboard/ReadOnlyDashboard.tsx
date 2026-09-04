import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Award, 
  Gift, 
  Users, 
  FileText, 
  Lock, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Calendar
} from 'lucide-react';
import { useStore, useActiveClass } from '../../store';
import { TeamRaceTrack } from '../ui/TeamRaceTrack';
import { ActivityTimeline } from '../ui/ActivityTimeline';
import { TopEmulationStars } from './TopEmulationStars';
import { StudentCard } from '../ui/StudentCard';
import { getRankedStudents } from '../../utils/scoreCalculator';
import { cn, getAvatarUrl, getLevelForPoints, formatDate } from '../../utils/helpers';
import { Badge, Student } from '../../types';
import { BadgeCelebrationModal } from '../modals/BadgeCelebrationModal';

interface ReadOnlyDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export function ReadOnlyDashboard({ onNavigateTab }: ReadOnlyDashboardProps) {
  const teacher = useStore(state => state.teacher);
  const badgeCatalog = useStore(state => state.badges);
  const rewardCatalog = useStore(state => state.rewards);
  const levels = useStore(state => state.levels);
  const showToast = useStore(state => state.showToast);
  const setPinAuthModal = useStore(state => state.setPinAuthModal);
  const setUserRole = useStore(state => state.setUserRole);
  const setStudentReportModal = useStore(state => state.setStudentReportModal);
  const soundEnabled = useStore(state => state.soundEnabled);

  const activeClass = useActiveClass();
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [previewBadge, setPreviewBadge] = useState<{ badge: Badge; student: Student } | null>(null);

  // Ranked students list
  const rankedStudents = useMemo(() => {
    return activeClass ? getRankedStudents(activeClass.students) : [];
  }, [activeClass?.students]);

  // Selected student object
  const selectedStudent = useMemo(() => {
    if (!activeClass || !selectedChildId) return null;
    return activeClass.students.find(s => s.id === selectedChildId) || null;
  }, [activeClass, selectedChildId]);

  // Total stats
  const totalStudents = activeClass?.students.length || 0;
  const totalPoints = useMemo(() => {
    return activeClass ? activeClass.students.reduce((sum, s) => sum + s.points, 0) : 0;
  }, [activeClass?.students]);

  const totalBadgesAwarded = activeClass?.badges?.length || 0;
  const totalRewardsRedeemed = activeClass?.rewardTransactions?.length || 0;

  // Attendance stats
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayAttendance = useMemo(() => {
    return activeClass?.attendanceRecords?.find(r => r.date === todayStr);
  }, [activeClass?.attendanceRecords, todayStr]);

  const presentCount = todayAttendance 
    ? (todayAttendance.presentCount + todayAttendance.lateCount) 
    : totalStudents;
  const attendanceRate = totalStudents > 0 
    ? Math.round((presentCount / totalStudents) * 100) 
    : 100;

  // Top 4 students for honor board
  const topStudents = useMemo(() => {
    return rankedStudents.slice(0, 4);
  }, [rankedStudents]);

  // Recent transactions for the selected student
  const studentRecentTransactions = useMemo(() => {
    if (!activeClass || !selectedStudent) return [];
    return (activeClass.transactions || [])
      .filter(t => t.studentId === selectedStudent.id)
      .slice(0, 5);
  }, [activeClass?.transactions, selectedStudent]);

  // Badges of the selected student
  const studentBadges = useMemo(() => {
    if (!selectedStudent) return [];
    return (selectedStudent.badgeIds || [])
      .map(id => badgeCatalog.find(b => b.id === id))
      .filter((b): b is Badge => Boolean(b));
  }, [selectedStudent, badgeCatalog]);

  const studentRank = useMemo(() => {
    if (!selectedStudent) return null;
    const idx = rankedStudents.findIndex(s => s.id === selectedStudent.id);
    return idx >= 0 ? idx + 1 : null;
  }, [selectedStudent, rankedStudents]);

  const studentLevel = useMemo(() => {
    if (!selectedStudent) return null;
    return getLevelForPoints(selectedStudent.points, levels);
  }, [selectedStudent, levels]);

  const studentGroup = useMemo(() => {
    if (!selectedStudent || !activeClass) return null;
    return activeClass.groups.find(g => g.id === selectedStudent.groupId);
  }, [selectedStudent, activeClass]);

  // Filtered student list for quick search
  const filteredStudents = useMemo(() => {
    if (!activeClass) return [];
    if (!searchTerm.trim()) return activeClass.students;
    const lower = searchTerm.toLowerCase();
    return activeClass.students.filter(s => s.name.toLowerCase().includes(lower));
  }, [activeClass?.students, searchTerm]);

  const handleUnlockTeacher = () => {
    setPinAuthModal({
      isOpen: true,
      title: 'Đăng nhập quyền Giáo viên chủ nhiệm',
      onSuccess: () => {
        setUserRole('teacher');
        showToast('Đã mở khóa chế độ Giáo viên thành công!', 'success');
      }
    });
  };

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 shadow-sm max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mx-auto mb-4">
          🏫
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa có dữ liệu lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng chờ giáo viên chủ nhiệm đồng bộ thông tin lớp.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* 1. PARENT WELCOME HERO BANNER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 lg:p-10 text-white select-none shadow-[0_20px_50px_-12px_rgba(79,70,229,0.35)] border border-indigo-500/30">
        {/* Decorative lighting background */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* Safe Mode Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs font-black text-emerald-300">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>CỔNG THÔNG TIN PHỤ HUYNH · CHỈ XEM AN TOÀN</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-indigo-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Đồng bộ thời gian thực</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Sổ Theo Dõi Thi Đua {activeClass.name}
            </h1>

            {/* Subtext */}
            <p className="text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed">
              GVCN: <strong>{teacher?.name || 'Cô Phương Anh'}</strong> · {teacher?.schoolName || 'Trường Tiểu học'} · Năm học {teacher?.academicYear || '2026-2027'}.
              Theo dõi quá trình rèn luyện, khen thưởng và học tập của các con mỗi ngày.
            </p>

            {/* Quick Filter: Select Child */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full appearance-none bg-white/15 hover:bg-white/20 border border-white/30 text-white rounded-2xl px-4 py-3 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all cursor-pointer backdrop-blur-md"
                >
                  <option value="" className="text-slate-900 bg-white">
                    ⭐ Chọn con của bạn để xem góc thi đua riêng ({totalStudents} học sinh)
                  </option>
                  {rankedStudents.map((s, idx) => (
                    <option key={s.id} value={s.id} className="text-slate-900 bg-white">
                      #{idx + 1} • {s.gender === 'Nam' ? '👦' : '👧'} {s.name} ({s.points} sao)
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                  ▼
                </div>
              </div>

              {selectedChildId && (
                <button
                  type="button"
                  onClick={() => setStudentReportModal(selectedChildId)}
                  className="px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FileText size={16} /> Xem phiếu thi đua
                </button>
              )}
            </div>
          </div>

          {/* Right Action: Teacher Switch */}
          <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleUnlockTeacher}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
              title="Dành cho Giáo viên chủ nhiệm khi cần nhập điểm hoặc chỉnh sửa"
            >
              <Lock size={14} className="text-amber-300" />
              <span>Đăng nhập Giáo viên (Mã PIN)</span>
            </button>
            <span className="text-[11px] text-indigo-300/80 font-medium">
              🔒 Thao tác cộng/trừ điểm đã được khóa bảo vệ
            </span>
          </div>
        </div>
      </div>

      {/* 2. SELECTED CHILD SPOTLIGHT (Góc học tập của con) */}
      {selectedStudent && (
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-amber-500/10 rounded-[32px] p-6 sm:p-8 border-2 border-purple-300/70 shadow-[0_12px_36px_rgba(124,58,237,0.08)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Student Info */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-pink-400 to-purple-600 shadow-md shrink-0">
                <img
                  src={getAvatarUrl(selectedStudent.avatarId, activeClass?.customAvatars)}
                  alt={selectedStudent.name}
                  className="w-full h-full rounded-[22px] object-cover bg-white ring-2 ring-white"
                />
                {studentRank && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black shadow-sm border border-white">
                    #{studentRank}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Góc rèn luyện của con
                  </span>
                  {studentGroup && (
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      👥 {studentGroup.name}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
                  {selectedStudent.name}
                </h2>
                {studentLevel && (
                  <p className="text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <span>Cấp độ: {studentLevel.name}</span>
                    <span>{studentLevel.icon}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs text-center">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Điểm sao
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                  <span>{selectedStudent.points}</span>
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs text-center">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Huy hiệu
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-600 mt-0.5 flex items-center justify-center gap-1">
                  <span>{studentBadges.length}</span>
                  <Award size={16} />
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs text-center">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Xếp hạng
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
                  #{studentRank || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Badges and Personal Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-purple-200/60">
            {/* Badges Showcase */}
            <div className="p-4 bg-white/90 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Award size={15} className="text-purple-600" />
                <span>Huy hiệu danh dự đã nhận ({studentBadges.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {studentBadges.length > 0 ? (
                  studentBadges.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setPreviewBadge({ badge: b, student: selectedStudent })}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer"
                      title="Bấm để xem chi tiết hoạt ảnh vinh danh"
                    >
                      <span className="text-base">{b.icon}</span>
                      <span>{b.name}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Con chưa có huy hiệu nào trong tuần này.</p>
                )}
              </div>
            </div>

            {/* Personal Recent Activity */}
            <div className="p-4 bg-white/90 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-amber-500" />
                  <span>Lời khen & ghi nhận gần nhất</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setStudentReportModal(selectedStudent.id)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  Xem toàn bộ sổ nề nếp →
                </button>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {studentRecentTransactions.length > 0 ? (
                  studentRecentTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0",
                          t.amount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {t.amount > 0 ? `+${t.amount}` : t.amount}
                        </span>
                        <span className="font-semibold text-slate-700 truncate">{t.reason}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{formatDate(t.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa có ghi nhận điểm gần đây.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLASS OVERVIEW METRICS (4 Read-Only Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white/95 rounded-[24px] p-5 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black shadow-xs shrink-0">
            📋
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Chuyên cần hôm nay
            </p>
            <h4 className="text-xl font-black text-slate-800 tracking-tight truncate">
              {attendanceRate}% Có mặt
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {presentCount}/{totalStudents} học sinh
            </p>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white/95 rounded-[24px] p-5 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-black shadow-xs shrink-0">
            ⭐
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Tổng sao nề nếp
            </p>
            <h4 className="text-xl font-black text-purple-700 tracking-tight truncate">
              {totalPoints} sao
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Tích lũy toàn lớp
            </p>
          </div>
        </div>

        {/* Total Badges */}
        <div className="bg-white/95 rounded-[24px] p-5 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-black shadow-xs shrink-0">
            🎖️
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Huy hiệu vinh danh
            </p>
            <h4 className="text-xl font-black text-slate-800 tracking-tight truncate">
              {totalBadgesAwarded} lượt
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Thành tích nổi bật
            </p>
          </div>
        </div>

        {/* Total Rewards */}
        <div className="bg-white/95 rounded-[24px] p-5 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl font-black shadow-xs shrink-0">
            🎁
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Phần thưởng đổi được
            </p>
            <h4 className="text-xl font-black text-slate-800 tracking-tight truncate">
              {totalRewardsRedeemed} món
            </h4>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Động viên kịp thời
            </p>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT (2/3 & 1/3 GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Đường đua tổ + Bảng sao thi đua */}
        <div className="lg:col-span-2 space-y-6">
          {/* Read-Only Group Race Track */}
          <TeamRaceTrack
            groups={activeClass.groups}
            students={activeClass.students}
            onViewDetails={() => onNavigateTab?.('groups')}
          />

          {/* Top Emulation Stars (Read Only - Zero Add/Minus Point Handlers) */}
          <TopEmulationStars
            topStudents={topStudents}
            totalStudents={totalStudents}
            onOpenAwardModal={() => {}}
            onNavigateTab={onNavigateTab}
            onAddPoint={() => {}}
            onMinusPoint={() => {}}
          />
        </div>

        {/* Right Column (1/3): Activity Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <ActivityTimeline
            transactions={activeClass.transactions || []}
            badges={activeClass.badges || []}
            rewardTransactions={activeClass.rewardTransactions || []}
            students={activeClass.students}
            badgeCatalog={badgeCatalog}
            rewardCatalog={rewardCatalog}
            onViewAll={() => onNavigateTab?.('history')}
          />

          {/* Parent Explanatory Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 rounded-[28px] p-5 sm:p-6 border border-purple-200/80 space-y-3 text-xs">
            <h3 className="font-black text-purple-900 flex items-center gap-1.5 text-sm">
              <HeartHandshake size={16} className="text-purple-600" />
              <span>Đồng hành cùng con</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Mỗi ngôi sao ⭐ đại diện cho một nỗ lực nhỏ của con: phát biểu bài, giúp đỡ bạn bè, giữ gìn vệ sinh, hay hoàn thành tốt bài tập.
            </p>
            <div className="p-3 bg-white rounded-xl border border-purple-100 text-slate-700 space-y-1">
              <p>💡 <strong>Lời khuyên:</strong> Hãy dành cho con một lời khen ngợi khi thấy con nhận được huy hiệu hoặc tăng thêm sao nề nếp nhé!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Celebration Preview Modal */}
      {previewBadge && (
        <BadgeCelebrationModal
          isOpen={Boolean(previewBadge)}
          onClose={() => setPreviewBadge(null)}
          badge={previewBadge.badge}
          student={previewBadge.student}
          currentClass={activeClass}
          teacher={teacher}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
}
