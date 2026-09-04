import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Sparkles, 
  Search, 
  GraduationCap, 
  Eye, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../store';
import { cn, getAvatarUrl } from '../../utils/helpers';

export function ParentNoticeBanner() {
  const { 
    userRole, 
    classes, 
    activeClassId, 
    setPinAuthModal, 
    setStudentReportModal, 
    setUserRole,
    teacher
  } = useStore();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const activeClass = classes.find(c => c.id === activeClassId);

  if (userRole !== 'parent') return null;

  const handleSelectStudent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedStudentId(sId);
    if (sId) {
      setStudentReportModal(sId);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white px-3 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-3 shrink-0 select-none z-30 flex-wrap">
      {/* Left info badge */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-amber-300">
          <Eye size={17} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
              👨‍👩‍👧 Chế độ Phụ huynh học sinh
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
              Chỉ đọc
            </span>
          </div>
          <p className="text-[11px] text-purple-100/90 truncate hidden sm:block">
            Theo dõi kết quả học tập, điểm nề nếp và thi đua của các con lớp <strong>{activeClass?.name}</strong>
          </p>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
        {/* Quick Student Selector */}
        {activeClass?.students && activeClass.students.length > 0 && (
          <div className="relative flex items-center">
            <select
              value={selectedStudentId}
              onChange={handleSelectStudent}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all cursor-pointer shadow-2xs max-w-[170px] sm:max-w-[210px] truncate"
            >
              <option value="" className="text-slate-800">
                🔍 Chọn nhanh tên con...
              </option>
              {activeClass.students.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-800">
                  {s.name} ({s.points} sao)
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 text-white/70 pointer-events-none" />
          </div>
        )}

        {/* Teacher Unlock Button */}
        <button
          onClick={() => setPinAuthModal({ 
            isOpen: true, 
            title: 'Mở khóa quyền Giáo viên chủ nhiệm',
            onSuccess: () => setUserRole('teacher')
          })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
          title="Chỉ dành cho Giáo viên chủ nhiệm để chỉnh sửa điểm và thông số"
        >
          <Unlock size={14} className="text-purple-700" />
          <span>Giáo viên đăng nhập</span>
        </button>
      </div>
    </div>
  );
}
