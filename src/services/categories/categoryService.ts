import { Category } from '@/types';
import { initialCategories } from '@/data/initialCategories';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const CATEGORIES_STORAGE_KEY = 'valyrian_categories';

export const categoryService = {
  async getCategories(activeOnly: boolean = false): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('categories')
          .select('*, products(count)')
          .order('name', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            image_url: item.image_url,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at,
            product_count: item.products?.[0]?.count || 0,
          }));
        }
      } catch (err) {
        console.warn('Falling back to local categories:', err);
      }
    }

    const local = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    let cats: Category[] = initialCategories;
    if (local) {
      try {
        cats = JSON.parse(local);
      } catch (e) {
        console.error('Error parsing local categories', e);
      }
    } else {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
    }

    return activeOnly ? cats.filter((c) => c.is_active) : cats;
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const all = await this.getCategories(false);
    return all.find((c) => c.id === id) || null;
  },

  async createCategory(payload: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const newCat: Category = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 0,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          id: newCat.id,
          name: newCat.name,
          slug: newCat.slug,
          description: newCat.description,
          image_url: newCat.image_url,
          is_active: newCat.is_active,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) return data;
    }

    const cats = await this.getCategories(false);
    cats.push(newCat);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    return newCat;
  },

  async updateCategory(id: string, payload: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          image_url: payload.image_url,
          is_active: payload.is_active,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) return data;
    }

    const cats = await this.getCategories(false);
    const index = cats.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');

    const updated = {
      ...cats[index],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    cats[index] = updated;
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    return updated;
  },

  async deleteCategory(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      // Check if products exist in category
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (count && count > 0) {
        throw new Error(`Cannot delete category because it contains ${count} product(s). Reassign them first.`);
      }

      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const cats = await this.getCategories(false);
    const filtered = cats.filter((c) => c.id !== id);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
  },
};
