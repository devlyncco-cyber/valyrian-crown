import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  ArrowRight,
  Copy,
  Check,
  Truck,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { whatsappService } from '@/services/whatsapp/whatsappService';
import { CustomerDetails } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'valyrian_customer_info';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { settings } = useStoreSettings();

  // Customer details
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load saved customer details
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: CustomerDetails = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.notes) setNotes(parsed.notes);
      } catch (e) {
        console.error('Error loading saved customer info', e);
      }
    }
  }, []);

  const subtotal = getSubtotal();

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name for the order.');
      return;
    }
    if (!contact.trim()) {
      toast.error('Please enter your contact phone number.');
      return;
    }
    if (!location.trim()) {
      toast.error('Please enter your delivery location/address.');
      return;
    }

    const customerDetails: CustomerDetails = {
      name: name.trim(),
      contact: contact.trim(),
      location: location.trim(),
      notes: notes.trim() || undefined,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customerDetails));

    setIsCheckingOut(true);
    try {
      const result = await whatsappService.validateAndPrepareCheckout(
        items,
        customerDetails,
        settings.whatsapp_number,
        settings.currency_symbol
      );

      if (!result.success) {
        toast.error(result.error || 'Cart validation failed.');
        setIsCheckingOut(false);
        return;
      }

      setCheckoutMessage(result.message || null);

      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank');
        toast.success('Opening WhatsApp with your order & delivery details...');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during WhatsApp checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCopyMessage = () => {
    if (!checkoutMessage) return;
    navigator.clipboard.writeText(checkoutMessage);
    setCopied(true);
    toast.success('Order message copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F5F3] border border-[#EAEAEA] flex items-center justify-center mx-auto mb-6 text-[#777777]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-heading font-medium uppercase tracking-tight text-[#111111] mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you haven't added any caps yet. Discover our collection and wear your confidence today.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium tracking-widest uppercase transition-colors"
        >
          <span>Explore The Drops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-[#EAEAEA] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Review & Checkout
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium uppercase tracking-tight text-[#111111] mt-1">
            Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111] transition-colors self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 bg-white rounded-[1px] border border-[#EAEAEA] divide-y divide-[#EAEAEA] overflow-hidden">
          {items.map((item) => {
            const effectivePrice =
              item.product.sale_price !== null && item.product.sale_price !== undefined
                ? Number(item.product.sale_price)
                : Number(item.product.price);

            const primaryImage =
              item.product.images?.find((img) => img.is_primary)?.image_url ||
              item.product.images?.[0]?.image_url ||
              '/images/brand/logo-dark.png';

            return (
              <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <img
                    src={primaryImage}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1px] object-cover bg-[#F5F5F3] border border-[#EAEAEA] shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-sm font-heading font-medium uppercase tracking-wide text-[#111111] hover:underline block truncate"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-[#777777] mt-1">
                      {item.selectedVariant && <span>Edition: {item.selectedVariant}</span>}
                      {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                    </div>
                    <p className="text-xs font-mono text-[#111111] mt-1.5">
                      {settings.currency_symbol}{effectivePrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#EAEAEA] rounded-[1px] bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-[#777777] hover:text-[#111111] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 font-mono text-xs text-[#111111] select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-[#777777] hover:text-[#111111] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-mono text-[#111111]">
                      {settings.currency_symbol}{(effectivePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#777777] hover:text-[#111111] transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Details & WhatsApp Checkout Form */}
        <div className="lg:col-span-5 bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-6">
          <div>
            <h2 className="text-xs font-heading font-medium uppercase tracking-widest text-[#111111] pb-2 border-b border-[#EAEAEA]">
              Delivery Details & Checkout
            </h2>
            <p className="text-xs text-[#777777] mt-2">
              Enter your details below. Your order and location will be sent directly to WhatsApp.
            </p>
          </div>

          <form onSubmit={handleWhatsAppCheckout} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                />
                <User className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Contact Phone / WhatsApp *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 050 975 8180"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                />
                <Phone className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Delivery Location & Landmark *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. East Legon, Accra (near American House)"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                />
                <MapPin className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-[#777777] mt-1">
                Include city/area and nearest landmark for accurate delivery dispatch.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Delivery Notes (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before arrival, leave with security"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                />
                <FileText className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="pt-3 border-t border-[#EAEAEA] space-y-2.5 text-xs text-[#777777]">
              <div className="flex justify-between">
                <span>Caps Total:</span>
                <span className="font-mono text-[#111111]">
                  {settings.currency_symbol}{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#111111] bg-[#FAFAF8] p-2.5 rounded-[1px] border border-[#EAEAEA]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Delivery Fee:</span>
                </span>
                <span className="text-[11px] text-[#777777]">Calculated by seller in chat</span>
              </div>
              <div className="pt-2 border-t border-[#EAEAEA] flex justify-between text-sm font-medium text-[#111111]">
                <span>Items Subtotal:</span>
                <span className="font-mono">{settings.currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout via WhatsApp button */}
            <button
              type="submit"
              disabled={isCheckingOut}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isCheckingOut ? 'Validating Order...' : 'Checkout via WhatsApp'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Copy Message Fallback */}
          {checkoutMessage && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full py-2.5 bg-[#F5F5F3] hover:bg-[#EAEAEA] text-[#111111] rounded-[1px] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#111111]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Order Text Copied' : 'Copy Order Text to Clipboard'}</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#EAEAEA] space-y-2 text-[11px] text-[#777777]">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#111111] shrink-0" />
              <span>Doorstep delivery arranged across Accra & all Ghana regions.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111111] shrink-0" />
              <span>Direct personal confirmation with the ValyrianCrown founder.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
