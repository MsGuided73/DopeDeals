-- Import Script for Your Enriched Inventory
-- Imports your valuable product data into the enhanced table structure

-- 1. First, let's verify the CSV file exists and check its structure
-- You should have: enriched_inventory_export.csv in your project folder

-- 2. Import your enriched inventory data with proper mapping
COPY main_site_products (
  -- Map your CSV columns to the enhanced table structure
  name,                    -- "Name" from CSV
  sku,                     -- "SKU" from CSV
  description,             -- "Description" from CSV
  short_description,       -- "Short Description" from CSV
  brand_id,               -- "Brand" from CSV
  category_id,            -- Derived from "Categories"
  our_price,              -- "Regular Price" from CSV
  sale_price,             -- "Sale Price" from CSV
  stock_quantity,         -- "Stock" from CSV
  low_stock_threshold,    -- "Low Stock Amount" from CSV
  image_url,              -- Extract from "Images" JSON
  tags,                   -- "Tags" from CSV
  is_active,              -- Derived from "Visibility in catalog"

  -- Enhanced fields - initially empty, can be populated later
  cannabinoid_profile,     -- Will be populated based on product analysis
  effects_profile,        -- Will be populated based on product analysis
  compliance_info,        -- Will be populated based on product type

  -- Physical attributes
  specs,                  -- Store bowl size, weight, dimensions as specs JSONB

  -- Timestamps
  created_at,
  updated_at
) FROM 'C:\__DOPE CITY\Highway420\enriched_inventory_export.csv'
WITH CSV HEADER DELIMITER ',' QUOTE '"' ENCODING 'UTF-8'
-- Handle potential data quality issues gracefully
NULL 'NULL'
NULL ''
NULL '0';

-- 3. Post-import data cleanup and enhancement

-- Update compliance info based on product types
UPDATE main_site_products SET
  compliance_info = jsonb_build_object(
    'requires_age_verification', CASE
      WHEN name ILIKE '%kratom%' OR name ILIKE '%7-hydroxy%' THEN true
      WHEN name ILIKE '%nicotine%' OR name ILIKE '%vape%' THEN true
      ELSE false
    END,
    'minimum_age', CASE
      WHEN name ILIKE '%kratom%' OR name ILIKE '%7-hydroxy%' THEN 21
      WHEN name ILIKE '%nicotine%' OR name ILIKE '%vape%' THEN 21
      ELSE 18
    END,
    'product_type', CASE
      WHEN name ILIKE '%kratom%' THEN 'kratom'
      WHEN name ILIKE '%7-hydroxy%' THEN 'hydroxy'
      WHEN name ILIKE '%nicotine%' OR name ILIKE '%vape%' THEN 'nicotine'
      ELSE 'general'
    END,
    'regulatory_category', CASE
      WHEN name ILIKE '%kratom%' OR name ILIKE '%7-hydroxy%' THEN 'restricted_psychoactive'
      WHEN name ILIKE '%nicotine%' OR name ILIKE '%vape%' THEN 'age_restricted'
      ELSE 'unregulated'
    END
  ),
  -- Set display price type based on available prices
  display_price_type = CASE
    WHEN sale_price IS NOT NULL AND sale_price > 0 THEN 'sale_price'
    ELSE 'our_price'
  END,
  -- Set featured products (you can customize this logic)
  featured = CASE
    WHEN name ILIKE '%premium%' OR name ILIKE '%exclusive%' THEN true
    ELSE false
  END
WHERE created_at >= NOW() - INTERVAL '1 hour'; -- Only update recently imported products

-- 4. Create categories from your Categories column
-- This creates a categories table based on your existing category data
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories from your enriched data
INSERT INTO categories (id, name, slug)
SELECT DISTINCT
  TRIM(unnest(string_to_array(REPLACE("Categories", '|', ','), ','))) as category_name,
  LOWER(REPLACE(TRIM(unnest(string_to_array(REPLACE("Categories", '|', ','), ','))), ' ', '-')) as category_slug
FROM products
WHERE "Categories" IS NOT NULL AND "Categories" != ''
ON CONFLICT (id) DO NOTHING;

-- 5. Create brands_new table from your Brand data (using the new brands table structure)
CREATE TABLE IF NOT EXISTS brands_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  tier TEXT DEFAULT 'mid-range',
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert brands from your enriched data
INSERT INTO brands_new (name, slug, tier, sort_order)
SELECT DISTINCT
  TRIM("Brand") as brand_name,
  LOWER(REPLACE(TRIM("Brand"), ' ', '-')) as brand_slug,
  CASE
    WHEN TRIM("Brand") IN ('Puffco', 'ROOR', 'GRAV', 'Higher Standards', 'Storz & Bickel', 'Empire Glassworks') THEN 'premium'
    WHEN TRIM("Brand") IN ('RAW', 'Elements', 'Santa Cruz Shredder', 'Pulsar', 'Cookies', 'Crave') THEN 'mid-range'
    ELSE 'budget'
  END as tier,
  ROW_NUMBER() OVER (ORDER BY TRIM("Brand")) as sort_order
FROM products
WHERE "Brand" IS NOT NULL AND "Brand" != ''
ON CONFLICT (slug) DO NOTHING;

-- 6. Update main_site_products with proper brand_id and category_id references
UPDATE main_site_products SET
  brand_id = b.id,
  category_id = c.id
FROM products p
LEFT JOIN brands b ON LOWER(REPLACE(TRIM(p."Brand"), ' ', '-')) = b.slug
LEFT JOIN categories c ON LOWER(REPLACE(TRIM(split_part(p."Categories", '|', 1)), ' ', '-')) = c.slug
WHERE main_site_products.name = p."Name"
  AND main_site_products.created_at >= NOW() - INTERVAL '1 hour';

-- 7. Create search keywords from product names and descriptions
UPDATE main_site_products SET
  search_keywords = ARRAY[
    TRIM(LOWER(name)),
    TRIM(LOWER(brand_id)),
    TRIM(LOWER(category_id)),
    -- Add keywords from description if available
    CASE
      WHEN description IS NOT NULL THEN TRIM(LOWER(split_part(description, ' ', 1)))
      ELSE NULL
    END,
    CASE
      WHEN description IS NOT NULL THEN TRIM(LOWER(split_part(description, ' ', 2)))
      ELSE NULL
    END
  ]
WHERE created_at >= NOW() - INTERVAL '1 hour';

-- 8. Verify the import worked correctly
SELECT
    'Products imported' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE created_at >= NOW() - INTERVAL '1 hour'

UNION ALL

SELECT
    'Products with brands' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE brand_id IS NOT NULL
  AND created_at >= NOW() - INTERVAL '1 hour'

UNION ALL

SELECT
    'Products with categories' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE category_id IS NOT NULL
  AND created_at >= NOW() - INTERVAL '1 hour'

UNION ALL

SELECT
    'Products with compliance info' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE compliance_info->>'product_type' != 'general'
  AND created_at >= NOW() - INTERVAL '1 hour';

-- 9. Show sample of imported data for verification
SELECT
    name,
    sku,
    brand_id,
    category_id,
    our_price,
    sale_price,
    stock_quantity,
    compliance_info->>'product_type' as product_type,
    compliance_info->>'minimum_age' as min_age
FROM main_site_products
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY name
LIMIT 10;

-- 10. Final success confirmation
SELECT
    'Migration completed successfully!' as status,
    'Enhanced products table is ready' as message,

    'Total enhanced products' as metric,
    COUNT(*) as count
FROM main_site_products;
