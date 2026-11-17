import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/common/Skeleton';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onQuickView,
  emptyMessage = 'No caps found matching your selection.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="w-full aspect-square bg-[#F5F5F3] rounded-[1px]" />
            <Skeleton className="h-3 w-1/2 bg-[#F0F0ED] rounded-[1px]" />
            <Skeleton className="h-3 w-1/4 bg-[#F0F0ED] rounded-[1px]" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center border border-[#EAEAEA] p-8 bg-white">
        <PackageOpen className="w-8 h-8 text-[#999999] mb-3 stroke-[1.2]" />
        <h3 className="text-xs font-heading font-medium text-[#111111] uppercase tracking-[0.15em] mb-1">
          No Products Found
        </h3>
        <p className="text-xs text-[#777777] max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-12">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
