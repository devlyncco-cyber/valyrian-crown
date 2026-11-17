import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit,
  Trash2,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h1 className="text-2xl font-heading font-medium uppercase tracking-tight text-[#111111]">
            Category Management
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Organize products into curated thematic streetwear collections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-[1px] border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#777777] font-mono uppercase text-[10px] tracking-wider border-b border-[#EAEAEA]">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Active Caps</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#777777]">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#777777]">
                    No categories found. Click 'New Category' to add one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-3 px-4 font-heading font-medium uppercase tracking-wide text-[#111111]">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">
                      /{cat.slug}
                    </td>
                    <td className="py-3 px-4 text-[#777777] max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#111111]">
                      {cat.product_count ?? 0} caps
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[1px] text-[10px] font-mono uppercase tracking-wider border ${
                          cat.is_active
                            ? 'bg-white text-[#111111] border-[#111111]'
                            : 'bg-[#FAFAF8] text-[#777777] border-[#EAEAEA]'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-[#777777] hover:text-[#111111] rounded-[1px] hover:bg-[#FAFAF8]"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCat(cat)}
                          className="p-1.5 text-[#777777] hover:text-red-600 rounded-[1px] hover:bg-red-50"
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
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Signature Streetwear"
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="signature-streetwear"
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief description of the cap styles in this category..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="w-4 h-4 rounded-[1px] text-[#111111] border-[#EAEAEA]"
            />
            <span className="text-xs uppercase tracking-wider text-[#111111] font-medium">
              Category Active & Visible to Shoppers
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest disabled:opacity-40 transition-colors"
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
          <p className="text-xs text-[#777777] leading-relaxed">
            Are you sure you want to remove the{' '}
            <strong className="text-[#111111]">{deleteCat?.name}</strong> category?
          </p>

          {deleteCat && (deleteCat.product_count ?? 0) > 0 && (
            <div className="p-3 bg-[#FAFAF8] border border-[#EAEAEA] rounded-[1px] flex items-start gap-2 text-[#111111] text-xs">
              <AlertTriangle className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
              <span>
                This category currently contains {deleteCat.product_count} product(s). You must reassign those products before deleting this category.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => setDeleteCat(null)}
              className="px-4 py-2 text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting || Boolean(deleteCat && (deleteCat.product_count ?? 0) > 0)}
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-[1px] text-xs font-medium uppercase tracking-wider disabled:opacity-40"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
