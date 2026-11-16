import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Truck,
  Copy,
  Check,
  ArrowRight,
  X,
} from 'lucide-react';
import { CartItem, CustomerDetails } from '@/types';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { whatsappService } from '@/services/whatsapp/whatsappService';
import { Modal } from '@/components/common/Modal';
import { toast } from 'sonner';

interface CustomerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSent?: () => void;
}

const STORAGE_KEY = 'valyrian_customer_info';

export const CustomerCheckoutModal: React.FC<CustomerCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSent,
}) => {
  const { settings } = useStoreSettings();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load saved details from localStorage
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

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsSubtotal = items.reduce((sum, item) => {
    const price =
      item.product.sale_price !== null && item.product.sale_price !== undefined
        ? Number(item.product.sale_price)
        : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name.');
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

    // Save to localStorage for convenience
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customerDetails));

    setIsProcessing(true);
    try {
      const result = await whatsappService.validateAndPrepareCheckout(
        items,
        customerDetails,
        settings.whatsapp_number,
        settings.currency_symbol
      );

      if (!result.success) {
        toast.error(result.error || 'Cart validation failed.');
        setIsProcessing(false);
        return;
      }

      setGeneratedMessage(result.message || null);

      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank');
        toast.success('Opening WhatsApp with your order and delivery details...');
        if (onOrderSent) onOrderSent();
      }
    } catch (err: any) {
      toast.error(err.message || 'Error preparing WhatsApp checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    toast.success('Order message copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Order via WhatsApp"
      description="Provide your delivery details. Delivery charges are calculated by the seller in WhatsApp."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Order Summary Pill */}
        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-heading font-semibold text-neutral-800">
              {totalItemsCount} {totalItemsCount === 1 ? 'Cap' : 'Caps'} in Order
            </span>
            <p className="text-[11px] text-neutral-500">Items Total: {settings.currency_symbol}{itemsSubtotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-heading font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/30">
              WhatsApp Direct
            </span>
          </div>
        </div>

        {/* Delivery Calculation Notice */}
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-semibold text-amber-950">
              Delivery Fee Notice:
            </p>
            <p className="text-[11px] text-amber-900/90 mt-0.5">
              The exact delivery fee is not charged online. It is calculated and agreed directly with the ValyrianCrown seller in the WhatsApp conversation based on your location.
            </p>
          </div>
        </div>

        {/* Customer Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Contact Phone / WhatsApp *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. 050 975 8180"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Delivery Location & Landmark *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. East Legon, Accra (near American House) or Kumasi, KNUST"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Include city, area, and prominent landmark so the seller can calculate your delivery accurately.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Additional Notes (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call before arrival, leave with security, or prefer morning delivery"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
              />
              <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 space-y-2.5">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isProcessing ? 'Validating Order...' : 'Send Order to WhatsApp'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {generatedMessage && (
              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-heading font-medium tracking-wide flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Order Message Copied!' : 'Copy Order Text to Clipboard'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
