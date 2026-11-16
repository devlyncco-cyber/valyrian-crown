import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/common/Logo';
import { toast } from 'sonner';

export const AdminLayout: React.FC = () => {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-heading text-neutral-400">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // Protected route check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-xl border border-neutral-200 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-heading font-bold text-neutral-900 mb-2">
            Administrator Access Required
          </h2>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            You must be signed in with an authorized ValyrianCrown administrator account to view the dashboard.
          </p>
          <div className="space-y-3">
            <Link
              to="/admin/login"
              className="block w-full py-2.5 bg-brand-black text-brand-cream rounded text-xs font-heading font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Sign In to Admin Portal
            </Link>
            <Link
              to="/"
              className="block w-full py-2 text-xs font-heading text-neutral-500 hover:text-neutral-800"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully.');
      navigate('/admin/login');
    } catch (err: any) {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Administrators', path: '/admin/admins', icon: Users },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-neutral-200 selection:bg-brand-gold selection:text-brand-black">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Logo variant="white" showTagline={false} linkToHome={false} />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-neutral-400 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-5 z-50 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="pb-4 border-b border-neutral-800">
            <Logo variant="white" linkToHome={false} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/30 text-[10px] uppercase font-heading font-medium tracking-widest text-brand-gold">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-heading font-medium tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-brand-gold border-l-2 border-brand-gold font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="px-2 py-1.5">
            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-heading">
              Signed in as
            </p>
            <p className="text-xs font-medium text-neutral-200 truncate">
              {profile?.full_name || profile?.email || user?.email || 'Administrator'}
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-heading text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Store</span>
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-heading text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 min-w-0 bg-neutral-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
