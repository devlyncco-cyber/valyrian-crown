export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path?: string | null;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  sale_price?: number | null;
  category_id?: string | null;
  category?: Category | null;
  stock_quantity?: number | null;
  availability_status: AvailabilityStatus;
  sizes?: string[] | null;
  variants?: ProductVariant[] | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

export interface StoreSettings {
  brand_name: string;
  brand_tagline: string;
  brand_description: string;
  logo_url: string;
  logo_white_url: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_handle: string;
  instagram_url: string;
  snapchat_handle: string;
  hero_heading: string;
  hero_description: string;
  featured_collection_visible: boolean;
  currency_code: string;
  currency_symbol: string;
}

export interface CartItem {
  id: string; // unique item key: productId-size-variant
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariant?: string;
}

export interface CustomerDetails {
  name: string;
  contact: string;
  location: string;
  notes?: string;
}
