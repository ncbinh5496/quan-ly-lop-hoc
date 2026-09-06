import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { 
  Search, 
  Bell, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Menu
} from 'lucide-react';
import { TeacherModal } from '../modals/TeacherModal';
import { ClassModal } from '../modals/ClassModal';
import { CoverModal } from '../modals/CoverModal';
import { ResetProgressModal } from '../modals/ResetProgressModal';

interface TopbarProps {
  activeTab?: string;
  onOpenMobileDrawer?: () => void;
}

export function Topbar({ activeTab = 'dashboard', onOpenMobileDrawer }: TopbarProps) {
  const appTitle = useStore(state => state.appTitle);
  const appSlogan = useStore(state => state.appSlogan);
  const teacher = useStore(state => state.teacher);
  const classes = useStore(state => state.classes);
  const activeClassId = useStore(state => state.activeClassId);
  const soundEnabled = useStore(state => state.soundEnabled);
  const toggleSound = useStore(state => state.toggleSound);
  const undoLastTransaction = useStore(state => state.undoLastTransaction);

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const recentTransactions = activeClass?.transactions?.slice(0,4) || [];

  return (
    <>
      <header 
        className="no-print min-h-[72px] sm:min-h-[82px] md:min-h-[86px] bg-white/95 backdrop-blur-xl border-b border-purple-100/90 flex flex-wrap items-center justify-between sticky top-0 z-20 shrink-0 select-none shadow-[0_6px_28px_rgba(124,58,237,0.07)] safe-top transition-all"
        style={{
          paddingLeft: 'clamp(0.75rem, 3vw, 2rem)',
          paddingRight: 'clamp(0.75rem, 3vw, 2rem)',
          paddingTop: 'clamp(0.5rem, 1.2vw, 0.875rem)',
          paddingBottom: 'clamp(0.5rem, 1.2vw, 0.875rem)',
          gap: 'clamp(0.5rem, 1.8vw, 1.25rem)',
        }}
      >
        {/* LEFT: MOBILE MENU BUTTON + APP TITLE & SLOGAN */}
        <div 
          className="flex items-center min-w-0 flex-1 py-1"
          style={{ gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}
        >
          {/* Mobile Hamburger Drawer Trigger */}
          {onOpenMobileDrawer && (
            <button
              onClick={onOpenMobileDrawer}
              className="md:hidden rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/80 shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
              style={{
                width: 'clamp(2.5rem, 9vw, 2.75rem)',
                height: 'clamp(2.5rem, 9vw, 2.75rem)',
                minWidth: '44px',
                minHeight: '44px',
              }}
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Decorative Sparkle Icon Badge */}
          <div 
            className="rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 p-[2.5px] shadow-md shadow-purple-500/25 shrink-0 hidden xs:flex items-center justify-center transition-transform hover:scale-105"
            style={{
              width: 'clamp(2.75rem, 4.5vw, 3.5rem)',
              height: 'clamp(2.75rem, 4.5vw, 3.5rem)',
            }}
          >
            <div 
              className="w-full h-full bg-white rounded-[13px] flex items-center justify-center shadow-inner"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
            >
              🏆
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-wrap">
              <h1 
                className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 uppercase tracking-tight truncate drop-shadow-xs leading-tight"
                style={{
                  fontSize: 'clamp(0.95rem, 2.4vw, 1.45rem)',
                  maxWidth: '100%',
                }}
              >
                {appTitle || 'HÀNH TRÌNH CHINH PHỤC VINH QUANG'}
              </h1>
              <span 
                className="inline-flex items-center gap-1 font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-xs shrink-0"
                style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.8125rem)' }}
              >
                ★ {activeClass?.name || 'Lớp học'}
              </span>
            </div>
            {(appSlogan || appSlogan === undefined) && (
              <div className="mt-1 hidden sm:flex items-center">
                <p 
                  className="font-bold text-slate-600 truncate inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 via-pink-50/60 to-amber-50/60 px-3 py-1 rounded-full border border-purple-100/70 shadow-2xs"
                  style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)' }}
                >
                  <Sparkles size={14} className="text-amber-500 shrink-0 animate-pulse" />
                  <span className="truncate">
                    {appSlogan || 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao'}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SEARCH BAR + CONTROLS + NOTIFICATIONS + TEACHER AVATAR */}
        <div 
          className="flex items-center flex-wrap shrink-0"
          style={{ gap: 'clamp(0.375rem, 1.2vw, 0.75rem)' }}
        >
          {/* Large Search Bar (Desktop only) */}
          <div className="relative hidden xl:block w-52 2xl:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm học sinh..."
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-purple-100 rounded-full text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Quick Tools: Undo + Sound Toggle */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-purple-100/80 shadow-2xs shrink-0">
            <button
              onClick={undoLastTransaction}
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
              title="Hoàn tác điểm gần nhất"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-full bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-600 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? <Volume2 size={14} className="text-purple-600" /> : <VolumeX size={14} className="text-slate-400" />}
            </button>
          </div>

          {/* Notifications Bell with Popover */}
          <div ref={notifRef} className="relative shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 flex items-center justify-center border border-purple-100/80 transition-all shadow-2xs relative cursor-pointer active:scale-95 shrink-0"
              title="Thông báo hoạt động lớp học"
            >
              <Bell size={16} />
              {recentTransactions.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 p-3.5 space-y-2.5 animate-bounce-in z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-purple-600" /> Hoạt động mới nhất
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {activeClass?.name}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {recentTransactions.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4">Chưa có thông báo mới.</p>
                  ) : (
                    recentTransactions.map(t => {
                      const student = activeClass?.students.find(s => s.id === t.studentId);
                      return (
                        <div key={t.id} className="p-2 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-800">{student?.name || 'Học sinh'}</span>
                            <span className={t.amount > 0 ? "text-emerald-600" : "text-rose-600"}>
                              {t.amount > 0 ? `+${t.amount}` : t.amount} sao
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{t.reason}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile Trigger Pill */}
          <div
            onClick={() => setShowTeacherModal(true)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200/80 cursor-pointer transition-all shadow-xs group shrink-0 min-h-[40px] sm:min-h-[44px]"
            title="Xem & chỉnh sửa hồ sơ giáo viên chủ nhiệm"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-black ring-2 ring-white shadow-xs overflow-hidden shrink-0">
              {teacher?.avatarUrl ? (
                <img src={teacher.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>👩‍🏫</span>
              )}
            </div>
            <div className="hidden xl:block text-left max-w-[120px]">
              <p className="text-xs sm:text-sm font-black text-slate-800 leading-none group-hover:text-purple-700 transition-colors truncate">
                {teacher?.name || 'Cô Phương Anh'}
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-tight mt-1 truncate">
                {activeClass?.name || 'Lớp 2A6'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <TeacherModal 
        isOpen={showTeacherModal} 
        onClose={() => setShowTeacherModal(false)} 
      />

      <ClassModal 
        isOpen={showClassModal} 
        onClose={() => setShowClassModal(false)} 
      />

      <CoverModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
      />

      <ResetProgressModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
}

