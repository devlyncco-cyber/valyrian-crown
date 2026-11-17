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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Editorial Page Header */}
      <div className="border-b border-[#EAEAEA] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-heading font-semibold text-[#111111] tracking-tight">
            Shop All Caps
          </h1>
          <p className="text-xs text-[#777777] mt-1 font-normal">
            {products.length} {products.length === 1 ? 'Design' : 'Designs'}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search catalogue..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-60 pl-8 pr-7 py-2 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#999999] absolute left-2.5 top-2.5" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilter('search', '');
                }}
                className="absolute right-2.5 top-2.5 text-[#999999] hover:text-[#111111]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <select
            value={sortParam}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border border-[#EAEAEA] text-xs font-heading text-[#111111] py-2 px-3 rounded-[1px] focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Minimal Category Filter Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-[#EAEAEA] scrollbar-none text-xs font-heading">
        <button
          onClick={() => updateFilter('category', 'all')}
          className={`shrink-0 pb-2 transition-colors uppercase tracking-[0.18em] ${
            categoryParam === 'all'
              ? 'text-[#111111] font-semibold border-b-2 border-[#111111] -mb-[1px]'
              : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          All Caps
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilter('category', cat.id)}
            className={`shrink-0 pb-2 transition-colors uppercase tracking-[0.18em] ${
              categoryParam === cat.id
                ? 'text-[#111111] font-semibold border-b-2 border-[#111111] -mb-[1px]'
                : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Active Filter Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-[#777777] -mt-4">
          <span>Active filter applied</span>
          <button
            onClick={clearAllFilters}
            className="text-[#111111] hover:underline font-medium"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Spacious Product Grid */}
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
