import React from 'react';
import { AvailabilityStatus } from '@/types';

interface BadgeProps {
  status?: AvailabilityStatus;
  label?: string;
  variant?: 'status' | 'sale' | 'featured' | 'custom';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  variant = 'status',
  className = '',
}) => {
  if (variant === 'sale') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-brand-gold text-brand-black shadow-sm ${className}`}
      >
        Sale
      </span>
    );
  }

  if (variant === 'featured') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-brand-black text-brand-cream border border-brand-gold/30 ${className}`}
      >
        Featured
      </span>
    );
  }

  if (status) {
    switch (status) {
      case 'in_stock':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200/60 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            In Stock
          </span>
        );
      case 'low_stock':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-amber-50 text-amber-800 border border-amber-200/60 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Low Stock
          </span>
        );
      case 'out_of_stock':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-neutral-100 text-neutral-600 border border-neutral-200 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Out of Stock
          </span>
        );
      case 'pre_order':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-sky-50 text-sky-800 border border-sky-200/60 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Pre-Order
          </span>
        );
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-neutral-100 text-neutral-800 ${className}`}
    >
      {label}
    </span>
  );
};
