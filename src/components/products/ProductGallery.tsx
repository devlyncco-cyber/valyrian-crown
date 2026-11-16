import React, { useState } from 'react';
import { ProductImage } from '@/types';
import { Maximize2 } from 'lucide-react';

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
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[500px] shrink-0 scrollbar-none py-1">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded border-2 overflow-hidden bg-brand-cream shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-brand-black ring-1 ring-brand-black'
                  : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
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
      <div className="relative flex-1 bg-brand-cream rounded-lg overflow-hidden border border-neutral-200/80 group">
        <div className="w-full pt-[100%] relative">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || productName}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />
        </div>

        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-700 rounded-full shadow-md transition-transform hover:scale-110"
          title="Zoom image"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <p className="text-center text-white/70 text-xs mt-3">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};
