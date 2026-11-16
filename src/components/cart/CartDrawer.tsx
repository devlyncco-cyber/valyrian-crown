import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, AlertCircle, Truck } from 'lucide-react';
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
          className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-black" />
                <h2 id="slide-over-title" className="text-base font-heading font-semibold text-brand-black uppercase tracking-wider">
                  Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-neutral-400 hover:text-brand-black transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-neutral-800 mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6">
                    Explore our premium cap collections and wear your confidence today.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-brand-black text-brand-cream text-xs font-heading font-medium tracking-wider uppercase rounded hover:bg-neutral-800 transition-colors"
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
                        className="w-20 h-20 rounded object-cover bg-brand-cream border border-neutral-200/80 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-heading font-semibold text-brand-black truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-neutral-500">{item.selectedVariant}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-[10px] text-neutral-400 uppercase">{item.selectedSize}</p>
                        )}

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-brand-black font-heading">
                            {settings.currency_symbol}{effectivePrice.toFixed(2)}
                          </span>
                          {item.product.sale_price && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              {settings.currency_symbol}{Number(item.product.price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          {/* Quantity Adjuster */}
                          <div className="flex items-center border border-neutral-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 px-2 text-neutral-500 hover:text-brand-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-neutral-800 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 px-2 text-neutral-500 hover:text-brand-black transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove item */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
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
              <div className="border-t border-neutral-100 p-6 bg-neutral-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-heading text-neutral-500">
                    Items Subtotal
                  </span>
                  <span className="text-lg font-heading font-bold text-brand-black">
                    {settings.currency_symbol}{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/80 rounded p-2.5 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-900 leading-tight">
                    <span className="font-semibold block mb-0.5">Delivery Fee:</span>
                    Calculated by the seller in WhatsApp chat based on your delivery address.
                  </div>
                </div>

                {/* Open Checkout Modal Button */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-heading font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Checkout via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <span>WhatsApp: {settings.whatsapp_number}</span>
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
