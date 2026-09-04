import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Check, Sparkles, Gift, Eye, HelpCircle, FolderHeart, Plus, ImageIcon } from 'lucide-react';
import { useStore } from '../../store';
import { Reward } from '../../types';
import { cn } from '../../utils/helpers';
import { RewardIconRenderer, isImageIcon } from '../ui/RewardIconRenderer';
import { RewardIconGalleryModal } from './RewardIconGalleryModal';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRewardId?: string | null;
}

const EMOJI_CATEGORIES = [
  {
    category: 'Quà & Đồ chơi',
    emojis: ['🎁', '🧸', '🎲', '🧩', '🎈', '🪄', '🎮', '🕹️', '🪀', '🪁', '🤖', '👑'],
  },
  {
    category: 'Đồ dùng học tập',
    emojis: ['✏️', '📚', '📖', '🎨', '🖌️', '📝', '📏', '📎', '🎒', '🖍️', '🏷️', '🔖'],
  },
  {
    category: 'Bánh kẹo & Đồ ăn',
    emojis: ['🍬', '🍭', '🍫', '🍦', '🍩', '🧁', '🍪', '🍿', '🥤', '🧃', '🍎', '🍓'],
  },
  {
    category: 'Vinh danh & Quyền lợi',
    emojis: ['⭐', '🌟', '🏅', '🥇', '🏆', '🌿', '🎟️', '📣', '💎', '🎉', '🎊', '✨'],
  },
  {
    category: 'Hoạt động & Thể thao',
    emojis: ['⚽', '🏀', '🏸', '🏓', '🎬', '🎧', '🎵', '🎡', '🎪', '🚀', '🌈', '🦄'],
  },
];

const COMMON_COSTS = [10, 20, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200];

const REWARD_NAME_SUGGESTIONS = [
  { name: 'Sticker ngôi sao may mắn', icon: '⭐', cost: 20 },
  { name: 'Hộp quà bí mật', icon: '🎁', cost: 50 },
  { name: 'Bút chì xinh xắn', icon: '✏️', cost: 25 },
  { name: 'Quyển vở vẽ / Tập tô màu', icon: '🎨', cost: 45 },
  { name: 'Tổ trưởng một ngày', icon: '👑', cost: 100 },
  { name: 'Vé chọn chỗ ngồi 1 tuần', icon: '🎟️', cost: 80 },
  { name: '10 phút chơi cờ / trò chơi', icon: '🎲', cost: 60 },
  { name: 'Lời khen tuyên dương trước lớp', icon: '📣', cost: 30 },
  { name: 'Vòng nguyệt quế tuần', icon: '🌿', cost: 120 },
  { name: 'Kẹo mút / Bánh snack', icon: '🍭', cost: 35 },
  { name: 'Miễn 1 bài kiểm tra miệng', icon: '🔖', cost: 150 },
  { name: 'Lượt quay vòng quay may mắn', icon: '🎡', cost: 40 },
];

export function RewardModal({
  isOpen,
  onClose,
  editingRewardId,
}: RewardModalProps) {
  const { rewards, customRewardIcons = [], addReward, updateReward, deleteReward, showToast } = useStore();

  const [name, setName] = useState('');
  const [cost, setCost] = useState<number>(50);
  const [icon, setIcon] = useState('🎁');
  const [isActive, setIsActive] = useState(true);
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (editingRewardId) {
      const reward = rewards.find(r => r.id === editingRewardId);
      if (reward) {
        setName(reward.name);
        setCost(reward.cost);
        setIcon(reward.icon);
        setIsActive(reward.isActive ?? true);
        setCustomEmojiInput(reward.icon);
      }
    } else {
      setName('');
      setCost(50);
      setIcon('🎁');
      setIsActive(true);
      setCustomEmojiInput('🎁');
    }
    setShowDeleteConfirm(false);
  }, [editingRewardId, isOpen, rewards]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên phần thưởng', 'error');
      return;
    }

    const validCost = Math.max(1, Number(cost) || 1);
    const finalIcon = icon.trim() || '🎁';

    if (editingRewardId) {
      updateReward(editingRewardId, {
        name: name.trim(),
        cost: validCost,
        icon: finalIcon,
        isActive,
      });
      showToast('Đã cập nhật phần thưởng thành công!');
    } else {
      addReward({
        name: name.trim(),
        cost: validCost,
        icon: finalIcon,
        isActive,
      });
      showToast('Đã thêm phần thưởng mới vào kho quà!');
    }

    onClose();
  };

  const handleDelete = () => {
    if (!editingRewardId) return;
    deleteReward(editingRewardId);
    showToast('Đã xóa phần thưởng khỏi kho quà!');
    onClose();
  };

  const handleApplySuggestion = (sug: { name: string; icon: string; cost: number }) => {
    setName(sug.name);
    setIcon(sug.icon);
    setCost(sug.cost);
    setCustomEmojiInput(sug.icon);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner overflow-hidden p-1">
                <RewardIconRenderer icon={icon} name={name} className="w-8 h-8 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wide drop-shadow-sm">
                  {editingRewardId ? 'CHỈNH SỬA PHẦN THƯỞNG' : 'THÊM PHẦN THƯỞNG MỚI'}
                </h2>
                <p className="text-xs text-white/90 font-medium">
                  Tùy chỉnh tên quà, điểm sao cần đổi và icon hiển thị trong kho quà
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body - Scrollable */}
          <form onSubmit={handleSubmit} className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Live Preview Card */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Eye size={14} className="text-pink-500" />
                <span>Xem trước thẻ quà tặng (Live Preview):</span>
              </div>
              <div className="flex justify-center p-4 bg-gradient-to-br from-pink-50/70 via-purple-50/50 to-amber-50/50 rounded-2xl border border-pink-100">
                <div className="w-48 bg-white rounded-3xl p-5 text-center shadow-md border-2 border-pink-400 ring-2 ring-pink-100 transform hover:scale-105 transition-all">
                  <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl drop-shadow">
                    <RewardIconRenderer icon={icon || '🎁'} name={name} className="w-14 h-14 text-4xl" />
                  </div>
                  <div className="font-bold text-slate-800 text-sm leading-tight mb-2 truncate">
                    {name.trim() || 'Tên phần thưởng'}
                  </div>
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-black text-xs shadow-sm">
                    {cost || 0} điểm
                  </div>
                  {!isActive && (
                    <div className="mt-2 text-[10px] text-red-500 font-bold bg-red-50 py-0.5 rounded-md">
                      (Tạm ẩn khỏi kho)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            {!editingRewardId && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Gợi ý quà phổ biến cho lớp học:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/70">
                  {REWARD_NAME_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className="text-xs bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-700 border border-slate-200 hover:border-pink-300 px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>{sug.icon}</span>
                      <span>{sug.name}</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">
                        {sug.cost}đ
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tên phần thưởng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên phần thưởng / Loại quà <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Sticker ngôi sao, Hộp quà bí mật, Bút chì may mắn..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-slate-800 text-sm"
                required
              />
            </div>

            {/* Số điểm cần đổi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Số điểm sao cần đổi <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg">
                  {cost} điểm
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCost(Math.max(1, (cost || 0) - 5))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  -5
                </button>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={cost}
                  onChange={(e) => setCost(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-black text-slate-800 text-center text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setCost((cost || 0) + 5)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  +5
                </button>
              </div>

              {/* Quick Cost Presets */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Chọn nhanh:</span>
                {COMMON_COSTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCost(c)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      cost === c
                        ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-pink-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {c}đ
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Icon / Biểu tượng & Mở Thư Viện Kho Icon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift size={14} className="text-pink-500" />
                  <span>Icon / Hình ảnh phần thưởng</span>
                </label>

                {/* Primary Button to Open Full Reward Icon Gallery */}
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-black shadow-sm shadow-pink-200 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                >
                  <FolderHeart size={14} />
                  <span>Mở Kho Icon & Nạp ảnh ({customRewardIcons.length})</span>
                </button>
              </div>

              {/* Custom Uploaded Icons Shortcut if available */}
              {customRewardIcons.length > 0 && (
                <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-pink-900 uppercase">
                      Ảnh bạn đã tải lên ({customRewardIcons.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="text-[11px] font-bold text-pink-600 hover:text-pink-800"
                    >
                      Quản lý kho →
                    </button>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {customRewardIcons.map((custom) => {
                      const isSelected = icon === custom.url;
                      return (
                        <button
                          key={custom.id}
                          type="button"
                          onClick={() => {
                            setIcon(custom.url);
                            setCustomEmojiInput(custom.name);
                          }}
                          className={cn(
                            "w-12 h-12 rounded-xl p-1 bg-white border flex items-center justify-center shrink-0 transition-all cursor-pointer relative",
                            isSelected 
                              ? "border-pink-500 ring-2 ring-pink-400 bg-pink-50" 
                              : "border-slate-200 hover:border-pink-300"
                          )}
                          title={custom.name}
                        >
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 text-white rounded-full flex items-center justify-center text-[9px]">
                              <Check size={10} />
                            </div>
                          )}
                          <RewardIconRenderer icon={custom.url} name={custom.name} className="w-9 h-9" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Emoji / Text / URL Input */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-2">
                <span className="text-xs text-slate-600 font-medium">
                  {isImageIcon(icon) ? 'Đang dùng ảnh từ kho quà' : 'Nhập nhanh Emoji / URL ảnh:'}
                </span>
                <input
                  type="text"
                  value={customEmojiInput}
                  onChange={(e) => {
                    setCustomEmojiInput(e.target.value);
                    if (e.target.value) setIcon(e.target.value);
                  }}
                  placeholder="🎁 hoặc link ảnh"
                  className="flex-1 max-w-xs px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 font-bold text-slate-800"
                />
              </div>

              {/* Visual Emoji Presets Grid by Category */}
              <div className="space-y-2.5 p-3 bg-slate-50/70 rounded-2xl border border-slate-200 max-h-44 overflow-y-auto">
                {EMOJI_CATEGORIES.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {cat.category}
                    </span>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {cat.emojis.map((emoji, emojiIdx) => {
                        const isSelected = icon === emoji;
                        return (
                          <button
                            key={emojiIdx}
                            type="button"
                            onClick={() => {
                              setIcon(emoji);
                              setCustomEmojiInput(emoji);
                            }}
                            className={`h-10 text-xl rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-pink-500 text-white shadow-md scale-110 ring-2 ring-pink-300'
                                : 'bg-white hover:bg-pink-50 border border-slate-200/80 hover:border-pink-300 text-slate-800'
                            }`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trạng thái Bật/Tắt */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Trạng thái đổi quà</span>
                <span className="text-[11px] text-slate-500">
                  {isActive ? 'Đang mở cho học sinh đổi thưởng' : 'Tạm ẩn phần thưởng này khỏi danh sách'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            {/* Modal Footer / Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t">
              {editingRewardId ? (
                <div>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} /> Xóa quà
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 animate-fade-in">
                      <span className="text-xs text-red-600 font-bold">Xác nhận xóa?</span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 shadow-xs cursor-pointer"
                      >
                        Xóa ngay
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-bold text-xs hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-200 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save size={16} /> {editingRewardId ? 'Lưu thay đổi' : 'Thêm vào kho quà'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Full Reward Icon Gallery Modal */}
      <RewardIconGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentSelectedIcon={icon}
        onSelectIcon={(selectedUrlOrEmoji, selectedName) => {
          setIcon(selectedUrlOrEmoji);
          setCustomEmojiInput(selectedName || selectedUrlOrEmoji);
          if (!name.trim() && selectedName) {
            setName(selectedName);
          }
        }}
      />
    </>
  );
}

