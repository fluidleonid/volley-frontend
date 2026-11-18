import React from 'react';

interface StatCardProps {
  value: React.ReactNode;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="rounded-[20px] bg-card p-3.5 flex flex-col justify-between min-h-[88px] h-auto gap-1.5 min-w-0">
    <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none truncate">
      {value}
    </span>
    <span className="font-sans text-xs text-muted-foreground font-medium leading-snug break-words">
      {label}
    </span>
  </div>
);
