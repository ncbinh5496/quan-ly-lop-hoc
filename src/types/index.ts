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
  id: string;
  studentId: string;
  classId: string;
  amount: number; // positive or negative
  reason: string;
  timestamp: number;
  teacherId: string;
}

export interface RewardTransaction {
  id: string;
  studentId: string;
  classId: string;
  rewardId: string;
  cost: number;
  timestamp: number;
}

export interface StudentBadge {
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

export interface TeacherWorkspace {
  id: string; // e.g. 'ws_teacher_1', 'ws_teacher_2'
  name: string; // e.g. 'Cô Phương Anh', 'Thầy Minh Đức'
  avatarUrl?: string;
  schoolName: string;
  grade: string;
  subject: string;
  academicYear: string;
  homeroomClass: string;
  pin: string; // e.g. '1234'
  appTitle?: string;
  appSlogan?: string;
  headerCoverUrl?: string;
  backgroundConfig?: BackgroundConfig;
  isDepartmentLeader?: boolean;
  departmentName?: string;
  classes: ClassData[];
  activeClassId: string | null;
  badges?: Badge[];
  rewards?: Reward[];
  customRewardIcons?: CustomRewardIcon[];
  levels?: Level[];
  pointCriteria?: PointCriteria[];
  createdAt?: number;
  updatedAt?: number;
}

export interface DepartmentInfo {
  name: string; // e.g. 'Tổ Chuyên Môn Khối 2'
  schoolName: string;
  leaderName: string; // e.g. 'Cô Phương Anh'
  leaderPin: string; // e.g. '1234'
  academicYear: string;
}

export interface AppState {
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
  isCloudSynced?: boolean;

  // Multi-Teacher Workspaces & Department
  workspaces: TeacherWorkspace[];
  activeWorkspaceId: string;
  workspaceModal: boolean;
  departmentModal: boolean;
  departmentInfo?: DepartmentInfo;
  
  // Security & Parent Portal Role
  userRole: 'teacher' | 'parent';
  teacherPin: string; // Default '1234'
  isTeacherUnlocked: boolean;
  selectedParentStudentId?: string | null;
  studentReportModal: string | null; // Student ID to view detailed report
  pinAuthModal: { isOpen: boolean; title?: string; onSuccess?: () => void } | null;

  // Workspace & Department Actions
  setWorkspaceModal: (isOpen: boolean) => void;
  setDepartmentModal: (isOpen: boolean) => void;
  setDepartmentInfo: (info: Partial<DepartmentInfo>) => void;
  syncStandardToAllWorkspaces: () => void;
  initializeDepartment10Classes: () => void;
  createWorkspace: (data: Partial<TeacherWorkspace>, options?: { copyCurrentTemplates?: boolean; addDemoClass?: boolean }) => string;
  switchWorkspace: (workspaceId: string, bypassPin?: boolean) => boolean;
  updateWorkspace: (workspaceId: string, data: Partial<TeacherWorkspace>) => void;
  deleteWorkspace: (workspaceId: string) => void;

  // Role Actions
  setUserRole: (role: 'teacher' | 'parent') => void;
  setTeacherPin: (pin: string) => void;
  unlockTeacher: (pin: string) => boolean;
  lockTeacher: () => void;
  setSelectedParentStudentId: (studentId: string | null) => void;
  setStudentReportModal: (studentId: string | null) => void;
  setPinAuthModal: (modal: { isOpen: boolean; title?: string; onSuccess?: () => void } | null) => void;
  
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
  redeemReward: (studentId: string, rewardId: string) => void;
  
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
  
  importStudents: (students: Array<{ name: string; gender: Gender; avatarId: string; groupId?: string }>) => void;
  saveAttendance: (classId: string, record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  
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
  restoreData: (data: Record<string, unknown>) => void;
}
