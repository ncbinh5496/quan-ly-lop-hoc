import type { AppState } from '../types';
import { encodeBackup } from '../store/validation';
import { STORAGE_KEY } from '../store/persistence';
import { classroomDate } from './dates';
export function downloadBackup(state: AppState, label = 'backup'): boolean {
  try {
    const data = state.storageBlocked ? localStorage.getItem(STORAGE_KEY) : encodeBackup(state);
    if (!data) throw new Error('Không có dữ liệu sao lưu');
    const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
    const a=document.createElement('a'); a.href=url;
    a.download=`hanh-trinh-vinh-quang-${label}-${classroomDate()}-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    return true;
  } catch {
    state.showToast('Không thể xuất bản sao lưu. Vui lòng kiểm tra quyền tải file.', 'error');
    return false;
  }
}
