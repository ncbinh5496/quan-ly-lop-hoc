import { useShallow } from 'zustand/react/shallow';
import { useState } from 'react';
import { useStore } from '../../store';
import { 
  X, 
  Sparkles, 
  Award, 
  Search, 
  Check, 
  Medal, 
  Users, 
  Flame, 
  Star, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { cn, getAvatarUrl, playSound } from '../../utils/helpers';
import { Badge, Student } from '../../types';
import { BadgeCelebrationModal } from './BadgeCelebrationModal';

interface AwardBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent?: Student | null;
}

export function AwardBadgeModal({ isOpen, onClose, targetStudent }: AwardBadgeModalProps) {
  const { classes, activeClassId, badges, awardBadge, soundEnabled, teacher, showToast } = useStore(useShallow(state => ({ classes: state.classes, activeClassId: state.activeClassId, badges: state.badges, awardBadge: state.awardBadge, soundEnabled: state.soundEnabled, teacher: state.teacher, showToast: state.showToast })));
  
  const activeClass = classes.find(c => c.id === activeClassId);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(targetStudent?.id || '');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'study' | 'discipline' | 'special'>('all');
  
  // Celebration modal triggered after awarding
  const [celebrationData, setCelebrationData] = useState<{
    badge: Badge | null;
    student: Student | null;
    isOpen: boolean;
  }>({
    badge: null,
    student: null,
    isOpen: false
  });

  if (!isOpen || !activeClass) return null;

  const currentStudent = targetStudent || activeClass.students.find(s => s.id === selectedStudentId);

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    const matchSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;

    if (categoryFilter === 'study') {
      return ['Chăm học', 'Viết đẹp', 'Toán giỏi', 'Đọc sách', 'Sáng tạo'].some(n => badge.name.includes(n));
    }
    if (categoryFilter === 'discipline') {
      return ['Chuyên cần', 'Giúp bạn', 'Hợp tác tốt', 'Tiến bộ vượt bậc'].some(n => badge.name.includes(n));
    }
    if (categoryFilter === 'special') {
      return ['Ngôi sao tỏa sáng', 'Chạm tới vòng nguyệt quế', 'Nhà vô địch tuần'].some(n => badge.name.includes(n));
    }
    return true;
  });

  const handleConfirmAward = () => {
    const studentToAward = currentStudent || activeClass.students.find(s => s.id === selectedStudentId);
    const badgeToAward = badges.find(b => b.id === selectedBadgeId);

    if (!studentToAward) {
      showToast('Vui lòng chọn học sinh nhận huy hiệu', 'error');
      return;
    }

    if (!badgeToAward) {
      showToast('Vui lòng chọn một huy hiệu để trao tặng', 'error');
      return;
    }

    // Award badge in store
    awardBadge(studentToAward.id, badgeToAward.id);
    showToast(`Đã trao tặng huy hiệu "${badgeToAward.name}" cho ${studentToAward.name}!`);

    // Trigger celebration ceremony
    setCelebrationData({
      badge: badgeToAward,
      student: studentToAward,
      isOpen: true
    });

    setSelectedBadgeId('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col my-auto transition-all max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner text-xl">
                🎖️
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Trao Tặng Huy Hiệu Danh Dự
                </h3>
                <p className="text-xs text-amber-100 font-medium">
                  {currentStudent ? (
                    <span>Trao tặng cho: <strong className="text-white font-bold">{currentStudent.name}</strong></span>
                  ) : (
                    <span>Lớp <strong className="text-white font-bold">{activeClass.name}</strong> • Chọn học sinh và huy hiệu tương ứng</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-slate-50/50">
            
            {/* Student Selector if not preselected */}
            {!targetStudent && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  1. Chọn Học Sinh Nhận Huy Hiệu:
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="">-- Bấm để chọn học sinh --</option>
                    {activeClass.students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.points} ⭐ • {s.badgeIds.length} huy hiệu)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Target student mini-card */}
            {currentStudent && (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/50 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(currentStudent.avatarId, activeClass.customAvatars)}
                    alt={currentStudent.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-400 bg-white object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-black text-sm text-slate-800">{currentStudent.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-semibold">
                      <span className="text-amber-600 font-bold">⭐ {currentStudent.points} điểm</span>
                      <span>•</span>
                      <span className="text-purple-600 font-bold">🏅 {currentStudent.badgeIds.length} huy hiệu hiện có</span>
                    </div>
                  </div>
                </div>

                {!targetStudent && (
                  <button
                    onClick={() => setSelectedStudentId('')}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold px-2 py-1 bg-white/80 rounded-lg border border-amber-200"
                  >
                    Đổi HS
                  </button>
                )}
              </div>
            )}

            {/* Badge Category & Search */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  2. Chọn Huy Hiệu Danh Dự:
                </label>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                      categoryFilter === 'all'
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    Tất cả ({badges.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('study')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                      categoryFilter === 'study'
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    📚 Học tập
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('discipline')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                      categoryFilter === 'discipline'
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    🤝 Rèn luyện
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('special')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                      categoryFilter === 'special'
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    👑 Đặc biệt
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên huy hiệu hoặc ý nghĩa..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto p-1">
              {filteredBadges.map((badge) => {
                const isSelected = selectedBadgeId === badge.id;
                const isAlreadyOwned = currentStudent?.badgeIds?.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadgeId(badge.id)}
                    className={cn(
                      "p-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between cursor-pointer relative group",
                      isSelected
                        ? "border-amber-500 bg-amber-50 shadow-md scale-102 ring-2 ring-amber-400/40"
                        : isAlreadyOwned
                        ? "border-purple-200 bg-purple-50/50 hover:border-purple-300"
                        : "border-slate-200/80 bg-white hover:border-amber-300 hover:bg-amber-50/30"
                    )}
                  >
                    {isAlreadyOwned && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded-md text-[9px] font-black tracking-tight">
                        Đã có
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                        <Check size={12} />
                      </div>
                    )}

                    <div className="text-3xl my-1 transform group-hover:scale-115 transition-transform duration-300">
                      {badge.icon}
                    </div>

                    <div className="w-full">
                      <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                        {badge.name}
                      </h5>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleConfirmAward}
              disabled={!selectedBadgeId || (!targetStudent && !selectedStudentId)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} />
              <span>TRAO HUY HIỆU NGAY</span>
            </button>
          </div>

        </div>
      </div>

      {/* Celebration Modal Ceremony */}
      <BadgeCelebrationModal
        isOpen={celebrationData.isOpen}
        onClose={() => {
          setCelebrationData(prev => ({ ...prev, isOpen: false }));
          onClose();
        }}
        badge={celebrationData.badge}
        student={celebrationData.student}
        currentClass={activeClass}
        teacher={teacher}
        soundEnabled={soundEnabled}
      />
    </>
  );
}

