import React from 'react';
import { useStore } from '../../store';
import { School, Plus, Pencil, Trash2 } from 'lucide-react';

interface ClassSettingsProps {
  onAddClass: () => void;
  onEditClass: (classId: string) => void;
}

export default function ClassSettings({ onAddClass, onEditClass }: ClassSettingsProps) {
  const classes = useStore(state => state.classes);
  const activeClassId = useStore(state => state.activeClassId);
  const setActiveClass = useStore(state => state.setActiveClass);
  const deleteClass = useStore(state => state.deleteClass);
  const showToast = useStore(state => state.showToast);

  const [classToDelete, setClassToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const confirmDeleteClass = () => {
    if (!classToDelete) return;
    if (classes.length <= 1) {
      showToast('Hệ thống phải có ít nhất 1 lớp học. Không thể xóa lớp duy nhất.', 'error');
      setClassToDelete(null);
      return;
    }

    deleteClass(classToDelete.id);
    showToast(`Đã xóa lớp "${classToDelete.name}"`);
    setClassToDelete(null);
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100/80 flex items-center justify-center text-orange-600 border border-orange-200">
            <School size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Quản lý Lớp học</h3>
            <p className="text-xs text-slate-500">Tạo mới, đổi tên hoặc chuyển đổi giữa các lớp</p>
          </div>
        </div>

        <button
          onClick={onAddClass}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95"
        >
          <Plus size={16} /> Thêm lớp mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes.map((c) => {
          const isActive = c.id === activeClassId;
          return (
            <div 
              key={c.id} 
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-orange-400 bg-orange-50/40 shadow-sm' 
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 text-base">{c.name}</h4>
                    {isActive && (
                      <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {c.students.length} học sinh • {c.groups.length} tổ
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditClass(c.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Đổi tên lớp"
                  >
                    <Pencil size={15} />
                  </button>
                  {classes.length > 1 && (
                    <button
                      onClick={() => setClassToDelete({ id: c.id, name: c.name })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa lớp"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {!isActive && (
                <button
                  onClick={() => {
                    setActiveClass(c.id);
                    showToast(`Đã chuyển sang ${c.name}`);
                  }}
                  className="w-full mt-2 py-2 bg-white hover:bg-orange-500 hover:text-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-orange-500 transition-colors shadow-2xs cursor-pointer"
                >
                  Chọn làm việc với lớp này
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Class Delete Confirmation Modal */}
      {classToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Xóa lớp "{classToDelete.name}"?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Tất cả danh sách học sinh, điểm số, lịch sử và dữ liệu của lớp này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClassToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteClass}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
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
