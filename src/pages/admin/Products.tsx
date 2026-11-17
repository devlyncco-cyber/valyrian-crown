import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h1 className="text-2xl font-heading font-medium uppercase tracking-tight text-[#111111]">
            Product Catalogue
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Manage your headwear line, pricing, stock levels and visibility.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[1px] border border-[#EAEAEA] flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by cap name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-3 top-2.5" />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[1px] border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAF8] text-[10px] uppercase font-mono tracking-wider text-[#777777]">
                <th className="py-3 px-4">Cap</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA] text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-6 h-6 text-[#777777]/50" />
                      <p>No products found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImage =
                    p.images?.find((img) => img.is_primary)?.image_url ||
                    p.images?.[0]?.image_url ||
                    '/images/brand/logo-dark.png';

                  return (
                    <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                      {/* Cap Item */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-12 h-12 rounded-[1px] object-cover bg-[#F5F5F3] border border-[#EAEAEA] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-heading font-medium uppercase tracking-tight text-[#111111] truncate max-w-[200px] sm:max-w-xs">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-mono text-[#777777] truncate">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#777777]">
                        {p.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col font-mono">
                          <span className="text-[#111111] font-medium">
                            GH₵{Number(p.sale_price ?? p.price).toFixed(2)}
                          </span>
                          {p.sale_price && (
                            <span className="text-[10px] text-[#777777] line-through">
                              GH₵{Number(p.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="py-3 px-4">
                        <Badge status={p.availability_status} />
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[1px] text-[10px] font-mono uppercase tracking-wider transition-colors border ${
                            p.is_published
                              ? 'bg-white text-[#111111] border-[#111111]'
                              : 'bg-[#FAFAF8] text-[#777777] border-[#EAEAEA] hover:border-[#111111]'
                          }`}
                          title="Click to toggle publication"
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

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-[1px] transition-colors ${
                            p.is_featured
                              ? 'text-[#111111]'
                              : 'text-[#777777]/40 hover:text-[#111111]'
                          }`}
                          title="Toggle featured status"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#777777] hover:text-[#111111] rounded-[1px] hover:bg-[#FAFAF8] transition-colors"
                            title="View on store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-1.5 text-[#777777] hover:text-[#111111] rounded-[1px] hover:bg-[#FAFAF8] transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-[#777777] hover:text-red-600 rounded-[1px] hover:bg-red-50 transition-colors"
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
        title="Confirm Deletion"
        description="Are you sure you want to delete this cap from your catalogue?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#777777]">
            This action will permanently delete <strong className="text-[#111111]">{productToDelete?.name}</strong> and all its associated image records. This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEAEA]">
            <button
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 bg-white border border-[#EAEAEA] text-[#777777] hover:text-[#111111] rounded-[1px] text-xs font-medium uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-[1px] text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
