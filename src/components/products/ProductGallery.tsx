import React, { useState } from 'react';
import { ProductImage } from '@/types';
import { Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const displayImages = images && images.length > 0 ? images : [
    {
      id: 'default',
      product_id: '',
      image_url: '/images/brand/logo-dark.png',
      display_order: 0,
      is_primary: true,
      alt_text: productName,
    },
  ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[540px] shrink-0 scrollbar-none py-0.5">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-[1px] border overflow-hidden bg-[#F5F5F3] shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-[#111111] opacity-100'
                  : 'border-[#EAEAEA] opacity-60 hover:opacity-100 hover:border-[#111111]/40'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Primary Prominent Image */}
      <div className="relative flex-1 bg-[#F5F5F3] rounded-[1px] overflow-hidden border border-[#EAEAEA] group">
        <div className="w-full pt-[100%] relative">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || productName}
            className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />
        </div>

        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white text-[#111111] border border-[#EAEAEA] rounded-[1px] transition-all opacity-80 hover:opacity-100"
          title="Zoom image"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              className="max-w-full max-h-[85vh] object-contain rounded-[1px]"
            />
            <p className="text-center text-white/60 text-xs mt-4 tracking-wider uppercase">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};
