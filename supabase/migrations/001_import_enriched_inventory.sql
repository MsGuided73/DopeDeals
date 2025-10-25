-- Migration: Import Enriched Inventory CSV
-- Description: Safely imports enriched inventory data into main_site_products table
-- Author: Generated for DopeDeals
-- Date: 2025-10-10

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create temporary staging table for safe import
DROP TABLE IF EXISTS enriched_inventory_staging CASCADE;
CREATE TABLE enriched_inventory_staging (
    -- Basic product information
    name TEXT,
    sku TEXT,
    description TEXT,
    short_description TEXT,
    brand TEXT,
    categories TEXT,
    regular_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    stock INTEGER,
    low_stock_amount INTEGER,
    images TEXT,
    tags TEXT,
    visibility_in_catalog TEXT,

    -- Import metadata
    import_row_number SERIAL PRIMARY KEY,
    import_status TEXT DEFAULT 'pending',
    import_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_staging_sku ON enriched_inventory_staging(sku);
CREATE INDEX IF NOT EXISTS idx_staging_status ON enriched_inventory_staging(import_status);

-- Function to validate and transform data before import
CREATE OR REPLACE FUNCTION validate_and_transform_staging_data()
RETURNS TABLE(
    processed_name TEXT,
    processed_sku TEXT,
    processed_description TEXT,
    processed_short_description TEXT,
    processed_brand_id TEXT,
    processed_category_id TEXT,
    processed_our_price DECIMAL(10,2),
    processed_sale_price DECIMAL(10,2),
    processed_stock_quantity INTEGER,
    processed_low_stock_threshold INTEGER,
    processed_image_url TEXT,
    processed_tags TEXT[],
    processed_is_active BOOLEAN,
    validation_error TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Clean and validate name
        NULLIF(TRIM(st.name), '') as processed_name,

        -- Clean and validate SKU
        NULLIF(TRIM(st.sku), '') as processed_sku,

        -- Clean description
        NULLIF(TRIM(st.description), '') as processed_description,

        -- Clean short description
        NULLIF(TRIM(st.short_description), '') as processed_short_description,

        -- Process brand (create slug)
        LOWER(REPLACE(TRIM(st.brand), ' ', '-')) as processed_brand_id,

        -- Process first category as primary category
        CASE
            WHEN st.categories IS NOT NULL AND st.categories != ''
            THEN LOWER(REPLACE(TRIM(split_part(st.categories, '|', 1)), ' ', '-'))
            ELSE 'uncategorized'
        END as processed_category_id,

        -- Validate and set our_price
        CASE
            WHEN st.regular_price IS NULL OR st.regular_price <= 0
            THEN 0.01  -- Minimum price
            ELSE st.regular_price
        END as processed_our_price,

        -- Process sale price (ensure it's less than regular price)
        CASE
            WHEN st.sale_price IS NOT NULL
                 AND st.sale_price > 0
                 AND st.sale_price < st.regular_price
            THEN st.sale_price
            ELSE NULL
        END as processed_sale_price,

        -- Validate stock quantity
        CASE
            WHEN st.stock IS NULL OR st.stock < 0 THEN 0
            ELSE st.stock
        END as processed_stock_quantity,

        -- Set low stock threshold
        CASE
            WHEN st.low_stock_amount IS NOT NULL AND st.low_stock_amount > 0
            THEN st.low_stock_amount
            ELSE GREATEST(5, st.stock / 10)  -- Default to 5 or 10% of stock
        END as processed_low_stock_threshold,

        -- Extract first image URL from images field
        CASE
            WHEN st.images IS NOT NULL AND st.images != ''
            THEN TRIM(split_part(st.images, ',', 1))
            ELSE NULL
        END as processed_image_url,

        -- Process tags array
        CASE
            WHEN st.tags IS NOT NULL AND st.tags != ''
            THEN ARRAY(SELECT TRIM(tag) FROM unnest(string_to_array(st.tags, ',')) AS tag WHERE TRIM(tag) != '')
            ELSE ARRAY[]::TEXT[]
        END as processed_tags,

        -- Determine if product is active
        CASE
            WHEN LOWER(TRIM(st.visibility_in_catalog)) IN ('visible', 'catalog', '1', 'true', 'yes')
            THEN true
            ELSE false
        END as processed_is_active,

        -- Validation error (NULL if valid)
        CASE
            WHEN TRIM(st.name) = '' OR st.name IS NULL THEN 'Missing product name'
            WHEN TRIM(st.sku) = '' OR st.sku IS NULL THEN 'Missing SKU'
            WHEN st.regular_price IS NULL OR st.regular_price <= 0 THEN 'Invalid regular price'
            ELSE NULL
        END as validation_error

    FROM enriched_inventory_staging st
    WHERE st.import_status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Function to perform the actual import
CREATE OR REPLACE FUNCTION execute_enriched_inventory_import()
RETURNS TABLE(
    total_processed INTEGER,
    successful_imports INTEGER,
    failed_imports INTEGER,
    import_log JSONB
) AS $$
DECLARE
    import_count INTEGER := 0;
    success_count INTEGER := 0;
    error_count INTEGER := 0;
    log_entries JSONB := '[]'::jsonb;
    validation_result RECORD;
BEGIN
    -- Process each validated record
    FOR validation_result IN
        SELECT * FROM validate_and_transform_staging_data()
        WHERE validation_error IS NULL
    LOOP
        import_count := import_count + 1;

        BEGIN
            -- Insert into main_site_products with proper defaults
            INSERT INTO main_site_products (
                name,
                sku,
                description,
                short_description,
                brand_id,
                category_id,
                our_price,
                sale_price,
                stock_quantity,
                low_stock_threshold,
                image_url,
                tags,
                is_active,
                -- Set default enhanced fields
                cannabinoid_profile,
                effects_profile,
                compliance_info,
                display_price_type,
                inventory_status,
                created_at,
                updated_at
            ) VALUES (
                validation_result.processed_name,
                validation_result.processed_sku,
                validation_result.processed_description,
                validation_result.processed_short_description,
                validation_result.processed_brand_id,
                validation_result.processed_category_id,
                validation_result.processed_our_price,
                validation_result.processed_sale_price,
                validation_result.processed_stock_quantity,
                validation_result.processed_low_stock_threshold,
                validation_result.processed_image_url,
                validation_result.processed_tags,
                validation_result.processed_is_active,
                -- Default cannabinoid profile
                '{
                    "thc_variants": {
                        "delta9_thc": 0.0,
                        "delta8_thc": 0.0,
                        "thca": 0.0,
                        "thcp": 0.0,
                        "thcv": 0.0
                    },
                    "other_cannabinoids": {
                        "cbd": 0.0,
                        "cbg": 0.0,
                        "cbn": 0.0,
                        "cbc": 0.0
                    },
                    "total_cannabinoids": 0.0,
                    "dominant_cannabinoid": "cbd",
                    "profile_type": "isolate"
                }'::jsonb,
                -- Default effects profile
                '{
                    "primary_effects": [],
                    "secondary_effects": [],
                    "medicinal_benefits": [],
                    "best_for": [],
                    "avoid_if": []
                }'::jsonb,
                -- Default compliance info (will be updated based on product analysis)
                '{
                    "requires_age_verification": false,
                    "minimum_age": 18,
                    "restricted_states": [],
                    "restricted_zipcodes": [],
                    "requires_lab_testing": false,
                    "lab_certificate_url": null,
                    "product_type": "general",
                    "regulatory_category": "unregulated"
                }'::jsonb,
                -- Set display price type
                CASE
                    WHEN validation_result.processed_sale_price IS NOT NULL THEN 'sale_price'
                    ELSE 'our_price'
                END,
                -- Set inventory status
                CASE
                    WHEN validation_result.processed_stock_quantity = 0 THEN 'out_of_stock'
                    WHEN validation_result.processed_stock_quantity <= validation_result.processed_low_stock_threshold THEN 'low_stock'
                    ELSE 'in_stock'
                END,
                NOW(),
                NOW()
            )
            ON CONFLICT (sku) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                our_price = EXCLUDED.our_price,
                sale_price = EXCLUDED.sale_price,
                stock_quantity = EXCLUDED.stock_quantity,
                updated_at = NOW();

            success_count := success_count + 1;

            -- Log success
            log_entries := log_entries || jsonb_build_object(
                'sku', validation_result.processed_sku,
                'status', 'success',
                'message', 'Successfully imported/updated product'
            );

        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;

            -- Log error
            log_entries := log_entries || jsonb_build_object(
                'sku', validation_result.processed_sku,
                'status', 'error',
                'message', SQLERRM
            );
        END;
    END LOOP;

    -- Update staging table with results
    UPDATE enriched_inventory_staging SET
        import_status = 'completed',
        import_error = NULL
    WHERE import_status = 'pending'
    AND import_row_number IN (
        SELECT import_row_number FROM validate_and_transform_staging_data()
        WHERE validation_error IS NULL
    );

    -- Mark invalid records as failed
    UPDATE enriched_inventory_staging SET
        import_status = 'failed',
        import_error = validation_error
    WHERE import_status = 'pending'
    AND import_row_number IN (
        SELECT import_row_number FROM validate_and_transform_staging_data()
        WHERE validation_error IS NOT NULL
    );

    RETURN QUERY SELECT
        import_count as total_processed,
        success_count as successful_imports,
        error_count as failed_imports,
        log_entries as import_log;
END;
$$ LANGUAGE plpgsql;

-- Function to get import summary
CREATE OR REPLACE FUNCTION get_import_summary()
RETURNS TABLE(
    metric TEXT,
    count INTEGER,
    details TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'Total records in CSV'::TEXT as metric,
        COUNT(*)::INTEGER as count,
        'Records found in staging table'::TEXT as details
    FROM enriched_inventory_staging

    UNION ALL

    SELECT
        'Pending validation'::TEXT as metric,
        COUNT(*)::INTEGER as count,
        'Records awaiting validation'::TEXT as details
    FROM enriched_inventory_staging
    WHERE import_status = 'pending'

    UNION ALL

    SELECT
        'Successfully imported'::TEXT as metric,
        COUNT(*)::INTEGER as count,
        'Records successfully imported to main_site_products'::TEXT as details
    FROM enriched_inventory_staging
    WHERE import_status = 'completed'

    UNION ALL

    SELECT
        'Failed imports'::TEXT as metric,
        COUNT(*)::INTEGER as count,
        'Records that failed validation or import'::TEXT as details
    FROM enriched_inventory_staging
    WHERE import_status = 'failed'

    UNION ALL

    SELECT
        'Products in main table'::TEXT as metric,
        COUNT(*)::INTEGER as count,
        'Total products now in main_site_products'::TEXT as details
    FROM main_site_products;
END;
$$ LANGUAGE plpgsql;

-- Create a view for monitoring import progress
CREATE OR REPLACE VIEW import_progress_view AS
SELECT
    import_row_number,
    name,
    sku,
    brand,
    categories,
    regular_price,
    stock,
    import_status,
    import_error,
    created_at
FROM enriched_inventory_staging
ORDER BY import_row_number;

-- Grant permissions
GRANT SELECT ON import_progress_view TO authenticated;
GRANT ALL ON import_progress_view TO service_role;
GRANT EXECUTE ON FUNCTION validate_and_transform_staging_data() TO service_role;
GRANT EXECUTE ON FUNCTION execute_enriched_inventory_import() TO service_role;
GRANT EXECUTE ON FUNCTION get_import_summary() TO service_role;

-- Comments for documentation
COMMENT ON TABLE enriched_inventory_staging IS 'Temporary staging table for CSV import validation and processing';
COMMENT ON FUNCTION validate_and_transform_staging_data() IS 'Validates and transforms staging data before import to main_site_products';
COMMENT ON FUNCTION execute_enriched_inventory_import() IS 'Executes the actual import from staging table to main_site_products with error handling';
COMMENT ON FUNCTION get_import_summary() IS 'Provides summary statistics for the import process';
COMMENT ON VIEW import_progress_view IS 'View for monitoring import progress and identifying issues';
