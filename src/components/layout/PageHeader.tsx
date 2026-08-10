import React from 'react';
import { ChevronLeft, X } from 'lucide-react';

export interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * Universal PageHeader Component
 * Single reusable header component for pages, sub-views, and bottom sheets.
 * Features 44px height header row, 44px round action buttons, and centered title/subtitle.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  className = '',
}) => {
  return (
    <div className={`relative flex h-[44px] items-center justify-between select-none ${className}`}>
      {/* Left Action Button (Back Chevron) */}
      {onBack ? (
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

      {/* Center Title / Subtitle */}
      {title && (
        <div className="absolute inset-x-12 flex flex-col items-center justify-center pointer-events-none">
          {typeof title === 'string' ? (
            <h1 className="font-display text-lg font-bold text-white tracking-tight text-center truncate">
              {title}
            </h1>
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

      {/* Right Action Button (Close X) */}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
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
