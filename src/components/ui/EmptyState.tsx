import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-4 px-3 text-center rounded-[20px] bg-[#1C1C1E]/50 border border-dashed border-[#2C2C2E] ${className}`}>
      {Icon && <Icon className="h-5 w-5 text-[#8E8E93] mb-1.5" />}
      <span className="font-sans text-sm font-normal text-[#8E8E93]">
        {message}
      </span>
    </div>
  );
};
