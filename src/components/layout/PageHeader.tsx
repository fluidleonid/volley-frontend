import React from 'react';
import { ChevronLeft, X } from 'lucide-react';

export interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3';
  forceClose?: boolean;
  onDragHandle?: (e: React.PointerEvent | React.TouchEvent) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  className = '',
  titleAs: Tag = 'h1',
  forceClose = false,
  onDragHandle,
}) => {
  const showLeft = !!onBack;
  const showRight = !!onClose || forceClose;

  return (
    <div
      className={`relative flex h-[44px] items-center justify-between select-none ${onDragHandle ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      onPointerDown={onDragHandle}
      onTouchStart={onDragHandle}
    >
      {showLeft ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] active:scale-95 cursor-pointer z-10"
          title="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-[44px] h-[44px]" />
      )}

      {title !== undefined && title !== '' && (
        <div className="absolute inset-x-12 flex flex-col items-center justify-center pointer-events-none">
          {typeof title === 'string' ? (
            <Tag className="font-display text-lg font-bold text-white tracking-tight text-center truncate">
              {title}
            </Tag>
          ) : (
            title
          )}
          {subtitle && (
            <p className="font-sans text-xs text-[#8E8E93] font-normal text-center truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {showRight ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] active:scale-95 cursor-pointer z-10"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-[44px] h-[44px]" />
      )}
    </div>
  );
};
