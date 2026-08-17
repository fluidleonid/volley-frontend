import React from 'react';

interface ListGroupHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export const ListGroupHeader: React.FC<ListGroupHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  className = '',
}) => {
  return (
    <div className={`flex flex-col mb-2 mt-4 first:mt-0 ${className}`}>
      <h3 className="text-[14px] text-white font-bold">{title}</h3>
      {(subtitle || rightContent) && (
        <div className="text-[12px] text-muted-foreground flex gap-2">
          {subtitle && <span>{subtitle}</span>}
          {rightContent}
        </div>
      )}
    </div>
  );
};
