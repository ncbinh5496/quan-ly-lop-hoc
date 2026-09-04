import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Trophy, 
  Volume2, 
  Printer, 
  Check, 
  Heart, 
  Flame, 
  Crown, 
  Star,
  Award
} from 'lucide-react';
import { Badge, Student, ClassData, Teacher } from '../../types';
import { 
  BadgeCelebrationTheme, 
  getBadgeCelebrationTheme, 
  playCelebrationSynthesizer, 
  fireBadgeConfetti 
} from '../../utils/badgeCelebration';
import { getAvatarUrl } from '../../utils/helpers';
import { Badge3DStage } from '../ui/Badge3DStage';

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
  student: Student | null;
  currentClass: ClassData | null;
  teacher: Teacher | null;
  soundEnabled: boolean;
}

export function BadgeCelebrationModal({
  isOpen,
  onClose,
  badge,
  student,
  currentClass,
  teacher,
  soundEnabled
}: BadgeCelebrationModalProps) {
  const [replayCount, setReplayCount] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      const theme = getBadgeCelebrationTheme(badge);
      if (soundEnabled) {
        playCelebrationSynthesizer(theme.soundType);
      }
      fireBadgeConfetti(theme);
    }
  }, [isOpen, badge, replayCount, soundEnabled]);

  if (!isOpen || !badge || !student) return null;

  const theme: BadgeCelebrationTheme = getBadgeCelebrationTheme(badge);
  const avatarSrc = getAvatarUrl(student.avatarId, currentClass?.customAvatars);
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleReplay = () => {
    setReplayCount(prev => prev + 1);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl transition-all"
        />

        {/* Ambient floating theme particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {theme.floatingParticles.map((emoji, idx) => (
            <motion.div
              key={`${idx}-${replayCount}`}
              initial={{ 
                opacity: 0, 
                scale: 0.2, 
                x: `${15 + (idx * 14)}vw`, 
                y: '100vh',
                rotate: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0.9, 0], 
                scale: [0.5, 1.4, 1.2, 0.8], 
                y: '-10vh',
                rotate: (idx % 2 === 0 ? 360 : -360) + (idx * 45)
              }}
              transition={{ 
                duration: 4.5 + (idx * 0.4), 
                repeat: Infinity,
                delay: idx * 0.35,
                ease: 'easeInOut' 
              }}
              className="absolute text-4xl sm:text-5xl drop-shadow-lg select-none"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-xl bg-white/95 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-amber-300/80 z-20 my-auto text-slate-800 backdrop-blur-md max-h-[92vh] flex flex-col"
        >
          {/* Top Decorative Radiant Sunburst Header */}
          <div className={`relative w-full py-6 sm:py-7 px-6 bg-gradient-to-r ${theme.bannerGradient} text-white text-center overflow-hidden shadow-md shrink-0`}>
            {/* Background glowing rays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0,transparent_70%)] animate-pulse" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all shadow-md backdrop-blur-xs z-30"
              title="Đóng"
            >
              <X size={18} />
            </button>

            {/* Header Badge Title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative z-10 space-y-1"
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black uppercase tracking-widest text-white border border-white/40 shadow-xs">
                <Sparkles size={14} className="text-yellow-200 animate-spin" />
                Vinh Danh Thành Tích
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md uppercase mt-1">
                {theme.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-white/90 drop-shadow">
                {theme.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Central Scrollable Body */}
          <div className="p-5 sm:p-7 flex flex-col items-center text-center overflow-y-auto space-y-5">
            
            {/* Dedicated 3D Theme Interactive Stage */}
            <Badge3DStage 
              badge={badge} 
              theme={theme} 
              studentName={student.name} 
            />

            {/* Recipient Student Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4 text-left"
            >
              <div className="relative shrink-0">
                <img
                  src={avatarSrc}
                  alt={student.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover bg-white border-3 border-amber-400 shadow-md"
                />
                <span className="absolute -bottom-2 -right-1 text-xl">
                  {student.gender === 'Nam' ? '👦' : '👧'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-sans">
                    Học sinh vinh danh
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Lớp {currentClass?.name || '2A6'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 truncate mt-0.5">
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-semibold">
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    ⭐ {student.points} Điểm tích lũy
                  </span>
                  <span>•</span>
                  <span className="text-pink-600 font-bold">
                    🎖️ {badge.name}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Praise Quote / Compliment Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="w-full bg-gradient-to-r from-amber-50 via-pink-50 to-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-200/90 text-center shadow-xs relative"
            >
              <div className="text-xs font-black uppercase tracking-wider text-amber-700 mb-1 flex items-center justify-center gap-1">
                <span>💬 Lời Khen Tặng Từ Giáo Viên</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 italic leading-relaxed">
                "{theme.praiseQuote}"
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
                <span>👩‍🏫 {teacher?.name || 'Cô Phương Anh'}</span>
                <span>•</span>
                <span>📅 {todayFormatted}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleReplay}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-300"
                title="Phát lại hiệu ứng âm thanh và pháo hoa"
              >
                <Volume2 size={16} className="text-indigo-600" />
                <span>Phát lại pháo hoa</span>
              </button>

              <button
                onClick={() => setShowCertificate(true)}
                className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200 active:scale-95"
                title="Xem và in Giấy Tuyên Dương cho học sinh"
              >
                <Award size={16} className="text-yellow-300" />
                <span>Giấy tuyên dương</span>
              </button>

              <button
                onClick={onClose}
                className="w-full flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95"
              >
                <Check size={18} />
                <span>Tuyệt vời! Hoàn tất</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Certificate Modal View for Printing/Showing to Students & Parents */}
      {showCertificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-8 border-amber-400 text-slate-800 text-center my-auto">
            {/* Header controls */}
            <div className="flex justify-between items-center mb-4 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                📜 Giấy Khen Tuyên Dương Danh Dự
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer size={14} /> In giấy khen
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Certificate Layout */}
            <div className="border-4 border-double border-amber-300 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
              <div className="text-center space-y-1 mb-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-500">
                  {teacher?.schoolName || 'TRƯỜNG TIỂU HỌC HÙNG VƯƠNG'}
                </p>
                <p className="text-xs font-bold text-slate-600">
                  LỚP {currentClass?.name || '2A6'} • NĂM HỌC {teacher?.academicYear || '2026-2027'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-amber-600 uppercase tracking-tight pt-2">
                  GIẤY TUYÊN DƯƠNG DANH DỰ
                </h1>
                <p className="text-xs italic text-slate-500">Trao tặng danh hiệu xuất sắc</p>
              </div>

              <div className="my-6 space-y-2">
                <p className="text-sm font-semibold text-slate-600">Thân ái tuyên dương em:</p>
                <h2 className="text-2xl sm:text-3xl font-black text-blue-700 tracking-wide underline decoration-amber-400 underline-offset-8">
                  {student.name}
                </h2>
              </div>

              <div className="bg-amber-100/70 rounded-2xl p-4 max-w-md mx-auto my-4 border border-amber-300/80">
                <div className="text-4xl mb-1">{badge.icon}</div>
                <div className="text-lg font-black text-amber-900">{badge.name}</div>
                <div className="text-xs font-semibold text-amber-800">{theme.subtitle}</div>
                <p className="text-xs text-slate-700 italic mt-2 font-medium">"{theme.praiseQuote}"</p>
              </div>

              <div className="mt-8 flex justify-between items-end px-4 sm:px-8 text-xs font-bold text-slate-600">
                <div className="text-left">
                  <p>Xác nhận của Lớp trưởng</p>
                  <p className="text-[10px] text-slate-400 font-normal italic mt-8">Sao sáng thi đua</p>
                </div>
                <div className="text-right">
                  <p>Ngày {todayFormatted}</p>
                  <p className="font-bold text-slate-800 mt-1">Giáo viên chủ nhiệm</p>
                  <p className="text-sm font-black text-slate-900 mt-6">{teacher?.name || 'Cô Phương Anh'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
