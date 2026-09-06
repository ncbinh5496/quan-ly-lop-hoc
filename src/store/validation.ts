import { z } from 'zod';
import type { AppState } from '../types';

const id = z.string().min(1);
const number = z.number().finite();
const status = z.enum(['present', 'late', 'excused', 'unexcused']);
const image = z.string();
const student = z.object({
  id, name: z.string().min(1), gender: z.enum(['Nam', 'Nữ']), dob: z.string().optional(),
  avatarId: image, groupId: id.optional(), points: number,
  totalPositivePoints: number.nonnegative(), totalNegativePoints: number.nonnegative(),
  status: z.enum(['active', 'inactive']).default('active'), note: z.string().optional(), badgeIds: z.array(id),
});
const group = z.object({ id, name: z.string(), leaderId: id.optional(), icon: z.string().optional(), color: z.string().optional() });
const avatar = z.object({ id, name: z.string(), url: image, createdAt: number });
const transaction = z.object({
  id, studentId: id, classId: id, amount: number, reason: z.string(), timestamp: number, teacherId: id,
  attendanceDate: z.string().optional(), batchId: id.optional(),
});
const badge = z.object({ id, name: z.string(), description: z.string(), icon: image });
const reward = z.object({ id, name: z.string(), icon: image, cost: number.positive(), isActive: z.boolean().default(true) });
const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Ngày không hợp lệ');
const attendance = z.object({
  id, date: dateKey, presentCount: number.nonnegative().int(), lateCount: number.nonnegative().int(),
  absentCount: number.nonnegative().int(), totalStudents: number.nonnegative().int(),
  studentStatuses: z.record(id, status), timestamp: number,
  rewardAmounts: z.record(id, number.nonnegative()).optional(), rewardEnabled: z.boolean().optional(),
});
const classSchema = z.object({
  id, name: z.string(), students: z.array(student), groups: z.array(group), transactions: z.array(transaction),
  rewardTransactions: z.array(z.object({ id, studentId: id, classId: id, rewardId: id, cost: number.positive(), timestamp: number, rewardName: z.string().optional(), rewardIcon: image.optional() })),
  badges: z.array(z.object({ id, studentId: id, classId: id, badgeId: id, timestamp: number, badgeName: z.string().optional(), badgeIcon: image.optional() })),
  customAvatars: z.array(avatar).default([]), attendanceRecords: z.array(attendance).default([]),
}).superRefine((value, ctx) => {
  for (const key of ['students', 'groups', 'transactions', 'badges', 'rewardTransactions', 'customAvatars', 'attendanceRecords'] as const) {
    const ids = value[key].map(item => item.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: [key], message: 'ID trùng lặp' });
  }
});
const schema = z.object({
  appTitle: z.string().optional(), appSlogan: z.string().optional(), headerCoverUrl: image.optional(),
  backgroundConfig: z.object({
    type: z.enum(['preset-gradient','custom-gradient','solid','image']), presetGradientId: z.string().optional(),
    customColor1: z.string().optional(), customColor2: z.string().optional(), gradientAngle: number.optional(),
    solidColor: z.string().optional(), imageUrl: image.optional(), overlayOpacity: number.min(0).max(100).optional(), blur: number.min(0).max(100).optional(),
  }).optional(),
  teacher: z.object({ id, name: z.string(), avatarUrl: image.optional(), schoolName: z.string(), grade: z.string(), subject: z.string(), academicYear: z.string(), homeroomClass: z.string() }).nullable(),
  classes: z.array(classSchema).min(1), activeClassId: id.nullable(), archivedClasses: z.array(classSchema).default([]),
  badges: z.array(badge), rewards: z.array(reward), customRewardIcons: z.array(avatar).default([]),
  levels: z.array(z.object({ id, name: z.string(), minPoints: number, maxPoints: number, icon: z.string(), color: z.string() })).min(1),
  pointCriteria: z.array(z.object({ id, reason: z.string(), amount: number, type: z.enum(['positive','negative']), icon: z.string().optional() })),
  soundEnabled: z.boolean(),
});
export const durableKeys = ['appTitle','appSlogan','headerCoverUrl','backgroundConfig','teacher','classes','activeClassId','archivedClasses','badges','rewards','customRewardIcons','levels','pointCriteria','soundEnabled'] as const;
export type SavedState = Pick<AppState, typeof durableKeys[number]>;
export function selectSavedState(state: AppState): SavedState {
  return Object.fromEntries(durableKeys.map(key => [key, state[key]])) as SavedState;
}
export function validateSavedState(value: unknown): SavedState {
  const parsed = schema.parse(value);
  const active = parsed.classes.find(c => c.id === parsed.activeClassId) || parsed.classes[0];
  const archived = [...parsed.archivedClasses, ...parsed.classes.filter(c => c !== active)];
  // Legacy additional classes remain in backups; the UI manages only the active class.
  const ids = [active.id, ...archived.map(c => c.id)];
  if (new Set(ids).size !== ids.length) throw new Error('ID lớp trong bản sao lưu bị trùng.');
  const levels = [...parsed.levels].sort((a,b) => a.minPoints - b.minPoints);
  if (levels.some((l,i) => l.maxPoints < l.minPoints || (i > 0 && l.minPoints <= levels[i-1].maxPoints))) throw new Error('Khoảng điểm cấp độ không hợp lệ.');
  return { ...parsed, classes: [active], activeClassId: active.id, archivedClasses: archived, levels } as SavedState;
}
export function parseBackup(raw: string): SavedState {
  const envelope = JSON.parse(raw);
  if (!envelope || !Number.isInteger(envelope.version ?? 0) || (envelope.version ?? 0) < 0 || (envelope.version ?? 0) > 1) throw new Error('Phiên bản sao lưu chưa được hỗ trợ.');
  return validateSavedState(envelope.state);
}
export function encodeBackup(state: AppState): string {
  return JSON.stringify({ state: selectSavedState(state), version: 1 });
}
