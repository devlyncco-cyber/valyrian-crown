import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { Category } from '@/types';
import { categoryService } from '@/services/categories/categoryService';
import { Modal } from '@/components/common/Modal';
import { toast } from 'sonner';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getCategories(false);
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || '');
    setFormActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(slug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      toast.error('Category name and slug are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id, {
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDesc.trim() || null,
          is_active: formActive,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
        toast.success('Category updated successfully!');
      } else {
        const created = await categoryService.createCategory({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDesc.trim() || null,
          is_active: formActive,
          image_url: null,
        });
        setCategories((prev) => [...prev, created]);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deleteCat.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteCat.id));
      toast.success('Category removed successfully.');
      setDeleteCat(null);
    } catch (err: any) {
      toast.error(err.message || 'Cannot delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight text-white">
            Category Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Organize products into curated thematic streetwear collections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto shadow-luxury"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 text-neutral-400 font-heading uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Active Caps</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No categories found. Click 'New Category' to add one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-heading font-semibold text-white">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                      /{cat.slug}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-brand-gold font-heading font-medium">
                      {cat.product_count ?? 0} caps
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-semibold uppercase tracking-wider ${
                          cat.is_active
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-neutral-400 hover:text-brand-gold rounded hover:bg-neutral-800"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCat(cat)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Signature Streetwear"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="signature-streetwear"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief description of the cap styles in this category..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs focus:outline-none focus:border-brand-black"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-black"
            />
            <span className="text-xs font-heading font-semibold text-neutral-700 uppercase tracking-wide">
              Category Active & Visible to Shoppers
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-heading uppercase text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-brand-black text-brand-cream hover:bg-neutral-800 rounded text-xs font-heading font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Guard Modal */}
      <Modal
        isOpen={Boolean(deleteCat)}
        onClose={() => setDeleteCat(null)}
        title="Delete Category"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to remove the{' '}
            <strong className="text-neutral-900">{deleteCat?.name}</strong> category?
          </p>

          {deleteCat && (deleteCat.product_count ?? 0) > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                This category currently contains {deleteCat.product_count} product(s). You must reassign those products before deleting this category.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setDeleteCat(null)}
              className="px-4 py-2 text-xs font-heading uppercase text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting || Boolean(deleteCat && (deleteCat.product_count ?? 0) > 0)}
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-heading font-semibold uppercase tracking-wider disabled:opacity-40"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
