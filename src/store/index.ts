import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ClassData, DepartmentInfo, Student, Teacher, TeacherWorkspace } from '../types';
import { DEFAULT_BADGES, DEFAULT_LEVELS, DEFAULT_POINT_CRITERIA, DEFAULT_REWARDS, DEMO_STUDENTS } from '../utils/defaults';
import { createDepartment10Workspaces } from '../utils/departmentDefaults';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultWorkspaces = createDepartment10Workspaces('Trường Tiểu học Hùng Vương');
const initialWorkspace = defaultWorkspaces.find(w => w.id === 'ws_teacher_6') || defaultWorkspaces[0];
const initialClass = initialWorkspace.classes[0];

// Security Helper to guard state mutation when in Parent Mode
const isParentRoleBlocked = (
  get: () => AppState, 
  set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void,
  actionName: string = 'thực hiện thao tác này'
): boolean => {
  const state = get();
  if (state.userRole === 'parent') {
    state.showToast(`Chế độ Phụ huynh chỉ đọc. Vui lòng nhập mã PIN Giáo viên để ${actionName}.`, 'error');
    state.setPinAuthModal({
      isOpen: true,
      title: `Yêu cầu mã PIN Giáo viên để ${actionName}`,
      onSuccess: () => {
        set({ userRole: 'teacher', isTeacherUnlocked: true });
        state.showToast('Đã mở khóa quyền Giáo viên chủ nhiệm thành công!', 'success');
      }
    });
    return true; // blocked
  }
  return false; // allowed
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      appTitle: 'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
      appSlogan: 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
      headerCoverUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
      backgroundConfig: {
        type: 'preset-gradient',
        presetGradientId: 'sunset',
        customColor1: '#6366f1',
        customColor2: '#ec4899',
        gradientAngle: 135,
        solidColor: '#1e1b4b',
        imageUrl: '',
        overlayOpacity: 20,
        blur: 0,
      },
      teacher: {
        id: initialWorkspace.id,
        name: initialWorkspace.name,
        avatarUrl: initialWorkspace.avatarUrl,
        schoolName: initialWorkspace.schoolName,
        grade: initialWorkspace.grade,
        subject: initialWorkspace.subject,
        academicYear: initialWorkspace.academicYear,
        homeroomClass: initialWorkspace.homeroomClass,
      },
      classes: initialWorkspace.classes,
      activeClassId: initialClass.id,
      badges: initialWorkspace.badges || DEFAULT_BADGES,
      rewards: initialWorkspace.rewards || DEFAULT_REWARDS,
      customRewardIcons: [],
      levels: initialWorkspace.levels || DEFAULT_LEVELS,
      pointCriteria: initialWorkspace.pointCriteria || DEFAULT_POINT_CRITERIA,
      soundEnabled: true,
      presentationMode: false,
      isCloudSynced: false,
      pointModal: null,
      toast: null,

      // Multi-Teacher Workspaces & Department
      workspaces: defaultWorkspaces,
      activeWorkspaceId: initialWorkspace.id,
      workspaceModal: false,
      departmentModal: false,
      departmentInfo: {
        name: 'Tổ Chuyên Môn Khối 2',
        schoolName: 'Trường Tiểu học Hùng Vương',
        leaderName: 'Cô Phương Anh (Lớp 2A6)',
        leaderPin: '1234',
        academicYear: '2026-2027',
      },

      // Security & Parent Portal
      userRole: typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).get('role') === 'parent' || 
        new URLSearchParams(window.location.search).get('mode') === 'parent' || 
        new URLSearchParams(window.location.search).get('phuhuynh') === '1'
      ) ? 'parent' : 'teacher',
      teacherPin: initialWorkspace.pin || '1234',
      isTeacherUnlocked: false,
      selectedParentStudentId: null,
      studentReportModal: null,
      pinAuthModal: null,

      // Workspace & Department Actions
      setWorkspaceModal: (isOpen) => set({ workspaceModal: isOpen }),
      setDepartmentModal: (isOpen) => set({ departmentModal: isOpen }),
      setDepartmentInfo: (info) => set((state) => ({
        departmentInfo: {
          name: info.name || state.departmentInfo?.name || 'Tổ Chuyên Môn Khối 2',
          schoolName: info.schoolName || state.departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương',
          leaderName: info.leaderName || state.departmentInfo?.leaderName || 'Cô Phương Anh (Lớp 2A6)',
          leaderPin: info.leaderPin || state.departmentInfo?.leaderPin || '1234',
          academicYear: info.academicYear || state.departmentInfo?.academicYear || '2026-2027',
        }
      })),

      syncStandardToAllWorkspaces: () => {
        if (isParentRoleBlocked(get, set, 'đồng bộ quy chuẩn cấp Tổ')) return;
        const state = get();
        const currentBadges = state.badges;
        const currentRewards = state.rewards;
        const currentLevels = state.levels;
        const currentPointCriteria = state.pointCriteria;
        const currentCustomRewardIcons = state.customRewardIcons || [];

        const updatedWorkspaces = (state.workspaces || []).map(ws => ({
          ...ws,
          badges: currentBadges,
          rewards: currentRewards,
          levels: currentLevels,
          pointCriteria: currentPointCriteria,
          customRewardIcons: currentCustomRewardIcons,
          updatedAt: Date.now(),
        }));

        set({ workspaces: updatedWorkspaces });
        state.showToast(`Đã đồng bộ quy chuẩn tiêu chí & phần thưởng sang toàn bộ ${updatedWorkspaces.length} lớp trong Tổ!`, 'success');
      },

      initializeDepartment10Classes: () => {
        if (isParentRoleBlocked(get, set, 'khởi tạo lại dữ liệu 10 lớp cấp Tổ')) return;
        const state = get();
        const fresh10 = createDepartment10Workspaces(state.departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương');
        const activeWs = fresh10.find(w => w.id === state.activeWorkspaceId) || fresh10[0];
        
        set({
          workspaces: fresh10,
          activeWorkspaceId: activeWs.id,
          teacher: {
            id: activeWs.id,
            name: activeWs.name,
            avatarUrl: activeWs.avatarUrl,
            schoolName: activeWs.schoolName,
            grade: activeWs.grade,
            subject: activeWs.subject,
            academicYear: activeWs.academicYear,
            homeroomClass: activeWs.homeroomClass,
          },
          classes: activeWs.classes,
          activeClassId: activeWs.classes[0]?.id || null,
          teacherPin: activeWs.pin,
          appTitle: activeWs.appTitle,
          appSlogan: activeWs.appSlogan,
          headerCoverUrl: activeWs.headerCoverUrl,
          backgroundConfig: activeWs.backgroundConfig,
        });

        state.showToast(`Đã thiết lập chuẩn hóa 10 lớp Tổ Khối 2 với đầy đủ 300 học sinh và mã PIN riêng!`, 'success');
      },

      createWorkspace: (data, options = {}) => {
        const currentWorkspaces = get().workspaces || [];
        const newId = `ws_teacher_${Date.now()}`;
        const teacherName = data.name?.trim() || 'Giáo viên mới';
        const homeroomClass = data.homeroomClass?.trim() || 'Lớp mới';
        
        let newClass: ClassData;
        if (options.addDemoClass) {
          newClass = {
            id: generateId(),
            name: homeroomClass,
            students: [
              { id: generateId(), name: 'Nguyễn Văn An', gender: 'Nam', avatarId: 'boy-1', points: 10, totalPositivePoints: 10, totalNegativePoints: 0, status: 'active', badgeIds: [] },
              { id: generateId(), name: 'Trần Thị Bình', gender: 'Nữ', avatarId: 'girl-1', points: 12, totalPositivePoints: 12, totalNegativePoints: 0, status: 'active', badgeIds: [] },
              { id: generateId(), name: 'Lê Minh Châu', gender: 'Nữ', avatarId: 'girl-2', points: 8, totalPositivePoints: 8, totalNegativePoints: 0, status: 'active', badgeIds: [] },
            ],
            groups: [
              { id: generateId(), name: 'Tổ 1' },
              { id: generateId(), name: 'Tổ 2' },
              { id: generateId(), name: 'Tổ 3' },
              { id: generateId(), name: 'Tổ 4' },
            ],
            transactions: [],
            rewardTransactions: [],
            badges: [],
          };
        } else {
          newClass = {
            id: generateId(),
            name: homeroomClass,
            students: [],
            groups: [
              { id: generateId(), name: 'Tổ 1' },
              { id: generateId(), name: 'Tổ 2' },
              { id: generateId(), name: 'Tổ 3' },
              { id: generateId(), name: 'Tổ 4' },
            ],
            transactions: [],
            rewardTransactions: [],
            badges: [],
          };
        }

        const newWorkspace: TeacherWorkspace = {
          id: newId,
          name: teacherName,
          avatarUrl: data.avatarUrl || '',
          schoolName: data.schoolName?.trim() || 'Trường Tiểu học',
          grade: data.grade?.trim() || 'Khối Tiểu học',
          subject: data.subject?.trim() || 'Giáo viên chủ nhiệm',
          academicYear: data.academicYear?.trim() || '2026-2027',
          homeroomClass: homeroomClass,
          pin: data.pin?.trim() || '1234',
          appTitle: data.appTitle || `HÀNH TRÌNH THI ĐUA - ${homeroomClass.toUpperCase()}`,
          appSlogan: data.appSlogan || 'Chăm ngoan, sáng tạo, tự tin tiến bước',
          headerCoverUrl: data.headerCoverUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
          backgroundConfig: data.backgroundConfig || {
            type: 'preset-gradient',
            presetGradientId: 'sunset',
            customColor1: '#6366f1',
            customColor2: '#ec4899',
            gradientAngle: 135,
            solidColor: '#1e1b4b',
            imageUrl: '',
            overlayOpacity: 20,
            blur: 0,
          },
          classes: [newClass],
          activeClassId: newClass.id,
          badges: options.copyCurrentTemplates ? get().badges : DEFAULT_BADGES,
          rewards: options.copyCurrentTemplates ? get().rewards : DEFAULT_REWARDS,
          customRewardIcons: options.copyCurrentTemplates ? get().customRewardIcons : [],
          levels: options.copyCurrentTemplates ? get().levels : DEFAULT_LEVELS,
          pointCriteria: options.copyCurrentTemplates ? get().pointCriteria : DEFAULT_POINT_CRITERIA,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const updatedWorkspaces = [...currentWorkspaces, newWorkspace];
        set({
          workspaces: updatedWorkspaces,
        });

        // Switch immediately to new workspace
        get().switchWorkspace(newId, true);
        get().showToast(`Đã tạo không gian làm việc mới cho ${teacherName}!`, 'success');
        return newId;
      },

      switchWorkspace: (workspaceId, bypassPin = false) => {
        const state = get();
        const currentWorkspaces = state.workspaces && state.workspaces.length > 0 ? state.workspaces : defaultWorkspaces;
        
        // Save current active state into current workspace in memory
        const currentWsId = state.activeWorkspaceId;
        const currentSavedWorkspaces = currentWorkspaces.map(ws => {
          if (ws.id === currentWsId) {
            return {
              ...ws,
              name: state.teacher?.name || ws.name,
              avatarUrl: state.teacher?.avatarUrl,
              schoolName: state.teacher?.schoolName || ws.schoolName,
              grade: state.teacher?.grade || ws.grade,
              subject: state.teacher?.subject || ws.subject,
              academicYear: state.teacher?.academicYear || ws.academicYear,
              homeroomClass: state.teacher?.homeroomClass || ws.homeroomClass,
              pin: state.teacherPin,
              appTitle: state.appTitle,
              appSlogan: state.appSlogan,
              headerCoverUrl: state.headerCoverUrl,
              backgroundConfig: state.backgroundConfig,
              classes: state.classes,
              activeClassId: state.activeClassId,
              badges: state.badges,
              rewards: state.rewards,
              customRewardIcons: state.customRewardIcons,
              levels: state.levels,
              pointCriteria: state.pointCriteria,
              updatedAt: Date.now(),
            };
          }
          return ws;
        });

        const targetWs = currentSavedWorkspaces.find(ws => ws.id === workspaceId);
        if (!targetWs) {
          state.showToast('Không tìm thấy không gian Giáo viên này', 'error');
          return false;
        }

        const targetTeacher: Teacher = {
          id: targetWs.id,
          name: targetWs.name,
          avatarUrl: targetWs.avatarUrl,
          schoolName: targetWs.schoolName,
          grade: targetWs.grade,
          subject: targetWs.subject,
          academicYear: targetWs.academicYear,
          homeroomClass: targetWs.homeroomClass,
        };

        // Guarantee valid classes for the workspace
        let targetClasses = targetWs.classes;
        if (!targetClasses || targetClasses.length === 0) {
          const freshClass: ClassData = {
            id: generateId(),
            name: targetWs.homeroomClass || 'Lớp mới',
            students: [],
            groups: [
              { id: 'g1', name: 'Tổ 1' },
              { id: 'g2', name: 'Tổ 2' },
              { id: 'g3', name: 'Tổ 3' },
              { id: 'g4', name: 'Tổ 4' },
            ],
            transactions: [],
            rewardTransactions: [],
            badges: [],
          };
          targetClasses = [freshClass];
        }

        const activeClsId = targetWs.activeClassId && targetClasses.some(c => c.id === targetWs.activeClassId)
          ? targetWs.activeClassId
          : targetClasses[0]?.id || null;

        set({
          workspaces: currentSavedWorkspaces.map(w => w.id === targetWs.id ? { ...w, classes: targetClasses, activeClassId: activeClsId } : w),
          activeWorkspaceId: targetWs.id,
          teacher: targetTeacher,
          classes: targetClasses,
          activeClassId: activeClsId,
          teacherPin: targetWs.pin || '1234',
          appTitle: targetWs.appTitle || `HÀNH TRÌNH THI ĐUA - ${(targetWs.homeroomClass || '').toUpperCase()}`,
          appSlogan: targetWs.appSlogan || 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
          headerCoverUrl: targetWs.headerCoverUrl,
          backgroundConfig: targetWs.backgroundConfig,
          badges: targetWs.badges || DEFAULT_BADGES,
          rewards: targetWs.rewards || DEFAULT_REWARDS,
          customRewardIcons: targetWs.customRewardIcons || [],
          levels: targetWs.levels || DEFAULT_LEVELS,
          pointCriteria: targetWs.pointCriteria || DEFAULT_POINT_CRITERIA,
          workspaceModal: false,
        });

        state.showToast(`Đã chuyển sang không gian: ${targetWs.name} (${targetWs.homeroomClass})`, 'success');
        return true;
      },

      updateWorkspace: (workspaceId, data) => {
        if (isParentRoleBlocked(get, set, 'cập nhật không gian Giáo viên')) return;
        set(state => {
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === workspaceId) {
              return { ...ws, ...data, updatedAt: Date.now() };
            }
            return ws;
          });

          // If updating current active workspace, also update active store state
          if (state.activeWorkspaceId === workspaceId) {
            return {
              workspaces: updatedWorkspaces,
              teacher: (data.name || data.schoolName || data.homeroomClass || data.avatarUrl) ? {
                ...(state.teacher || { id: workspaceId, name: '', schoolName: '', grade: '', subject: '', academicYear: '', homeroomClass: '' }),
                name: data.name ?? state.teacher?.name ?? '',
                schoolName: data.schoolName ?? state.teacher?.schoolName ?? '',
                grade: data.grade ?? state.teacher?.grade ?? '',
                subject: data.subject ?? state.teacher?.subject ?? '',
                academicYear: data.academicYear ?? state.teacher?.academicYear ?? '',
                homeroomClass: data.homeroomClass ?? state.teacher?.homeroomClass ?? '',
                avatarUrl: data.avatarUrl ?? state.teacher?.avatarUrl ?? '',
              } : state.teacher,
              teacherPin: data.pin ?? state.teacherPin,
              appTitle: data.appTitle ?? state.appTitle,
              appSlogan: data.appSlogan ?? state.appSlogan,
              headerCoverUrl: data.headerCoverUrl ?? state.headerCoverUrl,
            };
          }

          return { workspaces: updatedWorkspaces };
        });
      },

      deleteWorkspace: (workspaceId) => {
        if (isParentRoleBlocked(get, set, 'xóa không gian Giáo viên')) return;
        const state = get();
        const currentWorkspaces = state.workspaces || [];
        if (currentWorkspaces.length <= 1) {
          state.showToast('Phải giữ lại ít nhất 1 không gian Giáo viên!', 'error');
          return;
        }
        
        const remaining = currentWorkspaces.filter(ws => ws.id !== workspaceId);
        if (remaining.length === 0) {
          state.showToast('Không thể xóa không gian cuối cùng!', 'error');
          return;
        }

        // If deleting current active workspace, switch to the first remaining one
        if (state.activeWorkspaceId === workspaceId) {
          const nextWs = remaining[0];
          const nextTeacher: Teacher = {
            id: nextWs.id,
            name: nextWs.name,
            avatarUrl: nextWs.avatarUrl,
            schoolName: nextWs.schoolName,
            grade: nextWs.grade,
            subject: nextWs.subject,
            academicYear: nextWs.academicYear,
            homeroomClass: nextWs.homeroomClass,
          };
          const nextClasses = (nextWs.classes && nextWs.classes.length > 0) ? nextWs.classes : [{
            id: generateId(),
            name: nextWs.homeroomClass || 'Lớp mới',
            students: [],
            groups: [
              { id: 'g1', name: 'Tổ 1' },
              { id: 'g2', name: 'Tổ 2' },
              { id: 'g3', name: 'Tổ 3' },
              { id: 'g4', name: 'Tổ 4' },
            ],
            transactions: [],
            rewardTransactions: [],
            badges: [],
          }];
          const nextActiveClsId = nextWs.activeClassId && nextClasses.some(c => c.id === nextWs.activeClassId)
            ? nextWs.activeClassId
            : nextClasses[0]?.id || null;

          set({
            workspaces: remaining.map(w => w.id === nextWs.id ? { ...w, classes: nextClasses, activeClassId: nextActiveClsId } : w),
            activeWorkspaceId: nextWs.id,
            teacher: nextTeacher,
            classes: nextClasses,
            activeClassId: nextActiveClsId,
            teacherPin: nextWs.pin || '1234',
            appTitle: nextWs.appTitle || `HÀNH TRÌNH THI ĐUA - ${(nextWs.homeroomClass || '').toUpperCase()}`,
            appSlogan: nextWs.appSlogan || 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
            headerCoverUrl: nextWs.headerCoverUrl,
            backgroundConfig: nextWs.backgroundConfig,
            badges: nextWs.badges || DEFAULT_BADGES,
            rewards: nextWs.rewards || DEFAULT_REWARDS,
            customRewardIcons: nextWs.customRewardIcons || [],
            levels: nextWs.levels || DEFAULT_LEVELS,
            pointCriteria: nextWs.pointCriteria || DEFAULT_POINT_CRITERIA,
          });
        } else {
          set({ workspaces: remaining });
        }

        state.showToast('Đã xóa không gian Giáo viên thành công!', 'success');
      },

      setUserRole: (role) => set({ userRole: role }),
      setTeacherPin: (pin) => {
        if (isParentRoleBlocked(get, set, 'thay đổi mã PIN bảo vệ')) return;
        set(state => {
          const activeWsId = state.activeWorkspaceId;
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === activeWsId) {
              return { ...ws, pin, updatedAt: Date.now() };
            }
            return ws;
          });
          return { teacherPin: pin, workspaces: updatedWorkspaces };
        });
      },
      unlockTeacher: (pin) => {
        const currentPin = get().teacherPin || '1234';
        if (pin.trim() === currentPin.trim()) {
          set({ isTeacherUnlocked: true, userRole: 'teacher' });
          return true;
        }
        return false;
      },
      lockTeacher: () => set({ isTeacherUnlocked: false, userRole: 'parent' }),
      setSelectedParentStudentId: (studentId) => set({ selectedParentStudentId: studentId }),
      setStudentReportModal: (studentId) => set({ studentReportModal: studentId }),
      setPinAuthModal: (modal) => set({ pinAuthModal: modal }),

      setAppBranding: (branding) => {
        if (isParentRoleBlocked(get, set, 'thay đổi tên thương hiệu và khẩu hiệu')) return;
        set((state) => {
          const newAppTitle = branding.appTitle.trim() || 'HÀNH TRÌNH CHINH PHỤC VINH QUANG';
          const newAppSlogan = branding.appSlogan.trim();
          const newCoverUrl = branding.headerCoverUrl !== undefined ? branding.headerCoverUrl : state.headerCoverUrl;
          const activeWsId = state.activeWorkspaceId;
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === activeWsId) {
              return { 
                ...ws, 
                appTitle: newAppTitle,
                appSlogan: newAppSlogan,
                headerCoverUrl: newCoverUrl,
                updatedAt: Date.now() 
              };
            }
            return ws;
          });
          return { 
            appTitle: newAppTitle, 
            appSlogan: newAppSlogan,
            headerCoverUrl: newCoverUrl,
            workspaces: updatedWorkspaces,
          };
        });
      },
      setHeaderCoverUrl: (url) => {
        if (isParentRoleBlocked(get, set, 'thay đổi ảnh bìa lớp')) return;
        set((state) => {
          const activeWsId = state.activeWorkspaceId;
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === activeWsId) {
              return { ...ws, headerCoverUrl: url, updatedAt: Date.now() };
            }
            return ws;
          });
          return { headerCoverUrl: url, workspaces: updatedWorkspaces };
        });
      },
      setBackgroundConfig: (config) => {
        if (isParentRoleBlocked(get, set, 'thay đổi hình nền giao diện')) return;
        set((state) => {
          const newBg = {
            type: 'preset-gradient' as const,
            presetGradientId: 'sunset',
            customColor1: '#6366f1',
            customColor2: '#ec4899',
            gradientAngle: 135,
            solidColor: '#1e1b4b',
            imageUrl: '',
            overlayOpacity: 20,
            blur: 0,
            ...(state.backgroundConfig || {}),
            ...config,
          };
          const activeWsId = state.activeWorkspaceId;
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === activeWsId) {
              return { ...ws, backgroundConfig: newBg, updatedAt: Date.now() };
            }
            return ws;
          });
          return {
            backgroundConfig: newBg,
            workspaces: updatedWorkspaces,
          };
        });
      },
      setPointModal: (modal) => {
        if (modal && get().userRole === 'parent') {
          get().showToast('Chế độ Phụ huynh chỉ đọc. Vui lòng đăng nhập Giáo viên bằng mã PIN để cộng/trừ điểm.', 'error');
          get().setPinAuthModal({
            isOpen: true,
            title: 'Chỉ Giáo viên chủ nhiệm mới có quyền ghi nhận điểm',
            onSuccess: () => {
              set({ userRole: 'teacher', isTeacherUnlocked: true, pointModal: modal });
            }
          });
          return;
        }
        set({ pointModal: modal });
      },
      showToast: (message, type = 'success') => set({ toast: { message, type, id: Date.now() } }),
      hideToast: () => set({ toast: null }),

      setTeacher: (teacher) => {
        if (isParentRoleBlocked(get, set, 'chỉnh sửa thông tin Giáo viên chủ nhiệm')) return;
        set(state => {
          const activeWsId = state.activeWorkspaceId;
          const updatedWorkspaces = (state.workspaces || []).map(ws => {
            if (ws.id === activeWsId) {
              return {
                ...ws,
                name: teacher.name || ws.name,
                avatarUrl: teacher.avatarUrl !== undefined ? teacher.avatarUrl : ws.avatarUrl,
                schoolName: teacher.schoolName || ws.schoolName,
                grade: teacher.grade || ws.grade,
                subject: teacher.subject || ws.subject,
                academicYear: teacher.academicYear || ws.academicYear,
                homeroomClass: teacher.homeroomClass || ws.homeroomClass,
                updatedAt: Date.now(),
              };
            }
            return ws;
          });
          return { teacher, workspaces: updatedWorkspaces };
        });
      },
      
      createClass: (name, defaultGroups = true) => {
        if (isParentRoleBlocked(get, set, 'tạo thêm lớp học mới')) return;
        set((state) => {
          const newClass: ClassData = {
            id: generateId(),
            name,
            students: [],
            groups: defaultGroups ? [
              { id: generateId(), name: 'Tổ 1' },
              { id: generateId(), name: 'Tổ 2' },
              { id: generateId(), name: 'Tổ 3' },
              { id: generateId(), name: 'Tổ 4' },
            ] : [],
            transactions: [],
            rewardTransactions: [],
            badges: [],
          };
          return { classes: [...state.classes, newClass], activeClassId: newClass.id };
        });
      },
      
      updateClass: (classId, name) => {
        if (isParentRoleBlocked(get, set, 'đổi tên lớp học')) return;
        set((state) => ({
          classes: state.classes.map(c => c.id === classId ? { ...c, name } : c)
        }));
      },
      
      setActiveClass: (classId) => set({ activeClassId: classId }),
      
      deleteClass: (classId) => {
        if (isParentRoleBlocked(get, set, 'xóa lớp học')) return;
        set((state) => ({
          classes: state.classes.filter(c => c.id !== classId),
          activeClassId: state.activeClassId === classId 
            ? (state.classes.find(c => c.id !== classId)?.id || null)
            : state.activeClassId
        }));
      },

      addStudent: (student) => {
        if (isParentRoleBlocked(get, set, 'thêm học sinh mới')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const newStudent: Student = {
            ...student,
            id: generateId(),
            points: 0,
            totalPositivePoints: 0,
            totalNegativePoints: 0,
            badgeIds: []
          };
          const classes = state.classes.map(c => 
            c.id === state.activeClassId 
              ? { ...c, students: [...c.students, newStudent] }
              : c
          );
          return { classes };
        });
      },

      updateStudent: (id, data) => {
        if (isParentRoleBlocked(get, set, 'cập nhật thông tin học sinh')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              students: c.students.map(s => s.id === id ? { ...s, ...data } : s)
            };
          });
          return { classes };
        });
      },

      deleteStudent: (id) => {
        if (isParentRoleBlocked(get, set, 'xóa học sinh')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              students: c.students.filter(s => s.id !== id)
            };
          });
          return { classes };
        });
      },

      addGroup: (name) => {
        if (isParentRoleBlocked(get, set, 'thêm tổ mới')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              groups: [...c.groups, { id: generateId(), name }]
            };
          });
          return { classes };
        });
      },

      updateGroup: (id, name) => {
        if (isParentRoleBlocked(get, set, 'sửa tên tổ')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              groups: c.groups.map(g => g.id === id ? { ...g, name } : g)
            };
          });
          return { classes };
        });
      },

      deleteGroup: (id) => {
        if (isParentRoleBlocked(get, set, 'xóa tổ')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              groups: c.groups.filter(g => g.id !== id),
              students: c.students.map(s => s.groupId === id ? { ...s, groupId: undefined } : s)
            };
          });
          return { classes };
        });
      },

      assignStudentToGroup: (studentId, groupId) => {
        if (isParentRoleBlocked(get, set, 'phân tổ học sinh')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              students: c.students.map(s => s.id === studentId ? { ...s, groupId } : s)
            };
          });
          return { classes };
        });
      },

      batchApplyGroups: (groups, studentGroupMap) => {
        if (isParentRoleBlocked(get, set, 'áp dụng danh sách chia tổ')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              groups,
              students: c.students.map(s => ({
                ...s,
                groupId: studentGroupMap[s.id] !== undefined ? studentGroupMap[s.id] : s.groupId
              }))
            };
          });
          return { classes };
        });
      },

      addPoints: (studentId, amount, reason) => {
        if (isParentRoleBlocked(get, set, 'cộng hoặc trừ điểm')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const transaction = {
            id: generateId(),
            studentId,
            classId: state.activeClassId,
            amount,
            reason,
            timestamp: Date.now(),
            teacherId: state.teacher?.id || 'unknown',
          };

          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              transactions: [transaction, ...c.transactions],
              students: c.students.map(s => {
                if (s.id !== studentId) return s;
                return {
                  ...s,
                  points: s.points + amount,
                  totalPositivePoints: amount > 0 ? s.totalPositivePoints + amount : s.totalPositivePoints,
                  totalNegativePoints: amount < 0 ? s.totalNegativePoints + Math.abs(amount) : s.totalNegativePoints,
                };
              })
            };
          });
          return { classes };
        });
      },

      undoLastTransaction: () => {
        if (isParentRoleBlocked(get, set, 'hoàn tác điểm')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId || c.transactions.length === 0) return c;
            const lastTx = c.transactions[0];
            
            return {
              ...c,
              transactions: c.transactions.slice(1),
              students: c.students.map(s => {
                if (s.id !== lastTx.studentId) return s;
                return {
                  ...s,
                  points: s.points - lastTx.amount,
                  totalPositivePoints: lastTx.amount > 0 ? s.totalPositivePoints - lastTx.amount : s.totalPositivePoints,
                  totalNegativePoints: lastTx.amount < 0 ? s.totalNegativePoints - Math.abs(lastTx.amount) : s.totalNegativePoints,
                };
              })
            };
          });
          return { classes };
        });
      },

      // Avatar Actions
      addCustomAvatar: (classId, avatar) => {
        if (isParentRoleBlocked(get, set, 'thêm ảnh đại diện mới')) return '';
        const id = `custom-${generateId()}`;
        const newAvatar = {
          id,
          name: avatar.name || 'Ảnh tải lên',
          url: avatar.url,
          createdAt: Date.now(),
        };

        set((state) => ({
          classes: state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              customAvatars: [newAvatar, ...(c.customAvatars || [])],
            };
          })
        }));

        return id;
      },

      addMultipleCustomAvatars: (classId, avatars) => {
        if (isParentRoleBlocked(get, set, 'thêm nhiều ảnh đại diện')) return [];
        const ids: string[] = [];
        const newAvatars = avatars.map((a, index) => {
          const id = `custom-${generateId()}-${index}`;
          ids.push(id);
          return {
            id,
            name: a.name || `Ảnh tải lên ${index + 1}`,
            url: a.url,
            createdAt: Date.now() + index,
          };
        });

        set((state) => ({
          classes: state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              customAvatars: [...newAvatars, ...(c.customAvatars || [])],
            };
          })
        }));

        return ids;
      },

      updateCustomAvatar: (classId, avatarId, name) => {
        if (isParentRoleBlocked(get, set, 'sửa ảnh đại diện')) return;
        set((state) => ({
          classes: state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              customAvatars: (c.customAvatars || []).map(a => a.id === avatarId ? { ...a, name } : a),
            };
          })
        }));
      },

      deleteCustomAvatar: (classId, avatarId) => {
        if (isParentRoleBlocked(get, set, 'xóa ảnh đại diện')) return;
        set((state) => ({
          classes: state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              customAvatars: (c.customAvatars || []).filter(a => a.id !== avatarId),
              students: c.students.map(s => {
                if (s.avatarId === avatarId) {
                  return {
                    ...s,
                    avatarId: s.gender === 'Nam' ? 'boy-1' : 'girl-1',
                  };
                }
                return s;
              }),
            };
          })
        }));
      },

      setStudentAvatar: (studentId, avatarId) => {
        if (isParentRoleBlocked(get, set, 'đổi avatar học sinh')) return;
        set((state) => ({
          classes: state.classes.map(c => ({
            ...c,
            students: c.students.map(s => s.id === studentId ? { ...s, avatarId } : s),
          }))
        }));
      },

      // Criteria Actions
      addPointCriteria: (criteria) => {
        if (isParentRoleBlocked(get, set, 'thêm tiêu chí điểm')) return;
        set((state) => ({
          pointCriteria: [...state.pointCriteria, { ...criteria, id: generateId() }]
        }));
      },

      updatePointCriteria: (id, data) => {
        if (isParentRoleBlocked(get, set, 'sửa tiêu chí điểm')) return;
        set((state) => ({
          pointCriteria: state.pointCriteria.map(c => c.id === id ? { ...c, ...data } : c)
        }));
      },

      deletePointCriteria: (id) => {
        if (isParentRoleBlocked(get, set, 'xóa tiêu chí điểm')) return;
        set((state) => ({
          pointCriteria: state.pointCriteria.filter(c => c.id !== id)
        }));
      },

      resetPointCriteria: () => {
        if (isParentRoleBlocked(get, set, 'khôi phục tiêu chí điểm')) return;
        set({ pointCriteria: DEFAULT_POINT_CRITERIA });
      },

      awardBadge: (studentId, badgeId) => {
        if (isParentRoleBlocked(get, set, 'trao tặng huy hiệu')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const badgeTransaction = {
            id: generateId(),
            studentId,
            classId: state.activeClassId,
            badgeId,
            timestamp: Date.now(),
          };

          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              badges: [badgeTransaction, ...c.badges],
              students: c.students.map(s => {
                if (s.id !== studentId) return s;
                const newBadgeIds = s.badgeIds.includes(badgeId) ? s.badgeIds : [...s.badgeIds, badgeId];
                return { ...s, badgeIds: newBadgeIds };
              })
            };
          });
          return { classes };
        });
      },

      redeemReward: (studentId, rewardId) => {
        if (isParentRoleBlocked(get, set, 'đổi phần thưởng')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const reward = state.rewards.find(r => r.id === rewardId);
          if (!reward) return state;

          const rewardTx = {
            id: generateId(),
            studentId,
            classId: state.activeClassId,
            rewardId,
            cost: reward.cost,
            timestamp: Date.now(),
          };

          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              rewardTransactions: [rewardTx, ...c.rewardTransactions],
              students: c.students.map(s => {
                if (s.id !== studentId) return s;
                return { ...s, points: s.points - reward.cost };
              })
            };
          });
          return { classes };
        });
      },

      // Custom Reward Icon Actions
      addCustomRewardIcon: (icon) => {
        if (isParentRoleBlocked(get, set, 'thêm biểu tượng quà')) return '';
        const id = `reward-icon-${generateId()}`;
        const newIcon = {
          id,
          name: icon.name || 'Icon quà tải lên',
          url: icon.url,
          createdAt: Date.now(),
        };

        set((state) => ({
          customRewardIcons: [newIcon, ...(state.customRewardIcons || [])],
        }));

        return id;
      },

      addMultipleCustomRewardIcons: (icons) => {
        if (isParentRoleBlocked(get, set, 'thêm nhiều biểu tượng quà')) return [];
        const ids: string[] = [];
        const newIcons = icons.map((icon, index) => {
          const id = `reward-icon-${generateId()}-${index}`;
          ids.push(id);
          return {
            id,
            name: icon.name || `Icon quà tải lên ${index + 1}`,
            url: icon.url,
            createdAt: Date.now() + index,
          };
        });

        set((state) => ({
          customRewardIcons: [...newIcons, ...(state.customRewardIcons || [])],
        }));

        return ids;
      },

      updateCustomRewardIcon: (id, name) => {
        if (isParentRoleBlocked(get, set, 'sửa biểu tượng quà')) return;
        set((state) => ({
          customRewardIcons: (state.customRewardIcons || []).map(icon => 
            icon.id === id ? { ...icon, name } : icon
          ),
        }));
      },

      deleteCustomRewardIcon: (id) => {
        if (isParentRoleBlocked(get, set, 'xóa biểu tượng quà')) return;
        set((state) => ({
          customRewardIcons: (state.customRewardIcons || []).filter(icon => icon.id !== id),
        }));
      },

      // Reward CRUD Actions
      addReward: (reward) => {
        if (isParentRoleBlocked(get, set, 'thêm phần thưởng mới')) return;
        set((state) => ({
          rewards: [...state.rewards, { ...reward, id: generateId() }]
        }));
      },

      updateReward: (id, data) => {
        if (isParentRoleBlocked(get, set, 'sửa phần thưởng')) return;
        set((state) => ({
          rewards: state.rewards.map(r => r.id === id ? { ...r, ...data } : r)
        }));
      },

      deleteReward: (id) => {
        if (isParentRoleBlocked(get, set, 'xóa phần thưởng')) return;
        set((state) => ({
          rewards: state.rewards.filter(r => r.id !== id)
        }));
      },

      resetRewards: () => {
        if (isParentRoleBlocked(get, set, 'khôi phục kho quà')) return;
        set({ rewards: DEFAULT_REWARDS });
      },

      importStudents: (students) => {
        if (isParentRoleBlocked(get, set, 'nhập danh sách học sinh')) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            const newStudents: Student[] = students.map(s => ({
              id: generateId(),
              name: s.name,
              gender: s.gender,
              avatarId: s.avatarId,
              groupId: s.groupId,
              points: 0,
              totalPositivePoints: 0,
              totalNegativePoints: 0,
              badgeIds: [],
              status: 'active',
            }));
            return { ...c, students: [...c.students, ...newStudents] };
          });
          return { classes };
        });
      },

      saveAttendance: (classId, recordData) => {
        if (isParentRoleBlocked(get, set, 'lưu sổ điểm danh')) return;
        set((state) => {
          const targetClassId = classId || state.activeClassId;
          if (!targetClassId) return state;

          const newRecord = {
            ...recordData,
            id: generateId(),
            timestamp: Date.now(),
          };

          const classes = state.classes.map(c => {
            if (c.id !== targetClassId) return c;
            const existingRecords = c.attendanceRecords || [];
            const filtered = existingRecords.filter(r => r.date !== recordData.date);
            return {
              ...c,
              attendanceRecords: [newRecord, ...filtered]
            };
          });

          return { classes };
        });
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),

      resetClassPoints: (targetClassId) => {
        if (isParentRoleBlocked(get, set, 'reset điểm thi đua')) return;
        set((state) => {
          const classId = targetClassId || state.activeClassId;
          if (!classId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              transactions: [],
              students: c.students.map(s => ({
                ...s,
                points: 0,
                totalPositivePoints: 0,
                totalNegativePoints: 0,
              }))
            };
          });
          return { classes };
        });
      },

      resetClassBadges: (targetClassId) => {
        if (isParentRoleBlocked(get, set, 'reset huy hiệu đã trao')) return;
        set((state) => {
          const classId = targetClassId || state.activeClassId;
          if (!classId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              badges: [],
              students: c.students.map(s => ({
                ...s,
                badgeIds: [],
              }))
            };
          });
          return { classes };
        });
      },

      resetClassRewards: (targetClassId) => {
        if (isParentRoleBlocked(get, set, 'reset lịch sử đổi quà')) return;
        set((state) => {
          const classId = targetClassId || state.activeClassId;
          if (!classId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              rewardTransactions: [],
            };
          });
          return { classes };
        });
      },

      resetClassAllProgress: (targetClassId) => {
        if (isParentRoleBlocked(get, set, 'reset toàn bộ tiến độ lớp')) return;
        set((state) => {
          const classId = targetClassId || state.activeClassId;
          if (!classId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              transactions: [],
              badges: [],
              rewardTransactions: [],
              students: c.students.map(s => ({
                ...s,
                points: 0,
                totalPositivePoints: 0,
                totalNegativePoints: 0,
                badgeIds: [],
              }))
            };
          });
          return { classes };
        });
      },

      resetData: () => {
        if (isParentRoleBlocked(get, set, 'khôi phục dữ liệu gốc')) return;
        const fresh = createDepartment10Workspaces('Trường Tiểu học Hùng Vương');
        const active = fresh.find(w => w.id === get().activeWorkspaceId) || fresh[0];
        set({ 
          classes: active.classes, 
          activeClassId: active.classes[0]?.id || null,
          teacher: {
            id: active.id,
            name: active.name,
            schoolName: active.schoolName,
            homeroomClass: active.homeroomClass,
            subject: active.subject,
            grade: active.grade,
            academicYear: active.academicYear,
            avatarUrl: active.avatarUrl,
          }
        });
      },
      restoreData: (data) => {
        if (isParentRoleBlocked(get, set, 'khôi phục dữ liệu từ bản sao lưu')) return;
        set({ ...data });
      },
    }),
    {
      name: 'htcvq-storage',
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined' && state) {
          // 1. Sanitize existing workspaces IDs if any duplicates exist in localStorage
          if (state.workspaces && state.workspaces.length > 0) {
            const seenIds = new Set<string>();
            state.workspaces = state.workspaces.map((ws, idx) => {
              let safeId = ws.id;
              if (!safeId || seenIds.has(safeId)) {
                safeId = `ws_teacher_${idx + 1}_${generateId()}`;
              }
              seenIds.add(safeId);
              return { ...ws, id: safeId };
            });
          }

          // 2. Auto-upgrade if state from localStorage has fewer than 10 classes
          if (!state.workspaces || state.workspaces.length < 10) {
            const fresh10 = createDepartment10Workspaces(state.departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương');
            // Keep existing active workspace if possible, or merge without overriding canonical unique IDs
            const existingMap = new Map((state.workspaces || []).map(w => [w.homeroomClass, w]));
            const merged10 = fresh10.map(fw => {
              const matched = existingMap.get(fw.homeroomClass);
              if (matched) {
                return { 
                  ...fw, 
                  ...matched,
                  id: fw.id, // Strictly preserve unique canonical ID
                  homeroomClass: fw.homeroomClass,
                };
              }
              return fw;
            });
            state.workspaces = merged10;
            if (!merged10.some(w => w.id === state.activeWorkspaceId)) {
              state.activeWorkspaceId = merged10[0].id;
            }
          }

          if (!state.departmentInfo) {
            state.departmentInfo = {
              name: 'Tổ Chuyên Môn Khối 2',
              schoolName: 'Trường Tiểu học Hùng Vương',
              leaderName: 'Cô Phương Anh (Lớp 2A6)',
              leaderPin: '1234',
              academicYear: '2026-2027',
            };
          }

          const params = new URLSearchParams(window.location.search);
          
          // Workspace param support: ?workspace=ws_teacher_2 or ?lop=2A3 or ?class=2A3 or ?teacher=... or ?gv=3
          const requestedWs = params.get('workspace') || params.get('teacher');
          const requestedLop = params.get('lop') || params.get('class');
          const requestedGvNum = params.get('gv');

          let foundWorkspaceId: string | null = null;
          if (requestedWs && state.workspaces && state.workspaces.some(w => w.id === requestedWs)) {
            foundWorkspaceId = requestedWs;
          } else if (requestedLop && state.workspaces) {
            const match = state.workspaces.find(w => 
              w.homeroomClass.toLowerCase().replace(/\s+/g, '') === requestedLop.toLowerCase().replace(/\s+/g, '') ||
              w.classes.some(c => c.name.toLowerCase().replace(/\s+/g, '') === requestedLop.toLowerCase().replace(/\s+/g, ''))
            );
            if (match) foundWorkspaceId = match.id;
          } else if (requestedGvNum && state.workspaces) {
            const match = state.workspaces.find(w => w.id === `ws_teacher_${requestedGvNum}`);
            if (match) foundWorkspaceId = match.id;
          }

          if (foundWorkspaceId) {
            state.switchWorkspace(foundWorkspaceId, true);
          }

          const isParentUrl = params.get('role') === 'parent' || params.get('mode') === 'parent' || params.get('phuhuynh') === '1';
          if (isParentUrl) {
            state.userRole = 'parent';
            state.isTeacherUnlocked = false;
          }
          const targetClassId = params.get('classId');
          if (targetClassId && state.classes.some(c => c.id === targetClassId)) {
            state.activeClassId = targetClassId;
          }
          const studentId = params.get('studentId');
          if (studentId) {
            state.selectedParentStudentId = studentId;
            state.studentReportModal = studentId;
          }
        }
      }
    }
  )
);

export * from './selectors';
