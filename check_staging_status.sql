-- Check current status of enriched inventory staging table
-- This script validates the imported data and shows next steps

-- First, check what's in the staging table
SELECT
    '=== STAGING TABLE STATUS ===' as info,
    COUNT(*) as total_records,
    COUNT(CASE WHEN import_status = 'pending' THEN 1 END) as pending_records,
    COUNT(CASE WHEN import_status = 'completed' THEN 1 END) as completed_records,
    COUNT(CASE WHEN import_status = 'failed' THEN 1 END) as failed_records
FROM enriched_inventory_staging;

-- Show sample of the data
SELECT
    '=== SAMPLE DATA ===' as info,
    import_row_number,
    "Name" as product_name,
    "SKU" as sku,
    "Brands" as brand,
    "Categories" as categories,
    "Regular price" as regular_price,
    "Stock" as stock_quantity,
    import_status
FROM enriched_inventory_staging
ORDER BY import_row_number
LIMIT 10;

-- Run validation function to check data quality
SELECT
    '=== VALIDATION RESULTS ===' as info,
    COUNT(*) as total_validated,
    COUNT(CASE WHEN validation_error IS NULL THEN 1 END) as valid_records,
    COUNT(CASE WHEN validation_error IS NOT NULL THEN 1 END) as invalid_records
FROM validate_enriched_staging_data();

-- Show validation errors if any
SELECT
    '=== VALIDATION ERRORS ===' as info,
    import_row_number,
    "Name" as product_name,
    "SKU" as sku,
    validation_error
FROM validate_enriched_staging_data()
WHERE validation_error IS NOT NULL
ORDER BY import_row_number
LIMIT 20;

-- Show current products in main table
SELECT
    '=== MAIN PRODUCTS TABLE ===' as info,
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_active THEN 1 END) as active_products
FROM main_site_products;
