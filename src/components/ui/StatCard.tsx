import React from 'react';

interface StatCardProps {
  value: React.ReactNode;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="rounded-[20px] bg-[#1C1C1E] p-4 flex flex-col justify-between h-[90px]">
    <span className="font-display text-2xl font-extrabold text-white tracking-tight">
      {value}
    </span>
    <span className="font-sans text-xs text-[#8E8E93] font-medium leading-tight">
      {label}
    </span>
  </div>
);
