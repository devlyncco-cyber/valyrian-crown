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
    'relative inline-flex items-center justify-center font-heading font-medium tracking-wider uppercase transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5',
    md: 'text-xs md:text-sm px-5 py-2.5 rounded-sm gap-2',
    lg: 'text-sm md:text-base px-7 py-3.5 rounded-sm gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-brand-black text-brand-cream hover:bg-neutral-800 shadow-sm hover:shadow border border-brand-black',
    secondary:
      'bg-white text-brand-black hover:bg-neutral-50 border border-neutral-200 shadow-sm',
    gold:
      'bg-brand-gold text-brand-black hover:bg-brand-gold-light shadow-luxury font-semibold',
    outline:
      'bg-transparent text-brand-black border border-brand-black hover:bg-brand-black hover:text-white',
    ghost:
      'bg-transparent text-brand-black hover:bg-neutral-100',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm',
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
