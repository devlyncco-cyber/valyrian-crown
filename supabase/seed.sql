-- ==============================================================================
-- VALYRIANCROWN SEED DATA
-- Default Store Settings, Categories, Products and Image Mappings
-- ==============================================================================

-- 1. STORE SETTINGS
insert into public.store_settings (setting_key, setting_value) values
('brand_name', '"ValyrianCrown"'::jsonb),
('brand_tagline', '"Wear the Crown. Own Your Style."'::jsonb),
('brand_description', '"ValyrianCrown is more than a headwear brand; it''s a statement of identity, confidence, and personal style. We bring together style, comfort, and individuality through carefully selected caps designed to complement everyday looks."'::jsonb),
('logo_url', '"/images/brand/logo-dark.png"'::jsonb),
('logo_white_url', '"/images/brand/logo-white.png"'::jsonb),
('contact_phone', '"0554381898"'::jsonb),
('whatsapp_number', '"233509758180"'::jsonb),
('instagram_handle', '"@valyriancrown._"'::jsonb),
('instagram_url', '"https://instagram.com/valyriancrown._"'::jsonb),
('snapchat_handle', '"lebenam.mm"'::jsonb),
('hero_heading', '"Wear the Crown. Own Your Style."'::jsonb),
('hero_description', '"Discover headwear that speaks your style. Confidence starts at the crown."'::jsonb),
('featured_collection_visible', 'true'::jsonb),
('currency_code', '"GHS"'::jsonb),
('currency_symbol', '"GH₵"'::jsonb)
on conflict (setting_key) do update set setting_value = excluded.setting_value;

-- 2. CATEGORIES
insert into public.categories (id, name, slug, description, is_active) values
('c1000000-0000-0000-0000-000000000001', 'Signature Streetwear', 'signature-streetwear', 'Statement caps with bold patches, graphics and expressive streetwear embroidery.', true),
('c1000000-0000-0000-0000-000000000002', 'Minimalist & Athletic', 'minimalist-athletic', 'Clean profiles, technical trims, and everyday court and studio essentials.', true),
('c1000000-0000-0000-0000-000000000003', 'Vintage & Washed', 'vintage-washed', 'Mineral washed twill, corduroy textures and retro dad caps with character.', true),
('c1000000-0000-0000-0000-000000000004', 'Statement & Pop', 'statement-pop', 'Vibrant colorways, pastel palettes and uplifting embroidery to stand out from the crowd.', true)
on conflict (slug) do nothing;

-- 3. PRODUCTS & PRODUCT IMAGES
-- Product 1: "YOU" Smiley Embroidered Dad Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000001',
  'YOU Smiley Embroidered Dad Cap',
  'you-smiley-embroidered-dad-cap',
  'Playful pastel pink cotton dad cap with signature high-density YOU smiley embroidery.',
  'Wear positivity and confidence wherever you step. Crafted from premium breathable washed cotton with custom dual-tone yellow and black smiley embroidery. Features an adjustable strap with metal clasp for a tailored fit.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  18,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Pastel Pink"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000001', '/images/products/cap-1.jpg', 'YOU Smiley Embroidered Dad Cap in Pastel Pink', 0, true),
('d1000000-0000-0000-0000-000000000001', '/images/original/crown-1.jpg', 'YOU Smiley Embroidered Dad Cap ValyrianCrown Promo Card', 1, false)
on conflict do nothing;

-- Product 2: Studio Geometric '10' Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000002',
  'Studio Geometric 10 Cap',
  'studio-geometric-10-cap',
  'Sleek deep navy structured cap with modern geometric 10 side-panel insignia.',
  'Understated modernism meets streetwear elegance. Engineered from structured poly-cotton blend with reinforced eyelets and subtle white side-panel monogram.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000002',
  14,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Deep Navy"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000002', '/images/products/cap-2.jpg', 'Studio Geometric 10 Cap in Deep Navy', 0, true),
('d1000000-0000-0000-0000-000000000002', '/images/original/crown-2.jpg', 'Studio Geometric 10 Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 3: Court Trim Athletic Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000003',
  'Court Trim Athletic Cap',
  'court-trim-athletic-cap',
  'Vibrant cobalt royal blue cap featuring contrast white sandwich visor piping.',
  'Designed for dynamic movement and sharp everyday style. Premium twill crown with clean lines and contrast white visor edge detail.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000002',
  16,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Royal Cobalt Blue"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000003', '/images/products/cap-3.jpg', 'Court Trim Athletic Cap in Royal Blue', 0, true),
('d1000000-0000-0000-0000-000000000003', '/images/original/crown-3.jpg', 'Court Trim Athletic Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 4: Heritage 'C' Monogram Twill Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000004',
  'Heritage C Monogram Twill Cap',
  'heritage-c-monogram-twill-cap',
  'Earthy olive green twill cap featuring clean white collegiate C monogram.',
  'An effortlessly timeless staple. Rich military olive brushed cotton with clean white embroidery, pre-curved visor, and adjustable strap.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000001',
  20,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Olive Green"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000004', '/images/products/cap-4.jpg', 'Heritage C Monogram Twill Cap in Olive Green', 0, true),
('d1000000-0000-0000-0000-000000000004', '/images/original/crown-4.jpg', 'Heritage C Monogram Twill Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 5: SWAGGA Kangaroo Badge Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000005',
  'SWAGGA Kangaroo Badge Cap',
  'swagga-kangaroo-badge-cap',
  'Distinctive royal purple streetwear cap with signature embroidered kangaroo emblem.',
  'Bold color meets streetwear swagger. Deep purple premium cotton twill with high-density embroidered kangaroo badge and golden typography.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000001',
  12,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Royal Purple"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000005', '/images/products/cap-5.jpg', 'SWAGGA Kangaroo Badge Cap in Royal Purple', 0, true),
('d1000000-0000-0000-0000-000000000005', '/images/original/crown-5.jpg', 'SWAGGA Kangaroo Badge Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 6: Linear Contour Contour Embroidered Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000006',
  'Linear Contour Swoosh Cap',
  'linear-contour-swoosh-cap',
  'Classic midnight navy dad cap with minimalist linear contour outline embroidery.',
  'A classic silhouette refined with pure minimalism. Midnight navy fabric with contrast white outline embroidery.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000002',
  15,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Midnight Navy"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000006', '/images/products/cap-6.jpg', 'Linear Contour Swoosh Cap in Midnight Navy', 0, true),
('d1000000-0000-0000-0000-000000000006', '/images/original/crown-6.jpg', 'Linear Contour Swoosh Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 7: Vintage Pinstripe Varsity 'A' Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000007',
  'Vintage Pinstripe Varsity A Cap',
  'vintage-pinstripe-varsity-a-cap',
  'Heritage grey and white pinstripe baseball cap with 3D varsity letter A felt patch.',
  'Classic ballpark heritage re-imagined for modern streetwear. Fine vertical grey-and-white pinstripe woven cotton crowned with a 3D embroidered lettermark.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  10,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Grey Pinstripe"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000007', '/images/products/cap-7.jpg', 'Vintage Pinstripe Varsity A Cap', 0, true),
('d1000000-0000-0000-0000-000000000007', '/images/original/crown-7.jpg', 'Vintage Pinstripe Varsity A Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 8: Washed Slate "mad" Oval Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000008',
  'Washed Slate mad Oval Cap',
  'washed-slate-mad-oval-cap',
  'Vintage garment-dyed slate navy cap with clean oval mad typography patch.',
  'Soft hand-feel washed twill with that relaxed, lived-in aesthetic. Contrast white oval insignia on faded slate navy.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  15,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Washed Slate Navy"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000008', '/images/products/cap-8.jpg', 'Washed Slate mad Oval Cap', 0, true),
('d1000000-0000-0000-0000-000000000008', '/images/original/crown-8.jpg', 'Washed Slate mad Oval Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 9: Street Art Line Canine Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000009',
  'Street Art Canine Line Cap',
  'street-art-canine-line-cap',
  'Pastel lilac lavender cap featuring iconic continuous line-art canine embroidery.',
  'An artistic touch for your daily rotation. Subtle lilac lavender brushed cotton with crisp black pop-art embroidery.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  14,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Lilac Lavender"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000009', '/images/products/cap-9.jpg', 'Street Art Canine Line Cap in Lilac', 0, true),
('d1000000-0000-0000-0000-000000000009', '/images/original/crown-9.jpg', 'Street Art Canine Line Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 10: Persecole Retro Script 3D Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000010',
  'Persecole Retro Script 3D Cap',
  'persecole-retro-script-3d-cap',
  'Faded terracotta rose vintage dad cap with raised 3D cursive script embroidery.',
  'Vintage warmth and rich texture. Garment-washed terracotta rose tone with bold 3D puff embroidery across the front crown.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  16,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Faded Terracotta Rose"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000010', '/images/products/cap-10.jpg', 'Persecole Retro Script 3D Cap', 0, true),
('d1000000-0000-0000-0000-000000000010', '/images/original/crown-10.jpg', 'Persecole Retro Script 3D Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 11: KAIRUI Minimalist Technical Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000011',
  'KAIRUI Minimalist Technical Cap',
  'kairui-minimalist-technical-cap',
  'Monochrome desert sand khaki cap with understated tone-on-tone side insignia.',
  'Sleek technical streetwear aesthetics. Built from lightweight, breathable water-resistant twill in neutral sand khaki with tonal branding.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000002',
  20,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Sand Khaki"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000011', '/images/products/cap-11.jpg', 'KAIRUI Minimalist Technical Cap in Sand', 0, true),
('d1000000-0000-0000-0000-000000000011', '/images/original/crown-11.jpg', 'KAIRUI Minimalist Technical Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 12: Heritage Bear Diamond Patch Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000012',
  'Heritage Bear Diamond Patch Cap',
  'heritage-bear-diamond-patch-cap',
  'Bold royal blue cap featuring a classic outdoor expedition diamond bear patch.',
  'Adventure meets city streetwear. Royal blue twill with vintage diamond embroidered patch featuring black, red and gold details.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000001',
  12,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Classic Royal Blue"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000012', '/images/products/cap-12.jpg', 'Heritage Bear Diamond Patch Cap', 0, true),
('d1000000-0000-0000-0000-000000000012', '/images/original/crown-12.jpg', 'Heritage Bear Diamond Patch Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 13: Neon Pop Monochrome Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000013',
  'Neon Pop Monochrome Cap',
  'neon-pop-monochrome-cap',
  'High-impact vibrant magenta pink cap designed to command attention.',
  'Unapologetic energy. Rich saturated magenta cotton twill with seamless construction, tone-on-tone stitching, and curved brim.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  15,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Vibrant Magenta Pink"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000013', '/images/products/cap-13.jpg', 'Neon Pop Monochrome Cap in Magenta', 0, true),
('d1000000-0000-0000-0000-000000000013', '/images/original/crown-13.jpg', 'Neon Pop Monochrome Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 14: NYC Metallic Gold Embroidered Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000014',
  'NYC Metallic Gold Embroidered Cap',
  'nyc-metallic-gold-embroidered-cap',
  'Deep midnight navy cap with high-contrast metallic gold NYC serif typography.',
  'Urban elegance defined. Midnight navy heavyweight cotton twill crowned with crisp metallic gold embroidery.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000001',
  22,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Midnight Navy / Gold"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000014', '/images/products/cap-14.jpg', 'NYC Metallic Gold Embroidered Cap in Midnight Navy', 0, true),
('d1000000-0000-0000-0000-000000000014', '/images/original/crown-14.jpg', 'NYC Metallic Gold Embroidered Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 15: Varsity Green N Breathable Trucker Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000015',
  'Varsity Green N Breathable Trucker Cap',
  'varsity-green-n-breathable-trucker-cap',
  'Cream mesh-back trucker cap with forest green collegiate N embroidery.',
  'Cool breathability meets collegiate cool. Features premium cream foam front panel, airy mesh back, and forest green varsity letter.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  18,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Cream / Forest Green"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000015', '/images/products/cap-15.jpg', 'Varsity Green N Breathable Trucker Cap', 0, true),
('d1000000-0000-0000-0000-000000000015', '/images/original/crown-15.jpg', 'Varsity Green N Breathable Trucker Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 16: Signature Structured Burgundy Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000016',
  'Signature Structured Burgundy Cap',
  'signature-structured-burgundy-cap',
  'Rich burgundy wine structured crown cap with subtle tone-on-tone detailing.',
  'Deep luxury tones for high-end streetwear styling. Rich burgundy crimson shade with structured 6-panel fit.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000002',
  17,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Burgundy Wine"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000016', '/images/products/cap-16.jpg', 'Signature Structured Burgundy Cap', 0, true),
('d1000000-0000-0000-0000-000000000016', '/images/original/crown-16.jpg', 'Signature Structured Burgundy Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 17: Corduroy Ivory odin Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000017',
  'Corduroy Ivory odin Cap',
  'corduroy-ivory-odin-cap',
  'Tactile soft ribbed corduroy cap in warm ivory with rust brown odin embroidery.',
  'Elevated texture and cozy luxury. Fine-wale ribbed corduroy in warm ivory off-white, embroidered with earth-toned typography.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  14,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Warm Ivory Corduroy"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000017', '/images/products/cap-17.jpg', 'Corduroy Ivory odin Cap', 0, true),
('d1000000-0000-0000-0000-000000000017', '/images/original/crown-17.jpg', 'Corduroy Ivory odin Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 18: EMIS High-Contrast Typography Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000018',
  'EMIS High-Contrast Typography Cap',
  'emis-high-contrast-typography-cap',
  'Electric royal blue cap with crisp embroidered EMIS block logo and underline.',
  'Sharp, bold streetwear typography. Electric royal blue twill paired with immaculate white embroidery.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000001',
  15,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Electric Royal Blue"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000018', '/images/products/cap-18.jpg', 'EMIS High-Contrast Typography Cap', 0, true),
('d1000000-0000-0000-0000-000000000018', '/images/original/crown-18.jpg', 'EMIS High-Contrast Typography Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 19: UNWOUND Cafe Vintage Seal Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000019',
  'UNWOUND Cafe Vintage Seal Cap',
  'unwound-cafe-vintage-seal-cap',
  'Mineral washed vintage indigo dad cap with circular d/p artisanal coffee seal embroidery.',
  'Laid-back cafe culture meets refined streetwear. Garment-washed faded indigo shade with authentic distress stitching.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  11,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Vintage Washed Indigo"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000019', '/images/products/cap-19.jpg', 'UNWOUND Cafe Vintage Seal Cap', 0, true),
('d1000000-0000-0000-0000-000000000019', '/images/original/crown-19.jpg', 'UNWOUND Cafe Vintage Seal Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 20: Mineral Washed Distressed Acid Cap
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000020',
  'Mineral Washed Distressed Acid Cap',
  'mineral-washed-distressed-acid-cap',
  'Vintage acid-washed charcoal grey dad cap with soft broken-in patina.',
  'The quintessential distressed streetwear piece. Mineral washed charcoal grey with subtle edge fading and custom relaxed crown.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000003',
  19,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Acid Wash Charcoal"]}]'::jsonb,
  true,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000020', '/images/products/cap-20.jpg', 'Mineral Washed Distressed Acid Cap in Charcoal', 0, true),
('d1000000-0000-0000-0000-000000000020', '/images/original/crown-20.jpg', 'Mineral Washed Distressed Acid Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 21: Botanical Palm Leaf Stone Cap (crown 22)
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000021',
  'Botanical Palm Leaf Stone Cap',
  'botanical-palm-leaf-stone-cap',
  'Sandstone beige dad cap with clean black embroidered palm silhouette emblem.',
  'Tropical minimalism in earthy neutral tones. Clean sand twill accented by a sharp black botanical leaf embroidery.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  16,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Desert Sand Stone"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000021', '/images/products/cap-22.jpg', 'Botanical Palm Leaf Stone Cap', 0, true),
('d1000000-0000-0000-0000-000000000021', '/images/original/crown-22.jpg', 'Botanical Palm Leaf Stone Cap Promo Card', 1, false)
on conflict do nothing;

-- Product 22: Tonal Blush Rose Minimalist Cap (crown 23)
insert into public.products (id, name, slug, short_description, description, price, sale_price, category_id, stock_quantity, availability_status, sizes, variants, is_featured, is_published)
values (
  'd1000000-0000-0000-0000-000000000022',
  'Tonal Blush Rose Minimalist Cap',
  'tonal-blush-rose-minimalist-cap',
  'Soft blush rose cap with delicate tone-on-tone embroidered circular emblem.',
  'Quiet confidence in a soft pastel palette. Tone-on-tone embroidery provides understated character that effortlessly fits into any casual outfit.',
  45.00,
  null,
  'c1000000-0000-0000-0000-000000000004',
  13,
  'in_stock',
  '["Standard Adjustable"]'::jsonb,
  '[{"name": "Color", "options": ["Soft Blush Rose"]}]'::jsonb,
  false,
  true
) on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary) values
('d1000000-0000-0000-0000-000000000022', '/images/products/cap-23.jpg', 'Tonal Blush Rose Minimalist Cap', 0, true),
('d1000000-0000-0000-0000-000000000022', '/images/original/crown-23.jpg', 'Tonal Blush Rose Minimalist Cap Promo Card', 1, false)
on conflict do nothing;

-- ==============================================================================
-- INSTRUCTIONS FOR INITIAL ADMIN CREATION:
-- Run this in the Supabase SQL editor after creating the user in Supabase Auth:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = '<AUTH_USER_UUID>';
--
-- Or insert directly if auth user already exists:
-- INSERT INTO public.profiles (id, full_name, role)
-- VALUES ('<AUTH_USER_UUID>', 'ValyrianCrown Owner', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
-- ==============================================================================
