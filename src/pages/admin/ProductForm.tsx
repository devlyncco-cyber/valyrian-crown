import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Star,
  Trash2,
  Save,
} from 'lucide-react';
import { AvailabilityStatus } from '@/types';
import { productService } from '@/services/products/productService';
import { categoryService } from '@/services/categories/categoryService';
import { toast } from 'sonner';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(45);
  const [salePrice, setSalePrice] = useState<number | string>('');
  const [categoryId, setCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number | string>(15);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('in_stock');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Sizes & Variants
  const [sizesInput, setSizesInput] = useState('Standard Adjustable');
  const [variantOptionsInput, setVariantOptionsInput] = useState('');

  // Images state
  const [images, setImages] = useState<
    { id?: string; image_url: string; alt_text?: string; storage_path?: string; is_primary?: boolean }[]
  >([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load categories and initial product if editing
  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoryService.getCategories(false);
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }

        if (id) {
          const prod = await productService.getProductById(id);
          if (!prod) {
            toast.error('Product not found');
            navigate('/admin/products');
            return;
          }

          setName(prod.name);
          setSlug(prod.slug);
          setIsSlugEditedManually(true);
          setShortDescription(prod.short_description || '');
          setDescription(prod.description || '');
          setPrice(prod.price);
          setSalePrice(prod.sale_price ?? '');
          setCategoryId(prod.category_id || (cats[0]?.id ?? ''));
          setStockQuantity(prod.stock_quantity ?? 10);
          setAvailabilityStatus(prod.availability_status);
          setIsFeatured(prod.is_featured);
          setIsPublished(prod.is_published);

          if (prod.sizes && prod.sizes.length > 0) {
            setSizesInput(prod.sizes.join(', '));
          }

          if (prod.variants && prod.variants.length > 0) {
            setVariantOptionsInput(prod.variants[0].options.join(', '));
          }

          if (prod.images) {
            setImages(
              prod.images.map((img) => ({
                id: img.id,
                image_url: img.image_url,
                alt_text: img.alt_text || '',
                storage_path: img.storage_path || undefined,
                is_primary: img.is_primary,
              }))
            );
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [id, navigate]);

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugEditedManually) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const targetProductId = id || 'temp-new-product';

    try {
      const uploadPromises = Array.from(files).map((file) =>
        productService.uploadProductImage(file, targetProductId)
      );

      const results = await Promise.all(uploadPromises);

      const newImages = results.map((res, idx) => ({
        image_url: res.url,
        storage_path: res.path,
        alt_text: name,
        is_primary: images.length === 0 && idx === 0,
      }));

      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${results.length} image(s) uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product name is required.');
      return;
    }

    if (!slug.trim()) {
      toast.error('URL slug is required.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error('Price must be a valid non-negative number.');
      return;
    }

    let numSalePrice: number | null = null;
    if (salePrice !== '' && salePrice !== null && salePrice !== undefined) {
      numSalePrice = Number(salePrice);
      if (isNaN(numSalePrice) || numSalePrice < 0) {
        toast.error('Sale price must be a valid number.');
        return;
      }
      if (numSalePrice > numPrice) {
        toast.error('Sale price cannot exceed regular price.');
        return;
      }
    }

    // Process sizes and variants
    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const variants = variantOptionsInput.trim()
      ? [
          {
            name: 'Color',
            options: variantOptionsInput
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
          },
        ]
      : [];

    setIsSubmitting(true);

    try {
      const productPayload = {
        name: name.trim(),
        slug: slug.trim(),
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
        price: numPrice,
        sale_price: numSalePrice,
        category_id: categoryId || null,
        stock_quantity: stockQuantity === '' ? null : Number(stockQuantity),
        availability_status: availabilityStatus,
        sizes: sizes.length > 0 ? sizes : ['Standard Adjustable'],
        variants: variants.length > 0 ? variants : null,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      if (isEditing && id) {
        await productService.updateProduct(id, productPayload, images);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(productPayload, images);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-[#777777]">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-1.5 text-[#777777] hover:text-[#111111] rounded-[1px] hover:bg-white"
            title="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-medium uppercase tracking-tight text-[#111111]">
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-xs text-[#777777]">
              Configure product details, pricing, gallery photos, and catalogue visibility.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Product Info */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            1. General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Studio Geometric 10 Cap"
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
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugEditedManually(true);
                }}
                placeholder="studio-geometric-10-cap"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Short Description (Card Summary)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief tagline or one-sentence product highlight"
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Full Description & Craft Details
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description covering fabric twill, construction, comfort, styling advice..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111] leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Pricing & Category */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            2. Pricing & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Selling Price (GH₵) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45.00"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Sale Price (GH₵, Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Leave blank if not on sale"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Product Images (Supabase Storage) */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAEAEA]">
            <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111]">
              3. Product Photography & Gallery
            </h2>
            <span className="text-[10px] text-[#777777]">
              Click star to set primary thumbnail
            </span>
          </div>

          {/* Upload Button Area */}
          <div className="border-2 border-dashed border-[#EAEAEA] hover:border-[#111111] rounded-[1px] p-6 text-center transition-colors bg-[#FAFAF8]">
            <input
              type="file"
              id="image-file-input"
              multiple
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="image-file-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-[1px] bg-white border border-[#EAEAEA] text-[#111111] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-wider text-[#111111] font-medium">
                {isUploadingImage ? 'Uploading Photos...' : 'Upload Cap Images'}
              </p>
              <p className="text-[11px] text-[#777777]">
                Supports JPG, JPEG, PNG, and WebP
              </p>
            </label>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group aspect-square rounded-[1px] overflow-hidden bg-[#F5F5F3] border ${
                    img.is_primary ? 'border-[#111111]' : 'border-[#EAEAEA]'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `Product image ${idx + 1}`}
                    className="w-full h-full object-contain p-2"
                  />

                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className={`p-1.5 rounded-[1px] ${
                        img.is_primary
                          ? 'bg-white text-[#111111]'
                          : 'bg-black/80 text-white hover:bg-white hover:text-[#111111]'
                      }`}
                      title={img.is_primary ? 'Primary image' : 'Set as primary'}
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-[1px] bg-red-600 text-white"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {img.is_primary && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[1px] bg-[#111111] text-white text-[9px] uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Inventory, Sizes & Variants */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            4. Inventory, Sizes & Color Editions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Stock Quantity (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="15"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Availability Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre-Order</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Available Sizes (Comma separated)
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="Standard Adjustable, Fitted"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Color Options (Comma separated)
              </label>
              <input
                type="text"
                value={variantOptionsInput}
                onChange={(e) => setVariantOptionsInput(e.target.value)}
                placeholder="e.g. Pastel Pink, Olive, Navy"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* 5. Visibility & Publishing */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            5. Storefront Visibility
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded-[1px] text-[#111111] focus:ring-0 border-[#EAEAEA]"
              />
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-[#111111] block">
                  Publish to Storefront
                </span>
                <span className="text-[11px] text-[#777777]">
                  When enabled, customers can discover and view this cap in the shop.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded-[1px] text-[#111111] focus:ring-0 border-[#EAEAEA]"
              />
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-[#111111] block">
                  Feature in Homepage Drop Section
                </span>
                <span className="text-[11px] text-[#777777]">
                  Highlight this product in the featured collection on the homepage.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#EAEAEA]">
          <Link
            to="/admin/products"
            className="px-5 py-3 text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
