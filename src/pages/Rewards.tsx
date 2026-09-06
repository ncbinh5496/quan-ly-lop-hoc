import React, { useState, useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { 
  Gift, 
  Check, 
  Plus, 
  Edit3, 
  RotateCcw, 
  History, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Eye,
  EyeOff,
  FolderHeart
} from 'lucide-react';
import { cn, playSound, triggerConfetti, formatDate } from '../utils/helpers';
import { Reward } from '../types';
import { RewardModal } from '../components/modals/RewardModal';
import { ResetProgressModal } from '../components/modals/ResetProgressModal';
import { RewardIconRenderer } from '../components/ui/RewardIconRenderer';
import { RewardIconGalleryModal } from '../components/modals/RewardIconGalleryModal';

export default function Rewards() {
  const rewards = useStore(state => state.rewards);
  const customRewardIcons = useStore(state => state.customRewardIcons) || [];
  const redeemReward = useStore(state => state.redeemReward);
  const updateReward = useStore(state => state.updateReward);
  const resetRewards = useStore(state => state.resetRewards);
  const soundEnabled = useStore(state => state.soundEnabled);
  const showToast = useStore(state => state.showToast);

  const [activeTab, setActiveTab] = useState<'store' | 'history'>('store');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Management & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIconGalleryOpen, setIsIconGalleryOpen] = useState(false);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetProgressModal, setShowResetProgressModal] = useState(false);
  const [resetModalTab, setResetModalTab] = useState<'rewards' | 'catalog'>('rewards');

  const activeClass = useActiveClass();

  // Filter rewards with useMemo
  const filteredRewards = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return rewards.filter(r => {
      const matchesSearch = query ? r.name.toLowerCase().includes(query) : true;
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'active' ? (r.isActive !== false) :
        (r.isActive === false);
      return matchesSearch && matchesStatus;
    });
  }, [rewards, searchQuery, filterStatus]);

  // Pre-index lookups
  const studentsMap = useMemo(() => {
    const map = new Map<string, typeof activeClass.students[0]>();
    if (activeClass?.students) {
      activeClass.students.forEach(s => map.set(s.id, s));
    }
    return map;
  }, [activeClass?.students]);

  const rewardsMap = useMemo(() => {
    const map = new Map<string, Reward>();
    rewards.forEach(r => map.set(r.id, r));
    return map;
  }, [rewards]);

  const selectedStudent = useMemo(() => {
    return selectedStudentId ? studentsMap.get(selectedStudentId) : undefined;
  }, [selectedStudentId, studentsMap]);

  // History transactions with enriched details and memoization
  const historyTransactions = useMemo(() => {
    const txs = activeClass?.rewardTransactions || [];
    return txs.map(tx => {
      const student = studentsMap.get(tx.studentId);
      const reward = rewardsMap.get(tx.rewardId);
      return {
        ...tx,
        studentName: student?.name || 'Học sinh',
        rewardName: reward?.name || 'Phần thưởng',
        rewardIcon: reward?.icon || '🎁',
      };
    });
  }, [activeClass?.rewardTransactions, studentsMap, rewardsMap]);

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để sử dụng kho phần thưởng.</p>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingRewardId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reward: Reward, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRewardId(reward.id);
    setIsModalOpen(true);
  };

  const handleToggleActive = (reward: Reward, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !(reward.isActive ?? true);
    updateReward(reward.id, { isActive: newStatus });
    showToast(newStatus ? `Đã mở lại quà "${reward.name}"` : `Đã ẩn quà "${reward.name}"`);
  };

  const handleResetRewards = () => {
    resetRewards();
    setShowResetConfirm(false);
    showToast('Đã khôi phục kho phần thưởng về mặc định!');
  };

  const handleSelectRewardForRedeem = (reward: Reward) => {
    if (!reward.isActive) {
      showToast('Phần thưởng này đang tạm ẩn, hãy mở lại để đổi thưởng', 'info');
      return;
    }
    setSelectedReward(reward);
  };

  const handleRedeem = () => {
    if (selectedReward && selectedStudentId) {
      const student = studentsMap.get(selectedStudentId);
      if (!student) return;

      if (student.points >= selectedReward.cost) {
        redeemReward(selectedStudentId, selectedReward.id);
        if (soundEnabled) playSound('tada');
        triggerConfetti();
        showToast(`🎉 Chúc mừng ${student.name} đã đổi thành công "${selectedReward.name}"!`);
        setSelectedReward(null);
        setSelectedStudentId('');
      } else {
        if (soundEnabled) playSound('error');
        showToast(`Học sinh ${student.name} còn thiếu ${selectedReward.cost - student.points} điểm để đổi quà này!`, 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 md:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-pink-100/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md shadow-pink-200 shrink-0">
            🎁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Cửa hàng phần thưởng</h2>
              <span className="px-2.5 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-black">
                {rewards.length} món quà
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Đổi điểm sao lấy quà, tùy chỉnh biểu tượng, tên quà và số điểm theo ý bạn
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Reward Icon Gallery button */}
          <button
            onClick={() => setIsIconGalleryOpen(true)}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-pink-200 bg-pink-50/80 hover:bg-pink-100 text-pink-700 shadow-2xs cursor-pointer"
            title="Mở kho lưu trữ và nạp thêm icon ngoài"
          >
            <FolderHeart size={15} />
            <span>Kho Icon ({customRewardIcons.length})</span>
          </button>

          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className={cn(
              "px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border shadow-2xs cursor-pointer",
              isManageMode 
                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-amber-200" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            )}
          >
            <SlidersHorizontal size={15} />
            {isManageMode ? 'Xong sửa' : '⚙️ Sửa quà'}
          </button>

          <button
            onClick={() => {
              setResetModalTab('rewards');
              setShowResetProgressModal(true);
            }}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 shadow-2xs cursor-pointer"
            title="Reset lịch sử đổi quà hoặc khôi phục danh mục quà mẫu"
          >
            <RotateCcw size={15} />
            <span>Reset đổi</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-black text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={16} /> Thêm quà mới
          </button>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab switch */}
        <div className="flex p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-purple-100/80 shadow-2xs max-w-fit">
          <button
            onClick={() => setActiveTab('store')}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
              activeTab === 'store'
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <ShoppingBag size={14} /> Danh sách quà ({rewards.filter(r => r.isActive).length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
              activeTab === 'history'
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <History size={14} /> Lịch sử đổi quà ({historyTransactions.length})
          </button>
        </div>

        {/* Search & Filter */}
        {activeTab === 'store' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phần thưởng..."
                className="w-full pl-8 pr-3 py-2 bg-white/90 border border-purple-100/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium placeholder-slate-400"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white/90 border border-purple-100/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="all">Tất cả quà</option>
              <option value="active">Đang mở</option>
              <option value="inactive">Đã ẩn</option>
            </select>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                title="Khôi phục danh sách phần thưởng mẫu"
                className="p-2 text-slate-500 hover:text-slate-800 bg-white/90 hover:bg-slate-100 rounded-xl border border-purple-100/80 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-rose-200 shadow-2xs animate-fade-in">
                <span className="text-[11px] font-bold text-rose-600 px-1">Khôi phục?</span>
                <button
                  type="button"
                  onClick={handleResetRewards}
                  className="px-2 py-0.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Có
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-1.5 py-0.5 text-slate-500 text-[10px] cursor-pointer"
                >
                  Không
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TAB 1: REWARD STORE */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {/* Manage Mode Info Banner */}
          {isManageMode && (
            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-amber-800 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                <span className="font-bold">
                  Đang ở chế độ chỉnh sửa: Bạn có thể bấm vào icon bút để đổi tên, đổi icon hoặc số điểm sao cần đổi.
                </span>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 transition-colors cursor-pointer"
              >
                + Thêm quà mới
              </button>
            </div>
          )}

          {/* Grid of Reward Cards */}
          {filteredRewards.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 max-w-md mx-auto">
              <p className="text-3xl mb-2">🎁</p>
              <p className="font-bold text-slate-700 text-sm mb-1">Không tìm thấy phần thưởng phù hợp</p>
              <p className="text-slate-400 text-xs mb-4">Hãy thử tìm từ khóa khác hoặc thêm phần thưởng mới</p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
              >
                + Thêm phần thưởng
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredRewards.map((reward) => {
                const isSelected = selectedReward?.id === reward.id;
                const isHidden = reward.isActive === false;

                return (
                  <div
                    key={reward.id}
                    onClick={() => handleSelectRewardForRedeem(reward)}
                    className={cn(
                      "group relative bg-white/95 rounded-[24px] p-4 sm:p-5 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between border select-none overflow-hidden",
                      isSelected
                        ? "border-pink-500 ring-4 ring-pink-100/70 shadow-lg -translate-y-1 bg-pink-50/30"
                        : "border-purple-100/80 hover:border-pink-200 hover:shadow-[0_12px_28px_rgba(236,72,153,0.12)] hover:-translate-y-1 shadow-[0_4px_16px_rgba(124,58,237,0.04)]",
                      isHidden && "opacity-60 bg-slate-50 border-dashed"
                    )}
                  >
                    {/* Top Action Badge (Edit & Hide) */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                      {isManageMode && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(reward, e)}
                          title={isHidden ? 'Mở lại phần thưởng' : 'Ẩn phần thưởng'}
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          {isHidden ? <EyeOff size={13} className="text-amber-600" /> : <Eye size={13} />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(reward, e)}
                        title="Chỉnh sửa phần thưởng"
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-2xs cursor-pointer",
                          isManageMode
                            ? "bg-pink-500 text-white hover:bg-pink-600"
                            : "opacity-0 group-hover:opacity-100 bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600"
                        )}
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-pink-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <Check size={11} /> Đang chọn
                      </div>
                    )}

                    {/* Reward Body */}
                    <div className="pt-2 flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2.5 transform group-hover:scale-110 transition-transform duration-200 drop-shadow">
                        <RewardIconRenderer icon={reward.icon || '🎁'} name={reward.name} className="w-14 h-14 sm:w-16 sm:h-16 text-4xl sm:text-5xl" />
                      </div>

                      <div className="font-bold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                        {reward.name}
                      </div>
                    </div>

                    {/* Point Cost Badge */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full font-black text-xs shadow-2xs">
                        <span>⭐</span>
                        <span>{reward.cost} sao</span>
                      </div>
                      
                      {isHidden && (
                        <div className="text-[10px] text-slate-400 font-medium mt-1">
                          (Đã tạm ẩn)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Redeem Drawer Panel */}
          {selectedReward && (
            <div className="bg-white/95 rounded-[32px] p-6 shadow-2xl border-2 border-pink-300 ring-4 ring-pink-100 animate-slide-up backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-amber-100 border border-pink-200 flex items-center justify-center text-3xl shadow-inner shrink-0 overflow-hidden p-1">
                    <RewardIconRenderer icon={selectedReward.icon} name={selectedReward.name} className="w-10 h-10 text-3xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                        Đang tiến hành đổi quà:
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black">
                        Cần {selectedReward.cost} điểm sao
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800">{selectedReward.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedReward)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} /> Sửa quà
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Đóng lại
                  </button>
                </div>
              </div>

              {/* Redeem Form */}
              <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    1. Chọn học sinh đổi phần thưởng này:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-pink-300 focus:border-pink-500 text-slate-800 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="">-- Nhấp để chọn học sinh trong {activeClass.name} --</option>
                    {activeClass.students.map((student) => {
                      const isAffordable = student.points >= selectedReward.cost;
                      return (
                        <option
                          key={student.id}
                          value={student.id}
                          disabled={!isAffordable}
                          className={isAffordable ? 'font-bold' : 'text-slate-400'}
                        >
                          {student.name} • Đang có {student.points} ⭐ {isAffordable ? ' (Đủ điều kiện)' : ` (Thiếu ${selectedReward.cost - student.points} sao)`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="md:col-span-4 flex items-end">
                  <button
                    onClick={handleRedeem}
                    disabled={!selectedStudentId}
                    className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                  >
                    <Check size={18} /> Xác nhận Đổi Thưởng
                  </button>
                </div>
              </div>

              {selectedStudent && (
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{selectedStudent.name}:</span>
                    <span>Hiện tại: <strong>{selectedStudent.points} ⭐</strong></span>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span>Sau khi đổi: <strong className="text-pink-600">{selectedStudent.points - selectedReward.cost} ⭐</strong></span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ Đủ điểm đổi quà
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REDEEM HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white/95 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-800">Lịch sử đổi quà lớp {activeClass.name}</h3>
              <p className="text-xs text-slate-500">Danh sách các phần thưởng học sinh đã tích điểm và đổi</p>
            </div>
            <span className="px-3 py-1 bg-pink-50 text-pink-700 font-bold text-xs rounded-full">
              Tổng {historyTransactions.length} lượt đổi
            </span>
          </div>

          {historyTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Gift className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-600 text-sm">Chưa có lượt đổi quà nào</p>
              <p className="text-slate-400 text-xs">Khi học sinh đổi phần thưởng, lịch sử sẽ xuất hiện chi tiết tại đây.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {historyTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-purple-50/40 px-3 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl shrink-0 overflow-hidden p-1">
                      <RewardIconRenderer icon={tx.rewardIcon} name={tx.rewardName} className="w-7 h-7 text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">
                        {tx.studentName} <span className="font-normal text-slate-500">đã đổi</span> {tx.rewardName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-black">
                      -{tx.cost} ⭐
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REWARD EDIT / ADD MODAL */}
      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRewardId={editingRewardId}
      />

      {/* REWARD ICON GALLERY STORAGE MODAL */}
      <RewardIconGalleryModal
        isOpen={isIconGalleryOpen}
        onClose={() => setIsIconGalleryOpen(false)}
      />

      {/* RESET PROGRESS MODAL */}
      <ResetProgressModal
        isOpen={showResetProgressModal}
        onClose={() => setShowResetProgressModal(false)}
        defaultTab={resetModalTab}
      />
    </div>
  );
}
