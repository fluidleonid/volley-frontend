import React from 'react';
import { Check } from 'lucide-react';

export interface SelectionListOption<T extends string | number> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectionListProps<T extends string | number> {
  options: SelectionListOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export const SelectionList = <T extends string | number>({
  options,
  value,
  onChange,
  className = ''
}: SelectionListProps<T>) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-center justify-between py-2 px-4 min-h-[52px] rounded-[12px] transition-all duration-200 active:scale-[0.99] text-left ${
              isSelected
                ? 'bg-card border border-primary'
                : 'bg-card border border-transparent hover:bg-card/80'
            }`}
          >
            <div className="flex items-center gap-3">
              {opt.icon && (
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
                  {opt.icon}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base leading-snug">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs font-normal text-muted-foreground mt-0.5 leading-snug">{opt.description}</span>
                )}
              </div>
            </div>
            {isSelected && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black font-bold shadow-md shrink-0 ml-3">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
