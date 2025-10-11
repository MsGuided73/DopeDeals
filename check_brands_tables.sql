-- Check existing brands tables and their structure

-- Check what brands tables exist
SELECT
    '=== BRANDS TABLES IN DATABASE ===' as info,
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename LIKE '%brand%'
ORDER BY tablename;

-- Check brands table structure (varchar id)
SELECT
    '=== BRANDS TABLE (VARCHAR ID) ===' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'brands'
ORDER BY ordinal_position;

-- Check brands_new table structure (uuid id)
SELECT
    '=== BRANDS_NEW TABLE (UUID ID) ===' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'brands_new'
ORDER BY ordinal_position;

-- Check current brands data
SELECT
    '=== SAMPLE BRANDS DATA ===' as info,
    COUNT(*) as total_brands,
    'Brands table' as source
FROM brands
UNION ALL
SELECT COUNT(*) as total_brands, 'Brands_new table' as source FROM brands_new;

-- Show sample from brands table
SELECT
    '=== SAMPLE FROM BRANDS TABLE ===' as info,
    id,
    name,
    'varchar table' as source
FROM brands
LIMIT 5;

-- Show sample from brands_new table
SELECT
    '=== SAMPLE FROM BRANDS_NEW TABLE ===' as info,
    id,
    name,
    slug,
    tier,
    'uuid table' as source
FROM brands_new
LIMIT 5;

-- Check current main_site_products brand_id values
SELECT
    '=== CURRENT BRAND_ID USAGE ===' as info,
    brand_id,
    COUNT(*) as product_count
FROM main_site_products
WHERE brand_id IS NOT NULL AND brand_id != ''
GROUP BY brand_id
ORDER BY product_count DESC
LIMIT 10;
