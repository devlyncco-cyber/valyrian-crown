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
      sub: 'All product designs in system',
      icon: Package,
      color: 'text-white',
      border: 'border-neutral-800',
    },
    {
      title: 'Published',
      value: publishedProducts,
      sub: 'Visible on customer shop',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-900/40',
    },
    {
      title: 'Featured Drops',
      value: featuredProducts,
      sub: 'Shown in featured section',
      icon: Sparkles,
      color: 'text-brand-gold',
      border: 'border-brand-gold/30',
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      sub: 'Requires restock attention',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-900/40',
    },
    {
      title: 'Draft / Unpublished',
      value: draftProducts,
      sub: 'Hidden from public storefront',
      icon: Eye,
      color: 'text-neutral-400',
      border: 'border-neutral-800',
    },
    {
      title: 'Categories',
      value: totalCategories,
      sub: 'Active catalogue collections',
      icon: Layers,
      color: 'text-sky-400',
      border: 'border-neutral-800',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ValyrianCrown Administrator Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-white">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-luxury"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Cap</span>
          </Link>
          <Link
            to="/admin/admins"
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-heading font-medium uppercase tracking-wider flex items-center gap-2 transition-colors border border-neutral-700"
          >
            <Users className="w-4 h-4 text-brand-gold" />
            <span>Manage Admins</span>
          </Link>
        </div>
      </div>

      {/* Notice Reminder: Manual WhatsApp Checkout */}
      <div className="bg-neutral-900/90 border border-brand-gold/30 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-heading font-bold tracking-wider text-brand-gold">
              Catalogue Management Architecture
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customer orders are submitted directly through WhatsApp to <span className="text-neutral-200 font-semibold">{settings.whatsapp_number}</span>. No customer payment credentials or internal order records are stored.
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
              className={`bg-neutral-900/90 rounded-lg p-4 border ${stat.border} shadow-sm space-y-2`}
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-heading tracking-wider truncate">
                  {stat.title}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-heading font-bold ${stat.color}`}>
                {isLoading ? '...' : stat.value}
              </p>
              <p className="text-[10px] text-neutral-500 leading-tight">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Links & Recent Updates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Product Updates */}
        <div className="lg:col-span-8 bg-neutral-900 rounded-lg border border-neutral-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="text-sm uppercase font-heading font-bold tracking-wider text-white">
              Recent Product Catalog Updates
            </h2>
            <Link
              to="/admin/products"
              className="text-xs font-heading font-semibold text-brand-gold hover:underline flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-800/80">
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
                      className="w-12 h-12 rounded object-cover bg-neutral-800 shrink-0 border border-neutral-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-semibold text-white truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                        <span>GH₵{Number(product.price).toFixed(2)}</span>
                        <span>•</span>
                        <span className={product.is_published ? 'text-emerald-400' : 'text-neutral-500'}>
                          {product.is_published ? 'Published' : 'Draft'}
                        </span>
                        {product.is_featured && (
                          <>
                            <span>•</span>
                            <span className="text-brand-gold">Featured</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-2 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
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
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-5 space-y-4">
            <h3 className="text-xs uppercase font-heading font-bold tracking-wider text-neutral-300">
              Quick Management Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/products/new"
                className="w-full p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded flex items-center justify-between text-xs font-heading text-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-brand-gold" />
                  <span>Create Product Listing</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </Link>

              <Link
                to="/admin/categories"
                className="w-full p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded flex items-center justify-between text-xs font-heading text-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Manage Categories</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </Link>

              <Link
                to="/admin/admins"
                className="w-full p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded flex items-center justify-between text-xs font-heading text-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Add / Manage Admins</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </Link>

              <Link
                to="/admin/settings"
                className="w-full p-3 bg-neutral-800/80 hover:bg-neutral-800 rounded flex items-center justify-between text-xs font-heading text-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>Store Identity & Contacts</span>
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </Link>
            </div>
          </div>

          {/* Live Storefront Preview Box */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-5 space-y-3">
            <h3 className="text-xs uppercase font-heading font-bold tracking-wider text-neutral-300">
              Customer Storefront
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Preview how changes to products, prices, and settings appear to your customers in real time.
            </p>
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-brand-gold hover:underline pt-1"
            >
              <span>Launch Live Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
