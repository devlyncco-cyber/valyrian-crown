import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '@/types';
import { productService, ProductFilterParams } from '@/services/products/productService';
import { categoryService } from '@/services/categories/categoryService';
import { ProductGrid } from '@/components/products/ProductGrid';
import { QuickViewModal } from '@/components/products/QuickViewModal';
import { useStoreSettings } from '@/contexts/SettingsContext';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useStoreSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters from URL or state
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = (searchParams.get('sort') as ProductFilterParams['sort']) || 'newest';
  const searchParam = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    categoryService.getCategories(true).then(setCategories).catch(console.error);
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProducts({
          categoryId: categoryParam === 'all' ? undefined : categoryParam,
          sort: sortParam,
          search: searchParam,
          publishedOnly: true,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, sortParam, searchParam]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(searchParam || (categoryParam && categoryParam !== 'all') || sortParam !== 'newest');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-200/80 pb-6">
        <p className="text-xs uppercase tracking-widest font-heading font-semibold text-brand-gold mb-1">
          The Full Catalogue
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight text-brand-black">
            Shop All Caps
          </h1>
          <p className="text-xs text-neutral-500 font-heading">
            Showing {products.length} {products.length === 1 ? 'Design' : 'Designs'}
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by cap name, color, style..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-black focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilter('search', '');
                }}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Controls */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-neutral-100 rounded text-xs font-heading font-medium text-neutral-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-heading text-neutral-500 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-neutral-50 border border-neutral-200 text-xs font-heading font-medium text-neutral-800 py-2 px-3 rounded focus:outline-none focus:border-brand-black cursor-pointer"
              >
                <option value="newest">Newest Releases</option>
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Desktop) */}
        <div className="hidden md:flex items-center gap-2 pt-2 border-t border-neutral-100 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider font-heading text-neutral-400 mr-2 shrink-0">
            Categories:
          </span>
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading tracking-wide uppercase transition-colors shrink-0 ${
              categoryParam === 'all'
                ? 'bg-brand-black text-brand-cream font-medium shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Caps
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading tracking-wide uppercase transition-colors shrink-0 ${
                categoryParam === cat.id
                  ? 'bg-brand-black text-brand-cream font-medium shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Drawer / Accordion */}
        {mobileFilterOpen && (
          <div className="md:hidden pt-3 border-t border-neutral-100 space-y-3">
            <p className="text-xs font-heading font-semibold uppercase text-neutral-700">Categories</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  updateFilter('category', 'all');
                  setMobileFilterOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-heading uppercase ${
                  categoryParam === 'all'
                    ? 'bg-brand-black text-white font-medium'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                All Caps
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    updateFilter('category', cat.id);
                    setMobileFilterOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-heading uppercase ${
                    categoryParam === cat.id
                      ? 'bg-brand-black text-white font-medium'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <span>Filtered catalogue</span>
            <button
              onClick={clearAllFilters}
              className="text-neutral-700 hover:text-red-600 font-heading font-medium underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
