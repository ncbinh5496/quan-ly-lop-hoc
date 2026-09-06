import React, { memo } from 'react';
import { Users, UserCheck, Star, Flame } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { ClassData } from '../../types';

interface DashboardStatsRowProps {
  activeClass: ClassData;
  totalStudents: number;
  presentStudentsCount: number;
  attendanceSubValue: string;
  attendanceTrend: string;
  totalPoints: number;
  weeklyPoints: number;
  onNavigateTab?: (tab: string) => void;
  onOpenAttendance: () => void;
}

export const DashboardStatsRow = memo(function DashboardStatsRow({
  activeClass,
  totalStudents,
  presentStudentsCount,
  attendanceSubValue,
  attendanceTrend,
  totalPoints,
  weeklyPoints,
  onNavigateTab,
  onOpenAttendance,
}: DashboardStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Sĩ số lớp"
        value={`${totalStudents} học sinh`}
        subValue={`${activeClass.groups.length} tổ đang hoạt động`}
        icon={Users}
        colorScheme="purple"
        trend="Đầy đủ"
        onClick={() => onNavigateTab?.('students')}
      />

      <StatCard
        label="Có mặt hôm nay"
        value={`${presentStudentsCount} / ${totalStudents} bạn`}
        subValue={attendanceSubValue}
        icon={UserCheck}
        colorScheme="emerald"
        trend={attendanceTrend}
        onClick={onOpenAttendance}
      />

      <StatCard
        label="Tổng điểm tích lũy"
        value={`${totalPoints} sao`}
        subValue={`+${weeklyPoints} sao trong tuần`}
        icon={Star}
        colorScheme="orange"
        trend="Top tuần"
        onClick={() => onNavigateTab?.('leaderboard')}
      />

      <StatCard
        label="Ngày đã điểm danh"
        value={`${activeClass.attendanceRecords?.length || 0} ngày`}
        subValue="Số ngày có bản điểm danh"
        icon={Flame}
        colorScheme="pink"
        trend="Đã ghi nhận"
        onClick={() => onNavigateTab?.('badges')}
      />
    </div>
  );
});

