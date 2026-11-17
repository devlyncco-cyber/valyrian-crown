import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { CustomerCheckoutModal } from './CustomerCheckoutModal';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { settings } = useStoreSettings();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = getSubtotal();

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-screen max-w-md bg-white border-l border-[#EAEAEA] shadow-2xl flex flex-col justify-between h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#111111]" />
                <h2 id="slide-over-title" className="text-xs uppercase tracking-widest font-heading font-medium text-[#111111]">
                  Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 text-[#777777] hover:text-[#111111] transition-colors rounded-[1px]"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EAEAEA]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F3] flex items-center justify-center text-[#777777] mb-4">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-heading font-medium uppercase tracking-wider text-[#111111] mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#777777] max-w-xs mb-6">
                    Discover headwear that speaks your style. Wear the crown today.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-[#111111] text-white text-xs tracking-widest uppercase rounded-[1px] hover:bg-[#262626] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const effectivePrice =
                    item.product.sale_price !== null && item.product.sale_price !== undefined
                      ? Number(item.product.sale_price)
                      : Number(item.product.price);

                  const primaryImage =
                    item.product.images?.find((img) => img.is_primary)?.image_url ||
                    item.product.images?.[0]?.image_url ||
                    '/images/brand/logo-dark.png';

                  return (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img
                        src={primaryImage}
                        alt={item.product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-[1px] object-cover bg-[#F5F5F3] border border-[#EAEAEA] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-heading font-medium uppercase tracking-wide text-[#111111] truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-[#777777]">{item.selectedVariant}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-[10px] text-[#777777] uppercase tracking-wider">{item.selectedSize}</p>
                        )}

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-mono text-[#111111]">
                            {settings.currency_symbol}{effectivePrice.toFixed(2)}
                          </span>
                          {item.product.sale_price && (
                            <span className="text-[10px] font-mono text-[#777777] line-through">
                              {settings.currency_symbol}{Number(item.product.price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          {/* Quantity Adjuster */}
                          <div className="flex items-center border border-[#EAEAEA] rounded-[1px] bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-[#777777] hover:text-[#111111] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs text-[#111111] select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-[#777777] hover:text-[#111111] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove item */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#777777] hover:text-[#111111] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Subtotal & WhatsApp Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[#EAEAEA] p-6 bg-[#FAFAF8] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#777777]">
                    Items Subtotal
                  </span>
                  <span className="text-base font-mono font-medium text-[#111111]">
                    {settings.currency_symbol}{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-white border border-[#EAEAEA] rounded-[1px] p-3 flex items-start gap-2.5 text-xs text-[#111111]">
                  <Truck className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#777777] leading-relaxed">
                    <span className="text-[#111111] font-medium block">Delivery:</span>
                    Calculated by the seller in WhatsApp chat based on your delivery address.
                  </div>
                </div>

                {/* Open Checkout Modal Button */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Checkout via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#777777] pt-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-[#111111] transition-colors uppercase tracking-wider"
                  >
                    Clear Bag
                  </button>
                  <span className="font-mono text-[10px]">WhatsApp: {settings.whatsapp_number}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Details Checkout Modal */}
      <CustomerCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={items}
      />
    </>
  );
};
