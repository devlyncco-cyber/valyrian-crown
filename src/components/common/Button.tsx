import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading text-xs tracking-widest uppercase transition-colors duration-200 select-none disabled:opacity-40 disabled:pointer-events-none rounded-[1px] font-medium';

  const sizeStyles = {
    sm: 'py-2 px-4 gap-1.5',
    md: 'py-3 px-6 gap-2',
    lg: 'py-4 px-8 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#111111] text-white hover:bg-[#262626] border border-[#111111]',
    secondary:
      'bg-white text-[#111111] hover:bg-[#F5F5F3] border border-[#EAEAEA]',
    gold:
      'bg-[#111111] text-white hover:bg-[#262626] border border-[#111111]',
    outline:
      'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white',
    ghost:
      'bg-transparent text-[#111111] hover:bg-[#F5F5F3]',
    danger:
      'bg-[#111111] text-white hover:bg-red-700 border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
