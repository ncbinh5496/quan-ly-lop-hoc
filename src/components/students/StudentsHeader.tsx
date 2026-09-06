import React, { memo } from 'react';
import { Award, FolderHeart, UserPlus, FileSpreadsheet } from 'lucide-react';
import { ClassData } from '../../types';

interface StudentsHeaderProps {
  activeClass: ClassData;
  customAvatarsCount: number;
  onOpenAwardBadge: () => void;
  onOpenClassGallery: () => void;
  onAddNewStudent: () => void;
  onOpenImport?: () => void;
}

export const StudentsHeader = memo(function StudentsHeader({
  activeClass,
  customAvatarsCount,
  onOpenAwardBadge,
  onOpenClassGallery,
  onAddNewStudent,
  onOpenImport,
}: StudentsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm shadow-purple-500/20">
            👥
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Danh sách học sinh
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Lớp {activeClass.name} • {activeClass.students.length} học sinh • {customAvatarsCount} avatar riêng
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <button
          onClick={onOpenAwardBadge}
          className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          title="Trao tặng huy hiệu danh dự cho học sinh"
        >
          <Award size={15} />
          <span>Trao huy hiệu</span>
        </button>

        <button
          onClick={onOpenClassGallery}
          className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-purple-200 cursor-pointer"
          title="Quản lý kho ảnh đại diện của lớp"
        >
          <FolderHeart size={15} />
          <span>Kho ảnh ({customAvatarsCount})</span>
        </button>

        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-teal-200 cursor-pointer hover:scale-105 active:scale-95"
            title="Nhập danh sách học sinh từ file Excel hoặc CSV"
          >
            <FileSpreadsheet size={15} />
            <span>Nhập Excel</span>
          </button>
        )}

        <button
          onClick={onAddNewStudent}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl text-xs font-black shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
        >
          <UserPlus size={15} />
          <span>Thêm học sinh</span>
        </button>
      </div>
    </div>
  );
});
