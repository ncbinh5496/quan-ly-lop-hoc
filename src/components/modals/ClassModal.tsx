import { useShallow } from 'zustand/react/shallow';
import React, { useState, useEffect } from 'react';
import { X, Plus, Save, School, CheckSquare, Square } from 'lucide-react';
import { useStore } from '../../store';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClassId?: string | null;
}

export function ClassModal({ isOpen, onClose, editingClassId }: ClassModalProps) {
  const { classes, createClass, updateClass, showToast } = useStore(useShallow(state => ({ classes: state.classes, createClass: state.createClass, updateClass: state.updateClass, showToast: state.showToast })));
  const [className, setClassName] = useState('');
  const [createDefaultGroups, setCreateDefaultGroups] = useState(true);

  const existingClass = classes[0];

  useEffect(() => {
    if (existingClass) {
      setClassName(existingClass.name);
    } else {
      setClassName('');
      setCreateDefaultGroups(true);
    }
  }, [existingClass, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = className.trim();
    if (!trimmed) {
      showToast('Vui lòng nhập tên lớp học', 'error');
      return;
    }

    if (existingClass) {
      updateClass(existingClass.id, trimmed);
      showToast(`Đã đổi tên lớp thành "${trimmed}"`);
    } else {
      createClass(trimmed, createDefaultGroups);
      showToast(`Đã tạo lớp "${trimmed}" thành công!`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl animate-bounce-in relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
            <School size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">
              {existingClass ? 'Đổi tên lớp học' : 'Thêm lớp học mới'}
            </h3>
            <p className="text-slate-500 text-sm">
              {existingClass ? 'Cập nhật tên hiển thị của lớp' : 'Tạo không gian thi đua cho lớp mới'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tên lớp học <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold text-slate-800 text-lg"
              placeholder="VD: Lớp 2A6, Lớp 3B, Lớp 4C..."
              autoFocus
              required
            />
          </div>

          {!existingClass && (
            <div 
              onClick={() => setCreateDefaultGroups(!createDefaultGroups)}
              className="flex items-center gap-3 p-3 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-xl cursor-pointer transition-colors"
            >
              {createDefaultGroups ? (
                <CheckSquare className="text-orange-600 shrink-0" size={20} />
              ) : (
                <Square className="text-slate-400 shrink-0" size={20} />
              )}
              <span className="text-sm font-medium text-slate-700">
                Tự động tạo sẵn 4 Tổ (Tổ 1, Tổ 2, Tổ 3, Tổ 4)
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-colors flex items-center justify-center gap-2"
            >
              {existingClass ? <Save size={18} /> : <Plus size={18} />}
              {existingClass ? 'Lưu tên' : 'Tạo lớp ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

