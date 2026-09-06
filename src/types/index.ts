export type Gender = 'Nam' | 'Nữ';

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dob?: string;
  avatarId: string;
  groupId?: string;
  points: number; // Current points (total + - total - - rewards)
  totalPositivePoints: number;
  totalNegativePoints: number;
  status: 'active' | 'inactive';
  note?: string;
  badgeIds: string[];
}

export interface Group {
  leaderId?: string;
  icon?: string;
  color?: string;
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatarUrl?: string;
  schoolName: string;
  grade: string;
  subject: string;
  academicYear: string;
  homeroomClass: string;
}

export interface CustomAvatar {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export interface CustomRewardIcon {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export interface AttendanceRecord {
  rewardAmounts?: Record<string, number>;
  rewardEnabled?: boolean;
  id: string;
  date: string; // YYYY-MM-DD
  presentCount: number;
  lateCount: number;
  absentCount: number;
  totalStudents: number;
  studentStatuses: Record<string, 'present' | 'late' | 'excused' | 'unexcused'>;
  timestamp: number;
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
  groups: Group[];
  transactions: PointTransaction[];
  rewardTransactions: RewardTransaction[];
  badges: StudentBadge[];
  customAvatars?: CustomAvatar[];
  attendanceRecords?: AttendanceRecord[];
}

export interface PointTransaction {
  attendanceDate?: string;
  batchId?: string;
  id: string;
  studentId: string;
  classId: string;
  amount: number; // positive or negative
  reason: string;
  timestamp: number;
  teacherId: string;
}

export interface RewardTransaction {
  rewardName?: string;
  rewardIcon?: string;
  id: string;
  studentId: string;
  classId: string;
  rewardId: string;
  cost: number;
  timestamp: number;
}

export interface StudentBadge {
  badgeName?: string;
  badgeIcon?: string;
  id: string;
  studentId: string;
  classId: string;
  badgeId: string;
  timestamp: number;
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export interface Reward {
  id: string;
  icon: string;
  name: string;
  cost: number;
  isActive: boolean;
}

export interface Level {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export interface PointCriteria {
  id: string;
  reason: string;
  amount: number;
  type: 'positive' | 'negative';
  icon?: string;
}

export interface BackgroundConfig {
  type: 'preset-gradient' | 'custom-gradient' | 'solid' | 'image';
  presetGradientId?: string;
  customColor1?: string;
  customColor2?: string;
  gradientAngle?: number;
  solidColor?: string;
  imageUrl?: string;
  overlayOpacity?: number; // 0 to 80%
  blur?: number; // 0 to 10px
}

export interface AppState {
  archivedClasses: ClassData[];
  storageError: string | null;
  storageBlocked: boolean;
  appTitle?: string;
  appSlogan?: string;
  headerCoverUrl?: string;
  backgroundConfig?: BackgroundConfig;
  teacher: Teacher | null;
  classes: ClassData[];
  activeClassId: string | null;
  badges: Badge[];
  rewards: Reward[];
  levels: Level[];
  pointCriteria: PointCriteria[];
  soundEnabled: boolean;
  presentationMode: boolean;
  studentReportModal: string | null; // Student ID to view detailed report

  // Modal Actions
  setStudentReportModal: (studentId: string | null) => void;
  
  // Actions
  setAppBranding: (branding: { appTitle: string; appSlogan: string; headerCoverUrl?: string }) => void;
  setHeaderCoverUrl: (url: string) => void;
  setBackgroundConfig: (config: Partial<BackgroundConfig>) => void;
  setTeacher: (teacher: Teacher) => void;
  createClass: (name: string, defaultGroups?: boolean) => void;
  updateClass: (classId: string, name: string) => void;
  setActiveClass: (classId: string) => void;
  deleteClass: (classId: string) => void;
  
  addStudent: (student: Omit<Student, 'id' | 'points' | 'totalPositivePoints' | 'totalNegativePoints' | 'badgeIds'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addGroup: (name: string) => void;
  updateGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  assignStudentToGroup: (studentId: string, groupId: string | undefined) => void;
  batchApplyGroups: (groups: Group[], studentGroupMap: Record<string, string>) => void;
  
  addPoints: (studentId: string, amount: number, reason: string) => void;
  undoLastTransaction: () => void;
  
  // Avatar Actions
  addCustomAvatar: (classId: string, avatar: { name?: string; url: string }) => string;
  addMultipleCustomAvatars: (classId: string, avatars: Array<{ name?: string; url: string }>) => string[];
  updateCustomAvatar: (classId: string, avatarId: string, name: string) => void;
  deleteCustomAvatar: (classId: string, avatarId: string) => void;
  setStudentAvatar: (studentId: string, avatarId: string) => void;

  // Criteria Actions
  addPointCriteria: (criteria: Omit<PointCriteria, 'id'>) => void;
  updatePointCriteria: (id: string, data: Partial<PointCriteria>) => void;
  deletePointCriteria: (id: string) => void;
  resetPointCriteria: () => void;
  
  awardBadge: (studentId: string, badgeId: string) => void;
  addBadge: (badge: Omit<Badge, 'id'>) => void;
  updateBadge: (id: string, data: Partial<Badge>) => void;
  deleteBadge: (id: string) => void;
  resetBadges: () => void;
  redeemReward: (studentId: string, rewardId: string) => boolean;
  
  // Reward Actions
  customRewardIcons?: CustomRewardIcon[];
  addCustomRewardIcon: (icon: { name?: string; url: string }) => string;
  addMultipleCustomRewardIcons: (icons: Array<{ name?: string; url: string }>) => string[];
  updateCustomRewardIcon: (id: string, name: string) => void;
  deleteCustomRewardIcon: (id: string) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, data: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  resetRewards: () => void;
  
  importStudents: (
    students: Array<{ name: string; gender: Gender; avatarId: string; groupId?: string; groupName?: string }>,
    options?: { replace?: boolean; classId?: string }
  ) => void;
  saveAttendance: (classId: string, record: Omit<AttendanceRecord, 'id' | 'timestamp'>, rewardPoints?: boolean) => boolean;
  
  toggleSound: () => void;
  togglePresentationMode: () => void;
  
  // Modals
  pointModal: { studentId: string; type: 'positive' | 'negative' } | null;
  setPointModal: (modal: { studentId: string; type: 'positive' | 'negative' } | null) => void;

  toast: { message: string; type: 'success' | 'error' | 'info'; id: number } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Reset & Progress Management
  resetClassPoints: (classId?: string) => void;
  resetClassBadges: (classId?: string) => void;
  resetClassRewards: (classId?: string) => void;
  resetClassAllProgress: (classId?: string) => void;
  resetData: () => void;
  restoreData: (data: unknown) => boolean;
}

