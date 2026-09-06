import { useShallow } from 'zustand/react/shallow';
import React from 'react';
import { 
  X, 
  Home, 
  Users, 
  UsersRound, 
  Trophy, 
  Gift, 
  BarChart2, 
  Medal, 
  Target, 
  Settings, 
  History as HistoryIcon, 
  Download, 
  School,
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronsUpDown,
  Check
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useStore, useActiveClass } from '../../store';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTeacherModal: () => void;
  onOpenClassModal: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenTeacherModal,
  onOpenClassModal,
}: MobileDrawerProps) {
  const { 
    teacher, 
    classes, 
    activeClassId, 
    setActiveClass, 
    soundEnabled, 
    toggleSound, 
    showToast
  } = useStore(useShallow(state => ({ teacher: state.teacher, classes: state.classes, activeClassId: state.activeClassId, setActiveClass: state.setActiveClass, soundEnabled: state.soundEnabled, toggleSound: state.toggleSound, showToast: state.showToast })));

  const activeClass = useActiveClass();
  const [showClassList, setShowClassList] = React.useState(false);

  if (!isOpen) return null;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const navItems = [
    { id: 'dashboard', label: 'Trang chủ (Tổng quan)', icon: Home, color: 'text-purple-600' },
    { id: 'students', label: 'Danh sách học sinh', icon: Users, color: 'text-blue-600', badge: `${activeClass?.students.length || 0} HS` },
    { id: 'groups', label: 'Quản lý Nhóm / Tổ', icon: UsersRound, color: 'text-emerald-600', badge: `${activeClass?.groups.length || 0} tổ` },
    { id: 'leaderboard', label: 'Bảng xếp hạng thi đua', icon: Trophy, color: 'text-amber-500', badge: 'TOP' },
    { id: 'badges', label: 'Kho huy hiệu danh dự', icon: Medal, color: 'text-violet-600' },
    { id: 'rewards', label: 'Cửa hàng phần thưởng', icon: Gift, color: 'text-pink-600' },
    { id: 'tools', label: 'Vòng quay & Hẹn giờ game', icon: Target, color: 'text-rose-500', badge: 'HOT' },
    { id: 'history', label: 'Lịch sử cộng / trừ điểm', icon: HistoryIcon, color: 'text-cyan-600' },
    { id: 'reports', label: 'Báo cáo & Thống kê Excel', icon: BarChart2, color: 'text-indigo-600' },
    { id: 'import', label: 'Nhập học sinh từ Excel', icon: Download, color: 'text-teal-600', teacherOnly: true },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings, color: 'text-slate-600', teacherOnly: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden safe-top safe-bottom">
        {/* Drawer Header */}
        <div className="p-4 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
              🏆
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-800 text-sm truncate">Menu chức năng</h3>
              <p className="text-[11px] text-slate-500 truncate">Lớp {activeClass?.name}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-purple-100 shadow-2xs cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Class Switcher Card */}
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 rounded-2xl p-3.5 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <GraduationCap size={20} className="text-amber-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-purple-200">Đang chọn lớp</p>
                  <p className="font-black text-base truncate">{activeClass?.name}</p>
                </div>
              </div>

              <button
                onClick={() => { onClose(); onOpenClassModal(); }}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black flex items-center gap-1 transition-all border border-white/20 cursor-pointer shrink-0"
              >
                <span>Đổi tên</span>
                <ChevronsUpDown size={13} />
              </button>
            </div>

            {/* Expanded Class List inside Drawer */}
            {showClassList && (
              <div className="mt-3 pt-3 border-t border-white/20 space-y-1.5 animate-fade-in">
                {classes.map(c => {
                  const isSelected = c.id === activeClassId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveClass(c.id);
                        setShowClassList(false);
                        showToast(`Đã chuyển sang ${c.name}`);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all text-left",
                        isSelected ? "bg-white text-purple-900 shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                      )}
                    >
                      <span>{c.name} ({c.students.length} HS)</span>
                      {isSelected && <Check size={14} className="text-purple-600 font-bold" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
              Danh mục tính năng
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer",
                    isActive 
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                      : "text-slate-700 hover:bg-purple-50/80"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center shrink-0",
                      isActive ? "bg-white/20 text-white" : `${item.color} bg-slate-100`
                    )}>
                      <Icon size={16} />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-black shrink-0",
                      isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                    )}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {soundEnabled ? <Volume2 size={16} className="text-purple-600" /> : <VolumeX size={16} className="text-slate-400" />}
              <span>Hiệu ứng âm thanh</span>
            </span>
            <span className={soundEnabled ? "text-purple-600 font-black" : "text-slate-400"}>
              {soundEnabled ? 'Bật' : 'Tắt'}
            </span>
          </button>

          {/* Teacher Profile Trigger */}
          <div 
            onClick={() => {
              onClose();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-purple-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-black shrink-0 overflow-hidden">
              {teacher?.avatarUrl ? (
                <img src={teacher.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : '👩‍🏫'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-800 truncate">{teacher?.name || 'Cô Phương Anh'}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{teacher?.subject || 'Giáo viên chủ nhiệm'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

