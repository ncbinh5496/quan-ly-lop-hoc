import { useShallow } from 'zustand/react/shallow';
const EMPTY_STUDENTS: Student[] = [];
const EMPTY_CRITERIA: PointCriteria[] = [];
import { useStore } from './index';
import { ClassData, Student, PointCriteria, Teacher } from '../types';

/**
 * Hook to retrieve the current active class object
 */
export function useActiveClass(): ClassData | undefined {
  return useStore(state => {
    return state.classes.find(c => c.id === state.activeClassId) || state.classes[0];
  });
}

/**
 * Hook to retrieve the current active class's students
 */
export function useActiveStudents(): Student[] {
  return useStore(state => {
    const active = state.classes.find(c => c.id === state.activeClassId) || state.classes[0];
    return active?.students || EMPTY_STUDENTS;
  });
}

/**
 * Hook to retrieve teacher and school info
 */
export function useTeacher(): Teacher | undefined {
  return useStore(state => state.teacher);
}

/**
 * Hook to retrieve active point criteria list
 */
export function usePointCriteria(): PointCriteria[] {
  return useStore(state => state.pointCriteria || EMPTY_CRITERIA);
}

/**
 * Hook for toast notification system
 */
export function useToastNotification() {
  const toast = useStore(state => state.toast);
  const showToast = useStore(state => state.showToast);
  const hideToast = useStore(state => state.hideToast);

  return { toast, showToast, hideToast };
}

/**
 * Hook for App branding & title
 */
export function useAppBranding() {
  return useStore(useShallow(state => ({
    appTitle: state.appTitle,
    appSlogan: state.appSlogan,
    headerCoverUrl: state.headerCoverUrl,
    backgroundConfig: state.backgroundConfig,
  })));
}

