import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  fullWidth = true,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'flex items-center justify-center rounded-full font-sans font-bold tracking-tight transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    default: 'h-[44px] text-[16px] px-6',
    sm: 'h-8 text-xs px-3',
    lg: 'h-12 text-base px-8',
    icon: 'h-9 w-9 p-0',
    'icon-sm': 'h-7 w-7 p-0',
  };

  const variants = {
    primary: 'bg-[#68BD44] text-[#050505] hover:bg-[#5AA739]',
    secondary: 'bg-[#1C1C1E] text-white hover:bg-[#242426]',
    outline: 'border border-[#68BD44] bg-transparent text-[#68BD44] hover:bg-[#68BD44]/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  return (
    <button
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${fullWidth && !size.includes('icon') ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
