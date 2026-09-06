import React, { useState } from 'react';
import { useStore, useActiveClass } from '../../store';
import { Award, RotateCcw, Plus, Pencil, Trash2, AlertTriangle, Play } from 'lucide-react';
import { Badge } from '../../types';

interface BadgesSettingsSectionProps {
  onAddBadge: () => void;
  onEditBadge: (id: string) => void;
  onPreviewBadge?: (badge: Badge) => void;
}

export default function BadgesSettingsSection({
  onAddBadge,
  onEditBadge,
  onPreviewBadge,
}: BadgesSettingsSectionProps) {
  const badges = useStore((state) => state.badges);
  const deleteBadge = useStore((state) => state.deleteBadge);
  const resetBadges = useStore((state) => state.resetBadges);
  const showToast = useStore((state) => state.showToast);
  const activeClass = useActiveClass();

  const [badgeToDelete, setBadgeToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const confirmDeleteBadge = () => {
    if (badgeToDelete) {
      deleteBadge(badgeToDelete.id);
      showToast(`Đã xóa huy hiệu "${badgeToDelete.name}"!`);
      setBadgeToDelete(null);
    }
  };

  const confirmResetBadges = () => {
    resetBadges();
    showToast('Đã khôi phục danh mục huy hiệu danh dự về 12 loại mặc định!');
    setIsConfirmingReset(false);
  };

  const getStudentCount = (badgeId: string) => {
    if (!activeClass?.students) return 0;
    return activeClass.students.filter((s) => s.badgeIds?.includes(badgeId)).length;
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-600 border border-amber-200">
            <Award size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">
              Quản lý Huy hiệu Danh dự ({badges.length})
            </h3>
            <p className="text-xs text-slate-500">
              Tùy biến tên danh hiệu, biểu tượng icon và tiêu chuẩn khen thưởng cho học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfirmingReset(true)}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Khôi phục mặc định
          </button>

          <button
            type="button"
            onClick={onAddBadge}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={16} /> Thêm huy hiệu mới
          </button>
        </div>
      </div>

      {/* Badges List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const count = getStudentCount(badge.id);
          return (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-2xl shrink-0 select-none shadow-2xs group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-sm text-slate-800 truncate group-hover:text-amber-600 transition-colors">
                    {badge.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {badge.description}
                  </p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                    {count} học sinh đạt
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onPreviewBadge && (
                  <button
                    type="button"
                    onClick={() => onPreviewBadge(badge)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                    title="Xem thử hoạt ảnh"
                  >
                    <Play size={12} className="fill-current" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEditBadge(badge.id)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                  title="Chỉnh sửa huy hiệu"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setBadgeToDelete({ id: badge.id, name: badge.name })}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                  title="Xóa huy hiệu"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {badgeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 font-black">
              <AlertTriangle size={24} />
              <span>Xác nhận xóa huy hiệu</span>
            </div>
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa huy hiệu danh dự <strong>"{badgeToDelete.name}"</strong> không?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBadgeToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeleteBadge}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isConfirmingReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 font-black">
              <RotateCcw size={24} />
              <span>Khôi phục huy hiệu mặc định</span>
            </div>
            <p className="text-xs text-slate-600">
              Danh mục huy hiệu sẽ được đặt lại về 12 loại mẫu chuẩn (Chăm học, Chuyên cần, Viết đẹp, Toán giỏi, v.v.).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmResetBadges}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md transition-colors cursor-pointer"
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
