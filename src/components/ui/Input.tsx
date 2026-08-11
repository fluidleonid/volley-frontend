import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'score' | 'search';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon, variant = 'default', ...props }, ref) => {
    
    if (variant === 'score') {
      return (
        <input
          ref={ref}
          className={`h-[44px] w-[84px] rounded-full bg-[#1C1C1E] text-center font-display text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#68BD44] transition-all ${className}`}
          {...props}
        />
      );
    }

    if (variant === 'search') {
      return (
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#8E8E93]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-[44px] bg-[#1C1C1E] border border-transparent rounded-full ${icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-[#68BD44]/50 transition-colors ${className}`}
            {...props}
          />
        </div>
      );
    }

    // Default (floating label inside input container)
    return (
      <div className="relative w-full h-[56px] bg-[#1C1C1E] border border-transparent focus-within:border-[#68BD44]/50 rounded-[20px] flex items-center transition-colors">
        {icon && <div className="pl-4 text-[#8E8E93] shrink-0">{icon}</div>}
        <div className="relative flex-1 h-full px-4">
          <input
            ref={ref}
            placeholder={label ? " " : props.placeholder}
            className={`peer w-full h-full bg-transparent text-white font-medium text-base tracking-tight focus:outline-none ${label ? 'pt-5 pb-1' : ''} ${className}`}
            {...props}
          />
          {label && (
            <label className="absolute left-4 top-[10px] -translate-y-0 text-[11px] text-[#8E8E93] font-medium transition-all duration-200 pointer-events-none
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
              peer-focus:top-[10px] peer-focus:-translate-y-0 peer-focus:text-[11px]"
            >
              {label}
            </label>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
