-- Migration: Execute CSV Import
-- Description: Loads and processes the enriched_inventory.csv file
-- Author: Generated for DopeDeals
-- Date: 2025-10-10

-- Load CSV data directly into staging table
-- This runs as part of the migration process

BEGIN;

-- Clear existing staging data and reset sequence
TRUNCATE TABLE enriched_inventory_staging RESTART IDENTITY;

-- Load CSV data into staging table
COPY enriched_inventory_staging (
    name, sku, description, short_description, brand, categories,
    regular_price, sale_price, stock, low_stock_amount, images, tags, visibility_in_catalog
) FROM 'C:\__DOPE CITY\DopeDeals\enriched_inventory.csv'
WITH CSV HEADER DELIMITER ',' QUOTE '"' ENCODING 'UTF-8' NULL '';

-- Update import status to pending for all loaded records
UPDATE enriched_inventory_staging SET import_status = 'pending' WHERE import_status IS NULL;

COMMIT;

-- Show summary of loaded data
SELECT
    'CSV Import Migration Summary' as operation,
    COUNT(*) as total_records,
    COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as valid_names,
    COUNT(CASE WHEN sku IS NOT NULL AND sku != '' THEN 1 END) as valid_skus,
    COUNT(CASE WHEN regular_price IS NOT NULL AND regular_price > 0 THEN 1 END) as valid_prices,
    COUNT(DISTINCT brand) as unique_brands,
    COUNT(DISTINCT categories) as unique_categories
FROM enriched_inventory_staging;
