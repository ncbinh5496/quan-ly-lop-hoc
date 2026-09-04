import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon | string;
  gradientClass: string;
  iconBg: string;
  iconColor: string;
  badgeText?: string;
  onClick: () => void;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  gradientClass,
  iconBg,
  iconColor,
  badgeText,
  onClick
}: QuickActionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden bg-white rounded-[22px] p-4 sm:p-5 cursor-pointer transition-all duration-300",
        "border border-slate-200/80 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.05),0_4px_8px_-2px_rgba(0,0,0,0.03)]",
        "hover:-translate-y-1.5 hover:shadow-[0_16px_30px_-6px_rgba(124,58,237,0.12),0_6px_12px_-3px_rgba(0,0,0,0.06)] hover:border-purple-200",
        "ring-1 ring-slate-900/[0.02]"
      )}
    >
      {/* 3D Top Light Edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

      <div className="flex items-center gap-3.5 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconBg,
          iconColor
        )}>
          {typeof Icon === 'string' ? (
            <span>{Icon}</span>
          ) : (
            <Icon size={24} strokeWidth={2.3} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-black text-slate-800 tracking-tight group-hover:text-purple-700 transition-colors">
              {title}
            </h4>
            {badgeText && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
            {description}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0">
          <ArrowRight size={15} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
