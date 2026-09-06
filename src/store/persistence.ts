import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { durableKeys, encodeBackup, parseBackup } from './validation';

export const STORAGE_KEY = 'htcvq-storage';
export interface SyncStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
export function browserStorage(): SyncStorage {
  return { getItem: key => localStorage.getItem(key), setItem: (key,value) => localStorage.setItem(key,value) };
}
export function persistSafely(creator: StateCreator<AppState>, storage: SyncStorage): StateCreator<AppState> {
  return (set, get, api) => {
    let original: string | null = null;
    let loaded: Partial<AppState> = {};
    let loadError: string | null = null;
    try {
      original = storage.getItem(STORAGE_KEY);
      if (original !== null) loaded = parseBackup(original);
    } catch {
      loadError = 'Không đọc được dữ liệu đã lưu. Bản gốc được giữ nguyên; hãy tải bản sao rồi phục hồi từ file hợp lệ.';
    }
    const guardedSet: typeof set = (update, replace?) => {
      const previous = get();
      const delta = typeof update === 'function' ? update(previous) : update;
      if (delta === previous) return;
      const next = { ...previous, ...delta } as AppState;
      const changed = durableKeys.some(key => next[key] !== previous[key]);
      if (!changed) { set(delta as AppState, false); return; }
      try {
        if (previous.storageBlocked && delta.storageBlocked !== false) throw new Error(loadError || 'Dữ liệu chưa sẵn sàng.');
        if (storage.getItem(STORAGE_KEY) !== original) throw new Error('Dữ liệu đã thay đổi trong cửa sổ khác. Hãy tải lại ứng dụng trước khi chỉnh sửa.');
        const serialized = encodeBackup(next);
        // Persist before publishing to React; failed writes leave both views unchanged.
        storage.setItem(STORAGE_KEY, serialized);
        original = serialized;
        set({ ...next, storageError: null, storageBlocked: false });
      } catch (error) {
        const message = error instanceof Error && error.name !== 'QuotaExceededError' && error.message.startsWith('Dữ liệu')
          ? error.message : 'Chưa lưu được thay đổi. Dữ liệu cũ vẫn được giữ; hãy sao lưu và kiểm tra dung lượng/quyền lưu trữ.';
        set({ storageError: message, toast: { message, type: 'error', id: Date.now() } });
      }
    };
    api.setState = guardedSet;
    const initial = creator(guardedSet, get, api);
    return { ...initial, ...loaded, storageError: loadError, storageBlocked: !!loadError };
  };
}
