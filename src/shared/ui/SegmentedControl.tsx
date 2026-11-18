import React from 'react';

export interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export const SegmentedControl = <T extends string | number>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) => {
  return (
    <div className={`flex gap-1.5 justify-between w-full ${className}`}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-w-0 h-[48px] px-2 flex items-center justify-center gap-1.5 rounded-full text-[13px] sm:text-sm font-semibold transition-all ${
              isSelected
                ? 'border border-primary text-white bg-card/90'
                : 'bg-card text-muted-foreground hover:text-white border border-transparent'
            }`}
          >
            {opt.icon &&
              React.cloneElement(opt.icon as React.ReactElement<any>, {
                className: 'h-4 w-4 shrink-0',
              })}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
