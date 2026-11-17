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
        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase bg-black text-white ${className}`}
      >
        Sale
      </span>
    );
  }

  if (variant === 'featured') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase bg-white text-black border border-[#EAEAEA] ${className}`}
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
            className={`inline-flex items-center gap-1.5 text-[10px] text-[#555555] font-normal tracking-wide ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            In Stock
          </span>
        );
      case 'low_stock':
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] text-black font-medium tracking-wide ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#777777]"></span>
            Low Stock
          </span>
        );
      case 'out_of_stock':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase bg-[#F5F5F3] text-[#777777] ${className}`}
          >
            Sold Out
          </span>
        );
      case 'pre_order':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase border border-[#EAEAEA] text-[#111111] ${className}`}
          >
            Pre-Order
          </span>
        );
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide bg-[#F5F5F3] text-[#111111] ${className}`}
    >
      {label}
    </span>
  );
};
