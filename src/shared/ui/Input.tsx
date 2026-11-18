import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  hint?: string;
  variant?: 'default' | 'score' | 'search';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon, hint, variant = 'default', ...props }, ref) => {
    let containerClass = 'relative flex items-center transition-colors border border-transparent bg-card ';
    let inputClass = 'w-full bg-transparent text-white focus:outline-none ';
    let iconWrapperClass = 'text-muted-foreground shrink-0 pointer-events-none flex items-center justify-center ';

    if (variant === 'score') {
      containerClass += 'h-[52px] w-[84px] rounded-full focus-within:border-primary/50 ';
      inputClass += 'h-full text-center font-display text-lg font-bold ';
    } else if (variant === 'search') {
      containerClass += 'h-[52px] w-full rounded-full focus-within:border-primary/50 ';
      inputClass += 'h-full text-base pr-5 ';
      iconWrapperClass += 'absolute left-4 inset-y-0 ';
    } else {
      containerClass += 'h-[54px] w-full rounded-full focus-within:border-primary/50 ';
      inputClass += 'h-full font-medium text-base tracking-tight ';

      if (icon) {
        inputClass += 'pl-2.5 pr-5 ';
      } else {
        inputClass += 'px-5 ';
      }

      iconWrapperClass += 'pl-4 ';
    }

    const hasLabel = !!label && variant === 'default';

    if (hasLabel) {
      inputClass += 'pt-5 pb-1 ';
      inputClass += 'placeholder:text-transparent focus:placeholder:text-muted-foreground ';
    } else {
      inputClass += 'placeholder:text-muted-foreground ';
    }

    const resolvedPlaceholder = props.placeholder || (hasLabel ? ' ' : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${variant === 'score' ? className : ''}`}>
        <div className={`${containerClass} ${variant !== 'score' ? className : ''}`}>
          {icon && <div className={iconWrapperClass}>{icon}</div>}

          <div className="relative flex-1 min-w-0 h-full flex flex-col justify-center">
            <input
              ref={ref}
              className={`peer ${inputClass} ${variant === 'search' && icon ? 'pl-11' : ''}`}
              placeholder={resolvedPlaceholder}
              {...props}
            />

            {hasLabel && (
              <label
                className={`absolute ${
                  icon ? 'left-2.5 right-5' : 'left-5 right-5'
                } top-1/2 -translate-y-1/2 text-base text-muted-foreground font-medium pointer-events-none transition-all duration-200 truncate
                peer-focus:top-[7px] peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:leading-none peer-focus:text-muted-foreground/80
                peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:leading-none peer-[:not(:placeholder-shown)]:text-muted-foreground/80
              `}
              >
                {label}
              </label>
            )}
          </div>
        </div>

        {hint && (
          <span className="text-xs text-muted-foreground font-medium px-2">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
