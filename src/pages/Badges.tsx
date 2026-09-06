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
  RotateCcw,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { Badge, Student } from '../types';
import { BadgeCelebrationModal } from '../components/modals/BadgeCelebrationModal';
import { ResetProgressModal } from '../components/modals/ResetProgressModal';
import { BadgeModal } from '../components/modals/BadgeModal';
import { AwardBadgeToStudentModal } from '../components/modals/AwardBadgeToStudentModal';

export default function Badges() {
  const badges = useStore(state => state.badges);
  const awardBadge = useStore(state => state.awardBadge);
  const deleteBadge = useStore(state => state.deleteBadge);
  const resetBadges = useStore(state => state.resetBadges);
  const soundEnabled = useStore(state => state.soundEnabled);
  const teacher = useStore(state => state.teacher);
  const showToast = useStore(state => state.showToast);

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'study' | 'discipline' | 'special'>('all');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Award to Student Modal State
  const [isAwardToStudentModalOpen, setIsAwardToStudentModalOpen] = useState(false);
  const [badgeToAward, setBadgeToAward] = useState<Badge | null>(null);

  // Badge Create & Edit Modal State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);

  // Badge Delete Confirmation State
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);

  // Reset Badges Catalog Confirmation State
  const [isResetBadgesCatalogConfirm, setIsResetBadgesCatalogConfirm] = useState(false);

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
        return ['Chăm học', 'Viết đẹp', 'Toán giỏi', 'Đọc sách', 'Sáng tạo', 'Toán', 'Văn'].some(n => badge.name.includes(n));
      }
      if (categoryFilter === 'discipline') {
        return ['Chuyên cần', 'Giúp bạn', 'Hợp tác tốt', 'Tiến bộ vượt bậc', 'Đúng giờ', 'Chiến binh xanh'].some(n => badge.name.includes(n));
      }
      if (categoryFilter === 'special') {
        return ['Ngôi sao tỏa sáng', 'Chạm tới vòng nguyệt quế', 'Nhà vô địch tuần', 'Vô địch', 'Xuất sắc', 'Sao'].some(n => badge.name.includes(n));
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

  const handleOpenAwardModal = (badge: Badge, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedBadge(badge);
    setBadgeToAward(badge);
    setIsAwardToStudentModalOpen(true);
  };

  const handleAwardSuccess = (badge: Badge, awardedStudents: Student[]) => {
    if (awardedStudents.length > 0) {
      setCelebrationData({
        badge,
        student: awardedStudents[0],
        isOpen: true
      });
      setSelectedBadge(null);
      setSelectedStudentId('');
    }
  };

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

  const handlePreviewCelebration = (badge: Badge, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleConfirmDeleteBadge = () => {
    if (badgeToDelete) {
      deleteBadge(badgeToDelete.id);
      if (selectedBadge?.id === badgeToDelete.id) {
        setSelectedBadge(null);
      }
      setBadgeToDelete(null);
    }
  };

  const handleConfirmResetBadgesCatalog = () => {
    resetBadges();
    setIsResetBadgesCatalogConfirm(false);
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
              Tạo mới, tùy chỉnh và trao danh hiệu kèm hoạt ảnh vinh danh, âm nhạc pháo hoa cho học sinh lớp {activeClass.name}
            </p>
          </div>
        </div>

        {/* Action Buttons & Quick Stats */}
        <div className="flex items-center gap-2.5 relative z-10 flex-wrap">
          {/* Add New Badge Primary Button */}
          <button
            onClick={() => {
              setEditingBadgeId(null);
              setIsBadgeModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-900 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={16} className="text-amber-600" />
            <span>Thêm huy hiệu mới</span>
          </button>

          <button
            onClick={() => setIsResetBadgesCatalogConfirm(true)}
            className="px-3 py-2.5 bg-black/25 hover:bg-black/40 text-white backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            title="Khôi phục danh sách huy hiệu về 12 loại mặc định"
          >
            <RotateCcw size={13} className="text-amber-200" />
            <span className="hidden sm:inline">Mặc định</span>
          </button>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2.5 bg-black/30 hover:bg-black/45 text-white backdrop-blur-md rounded-2xl border border-white/25 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            title="Reset toàn bộ huy hiệu đã trao của lớp về 0"
          >
            <RotateCcw size={14} className="text-rose-300" />
            <span>Reset lượt trao</span>
          </button>

          <div className="px-3.5 py-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Tổng Huy hiệu</div>
            <div className="text-sm sm:text-base font-black">{badges.length} loại</div>
          </div>
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
        {/* Quick Add Dashed Card */}
        <button
          onClick={() => {
            setEditingBadgeId(null);
            setIsBadgeModalOpen(true);
          }}
          className="min-h-[220px] rounded-[24px] border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/50 flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all hover:-translate-y-1 shadow-2xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-500 text-amber-600 group-hover:text-white flex items-center justify-center transition-all mb-2 shadow-2xs">
            <Plus size={24} />
          </div>
          <span className="font-black text-slate-800 text-xs sm:text-sm group-hover:text-amber-800">
            Thêm huy hiệu
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
            Tạo danh hiệu mới với icon & tiêu chí riêng
          </span>
        </button>

        {filteredBadges.map(badge => {
          const isSelected = selectedBadge?.id === badge.id;
          const studentCount = getBadgeStudentCount(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => handleOpenAwardModal(badge)}
              className={cn(
                "relative bg-white/95 rounded-[24px] p-4 text-center shadow-[0_8px_24px_rgba(124,58,237,0.04)] border-2 transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl",
                isSelected 
                  ? "border-amber-400 ring-4 ring-amber-200/60 bg-amber-50/50 shadow-md scale-105" 
                  : "border-purple-100/80 hover:border-amber-300"
              )}
            >
              {/* Top Quick Actions: Preview, Edit, Delete */}
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                {/* Preview Celebration Button */}
                <button
                  type="button"
                  onClick={(e) => handlePreviewCelebration(badge, e)}
                  className="w-6 h-6 rounded-full bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white flex items-center justify-center text-xs shadow-2xs transition-all cursor-pointer"
                  title="Bấm để xem trước hoạt ảnh vinh danh"
                >
                  <Play size={9} className="fill-current" />
                </button>

                {/* Edit Badge Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBadgeId(badge.id);
                    setIsBadgeModalOpen(true);
                  }}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-amber-500 text-slate-600 hover:text-white flex items-center justify-center text-xs shadow-2xs transition-all cursor-pointer"
                  title="Chỉnh sửa thông tin huy hiệu này"
                >
                  <Pencil size={10} />
                </button>

                {/* Delete Badge Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBadgeToDelete(badge);
                  }}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-500 text-slate-600 hover:text-white flex items-center justify-center text-xs shadow-2xs transition-all cursor-pointer"
                  title="Xóa huy hiệu này"
                >
                  <Trash2 size={10} />
                </button>
              </div>

              {/* Badge Icon */}
              <div className="relative mt-2 mb-2 flex items-center justify-center">
                <div className="text-5xl sm:text-6xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-sm select-none py-1">
                  {badge.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 flex-1">
                <div className="font-black text-slate-800 text-sm leading-tight group-hover:text-amber-600 transition-colors">
                  {badge.name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium line-clamp-2">
                  {badge.description}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1 text-slate-600">
                  <Users size={11} className="text-amber-500" />
                  <span>{studentCount} HS</span>
                </span>
                
                <button
                  type="button"
                  onClick={(e) => handleOpenAwardModal(badge, e)}
                  className="px-2.5 py-1 rounded-full font-black text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  title="Bấm để chọn học sinh trao tặng huy hiệu này"
                >
                  <Gift size={11} />
                  <span>Tặng HS</span>
                </button>
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
                  Chuẩn bị trao huy hiệu
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {selectedBadge.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  {selectedBadge.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingBadgeId(selectedBadge.id);
                  setIsBadgeModalOpen(true);
                }}
                className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Pencil size={12} />
                <span>Sửa huy hiệu</span>
              </button>

              <button
                onClick={() => setSelectedBadge(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Bước 2: Chọn học sinh được nhận huy hiệu
                </label>
                <button
                  type="button"
                  onClick={() => handleOpenAwardModal(selectedBadge)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Users size={13} />
                  <span>Bảng chọn học sinh trực quan</span>
                </button>
              </div>
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
        </div>
      )}

      {/* Badge Create & Edit Modal */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => {
          setIsBadgeModalOpen(false);
          setEditingBadgeId(null);
        }}
        editingBadgeId={editingBadgeId}
        onPreviewCelebration={(badge) => handlePreviewCelebration(badge)}
      />

      {/* Delete Badge Confirmation Modal */}
      {badgeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-scale-up space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Xác nhận xóa huy hiệu</h3>
                <p className="text-xs text-slate-500">Hành động này sẽ xóa huy hiệu khỏi danh sách</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-4xl">{badgeToDelete.icon}</span>
              <div>
                <div className="font-black text-slate-800 text-sm">{badgeToDelete.name}</div>
                <div className="text-xs text-slate-500 line-clamp-1">{badgeToDelete.description}</div>
              </div>
            </div>

            {getBadgeStudentCount(badgeToDelete.id) > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>
                  Đang có <strong>{getBadgeStudentCount(badgeToDelete.id)} học sinh</strong> được trao huy hiệu này trong lớp.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBadgeToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBadge}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Badges Catalog Confirmation Modal */}
      {isResetBadgesCatalogConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-scale-up space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Khôi phục danh sách mặc định?</h3>
                <p className="text-xs text-slate-500">Khôi phục bộ 12 huy hiệu danh dự mẫu</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Thao tác này sẽ đưa danh mục huy hiệu danh dự trở về 12 loại chuẩn ban đầu (Chăm học, Chuyên cần, Viết đẹp, Toán giỏi, v.v.). Các huy hiệu tự tạo thêm sẽ được làm mới.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetBadgesCatalogConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmResetBadgesCatalog}
                className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Khôi phục danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge To Student Modal */}
      <AwardBadgeToStudentModal
        isOpen={isAwardToStudentModalOpen}
        onClose={() => {
          setIsAwardToStudentModalOpen(false);
          setBadgeToAward(null);
        }}
        badge={badgeToAward || selectedBadge}
        onAwardSuccess={handleAwardSuccess}
        onPreviewCelebration={(b) => handlePreviewCelebration(b)}
      />

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

      {/* Reset Progress Modal (Reset student badges in class) */}
      <ResetProgressModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        defaultTab="badges"
      />
    </div>
  );
}
