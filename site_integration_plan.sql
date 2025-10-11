-- Site Integration Plan - Connect database to frontend
-- This script creates the necessary views and functions for site integration

-- Step 1: Create comprehensive product view for frontend
CREATE OR REPLACE VIEW frontend_products_view AS
SELECT
    p.id,
    p.name,
    p.sku,
    p.description,
    p.short_description,
    p.our_price,
    p.sale_price,
    p.fire_price,
    get_display_price(p) as display_price,
    p.display_price_type,
    p.image_url,
    p.image_urls,
    p.stock_quantity,
    p.inventory_status,
    p.is_active,
    p.featured,
    p.is_new,
    p.is_bestseller,
    p.is_trending,
    p.tags,
    p.search_keywords,

    -- Brand information
    b.name as brand_name,
    b.slug as brand_slug,
    b.tier as brand_tier,
    b.logo_url as brand_logo_url,

    -- Category information (placeholder for now)
    p.category_id as category_slug,
    'General' as category_name,

    -- Cannabinoid information
    (p.cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal as thc_percentage,
    (p.cannabinoid_profile->'other_cannabinoids'->>'cbd')::decimal as cbd_percentage,
    p.cannabinoid_profile->>'dominant_cannabinoid' as dominant_cannabinoid,
    p.cannabinoid_profile->>'profile_type' as profile_type,

    -- Effects information
    p.effects_profile->'primary_effects' as primary_effects,
    p.effects_profile->'secondary_effects' as secondary_effects,
    p.effects_profile->'medicinal_benefits' as medicinal_benefits,

    -- Compliance information
    (p.compliance_info->>'requires_age_verification')::boolean as requires_age_verification,
    (p.compliance_info->>'minimum_age')::integer as minimum_age,
    p.compliance_info->>'product_type' as product_type,
    p.compliance_info->>'regulatory_category' as regulatory_category,

    -- Timestamps
    p.created_at,
    p.updated_at

FROM main_site_products p
LEFT JOIN brands_new b ON p.brand_id = b.slug
WHERE p.is_active = true
  AND p.farm_bill_compliant = true
  AND p.thc_compliant = true;

-- Step 2: Create search function for frontend
CREATE OR REPLACE FUNCTION search_products_frontend(
    search_query TEXT DEFAULT NULL,
    category_slug TEXT DEFAULT NULL,
    brand_slug TEXT DEFAULT NULL,
    min_price DECIMAL(10,2) DEFAULT NULL,
    max_price DECIMAL(10,2) DEFAULT NULL,
    in_stock_only BOOLEAN DEFAULT false,
    featured_only BOOLEAN DEFAULT false,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    display_price DECIMAL(10,2),
    image_url TEXT,
    brand_name TEXT,
    category_name TEXT,
    thc_percentage DECIMAL(5,2),
    cbd_percentage DECIMAL(5,2),
    primary_effects TEXT[],
    is_featured BOOLEAN,
    is_new BOOLEAN,
    is_bestseller BOOLEAN,
    inventory_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fp.id,
        fp.name,
        fp.display_price,
        fp.image_url,
        fp.brand_name,
        fp.category_name,
        fp.thc_percentage,
        fp.cbd_percentage,
        fp.primary_effects,
        fp.featured,
        fp.is_new,
        fp.is_bestseller,
        fp.inventory_status
    FROM frontend_products_view fp
    WHERE (search_query IS NULL OR
           fp.name ILIKE '%' || search_query || '%' OR
           fp.description ILIKE '%' || search_query || '%' OR
           fp.short_description ILIKE '%' || search_query || '%' OR
           fp.brand_name ILIKE '%' || search_query || '%' OR
           array_to_string(fp.tags, ' ') ILIKE '%' || search_query || '%')
    AND (category_slug IS NULL OR fp.category_slug = category_slug)
    AND (brand_slug IS NULL OR fp.brand_slug = brand_slug)
    AND (min_price IS NULL OR fp.display_price >= min_price)
    AND (max_price IS NULL OR fp.display_price <= max_price)
    AND (NOT in_stock_only OR fp.stock_quantity > 0)
    AND (NOT featured_only OR fp.featured = true)
    ORDER BY
        CASE WHEN featured_only THEN fp.featured END DESC,
        CASE WHEN search_query IS NOT NULL THEN
            ts_rank(
                to_tsvector('english',
                    fp.name || ' ' ||
                    COALESCE(fp.description, '') || ' ' ||
                    COALESCE(fp.short_description, '') || ' ' ||
                    COALESCE(fp.brand_name, '')
                ),
                plainto_tsquery('english', search_query)
            )
        ELSE 0 END DESC,
        fp.is_bestseller DESC,
        fp.is_new DESC,
        fp.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 3: Create function to get product details
CREATE OR REPLACE FUNCTION get_product_details(product_id UUID)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    short_description TEXT,
    sku TEXT,
    display_price DECIMAL(10,2),
    our_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    fire_price DECIMAL(10,2),
    image_url TEXT,
    image_urls TEXT[],
    stock_quantity INTEGER,
    inventory_status TEXT,
    brand_name TEXT,
    brand_slug TEXT,
    brand_tier TEXT,
    category_name TEXT,
    category_slug TEXT,
    thc_percentage DECIMAL(5,2),
    cbd_percentage DECIMAL(5,2),
    dominant_cannabinoid TEXT,
    primary_effects TEXT[],
    secondary_effects TEXT[],
    medicinal_benefits TEXT[],
    tags TEXT[],
    requires_age_verification BOOLEAN,
    minimum_age INTEGER,
    product_type TEXT,
    is_featured BOOLEAN,
    is_new BOOLEAN,
    is_bestseller BOOLEAN,
    is_trending BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fp.id,
        fp.name,
        fp.description,
        fp.short_description,
        fp.sku,
        fp.display_price,
        fp.our_price,
        fp.sale_price,
        fp.fire_price,
        fp.image_url,
        fp.image_urls,
        fp.stock_quantity,
        fp.inventory_status,
        fp.brand_name,
        fp.brand_slug,
        fp.brand_tier,
        fp.category_name,
        fp.category_slug,
        fp.thc_percentage,
        fp.cbd_percentage,
        fp.dominant_cannabinoid,
        fp.primary_effects,
        fp.secondary_effects,
        fp.medicinal_benefits,
        fp.tags,
        fp.requires_age_verification,
        fp.minimum_age,
        fp.product_type,
        fp.featured,
        fp.is_new,
        fp.is_bestseller,
        fp.is_trending,
        fp.created_at,
        fp.updated_at
    FROM frontend_products_view fp
    WHERE fp.id = product_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 4: Create function to get related products
CREATE OR REPLACE FUNCTION get_related_products(
    product_id UUID,
    limit_count INTEGER DEFAULT 4
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    display_price DECIMAL(10,2),
    image_url TEXT,
    brand_name TEXT,
    similarity_score REAL
) AS $$
DECLARE
    current_product RECORD;
BEGIN
    -- Get current product details
    SELECT * INTO current_product FROM frontend_products_view WHERE id = product_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        fp.id,
        fp.name,
        fp.display_price,
        fp.image_url,
        fp.brand_name,
        -- Simple similarity scoring based on brand and category
        CASE
            WHEN fp.brand_slug = current_product.brand_slug THEN 3.0
            WHEN fp.category_slug = current_product.category_slug THEN 2.0
            ELSE 1.0
        END as similarity_score
    FROM frontend_products_view fp
    WHERE fp.id != product_id
      AND fp.is_active = true
      AND fp.stock_quantity > 0
    ORDER BY similarity_score DESC, fp.is_bestseller DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 5: Create categories view (placeholder for now)
CREATE OR REPLACE VIEW frontend_categories_view AS
SELECT
    'cbd-flower' as slug,
    'CBD Flower' as name,
    'Premium CBD flower products' as description,
    '🌿' as icon,
    1 as sort_order
UNION ALL
SELECT
    'kratom-extracts' as slug,
    'Kratom Extracts' as name,
    'High-quality kratom extracts and products' as description,
    '🍃' as icon,
    2 as sort_order
UNION ALL
SELECT
    '7-hydroxy' as slug,
    '7-Hydroxy Products' as name,
    '7-Hydroxy Mitragynine products' as description,
    '⚡' as icon,
    3 as sort_order
UNION ALL
SELECT
    'glass-pipes' as slug,
    'Glass Pipes' as name,
    'Hand pipes and glass smoking accessories' as description,
    '🚬' as icon,
    4 as sort_order
UNION ALL
SELECT
    'vaporizers' as slug,
    'Vaporizers' as name,
    'Dry herb and concentrate vaporizers' as description,
    '💨' as icon,
    5 as sort_order;

-- Step 6: Grant permissions for frontend access
GRANT SELECT ON frontend_products_view TO authenticated;
GRANT SELECT ON frontend_categories_view TO authenticated;
GRANT EXECUTE ON FUNCTION search_products_frontend TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_details TO authenticated;
GRANT EXECUTE ON FUNCTION get_related_products TO authenticated;

GRANT ALL ON frontend_products_view TO service_role;
GRANT ALL ON frontend_categories_view TO service_role;
GRANT ALL ON FUNCTION search_products_frontend TO service_role;
GRANT ALL ON FUNCTION get_product_details TO service_role;
GRANT ALL ON FUNCTION get_related_products TO service_role;

-- Step 7: Create sample API response views
CREATE OR REPLACE VIEW api_products_response AS
SELECT
    id,
    name,
    sku,
    description,
    short_description,
    display_price,
    image_url,
    brand_name,
    brand_slug,
    category_slug,
    thc_percentage,
    cbd_percentage,
    primary_effects,
    featured,
    is_new,
    is_bestseller,
    inventory_status,
    created_at
FROM frontend_products_view
ORDER BY created_at DESC;

-- Step 8: Verification queries
SELECT '=== SITE INTEGRATION READY ===' as status;

SELECT
    'Frontend products view' as component,
    COUNT(*) as count,
    'Products available for frontend' as description
FROM frontend_products_view
UNION ALL
SELECT
    'Categories' as component,
    COUNT(*) as count,
    'Categories available' as description
FROM frontend_categories_view
UNION ALL
SELECT
    'Brands' as component,
    COUNT(*) as count,
    'Brands available' as description
FROM brand_lookup_view;

-- Show sample products for frontend
SELECT
    '=== SAMPLE FRONTEND PRODUCTS ===' as info,
    name,
    brand_name,
    display_price,
    inventory_status,
    featured
FROM frontend_products_view
ORDER BY created_at DESC
LIMIT 5;
