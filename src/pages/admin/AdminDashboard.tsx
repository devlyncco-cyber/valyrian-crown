import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Sparkles,
  AlertTriangle,
  PlusCircle,
  Eye,
  Edit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { productService } from '@/services/products/productService';
import { categoryService } from '@/services/categories/categoryService';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const AdminDashboard: React.FC = () => {
  const { settings } = useStoreSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [prods, cats] = await Promise.all([
          productService.getProducts({ publishedOnly: false }),
          categoryService.getCategories(false),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.is_published).length;
  const draftProducts = products.filter((p) => !p.is_published).length;
  const featuredProducts = products.filter((p) => p.is_featured).length;
  const outOfStockProducts = products.filter((p) => p.availability_status === 'out_of_stock').length;
  const totalCategories = categories.length;

  const statCards = [
    {
      title: 'Total Caps',
      value: totalProducts,
      sub: 'All product designs',
      icon: Package,
    },
    {
      title: 'Published',
      value: publishedProducts,
      sub: 'Visible on customer shop',
      icon: CheckCircle2,
    },
    {
      title: 'Featured',
      value: featuredProducts,
      sub: 'Shown in featured collection',
      icon: Sparkles,
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      sub: 'Requires restock',
      icon: AlertTriangle,
    },
    {
      title: 'Draft',
      value: draftProducts,
      sub: 'Hidden from storefront',
      icon: Eye,
    },
    {
      title: 'Categories',
      value: totalCategories,
      sub: 'Active collections',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEAEA]">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            ValyrianCrown Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium uppercase tracking-tight text-[#111111] mt-1">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Cap</span>
          </Link>
          <Link
            to="/admin/admins"
            className="px-4 py-2.5 bg-white hover:bg-[#FAFAF8] text-[#111111] rounded-[1px] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors border border-[#EAEAEA]"
          >
            <Users className="w-3.5 h-3.5 text-[#111111]" />
            <span>Manage Admins</span>
          </Link>
        </div>
      </div>

      {/* Notice Reminder: Manual WhatsApp Checkout */}
      <div className="bg-white border border-[#EAEAEA] rounded-[1px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-[1px] bg-[#FAFAF8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-medium tracking-wider text-[#111111]">
              Order Processing Model
            </h4>
            <p className="text-xs text-[#777777] mt-0.5">
              Customer orders are submitted directly through WhatsApp to <span className="text-[#111111] font-mono">+{settings.whatsapp_number}</span>. No customer payment credentials or internal order records are stored.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-[1px] p-4 border border-[#EAEAEA] space-y-2"
            >
              <div className="flex items-center justify-between text-[#777777]">
                <span className="text-[10px] uppercase font-mono tracking-wider truncate">
                  {stat.title}
                </span>
                <Icon className="w-3.5 h-3.5 text-[#111111]" />
              </div>
              <p className="text-2xl font-mono text-[#111111]">
                {isLoading ? '...' : stat.value}
              </p>
              <p className="text-[10px] text-[#777777] leading-tight">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Links & Recent Updates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Product Updates */}
        <div className="lg:col-span-8 bg-white rounded-[1px] border border-[#EAEAEA] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
            <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111]">
              Recent Catalogue Updates
            </h2>
            <Link
              to="/admin/products"
              className="text-xs tracking-wider uppercase text-[#777777] hover:text-[#111111] flex items-center gap-1 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#EAEAEA]">
            {products.slice(0, 6).map((product) => {
              const primaryImage =
                product.images?.find((img) => img.is_primary)?.image_url ||
                product.images?.[0]?.image_url ||
                '/images/brand/logo-dark.png';

              return (
                <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-12 h-12 rounded-[1px] object-cover bg-[#F5F5F3] shrink-0 border border-[#EAEAEA]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-medium uppercase tracking-tight text-[#111111] truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#777777]">
                        <span className="font-mono">GH₵{Number(product.price).toFixed(2)}</span>
                        <span>•</span>
                        <span>
                          {product.is_published ? 'Published' : 'Draft'}
                        </span>
                        {product.is_featured && (
                          <>
                            <span>•</span>
                            <span className="text-[#111111] font-medium">Featured</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-1.5 text-[#777777] hover:text-[#111111] rounded-[1px] hover:bg-[#FAFAF8] transition-colors"
                    title="Edit cap"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Administration Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-5 space-y-3">
            <h3 className="text-xs uppercase font-medium tracking-wider text-[#111111]">
              Management Shortcuts
            </h3>
            <div className="space-y-2 pt-1">
              <Link
                to="/admin/products/new"
                className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#EAEAEA] rounded-[1px] flex items-center justify-between text-xs text-[#111111] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-[#111111]" />
                  <span>Create Product Listing</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#777777]" />
              </Link>

              <Link
                to="/admin/categories"
                className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#EAEAEA] rounded-[1px] flex items-center justify-between text-xs text-[#111111] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#111111]" />
                  <span>Manage Categories</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#777777]" />
              </Link>

              <Link
                to="/admin/admins"
                className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#EAEAEA] rounded-[1px] flex items-center justify-between text-xs text-[#111111] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#111111]" />
                  <span>Add / Manage Admins</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#777777]" />
              </Link>

              <Link
                to="/admin/settings"
                className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#EAEAEA] rounded-[1px] flex items-center justify-between text-xs text-[#111111] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#111111]" />
                  <span>Store Identity & Contacts</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#777777]" />
              </Link>
            </div>
          </div>

          {/* Live Storefront Box */}
          <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-5 space-y-2.5">
            <h3 className="text-xs uppercase font-medium tracking-wider text-[#111111]">
              Live Storefront
            </h3>
            <p className="text-xs text-[#777777] leading-relaxed">
              Preview how changes to products, prices, and settings appear to your customers in real time.
            </p>
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#111111] hover:underline pt-1 font-medium"
            >
              <span>Launch Storefront</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
