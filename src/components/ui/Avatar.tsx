import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-20 w-20 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className = '',
  style,
}) => {
  return (
    <div
      className={`overflow-hidden rounded-full border border-white/20 bg-[#242426] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
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
