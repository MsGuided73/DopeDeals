-- Fix brand relationships and populate brands table
-- This script ensures proper brand_id connections between products and brands

-- Step 1: Ensure brands table exists and is populated
INSERT INTO brands_new (name, slug, tier, sort_order)
SELECT DISTINCT
    TRIM("Brands") as name,
    LOWER(REPLACE(TRIM("Brands"), ' ', '-')) as slug,
    CASE
        WHEN TRIM("Brands") IN ('Puffco', 'ROOR', 'GRAV', 'Higher Standards', 'Storz & Bickel', 'Empire Glassworks') THEN 'premium'
        WHEN TRIM("Brands") IN ('RAW', 'Elements', 'Santa Cruz Shredder', 'Pulsar', 'Cookies', 'Crave') THEN 'mid-range'
        ELSE 'budget'
    END as tier,
    ROW_NUMBER() OVER (ORDER BY TRIM("Brands")) as sort_order
FROM enriched_inventory_staging
WHERE "Brands" IS NOT NULL AND "Brands" != '' AND TRIM("Brands") != 'NULL'
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Update main_site_products with proper brand_id references
UPDATE main_site_products
SET brand_id = brands_new.slug
FROM brands_new
WHERE main_site_products.brand_id IS NULL OR main_site_products.brand_id = ''
  AND LOWER(REPLACE(TRIM(main_site_products.brand_id), ' ', '-')) = brands_new.slug;

-- Step 3: Create a mapping function for brand names to brand IDs
CREATE OR REPLACE FUNCTION get_brand_id_from_name(brand_name TEXT)
RETURNS TEXT AS $$
DECLARE
    brand_slug TEXT;
BEGIN
    -- Clean the brand name and create slug
    brand_slug := LOWER(REPLACE(TRIM(COALESCE(brand_name, '')), ' ', '-'));

    -- Return the slug if brand exists, otherwise return the cleaned name
    RETURN COALESCE(
        (SELECT slug FROM brands_new WHERE slug = brand_slug),
        brand_slug,
        'generic'
    );
END;
$$ LANGUAGE plpgsql;

-- Step 4: Update existing products with brand relationships
UPDATE main_site_products
SET brand_id = get_brand_id_from_name(
    CASE
        WHEN brand_id IS NOT NULL AND brand_id != '' THEN brand_id
        ELSE 'Generic'
    END
)
WHERE brand_id IS NULL OR brand_id = '';

-- Step 5: Create brand lookup view for the frontend
CREATE OR REPLACE VIEW brand_lookup_view AS
SELECT
    id,
    name,
    slug,
    tier,
    description,
    logo_url,
    website_url,
    is_active,
    sort_order,
    created_at
FROM brands_new
WHERE is_active = true
ORDER BY
    CASE
        WHEN tier = 'premium' THEN 1
        WHEN tier = 'mid-range' THEN 2
        WHEN tier = 'budget' THEN 3
    END,
    sort_order,
    name;

-- Step 6: Create products with brands view
CREATE OR REPLACE VIEW products_with_brands_view AS
SELECT
    p.*,
    b.name as brand_name,
    b.tier as brand_tier,
    b.logo_url as brand_logo_url
FROM main_site_products p
LEFT JOIN brands_new b ON p.brand_id = b.slug
WHERE p.is_active = true;

-- Step 7: Grant permissions
GRANT SELECT ON brand_lookup_view TO authenticated;
GRANT SELECT ON products_with_brands_view TO authenticated;
GRANT ALL ON brand_lookup_view TO service_role;
GRANT ALL ON products_with_brands_view TO service_role;

-- Step 8: Verification queries
SELECT '=== BRAND RELATIONSHIP SUMMARY ===' as info;
SELECT
    'Brands table' as table_name,
    COUNT(*) as count,
    'Total brands' as description
FROM brands_new
UNION ALL
SELECT
    'Products with brand_id' as table_name,
    COUNT(*) as count,
    'Products linked to brands' as description
FROM main_site_products
WHERE brand_id IS NOT NULL AND brand_id != ''
UNION ALL
SELECT
    'Products without brand_id' as table_name,
    COUNT(*) as count,
    'Products needing brand assignment' as description
FROM main_site_products
WHERE brand_id IS NULL OR brand_id = '';

-- Show brand distribution
SELECT
    '=== BRAND DISTRIBUTION BY TIER ===' as info,
    tier,
    COUNT(*) as brand_count
FROM brands_new
GROUP BY tier
ORDER BY tier;

-- Show top brands by product count
SELECT
    '=== TOP BRANDS BY PRODUCT COUNT ===' as info,
    b.name as brand_name,
    b.tier,
    COUNT(p.id) as product_count
FROM brands_new b
LEFT JOIN main_site_products p ON b.slug = p.brand_id
WHERE p.is_active = true
GROUP BY b.id, b.name, b.tier
ORDER BY product_count DESC
LIMIT 10;
