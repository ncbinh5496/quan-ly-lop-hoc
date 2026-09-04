import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Users, 
  UsersRound, 
  Trophy, 
  Gift, 
  BarChart2, 
  Medal, 
  Target, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  History as HistoryIcon, 
  Download, 
  Pencil, 
  Plus, 
  ChevronsUpDown, 
  Check, 
  School,
  GraduationCap,
  Sparkles,
  Star,
  Flame,
  Volume2,
  VolumeX,
  HeartHandshake
} from 'lucide-react';
import { cn, playSound, triggerConfetti } from '../../utils/helpers';
import { useStore } from '../../store';
import { TeacherModal } from '../modals/TeacherModal';
import { ClassModal } from '../modals/ClassModal';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab }: SidebarProps) {
  const { 
    teacher, 
    classes, 
    activeClassId, 
    setActiveClass, 
    showToast, 
    soundEnabled, 
    toggleSound, 
    rewards,
    userRole,
    setUserRole,
    setPinAuthModal,
    workspaces,
    setWorkspaceModal,
    setDepartmentModal,
  } = useStore();
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];

  // Calculate total class points
  const totalClassPoints = activeClass?.students?.reduce((acc, s) => acc + (s.points || 0), 0) || 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowClassDropdown(false);
      }
    }
    if (showClassDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClassDropdown]);

  const handleSelectClass = (id: string, name: string) => {
    setActiveClass(id);
    setShowClassDropdown(false);
    showToast(`Đã chuyển sang ${name}`);
  };

  const handleOpenAddClass = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userRole === 'parent') {
      setPinAuthModal({
        isOpen: true,
        title: 'Chỉ Giáo viên chủ nhiệm mới được thêm lớp học mới',
        onSuccess: () => {
          setEditingClassId(null);
          setShowClassModal(true);
          setShowClassDropdown(false);
        }
      });
      return;
    }
    setEditingClassId(null);
    setShowClassModal(true);
    setShowClassDropdown(false);
  };

  const handleOpenEditClass = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (userRole === 'parent') {
      setPinAuthModal({
        isOpen: true,
        title: 'Chỉ Giáo viên chủ nhiệm mới được đổi tên và cấu hình lớp',
        onSuccess: () => {
          setEditingClassId(id);
          setShowClassModal(true);
          setShowClassDropdown(false);
        }
      });
      return;
    }
    setEditingClassId(id);
    setShowClassModal(true);
    setShowClassDropdown(false);
  };

  const handleCheerClass = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playSound('tada');
    triggerConfetti();
    showToast(`🎉 Cổ vũ tinh thần cho ${activeClass?.name || 'lớp học'}!`);
  };

  // Structured menu items with categories, icon colors & dynamic badges
  const navSections = [
    {
      title: 'HOẠT ĐỘNG CHÍNH',
      items: [
        { 
          id: 'dashboard', 
          icon: Home, 
          label: 'Trang chủ', 
          color: 'text-purple-600',
          bgHover: 'group-hover:bg-purple-500/10',
          badge: null
        },
        { 
          id: 'students', 
          icon: Users, 
          label: 'Học sinh', 
          color: 'text-blue-600',
          bgHover: 'group-hover:bg-blue-500/10',
          badge: activeClass?.students?.length ? `${activeClass.students.length}` : null,
          badgeColor: 'bg-blue-100 text-blue-700'
        },
        { 
          id: 'groups', 
          icon: UsersRound, 
          label: 'Nhóm / Tổ', 
          color: 'text-emerald-600',
          bgHover: 'group-hover:bg-emerald-500/10',
          badge: activeClass?.groups?.length ? `${activeClass.groups.length} tổ` : null,
          badgeColor: 'bg-emerald-100 text-emerald-700'
        },
      ]
    },
    {
      title: 'THI ĐUA & VINH DANH',
      items: [
        { 
          id: 'leaderboard', 
          icon: Trophy, 
          label: 'Bảng thi đua', 
          color: 'text-amber-500',
          bgHover: 'group-hover:bg-amber-500/10',
          badge: 'TOP',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-xs'
        },
        { 
          id: 'badges', 
          icon: Medal, 
          label: 'Kho huy hiệu', 
          color: 'text-violet-600',
          bgHover: 'group-hover:bg-violet-500/10',
          badge: '⭐',
          badgeColor: 'bg-violet-100 text-violet-700'
        },
        { 
          id: 'rewards', 
          icon: Gift, 
          label: 'Cửa hàng quà', 
          color: 'text-pink-600',
          bgHover: 'group-hover:bg-pink-500/10',
          badge: rewards?.length ? `${rewards.length}` : null,
          badgeColor: 'bg-pink-100 text-pink-700'
        },
        { 
          id: 'tools', 
          icon: Target, 
          label: 'Thử thách & Game', 
          color: 'text-rose-500',
          bgHover: 'group-hover:bg-rose-500/10',
          badge: 'HOT',
          badgeColor: 'bg-gradient-to-r from-rose-500 to-red-500 text-white font-black animate-pulse'
        },
      ]
    },
    {
      title: 'DỮ LIỆU & QUẢN TRỊ',
      items: [
        { 
          id: 'history', 
          icon: HistoryIcon, 
          label: 'Lịch sử điểm', 
          color: 'text-cyan-600',
          bgHover: 'group-hover:bg-cyan-500/10',
          badge: null
        },
        { 
          id: 'reports', 
          icon: BarChart2, 
          label: 'Báo cáo thống kê', 
          color: 'text-indigo-600',
          bgHover: 'group-hover:bg-indigo-500/10',
          badge: null
        },
        { 
          id: 'import', 
          icon: Download, 
          label: 'Nhập dữ liệu', 
          color: 'text-teal-600',
          bgHover: 'group-hover:bg-teal-500/10',
          badge: 'Excel',
          badgeColor: 'bg-teal-100 text-teal-700 font-bold'
        },
        { 
          id: 'settings', 
          icon: Settings, 
          label: 'Cài đặt hệ thống', 
          color: 'text-slate-600',
          bgHover: 'group-hover:bg-slate-500/10',
          badge: null
        },
      ]
    }
  ];

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-white/95 backdrop-blur-2xl border-r border-purple-100/90 flex flex-col transition-all duration-300 z-30 shrink-0 select-none shadow-[4px_0_30px_rgba(124,58,237,0.06)] relative",
          collapsed ? "w-[84px] p-3" : "w-[268px] p-3.5"
        )}
      >
        {/* TOP CLASS CARD */}
        <div className="mb-2 shrink-0 relative z-30">
          {/* Active Class Lively Card */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className={cn(
                "group relative overflow-hidden rounded-[22px] bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-3.5 text-white cursor-pointer transition-all duration-300",
                "shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4),0_6px_12px_-3px_rgba(236,72,153,0.25)]",
                "hover:shadow-[0_16px_32px_-6px_rgba(124,58,237,0.5),0_8px_16px_-4px_rgba(236,72,153,0.35)]",
                "hover:-translate-y-1 active:translate-y-0",
                "border-t border-l border-white/50 border-b border-r border-purple-900/20 ring-2 ring-purple-300/40",
                collapsed ? "p-2.5 text-center" : ""
              )}
              title="Bấm để chọn và chuyển đổi lớp học"
            >
              {/* Glossy top glass light reflection */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-[22px]" />
              {/* Floating ambient glow orbs */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-400/30 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

              {!collapsed ? (
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-lg text-[10px] text-amber-200 font-black shadow-inner">
                      <School size={11} className="text-amber-300" /> {teacher?.academicYear || '2026-2027'}
                    </span>
                    <div className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-lg backdrop-blur-sm transition-all border border-white/20 text-white shadow-2xs">
                      <span className="text-[10px] font-bold">Đổi lớp</span>
                      <ChevronsUpDown size={12} className="text-amber-200 group-hover:scale-125 transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-lg font-black text-white truncate flex items-center gap-2 tracking-tight drop-shadow-sm">
                      <div className="w-8 h-8 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 shadow-md shrink-0 group-hover:rotate-6 transition-transform">
                        <GraduationCap size={18} strokeWidth={2.5} />
                      </div>
                      <span className="truncate">{activeClass?.name || 'Lớp 2A6'}</span>
                    </div>

                    {/* Live Star Count Badge with high-contrast bright golden look */}
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black shadow-md shadow-amber-500/30 shrink-0 border border-white/60 ring-1 ring-amber-500/50">
                      <Star size={13} className="fill-slate-950 text-slate-950" />
                      <span>{totalClassPoints}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-extrabold text-white flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="flex items-center gap-1.5 bg-black/15 px-2 py-0.5 rounded-md border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shadow-sm shadow-emerald-300" />
                      {activeClass?.students?.length || 0} học sinh
                    </span>
                    <span className="text-amber-200 bg-black/15 px-2 py-0.5 rounded-md border border-white/10">
                      {activeClass?.groups?.length || 0} tổ thi đua
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center mb-1 shadow-md group-hover:rotate-12 transition-transform">
                    <GraduationCap size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-black text-white truncate max-w-full drop-shadow-xs">
                    {activeClass?.name || 'Lớp'}
                  </span>
                  <span className="text-[10px] font-black text-slate-950 bg-amber-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 mt-1 shadow-xs">
                    ★ {totalClassPoints}
                  </span>
                </div>
              )}
            </div>

            {/* Dropdown Popover */}
            {showClassDropdown && (
              <div className={cn(
                "absolute z-50 rounded-[22px] bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-600 p-3.5 space-y-2.5 text-white animate-bounce-in",
                "shadow-[0_16px_36px_-6px_rgba(124,58,237,0.5),0_8px_18px_-4px_rgba(236,72,153,0.4)]",
                "border-t border-l border-white/40 border-b border-r border-purple-900/40 ring-2 ring-purple-300/30 backdrop-blur-2xl",
                collapsed ? "left-full top-0 ml-3 w-72" : "top-full left-0 right-0 mt-2 w-full min-w-[250px]"
              )}>
                {/* Header in Popover */}
                <div className="flex items-center justify-between px-1 pb-2 border-b border-white/20">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-100 flex items-center gap-1.5 drop-shadow-2xs">
                    <School size={13} className="text-amber-300" /> Danh sách lớp
                  </span>
                  <button
                    onClick={handleOpenAddClass}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-black flex items-center gap-1 transition-all border border-white/30 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus size={13} className="text-amber-300" /> Thêm lớp
                  </button>
                </div>

                {/* Class List */}
                <div className="max-h-56 overflow-y-auto space-y-1.5 py-1 pr-1 custom-scrollbar">
                  {classes.map(c => {
                    const isSelected = c.id === activeClassId;
                    const cStars = c.students?.reduce((acc, s) => acc + (s.points || 0), 0) || 0;

                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectClass(c.id, c.name)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-left group relative overflow-hidden",
                          isSelected
                            ? "bg-white/25 border border-white/50 text-white font-bold shadow-md shadow-purple-900/30 ring-1 ring-amber-300/60"
                            : "bg-black/20 border border-white/10 hover:bg-white/15 hover:border-white/25 text-purple-100"
                        )}
                      >
                        <div className="min-w-0 flex-1 relative z-10">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black truncate text-white drop-shadow-2xs">{c.name}</p>
                            <span className="text-[10px] bg-gradient-to-r from-amber-300 to-orange-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                              ⭐ {cStars}
                            </span>
                          </div>
                          <p className="text-[10px] text-purple-200/90 font-medium mt-0.5">
                            {c.students.length} học sinh • {c.groups.length} tổ
                          </p>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-300 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm border border-white/60 ml-2 relative z-10">
                            <Check size={12} strokeWidth={3.5} />
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleOpenEditClass(e, c.id)}
                            className="p-1.5 text-purple-200/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors ml-2 relative z-10"
                            title="Sửa tên lớp"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Switch to Other Teachers / Workspaces & Department */}
                <div className="pt-2 border-t border-white/20 space-y-1.5">
                  <button
                    onClick={() => {
                      setShowClassDropdown(false);
                      setWorkspaceModal(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all text-left cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Users size={13} className="text-amber-300 shrink-0" />
                      <span className="truncate">Đổi Giáo viên ({workspaces.length} GV độc lập)</span>
                    </div>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-md font-black shrink-0">
                      Quản lý
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowClassDropdown(false);
                      setDepartmentModal(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/60 border border-white/15 text-white text-xs font-bold transition-all text-left cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <School size={13} className="text-pink-300 shrink-0" />
                      <span className="truncate">Bảng Thi Đua Tổ ({workspaces.length} Lớp)</span>
                    </div>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-black shrink-0">
                      Tổ Khối 2
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MENU ITEMS (GROUPED BY SECTION) */}
        <nav className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1.5 relative z-10 custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400/90 flex items-center justify-between">
                  <span>{section.title}</span>
                </div>
              )}

              <div className="space-y-1">
                {section.items.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  const isTeacherOnly = item.id === 'settings' || item.id === 'import';
                  const isLockedForParent = userRole === 'parent' && isTeacherOnly;

                  const handleItemClick = () => {
                    if (isLockedForParent) {
                      setPinAuthModal({
                        isOpen: true,
                        title: `Chỉ Giáo viên chủ nhiệm mới có quyền vào ${item.label}`,
                        onSuccess: () => {
                          setUserRole('teacher');
                          setActiveTab(item.id);
                        }
                      });
                      return;
                    }
                    setActiveTab(item.id);
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={handleItemClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all duration-200 group cursor-pointer relative",
                        isActive
                          ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
                          : "text-slate-600 hover:bg-purple-50/80 hover:text-purple-900 active:scale-95",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Left accent bar on hover/active */}
                      {isActive && (
                        <span className="absolute left-1.5 top-2 bottom-2 w-1 rounded-full bg-amber-300" />
                      )}

                      <div className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : `${item.color} bg-slate-100/70 group-hover:bg-white group-hover:shadow-xs`
                      )}>
                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className={cn(
                            "truncate tracking-tight",
                            isActive ? "font-black text-white" : "font-bold text-slate-700 group-hover:text-purple-900"
                          )}>
                            {item.label}
                          </span>

                          {isLockedForParent ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold bg-purple-100 text-purple-700 ml-1.5 shrink-0">
                              🔒 GV
                            </span>
                          ) : item.badge ? (
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-black ml-1.5 shrink-0 transition-transform group-hover:scale-105",
                              isActive ? "bg-white/25 text-white" : item.badgeColor
                            )}>
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* CHEER / MOTIVATIONAL WIDGET (EXPANDED ONLY) */}
        {!collapsed && (
          <div className="my-2 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-200/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">🌟</span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-800 truncate">Lớp học Tích Cực</p>
                <p className="text-[10px] font-semibold text-slate-500 truncate">Mỗi ngày một niềm vui!</p>
              </div>
            </div>
            <button
              onClick={handleCheerClass}
              className="p-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-[10px] font-black shadow-xs shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Thả pháo hoa cổ vũ"
            >
              🎉 Cổ vũ
            </button>
          </div>
        )}

        {/* FOOTER: TEACHER INFO & CONTROLS */}
        <div className="pt-2 border-t border-purple-100/90 space-y-1.5 mt-auto shrink-0 relative z-10">
          {/* Teacher Profile Pill */}
          <div
            onClick={() => setShowTeacherModal(true)}
            className={cn(
              "flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50/80 hover:bg-purple-50/80 border border-purple-100/80 cursor-pointer transition-all group hover:border-purple-200 hover:shadow-xs",
              collapsed && "justify-center p-1.5"
            )}
            title="Bấm để chỉnh sửa hồ sơ giáo viên"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-black overflow-hidden ring-2 ring-purple-200 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                {teacher?.avatarUrl ? (
                  <img src={teacher.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>👩‍🏫</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                  {teacher?.name || 'Cô Phương Anh'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 truncate">
                  {teacher?.subject || 'Giáo viên chủ nhiệm'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Sound Toggle & Collapse Bar */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className={cn(
                "py-1.5 px-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-transparent hover:border-purple-100",
                collapsed ? "w-full" : "flex-1"
              )}
              title={soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={15} className="text-purple-600" />
                  {!collapsed && <span className="text-[11px] font-bold">Âm thanh: Bật</span>}
                </>
              ) : (
                <>
                  <VolumeX size={15} className="text-slate-400" />
                  {!collapsed && <span className="text-[11px] font-bold">Âm thanh: Tắt</span>}
                </>
              )}
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "p-1.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer border border-transparent hover:border-purple-100 shrink-0",
                collapsed ? "hidden" : "block"
              )}
              title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
              title="Mở rộng menu"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </aside>

      <TeacherModal 
        isOpen={showTeacherModal} 
        onClose={() => setShowTeacherModal(false)} 
      />

      <ClassModal 
        isOpen={showClassModal} 
        onClose={() => {
          setShowClassModal(false);
          setEditingClassId(null);
        }} 
        editingClassId={editingClassId}
      />
    </>
  );
}
