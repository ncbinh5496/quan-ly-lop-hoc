import React from 'react';
import { useStore } from '../../store';
import { School, Plus, Pencil, Trash2 } from 'lucide-react';

interface ClassSettingsProps {
  onAddClass?: () => void;
  onEditClass: (classId: string) => void;
}

export default function ClassSettings({ onEditClass }: ClassSettingsProps) {
  const classes = useStore(state => state.classes);
  const activeClassId = useStore(state => state.activeClassId);

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100/80 flex items-center justify-center text-orange-600 border border-orange-200">
            <School size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Quản lý Lớp học</h3>
            <p className="text-xs text-slate-500">Thông tin và đổi tên lớp học phụ trách</p>
          </div>
        </div>

        {classes[0] && (
          <button
            onClick={() => onEditClass(classes[0].id)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <Pencil size={15} /> Đổi tên lớp
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {classes.map((c) => {
          return (
            <div 
              key={c.id} 
              className="p-5 rounded-2xl border-2 border-orange-400 bg-orange-50/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-800 text-lg">{c.name}</h4>
                  <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                    Lớp chủ nhiệm
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  {c.students.length} học sinh • {c.groups.length} tổ thi đua
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditClass(c.id)}
                  className="px-3.5 py-2 bg-white hover:bg-orange-500 hover:text-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-orange-500 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil size={14} /> Chỉnh sửa thông tin lớp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
