-- Check current database state for Highway420
-- This will help us understand what's built and what needs to be done

-- 1. Check brands_new table (current brands)
SELECT
  COUNT(*) as total_brands,
  COUNT(DISTINCT name) as unique_brand_names
FROM brands_new;

-- Show sample brands
SELECT id, name, description, logo_url, website_url
FROM brands_new
ORDER BY name
LIMIT 10;

-- 2. Check categories table
SELECT
  COUNT(*) as total_categories,
  COUNT(DISTINCT name) as unique_category_names
FROM categories;

-- Show existing categories
SELECT id, name, description
FROM categories
ORDER BY name;

-- 3. Check main_site_products structure and counts
SELECT
  COUNT(*) as total_products,
  COUNT(DISTINCT brand_id) as products_with_brand_id,
  COUNT(DISTINCT category_id) as products_with_category_id
FROM main_site_products
WHERE is_active = true;

-- 4. Analyze product types that need pages
WITH product_analysis AS (
  SELECT
    name,
    description,
    CASE
      WHEN name ILIKE '%thca%' OR description ILIKE '%thca%' THEN 'THCA'
      WHEN name ILIKE '%vape%' OR description ILIKE '%vape%' THEN 'Vapes'
      WHEN name ILIKE '%preroll%' OR name ILIKE '%pre-roll%' THEN 'Prerolls'
      WHEN name ILIKE '%concentrate%' OR name ILIKE '%rosin%' OR name ILIKE '%resin%' OR name ILIKE '%wax%' OR name ILIKE '%shatter%' THEN 'Concentrates'
      WHEN name ILIKE '%gumm%' OR name ILIKE '%edible%' THEN 'Edibles'
      WHEN name ILIKE '%dab rig%' OR name ILIKE '%oil rig%' THEN 'Dab Rigs'
      ELSE 'Other'
    END as product_type
  FROM main_site_products
  WHERE is_active = true
)
SELECT
  product_type,
  COUNT(*) as product_count
FROM product_analysis
WHERE product_type != 'Other'
GROUP BY product_type
ORDER BY product_count DESC;

-- 5. Check for enhanced JSONB fields
SELECT
  id,
  name,
  brand_id,
  category_id,
  CASE WHEN brands_jsonb IS NOT NULL THEN 'Has brands_jsonb' ELSE 'No brands_jsonb' END as brands_jsonb_status,
  CASE WHEN categories_jsonb IS NOT NULL THEN 'Has categories_jsonb' ELSE 'No categories_jsonb' END as categories_jsonb_status,
  CASE WHEN compliance_data IS NOT NULL THEN 'Has compliance_data' ELSE 'No compliance_data' END as compliance_status
FROM main_site_products
WHERE is_active = true
LIMIT 10;

-- 6. Check legacy tables that might need deprecation
SELECT
  schemaname,
  tablename,
  n_tup_ins as estimated_rows
FROM pg_stat_user_tables
WHERE tablename LIKE '%brand%' OR tablename LIKE '%product%' OR tablename LIKE '%categor%'
ORDER BY tablename;
