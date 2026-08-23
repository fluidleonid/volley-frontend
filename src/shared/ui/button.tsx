import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm';
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
    'flex items-center justify-center rounded-full font-sans font-bold tracking-tight transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none [&_svg]:text-current';

  const sizes = {
    default: 'h-[44px] text-[16px] px-6 gap-2 has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2 [&_svg]:size-5 shrink-0',
    sm: 'h-8 text-xs px-3 gap-1.5 has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5 [&_svg]:size-4 shrink-0',
    lg: 'h-12 text-base px-8 gap-2.5 has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5 [&_svg]:size-6 shrink-0',
    xl: 'h-[52px] text-[16px] px-8 gap-2.5 has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5 [&_svg]:size-6 shrink-0',
    icon: 'h-9 w-9 p-0 [&_svg]:size-5 shrink-0',
    'icon-sm': 'h-7 w-7 p-0 [&_svg]:size-4 shrink-0',
  };

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-card text-white hover:bg-brand-surfaceElevated',
    outline: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
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
