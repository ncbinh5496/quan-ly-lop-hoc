import React, { memo } from 'react';
import { X, Camera, Trash2, Save } from 'lucide-react';
import { Student, ClassData } from '../../types';
import { getAvatarUrl } from '../../utils/helpers';

interface StudentEditModalProps {
  editingStudent: Partial<Student>;
  activeClass: ClassData;
  onClose: () => void;
  onChange: (updated: Partial<Student>) => void;
  onOpenAvatarPicker: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}

export const StudentEditModal = memo(function StudentEditModal({
  editingStudent,
  activeClass,
  onClose,
  onChange,
  onOpenAvatarPicker,
  onSave,
  onDelete,
}: StudentEditModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-bounce-in relative border border-purple-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shadow-xs">
            {editingStudent.id ? '✏️' : '🌟'}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">
              {editingStudent.id ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {activeClass.name}
            </p>
          </div>
        </div>

        {/* Delete Confirmation View */}
        {isConfirmingDelete ? (
          <div className="my-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-2.5">
              <Trash2 size={24} />
            </div>
            <h4 className="font-black text-slate-900 text-sm mb-1">
              Xóa học sinh "{editingStudent.name}"?
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              Toàn bộ điểm số, huy hiệu và dữ liệu liên quan của học sinh này sẽ bị xóa.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingStudent.id) onDelete(editingStudent.id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Avatar Selector Preview */}
            <div className="mb-5 p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border-2 border-purple-200 p-1 overflow-hidden shrink-0">
                  <img 
                    src={getAvatarUrl(editingStudent.avatarId || (editingStudent.gender === 'Nam' ? 'boy-1' : 'girl-1'), activeClass.customAvatars)} 
                    alt="Avatar Preview" 
                    className="w-full h-full rounded-xl object-cover" 
                  />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">Ảnh đại diện</p>
                  <p className="text-[11px] text-slate-500">Mẫu có sẵn hoặc ảnh riêng</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAvatarPicker}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={13} /> Đổi ảnh
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={editingStudent.name || ''}
                  onChange={(e) => onChange({ ...editingStudent, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-sm text-slate-800"
                  placeholder="Nhập tên học sinh..."
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Giới tính
                  </label>
                  <select 
                    value={editingStudent.gender || 'Nữ'}
                    onChange={(e) => {
                      const newGender = e.target.value as 'Nam'|'Nữ';
                      const currentIsDefault = !editingStudent.avatarId || editingStudent.avatarId.startsWith('boy-') || editingStudent.avatarId.startsWith('girl-');
                      const updatedAvatar = currentIsDefault ? (newGender === 'Nam' ? 'boy-1' : 'girl-1') : editingStudent.avatarId;
                      onChange({
                        ...editingStudent, 
                        gender: newGender,
                        avatarId: updatedAvatar
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-sm text-slate-800"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Tổ / Nhóm
                  </label>
                  <select 
                    value={editingStudent.groupId || ''}
                    onChange={(e) => onChange({ ...editingStudent, groupId: e.target.value || undefined })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-sm text-slate-800"
                  >
                    <option value="">Chưa phân tổ</option>
                    {activeClass.groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              {editingStudent.id && (
                <button 
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl font-bold transition-colors flex items-center justify-center cursor-pointer"
                  title="Xóa học sinh này"
                >
                  <Trash2 size={18} />
                </button>
              )}
              
              <button 
                onClick={onSave}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={18} /> Lưu học sinh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
