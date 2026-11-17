import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export const About: React.FC = () => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Header */}
      <section className="pt-14 sm:pt-20 pb-8 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <p className="text-[11px] uppercase tracking-widest text-[#777777]">
          Our Identity
        </p>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-medium uppercase tracking-tight text-[#111111] leading-tight">
          More Than Just A Cap.
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] max-w-xl mx-auto leading-relaxed">
          ValyrianCrown represents confidence, presence, and personal expression. Wear the Crown. Own Your Style.
        </p>
      </section>

      {/* Narrative Section with Editorial Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Visual Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-[1px] overflow-hidden bg-[#F5F5F3] border border-[#EAEAEA] aspect-[4/5] p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-1.jpg"
                  alt="ValyrianCrown Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-[1px] overflow-hidden bg-white border border-[#EAEAEA] aspect-square p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-14.jpg"
                  alt="ValyrianCrown Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-[1px] overflow-hidden bg-white border border-[#EAEAEA] aspect-square p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-4.jpg"
                  alt="ValyrianCrown Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-[1px] overflow-hidden bg-[#F5F5F3] border border-[#EAEAEA] aspect-[4/5] p-4 flex items-center justify-center">
                <img
                  src="/images/products/cap-20.jpg"
                  alt="ValyrianCrown Cap"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Core Brand Description */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-[11px] uppercase tracking-widest text-[#777777]">
              The Valyrian Vision
            </p>

            <h2 className="text-2xl sm:text-3xl font-heading font-medium uppercase tracking-tight text-[#111111] leading-tight">
              Wear the Crown. Own Your Style.
            </h2>

            <div className="text-[#777777] space-y-4 text-xs sm:text-sm leading-relaxed">
              <p className="text-[#111111] font-normal">
                ValyrianCrown is more than a headwear brand; it's a statement of identity, confidence, and personal style.
              </p>
              <p>
                We bring together style, comfort, and individuality through carefully selected caps designed to complement your everyday look. Whether you're keeping it casual or making a statement, ValyrianCrown gives you a reason to wear your confidence.
              </p>
              <p>
                From timeless collegiate script and vintage mineral-washed textures to sharp minimalist studio silhouettes, every piece in our collection is curated with meticulous attention to detail, silhouette balance, and tactile comfort.
              </p>
            </div>

            <div className="pt-4 border-t border-[#EAEAEA]">
              <p className="font-serif italic text-base sm:text-lg text-[#111111]">
                "Wear Power. Confidence starts at the crown."
              </p>
              <p className="text-[11px] uppercase tracking-widest text-[#777777] mt-1.5">
                — ValyrianCrown Studio
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#262626] text-white text-xs font-medium tracking-widest uppercase rounded-[1px] transition-colors"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-[11px] uppercase tracking-widest text-[#777777]">
              Core Principles
            </p>
            <h2 className="text-xl sm:text-2xl font-heading font-medium uppercase tracking-tight text-[#111111] mt-1">
              Crafted For Individuality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] space-y-3">
              <span className="font-mono text-xs text-[#777777]">01</span>
              <h3 className="text-sm font-heading font-medium text-[#111111] uppercase tracking-wider">
                Exacting Craftsmanship
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                High-density 3D embroidery, reinforced eyelets, and durable cotton twill designed to preserve form through countless wears.
              </p>
            </div>

            <div className="p-8 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] space-y-3">
              <span className="font-mono text-xs text-[#777777]">02</span>
              <h3 className="text-sm font-heading font-medium text-[#111111] uppercase tracking-wider">
                Authentic Exclusivity
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                Limited curated production runs that ensure your headwear remains distinct and personal in any crowd.
              </p>
            </div>

            <div className="p-8 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] space-y-3">
              <span className="font-mono text-xs text-[#777777]">03</span>
              <h3 className="text-sm font-heading font-medium text-[#111111] uppercase tracking-wider">
                Direct Personal Service
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                Direct WhatsApp order finalization and rapid delivery support ensuring an attentive, human customer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <Logo variant="dark" />
        <h2 className="text-xl sm:text-3xl font-heading font-medium uppercase tracking-tight text-[#111111]">
          "Wear the Crown. Own Your Style."
        </h2>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#262626] text-white text-xs font-medium uppercase tracking-widest rounded-[1px] transition-colors"
          >
            <span>Shop The Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
