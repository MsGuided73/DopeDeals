-- Migration: Create Enriched Inventory Staging Table
-- Description: Creates staging table with the exact CSV column structure
-- Author: Generated for DopeDeals
-- Date: 2025-10-10

-- Drop existing staging table if it exists
DROP TABLE IF EXISTS enriched_inventory_staging CASCADE;

-- Create staging table with exact CSV column structure
CREATE TABLE enriched_inventory_staging (
    -- Primary identifiers
    "ID" TEXT,
    "Parent" TEXT,
    "Type" TEXT,
    "Images" TEXT,
    "Brands" TEXT,
    "Nicotine Product" TEXT,

    -- Product details
    "SKU" TEXT,
    "Name" TEXT,
    "Short description" TEXT,
    "Description" TEXT,

    -- Physical attributes
    "Bowl Size" TEXT,
    "Weight (lbs)" TEXT,
    "Length (in)" TEXT,
    "Width (in)" TEXT,
    "Height (in)" TEXT,

    -- Tax information
    "Tax status" TEXT,
    "Tax class" TEXT,

    -- Inventory
    "Stock" TEXT,
    "Low stock amount" TEXT,

    -- Pricing
    "Sale price" TEXT,
    "Regular price" TEXT,

    -- Organization
    "Categories" TEXT,
    "Tags" TEXT,
    "Shipping class" TEXT,

    -- Marketing
    "Cross-sells" TEXT,
    "Button text" TEXT,
    "Visibility in catalog" TEXT,

    -- Custom attributes
    "Attribute 1 name" TEXT,
    "Attribute 1 value(s)" TEXT,
    "Attribute 1 visible" TEXT,
    "Attribute 2 name" TEXT,
    "Attribute 2 value(s)" TEXT,
    "Attribute 2 visible" TEXT,

    -- Import metadata (auto-generated)
    import_row_number SERIAL PRIMARY KEY,
    import_status TEXT DEFAULT 'pending',
    import_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enriched_staging_sku ON enriched_inventory_staging("SKU");
CREATE INDEX IF NOT EXISTS idx_enriched_staging_name ON enriched_inventory_staging("Name");
CREATE INDEX IF NOT EXISTS idx_enriched_staging_brands ON enriched_inventory_staging("Brands");
CREATE INDEX IF NOT EXISTS idx_enriched_staging_status ON enriched_inventory_staging(import_status);

-- Function to validate and transform the enriched staging data
CREATE OR REPLACE FUNCTION validate_enriched_staging_data()
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
    processed_attributes JSONB,
    validation_error TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Clean and validate name
        NULLIF(TRIM(st."Name"), '') as processed_name,

        -- Clean and validate SKU
        NULLIF(TRIM(st."SKU"), '') as processed_sku,

        -- Clean description
        NULLIF(TRIM(st."Description"), '') as processed_description,

        -- Clean short description
        NULLIF(TRIM(st."Short description"), '') as processed_short_description,

        -- Process brand (create slug from Brands field)
        CASE
            WHEN st."Brands" IS NOT NULL AND st."Brands" != ''
            THEN LOWER(REPLACE(TRIM(st."Brands"), ' ', '-'))
            ELSE 'unknown-brand'
        END as processed_brand_id,

        -- Process first category as primary category
        CASE
            WHEN st."Categories" IS NOT NULL AND st."Categories" != ''
            THEN LOWER(REPLACE(TRIM(split_part(st."Categories", '|', 1)), ' ', '-'))
            ELSE 'uncategorized'
        END as processed_category_id,

        -- Validate and set our_price (Regular price) - convert string to decimal
        CASE
            WHEN st."Regular price" IS NULL OR TRIM(st."Regular price") = '' OR TRIM(st."Regular price") = 'NULL'
            THEN 0.01  -- Minimum price
            ELSE CASE
                WHEN TRIM(st."Regular price") ~ '^[0-9]*\.?[0-9]+$'
                THEN st."Regular price"::DECIMAL(10,2)
                ELSE 0.01
            END
        END as processed_our_price,

        -- Process sale price (ensure it's less than regular price) - convert string to decimal
        CASE
            WHEN st."Sale price" IS NOT NULL
                 AND TRIM(st."Sale price") != ''
                 AND TRIM(st."Sale price") != 'NULL'
                 AND TRIM(st."Sale price") ~ '^[0-9]*\.?[0-9]+$'
                 AND st."Sale price"::DECIMAL(10,2) > 0
                 AND st."Sale price"::DECIMAL(10,2) < st."Regular price"::DECIMAL(10,2)
            THEN st."Sale price"::DECIMAL(10,2)
            ELSE NULL
        END as processed_sale_price,

        -- Validate stock quantity - convert string to integer
        CASE
            WHEN st."Stock" IS NULL OR TRIM(st."Stock") = '' OR TRIM(st."Stock") = 'NULL'
            THEN 0
            ELSE CASE
                WHEN TRIM(st."Stock") ~ '^[0-9]+$'
                THEN st."Stock"::INTEGER
                ELSE 0
            END
        END as processed_stock_quantity,

        -- Set low stock threshold - convert string to integer
        CASE
            WHEN st."Low stock amount" IS NOT NULL
                 AND TRIM(st."Low stock amount") != ''
                 AND TRIM(st."Low stock amount") != 'NULL'
                 AND TRIM(st."Low stock amount") ~ '^[0-9]+$'
                 AND st."Low stock amount"::INTEGER > 0
            THEN st."Low stock amount"::INTEGER
            ELSE GREATEST(5,
                CASE
                    WHEN TRIM(st."Stock") ~ '^[0-9]+$' THEN st."Stock"::INTEGER / 10
                    ELSE 0
                END
            )
        END as processed_low_stock_threshold,

        -- Extract first image URL from Images field
        CASE
            WHEN st."Images" IS NOT NULL AND st."Images" != ''
            THEN TRIM(split_part(st."Images", ',', 1))
            ELSE NULL
        END as processed_image_url,

        -- Process tags array
        CASE
            WHEN st."Tags" IS NOT NULL AND st."Tags" != ''
            THEN ARRAY(SELECT TRIM(tag) FROM unnest(string_to_array(st."Tags", ',')) AS tag WHERE TRIM(tag) != '')
            ELSE ARRAY[]::TEXT[]
        END as processed_tags,

        -- Determine if product is active
        CASE
            WHEN LOWER(TRIM(st."Visibility in catalog")) IN ('visible', 'catalog', '1', 'true', 'yes')
            THEN true
            ELSE false
        END as processed_is_active,

        -- Process custom attributes into JSONB
        jsonb_build_object(
            'attribute_1_name', NULLIF(TRIM(st."Attribute 1 name"), ''),
            'attribute_1_value', NULLIF(TRIM(st."Attribute 1 value(s)"), ''),
            'attribute_1_visible', LOWER(TRIM(st."Attribute 1 visible")) IN ('1', 'true', 'yes'),
            'attribute_2_name', NULLIF(TRIM(st."Attribute 2 name"), ''),
            'attribute_2_value', NULLIF(TRIM(st."Attribute 2 value(s)"), ''),
            'attribute_2_visible', LOWER(TRIM(st."Attribute 2 visible")) IN ('1', 'true', 'yes'),
            'bowl_size', NULLIF(TRIM(st."Bowl Size"), ''),
            'weight_lbs', st."Weight (lbs)",
            'dimensions', jsonb_build_object(
                'length_in', st."Length (in)",
                'width_in', st."Width (in)",
                'height_in', st."Height (in)"
            ),
            'tax_status', NULLIF(TRIM(st."Tax status"), ''),
            'tax_class', NULLIF(TRIM(st."Tax class"), ''),
            'shipping_class', NULLIF(TRIM(st."Shipping class"), ''),
            'cross_sells', NULLIF(TRIM(st."Cross-sells"), ''),
            'button_text', NULLIF(TRIM(st."Button text"), ''),
            'nicotine_product', NULLIF(TRIM(st."Nicotine Product"), ''),
            'product_type', NULLIF(TRIM(st."Type"), ''),
            'parent_id', NULLIF(TRIM(st."Parent"), '')
        ) as processed_attributes,

        -- Validation error (NULL if valid)
        CASE
            WHEN TRIM(st."Name") = '' OR st."Name" IS NULL THEN 'Missing product name'
            WHEN TRIM(st."SKU") = '' OR st."SKU" IS NULL THEN 'Missing SKU'
            WHEN st."Regular price" IS NULL OR st."Regular price" <= 0 THEN 'Invalid regular price'
            ELSE NULL
        END as validation_error

    FROM enriched_inventory_staging st
    WHERE st.import_status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Update the main import function to work with the new staging structure
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
        SELECT * FROM validate_enriched_staging_data()
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
                attributes,
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
                -- Store additional attributes
                validation_result.processed_attributes,
                NOW(),
                NOW()
            )
            ON CONFLICT (sku) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                our_price = EXCLUDED.our_price,
                sale_price = EXCLUDED.sale_price,
                stock_quantity = EXCLUDED.stock_quantity,
                attributes = EXCLUDED.attributes,
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
        SELECT import_row_number FROM validate_enriched_staging_data()
        WHERE validation_error IS NULL
    );

    -- Mark invalid records as failed
    UPDATE enriched_inventory_staging SET
        import_status = 'failed',
        import_error = validation_error
    WHERE import_status = 'pending'
    AND import_row_number IN (
        SELECT import_row_number FROM validate_enriched_staging_data()
        WHERE validation_error IS NOT NULL
    );

    RETURN QUERY SELECT
        import_count as total_processed,
        success_count as successful_imports,
        error_count as failed_imports,
        log_entries as import_log;
END;
$$ LANGUAGE plpgsql;

-- Show staging table structure
SELECT
    'Enriched Staging Table Created' as status,
    'Table: enriched_inventory_staging' as table_name,
    COUNT(*) as total_columns,
    'Ready for CSV import' as message
FROM information_schema.columns
WHERE table_name = 'enriched_inventory_staging';

-- Show available functions
SELECT
    'Available Functions' as function_type,
    'execute_enriched_inventory_import()' as function_name,
    'Executes the main import process' as description

UNION ALL

SELECT
    'Validation Functions' as function_type,
    'validate_enriched_staging_data()' as function_name,
    'Validates and transforms staging data' as description

UNION ALL

SELECT
    'Monitoring Functions' as function_type,
    'get_import_summary()' as function_name,
    'Returns import statistics' as description;
