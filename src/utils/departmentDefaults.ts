import { ClassData, Student, TeacherWorkspace } from '../types';
import { DEFAULT_BADGES, DEFAULT_LEVELS, DEFAULT_POINT_CRITERIA, DEFAULT_REWARDS } from './defaults';

const generateId = () => Math.random().toString(36).substring(2, 9);

const VIETNAMESE_FIRST_NAMES_MALE = [
  'Bảo Nam', 'Minh Khang', 'Tuấn Kiệt', 'Gia Bảo', 'Quốc Bảo', 
  'Hải Đăng', 'Hải Phong', 'Đức Huy', 'Duy Đạt', 'Minh Quân', 
  'Tuấn Anh', 'Thành Đạt', 'Hoàng Long', 'Quang Vinh', 'Hồng Phúc'
];

const VIETNAMESE_FIRST_NAMES_FEMALE = [
  'Thu Hà', 'Minh Châu', 'Thảo Vy', 'Khánh Linh', 'Ngọc Diễm', 
  'Minh Anh', 'Ngọc Linh', 'Khánh Huyền', 'Hà My', 'Kim Oanh', 
  'Bảo Ngọc', 'Phương Linh', 'Thùy Dương', 'Tuyết Mai', 'Diệu Anh'
];

const SURNAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Đặng', 'Hà'];

export function generateClassStudents(classIndex: number, className: string, count: number = 30): Student[] {
  const students: Student[] = [];
  const boysCount = Math.floor(count / 2);
  
  for (let i = 0; i < count; i++) {
    const isMale = i < boysCount;
    const surname = SURNAMES[(i + classIndex) % SURNAMES.length];
    const firstName = isMale 
      ? VIETNAMESE_FIRST_NAMES_MALE[i % VIETNAMESE_FIRST_NAMES_MALE.length]
      : VIETNAMESE_FIRST_NAMES_FEMALE[(i - boysCount) % VIETNAMESE_FIRST_NAMES_FEMALE.length];
    
    const fullName = `${surname} ${firstName}`;
    const avatarId = isMale ? `boy-${(i % 10) + 1}` : `girl-${(i % 10) + 1}`;
    const groupId = `g${(i % 4) + 1}`;
    
    // Seed initial realistic points between 8 and 35
    const basePts = 10 + ((i * 3 + classIndex * 5) % 25);
    const badgeCount = Math.floor(basePts / 8);
    const sampleBadges = ['b1', 'b2', 'b3', 'b4', 'b6', 'b10'].slice(0, badgeCount);

    students.push({
      id: `std_${classIndex}_${i + 1}_${generateId()}`,
      name: fullName,
      gender: isMale ? 'Nam' : 'Nữ',
      avatarId,
      groupId,
      points: basePts,
      totalPositivePoints: basePts,
      totalNegativePoints: 0,
      status: 'active',
      badgeIds: sampleBadges,
    });
  }

  return students;
}

export interface DepartmentTeacherPreset {
  id: string;
  name: string;
  homeroomClass: string;
  pin: string;
  grade: string;
  subject: string;
  appTitle: string;
  appSlogan: string;
  isDepartmentLeader?: boolean;
  themeGradient: string;
}

export const DEPARTMENT_10_TEACHERS: DepartmentTeacherPreset[] = [
  {
    id: 'ws_teacher_1',
    name: 'Cô Nguyễn Thu Hà',
    homeroomClass: '2A1',
    pin: '2011',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'HÀNH TRÌNH SAO SÁNG - LỚP 2A1',
    appSlogan: 'Mỗi ngày đến trường là một ngày vui',
    themeGradient: 'sunset',
  },
  {
    id: 'ws_teacher_2',
    name: 'Thầy Trần Bảo Nam',
    homeroomClass: '2A2',
    pin: '2012',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'CHINH PHỤC TRI THỨC - LỚP 2A2',
    appSlogan: 'Tự tin, đoàn kết, chăm ngoan',
    themeGradient: 'ocean',
  },
  {
    id: 'ws_teacher_3',
    name: 'Cô Lê Minh Châu',
    homeroomClass: '2A3',
    pin: '2013',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'VƯƠN CAO ƯỚC MƠ - LỚP 2A3',
    appSlogan: 'Học mà chơi, chơi mà học',
    themeGradient: 'emerald',
  },
  {
    id: 'ws_teacher_4',
    name: 'Thầy Hoàng Tuấn Kiệt',
    homeroomClass: '2A4',
    pin: '2014',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'ĐOÀN KẾT TỎA SÁNG - LỚP 2A4',
    appSlogan: 'Lễ phép, kỷ luật, yêu thương',
    themeGradient: 'royal',
  },
  {
    id: 'ws_teacher_5',
    name: 'Cô Vũ Thảo Vy',
    homeroomClass: '2A5',
    pin: '2015',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'NGÔI SAO HY VỌNG - LỚP 2A5',
    appSlogan: 'Sáng tạo và bứt phá mỗi ngày',
    themeGradient: 'rose',
  },
  {
    id: 'ws_teacher_6',
    name: 'Cô Phương Anh',
    homeroomClass: '2A6',
    pin: '1234',
    grade: 'Khối 2',
    subject: 'Khối trưởng - Giáo viên chủ nhiệm',
    appTitle: 'HÀNH TRÌNH CHINH PHỤC VINH QUANG - 2A6',
    appSlogan: 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
    isDepartmentLeader: true,
    themeGradient: 'sunset',
  },
  {
    id: 'ws_teacher_7',
    name: 'Thầy Đỗ Hải Phong',
    homeroomClass: '2A7',
    pin: '2017',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'CHĂM NGOAN HỌC GIỎI - LỚP 2A7',
    appSlogan: 'Nỗ lực hôm nay, thành công mai sau',
    themeGradient: 'amber',
  },
  {
    id: 'ws_teacher_8',
    name: 'Cô Bùi Khánh Linh',
    homeroomClass: '2A8',
    pin: '2018',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'TỰ HÀO TIỂU HỌC - LỚP 2A8',
    appSlogan: 'Chăm học, chăm làm, vâng lời thầy cô',
    themeGradient: 'ocean',
  },
  {
    id: 'ws_teacher_9',
    name: 'Thầy Phạm Quốc Bảo',
    homeroomClass: '2A9',
    pin: '2019',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'VƯỜN HOA THI ĐUA - LỚP 2A9',
    appSlogan: 'Năng động, tự tin và tỏa sáng',
    themeGradient: 'emerald',
  },
  {
    id: 'ws_teacher_10',
    name: 'Cô Đặng Kim Oanh',
    homeroomClass: '2A10',
    pin: '2020',
    grade: 'Khối 2',
    subject: 'Giáo viên chủ nhiệm',
    appTitle: 'BÚP MĂNG NON - LỚP 2A10',
    appSlogan: 'Vâng lời Bác dạy, tiến bước lên Đoàn',
    themeGradient: 'royal',
  },
];

export function createDepartment10Workspaces(schoolName: string = 'Trường Tiểu học Hùng Vương'): TeacherWorkspace[] {
  return DEPARTMENT_10_TEACHERS.map((teacherPreset, index) => {
    const classId = `class_dept_${index + 1}_${generateId()}`;
    const students = generateClassStudents(index + 1, teacherPreset.homeroomClass, 30);
    
    const classData: ClassData = {
      id: classId,
      name: teacherPreset.homeroomClass,
      students,
      groups: [
        { id: 'g1', name: 'Tổ 1 (Sơn Ca)' },
        { id: 'g2', name: 'Tổ 2 (Họa Mi)' },
        { id: 'g3', name: 'Tổ 3 (Vành Khuyên)' },
        { id: 'g4', name: 'Tổ 4 (Đại Bàng)' },
      ],
      transactions: [],
      rewardTransactions: [],
      badges: [],
    };

    return {
      id: teacherPreset.id,
      name: teacherPreset.name,
      avatarUrl: '',
      schoolName,
      grade: teacherPreset.grade,
      subject: teacherPreset.subject,
      academicYear: '2026-2027',
      homeroomClass: teacherPreset.homeroomClass,
      pin: teacherPreset.pin,
      appTitle: teacherPreset.appTitle,
      appSlogan: teacherPreset.appSlogan,
      headerCoverUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
      isDepartmentLeader: teacherPreset.isDepartmentLeader || false,
      departmentName: 'Tổ Chuyên Môn Khối 2',
      backgroundConfig: {
        type: 'preset-gradient',
        presetGradientId: teacherPreset.themeGradient || 'sunset',
        customColor1: '#6366f1',
        customColor2: '#ec4899',
        gradientAngle: 135,
        solidColor: '#1e1b4b',
        imageUrl: '',
        overlayOpacity: 20,
        blur: 0,
      },
      classes: [classData],
      activeClassId: classId,
      badges: DEFAULT_BADGES,
      rewards: DEFAULT_REWARDS,
      customRewardIcons: [],
      levels: DEFAULT_LEVELS,
      pointCriteria: DEFAULT_POINT_CRITERIA,
      createdAt: Date.now() + index * 10,
      updatedAt: Date.now(),
    };
  });
}
