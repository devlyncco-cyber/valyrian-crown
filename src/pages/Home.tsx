import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
      description: 'Headwear crafted to elevate your presence with quiet authority in every room.',
    },
    {
      title: 'Individuality',
      description: 'Curated fits, distinct silhouettes, and signature embroidery that define your personal style.',
    },
    {
      title: 'Style',
      description: 'Contemporary streetwear aesthetics refined with timeless luxury nuances.',
    },
    {
      title: 'Comfort',
      description: 'Breathable structured cotton twill and tailored straps engineered for all-day wear.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-36 pb-20">
      {/* 1. MINIMALIST EDITORIAL HERO SECTION */}
      <section className="border-b border-[#EAEAEA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-heading font-medium">
                Ghana's Premier Fashion Headwear
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-semibold text-[#111111] tracking-tight leading-[1.08]">
                {settings.hero_heading}
              </h1>

              <p className="text-sm sm:text-base text-[#777777] max-w-lg leading-relaxed font-normal">
                {settings.hero_description}
              </p>

              <div className="pt-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#111111] hover:bg-[#262626] text-white text-xs font-heading font-medium tracking-[0.2em] uppercase rounded-[1px] transition-colors"
                >
                  <span>Explore Collection</span>
                </Link>
              </div>
            </div>

            {/* Hero Right Visuals: Minimalist Editorial Showcase */}
            <div className="lg:col-span-6">
              <div className="aspect-[4/5] sm:aspect-square w-full bg-[#F5F5F3] overflow-hidden flex items-center justify-center">
                <img
                  src="/images/products/cap-1.jpg"
                  alt="ValyrianCrown Signature Editorial Cap"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      {settings.featured_collection_visible && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-[#EAEAEA]">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-heading font-semibold text-[#111111]">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/shop?sort=featured"
              className="text-xs uppercase tracking-[0.15em] font-heading text-[#777777] hover:text-[#111111] transition-colors"
            >
              View All
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts}
            isLoading={isLoading}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </section>
      )}

      {/* 3. BRAND INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
              <img
                src="/images/products/cap-7.jpg"
                alt="ValyrianCrown Campaign Editorial"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-heading font-medium">
              The Philosophy
            </p>

            <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-[#111111] tracking-tight leading-tight">
              More Than Just a Cap.
            </h2>

            <div className="text-sm sm:text-base text-[#777777] leading-relaxed space-y-4 font-normal">
              <p>{settings.brand_description}</p>
              <p>
                Whether customers are keeping it casual or making a statement, ValyrianCrown gives them a reason to wear their confidence.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-heading font-medium text-[#111111] hover:text-[#777777] transition-colors pb-1 border-b border-[#111111]"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-[#EAEAEA]">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-heading font-semibold text-[#111111]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.15em] font-heading text-[#777777] hover:text-[#111111] transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>

        <ProductGrid
          products={newArrivals}
          isLoading={isLoading}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </section>

      {/* 5. BRAND VALUES */}
      <section className="border-y border-[#EAEAEA] bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {brandValues.map((val) => (
              <div key={val.title} className="space-y-2">
                <h3 className="text-xs font-heading font-semibold uppercase tracking-[0.2em] text-[#111111]">
                  {val.title}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOCIAL MEDIA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h2 className="text-xs uppercase tracking-[0.25em] font-heading font-semibold text-[#111111]">
            Follow The Crown
          </h2>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#777777] hover:text-[#111111] transition-colors tracking-wide mt-1 inline-block"
          >
            Instagram: {settings.instagram_handle}
          </a>
        </div>

        {/* Minimalist 4-photo lookbook grid */}
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
              className="aspect-square bg-[#F5F5F3] overflow-hidden block group"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            </a>
          ))}
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
