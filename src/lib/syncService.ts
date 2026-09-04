import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { useStore } from '../store';
import { AppState, ClassData, TeacherWorkspace } from '../types';
import { compressDataUrl } from '../utils/helpers';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: number;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    timestamp: Date.now()
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

let isRemoteUpdate = false;
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastSyncedClassIds: Set<string> = new Set();

// Clean undefined values so Firestore doesn't reject document writes
function sanitizeForFirestore(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

export function initFirebaseSync() {
  const unsubs: (() => void)[] = [];

  // Track known remote classes to merge properly
  let remoteClassesMap = new Map<string, ClassData>();
  let hasReceivedClassesSnapshot = false;
  let hasReceivedSettingsSnapshot = false;

  // 1. Listen for Workspaces collection (Multi-Teacher support)
  try {
    const workspacesCol = collection(db, 'teacher_workspaces');
    const unsubWorkspaces = onSnapshot(workspacesCol, (snapshot) => {
      if (!snapshot.empty) {
        const remoteWorkspaces: TeacherWorkspace[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TeacherWorkspace;
          if (data && data.id && data.name) {
            remoteWorkspaces.push({
              ...data,
              classes: data.classes || [],
              badges: data.badges || [],
              rewards: data.rewards || [],
              levels: data.levels || [],
              pointCriteria: data.pointCriteria || [],
            });
          }
        });

        if (remoteWorkspaces.length > 0) {
          isRemoteUpdate = true;
          const currentStore = useStore.getState();
          const activeWs = remoteWorkspaces.find(w => w.id === currentStore.activeWorkspaceId) || remoteWorkspaces[0];
          
          useStore.setState({
            workspaces: remoteWorkspaces,
            isCloudSynced: true,
          });
          
          if (activeWs && activeWs.id === currentStore.activeWorkspaceId) {
            // Update active state if remote has changes
            currentStore.restoreData({
              ...currentStore,
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
              teacherPin: activeWs.pin || currentStore.teacherPin,
              appTitle: activeWs.appTitle || currentStore.appTitle,
              appSlogan: activeWs.appSlogan || currentStore.appSlogan,
              headerCoverUrl: activeWs.headerCoverUrl ?? currentStore.headerCoverUrl,
              backgroundConfig: activeWs.backgroundConfig ?? currentStore.backgroundConfig,
              classes: activeWs.classes && activeWs.classes.length > 0 ? activeWs.classes : currentStore.classes,
              badges: activeWs.badges && activeWs.badges.length > 0 ? activeWs.badges : currentStore.badges,
              rewards: activeWs.rewards && activeWs.rewards.length > 0 ? activeWs.rewards : currentStore.rewards,
              levels: activeWs.levels && activeWs.levels.length > 0 ? activeWs.levels : currentStore.levels,
              pointCriteria: activeWs.pointCriteria && activeWs.pointCriteria.length > 0 ? activeWs.pointCriteria : currentStore.pointCriteria,
            });
          }
          setTimeout(() => { isRemoteUpdate = false; }, 150);
        }
      } else {
        // Push initial workspaces to Firestore
        const currentStore = useStore.getState();
        if (currentStore.workspaces && currentStore.workspaces.length > 0) {
          pushWorkspacesToFirestore(currentStore.workspaces);
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'teacher_workspaces');
    });
    unsubs.push(unsubWorkspaces);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'teacher_workspaces');
  }

  // 2. Listen for Classes collection
  try {
    const classesCol = collection(db, 'classes');
    const unsubClasses = onSnapshot(classesCol, (snapshot) => {
      hasReceivedClassesSnapshot = true;
      if (!snapshot.empty) {
        const remoteClasses: ClassData[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ClassData;
          if (data && data.id && data.name) {
            remoteClasses.push({
              ...data,
              students: data.students || [],
              groups: data.groups || [],
              transactions: data.transactions || [],
              rewardTransactions: data.rewardTransactions || [],
              badges: data.badges || [],
            });
            remoteClassesMap.set(data.id, data);
          }
        });

        if (remoteClasses.length > 0) {
          isRemoteUpdate = true;
          const currentStore = useStore.getState();
          currentStore.restoreData({
            ...currentStore,
            classes: remoteClasses,
            activeClassId: currentStore.activeClassId && remoteClasses.some(c => c.id === currentStore.activeClassId)
              ? currentStore.activeClassId
              : remoteClasses[0].id
          });
          lastSyncedClassIds = new Set(remoteClasses.map(c => c.id));
          useStore.setState({ isCloudSynced: true });
          setTimeout(() => { isRemoteUpdate = false; }, 150);
        }
      } else {
        // Classes collection is empty on Firestore, push local classes if any
        const currentStore = useStore.getState();
        if (currentStore.classes && currentStore.classes.length > 0) {
          pushClassesToFirestore(currentStore.classes);
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'classes');
    });
    unsubs.push(unsubClasses);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'classes');
  }

  // 2. Listen for App Settings document
  try {
    const settingsDoc = doc(db, 'app_data', 'settings');
    const unsubSettings = onSnapshot(settingsDoc, (snapshot) => {
      hasReceivedSettingsSnapshot = true;
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          isRemoteUpdate = true;
          const currentStore = useStore.getState();
          currentStore.restoreData({
            ...currentStore,
            appTitle: data.appTitle ?? currentStore.appTitle,
            appSlogan: data.appSlogan ?? currentStore.appSlogan,
            teacher: data.teacher ?? currentStore.teacher,
            badges: data.badges ?? currentStore.badges,
            rewards: data.rewards ?? currentStore.rewards,
            customRewardIcons: data.customRewardIcons ?? currentStore.customRewardIcons,
            levels: data.levels ?? currentStore.levels,
            pointCriteria: data.pointCriteria ?? currentStore.pointCriteria,
            activeClassId: data.activeClassId ?? currentStore.activeClassId,
            teacherPin: data.teacherPin ?? currentStore.teacherPin,
          });
          useStore.setState({ isCloudSynced: true });
          setTimeout(() => { isRemoteUpdate = false; }, 150);
        }
      } else {
        // Push initial settings
        const currentStore = useStore.getState();
        pushSettingsToFirestore(currentStore);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'app_data/settings');
    });
    unsubs.push(unsubSettings);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'app_data/settings');
  }

  // 3. Listen for App Branding document
  try {
    const brandingDoc = doc(db, 'app_data', 'branding');
    const unsubBranding = onSnapshot(brandingDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          isRemoteUpdate = true;
          const currentStore = useStore.getState();
          currentStore.restoreData({
            ...currentStore,
            headerCoverUrl: data.headerCoverUrl ?? currentStore.headerCoverUrl,
            backgroundConfig: data.backgroundConfig ?? currentStore.backgroundConfig,
          });
          useStore.setState({ isCloudSynced: true });
          setTimeout(() => { isRemoteUpdate = false; }, 150);
        }
      } else {
        const currentStore = useStore.getState();
        pushBrandingToFirestore(currentStore);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'app_data/branding');
    });
    unsubs.push(unsubBranding);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'app_data/branding');
  }

  // 4. Clean up legacy oversized global_state document if it exists
  deleteLegacyGlobalStateDoc();

  // 5. Subscribe to local store state changes and push to Firestore with debounce
  const unsubStore = useStore.subscribe((state, prevState) => {
    if (isRemoteUpdate) return;

    const workspacesChanged = state.workspaces !== prevState.workspaces || state.activeWorkspaceId !== prevState.activeWorkspaceId;
    const classesChanged = state.classes !== prevState.classes;
    const settingsChanged = 
      state.teacher !== prevState.teacher ||
      state.badges !== prevState.badges ||
      state.rewards !== prevState.rewards ||
      state.customRewardIcons !== prevState.customRewardIcons ||
      state.levels !== prevState.levels ||
      state.pointCriteria !== prevState.pointCriteria ||
      state.appTitle !== prevState.appTitle ||
      state.appSlogan !== prevState.appSlogan ||
      state.teacherPin !== prevState.teacherPin ||
      state.activeClassId !== prevState.activeClassId;
    const brandingChanged = 
      state.backgroundConfig !== prevState.backgroundConfig ||
      state.headerCoverUrl !== prevState.headerCoverUrl;

    if (workspacesChanged || classesChanged || settingsChanged || brandingChanged) {
      if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
      syncDebounceTimer = setTimeout(() => {
        if (workspacesChanged && state.workspaces && state.workspaces.length > 0) {
          pushWorkspacesToFirestore(state.workspaces);
        }
        if (classesChanged) {
          pushClassesToFirestore(state.classes);
        }
        if (settingsChanged) {
          pushSettingsToFirestore(state);
        }
        if (brandingChanged) {
          pushBrandingToFirestore(state);
        }
      }, 400);
    }
  });

  return () => {
    unsubs.forEach(unsub => unsub());
    unsubStore();
  };
}

export async function pushWorkspacesToFirestore(workspaces: TeacherWorkspace[]) {
  try {
    for (const ws of workspaces) {
      const wsDocRef = doc(db, 'teacher_workspaces', ws.id);
      
      // Compress teacher avatar if needed
      let teacherAvatar = ws.avatarUrl;
      if (teacherAvatar && teacherAvatar.startsWith('data:image/')) {
        teacherAvatar = await compressDataUrl(teacherAvatar, 300, 300, 0.75);
      }

      const payload = sanitizeForFirestore({
        id: ws.id,
        name: ws.name,
        avatarUrl: teacherAvatar || '',
        schoolName: ws.schoolName || '',
        grade: ws.grade || '',
        subject: ws.subject || '',
        academicYear: ws.academicYear || '',
        homeroomClass: ws.homeroomClass || '',
        pin: ws.pin || '1234',
        appTitle: ws.appTitle || 'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
        appSlogan: ws.appSlogan || '',
        headerCoverUrl: ws.headerCoverUrl || '',
        backgroundConfig: ws.backgroundConfig || null,
        classes: ws.classes || [],
        activeClassId: ws.activeClassId || null,
        badges: ws.badges || [],
        rewards: ws.rewards || [],
        customRewardIcons: ws.customRewardIcons || [],
        levels: ws.levels || [],
        pointCriteria: ws.pointCriteria || [],
        updatedAt: Date.now(),
      });

      await setDoc(wsDocRef, payload, { merge: true });
    }
    useStore.setState({ isCloudSynced: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'teacher_workspaces');
  }
}

async function deleteLegacyGlobalStateDoc() {
  try {
    const legacyDoc = doc(db, 'app_data', 'global_state');
    await deleteDoc(legacyDoc);
  } catch (err) {
    // Ignore if not present or cannot delete
  }
}

export async function pushSettingsToFirestore(state: AppState) {
  try {
    const settingsDoc = doc(db, 'app_data', 'settings');
    // Compress teacher avatar if needed
    let teacherAvatar = state.teacher?.avatarUrl;
    if (teacherAvatar && teacherAvatar.startsWith('data:image/')) {
      teacherAvatar = await compressDataUrl(teacherAvatar, 300, 300, 0.75);
    }

    // Compress custom reward icons if needed
    let compressedRewardIcons = state.customRewardIcons;
    if (compressedRewardIcons && compressedRewardIcons.length > 0) {
      compressedRewardIcons = await Promise.all(
        compressedRewardIcons.map(async (icon) => {
          if (icon.url && icon.url.startsWith('data:image/')) {
            const compUrl = await compressDataUrl(icon.url, 120, 120, 0.75);
            return { ...icon, url: compUrl };
          }
          return icon;
        })
      );
    }

    const payload = sanitizeForFirestore({
      appTitle: state.appTitle,
      appSlogan: state.appSlogan,
      teacher: state.teacher ? {
        ...state.teacher,
        avatarUrl: teacherAvatar,
      } : null,
      activeClassId: state.activeClassId,
      badges: state.badges,
      rewards: state.rewards,
      customRewardIcons: compressedRewardIcons,
      levels: state.levels,
      pointCriteria: state.pointCriteria,
      teacherPin: state.teacherPin || '1234',
      updatedAt: Date.now(),
    });

    await setDoc(settingsDoc, payload, { merge: true });
    useStore.setState({ isCloudSynced: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'app_data/settings');
  }
}

export async function pushBrandingToFirestore(state: AppState) {
  try {
    const brandingDoc = doc(db, 'app_data', 'branding');
    
    // Compress header cover image if large dataUrl
    let headerCoverUrl = state.headerCoverUrl;
    if (headerCoverUrl && headerCoverUrl.startsWith('data:image/')) {
      headerCoverUrl = await compressDataUrl(headerCoverUrl, 1280, 600, 0.75);
    }

    // Compress background image if large dataUrl
    let bgConfig = state.backgroundConfig;
    if (bgConfig?.imageUrl && bgConfig.imageUrl.startsWith('data:image/')) {
      const compressedBg = await compressDataUrl(bgConfig.imageUrl, 1280, 1280, 0.75);
      bgConfig = { ...bgConfig, imageUrl: compressedBg };
    }

    const payload = sanitizeForFirestore({
      headerCoverUrl,
      backgroundConfig: bgConfig,
      updatedAt: Date.now(),
    });

    await setDoc(brandingDoc, payload, { merge: true });
    useStore.setState({ isCloudSynced: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'app_data/branding');
  }
}

export async function pushClassesToFirestore(classes: ClassData[]) {
  try {
    const currentClassIds = new Set(classes.map(c => c.id));

    // 1. Delete removed classes from Firestore
    for (const oldId of lastSyncedClassIds) {
      if (!currentClassIds.has(oldId)) {
        try {
          await deleteDoc(doc(db, 'classes', oldId));
        } catch (e) {
          handleFirestoreError(e, OperationType.DELETE, `classes/${oldId}`);
        }
      }
    }
    lastSyncedClassIds = currentClassIds;

    // 2. Save each class as its own Firestore document with compressed custom avatars
    let anyAvatarCompressed = false;
    const updatedClasses: ClassData[] = [];

    for (const cls of classes) {
      let compressedAvatars = cls.customAvatars || [];
      if (compressedAvatars.length > 0) {
        const processed = await Promise.all(
          compressedAvatars.map(async (av) => {
            if (av.url && av.url.startsWith('data:image/')) {
              const compUrl = await compressDataUrl(av.url, 180, 180, 0.75);
              if (compUrl !== av.url) {
                anyAvatarCompressed = true;
              }
              return { ...av, url: compUrl };
            }
            return av;
          })
        );
        compressedAvatars = processed;
      }

      // Limit transactions history array length in sync payload if very long
      const transactions = (cls.transactions || []).slice(0, 300);
      const rewardTransactions = (cls.rewardTransactions || []).slice(0, 300);

      const classDocRef = doc(db, 'classes', cls.id);
      const payload = sanitizeForFirestore({
        id: cls.id,
        name: cls.name,
        students: cls.students || [],
        groups: cls.groups || [],
        transactions,
        rewardTransactions,
        badges: cls.badges || [],
        customAvatars: compressedAvatars,
        updatedAt: Date.now(),
      });

      await setDoc(classDocRef, payload, { merge: true });

      updatedClasses.push({
        ...cls,
        customAvatars: compressedAvatars,
      });
    }

    // If we compressed large base64 avatar images, update local store so future syncs are instant
    if (anyAvatarCompressed) {
      isRemoteUpdate = true;
      useStore.setState({ classes: updatedClasses });
      setTimeout(() => { isRemoteUpdate = false; }, 100);
    }

    useStore.setState({ isCloudSynced: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'classes');
  }
}
