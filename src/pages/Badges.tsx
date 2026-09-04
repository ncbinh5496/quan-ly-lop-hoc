import React, { useState, useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { 
  Medal, 
  Sparkles, 
  Search, 
  Trophy, 
  Award, 
  Users, 
  Play,
  Clock,
  BookOpen, 
  RotateCcw 
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { Badge, Student } from '../types';
import { BadgeCelebrationModal } from '../components/modals/BadgeCelebrationModal';
import { ResetProgressModal } from '../components/modals/ResetProgressModal';
import { getBadgeCelebrationTheme } from '../utils/badgeCelebration';

export default function Badges() {
  const badges = useStore(state => state.badges);
  const awardBadge = useStore(state => state.awardBadge);
  const soundEnabled = useStore(state => state.soundEnabled);
  const teacher = useStore(state => state.teacher);
  const userRole = useStore(state => state.userRole);

  const isParent = userRole === 'parent';
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'study' | 'discipline' | 'special'>('all');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Celebration Modal state
  const [celebrationData, setCelebrationData] = useState<{
    badge: Badge | null;
    student: Student | null;
    isOpen: boolean;
  }>({
    badge: null,
    student: null,
    isOpen: false
  });
  
  const activeClass = useActiveClass();

  // Pre-index students for O(1) lookups
  const studentsMap = useMemo(() => {
    const map = new Map<string, typeof activeClass.students[0]>();
    if (activeClass?.students) {
      activeClass.students.forEach(s => map.set(s.id, s));
    }
    return map;
  }, [activeClass?.students]);

  // Filter badges with useMemo
  const filteredBadges = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return badges.filter(badge => {
      const matchSearch = term ? (
        badge.name.toLowerCase().includes(term) || 
        badge.description.toLowerCase().includes(term)
      ) : true;
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
  }, [badges, searchTerm, categoryFilter]);

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để xem huy hiệu.</p>
      </div>
    );
  }

  const handleAward = () => {
    if (selectedBadge && selectedStudentId) {
      const student = studentsMap.get(selectedStudentId);
      if (!student) return;

      awardBadge(selectedStudentId, selectedBadge.id);

      setCelebrationData({
        badge: selectedBadge,
        student: student,
        isOpen: true
      });

      setSelectedBadge(null);
      setSelectedStudentId('');
    }
  };

  const handlePreviewCelebration = (badge: Badge, e: React.MouseEvent) => {
    e.stopPropagation();
    const demoStudent: Student = activeClass.students[0] || {
      id: 'demo',
      name: 'Học Sinh Tiêu Biểu',
      gender: 'Nữ',
      points: 100,
      totalPositivePoints: 100,
      totalNegativePoints: 0,
      avatarId: 'girl-1',
      badgeIds: [],
      status: 'active'
    };

    setCelebrationData({
      badge,
      student: demoStudent,
      isOpen: true
    });
  };

  const getBadgeStudentCount = (badgeId: string) => {
    return activeClass.students.filter(s => s.badgeIds?.includes(badgeId)).length;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-[32px] p-6 sm:p-8 text-white shadow-[0_16px_36px_rgba(245,158,11,0.18)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-inner">
            🎖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-white/20 text-[10px] font-black uppercase rounded-full tracking-wider border border-white/30">
                Hệ thống Khen thưởng
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight mt-1">
              Bộ sưu tập Huy hiệu danh dự
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-medium mt-0.5">
              Trao danh hiệu với hoạt ảnh vinh danh, âm nhạc pháo hoa và lời khen ý nghĩa cho học sinh lớp {activeClass.name}
            </p>
          </div>
        </div>

        {/* Quick Stats & Reset Action */}
        <div className="flex items-center gap-2.5 relative z-10 flex-wrap">
          <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Tổng Huy hiệu</div>
            <div className="text-base sm:text-lg font-black">{badges.length} loại</div>
          </div>
          <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Đã Trao Tặng</div>
            <div className="text-base sm:text-lg font-black">
              {activeClass.students.reduce((sum, s) => sum + (s.badgeIds?.length || 0), 0)} lượt
            </div>
          </div>
          {!isParent ? (
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-3.5 py-2.5 bg-black/30 hover:bg-black/45 text-white backdrop-blur-md rounded-2xl border border-white/25 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              title="Reset toàn bộ huy hiệu đã trao của lớp"
            >
              <RotateCcw size={14} className="text-amber-300" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/25 text-amber-200 text-xs font-bold">
              🛡️ Phụ huynh (Chỉ xem)
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-[24px] border border-purple-100/80 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
              categoryFilter === 'all'
                ? "bg-amber-500 text-white shadow-sm scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Tất cả ({badges.length})
          </button>
          <button
            onClick={() => setCategoryFilter('study')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
              categoryFilter === 'study'
                ? "bg-amber-500 text-white shadow-sm scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <BookOpen size={13} /> Học tập
          </button>
          <button
            onClick={() => setCategoryFilter('discipline')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
              categoryFilter === 'discipline'
                ? "bg-amber-500 text-white shadow-sm scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Clock size={13} /> Rèn luyện & Kỷ luật
          </button>
          <button
            onClick={() => setCategoryFilter('special')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer",
              categoryFilter === 'special'
                ? "bg-amber-500 text-white shadow-sm scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Trophy size={13} /> Vinh quang
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên huy hiệu..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBadges.map(badge => {
          const isSelected = selectedBadge?.id === badge.id;
          const studentCount = getBadgeStudentCount(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={cn(
                "relative bg-white/95 rounded-[24px] p-4 text-center shadow-[0_8px_24px_rgba(124,58,237,0.04)] border-2 transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl",
                isSelected 
                  ? "border-amber-400 ring-4 ring-amber-200/60 bg-amber-50/50 shadow-md scale-105" 
                  : "border-purple-100/80 hover:border-amber-300"
              )}
            >
              {/* Badge Icon */}
              <div className="relative mb-3 flex items-center justify-center">
                <div className="text-5xl sm:text-6xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-sm select-none py-1">
                  {badge.icon}
                </div>

                {/* Top preview play button */}
                <button
                  onClick={(e) => handlePreviewCelebration(badge, e)}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white flex items-center justify-center text-xs shadow-2xs transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Bấm để xem trước hoạt ảnh khen thưởng"
                >
                  <Play size={10} className="fill-current" />
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 flex-1">
                <div className="font-black text-slate-800 text-sm leading-tight group-hover:text-amber-600 transition-colors">
                  {badge.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium line-clamp-2">
                  {badge.description}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1 text-slate-600">
                  <Users size={11} className="text-amber-500" />
                  <span>{studentCount} HS</span>
                </span>
                
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-black text-[9px] transition-all",
                  isSelected ? "bg-amber-500 text-white" : "bg-purple-50 text-purple-700 group-hover:bg-amber-100 group-hover:text-amber-700"
                )}>
                  {isSelected ? 'Đang chọn' : (isParent ? 'Xem chi tiết' : 'Tặng')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Awarding Panel Form */}
      {selectedBadge && (
        <div className="bg-white/95 rounded-[32px] p-6 sm:p-8 shadow-2xl border-4 border-amber-300 animate-slide-up relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-200">
                {selectedBadge.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                  {isParent ? 'Thông tin huy hiệu' : 'Chuẩn bị trao huy hiệu'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {selectedBadge.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  {selectedBadge.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
          
          {!isParent ? (
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Bước 2: Chọn học sinh được nhận huy hiệu
                </label>
                <select 
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl px-4 py-3.5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all cursor-pointer"
                >
                  <option value="">-- Bấm vào đây để chọn học sinh --</option>
                  {activeClass.students.map(s => {
                    const alreadyHas = s.badgeIds?.includes(selectedBadge.id);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.gender === 'Nam' ? '👦' : '👧'} {s.name} • {s.points} Điểm {alreadyHas ? ' (Đã có huy hiệu này)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button 
                onClick={handleAward}
                disabled={!selectedStudentId}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-2xl font-black text-sm sm:text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-orange-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <Sparkles size={18} />
                <span>Trao tặng & Bật hoạt ảnh khen thưởng</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 text-xs">
              <div>
                💡 <strong>Dành cho Phụ huynh:</strong> Huy hiệu danh dự được Giáo viên trao tặng để vinh danh các thành tích nổi bật của học sinh trong tuần và trong tháng.
              </div>
              <button
                type="button"
                onClick={(e) => handlePreviewCelebration(selectedBadge, e)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
              >
                <Play size={13} className="fill-current" /> Xem thử hoạt ảnh vinh danh
              </button>
            </div>
          )}
        </div>
      )}

      {/* Celebration Modal Component */}
      <BadgeCelebrationModal
        isOpen={celebrationData.isOpen}
        onClose={() => setCelebrationData(prev => ({ ...prev, isOpen: false }))}
        badge={celebrationData.badge}
        student={celebrationData.student}
        currentClass={activeClass}
        teacher={teacher}
        soundEnabled={soundEnabled}
      />

      {/* Reset Progress Modal */}
      <ResetProgressModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        defaultTab="badges"
      />
    </div>
  );
}
