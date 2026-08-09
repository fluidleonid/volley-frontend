import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
  hasBorder?: boolean;
}

const sizeClasses = {
  xs: 'h-[22px] w-[22px] text-[9px]',
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-[44px] w-[44px] text-sm',
  xl: 'h-20 w-20 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className = '',
  style,
  hasBorder = true,
}) => {
  return (
    <div
      className={`overflow-hidden rounded-full ${hasBorder ? 'border border-white/20' : 'border-0'} bg-[#242426] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      style={style}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-display font-bold text-[#68BD44] uppercase">
          {initials || alt[0] || '?'}
        </span>
      )}
    </div>
  );
};
