-- Link brand_id to brands_new table
-- This script matches brand_slug to brands_new.slug and populates brand_id

-- Step 1: Update brand_id by matching brand_slug to brands_new.slug
UPDATE main_site_products
SET brand_id = brands_new.id
FROM brands_new
WHERE main_site_products.brand_slug IS NOT NULL
  AND main_site_products.brand_slug != ''
  AND main_site_products.brand_slug = brands_new.slug;

-- Step 2: Handle cases where brand_slug doesn't match exactly
-- Try case-insensitive matching
UPDATE main_site_products
SET brand_id = brands_new.id
FROM brands_new
WHERE main_site_products.brand_id IS NULL
  AND main_site_products.brand_slug IS NOT NULL
  AND main_site_products.brand_slug != ''
  AND LOWER(main_site_products.brand_slug) = LOWER(brands_new.slug);

-- Step 3: Handle special cases and common variations
UPDATE main_site_products
SET brand_id = brands_new.id
FROM brands_new
WHERE main_site_products.brand_id IS NULL
  AND main_site_products.brand_slug IS NOT NULL
  AND main_site_products.brand_slug != ''
  AND (
    -- Handle common brand name variations
    (main_site_products.brand_slug = 'puff-co' AND brands_new.slug = 'puffco') OR
    (main_site_products.brand_slug = 'grav-labs' AND brands_new.slug = 'grav') OR
    (main_site_products.brand_slug = 'empire-glass' AND brands_new.slug = 'empire-glassworks') OR
    -- Add more variations as needed
    (main_site_products.brand_slug = 'storz-bickel' AND brands_new.slug = 'storz-bickel') OR
    (main_site_products.brand_slug = 'higher-standards' AND brands_new.slug = 'higher-standards')
  );

-- Step 4: Create a function to find best brand matches
CREATE OR REPLACE FUNCTION find_best_brand_match(product_brand_slug TEXT)
RETURNS UUID AS $$
DECLARE
    best_match_id UUID;
    direct_match UUID;
    case_insensitive_match UUID;
BEGIN
    -- Try direct match first
    SELECT id INTO direct_match
    FROM brands_new
    WHERE slug = product_brand_slug;

    IF direct_match IS NOT NULL THEN
        RETURN direct_match;
    END IF;

    -- Try case insensitive match
    SELECT id INTO case_insensitive_match
    FROM brands_new
    WHERE LOWER(slug) = LOWER(product_brand_slug);

    IF case_insensitive_match IS NOT NULL THEN
        RETURN case_insensitive_match;
    END IF;

    -- Try partial matches for common variations
    SELECT id INTO best_match_id
    FROM brands_new
    WHERE LOWER(slug) LIKE '%' || LOWER(product_brand_slug) || '%'
       OR LOWER(product_brand_slug) LIKE '%' || LOWER(slug) || '%'
    ORDER BY
        CASE
            WHEN slug = product_brand_slug THEN 1
            WHEN LOWER(slug) = LOWER(product_brand_slug) THEN 2
            ELSE 3
        END,
        LENGTH(slug)
    LIMIT 1;

    RETURN best_match_id;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Apply the matching function to remaining unmatched products
UPDATE main_site_products
SET brand_id = find_best_brand_match(brand_slug)
WHERE brand_id IS NULL
  AND brand_slug IS NOT NULL
  AND brand_slug != '';

-- Step 6: Create a view to check linking results
CREATE OR REPLACE VIEW brand_linking_results AS
SELECT
    'Total products' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE brand_name IS NOT NULL AND brand_name != ''
UNION ALL
SELECT
    'Products with brand_id linked' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE brand_id IS NOT NULL AND brand_id != ''
UNION ALL
SELECT
    'Products without brand_id' as metric,
    COUNT(*) as count
FROM main_site_products
WHERE brand_id IS NULL OR brand_id = ''
UNION ALL
SELECT
    'Unique brands in products' as metric,
    COUNT(DISTINCT brand_slug) as count
FROM main_site_products
WHERE brand_slug IS NOT NULL AND brand_slug != ''
UNION ALL
SELECT
    'Matched brands in brands_new' as metric,
    COUNT(DISTINCT brand_slug) as count
FROM brands_new
WHERE slug IN (SELECT DISTINCT brand_slug FROM main_site_products WHERE brand_slug IS NOT NULL);

-- Step 7: Show detailed linking results
SELECT
    '=== BRAND LINKING SUMMARY ===' as info,
    metric,
    count
FROM brand_linking_results;

-- Show unmatched products for manual review
SELECT
    '=== PRODUCTS NEEDING MANUAL BRAND LINKING ===' as info,
    name as product_name,
    brand_name,
    brand_slug,
    'Needs manual brand_id assignment' as status
FROM main_site_products
WHERE brand_id IS NULL OR brand_id = ''
  AND brand_slug IS NOT NULL AND brand_slug != ''
ORDER BY brand_slug, name
LIMIT 20;

-- Show successful matches
SELECT
    '=== SUCCESSFUL BRAND MATCHES ===' as info,
    p.brand_name,
    p.brand_slug,
    b.name as matched_brand_name,
    b.tier,
    COUNT(*) as product_count
FROM main_site_products p
JOIN brands_new b ON p.brand_id = b.id
WHERE p.brand_id IS NOT NULL AND p.brand_id != ''
GROUP BY p.brand_name, p.brand_slug, b.name, b.tier
ORDER BY product_count DESC, p.brand_name
LIMIT 15;

-- Step 8: Grant permissions
GRANT SELECT ON brand_linking_results TO authenticated;
GRANT ALL ON brand_linking_results TO service_role;
