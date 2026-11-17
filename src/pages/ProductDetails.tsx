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
          <Skeleton className="w-full aspect-square rounded-[1px]" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4 rounded-[1px]" />
            <Skeleton className="h-8 w-3/4 rounded-[1px]" />
            <Skeleton className="h-6 w-1/3 rounded-[1px]" />
            <Skeleton className="h-24 w-full rounded-[1px]" />
            <Skeleton className="h-12 w-full rounded-[1px]" />
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
    toast.success(`${product.name} added to your bag`);
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
    toast.success('Product link copied');
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
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
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
          <div className="border-b border-[#EAEAEA] pb-5 space-y-2">
            <div className="flex items-center justify-between">
              {product.category ? (
                <Link
                  to={`/shop?category=${product.category.id}`}
                  className="text-[11px] uppercase tracking-widest text-[#777777] hover:text-[#111111] font-medium"
                >
                  {product.category.name}
                </Link>
              ) : (
                <span className="text-[11px] uppercase tracking-widest text-[#777777]">
                  ValyrianCrown Original
                </span>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 text-[#777777] hover:text-[#111111] transition-colors rounded-[1px] hover:bg-[#F5F5F3]"
                title="Share product"
                aria-label="Share product"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#111111]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-medium uppercase tracking-tight text-[#111111]">
              {product.name}
            </h1>

            {/* Price & Availability */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-mono text-[#111111]">
                  {settings.currency_symbol}{effectivePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-mono text-[#777777] line-through">
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
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#111111] font-medium">
                Fit & Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-xs tracking-wider uppercase rounded-[1px] border transition-colors ${
                      selectedSize === size
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-[#EAEAEA] text-[#111111] hover:border-[#111111] bg-white'
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
              <label className="block text-[11px] uppercase tracking-widest text-[#111111] font-medium">
                Color Edition
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-3.5 py-1.5 text-xs tracking-wider rounded-[1px] border transition-colors ${
                      selectedVariant === opt
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-[#EAEAEA] text-[#111111] hover:border-[#111111] bg-white'
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
            <label className="block text-[11px] uppercase tracking-widest text-[#111111] font-medium">
              Quantity
            </label>
            <div className="inline-flex items-center border border-[#EAEAEA] rounded-[1px] bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-[#777777] hover:text-[#111111] text-sm transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-xs text-[#111111] select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-[#777777] hover:text-[#111111] text-sm transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Call-to-action buttons */}
          <div className="pt-2 space-y-2.5">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
            </button>

            {/* Direct WhatsApp Order with Details */}
            <button
              onClick={handleDirectWhatsAppOrder}
              disabled={isOutOfStock}
              className="w-full py-3.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-[1px] text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

          {/* Guarantees / Service Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EAEAEA] text-center">
            <div className="py-3 px-2 border border-[#EAEAEA] rounded-[1px] bg-white">
              <Truck className="w-4 h-4 mx-auto text-[#111111] mb-1.5" />
              <p className="text-[10px] uppercase font-medium tracking-wider text-[#111111] leading-tight">Delivery</p>
              <p className="text-[9px] text-[#777777] mt-0.5">Across Ghana</p>
            </div>
            <div className="py-3 px-2 border border-[#EAEAEA] rounded-[1px] bg-white">
              <ShieldCheck className="w-4 h-4 mx-auto text-[#111111] mb-1.5" />
              <p className="text-[10px] uppercase font-medium tracking-wider text-[#111111] leading-tight">Authentic</p>
              <p className="text-[9px] text-[#777777] mt-0.5">Original Craft</p>
            </div>
            <div className="py-3 px-2 border border-[#EAEAEA] rounded-[1px] bg-white">
              <RotateCcw className="w-4 h-4 mx-auto text-[#111111] mb-1.5" />
              <p className="text-[10px] uppercase font-medium tracking-wider text-[#111111] leading-tight">Direct Care</p>
              <p className="text-[9px] text-[#777777] mt-0.5">Via WhatsApp</p>
            </div>
          </div>

          {/* Full Description & Specs */}
          {product.description && (
            <div className="pt-6 border-t border-[#EAEAEA] space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-medium text-[#111111]">
                Product Details
              </h3>
              <div className="text-xs text-[#777777] leading-relaxed whitespace-pre-line">
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
        <section className="pt-16 border-t border-[#EAEAEA] space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-heading font-medium uppercase tracking-tight text-[#111111]">
              You May Also Like
            </h2>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#111111] transition-colors"
            >
              View All Caps &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-12">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
