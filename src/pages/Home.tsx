import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Crown,
  HeartHandshake,
  Instagram,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/products/productService';
import { ProductGrid } from '@/components/products/ProductGrid';
import { QuickViewModal } from '@/components/products/QuickViewModal';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const Home: React.FC = () => {
  const { settings } = useStoreSettings();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const [featured, newest] = await Promise.all([
          productService.getProducts({ featuredOnly: true }),
          productService.getProducts({ sort: 'newest' }),
        ]);
        setFeaturedProducts(featured.slice(0, 4));
        setNewArrivals(newest.slice(0, 8));
      } catch (err) {
        console.error('Error loading homepage products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const brandValues = [
    {
      title: 'Confidence',
      description: 'Headwear crafted to elevate your presence in any room you step into.',
      icon: Crown,
    },
    {
      title: 'Individuality',
      description: 'Unique designs, custom embroideries, and curated fits that express who you are.',
      icon: Sparkles,
    },
    {
      title: 'Style',
      description: 'Contemporary streetwear aesthetics refined with timeless luxury nuances.',
      icon: ShieldCheck,
    },
    {
      title: 'Comfort',
      description: 'Premium breathable cotton and custom tailored straps designed for everyday wear.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-brand-black text-brand-cream overflow-hidden">
        {/* Subtle texture / glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/40 via-brand-black to-brand-black pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-brand-gold/30 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase animate-fade-in">
                <Crown className="w-3.5 h-3.5" />
                <span>Ghana's Premier Fashion Headwear</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight uppercase leading-[1.1]">
                {settings.hero_heading}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {settings.hero_description}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-cream text-brand-black hover:bg-white text-xs font-heading font-bold tracking-widest uppercase rounded shadow-luxury hover:shadow-luxury-hover transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto px-7 py-4 bg-transparent border border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 text-xs font-heading font-medium tracking-widest uppercase rounded transition-colors flex items-center justify-center"
                >
                  Discover Our Story
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="pt-8 border-t border-neutral-800/80 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-neutral-400 font-heading">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>100% Authentic Originals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>Instant WhatsApp Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>Doorstep Delivery Across Ghana</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visuals (Product Editorial Showcase) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="relative z-10 bg-brand-charcoal rounded-xl p-3 border border-neutral-800 shadow-2xl overflow-hidden group">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-brand-cream relative">
                    <img
                      src="/images/products/cap-1.jpg"
                      alt="ValyrianCrown Hero Cap"
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-brand-black/80 backdrop-blur-sm text-brand-gold px-3 py-1 rounded text-xs font-heading font-bold uppercase tracking-wider border border-brand-gold/20">
                      GH₵45.00
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-heading tracking-widest text-brand-gold">
                        Signature Drop
                      </p>
                      <h3 className="text-sm font-heading font-bold text-white">
                        YOU Smiley Dad Cap
                      </h3>
                    </div>
                    <Link
                      to="/shop"
                      className="p-2 bg-brand-gold text-brand-black rounded hover:bg-brand-gold-light transition-colors"
                      aria-label="View Cap"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Floating Secondary Cap Card */}
                <div className="hidden sm:block absolute sm:bottom-2 sm:left-2 lg:-bottom-6 lg:-left-6 z-20 bg-neutral-900/95 backdrop-blur-md rounded-lg p-3 border border-neutral-700/60 shadow-xl w-48">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/products/cap-2.jpg"
                      alt="Studio 10 Cap"
                      className="w-12 h-12 rounded object-contain bg-brand-cream border border-neutral-800"
                    />
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wider text-neutral-400 font-heading">
                        Best Seller
                      </p>
                      <p className="text-xs font-bold font-heading text-white truncate">
                        Studio 10 Cap
                      </p>
                      <p className="text-[11px] font-semibold text-brand-gold">GH₵45.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION */}
      {settings.featured_collection_visible && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-neutral-200/80 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold mb-1">
                Handpicked Drops
              </p>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-black uppercase tracking-tight">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/shop?sort=featured"
              className="mt-4 sm:mt-0 text-xs font-heading font-bold uppercase tracking-wider text-brand-black hover:text-brand-gold flex items-center gap-1.5 transition-colors group"
            >
              <span>Explore All Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts}
            isLoading={isLoading}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </section>
      )}

      {/* 3. BRAND INTRODUCTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-brand-charcoal text-brand-cream overflow-hidden border border-neutral-800 shadow-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-heading uppercase tracking-widest text-brand-gold font-semibold">
                The Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight text-white leading-tight">
                More Than Just a Cap.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                {settings.brand_description}
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cream text-brand-black hover:bg-white text-xs font-heading font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-xl overflow-hidden bg-brand-cream border border-neutral-700 shadow-lg p-6 flex items-center justify-center">
                <img
                  src="/images/products/cap-7.jpg"
                  alt="Vintage Pinstripe Varsity Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-brand-black/90 backdrop-blur-sm p-2 rounded text-center text-xs font-heading text-neutral-200">
                  Vintage Pinstripe Varsity Cap
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-neutral-200/80 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold mb-1">
              Fresh From The Crown
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-black uppercase tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-xs font-heading font-bold uppercase tracking-wider text-brand-black hover:text-brand-gold flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Caps</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid
          products={newArrivals}
          isLoading={isLoading}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </section>

      {/* 5. BRAND VALUES */}
      <section className="bg-white py-16 sm:py-24 border-y border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold mb-1">
              What Defines Us
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-black uppercase tracking-tight">
              The Valyrian Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-6 rounded-lg bg-brand-cream border border-neutral-200/60 hover:border-brand-gold/40 hover:shadow-luxury transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-black text-brand-gold flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-heading font-bold text-brand-black uppercase tracking-wider mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SOCIAL MEDIA / INSTAGRAM COMMUNITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold mb-2">
            <Instagram className="w-4 h-4" />
            <span>Join The Community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-black uppercase tracking-tight">
            Follow @valyriancrown._
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Tag us in your fits to be featured on our official channel.
          </p>
        </div>

        {/* Community Lookbook Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { img: '/images/products/cap-14.jpg', name: 'NYC Gold Edition' },
            { img: '/images/products/cap-4.jpg', name: 'Olive Twill' },
            { img: '/images/products/cap-10.jpg', name: 'Retro Script' },
            { img: '/images/products/cap-17.jpg', name: 'Ivory Corduroy' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-brand-cream border border-neutral-200/80 block"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white">
                <Instagram className="w-6 h-6 mb-2 text-brand-gold" />
                <span className="text-xs font-heading font-semibold uppercase tracking-wider">
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-300 mt-1">@valyriancrown._</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-heading font-medium tracking-wider uppercase transition-colors"
          >
            <Instagram className="w-4 h-4 text-brand-gold" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
