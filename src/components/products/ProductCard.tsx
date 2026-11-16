import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
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
      toast.error('This product is currently out of stock.');
      return;
    }

    const defaultSize = product.sizes?.[0] || 'Standard';
    const defaultVariant = product.variants?.[0]?.options?.[0];

    addItem(product, 1, defaultSize, defaultVariant);
    setJustAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-md overflow-hidden border border-neutral-200/70 hover:border-neutral-300 shadow-sm hover:shadow-luxury transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full pt-[100%] overflow-hidden bg-brand-cream"
      >
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {hasDiscount && <Badge variant="sale" />}
          {product.is_featured && !hasDiscount && <Badge variant="featured" />}
          {product.availability_status !== 'in_stock' && (
            <Badge status={product.availability_status} />
          )}
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 bg-white/90 hover:bg-white text-brand-black rounded-full shadow-md transition-transform hover:scale-110"
              title="Quick view"
              aria-label="Quick view product"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="p-2.5 bg-brand-black hover:bg-neutral-800 text-brand-cream rounded-full shadow-md transition-transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
            title="Add to cart"
            aria-label="Add product to cart"
          >
            {justAdded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category Tag */}
          {product.category && (
            <p className="text-[10px] uppercase font-heading tracking-widest text-neutral-400 mb-1">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-heading font-semibold text-brand-black hover:text-brand-gold transition-colors line-clamp-2 leading-tight"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-heading font-bold text-brand-black">
              {settings.currency_symbol}{effectivePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {settings.currency_symbol}{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="text-[11px] font-heading font-medium tracking-wider uppercase text-neutral-700 hover:text-brand-black hover:underline disabled:text-neutral-300 disabled:no-underline"
          >
            {isOutOfStock ? 'Sold Out' : justAdded ? 'Added!' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
