import { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Check, 
  Users, 
  Gift, 
  CheckCheck, 
  UserCheck, 
  Play, 
  Star,
  Award,
  Filter
} from 'lucide-react';
import { useStore, useActiveClass } from '../../store';
import { Badge, Student } from '../../types';
import { cn, getAvatarUrl } from '../../utils/helpers';

interface AwardBadgeToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
  onAwardSuccess: (badge: Badge, awardedStudents: Student[]) => void;
  onPreviewCelebration?: (badge: Badge) => void;
}

export function AwardBadgeToStudentModal({
  isOpen,
  onClose,
  badge,
  onAwardSuccess,
  onPreviewCelebration
}: AwardBadgeToStudentModalProps) {
  const activeClass = useActiveClass();
  const awardBadge = useStore(state => state.awardBadge);
  const showToast = useStore(state => state.showToast);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'unowned' | 'owned'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [reasonNote, setReasonNote] = useState('');

  // Reset selections when badge changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStudentIds([]);
      setSearchTerm('');
      setSelectedGroup('all');
      setOwnershipFilter('all');
      setReasonNote('');
    }
  }, [isOpen, badge?.id]);

  // Students list filtered
  const filteredStudents = useMemo(() => {
    if (!activeClass?.students || !badge) return [];

    return activeClass.students.filter(student => {
      // 1. Search term
      const matchesSearch = searchTerm.trim() === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      if (!matchesSearch) return false;

      // 2. Group filter
      if (selectedGroup !== 'all' && student.groupId !== selectedGroup) {
        return false;
      }

      // 3. Ownership filter
      const alreadyHas = student.badgeIds?.includes(badge.id);
      if (ownershipFilter === 'unowned' && alreadyHas) return false;
      if (ownershipFilter === 'owned' && !alreadyHas) return false;

      return true;
    });
  }, [activeClass?.students, badge, searchTerm, selectedGroup, ownershipFilter]);

  if (!isOpen || !badge || !activeClass) return null;

  const currentBadgeStudentCount = activeClass.students.filter(s => s.badgeIds?.includes(badge.id)).length;

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredStudents.map(s => s.id);
    const areAllSelected = allFilteredIds.every(id => selectedStudentIds.includes(id));

    if (areAllSelected) {
      // Deselect filtered
      setSelectedStudentIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Add all filtered
      setSelectedStudentIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleConfirmAward = () => {
    if (selectedStudentIds.length === 0) {
      showToast('Vui lòng chọn ít nhất một học sinh để trao tặng', 'error');
      return;
    }

    const awardedStudents: Student[] = [];
    selectedStudentIds.forEach(id => {
      awardBadge(id, badge.id);
      const student = activeClass.students.find(s => s.id === id);
      if (student) awardedStudents.push(student);
    });

    const studentNames = awardedStudents.length <= 3 
      ? awardedStudents.map(s => s.name).join(', ')
      : `${awardedStudents[0].name}, ${awardedStudents[1].name} và ${awardedStudents.length - 2} học sinh khác`;

    showToast(`Đã trao tặng huy hiệu "${badge.name}" cho ${studentNames}!`);
    onAwardSuccess(badge, awardedStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl border border-amber-200/80 w-full max-w-3xl overflow-hidden flex flex-col my-auto transition-all max-h-[92vh]">
        
        {/* 1. Header with Badge Identity */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-b border-white/20 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 shadow-inner flex items-center justify-center text-4xl transform hover:scale-110 transition-transform select-none">
                {badge.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-black uppercase tracking-wider">
                    Trao tặng huy hiệu
                  </span>
                  <span className="text-amber-100 text-xs font-semibold">
                    Đã có {currentBadgeStudentCount}/{activeClass.students.length} HS đạt được
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                  {badge.name}
                </h3>
                <p className="text-xs sm:text-sm text-amber-50 font-medium line-clamp-1 max-w-xl">
                  {badge.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onPreviewCelebration && (
                <button
                  type="button"
                  onClick={() => onPreviewCelebration(badge)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Xem trước hoạt ảnh vinh danh"
                >
                  <Play size={13} className="fill-current" />
                  <span className="hidden sm:inline">Xem hiệu ứng</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Body - Filter & Student Selection */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-slate-50/70 flex-1">
          
          {/* Controls Bar: Search + Group Tabs + Quick Select */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm học sinh theo tên..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Quick Select All Button */}
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                disabled={filteredStudents.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40"
              >
                <CheckCheck size={16} />
                <span>
                  {filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.includes(s.id))
                    ? 'Bỏ chọn tất cả'
                    : `Chọn tất cả (${filteredStudents.length})`}
                </span>
              </button>
            </div>

            {/* Groups filter pills */}
            {activeClass.groups && activeClass.groups.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter size={11} /> Tổ/Nhóm:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGroup('all')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                    selectedGroup === 'all'
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Tất cả ({activeClass.students.length})
                </button>
                {activeClass.groups.map(group => {
                  const groupCount = activeClass.students.filter(s => s.groupId === group.id).length;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroup(group.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                        selectedGroup === group.id
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {group.name} ({groupCount})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Students Grid */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-amber-500" />
                <span>Danh sách học sinh ({filteredStudents.length})</span>
              </span>
              <span className="text-xs font-bold text-amber-700">
                Đã chọn: <strong className="font-black text-amber-600 text-sm">{selectedStudentIds.length}</strong> em
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
                <p className="text-sm font-bold">Không tìm thấy học sinh nào phù hợp bộ lọc</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGroup('all');
                  }}
                  className="mt-2 text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                {filteredStudents.map(student => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const alreadyHasBadge = student.badgeIds?.includes(badge.id);
                  const group = activeClass.groups?.find(g => g.id === student.groupId);

                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={cn(
                        "relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center select-none group",
                        isSelected
                          ? "border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300/50 scale-102"
                          : alreadyHasBadge
                          ? "border-slate-200 bg-white/80 hover:border-amber-300"
                          : "border-slate-200/90 bg-white hover:border-amber-300 hover:shadow-xs"
                      )}
                    >
                      {/* Checkbox indicator */}
                      <div className={cn(
                        "absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all",
                        isSelected
                          ? "bg-amber-500 text-white shadow-xs scale-110"
                          : "border-2 border-slate-300 bg-white group-hover:border-amber-400"
                      )}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>

                      {/* Already has badge tag */}
                      {alreadyHasBadge && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-100/90 text-amber-800 text-[9px] font-black flex items-center gap-0.5 border border-amber-200" title="Học sinh này đã từng nhận huy hiệu này">
                          <Award size={9} />
                          <span>Đã có</span>
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="relative mt-2 mb-1.5">
                        <img
                          src={getAvatarUrl(student.avatarId, activeClass.customAvatars)}
                          alt={student.name}
                          className={cn(
                            "w-12 h-12 rounded-full object-cover bg-slate-50 border-2 transition-all shadow-2xs",
                            isSelected ? "border-amber-400" : "border-slate-200 group-hover:border-amber-300"
                          )}
                        />
                      </div>

                      {/* Name & details */}
                      <div className="w-full">
                        <h4 className="font-black text-xs text-slate-800 line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {student.name}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-semibold">
                          <span className="text-amber-600 font-bold">⭐ {student.points}</span>
                          {group && (
                            <>
                              <span>•</span>
                              <span className="text-purple-600 line-clamp-1">{group.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* 3. Footer Action Bar */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            {selectedStudentIds.length === 0 ? (
              <span>Bấm vào học sinh để chọn người nhận huy hiệu</span>
            ) : (
              <span>
                Chuẩn bị trao huy hiệu <strong className="text-amber-700 font-bold">"{badge.name}"</strong> cho <strong className="text-slate-900 font-black">{selectedStudentIds.length}</strong> học sinh
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleConfirmAward}
              disabled={selectedStudentIds.length === 0}
              className="w-2/3 sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} />
              <span>
                {selectedStudentIds.length <= 1 
                  ? 'Trao huy hiệu ngay' 
                  : `Trao cho ${selectedStudentIds.length} học sinh`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
