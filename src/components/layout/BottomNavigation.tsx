import React from 'react';
import { 
  Home, 
  Users, 
  Target, 
  Trophy, 
  Menu,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useStore, useActiveClass } from '../../store';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileDrawer: () => void;
  isMobileDrawerOpen: boolean;
}

export function BottomNavigation({ 
  activeTab, 
  setActiveTab, 
  onOpenMobileDrawer,
  isMobileDrawerOpen 
}: BottomNavigationProps) {
  const activeClass = useActiveClass();

  const mainTabs = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      icon: Home,
      color: 'text-purple-600',
    },
    {
      id: 'students',
      label: 'Học sinh',
      icon: Users,
      color: 'text-blue-600',
      badge: activeClass?.students?.length ? `${activeClass.students.length}` : null,
    },
    {
      id: 'tools',
      label: 'Công cụ',
      icon: Target,
      color: 'text-rose-500',
      badge: 'Hot',
    },
    {
      id: 'leaderboard',
      label: 'Thi đua',
      icon: Trophy,
      color: 'text-amber-500',
    },
  ];

  return (
    <nav 
      className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-purple-100/90 shadow-[0_-4px_24px_rgba(124,58,237,0.08)] safe-bottom"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16 max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.id && !isMobileDrawerOpen;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer min-w-[56px] min-h-[44px]",
                isActive 
                  ? "text-purple-700 font-black scale-105" 
                  : "text-slate-500 hover:text-purple-600 font-semibold"
              )}
            >
              {/* Active Top Glow Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-sm shadow-purple-500/50" />
              )}

              <div className={cn(
                "relative w-7 h-7 flex items-center justify-center rounded-xl transition-all",
                isActive 
                  ? "bg-purple-100 text-purple-700 shadow-2xs" 
                  : "text-slate-500"
              )}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                
                {tab.badge && (
                  <span className={cn(
                    "absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black leading-none uppercase",
                    tab.badge === 'Hot' 
                      ? "bg-rose-500 text-white animate-pulse" 
                      : "bg-purple-600 text-white"
                  )}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1 leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={onOpenMobileDrawer}
          className={cn(
            "relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer min-w-[56px] min-h-[44px]",
            isMobileDrawerOpen 
              ? "text-purple-700 font-black scale-105" 
              : "text-slate-500 hover:text-purple-600 font-semibold"
          )}
        >
          {isMobileDrawerOpen && (
            <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-sm shadow-purple-500/50" />
          )}

          <div className={cn(
            "w-7 h-7 flex items-center justify-center rounded-xl transition-all",
            isMobileDrawerOpen 
              ? "bg-purple-100 text-purple-700 shadow-2xs" 
              : "text-slate-500"
          )}>
            <Menu size={18} strokeWidth={isMobileDrawerOpen ? 2.5 : 2} />
          </div>

          <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1 leading-tight">
            Thêm...
          </span>
        </button>
      </div>
    </nav>
  );
}
