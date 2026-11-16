import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useCartStore } from '@/store/cartStore';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const { settings } = useStoreSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Collection', path: '/shop' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Brand Notification Banner */}
      <div className="bg-brand-black text-brand-cream text-[10px] sm:text-[11px] font-heading font-medium tracking-widest uppercase py-2 px-3 sm:px-4 text-center border-b border-white/10 flex items-center justify-center gap-2 sm:gap-4">
        <span className="truncate">{settings.brand_tagline}</span>
        <span className="hidden sm:inline text-brand-gold shrink-0">•</span>
        <span className="hidden sm:inline text-gray-300 shrink-0">
          WhatsApp Orders: {settings.contact_phone}
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-neutral-200/60 py-3'
            : 'bg-brand-cream border-b border-neutral-200/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-brand-black hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start px-2 min-w-0">
            <Logo variant="dark" showTagline={false} className="lg:hidden" />
            <Logo variant="dark" showTagline={true} className="hidden lg:inline-flex" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest font-heading font-medium transition-colors hover:text-brand-gold relative py-1 ${
                    isActive ? 'text-brand-black font-semibold' : 'text-neutral-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Admin Portal Link & Shopping Cart */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <a
              href={`tel:${settings.contact_phone}`}
              className="hidden md:flex items-center gap-1.5 text-xs font-heading tracking-wider uppercase text-neutral-600 hover:text-brand-black transition-colors"
              title="Call us"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
              <span>{settings.contact_phone}</span>
            </a>

            <Link
              to="/admin/dashboard"
              className="text-neutral-400 hover:text-brand-black p-2 transition-colors rounded-full hover:bg-neutral-100"
              title="Administrator Portal"
              aria-label="Administrator Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-brand-black text-brand-cream hover:bg-neutral-800 rounded-full transition-all duration-200 active:scale-95 shadow-sm group"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[10px] font-heading font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-cream animate-fade-in shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-brand-cream shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <Logo variant="dark" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-brand-black"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-wider font-heading py-2 transition-colors ${
                      isActive
                        ? 'text-brand-black font-bold pl-3 border-l-2 border-brand-gold'
                        : 'text-neutral-600 hover:text-brand-black'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-neutral-200">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-xs uppercase tracking-wider font-heading text-neutral-500 hover:text-brand-black py-2"
                >
                  <Shield className="w-4 h-4 text-brand-gold" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-neutral-200 space-y-4">
            <div className="text-xs text-neutral-500 space-y-1">
              <p className="font-heading font-semibold text-brand-black">ValyrianCrown Support</p>
              <p>Call: {settings.contact_phone}</p>
              <p>WhatsApp: {settings.whatsapp_number}</p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs uppercase tracking-wider font-heading font-medium flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
