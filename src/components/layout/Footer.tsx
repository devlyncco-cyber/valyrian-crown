import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MessageSquare, ArrowUpRight, Shield } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useStoreSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-neutral-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo variant="white" showTagline={false} />
            <p className="text-brand-gold font-heading text-xs tracking-widest uppercase font-medium">
              {settings.brand_tagline}
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              ValyrianCrown brings together style, comfort, and individuality through carefully selected headwear designed to complement everyday streetwear.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-brand-gold hover:border-brand-gold transition-colors"
                aria-label="Follow ValyrianCrown on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.contact_phone}`}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-brand-gold hover:border-brand-gold transition-colors"
                aria-label="Call ValyrianCrown"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-neutral-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop All Caps
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=featured" className="hover:text-white transition-colors">
                  Featured Drops
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Brand Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Orders */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-neutral-200 mb-4">
              How to Order
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-brand-gold font-bold">1.</span>
                <span>Select your favourite cap & add to cart.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold font-bold">2.</span>
                <span>Click "Checkout via WhatsApp" to generate your order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold font-bold">3.</span>
                <span>Directly confirm delivery & payment with our team.</span>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500">
                All transactions are confirmed personally via WhatsApp. No hidden charges.
              </li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-neutral-200 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Phone</p>
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="text-neutral-200 hover:text-brand-gold font-medium"
                >
                  {settings.contact_phone}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">WhatsApp Orders</p>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-200 hover:text-emerald-400 font-medium inline-flex items-center gap-1"
                >
                  <span>{settings.whatsapp_number}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Socials</p>
                <p>
                  Instagram:{' '}
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:underline"
                  >
                    {settings.instagram_handle}
                  </a>
                </p>
                <p className="mt-0.5">Snapchat: <span className="text-neutral-300">{settings.snapchat_handle}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {currentYear} {settings.brand_name}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="italic text-neutral-400 font-serif">"Wear Power"</span>
            <Link
              to="/admin/login"
              className="text-neutral-600 hover:text-neutral-400 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
