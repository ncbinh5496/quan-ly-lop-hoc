import React from 'react';
import { useStore } from '../../store';
import { FolderHeart } from 'lucide-react';

interface ClassAvatarGallerySectionProps {
  onOpenAvatarGallery: (classId: string) => void;
}

export default function ClassAvatarGallerySection({ onOpenAvatarGallery }: ClassAvatarGallerySectionProps) {
  const classes = useStore(state => state.classes);

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 border border-purple-200">
            <FolderHeart size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Kho Ảnh đại diện theo từng Lớp</h3>
            <p className="text-xs text-slate-500">Mỗi lớp có kho ảnh riêng, hỗ trợ tải ảnh từ máy, chụp camera hoặc dùng mẫu có sẵn</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {classes.map(c => {
          const avatarCount = c.customAvatars?.length || 0;
          return (
            <div 
              key={c.id}
              className="p-4 rounded-2xl border border-purple-100 bg-purple-50/20 hover:bg-purple-50/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-800 text-sm">{c.name}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg">
                    {avatarCount} ảnh riêng
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Đang có {c.students.length} học sinh trong lớp
                </p>
              </div>

              <button
                onClick={() => onOpenAvatarGallery(c.id)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderHeart size={14} /> Mở kho ảnh {c.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
