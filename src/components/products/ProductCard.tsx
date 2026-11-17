import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Badge } from '@/components/common/Badge';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { settings } = useStoreSettings();

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/images/brand/logo-dark.png';

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images.find((img) => !img.is_primary)?.image_url || product.images[1]?.image_url
      : primaryImage;

  const effectivePrice =
    product.sale_price !== null && product.sale_price !== undefined
      ? Number(product.sale_price)
      : Number(product.price);

  const hasDiscount =
    product.sale_price !== null &&
    product.sale_price !== undefined &&
    Number(product.sale_price) < Number(product.price);

  const isOutOfStock = product.availability_status === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('This cap is currently sold out.');
      return;
    }

    const defaultSize = product.sizes?.[0] || 'Standard';
    const defaultVariant = product.variants?.[0]?.options?.[0];

    addItem(product, 1, defaultSize, defaultVariant);
    setJustAdded(true);
    toast.success(`${product.name} added to bag.`);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full aspect-square overflow-hidden bg-[#F5F5F3]"
      >
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
          loading="lazy"
        />

        {/* Minimal Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {hasDiscount && <Badge variant="sale" />}
          {isOutOfStock && <Badge status="out_of_stock" />}
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col flex-1 justify-between">
        <div>
          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-heading font-medium text-[#111111] hover:text-[#777777] transition-colors truncate"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add Action */}
        <div className="mt-1 flex items-center justify-between text-xs">
          <div className="flex items-baseline gap-1.5 font-heading">
            <span className="text-[#111111] font-medium">
              {settings.currency_symbol}{effectivePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[#777777] line-through text-[11px]">
                {settings.currency_symbol}{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="text-[11px] font-heading uppercase tracking-wider text-[#777777] hover:text-[#111111] transition-colors disabled:text-[#BBBBBB]"
          >
            {isOutOfStock ? 'Sold Out' : justAdded ? 'Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
