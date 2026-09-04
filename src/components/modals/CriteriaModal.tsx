import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { PointCriteria } from '../../types';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCriteriaId?: string | null;
  defaultType?: 'positive' | 'negative';
}

const COMMON_EMOJIS = {
  positive: ['🎯', '🙋', '📝', '✅', '🤝', '🚀', '⭐', '💡', '🏆', '🥇', '🎨', '📖', '🌟', '👏', '💯', '🌸'],
  negative: ['✏️', '💬', '⌛', '⏰', '📢', '🙅', '⚠️', '❌', '💤', '🛑', '📉', '💔', '⚡', '🚫'],
};

const COMMON_AMOUNTS = {
  positive: [1, 2, 3, 5, 10],
  negative: [1, 2, 3, 5, 10],
};

export function CriteriaModal({
  isOpen,
  onClose,
  editingCriteriaId,
  defaultType = 'positive',
}: CriteriaModalProps) {
  const { pointCriteria, addPointCriteria, updatePointCriteria, showToast } = useStore();

  const [type, setType] = useState<'positive' | 'negative'>(defaultType);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState<number>(1);
  const [icon, setIcon] = useState('⭐');

  useEffect(() => {
    if (editingCriteriaId) {
      const criteria = pointCriteria.find(c => c.id === editingCriteriaId);
      if (criteria) {
        setType(criteria.type);
        setReason(criteria.reason);
        setAmount(Math.abs(criteria.amount));
        setIcon(criteria.icon || (criteria.type === 'positive' ? '⭐' : '⚠️'));
      }
    } else {
      setType(defaultType);
      setReason('');
      setAmount(defaultType === 'positive' ? 1 : 1);
      setIcon(defaultType === 'positive' ? '⭐' : '⚠️');
    }
  }, [editingCriteriaId, defaultType, isOpen, pointCriteria]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('Vui lòng nhập tên/lý do tiêu chí', 'error');
      return;
    }

    const calculatedAmount = type === 'positive' ? Math.abs(amount || 1) : -Math.abs(amount || 1);

    if (editingCriteriaId) {
      updatePointCriteria(editingCriteriaId, {
        type,
        reason: reason.trim(),
        amount: calculatedAmount,
        icon: icon || (type === 'positive' ? '⭐' : '⚠️'),
      });
      showToast('Đã cập nhật tiêu chí thành công!');
    } else {
      addPointCriteria({
        type,
        reason: reason.trim(),
        amount: calculatedAmount,
        icon: icon || (type === 'positive' ? '⭐' : '⚠️'),
      });
      showToast('Đã thêm tiêu chí mới thành công!');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 transform transition-all">
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between text-white ${
          type === 'positive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-orange-600 to-red-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide">
                {editingCriteriaId ? 'CHỈNH SỬA TIÊU CHÍ' : 'THÊM TIÊU CHÍ MỚI'}
              </h2>
              <p className="text-xs text-white/80 font-medium">
                {type === 'positive' ? 'Tiêu chí Điểm cộng (+) Tuyên dương' : 'Tiêu chí Điểm trừ (-) Nhắc nhở'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Loại Tiêu Chí (Cộng / Trừ) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Loại tiêu chí
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setType('positive');
                  if (icon === '⚠️' || icon === '❌') setIcon('⭐');
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  type === 'positive'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>⭐</span> Điểm cộng (+)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('negative');
                  if (icon === '⭐' || icon === '🎯') setIcon('⚠️');
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  type === 'negative'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>⚠️</span> Điểm trừ (-)
              </button>
            </div>
          </div>

          {/* Tên / Lý do tiêu chí */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Tên / Lý do tiêu chí <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === 'positive' ? 'VD: Trả lời xuất sắc, Giúp đỡ bạn...' : 'VD: Nói chuyện riêng, Quên vở...'}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-slate-800 text-sm"
              required
              autoFocus
            />
          </div>

          {/* Số điểm cộng / trừ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Số điểm {type === 'positive' ? 'cộng (+)' : 'trừ (-)'}
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                type === 'positive' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {type === 'positive' ? `+${amount}` : `-${amount}`} điểm
              </span>
            </div>

            {/* Quick amount chips */}
            <div className="flex items-center gap-2 mb-2">
              {COMMON_AMOUNTS[type].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    amount === val
                      ? type === 'positive'
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-xs'
                        : 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'positive' ? `+${val}` : `-${val}`}
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-bold text-slate-800"
                placeholder="Nhập số điểm tùy chỉnh..."
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                điểm / lần
              </span>
            </div>
          </div>

          {/* Chọn Biểu Tượng / Emoji */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Biểu tượng minh họa
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-32 overflow-y-auto">
              {COMMON_EMOJIS[type].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    icon === em
                      ? 'bg-white shadow-md ring-2 ring-purple-500 scale-110'
                      : 'hover:bg-white hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm ${
                type === 'positive'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
              }`}
            >
              <Save size={18} />
              {editingCriteriaId ? 'Lưu thay đổi' : 'Thêm tiêu chí'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
