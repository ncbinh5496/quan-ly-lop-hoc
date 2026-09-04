import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { 
  X, RotateCcw, AlertTriangle, Star, Award, Gift, Sparkles, 
  CheckCircle2, RefreshCw, Layers, ShieldAlert, ArrowRight
} from 'lucide-react';
import { cn, playSound } from '../../utils/helpers';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'all' | 'points' | 'badges' | 'rewards' | 'catalog';
}

export function ResetProgressModal({ isOpen, onClose, defaultTab = 'all' }: ResetProgressModalProps) {
  const { 
    classes, 
    activeClassId, 
    resetClassPoints, 
    resetClassBadges, 
    resetClassRewards, 
    resetClassAllProgress,
    resetRewards,
    soundEnabled, 
    showToast 
  } = useStore();

  const [selectedAction, setSelectedAction] = useState<'all' | 'points' | 'badges' | 'rewards' | 'catalog'>(defaultTab);
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAction(defaultTab);
      setConfirmText('');
      setIsProcessing(false);
    }
  }, [isOpen, defaultTab]);

  const activeClass = classes.find(c => c.id === activeClassId);

  if (!isOpen || !activeClass) return null;

  const totalPoints = activeClass.students.reduce((sum, s) => sum + s.points, 0);
  const totalBadgesEarned = activeClass.students.reduce((sum, s) => sum + s.badgeIds.length, 0);
  const totalRewardTxs = activeClass.rewardTransactions?.length || 0;
  const totalTxCount = activeClass.transactions?.length || 0;

  const handleExecuteReset = () => {
    setIsProcessing(true);
    if (soundEnabled) playSound('pop');

    setTimeout(() => {
      if (selectedAction === 'points') {
        resetClassPoints(activeClass.id);
        showToast(`Đã reset toàn bộ điểm số của lớp ${activeClass.name} về 0!`);
      } else if (selectedAction === 'badges') {
        resetClassBadges(activeClass.id);
        showToast(`Đã reset toàn bộ huy hiệu đã trao của lớp ${activeClass.name}!`);
      } else if (selectedAction === 'rewards') {
        resetClassRewards(activeClass.id);
        showToast(`Đã xóa toàn bộ lịch sử đổi thưởng của lớp ${activeClass.name}!`);
      } else if (selectedAction === 'catalog') {
        resetRewards();
        showToast('Đã khôi phục danh mục phần thưởng mẫu mặc định!');
      } else if (selectedAction === 'all') {
        resetClassAllProgress(activeClass.id);
        showToast(`Đã làm mới toàn bộ tiến độ thi đua (Điểm, Huy hiệu, Đổi thưởng) của lớp ${activeClass.name}!`);
      }

      if (soundEnabled) playSound('success');
      setIsProcessing(false);
      setConfirmText('');
      onClose();
    }, 400);
  };

  const getActionDetails = () => {
    switch (selectedAction) {
      case 'points':
        return {
          title: 'Reset Điểm số thi đua',
          icon: <Star className="text-amber-500" size={24} />,
          badge: 'Đưa điểm về 0',
          desc: `Toàn bộ điểm số hiện tại (${totalPoints} sao), điểm cộng, điểm trừ và ${totalTxCount} lịch sử giao dịch điểm của lớp sẽ được xóa sạch về 0.`,
          keeps: 'Giữ nguyên: Danh sách học sinh, ảnh avatar Chibi, phân chia tổ và huy hiệu.',
          color: 'from-amber-500 to-orange-500',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
        };
      case 'badges':
        return {
          title: 'Reset Huy hiệu đã trao',
          icon: <Award className="text-purple-500" size={24} />,
          badge: 'Xóa huy hiệu HS',
          desc: `Toàn bộ ${totalBadgesEarned} huy hiệu đã trao cho học sinh trong lớp sẽ được thu hồi để bắt đầu mùa thi đua mới.`,
          keeps: 'Giữ nguyên: Điểm số hiện tại, danh sách học sinh, phân chia tổ và lịch sử đổi quà.',
          color: 'from-purple-500 to-indigo-500',
          btnBg: 'bg-purple-600 hover:bg-purple-700',
        };
      case 'rewards':
        return {
          title: 'Reset Lịch sử đổi quà',
          icon: <Gift className="text-pink-500" size={24} />,
          badge: 'Xóa lượt đổi quà',
          desc: `Toàn bộ ${totalRewardTxs} lượt đổi quà của học sinh lớp ${activeClass.name} sẽ được đặt lại.`,
          keeps: 'Giữ nguyên: Điểm số của học sinh, huy hiệu, danh sách học sinh và tổ.',
          color: 'from-pink-500 to-rose-500',
          btnBg: 'bg-pink-600 hover:bg-pink-700',
        };
      case 'catalog':
        return {
          title: 'Khôi phục Danh mục Phần thưởng mẫu',
          icon: <RefreshCw className="text-blue-500" size={24} />,
          badge: 'Mẫu mặc định',
          desc: 'Đặt lại danh sách quà tặng trong kho phần thưởng về 12 món quà mặc định ban đầu (Bút chì 2B, Tẩy gôm cute, Vé đổi chỗ, Phiếu miễn bài tập...).',
          keeps: 'Không ảnh hưởng tới điểm số hay thông tin học sinh trong lớp.',
          color: 'from-blue-500 to-cyan-500',
          btnBg: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'all':
      default:
        return {
          title: 'Làm mới Toàn Bộ Thi Đua (Tuần/Tháng/Kỳ mới)',
          icon: <RotateCcw className="text-red-500" size={24} />,
          badge: 'Điểm + Huy hiệu + Đổi quà',
          desc: `Đưa toàn bộ Điểm số về 0, xóa ${totalBadgesEarned} huy hiệu và xóa ${totalRewardTxs} lượt đổi quà để mở ra một chặng thi đua hoàn toàn mới cho lớp ${activeClass.name}!`,
          keeps: 'Giữ an toàn: Toàn bộ danh sách học sinh, ảnh Chibi và các Tổ nhóm không bị mất.',
          color: 'from-red-500 via-rose-500 to-pink-600',
          btnBg: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const details = getActionDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col my-auto transition-all">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
              <RotateCcw size={20} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Trung Tâm Reset & Làm Mới Thi Đua
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Lớp: <strong className="text-amber-300 font-bold">{activeClass.name}</strong> • {activeClass.students.length} học sinh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-slate-50/50">
          
          {/* Action Tabs / Selector */}
          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2.5">
              Chọn nội dung bạn muốn làm mới:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction('all')}
                className={cn(
                  "p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer",
                  selectedAction === 'all'
                    ? "bg-red-50 border-red-500 text-red-700 shadow-sm scale-102 font-black"
                    : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold"
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-sm">
                  🔄
                </div>
                <span className="text-xs">Tất cả tiến độ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('points')}
                className={cn(
                  "p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer",
                  selectedAction === 'points'
                    ? "bg-amber-50 border-amber-500 text-amber-800 shadow-sm scale-102 font-black"
                    : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold"
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                  ⭐
                </div>
                <span className="text-xs">Reset Điểm số</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('badges')}
                className={cn(
                  "p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer",
                  selectedAction === 'badges'
                    ? "bg-purple-50 border-purple-500 text-purple-800 shadow-sm scale-102 font-black"
                    : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold"
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm">
                  🏅
                </div>
                <span className="text-xs">Reset Huy hiệu</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('rewards')}
                className={cn(
                  "p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer",
                  selectedAction === 'rewards'
                    ? "bg-pink-50 border-pink-500 text-pink-800 shadow-sm scale-102 font-black"
                    : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold"
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm">
                  🎁
                </div>
                <span className="text-xs">Reset Đổi quà</span>
              </button>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {details.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm sm:text-base">
                    {details.title}
                  </h4>
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold text-[11px] mt-0.5">
                    {details.badge}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {details.desc}
            </p>

            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{details.keeps}</span>
            </div>

            {/* Current Class Overview Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Điểm hiện tại</div>
                <div className="text-xs sm:text-sm font-black text-amber-600 mt-0.5">
                  ⭐ {totalPoints} sao
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Huy hiệu đã trao</div>
                <div className="text-xs sm:text-sm font-black text-purple-600 mt-0.5">
                  🏅 {totalBadgesEarned} cái
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Lượt đổi thưởng</div>
                <div className="text-xs sm:text-sm font-black text-pink-600 mt-0.5">
                  🎁 {totalRewardTxs} lượt
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Warning Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 font-medium">
              <span className="font-bold">Lưu ý:</span> Hành động reset không thể hoàn tác trực tiếp sau khi thực hiện. Bạn có thể xuất báo cáo Excel trước nếu muốn lưu giữ kỷ niệm thi đua cũ.
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExecuteReset}
              disabled={isProcessing}
              className={cn(
                "px-5 py-2.5 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50",
                details.btnBg
              )}
            >
              <RotateCcw size={15} className={isProcessing ? "animate-spin" : ""} />
              {isProcessing ? 'Đang thực hiện...' : `XÁC NHẬN ${details.title.toUpperCase()}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
