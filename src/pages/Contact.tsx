import React, { useState } from 'react';
import { Phone, MessageSquare, Instagram, Mail, Send, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const { settings } = useStoreSettings();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please enter your name and message.');
      return;
    }

    setIsSubmitting(true);

    // Build structured inquiry message for WhatsApp
    const text = [
      `Hello ValyrianCrown! I have an inquiry from the website.`,
      ``,
      `*Name:* ${form.name}`,
      `*Contact Phone:* ${form.phone || 'Not provided'}`,
      `*Subject:* ${form.subject}`,
      ``,
      `*Message:*`,
      `${form.message}`,
    ].join('\n');

    const cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
    toast.success('Opening WhatsApp to send your inquiry directly to our team!');
    setIsSubmitting(false);

    setForm({
      name: '',
      phone: '',
      subject: 'Order Inquiry',
      message: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold">
          Connect With Us
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold uppercase tracking-tight text-brand-black">
          Contact ValyrianCrown
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light">
          Have a question about a cap, custom delivery or bulk styling? We are right here on WhatsApp and phone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phone */}
          <div className="p-6 bg-white rounded-lg border border-neutral-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-black text-brand-gold flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs uppercase font-heading font-bold tracking-wider text-neutral-500">
                Direct Phone Call
              </h3>
              <a
                href={`tel:${settings.contact_phone}`}
                className="text-base font-heading font-bold text-brand-black hover:text-brand-gold transition-colors block mt-0.5"
              >
                {settings.contact_phone}
              </a>
              <p className="text-[11px] text-neutral-500 mt-1">
                Mon - Sat: 8:00 AM - 8:00 PM GMT
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-6 bg-white rounded-lg border border-neutral-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs uppercase font-heading font-bold tracking-wider text-neutral-500">
                WhatsApp Orders & Support
              </h3>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-heading font-bold text-emerald-700 hover:underline block mt-0.5"
              >
                +{settings.whatsapp_number}
              </a>
              <p className="text-[11px] text-neutral-500 mt-1">
                Instant order completion, sizing queries, and live delivery updates.
              </p>
              <div className="mt-3">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-heading font-semibold uppercase tracking-wider"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="p-6 bg-white rounded-lg border border-neutral-200/80 shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-heading font-bold tracking-wider text-neutral-500">
              Social Media Channels
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-600">
                  <Instagram className="w-4 h-4 text-brand-gold" />
                  <span>Instagram:</span>
                </span>
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading font-semibold text-brand-black hover:text-brand-gold"
                >
                  {settings.instagram_handle}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-600">
                  <span className="w-4 h-4 rounded-full bg-yellow-400 text-brand-black flex items-center justify-center text-[10px] font-bold">
                    👻
                  </span>
                  <span>Snapchat:</span>
                </span>
                <span className="font-heading font-semibold text-brand-black">
                  {settings.snapchat_handle}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>Location:</span>
                </span>
                <span className="font-heading font-medium text-neutral-800">
                  Accra, Ghana (Nationwide Delivery)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Message Dispatch Form (Submits to WhatsApp) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-neutral-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-heading font-bold uppercase tracking-tight text-brand-black">
              Send Direct Inquiry
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Submit your inquiry and it will automatically open in WhatsApp ready to send to our team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 050 975 8180"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Subject
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black focus:bg-white cursor-pointer"
              >
                <option value="Order Inquiry">Order Inquiry / Availability</option>
                <option value="Delivery Question">Delivery & Shipping in Ghana</option>
                <option value="Wholesale / Bulk">Bulk Styling / Wholesale</option>
                <option value="Other">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Ask about cap availability, specific colors, or delivery time..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-black hover:bg-neutral-800 text-brand-cream rounded font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-luxury transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-brand-gold" />
              <span>Send Message to WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
