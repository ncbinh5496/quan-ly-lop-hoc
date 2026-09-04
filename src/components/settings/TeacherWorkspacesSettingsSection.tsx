import React, { useState } from 'react';
import { Users, Plus, KeyRound, School, Copy, ExternalLink, ArrowRight, Check, Sparkles, Trash2, X } from 'lucide-react';
import { useStore } from '../../store';
import { TeacherWorkspace } from '../../types';

export default function TeacherWorkspacesSettingsSection() {
  const workspaces = useStore(state => state.workspaces);
  const activeWorkspaceId = useStore(state => state.activeWorkspaceId);
  const switchWorkspace = useStore(state => state.switchWorkspace);
  const deleteWorkspace = useStore(state => state.deleteWorkspace);
  const setWorkspaceModal = useStore(state => state.setWorkspaceModal);
  const showToast = useStore(state => state.showToast);

  const [deletingWs, setDeletingWs] = useState<TeacherWorkspace | null>(null);

  const confirmDelete = () => {
    if (!deletingWs) return;
    deleteWorkspace(deletingWs.id);
    setDeletingWs(null);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  const handleCopyLink = async (wsId: string, role: 'teacher' | 'parent', label: string) => {
    const url = `${currentOrigin}?workspace=${wsId}&role=${role}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(`Đã sao chép link ${label}!`, 'success');
    } catch {
      showToast('Không thể sao chép tự động', 'error');
    }
  };

  return (
    <div className="bg-white/95 p-6 rounded-[28px] border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.05)] space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-sm">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Không Gian Nhiều Giáo Viên Độc Lập
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {workspaces.length} Giáo viên
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hệ thống cho phép 2 hoặc nhiều Giáo viên sử dụng hoàn toàn độc lập với danh sách lớp, học sinh, điểm và mã PIN riêng biệt.
            </p>
          </div>
        </div>

        <button
          onClick={() => setWorkspaceModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 ml-auto"
        >
          <Plus size={15} />
          <span>Thêm & Quản lý Giáo viên</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {workspaces.map((ws, idx) => {
          const isActive = ws.id === activeWorkspaceId;
          const studentCount = (ws.classes || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);

          return (
            <div
              key={`${ws.id}_${ws.homeroomClass}_${idx}`}
              className={`p-4 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-50/90 to-indigo-50/70 border-purple-300 shadow-sm ring-2 ring-purple-400/20' 
                  : 'bg-slate-50/80 hover:bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shrink-0 shadow-2xs">
                    <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center text-lg font-black text-purple-700 overflow-hidden">
                      {ws.avatarUrl ? (
                        <img src={ws.avatarUrl} alt={ws.name} className="w-full h-full object-cover" />
                      ) : (
                        idx % 2 === 0 ? '👩‍🏫' : '👨‍🏫'
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-black text-slate-800 truncate">
                        {ws.name}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                        {ws.homeroomClass}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                          <Check size={10} /> Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                      {ws.schoolName || 'Trường Tiểu học'} • PIN: <strong>{ws.pin || '1234'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {workspaces.length > 1 && (
                    <button
                      onClick={() => setDeletingWs(ws)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa không gian Giáo viên này"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}

                  {!isActive && (
                    <button
                      onClick={() => switchWorkspace(ws.id)}
                      className="p-1.5 px-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                      title="Chuyển sang làm việc với Giáo viên này"
                    >
                      <span>Chọn</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 gap-2 flex-wrap">
                <span>{ws.classes?.length || 1} lớp học ({studentCount} HS)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyLink(ws.id, 'teacher', `Giáo viên (${ws.name})`)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Sao chép link làm việc trực tiếp cho Giáo viên này"
                  >
                    <Copy size={11} /> Link GV
                  </button>
                  <button
                    onClick={() => handleCopyLink(ws.id, 'parent', `Phụ huynh (${ws.homeroomClass})`)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Sao chép link chỉ đọc cho Phụ huynh lớp này"
                  >
                    <Copy size={11} /> Link PH
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingWs && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-rose-100 animate-bounce-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
              <Trash2 size={28} />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">
              Xóa không gian Giáo viên?
            </h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa không gian của <strong>{deletingWs.name}</strong> ({deletingWs.homeroomClass}) không? Toàn bộ danh sách học sinh và điểm số của không gian này sẽ bị xóa.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingWs(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer active:scale-95"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
