import React, { useState, useRef } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Check, 
  Copy, 
  ExternalLink, 
  QrCode, 
  KeyRound, 
  School, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useStore } from '../../store';
import { TeacherWorkspace } from '../../types';

interface TeacherWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherWorkspaceModal({ isOpen, onClose }: TeacherWorkspaceModalProps) {
  const workspaces = useStore(state => state.workspaces);
  const activeWorkspaceId = useStore(state => state.activeWorkspaceId);
  const switchWorkspace = useStore(state => state.switchWorkspace);
  const createWorkspace = useStore(state => state.createWorkspace);
  const updateWorkspace = useStore(state => state.updateWorkspace);
  const deleteWorkspace = useStore(state => state.deleteWorkspace);
  const showToast = useStore(state => state.showToast);

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [editingWs, setEditingWs] = useState<TeacherWorkspace | null>(null);

  // New Workspace form state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newHomeroomClass, setNewHomeroomClass] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('Trường Tiểu học Lê Quý Đôn');
  const [newGrade, setNewGrade] = useState('Khối 3');
  const [newSubject, setNewSubject] = useState('Giáo viên chủ nhiệm');
  const [newAcademicYear, setNewAcademicYear] = useState('2026-2027');
  const [newPin, setNewPin] = useState('1234');
  const [addDemoStudents, setAddDemoStudents] = useState(true);

  // QR Modal state
  const [qrModalInfo, setQrModalInfo] = useState<{ title: string; url: string; qrDataUrl: string } | null>(null);
  
  // Delete confirmation state
  const [deletingWs, setDeletingWs] = useState<TeacherWorkspace | null>(null);

  const confirmDelete = () => {
    if (!deletingWs) return;
    deleteWorkspace(deletingWs.id);
    setDeletingWs(null);
  };

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  const getTeacherUrl = (wsId: string) => {
    return `${currentOrigin}?workspace=${wsId}&role=teacher`;
  };

  const getParentUrl = (wsId: string) => {
    return `${currentOrigin}?workspace=${wsId}&role=parent`;
  };

  const handleCopyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(`Đã sao chép liên kết ${label}!`, 'success');
    } catch {
      showToast('Không thể sao chép tự động', 'error');
    }
  };

  const handleShowQr = (title: string, url: string) => {
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&margin=8`;
    setQrModalInfo({ title, url, qrDataUrl: qrData });
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) {
      showToast('Vui lòng nhập tên Giáo viên', 'error');
      return;
    }
    if (!newHomeroomClass.trim()) {
      showToast('Vui lòng nhập tên lớp chủ nhiệm (VD: Lớp 3A)', 'error');
      return;
    }

    createWorkspace({
      name: newTeacherName.trim(),
      homeroomClass: newHomeroomClass.trim(),
      schoolName: newSchoolName.trim(),
      grade: newGrade.trim(),
      subject: newSubject.trim(),
      academicYear: newAcademicYear.trim(),
      pin: newPin.trim() || '1234',
    }, {
      copyCurrentTemplates: true,
      addDemoClass: addDemoStudents,
    });

    setActiveTab('list');
    onClose();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWs) return;

    updateWorkspace(editingWs.id, {
      name: editingWs.name,
      homeroomClass: editingWs.homeroomClass,
      schoolName: editingWs.schoolName,
      grade: editingWs.grade,
      subject: editingWs.subject,
      academicYear: editingWs.academicYear,
      pin: editingWs.pin || '1234',
      appTitle: editingWs.appTitle,
      appSlogan: editingWs.appSlogan,
    });

    showToast('Đã cập nhật thông tin Giáo viên thành công!', 'success');
    setActiveTab('list');
    setEditingWs(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 overflow-y-auto p-2 sm:p-4 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 max-w-2xl w-full shadow-2xl animate-bounce-in relative my-auto max-h-[92vh] flex flex-col border border-purple-100 shrink-0">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-500/20 shrink-0">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Không Gian Giáo Viên Độc Lập
              </h3>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Độc lập 100%
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              Quản lý riêng biệt danh sách lớp, học sinh, điểm thi đua và mã PIN cho từng Giáo viên
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-2xl mb-4 shrink-0">
          <button
            onClick={() => { setActiveTab('list'); setEditingWs(null); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'list' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={16} />
            <span>Danh sách Giáo viên ({workspaces.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'create' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus size={16} />
            <span>+ Thêm Giáo viên mới</span>
          </button>
        </div>

        {/* TAB 1: LIST OF TEACHER WORKSPACES */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[58vh]">
            {workspaces.map((ws, idx) => {
              const isActive = ws.id === activeWorkspaceId;
              const studentCount = (ws.classes || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);
              const teacherLink = getTeacherUrl(ws.id);
              const parentLink = getParentUrl(ws.id);

              return (
                <div 
                  key={`${ws.id}_${ws.homeroomClass}_${idx}`}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-br from-purple-50/90 via-indigo-50/60 to-pink-50/60 border-purple-300 shadow-md shadow-purple-500/5 ring-2 ring-purple-400/30' 
                      : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-sm shrink-0">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl overflow-hidden font-black text-purple-700">
                          {ws.avatarUrl ? (
                            <img src={ws.avatarUrl} alt={ws.name} className="w-full h-full object-cover" />
                          ) : (
                            idx % 2 === 0 ? '👩‍🏫' : '👨‍🏫'
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-slate-800 truncate">
                            {ws.name}
                          </h4>
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            {ws.homeroomClass || 'Lớp chủ nhiệm'}
                          </span>
                          {isActive && (
                            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-xs animate-pulse">
                              <Check size={12} /> Đang làm việc
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <School size={13} className="text-slate-400" /> {ws.schoolName || 'Tiểu học'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <KeyRound size={13} className="text-slate-400" /> PIN: <strong className="text-slate-700">{ws.pin || '1234'}</strong>
                          </span>
                          <span>•</span>
                          <span>{ws.classes?.length || 1} lớp ({studentCount} học sinh)</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingWs(ws);
                          setActiveTab('edit');
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-100/60 transition-colors cursor-pointer"
                        title="Chỉnh sửa thông tin giáo viên"
                      >
                        <Edit3 size={16} />
                      </button>
                      {workspaces.length > 1 && (
                        <button
                          onClick={() => setDeletingWs(ws)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa không gian này"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS FOR THIS TEACHER */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleCopyLink(teacherLink, `Giáo viên (${ws.name})`)}
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1.5 rounded-lg bg-purple-100/80 hover:bg-purple-200/80 text-purple-800 transition-colors cursor-pointer active:scale-95"
                        title="Sao chép link làm việc trực tiếp cho Giáo viên này"
                      >
                        <Copy size={12} />
                        <span>Link Giáo viên</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(parentLink, `Phụ huynh (${ws.homeroomClass})`)}
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1.5 rounded-lg bg-indigo-100/80 hover:bg-indigo-200/80 text-indigo-800 transition-colors cursor-pointer active:scale-95"
                        title="Sao chép link xem sổ điểm dành riêng cho Phụ huynh lớp này"
                      >
                        <Copy size={12} />
                        <span>Link Phụ huynh</span>
                      </button>

                      <button
                        onClick={() => handleShowQr(`Mã QR Giáo viên - ${ws.name}`, teacherLink)}
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Tạo mã QR để quét nhanh bằng điện thoại"
                      >
                        <QrCode size={12} />
                        <span>QR</span>
                      </button>
                    </div>

                    {!isActive ? (
                      <button
                        onClick={() => {
                          switchWorkspace(ws.id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95 ml-auto"
                      >
                        <span>Chuyển sang làm việc</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="text-xs font-black text-purple-700 ml-auto flex items-center gap-1">
                        ★ Không gian hiện tại
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CREATE NEW WORKSPACE */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateNew} className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[58vh]">
            <div className="bg-purple-50/70 border border-purple-100 p-3.5 rounded-2xl text-xs text-purple-900 font-medium">
              ✨ <strong>Mỗi Giáo viên sẽ có một không gian làm việc hoàn toàn độc lập</strong>: Có lớp học riêng, học sinh riêng, hệ thống điểm và mã PIN bảo mật riêng biệt.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Họ và tên Giáo viên *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Ví dụ: Thầy Minh Đức, Cô Mai..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Lớp chủ nhiệm ban đầu *
                </label>
                <input
                  type="text"
                  required
                  value={newHomeroomClass}
                  onChange={(e) => setNewHomeroomClass(e.target.value)}
                  placeholder="Ví dụ: Lớp 4B, Lớp 1A2..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Tên trường học
                </label>
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder="Trường Tiểu học..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Khối lớp & Môn phụ trách
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="Khối 4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Chủ nhiệm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mã PIN bảo mật riêng của Giáo viên
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold tracking-widest focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Năm học
                </label>
                <input
                  type="text"
                  value={newAcademicYear}
                  onChange={(e) => setNewAcademicYear(e.target.value)}
                  placeholder="2026-2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={addDemoStudents}
                  onChange={(e) => setAddDemoStudents(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Khởi tạo sẵn 3 học sinh mẫu</p>
                  <p className="text-[11px] text-slate-500">Giúp giáo viên dễ dàng hình dung giao diện ngay khi vừa tạo</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>Tạo Không Gian Giáo Viên Mới</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: EDIT EXISTING WORKSPACE */}
        {activeTab === 'edit' && editingWs && (
          <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[58vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Họ và tên Giáo viên
                </label>
                <input
                  type="text"
                  required
                  value={editingWs.name}
                  onChange={(e) => setEditingWs({ ...editingWs, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Lớp chủ nhiệm
                </label>
                <input
                  type="text"
                  required
                  value={editingWs.homeroomClass}
                  onChange={(e) => setEditingWs({ ...editingWs, homeroomClass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Tên trường học
                </label>
                <input
                  type="text"
                  value={editingWs.schoolName}
                  onChange={(e) => setEditingWs({ ...editingWs, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mã PIN bảo mật (4-6 số)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={editingWs.pin}
                  onChange={(e) => setEditingWs({ ...editingWs, pin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold tracking-widest focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Khẩu hiệu / Tiêu đề hành trình
                </label>
                <input
                  type="text"
                  value={editingWs.appTitle || ''}
                  onChange={(e) => setEditingWs({ ...editingWs, appTitle: e.target.value })}
                  placeholder="HÀNH TRÌNH CHINH PHỤC VINH QUANG"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setActiveTab('list'); setEditingWs(null); }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}

        {/* QR CODE OVERLAY MODAL */}
        {qrModalInfo && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl animate-bounce-in relative">
              <button
                onClick={() => setQrModalInfo(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
              
              <h4 className="text-base font-black text-slate-800 mb-1">
                {qrModalInfo.title}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Quét bằng camera điện thoại để mở trực tiếp
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-purple-100 inline-block mb-4 shadow-inner">
                <img src={qrModalInfo.qrDataUrl} alt="QR Code" className="w-56 h-56 mx-auto rounded-lg" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(qrModalInfo.url, 'Liên kết')}
                  className="flex-1 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} /> Sao chép link
                </button>
                <a
                  href={qrModalInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink size={14} /> Mở
                </a>
              </div>
            </div>
          </div>
        )}

        {/* DELETE WORKSPACE CONFIRMATION MODAL */}
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
    </div>
  );
}
