import { periodStart } from './dates';
import { Student, ClassData, PointTransaction } from '../types';

/**
 * Filter point transactions by time window
 */
export function filterTransactionsByTime(
  transactions: PointTransaction[],
  period: 'today' | 'week' | 'month' | 'all'
): PointTransaction[] {
  if (!transactions || transactions.length === 0) return [];
  if (period === 'all') return transactions;

  const now = new Date();
  const startTimestamp = periodStart(period, now);
  return transactions.filter(t => t.timestamp >= startTimestamp && t.timestamp <= now.getTime());
}

/**
 * Calculate net score for a student within a specific period
 */
export function calculateStudentPeriodScore(
  studentId: string,
  transactions: PointTransaction[],
  period: 'today' | 'week' | 'month' | 'all'
): number {
  const filtered = filterTransactionsByTime(transactions, period);
  return filtered
    .filter(t => t.studentId === studentId)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get sorted students for Leaderboard & Dashboard ranking
 */
export function getRankedStudents(
  students: Student[],
  transactions: PointTransaction[] = [],
  period: 'today' | 'week' | 'month' | 'all' = 'all'
): (Student & { periodScore?: number })[] {
  if (!students || students.length === 0) return [];

  if (period === 'all') {
    return [...students].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return (b.totalPositivePoints || 0) - (a.totalPositivePoints || 0);
    });
  }

  const periodScores: Record<string, number> = {};
  for (const tx of filterTransactionsByTime(transactions, period)) periodScores[tx.studentId] = (periodScores[tx.studentId] || 0) + tx.amount;

  return [...students]
    .map(s => ({
      ...s,
      periodScore: periodScores[s.id] || 0,
    }))
    .sort((a, b) => {
      const diff = (b.periodScore || 0) - (a.periodScore || 0);
      if (diff !== 0) return diff;
      return b.points - a.points;
    });
}

export interface GroupScoreStat {
  groupName: string;
  totalPoints: number;
  positivePoints: number;
  negativePoints: number;
  memberCount: number;
  averagePoints: number;
  members: Student[];
}

/**
 * Calculate detailed metrics for class groups/teams
 */
export function calculateGroupStats(
  activeClass: ClassData | undefined,
  period: 'today' | 'week' | 'month' | 'all' = 'all'
): GroupScoreStat[] {
  if (!activeClass || !activeClass.groups || activeClass.groups.length === 0) {
    return [];
  }

  const filteredTransactions = filterTransactionsByTime(activeClass.transactions || [], period);

  return activeClass.groups.map(group => {
    const members = activeClass.students.filter(s => s.groupId === group.id);
    const memberIds = new Set(members.map(m => m.id));

    let totalPoints = 0;
    let positivePoints = 0;
    let negativePoints = 0;

    if (period === 'all') {
      totalPoints = members.reduce((sum, m) => sum + m.points, 0);
      positivePoints = members.reduce((sum, m) => sum + (m.totalPositivePoints || 0), 0);
      negativePoints = members.reduce((sum, m) => sum + (m.totalNegativePoints || 0), 0);
    } else {
      const groupTransactions = filteredTransactions.filter(t => memberIds.has(t.studentId));
      totalPoints = groupTransactions.reduce((sum, t) => sum + t.amount, 0);
      positivePoints = groupTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      negativePoints = groupTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }

    const memberCount = members.length;
    const averagePoints = memberCount > 0 ? Math.round((totalPoints / memberCount) * 10) / 10 : 0;

    return {
      groupName: group.name,
      totalPoints,
      positivePoints,
      negativePoints,
      memberCount,
      averagePoints,
      members,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
}

