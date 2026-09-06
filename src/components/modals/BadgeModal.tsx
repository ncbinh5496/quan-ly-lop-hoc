import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Sparkles, Play, Award, Check, RotateCcw } from 'lucide-react';
import { useStore } from '../../store';
import { Badge } from '../../types';
import { cn } from '../../utils/helpers';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBadgeId?: string | null;
  onPreviewCelebration?: (badge: Badge) => void;
}

const BADGE_EMOJI_CATEGORIES = [
  {
    category: 'Vinh quang & Cúp thưởng',
    emojis: ['🏆', '🎖️', '🥇', '🥈', '🥉', '🏅', '👑', '🏵️', '💎', '🌟', '⭐', '✨'],
  },
  {
    category: 'Học tập & Tri thức',
    emojis: ['📚', '📖', '✍️', '🔢', '💡', '🧩', '🎓', '🔬', '📐', '📝', '🧪', '🔍'],
  },
  {
    category: 'Rèn luyện & Kỷ luật',
    emojis: ['⏰', '🎒', '🏫', '☀️', '🕊️', '🛡️', '📋', '🎯', '🚀', '⚡', '🔔', '🚩'],
  },
  {
    category: 'Yêu thương & Giúp đỡ',
    emojis: ['🤝', '💖', '🌸', '🌿', '🌻', '🍀', '🎈', '🧸', '🫶', '🌈', '🍎', '💌'],
  },
  {
    category: 'Năng khiếu & Thể thao',
    emojis: ['🎨', '🎵', '🏃', '⚽', '🏸', '🏓', '🏊', '🎹', '🎭', '🎪', '🎤', '🧗'],
  },
];

const BADGE_SUGGESTIONS = [
  {
    name: 'Toán học siêu đẳng',
    icon: '🔢',
    description: 'Giải toán nhanh nhạy, tư duy logic và hoàn thành xuất sắc các thử thách',
  },
  {
    name: 'Văn hay chữ tốt',
    icon: '✍️',
    description: 'Viết chữ đều đẹp, sạch sẽ và sáng tạo trong từng câu văn',
  },
  {
    name: 'Mọt sách thông thái',
    icon: '📖',
    description: 'Chăm chỉ đọc sách, kể chuyện hay và luôn ham học hỏi điều mới',
  },
  {
    name: 'Họa sĩ tài ba',
    icon: '🎨',
    description: 'Tranh vẽ sáng tạo, phối màu tươi vui và giàu trí tưởng tượng',
  },
  {
    name: 'Nghệ sĩ âm nhạc',
    icon: '🎵',
    description: 'Hát hay, tự tin biểu diễn và hào hứng tham gia hoạt động văn nghệ',
  },
  {
    name: 'Hiệp sĩ thân thiện',
    icon: '🤝',
    description: 'Biết chia sẻ, nhường nhịn và nhiệt tình giúp đỡ bạn bè trong lớp',
  },
  {
    name: 'Gương sáng đúng giờ',
    icon: '⏰',
    description: 'Đi học chuyên cần, đúng giờ và chuẩn bị sách vở chu đáo',
  },
  {
    name: 'Chiến binh xanh',
    icon: '🌿',
    description: 'Giữ gìn vệ sinh lớp học, chăm sóc cây xanh và yêu thiên nhiên',
  },
  {
    name: 'Nhà vô địch thể thao',
    icon: '🏃',
    description: 'Nhanh nhẹn, khỏe mạnh và tích cực tham gia rèn luyện thể chất',
  },
  {
    name: 'Ý tưởng đột phá',
    icon: '💡',
    description: 'Có nhiều sáng kiến độc đáo, phát biểu xây dựng bài sôi nổi',
  },
  {
    name: 'Bàn tay khéo léo',
    icon: '🧩',
    description: 'Khéo léo, cẩn thận trong các hoạt động thủ công và tạo hình STEM',
  },
  {
    name: 'Ngôi sao kiên trì',
    icon: '⭐',
    description: 'Luôn nỗ lực hết mình, không nản lòng trước bài tập khó',
  },
];

export function BadgeModal({
  isOpen,
  onClose,
  editingBadgeId,
  onPreviewCelebration,
}: BadgeModalProps) {
  const badges = useStore((state) => state.badges);
  const addBadge = useStore((state) => state.addBadge);
  const updateBadge = useStore((state) => state.updateBadge);
  const deleteBadge = useStore((state) => state.deleteBadge);
  const showToast = useStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎖️');
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = Boolean(editingBadgeId);

  useEffect(() => {
    if (editingBadgeId) {
      const badge = badges.find((b) => b.id === editingBadgeId);
      if (badge) {
        setName(badge.name);
        setDescription(badge.description);
        setIcon(badge.icon);
        setCustomEmojiInput('');
        setShowDeleteConfirm(false);
      }
    } else {
      setName('');
      setDescription('');
      setIcon('🎖️');
      setCustomEmojiInput('');
      setShowDeleteConfirm(false);
    }
  }, [editingBadgeId, isOpen, badges]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (sug: (typeof BADGE_SUGGESTIONS)[0]) => {
    setName(sug.name);
    setIcon(sug.icon);
    setDescription(sug.description);
  };

  const handleApplyCustomEmoji = () => {
    const trimmed = customEmojiInput.trim();
    if (trimmed) {
      setIcon(trimmed);
      setCustomEmojiInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      showToast('Vui lòng nhập tên huy hiệu danh dự', 'error');
      return;
    }

    if (!trimmedDesc) {
      showToast('Vui lòng nhập mô tả hoặc tiêu chí đạt huy hiệu', 'error');
      return;
    }

    if (isEditing && editingBadgeId) {
      updateBadge(editingBadgeId, {
        name: trimmedName,
        icon,
        description: trimmedDesc,
      });
    } else {
      addBadge({
        name: trimmedName,
        icon,
        description: trimmedDesc,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingBadgeId) {
      deleteBadge(editingBadgeId);
      onClose();
    }
  };

  const currentPreviewBadge: Badge = {
    id: editingBadgeId || 'preview',
    name: name.trim() || 'Tên huy hiệu danh dự',
    icon: icon || '🎖️',
    description: description.trim() || 'Mô tả tiêu chuẩn và ý nghĩa khen thưởng sẽ hiển thị ở đây.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-amber-200 animate-scale-up my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 p-6 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                {isEditing ? 'Cập nhật danh hiệu' : 'Tạo mới danh hiệu'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {isEditing ? 'Chỉnh sửa Huy hiệu danh dự' : 'Thêm Huy hiệu danh dự mới'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer relative z-10"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Quick Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Gợi ý huy hiệu phổ biến (Bấm để điền nhanh)
              </label>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {BADGE_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug)}
                  className="px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>{sug.icon}</span>
                  <span>{sug.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector & Preview Row */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              1. Chọn biểu tượng đại diện
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Big Current Icon Display */}
              <div className="w-24 h-24 rounded-2xl bg-white border-2 border-amber-300 shadow-md flex flex-col items-center justify-center shrink-0">
                <span className="text-5xl select-none transform hover:scale-110 transition-transform">
                  {icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">Biểu tượng</span>
              </div>

              {/* Custom input & categories */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customEmojiInput}
                    onChange={(e) => setCustomEmojiInput(e.target.value)}
                    placeholder="Nhập hoặc dán emoji khác (vd: 🏵️, 🚀, 💎)..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCustomEmoji();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomEmoji}
                    disabled={!customEmojiInput.trim()}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Dùng icon này
                  </button>
                </div>

                {/* Emoji Quick Picker List by Category */}
                <div className="space-y-2">
                  {BADGE_EMOJI_CATEGORIES.map((cat, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0 truncate">
                        {cat.category}:
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {cat.emojis.map((emoji, eIdx) => (
                          <button
                            key={eIdx}
                            type="button"
                            onClick={() => setIcon(emoji)}
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer hover:scale-110",
                              icon === emoji
                                ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-300 scale-105"
                                : "bg-white hover:bg-amber-50 border border-slate-200/80"
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                2. Tên huy hiệu danh dự <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Toán học siêu đẳng, Văn hay chữ tốt, Vua chuyên cần..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                3. Ý nghĩa & Tiêu chuẩn đạt huy hiệu <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Tuyên dương học sinh giải nhanh các bài toán thử thách và tích cực phát biểu trong tuần..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white placeholder-slate-400 transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Live Badge Preview Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                Xem trước thẻ hiển thị thực tế
              </label>
              {onPreviewCelebration && (
                <button
                  type="button"
                  onClick={() => onPreviewCelebration(currentPreviewBadge)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <Play size={12} className="fill-current" /> Xem thử hiệu ứng vinh danh
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-4 border border-amber-200/80 flex items-center gap-4">
              <div className="w-18 h-18 rounded-2xl bg-white border border-amber-300 shadow-sm flex items-center justify-center text-4xl shrink-0 select-none">
                {icon || '🎖️'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Huy hiệu danh dự
                </span>
                <h4 className="font-black text-slate-900 text-base mt-0.5 truncate">
                  {name.trim() || 'Tên huy hiệu sẽ xuất hiện ở đây'}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                  {description.trim() || 'Mô tả tiêu chuẩn sẽ hiển thị ở đây để các em học sinh noi theo.'}
                </p>
              </div>
            </div>
          </div>

          {/* Delete confirmation section when editing */}
          {isEditing && (
            <div className="pt-2">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} /> Xóa huy hiệu danh dự này
                </button>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs text-rose-800">
                    <strong className="block font-black">Xác nhận xóa huy hiệu này?</strong>
                    <span>Huy hiệu sẽ được gỡ khỏi danh sách khen thưởng của lớp.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Xác nhận xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{isEditing ? 'Lưu thay đổi' : 'Tạo huy hiệu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
