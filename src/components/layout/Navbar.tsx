import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
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
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Subtle Top Notification */}
      <div className="bg-[#111111] text-[#FAFAF8] text-[10px] tracking-[0.2em] uppercase py-2 px-4 text-center font-heading font-normal">
        <span>{settings.brand_tagline}</span>
        <span className="hidden sm:inline mx-3 text-neutral-500">•</span>
        <span className="hidden sm:inline text-neutral-400">
          WhatsApp Orders: {settings.contact_phone}
        </span>
      </div>

      {/* Main Minimalist Navbar */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 border-b border-[#EAEAEA] ${
          isScrolled ? 'py-3' : 'py-4 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-[#111111] hover:text-[#777777] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>
          </div>

          {/* Brand Logo on Left */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Logo variant="dark" showTagline={false} />
          </div>

          {/* Desktop Navigation Links Centered */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.18em] font-heading transition-colors py-1 ${
                    isActive ? 'text-[#111111] font-semibold' : 'text-[#777777] hover:text-[#111111]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Shopping Bag Button on Right */}
          <div className="flex items-center space-x-5">
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-heading text-[#111111] hover:text-[#777777] transition-colors p-1"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-heading font-medium w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-medium text-[11px]">Bag</span>
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white border-r border-[#EAEAEA] p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#EAEAEA]">
              <Logo variant="dark" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#777777] hover:text-[#111111]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-[0.2em] font-heading transition-colors ${
                      isActive ? 'text-[#111111] font-semibold' : 'text-[#777777] hover:text-[#111111]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#EAEAEA] space-y-4">
            <div className="text-xs text-[#777777] space-y-1">
              <p className="font-heading font-medium text-[#111111] uppercase tracking-wider text-[11px]">Contact & Order</p>
              <p>Phone: {settings.contact_phone}</p>
              <p>WhatsApp: {settings.whatsapp_number}</p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs uppercase tracking-[0.15em] font-heading font-medium flex items-center justify-center transition-colors"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
