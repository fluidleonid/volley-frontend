import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface MenuRowItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export const MenuRowItem: React.FC<MenuRowItemProps> = ({
  icon: Icon,
  label,
  onClick,
  showChevron = true,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center justify-between py-3.5 text-left border-0 bg-transparent select-none cursor-pointer ${className}`}
    >
      {/* Full-bleed active background fill extending to BOTH left and right screen edges (-left-4 -right-4) */}
      <span className="absolute inset-y-0 -left-4 -right-4 bg-transparent group-active:bg-card transition-colors duration-150 pointer-events-none" />

      {/* Content aligned with page margins */}
      <div className="relative z-10 flex items-center gap-3">
        <Icon className="h-5 w-5 text-white shrink-0" />
        <span className="font-sans text-base font-semibold text-white tracking-tight">
          {label}
        </span>
      </div>

      {showChevron && (
        <ChevronRight className="relative z-10 h-5 w-5 text-muted-foreground group-active:text-white transition-colors shrink-0" />
      )}
    </button>
  );
};
