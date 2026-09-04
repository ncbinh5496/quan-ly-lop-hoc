import React from 'react';
import { useStore } from '../../store';
import { Gift, RotateCcw, Plus, Pencil, Trash2 } from 'lucide-react';

interface RewardsSettingsSectionProps {
  onAddReward: () => void;
  onEditReward: (id: string) => void;
}

export default function RewardsSettingsSection({ onAddReward, onEditReward }: RewardsSettingsSectionProps) {
  const rewards = useStore(state => state.rewards);
  const deleteReward = useStore(state => state.deleteReward);
  const resetRewards = useStore(state => state.resetRewards);
  const showToast = useStore(state => state.showToast);

  const [rewardToDelete, setRewardToDelete] = React.useState<{ id: string; name: string } | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = React.useState(false);

  const confirmDeleteReward = () => {
    if (rewardToDelete) {
      deleteReward(rewardToDelete.id);
      showToast(`Đã xóa phần thưởng "${rewardToDelete.name}"!`);
      setRewardToDelete(null);
    }
  };

  const confirmResetRewards = () => {
    resetRewards();
    showToast('Đã khôi phục kho phần thưởng về mặc định!');
    setIsConfirmingReset(false);
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100/80 flex items-center justify-center text-pink-600 border border-pink-200">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Quản lý Kho Phần Thưởng ({rewards.length})</h3>
            <p className="text-xs text-slate-500">Tùy biến loại phần thưởng, điểm sao cần đổi và icon</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfirmingReset(true)}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Khôi phục mặc định
          </button>

          <button
            onClick={onAddReward}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-black transition-all shadow-md shadow-pink-500/20 flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={16} /> Thêm quà mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {rewards.map((r) => (
          <div
            key={r.id}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between text-center relative group ${
              r.isActive !== false
                ? 'border-pink-100 bg-pink-50/30 hover:border-pink-300'
                : 'border-slate-200 bg-slate-50 opacity-60 border-dashed'
            }`}
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditReward(r.id)}
                className="p-1 bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-600 rounded-lg shadow-2xs transition-colors cursor-pointer"
                title="Sửa quà"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setRewardToDelete({ id: r.id, name: r.name })}
                className="p-1 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg shadow-2xs transition-colors cursor-pointer"
                title="Xóa quà"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div>
              <div className="text-3xl mb-1.5 drop-shadow-xs">{r.icon || '🎁'}</div>
              <h4 className="font-bold text-xs text-slate-800 line-clamp-2 min-h-[2rem] flex items-center justify-center">
                {r.name}
              </h4>
            </div>

            <div className="mt-2 pt-1.5 border-t border-pink-200/50 flex items-center justify-center gap-1">
              <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                ⭐ {r.cost} sao
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Reward Confirmation Modal */}
      {rewardToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Xóa quà "{rewardToDelete.name}"?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Phần thưởng này sẽ bị xóa khỏi kho quà. Lịch sử các lần đổi quà trước đây vẫn được lưu trữ nguyên vẹn.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRewardToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteReward}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Rewards Confirmation Modal */}
      {isConfirmingReset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl mx-auto mb-3">
              <RotateCcw size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Khôi phục kho quà mặc định?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Danh sách các món quà trong kho sẽ được thiết lập lại về danh mục quà mẫu ban đầu của ứng dụng.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmResetRewards}
                className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors shadow-md shadow-pink-500/20 cursor-pointer"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
