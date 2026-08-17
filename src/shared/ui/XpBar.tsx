import React from 'react';

import { ChevronRight } from 'lucide-react';

interface XpBarProps {
  current: number;
  max: number;
  segments?: number;
  label: string;
  onLabelClick?: () => void;
}

export const XpBar: React.FC<XpBarProps> = ({
  current,
  max,
  segments = 10,
  label,
  onLabelClick,
}) => {
  const filledSegments = Math.round((current / max) * segments);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between font-display">
        <button 
          onClick={onLabelClick} 
          className={`flex items-center gap-1 text-base font-bold text-white ${onLabelClick ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-all' : ''}`}
          disabled={!onLabelClick}
        >
          {label}
          {onLabelClick && <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="text-xs text-muted-foreground">
          <strong className="text-white">{current.toLocaleString()}</strong>/{max.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: segments }).map((_, idx) => (
          <span
            key={idx}
            className={`h-[4px] flex-1 rounded-full transition-colors duration-300 ${
              idx < filledSegments ? 'bg-white' : 'bg-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
