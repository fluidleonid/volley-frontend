import React, { useState, useEffect } from 'react';
import { getInitialsFromName } from '../lib/formatName';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
  hasBorder?: boolean;
  onClick?: (e: React.MouseEvent) => void;
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
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const resolvedInitials = (() => {
    if (initials && initials.trim().length >= 2) {
      return initials.trim().slice(0, 2).toUpperCase();
    }
    if (alt && alt !== 'Avatar' && alt !== 'Player Avatar') {
      const fromAlt = getInitialsFromName(alt);
      if (fromAlt && fromAlt !== '?') return fromAlt;
    }
    if (initials && initials.trim().length > 0) {
      return getInitialsFromName(initials);
    }
    return '?';
  })();

  return (
    <div
      onClick={onClick}
      className={`overflow-hidden rounded-full ${hasBorder ? 'border border-white/20' : 'border-0'} bg-brand-surfaceElevated flex items-center justify-center shrink-0 ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all' : ''} ${className}`}
      style={style}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display font-bold text-primary uppercase leading-none">
          {resolvedInitials}
        </span>
      )}
    </div>
  );
};
