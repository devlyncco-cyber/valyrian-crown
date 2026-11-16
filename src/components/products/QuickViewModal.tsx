import React, { useState } from 'react';
import { Product } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { settings } = useStoreSettings();

  if (!product) return null;

  const effectivePrice =
    product.sale_price !== null && product.sale_price !== undefined
      ? Number(product.sale_price)
      : Number(product.price);

  const hasDiscount =
    product.sale_price !== null &&
    product.sale_price !== undefined &&
    Number(product.sale_price) < Number(product.price);

  const isOutOfStock = product.availability_status === 'out_of_stock';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const size = selectedSize || product.sizes?.[0] || 'Standard';
    const variant = selectedVariant || product.variants?.[0]?.options?.[0];

    addItem(product, quantity, size, variant);
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/images/brand/logo-dark.png';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Product Image */}
        <div className="relative bg-brand-cream rounded-md overflow-hidden aspect-square border border-neutral-200">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge variant="sale" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            {product.category && (
              <span className="text-[10px] uppercase font-heading tracking-widest text-neutral-400">
                {product.category.name}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-heading font-bold text-brand-black leading-snug">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-heading font-bold text-brand-black">
                {settings.currency_symbol}{effectivePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through">
                  {settings.currency_symbol}{Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-[11px] font-heading font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${
                      (selectedSize || product.sizes?.[0]) === s
                        ? 'border-brand-black bg-brand-black text-white font-medium'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3 bg-brand-black hover:bg-neutral-800 text-brand-cream rounded font-heading font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
            </button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-heading font-medium tracking-wider uppercase text-neutral-600 hover:text-brand-black flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
