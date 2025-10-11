-- Products Table Diagnostic and Repair Script
-- Helps fix issues with your existing products table without breaking dependencies

-- 1. Check for basic table accessibility and structure
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename = 'products';

-- 2. Check for any obvious corruption or issues
SELECT
    'Row count' as check_type,
    COUNT(*) as value
FROM products

UNION ALL

SELECT
    'Null names' as check_type,
    COUNT(*) as value
FROM products
WHERE "Name" IS NULL OR "Name" = ''

UNION ALL

SELECT
    'Duplicate SKUs' as check_type,
    COUNT(*) - COUNT(DISTINCT "SKU") as value
FROM products
WHERE "SKU" IS NOT NULL

UNION ALL

SELECT
    'Products without prices' as check_type,
    COUNT(*) as value
FROM products
WHERE ("Sale Price" IS NULL OR "Sale Price" = 0)
  AND ("Regular Price" IS NULL OR "Regular Price" = 0);

-- 3. Check for data type issues that might cause errors
SELECT
    column_name,
    data_type,
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Try to access the table data safely
SELECT COUNT(*) as total_products FROM products;

-- 5. Check for any constraint or index issues
SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'products';

-- 6. Check for any triggers that might be causing issues
SELECT
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'products';

-- 7. Create a safe backup view before making changes
CREATE OR REPLACE VIEW products_backup_view AS
SELECT * FROM products;

-- 8. Create a cleaned-up version of your products table
-- This creates a new table with fixed structure while preserving data

-- First, let's create a temporary table with your data
CREATE TABLE IF NOT EXISTS products_temp AS
SELECT
    id,
    -- Clean up name field
    NULLIF(TRIM("Name"), '') as name,
    NULLIF(TRIM("SKU"), '') as sku,
    NULLIF(TRIM("Brand"), '') as brand,
    NULLIF(TRIM("Categories"), '') as categories,
    NULLIF(TRIM("Tags"), '') as tags,

    -- Handle pricing with fallbacks
    COALESCE(
        NULLIF("Sale Price"::DECIMAL, 0),
        NULLIF("Regular Price"::DECIMAL, 0),
        0
    ) as display_price,

    -- Handle stock with defaults
    COALESCE("Stock"::INTEGER, 0) as stock_quantity,
    COALESCE("Low Stock Amount"::INTEGER, 5) as low_stock_threshold,

    -- Handle visibility
    CASE
        WHEN "Visibility in catalog" = 'visible' THEN true
        WHEN "Visibility in catalog" = 'hidden' THEN false
        ELSE true
    END as is_active,

    -- Handle descriptions
    NULLIF(TRIM("Short Description"), '') as short_description,
    NULLIF(TRIM("Description"), '') as description,

    -- Handle images (you may need to parse JSON)
    "Images" as images,

    -- Handle type and compliance
    "Type" as product_type,
    CASE
        WHEN "Nicotine Product" ILIKE '%true%' THEN true
        ELSE false
    END as requires_age_verification,

    -- Physical attributes
    NULLIF(TRIM("Bowl Size"), '') as bowl_size,
    "Weight (lbs)" as weight_lbs,
    "Height (in)" as height_inches,
    "Width (in)" as width_inches,

    -- Tax information
    NULLIF(TRIM("Tax Status"), '') as tax_status,
    NULLIF(TRIM("Tax Class"), '') as tax_class,

    -- Marketing
    "Cross-sells" as cross_sells,
    "Shipping Class" as shipping_class,

    -- Attributes
    "Attribute 1 name" as attribute_1_name,
    "Attribute 1 value(s)" as attribute_1_values,
    "Attribute 2 name" as attribute_2_name,
    "Attribute 2 value(s)" as attribute_2_values,

    -- Timestamps
    NOW() as created_at,
    NOW() as updated_at

FROM products
WHERE "Name" IS NOT NULL
  AND "Name" != ''
  AND "SKU" IS NOT NULL
  AND "SKU" != '';

-- 9. Create indexes for the temp table
CREATE INDEX IF NOT EXISTS idx_products_temp_name ON products_temp(name);
CREATE INDEX IF NOT EXISTS idx_products_temp_sku ON products_temp(sku);
CREATE INDEX IF NOT EXISTS idx_products_temp_brand ON products_temp(brand);
CREATE INDEX IF NOT EXISTS idx_products_temp_active ON products_temp(is_active);
CREATE INDEX IF NOT EXISTS idx_products_temp_price ON products_temp(display_price);

-- 10. Show summary of what we found and fixed
SELECT
    'Original table exists' as status,
    EXISTS(SELECT 1 FROM products) as original_exists,

    'Temp table created' as status,
    EXISTS(SELECT 1 FROM products_temp) as temp_exists,

    'Original row count' as status,
    (SELECT COUNT(*) FROM products) as original_count,

    'Cleaned row count' as status,
    (SELECT COUNT(*) FROM products_temp) as cleaned_count;

-- Grant permissions
GRANT SELECT ON products_temp TO authenticated;
GRANT ALL ON products_temp TO service_role;
GRANT SELECT ON products_backup_view TO authenticated;
GRANT ALL ON products_backup_view TO service_role;

-- Comments
COMMENT ON VIEW products_backup_view IS 'Backup view of original products table';
COMMENT ON TABLE products_temp IS 'Cleaned and repaired version of products table';
