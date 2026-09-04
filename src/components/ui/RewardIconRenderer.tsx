import React from 'react';
import { cn } from '../../utils/helpers';

interface RewardIconRendererProps {
  icon?: string;
  name?: string;
  className?: string;
  imgClassName?: string;
  fallbackEmoji?: string;
}

export function isImageIcon(icon?: string): boolean {
  if (!icon) return false;
  return (
    icon.startsWith('data:image') ||
    icon.startsWith('http://') ||
    icon.startsWith('https://') ||
    icon.startsWith('blob:') ||
    icon.startsWith('/')
  );
}

export function RewardIconRenderer({
  icon,
  name,
  className = '',
  imgClassName = '',
  fallbackEmoji = '🎁',
}: RewardIconRendererProps) {
  if (!icon) {
    return <span className={cn("inline-block select-none", className)}>{fallbackEmoji}</span>;
  }

  if (isImageIcon(icon)) {
    return (
      <div className={cn("inline-flex items-center justify-center overflow-hidden", className)}>
        <img
          src={icon}
          alt={name || 'Biểu tượng phần thưởng'}
          className={cn("w-full h-full object-contain pointer-events-none drop-shadow-xs", imgClassName)}
          loading="lazy"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            (e.currentTarget.style.display = 'none');
          }}
        />
      </div>
    );
  }

  // Text / Emoji
  return (
    <span className={cn("inline-block select-none leading-none", className)}>
      {icon}
    </span>
  );
}
