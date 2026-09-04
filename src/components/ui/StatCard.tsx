import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon | string;
  colorScheme: 'purple' | 'pink' | 'orange' | 'emerald' | 'blue';
  trend?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  colorScheme,
  trend,
  onClick
}: StatCardProps) {
  const schemeStyles = {
    purple: {
      border: 'border-slate-200/80 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      textAccent: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border border-purple-100',
      accentGlow: 'from-purple-500 to-indigo-500',
    },
    pink: {
      border: 'border-slate-200/80 hover:border-pink-300',
      iconBg: 'bg-pink-50 text-pink-600 border border-pink-100',
      textAccent: 'text-pink-600',
      badgeBg: 'bg-pink-50 text-pink-700 border border-pink-100',
      accentGlow: 'from-pink-500 to-rose-500',
    },
    orange: {
      border: 'border-slate-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      textAccent: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      accentGlow: 'from-amber-500 to-orange-500',
    },
    emerald: {
      border: 'border-slate-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      textAccent: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      accentGlow: 'from-emerald-500 to-teal-500',
    },
    blue: {
      border: 'border-slate-200/80 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      textAccent: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      accentGlow: 'from-blue-500 to-cyan-500',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden bg-white rounded-[24px] p-5 md:p-6 transition-all duration-300",
        "border shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_6px_10px_-4px_rgba(0,0,0,0.04)]",
        "hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-8px_rgba(124,58,237,0.12),0_8px_16px_-4px_rgba(0,0,0,0.06)]",
        "ring-1 ring-slate-900/[0.03]",
        schemeStyles.border,
        onClick && "cursor-pointer"
      )}
    >
      {/* Subtle top light highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
            {label}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={cn("text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs", schemeStyles.badgeBg)}>
                {trend}
              </span>
            )}
          </div>
          {subValue && (
            <p className="text-xs font-semibold text-slate-500 truncate">
              {subValue}
            </p>
          )}
        </div>

        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          schemeStyles.iconBg
        )}>
          {typeof Icon === 'string' ? (
            <span>{Icon}</span>
          ) : (
            <Icon size={24} strokeWidth={2.3} />
          )}
        </div>
      </div>

      {/* Decorative bottom accent bar */}
      <div className={cn("absolute bottom-0 inset-x-5 h-[3px] rounded-t-full bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity", schemeStyles.accentGlow)} />
    </div>
  );
}
