-- Check current database schema and brand relationships

-- 1. Check if brands_new table exists and has data
SELECT
    '=== BRANDS TABLE STATUS ===' as info,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'brands_new')
         THEN 'EXISTS' ELSE 'MISSING' END as status,
    (SELECT COUNT(*) FROM brands_new) as brand_count;

-- 2. Check main_site_products brand_id usage
SELECT
    '=== MAIN PRODUCTS BRAND_ID USAGE ===' as info,
    COUNT(*) as total_products,
    COUNT(brand_id) as with_brand_id,
    COUNT(CASE WHEN brand_id IS NOT NULL AND brand_id != '' THEN 1 END) as non_empty_brand_id,
    COUNT(DISTINCT brand_id) as unique_brand_ids
FROM main_site_products;

-- 3. Show sample of current brand_id values
SELECT
    '=== SAMPLE BRAND_ID VALUES ===' as info,
    brand_id,
    COUNT(*) as product_count
FROM main_site_products
WHERE brand_id IS NOT NULL AND brand_id != ''
GROUP BY brand_id
ORDER BY product_count DESC
LIMIT 10;

-- 4. Check if brands_new has matching IDs
SELECT
    '=== BRANDS TABLE SAMPLE ===' as info,
    id,
    name,
    slug,
    tier
FROM brands_new
ORDER BY name
LIMIT 10;

-- 5. Check for orphaned brand_id values (in products but not in brands table)
SELECT
    '=== ORPHANED BRAND_IDS ===' as info,
    p.brand_id,
    COUNT(*) as product_count
FROM main_site_products p
LEFT JOIN brands_new b ON p.brand_id = b.slug
WHERE p.brand_id IS NOT NULL AND p.brand_id != ''
  AND b.id IS NULL
GROUP BY p.brand_id
ORDER BY product_count DESC;

-- 6. Show products without brand relationships
SELECT
    '=== PRODUCTS WITHOUT BRANDS ===' as info,
    COUNT(*) as count,
    'Products missing brand_id' as issue
FROM main_site_products
WHERE brand_id IS NULL OR brand_id = '';

-- 7. Check enriched_inventory_staging for brand data
SELECT
    '=== STAGING TABLE BRANDS ===' as info,
    COUNT(DISTINCT "Brands") as unique_brands_in_staging,
    COUNT(CASE WHEN "Brands" IS NOT NULL AND "Brands" != '' THEN 1 END) as products_with_brands
FROM enriched_inventory_staging;
