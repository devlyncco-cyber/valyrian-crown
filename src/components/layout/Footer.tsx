import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useStoreSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAF8] border-t border-[#EAEAEA] text-[#111111] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#EAEAEA]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="dark" showTagline={false} />
            <p className="text-xs uppercase tracking-[0.2em] font-heading font-medium text-[#777777]">
              {settings.brand_tagline}
            </p>
            <p className="text-xs text-[#777777] leading-relaxed max-w-sm font-normal">
              ValyrianCrown brings together style, comfort, and individuality through carefully selected headwear designed to complement everyday streetwear.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-heading font-semibold text-[#111111] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#777777]">
              <li>
                <Link to="/" className="hover:text-[#111111] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#111111] transition-colors">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#111111] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#111111] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-heading font-semibold text-[#111111]">
              Customer Service
            </h4>
            <div className="space-y-2 text-xs text-[#777777]">
              <p>
                Phone:{' '}
                <a href={`tel:${settings.contact_phone}`} className="text-[#111111] hover:underline">
                  {settings.contact_phone}
                </a>
              </p>
              <p>
                WhatsApp:{' '}
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111111] hover:underline"
                >
                  +{settings.whatsapp_number}
                </a>
              </p>
              <p>
                Instagram:{' '}
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111111] hover:underline"
                >
                  {settings.instagram_handle}
                </a>
              </p>
              <p>
                Snapchat: <span className="text-[#111111]">{settings.snapchat_handle}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] gap-4">
          <p>© {currentYear} {settings.brand_name}. All rights reserved.</p>
          <p className="tracking-[0.15em] uppercase text-[10px]">Wear the Crown. Own Your Style.</p>
        </div>
      </div>
    </footer>
  );
};
