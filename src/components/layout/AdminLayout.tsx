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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center text-[#111111]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#777777]">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // Protected route check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[1px] p-8 shadow-sm border border-[#EAEAEA] text-center">
          <div className="w-12 h-12 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-heading font-medium uppercase tracking-tight text-[#111111] mb-2">
            Administrator Access Required
          </h2>
          <p className="text-xs text-[#777777] mb-6 leading-relaxed">
            You must be signed in with an authorized ValyrianCrown administrator account to view the dashboard.
          </p>
          <div className="space-y-3">
            <Link
              to="/admin/login"
              className="block w-full py-3 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Sign In to Admin Portal
            </Link>
            <Link
              to="/"
              className="block w-full py-2 text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111]"
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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col md:flex-row text-[#111111]">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-[#EAEAEA] p-4 flex items-center justify-between sticky top-0 z-40">
        <Logo variant="dark" showTagline={false} linkToHome={false} />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-[#777777] hover:text-[#111111]"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#111111]/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-[#EAEAEA] flex flex-col justify-between p-6 z-50 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="pb-5 border-b border-[#EAEAEA]">
            <Logo variant="dark" linkToHome={false} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] text-[10px] uppercase font-mono tracking-widest text-[#777777]">
              <ShieldCheck className="w-3 h-3 text-[#111111]" />
              <span>Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[1px] text-xs font-medium tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-[#FAFAF8] text-[#111111] border-l-2 border-[#111111] font-semibold'
                      : 'text-[#777777] hover:text-[#111111] hover:bg-[#FAFAF8]'
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
        <div className="pt-4 border-t border-[#EAEAEA] space-y-2">
          <div className="px-3 py-1">
            <p className="text-[10px] uppercase tracking-wider text-[#777777]">
              Signed in as
            </p>
            <p className="text-xs font-medium text-[#111111] truncate mt-0.5">
              {profile?.full_name || profile?.email || user?.email || 'Administrator'}
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#777777] hover:text-[#111111] hover:bg-[#FAFAF8] rounded-[1px] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Store</span>
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#777777] hover:text-[#111111] hover:bg-[#FAFAF8] rounded-[1px] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 min-w-0 bg-[#FAFAF8] p-5 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
