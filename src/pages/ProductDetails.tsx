import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MessageSquare,
  ArrowLeft,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import { productService } from '@/services/products/productService';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/common/Badge';
import { Skeleton } from '@/components/common/Skeleton';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { CustomerCheckoutModal } from '@/components/cart/CustomerCheckoutModal';
import { toast } from 'sonner';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useStoreSettings();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const found = await productService.getProductBySlug(slug);
        if (!found) {
          const byId = await productService.getProductById(slug);
          if (byId) {
            setProduct(byId);
            initSelections(byId);
            loadRelated(byId.category_id, byId.id);
            return;
          }
          toast.error('Product not found');
          navigate('/shop');
          return;
        }

        setProduct(found);
        initSelections(found);
        loadRelated(found.category_id, found.id);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const initSelections = (p: Product) => {
      if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
      if (p.variants && p.variants.length > 0 && p.variants[0].options.length > 0) {
        setSelectedVariant(p.variants[0].options[0]);
      }
    };

    const loadRelated = async (categoryId?: string | null, currentId?: string) => {
      try {
        const related = await productService.getProducts({
          categoryId: categoryId || undefined,
          publishedOnly: true,
        });
        setRelatedProducts(related.filter((p) => p.id !== currentId).slice(0, 4));
      } catch (e) {
        console.error('Error fetching related', e);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

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
    addItem(product, quantity, selectedSize || 'Standard', selectedVariant);
    toast.success(`${product.name} added to your cart!`);
  };

  const handleDirectWhatsAppOrder = () => {
    if (isOutOfStock) {
      toast.error('This item is currently out of stock.');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Product link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const currentCartItems: CartItem[] = [
    {
      id: `${product.id}-${selectedSize}-${selectedVariant}`,
      product,
      quantity,
      selectedSize,
      selectedVariant,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-heading font-medium uppercase tracking-wider text-neutral-500 hover:text-brand-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Caps</span>
        </Link>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div className="border-b border-neutral-200/80 pb-5 space-y-2">
            <div className="flex items-center justify-between">
              {product.category ? (
                <Link
                  to={`/shop?category=${product.category.id}`}
                  className="text-xs uppercase font-heading tracking-widest text-brand-gold font-semibold hover:underline"
                >
                  {product.category.name}
                </Link>
              ) : (
                <span className="text-xs uppercase font-heading tracking-widest text-brand-gold font-semibold">
                  ValyrianCrown Original
                </span>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 text-neutral-400 hover:text-brand-black transition-colors rounded hover:bg-neutral-100"
                title="Share product"
                aria-label="Share product"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-brand-black">
              {product.name}
            </h1>

            {/* Price & Availability */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-heading font-bold text-brand-black">
                  {settings.currency_symbol}{effectivePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-400 line-through">
                    {settings.currency_symbol}{Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hasDiscount && <Badge variant="sale" />}
                <Badge status={product.availability_status} />
              </div>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-heading font-semibold text-neutral-800">
                Fit & Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-heading font-medium tracking-wide uppercase rounded border transition-colors ${
                      selectedSize === size
                        ? 'border-brand-black bg-brand-black text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-heading font-semibold text-neutral-800">
                Color Edition:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 text-xs font-heading font-medium tracking-wide rounded border transition-colors ${
                      selectedVariant === opt
                        ? 'border-brand-black bg-brand-black text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-heading font-semibold text-neutral-800">
              Quantity:
            </label>
            <div className="inline-flex items-center border border-neutral-300 rounded bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-neutral-500 hover:text-brand-black text-sm font-bold"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-2 text-xs font-heading font-bold text-brand-black select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-neutral-500 hover:text-brand-black text-sm font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Call-to-action buttons */}
          <div className="pt-4 space-y-3">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-4 bg-brand-black hover:bg-neutral-800 text-brand-cream rounded font-heading font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
            </button>

            {/* Direct WhatsApp Order with Details */}
            <button
              onClick={handleDirectWhatsAppOrder}
              disabled={isOutOfStock}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-heading font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant Order on WhatsApp</span>
            </button>
          </div>

          {/* Guarantees / Service Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-neutral-200/80 text-center">
            <div className="p-2 sm:p-3 bg-white rounded border border-neutral-200/60">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-brand-gold mb-1" />
              <p className="text-[9px] sm:text-[10px] uppercase font-heading font-bold text-neutral-800 leading-tight">Fast Delivery</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5">Across Ghana</p>
            </div>
            <div className="p-2 sm:p-3 bg-white rounded border border-neutral-200/60">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-brand-gold mb-1" />
              <p className="text-[9px] sm:text-[10px] uppercase font-heading font-bold text-neutral-800 leading-tight">100% Authentic</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5">Original Quality</p>
            </div>
            <div className="p-2 sm:p-3 bg-white rounded border border-neutral-200/60">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-brand-gold mb-1" />
              <p className="text-[9px] sm:text-[10px] uppercase font-heading font-bold text-neutral-800 leading-tight">Personal Support</p>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 mt-0.5">Direct on WhatsApp</p>
            </div>
          </div>

          {/* Full Description & Specs */}
          {product.description && (
            <div className="pt-6 border-t border-neutral-200/80 space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-heading font-bold text-brand-black">
                Product Details
              </h3>
              <div className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line font-light">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Checkout Modal for Direct WhatsApp Order */}
      <CustomerCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={currentCartItems}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-tight text-brand-black">
              You May Also Like
            </h2>
            <Link
              to="/shop"
              className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-gold hover:underline"
            >
              View All Caps
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
