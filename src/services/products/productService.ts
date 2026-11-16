import { Product, ProductImage } from '@/types';
import { initialProducts } from '@/data/initialProducts';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const PRODUCTS_STORAGE_KEY = 'valyrian_products';

export interface ProductFilterParams {
  categoryId?: string;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'featured';
  featuredOnly?: boolean;
  publishedOnly?: boolean;
}

export const productService = {
  async getProducts(params: ProductFilterParams = {}): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `);

        if (params.publishedOnly !== false) {
          query = query.eq('is_published', true);
        }

        if (params.featuredOnly) {
          query = query.eq('is_featured', true);
        }

        if (params.categoryId && params.categoryId !== 'all') {
          query = query.eq('category_id', params.categoryId);
        }

        if (params.search) {
          query = query.ilike('name', `%${params.search}%`);
        }

        switch (params.sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'featured':
            query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            images: (item.images || []).sort(
              (a: ProductImage, b: ProductImage) => a.display_order - b.display_order
            ),
          }));
        }
      } catch (err) {
        console.warn('Falling back to local products:', err);
      }
    }

    // Local fallback
    const local = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    let products: Product[] = initialProducts;
    if (local) {
      try {
        products = JSON.parse(local);
      } catch (e) {
        console.error('Error parsing local products', e);
      }
    } else {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    }

    let filtered = [...products];

    if (params.publishedOnly !== false) {
      filtered = filtered.filter((p) => p.is_published);
    }

    if (params.featuredOnly) {
      filtered = filtered.filter((p) => p.is_featured);
    }

    if (params.categoryId && params.categoryId !== 'all') {
      filtered = filtered.filter((p) => p.category_id === params.categoryId);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q))
      );
    }

    switch (params.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `)
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            ...data,
            images: (data.images || []).sort(
              (a: ProductImage, b: ProductImage) => a.display_order - b.display_order
            ),
          };
        }
      } catch (err) {
        console.warn('Falling back to local product lookup:', err);
      }
    }

    const all = await this.getProducts({ publishedOnly: false });
    return all.find((p) => p.id === id) || null;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `)
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return {
            ...data,
            images: (data.images || []).sort(
              (a: ProductImage, b: ProductImage) => a.display_order - b.display_order
            ),
          };
        }
      } catch (err) {
        console.warn('Falling back to local product lookup by slug:', err);
      }
    }

    const all = await this.getProducts({ publishedOnly: false });
    return all.find((p) => p.slug === slug) || null;
  },

  async createProduct(
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'category'>,
    images: { image_url: string; alt_text?: string; storage_path?: string; is_primary?: boolean }[]
  ): Promise<Product> {
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { data: created, error } = await supabase
        .from('products')
        .insert({
          id: newId,
          name: productData.name,
          slug: productData.slug,
          short_description: productData.short_description,
          description: productData.description,
          price: productData.price,
          sale_price: productData.sale_price,
          category_id: productData.category_id,
          stock_quantity: productData.stock_quantity,
          availability_status: productData.availability_status,
          sizes: productData.sizes,
          variants: productData.variants,
          is_featured: productData.is_featured,
          is_published: productData.is_published,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert images
      if (images.length > 0) {
        const imageRows = images.map((img, idx) => ({
          product_id: newId,
          image_url: img.image_url,
          storage_path: img.storage_path,
          alt_text: img.alt_text || productData.name,
          display_order: idx,
          is_primary: idx === 0,
        }));

        const { error: imgError } = await supabase.from('product_images').insert(imageRows);
        if (imgError) console.error('Error inserting product images:', imgError);
      }

      return (await this.getProductById(newId))!;
    }

    // Local fallback
    const productImages: ProductImage[] = images.map((img, idx) => ({
      id: crypto.randomUUID(),
      product_id: newId,
      image_url: img.image_url,
      storage_path: img.storage_path || null,
      alt_text: img.alt_text || productData.name,
      display_order: idx,
      is_primary: idx === 0,
      created_at: now,
    }));

    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: now,
      updated_at: now,
      images: productImages,
    };

    const all = await this.getProducts({ publishedOnly: false });
    all.unshift(newProduct);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(all));
    return newProduct;
  },

  async updateProduct(
    id: string,
    productData: Partial<Product>,
    images?: { id?: string; image_url: string; alt_text?: string; storage_path?: string; is_primary?: boolean }[]
  ): Promise<Product> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          slug: productData.slug,
          short_description: productData.short_description,
          description: productData.description,
          price: productData.price,
          sale_price: productData.sale_price,
          category_id: productData.category_id,
          stock_quantity: productData.stock_quantity,
          availability_status: productData.availability_status,
          sizes: productData.sizes,
          variants: productData.variants,
          is_featured: productData.is_featured,
          is_published: productData.is_published,
        })
        .eq('id', id);

      if (error) throw error;

      if (images && images.length > 0) {
        // Replace existing images or sync
        await supabase.from('product_images').delete().eq('product_id', id);
        const imageRows = images.map((img, idx) => ({
          product_id: id,
          image_url: img.image_url,
          storage_path: img.storage_path,
          alt_text: img.alt_text || productData.name,
          display_order: idx,
          is_primary: idx === 0,
        }));
        await supabase.from('product_images').insert(imageRows);
      }

      return (await this.getProductById(id))!;
    }

    const all = await this.getProducts({ publishedOnly: false });
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    let updatedImages = all[idx].images;
    if (images) {
      updatedImages = images.map((img, i) => ({
        id: img.id || crypto.randomUUID(),
        product_id: id,
        image_url: img.image_url,
        storage_path: img.storage_path || null,
        alt_text: img.alt_text || productData.name || all[idx].name,
        display_order: i,
        is_primary: i === 0,
        created_at: now,
      }));
    }

    const updated: Product = {
      ...all[idx],
      ...productData,
      images: updatedImages,
      updated_at: now,
    };

    all[idx] = updated;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const all = await this.getProducts({ publishedOnly: false });
    const filtered = all.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
  },

  async uploadProductImage(file: File, productId: string): Promise<{ url: string; path: string }> {
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    }

    // For local mock / demo: convert file to Object URL or base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: `local/${file.name}`,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
