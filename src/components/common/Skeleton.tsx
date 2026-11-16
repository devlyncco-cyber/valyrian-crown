import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 rounded ${className}`}
      aria-hidden="true"
    />
  );
};
