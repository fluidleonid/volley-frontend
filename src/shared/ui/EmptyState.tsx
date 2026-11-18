import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'section' | 'page';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon: Icon,
  variant = 'section',
  className = '',
}) => {
  if (variant === 'page') {
    return (
      <div className={`flex flex-col items-center justify-center pt-8 pb-4 text-center w-full ${className}`}>
        {Icon && (
          <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-4 shrink-0">
            <Icon className="w-6 h-6 text-primary stroke-[2]" />
          </div>
        )}
        <h3 className="text-lg font-bold text-white">{message}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground max-w-[260px]">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-4 px-3 text-center rounded-[20px] bg-card/50 border border-dashed border-border ${className}`}>
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mb-1.5" />}
      <span className="font-sans text-sm font-normal text-muted-foreground">
        {message}
      </span>
    </div>
  );
};
