import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Shield, HeartHandshake, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const About: React.FC = () => {
  const { settings } = useStoreSettings();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-brand-black text-brand-cream py-20 sm:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-brand-gold/30 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase">
            <Crown className="w-3.5 h-3.5" />
            <span>Our Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-tight text-white leading-tight">
            More Than Just A Cap.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Wear the Crown. Own Your Style. ValyrianCrown represents confidence, presence, and personal expression.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Visual Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-brand-charcoal border border-neutral-200 aspect-[4/5] p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-1.jpg"
                  alt="ValyrianCrown YOU Smiley Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-white border border-neutral-200 aspect-square p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-14.jpg"
                  alt="ValyrianCrown NYC Gold Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-lg overflow-hidden bg-white border border-neutral-200 aspect-square p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-4.jpg"
                  alt="ValyrianCrown Olive Twill Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-brand-charcoal border border-neutral-200 aspect-[4/5] p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-20.jpg"
                  alt="ValyrianCrown Mineral Washed Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Core Brand Description */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-heading tracking-widest text-brand-gold font-semibold">
              The Valyrian Vision
            </span>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-brand-black leading-tight">
              Wear the Crown. Own Your Style.
            </h2>

            <div className="text-neutral-700 space-y-4 text-sm sm:text-base leading-relaxed font-light">
              <p className="font-normal text-brand-black">
                ValyrianCrown is more than a headwear brand; it's a statement of identity, confidence, and personal style.
              </p>
              <p>
                We bring together style, comfort, and individuality through carefully selected caps designed to complement your everyday look. Whether you're keeping it casual or making a statement, ValyrianCrown gives you a reason to wear your confidence.
              </p>
              <p>
                From timeless collegiate script and vintage mineral-washed textures to sharp minimalist studio silhouettes, every piece in our collection is curated with meticulous attention to detail, silhouette balance, and premium tactile comfort.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200/80">
              <p className="font-serif italic text-lg sm:text-xl text-brand-black">
                "Wear Power. Confidence starts at the crown."
              </p>
              <p className="text-xs uppercase font-heading tracking-widest text-brand-gold mt-2 font-semibold">
                — ValyrianCrown Team
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-black text-brand-cream hover:bg-neutral-800 text-xs font-heading font-bold uppercase tracking-wider rounded transition-colors shadow-luxury"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="bg-white py-16 sm:py-20 border-y border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-heading tracking-widest text-brand-gold font-semibold">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-brand-black mt-1">
              Crafted For Individuality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-brand-cream border border-neutral-200/60 space-y-3">
              <Sparkles className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-heading font-bold text-brand-black uppercase tracking-wider">
                Exacting Craftsmanship
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                High-density 3D embroidery, reinforced eyelets, and durable cotton twill designed to preserve form through countless wears.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-brand-cream border border-neutral-200/60 space-y-3">
              <Shield className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-heading font-bold text-brand-black uppercase tracking-wider">
                Authentic Exclusivity
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Limited curated production runs that ensure your headwear remains distinct and personal in any crowd.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-brand-cream border border-neutral-200/60 space-y-3">
              <HeartHandshake className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-heading font-bold text-brand-black uppercase tracking-wider">
                Direct Personal Service
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Direct WhatsApp order finalization and rapid delivery support ensuring an attentive, human customer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Quote Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <Logo variant="dark" />
        <h2 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight text-brand-black">
          "Wear the Crown. Own Your Style."
        </h2>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-black font-heading font-bold text-xs uppercase tracking-wider rounded hover:bg-brand-gold-light transition-colors shadow-sm"
          >
            <span>Shop The Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
