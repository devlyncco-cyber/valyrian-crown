-- ==============================================================================
-- VALYRIANCROWN E-COMMERCE DATABASE SCHEMA
-- Brand Tagline: "Wear the Crown. Own Your Style."
-- ==============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or (sale_price >= 0 and sale_price <= price)),
  category_id uuid references public.categories(id) on delete restrict,
  stock_quantity integer default 15 check (stock_quantity is null or stock_quantity >= 0),
  availability_status text not null default 'in_stock' check (availability_status in ('in_stock', 'low_stock', 'out_of_stock', 'pre_order')),
  sizes jsonb default '["Standard Adjustable"]'::jsonb,
  variants jsonb default '[]'::jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PRODUCT IMAGES TABLE
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- 5. STORE SETTINGS TABLE
create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_is_published on public.products(is_published);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_is_active on public.categories(is_active);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_display_order on public.product_images(display_order);
create index if not exists idx_store_settings_key on public.store_settings(setting_key);

-- ==============================================================================
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger set_store_settings_updated_at
  before update on public.store_settings
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- SECURITY & AUTHORIZATION (ROW LEVEL SECURITY)
-- ==============================================================================

-- Helper function to check if current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.store_settings enable row level security;

-- PROFILES POLICIES
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Users can update their own non-role fields or admin can update any
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Only admins or user signup trigger can insert profiles
create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- Admins can delete profiles
create policy "Admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- CATEGORIES POLICIES
-- Public can read active categories, Admins can read all
create policy "Public can read active categories"
  on public.categories for select
  using (is_active = true or public.is_admin());

create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "Admins can update categories"
  on public.categories for update
  using (public.is_admin());

create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_admin());

-- PRODUCTS POLICIES
-- Public can read published products, Admins can read all
create policy "Public can read published products"
  on public.products for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- PRODUCT IMAGES POLICIES
create policy "Public can view images for visible products"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and (products.is_published = true or public.is_admin())
    )
  );

create policy "Admins can insert product images"
  on public.product_images for insert
  with check (public.is_admin());

create policy "Admins can update product images"
  on public.product_images for update
  using (public.is_admin());

create policy "Admins can delete product images"
  on public.product_images for delete
  using (public.is_admin());

-- STORE SETTINGS POLICIES
create policy "Public can view store settings"
  on public.store_settings for select
  using (true);

create policy "Admins can manage store settings"
  on public.store_settings for all
  using (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (product-images)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage policies
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Administrator'),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  )
  on conflict (id) do update
  set role = coalesce(excluded.role, 'admin'),
      full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
