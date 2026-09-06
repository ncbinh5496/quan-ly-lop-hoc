import { useState, useMemo, useCallback } from 'react';
import { useStore, useActiveClass } from '../store';
import { QuickActionCard } from '../components/ui/QuickActionCard';
import { TeamRaceTrack } from '../components/ui/TeamRaceTrack';
import { ActivityTimeline } from '../components/ui/ActivityTimeline';
import { AttendanceModal } from '../components/modals/AttendanceModal';
import { AwardBadgeModal } from '../components/modals/AwardBadgeModal';
import { DashboardHero } from '../components/dashboard/DashboardHero';
import { DashboardStatsRow } from '../components/dashboard/DashboardStatsRow';
import { TopEmulationStars } from '../components/dashboard/TopEmulationStars';
import { useClassroomDate } from '../utils/useClassroomDate';
import { getRankedStudents, filterTransactionsByTime } from '../utils/scoreCalculator';

interface DashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export default function Dashboard({ onNavigateTab }: DashboardProps) {
  const teacher = useStore(state => state.teacher);
  const badgeCatalog = useStore(state => state.badges);
  const rewardCatalog = useStore(state => state.rewards);
  const setPointModal = useStore(state => state.setPointModal);
  const showToast = useStore(state => state.showToast);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const activeClass = useActiveClass();

  const todayStr = useClassroomDate();

  // Calculate comprehensive statistics
  const totalStudents = activeClass?.students.length || 0;
  const totalPoints = useMemo(() => {
    return activeClass ? activeClass.students.reduce((sum, s) => sum + s.points, 0) : 0;
  }, [activeClass?.students]);

  const totalBadgesAwarded = activeClass?.badges?.length || 0;
  
  // Weekly points estimate (or current positive transactions)
  const weeklyPoints = useMemo(() => {
    if (!activeClass) return 0;
    const recentTransactions = filterTransactionsByTime(activeClass.transactions || [], 'week');
    return recentTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [activeClass?.transactions, todayStr]);

  // Real-time Attendance Statistics
  const todayAttendance = useMemo(() => {
    return activeClass?.attendanceRecords?.find(r => r.date === todayStr);
  }, [activeClass?.attendanceRecords, todayStr]);

  const presentStudentsCount = todayAttendance
    ? (todayAttendance.presentCount + todayAttendance.lateCount)
    : 0;

  const attendanceRate = totalStudents > 0 
    ? Math.round((presentStudentsCount / totalStudents) * 100) 
    : 100;

  const attendanceTrend = todayAttendance
    ? (attendanceRate === 100 ? '100% Đầy đủ' : (attendanceRate >= 90 ? 'Chuyên cần' : 'Cần lưu ý'))
    : 'Chưa điểm danh';

  const attendanceSubValue = todayAttendance
    ? (todayAttendance.absentCount > 0
        ? `Vắng ${todayAttendance.absentCount} bạn · Đạt ${attendanceRate}%`
        : 'Cả lớp có mặt đầy đủ 100%')
    : 'Chưa có bản điểm danh hôm nay';

  // Top 4 students for "Ngôi sao sáng"
  const topStudents = useMemo(() => {
    return activeClass ? getRankedStudents(activeClass.students).slice(0, 4) : [];
  }, [activeClass?.students]);

  const handleQuickAddPoint = useCallback(() => {
    if (activeClass && activeClass.students.length > 0) {
      setPointModal({ studentId: activeClass.students[0].id, type: 'positive' });
    } else {
      showToast('Vui lòng thêm học sinh trước khi cộng điểm', 'info');
    }
  }, [activeClass, setPointModal, showToast]);

  const handleAddStudentPoint = useCallback((studentId: string) => {
    setPointModal({ studentId, type: 'positive' });
  }, [setPointModal]);

  const handleMinusStudentPoint = useCallback((studentId: string) => {
    setPointModal({ studentId, type: 'negative' });
  }, [setPointModal]);

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 shadow-sm max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mx-auto mb-4">
          🏫
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để bắt đầu quản lý.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. HERO DASHBOARD BANNER */}
      <DashboardHero
        teacher={teacher}
        activeClass={activeClass}
        weeklyPoints={weeklyPoints}
        totalBadgesAwarded={totalBadgesAwarded}
        onOpenAttendance={() => setIsAttendanceModalOpen(true)}
        onQuickAddPoint={handleQuickAddPoint}
      />

      {/* 2. QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Điểm danh"
          description="Cả lớp trong 30 giây"
          icon="📋"
          gradientClass="from-purple-500 to-indigo-500"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badgeText="Nhanh"
          onClick={() => setIsAttendanceModalOpen(true)}
        />

        <QuickActionCard
          title="Cộng điểm"
          description="Ghi nhận việc tốt"
          icon="⭐"
          gradientClass="from-pink-500 to-rose-500"
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
          badgeText="+ Sao"
          onClick={() => {
            if (activeClass.students.length > 0) {
              setPointModal({ studentId: activeClass.students[0].id, type: 'positive' });
            } else {
              showToast('Vui lòng thêm học sinh trước', 'info');
            }
          }}
        />

        <QuickActionCard
          title="Gọi ngẫu nhiên"
          description="Vui và công bằng"
          icon="🎲"
          gradientClass="from-amber-500 to-orange-500"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badgeText="Vòng quay"
          onClick={() => onNavigateTab?.('tools')}
        />

        <QuickActionCard
          title="Đổi thưởng"
          description="Khích lệ cố gắng"
          icon="🎁"
          gradientClass="from-emerald-500 to-teal-500"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badgeText="Cửa hàng"
          onClick={() => onNavigateTab?.('rewards')}
        />
      </div>

      {/* 3. STATISTIC CARDS */}
      <DashboardStatsRow
        activeClass={activeClass}
        totalStudents={totalStudents}
        presentStudentsCount={presentStudentsCount}
        attendanceSubValue={attendanceSubValue}
        attendanceTrend={attendanceTrend}
        totalPoints={totalPoints}
        weeklyPoints={weeklyPoints}
        onNavigateTab={onNavigateTab}
        onOpenAttendance={() => setIsAttendanceModalOpen(true)}
      />

      {/* 4. MAIN CONTENT (2/3 & 1/3 GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Đường đua 4 tổ + Ngôi sao sáng */}
        <div className="lg:col-span-2 space-y-6">
          <TeamRaceTrack
            groups={activeClass.groups}
            students={activeClass.students}
            onViewDetails={() => onNavigateTab?.('groups')}
            onQuickAddGroupPoints={(groupId) => {
              const group = activeClass.groups.find(g => g.id === groupId);
              showToast(`Đã chọn ${group?.name || 'Tổ'} để thi đua`);
              onNavigateTab?.('groups');
            }}
          />

          <TopEmulationStars
            topStudents={topStudents}
            totalStudents={totalStudents}
            groups={activeClass.groups}
            customAvatars={activeClass.customAvatars}
            onOpenAwardModal={() => setIsAwardModalOpen(true)}
            onNavigateTab={onNavigateTab}
            onAddPoint={handleAddStudentPoint}
            onMinusPoint={handleMinusStudentPoint}
          />
        </div>

        {/* Right Column (1/3): Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline
            transactions={activeClass.transactions || []}
            badges={activeClass.badges || []}
            rewardTransactions={activeClass.rewardTransactions || []}
            students={activeClass.students}
            badgeCatalog={badgeCatalog}
            rewardCatalog={rewardCatalog}
            onViewAll={() => onNavigateTab?.('history')}
          />
        </div>
      </div>

      {/* Modals */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />

      <AwardBadgeModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
      />
    </div>
  );
}

