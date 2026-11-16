import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Package,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { productService } from '@/services/products/productService';
import { categoryService } from '@/services/categories/categoryService';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { toast } from 'sonner';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Deletion modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts({ publishedOnly: false }),
        categoryService.getCategories(false),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_published: !product.is_published,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      toast.success(
        `Product ${updated.is_published ? 'published' : 'unpublished'} successfully.`
      );
    } catch (err) {
      toast.error('Failed to update publication status.');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_featured: !product.is_featured,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      toast.success(
        `Product ${updated.is_featured ? 'marked as featured' : 'removed from featured'}.`
      );
    } catch (err) {
      toast.error('Failed to update featured status.');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success('Product deleted successfully.');
      setProductToDelete(null);
    } catch (err) {
      toast.error('Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      p.slug.toLowerCase().includes(search.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight text-white">
            Product Catalogue
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your headwear line, pricing, stock levels and visibility.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto shadow-luxury"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by cap name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 py-2 px-3 rounded focus:outline-none focus:border-brand-gold cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-neutral-950/70 text-neutral-400 font-heading uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Product</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Price</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Featured</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Published</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Loading product catalogue...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No products match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImage =
                    p.images?.find((img) => img.is_primary)?.image_url ||
                    p.images?.[0]?.image_url ||
                    '/images/brand/logo-dark.png';

                  return (
                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover bg-neutral-800 border border-neutral-700 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-heading font-semibold text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-mono truncate">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-neutral-300 whitespace-nowrap">
                        {p.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-heading font-semibold text-white whitespace-nowrap">
                        GH₵{Number(p.price).toFixed(2)}
                        {p.sale_price && (
                          <span className="block text-[10px] text-brand-gold font-normal">
                            Sale: GH₵{Number(p.sale_price).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Availability status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge status={p.availability_status} />
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded transition-colors ${
                            p.is_featured
                              ? 'text-brand-gold bg-brand-gold/10'
                              : 'text-neutral-600 hover:text-neutral-400'
                          }`}
                          title={p.is_featured ? 'Featured on home' : 'Click to feature'}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Published toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors ${
                            p.is_published
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {p.is_published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                            title="Preview on storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-1.5 text-neutral-400 hover:text-brand-gold rounded hover:bg-neutral-800"
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Confirm Product Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-neutral-900">{productToDelete?.name}</strong>?
            This will remove all associated image references.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 text-xs font-heading uppercase text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-heading font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
