import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetProgressSectionProps {
  onOpenResetModal: (tab: 'all' | 'points' | 'badges' | 'rewards' | 'catalog') => void;
}

export default function ResetProgressSection({ onOpenResetModal }: ResetProgressSectionProps) {
  return (
    <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 rounded-[32px] p-6 sm:p-8 shadow-xl text-white border border-purple-500/20 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
            <RotateCcw size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black tracking-wider uppercase border border-purple-500/30 mb-1">
              Quản lý chu kỳ thi đua
            </div>
            <h3 className="font-black text-xl text-white tracking-tight">
              Trung Tâm Reset & Làm Mới Dữ Liệu Thi Đua
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Reset điểm số, thu hồi huy hiệu hoặc xóa lịch sử đổi quà khi bắt đầu tuần mới, tháng mới hoặc học kỳ mới.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenResetModal('all')}
          className="px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-black text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RotateCcw size={16} /> LÀM MỚI TOÀN BỘ LỚP HỌC
        </button>
      </div>

      {/* Quick Reset Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-base shrink-0">
              ⭐
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Reset Điểm Số</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Đưa điểm số của tất cả học sinh về 0, xóa lịch sử cộng trừ.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenResetModal('points')}
            className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Điểm Lớp
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-base shrink-0">
              🏅
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Reset Huy Hiệu</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Thu hồi toàn bộ huy hiệu đã trao cho học sinh trong lớp.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenResetModal('badges')}
            className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Huy Hiệu
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-base shrink-0">
              🎁
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Reset Đổi Thưởng</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Xóa lịch sử đổi quà tặng của các học sinh trong lớp.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenResetModal('rewards')}
            className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Đổi Quà
          </button>
        </div>
      </div>
    </div>
  );
}
