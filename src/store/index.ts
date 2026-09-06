import { create } from 'zustand';
import { persistSafely, browserStorage, type SyncStorage } from './persistence';
import { validateSavedState } from './validation';
import { applyAttendance, undoPoints } from './attendance';
import { CHIBI_STUDENT_COVERS } from '../utils/chibiThemes';
import { AppState, ClassData, Student, Teacher, Badge } from '../types';
import { DEFAULT_BADGES, DEFAULT_LEVELS, DEFAULT_POINT_CRITERIA, DEFAULT_REWARDS, DEFAULT_TEACHER, createDefaultClass } from '../utils/defaults';

const generateId = () => crypto.randomUUID();

const defaultInitialClass = createDefaultClass();

export const createClassroomStore = (storage: SyncStorage = browserStorage()) => create<AppState>()(
  persistSafely(
    (set, get) => ({
      appTitle: 'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
      appSlogan: 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
      headerCoverUrl: CHIBI_STUDENT_COVERS[0].url,
      archivedClasses: [],
      storageError: null,
      storageBlocked: false,
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
      teacher: DEFAULT_TEACHER,
      classes: [defaultInitialClass],
      activeClassId: defaultInitialClass.id,
      badges: DEFAULT_BADGES,
      rewards: DEFAULT_REWARDS,
      customRewardIcons: [],
      levels: DEFAULT_LEVELS,
      pointCriteria: DEFAULT_POINT_CRITERIA,
      soundEnabled: true,
      presentationMode: false,
      pointModal: null,
      toast: null,
      studentReportModal: null,

      setStudentReportModal: (studentId) => set({ studentReportModal: studentId }),

      setAppBranding: (branding) => {
        set((state) => ({
          appTitle: branding.appTitle.trim() || 'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
          appSlogan: branding.appSlogan.trim(),
          headerCoverUrl: branding.headerCoverUrl !== undefined ? branding.headerCoverUrl : state.headerCoverUrl,
        }));
      },
      setHeaderCoverUrl: (url) => {
        set({ headerCoverUrl: url });
      },
      setBackgroundConfig: (config) => {
        set((state) => ({
          backgroundConfig: {
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
          }
        }));
      },
      setPointModal: (modal) => {
        set({ pointModal: modal });
      },
      showToast: (message, type = 'success') => {
        if (type === 'success' && get().storageError) return;
        set({ toast: { message, type, id: Date.now() } });
      },
      hideToast: () => set({ toast: null }),

      setTeacher: (teacher) => {
        set(state => {
          let updatedClasses = state.classes;
          if (teacher.homeroomClass && state.classes.length > 0) {
            updatedClasses = state.classes.map((c, idx) => idx === 0 ? { ...c, name: teacher.homeroomClass } : c);
          }
          return { teacher, classes: updatedClasses };
        });
      },
      
      // Compatibility action: a single-class app can rename, never replace its roster.
      createClass: (name) => {
        const current = get().classes[0];
        if (current) get().updateClass(current.id, name.trim() || current.name);
      },

      updateClass: (classId, name) => {
        set((state) => ({
          classes: state.classes.map(c => c.id === classId ? { ...c, name } : c),
          teacher: state.teacher ? { ...state.teacher, homeroomClass: name } : state.teacher,
        }));
      },
      
      setActiveClass: (classId) => { if (get().classes[0]?.id === classId) set({ activeClassId: classId }); },
      
      deleteClass: (classId) => {
        // Single class architecture requires at least 1 class
        get().showToast('Ứng dụng duy trì 1 lớp học. Bạn có thể đổi tên lớp thay vì xóa.', 'info');
      },

      addStudent: (student) => {
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
        set((state) => {
          if (!state.activeClassId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== state.activeClassId) return c;
            return {
              ...c,
              groups,
              students: c.students.map(s => ({
                ...s,
                groupId: studentGroupMap[s.id] !== undefined ? studentGroupMap[s.id] : (groups.some(g => g.id === s.groupId) ? s.groupId : undefined)
              }))
            };
          });
          return { classes };
        });
      },

      addPoints: (studentId, amount, reason) => {
        if (!Number.isFinite(amount) || amount === 0 || !reason.trim() || !get().classes[0]?.students.some(s => s.id === studentId)) return;
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

      undoLastTransaction: () => set(state => ({
        classes: state.classes.map(c => c.id === state.activeClassId ? undoPoints(c) : c),
      })),

      // Avatar Actions
      addCustomAvatar: (classId, avatar) => {
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
        set((state) => ({
          classes: state.classes.map(c => ({
            ...c,
            students: c.students.map(s => s.id === studentId ? { ...s, avatarId } : s),
          }))
        }));
      },

      // Criteria Actions
      addPointCriteria: (criteria) => {
        set((state) => ({
          pointCriteria: [...state.pointCriteria, { ...criteria, id: generateId() }]
        }));
      },

      updatePointCriteria: (id, data) => {
        set((state) => ({
          pointCriteria: state.pointCriteria.map(c => c.id === id ? { ...c, ...data } : c)
        }));
      },

      deletePointCriteria: (id) => {
        set((state) => ({
          pointCriteria: state.pointCriteria.filter(c => c.id !== id)
        }));
      },

      resetPointCriteria: () => {
        set({ pointCriteria: DEFAULT_POINT_CRITERIA });
      },

      awardBadge: (studentId, badgeId) => {
        const badge = get().badges.find(b => b.id === badgeId);
        if (!badge || !get().classes[0]?.students.some(s => s.id === studentId)) return;
        set((state) => {
          if (!state.activeClassId) return state;
          const badgeTransaction = {
            id: generateId(),
            studentId,
            classId: state.activeClassId,
            badgeId,
            badgeName: badge.name,
            badgeIcon: badge.icon,
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

      addBadge: (badge) => {
        const newBadge: Badge = {
          ...badge,
          id: `b_${Date.now()}_${generateId()}`,
        };
        set((state) => ({
          badges: [...state.badges, newBadge],
        }));
        get().showToast(`Đã tạo mới huy hiệu "${badge.name}"!`);
      },

      updateBadge: (id, data) => {
        set((state) => ({
          badges: state.badges.map(b => b.id === id ? { ...b, ...data } : b),
        }));
        get().showToast('Đã cập nhật thông tin huy hiệu danh dự!');
      },

      deleteBadge: (id) => {
        const currentBadge = get().badges.find(b => b.id === id);
        set((state) => ({
          badges: state.badges.filter(b => b.id !== id),
        }));
        if (currentBadge) {
          get().showToast(`Đã xóa huy hiệu "${currentBadge.name}"!`);
        }
      },

      resetBadges: () => {
        set({ badges: DEFAULT_BADGES });
        get().showToast('Đã khôi phục danh sách huy hiệu danh dự mặc định!');
      },

      redeemReward: (studentId, rewardId) => {
        const current = get();
        const student = current.classes[0]?.students.find(s => s.id === studentId);
        const selectedReward = current.rewards.find(r => r.id === rewardId);
        if (!student || !selectedReward || selectedReward.isActive === false || !Number.isFinite(selectedReward.cost) || selectedReward.cost <= 0 || student.points < selectedReward.cost) {
          current.showToast('Không thể đổi quà: kiểm tra học sinh, điểm và trạng thái phần thưởng.', 'error');
          return false;
        }
        set((state) => {
          if (!state.activeClassId) return state;
          const reward = state.rewards.find(r => r.id === rewardId);
          if (!reward) return state;

          const rewardTx = {
            id: generateId(),
            studentId,
            classId: state.activeClassId,
            rewardId,
            rewardName: reward.name,
            rewardIcon: reward.icon,
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
        return !get().storageError;
      },

      // Custom Reward Icon Actions
      addCustomRewardIcon: (icon) => {
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
        set((state) => ({
          customRewardIcons: (state.customRewardIcons || []).map(icon => 
            icon.id === id ? { ...icon, name } : icon
          ),
        }));
      },

      deleteCustomRewardIcon: (id) => {
        set((state) => ({
          customRewardIcons: (state.customRewardIcons || []).filter(icon => icon.id !== id),
        }));
      },

      // Reward CRUD Actions
      addReward: (reward) => {
        set((state) => ({
          rewards: [...state.rewards, { ...reward, id: generateId() }]
        }));
      },

      updateReward: (id, data) => {
        set((state) => ({
          rewards: state.rewards.map(r => r.id === id ? { ...r, ...data } : r)
        }));
      },

      deleteReward: (id) => {
        set((state) => ({
          rewards: state.rewards.filter(r => r.id !== id)
        }));
      },

      resetRewards: () => {
        set({ rewards: DEFAULT_REWARDS });
      },

      importStudents: (students, options) => {
        set((state) => {
          const targetClassId = options?.classId || state.activeClassId;
          const target = state.classes.find(c => c.id === targetClassId);
          if (!target || !students.length) return state;
          const groups = [...target.groups];
          const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
          const newStudents: Student[] = students.map(s => {
            let groupId = s.groupId && groups.some(g => g.id === s.groupId) ? s.groupId : undefined;
            if (s.groupName?.trim()) {
              let group = groups.find(g => normalize(g.name) === normalize(s.groupName!));
              if (!group) { group = { id: generateId(), name: s.groupName.trim() }; groups.push(group); }
              groupId = group.id;
            }
            return { id: generateId(), name: s.name.trim(), gender: s.gender, avatarId: s.avatarId,
              groupId, points: 0, totalPositivePoints: 0, totalNegativePoints: 0, badgeIds: [], status: 'active' };
          });
          // Retain the old roster and all related records in exported backups.
          const archiveId = generateId();
          const archive = options?.replace ? {
            ...target, id: archiveId, name: `${target.name} (trước thay danh sách)`,
            transactions: target.transactions.map(t => ({ ...t, classId: archiveId })),
            badges: target.badges.map(t => ({ ...t, classId: archiveId })),
            rewardTransactions: target.rewardTransactions.map(t => ({ ...t, classId: archiveId })),
          } : null;
          return {
            archivedClasses: archive ? [...state.archivedClasses, archive] : state.archivedClasses,
            classes: state.classes.map(c => c.id !== targetClassId ? c : {
              ...c, groups, students: options?.replace ? newStudents : [...c.students, ...newStudents],
              ...(options?.replace ? { transactions: [], badges: [], rewardTransactions: [], attendanceRecords: [] } : {}),
            }),
          };
        });
      },

      saveAttendance: (classId, recordData, rewardPoints = false) => {
        try {
          set(state => {
            const current = state.classes.find(c => c.id === classId);
            if (!current) return state;
            const updated = applyAttendance(current, recordData.date, recordData.studentStatuses, rewardPoints, state.teacher?.id || 'unknown');
            return updated === current ? state : { classes: state.classes.map(c => c.id === classId ? updated : c) };
          });
          return !get().storageError;
        } catch {
          get().showToast('Điểm danh chưa hợp lệ. Vui lòng kiểm tra lại danh sách.', 'error');
          return false;
        }
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),

      resetClassPoints: (targetClassId) => {
        set((state) => {
          const classId = targetClassId || state.activeClassId;
          if (!classId) return state;
          const classes = state.classes.map(c => {
            if (c.id !== classId) return c;
            return {
              ...c,
              transactions: [],
              attendanceRecords: c.attendanceRecords?.map(r => ({ ...r, rewardAmounts: {}, rewardEnabled: false })),
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
              attendanceRecords: c.attendanceRecords?.map(r => ({ ...r, rewardAmounts: {}, rewardEnabled: false })),
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
        const freshClass = createDefaultClass();
        set({
          appTitle: 'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
          appSlogan: 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
          headerCoverUrl: CHIBI_STUDENT_COVERS[0].url,
          backgroundConfig: { type: 'preset-gradient', presetGradientId: 'sunset' },
          classes: [freshClass], activeClassId: freshClass.id, archivedClasses: [], teacher: DEFAULT_TEACHER,
          badges: DEFAULT_BADGES, rewards: DEFAULT_REWARDS, levels: DEFAULT_LEVELS,
          pointCriteria: DEFAULT_POINT_CRITERIA, customRewardIcons: [], soundEnabled: true,
          pointModal: null, studentReportModal: null, toast: null, presentationMode: false, storageBlocked: false,
        });
      },
      restoreData: (data) => {
        try {
          const validated = validateSavedState(data);
          set({ ...validated, storageBlocked: false, pointModal: null, studentReportModal: null, toast: null });
          return !get().storageError;
        } catch {
          get().showToast('File sao lưu sai cấu trúc hoặc dữ liệu không hợp lệ. Dữ liệu hiện tại được giữ nguyên.', 'error');
          return false;
        }
      },
    }),
    storage,
  )
);
export const useStore = createClassroomStore();
export * from './selectors';
