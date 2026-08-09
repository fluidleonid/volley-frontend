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
      className={`w-full flex items-center justify-between p-3.5 rounded-[16px] bg-[#1C1C1E] hover:bg-[#242426] transition-colors group text-left border-0 ${className}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-white shrink-0" />
        <span className="font-display text-base font-semibold text-white tracking-tight">
          {label}
        </span>
      </div>

      {showChevron && (
        <ChevronRight className="h-5 w-5 text-[#8E8E93] group-hover:text-white transition-colors shrink-0" />
      )}
    </button>
  );
};
