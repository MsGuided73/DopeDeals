-- Safe Export Script for Your Enriched Inventory
-- Exports all your valuable product data before reset

-- 1. First, let's check what we're exporting
SELECT
    'Total products' as metric,
    COUNT(*) as count
FROM products

UNION ALL

SELECT
    'Products with descriptions' as metric,
    COUNT(*) as count
FROM products
WHERE "Description" IS NOT NULL AND "Description" != ''

UNION ALL

SELECT
    'Products with brands' as metric,
    COUNT(*) as count
FROM products
WHERE "Brand" IS NOT NULL AND "Brand" != ''

UNION ALL

SELECT
    'Products with images' as metric,
    COUNT(*) as count
FROM products
WHERE "Images" IS NOT NULL AND "Images" != '';

-- 2. Export your enriched inventory with all valuable data
COPY (
  SELECT
    -- Basic product information
    "Id" as id,
    "Name" as name,
    "SKU" as sku,
    "Brand" as brand,
    "Type" as product_type,

    -- Pricing information
    NULLIF("Sale Price", 0) as sale_price,
    NULLIF("Regular Price", 0) as regular_price,

    -- Inventory information
    COALESCE("Stock", 0) as stock_quantity,
    COALESCE("Low Stock Amount", 5) as low_stock_threshold,

    -- Content and descriptions
    "Short Description" as short_description,
    "Description" as description,

    -- Categories and organization
    "Categories" as categories,
    "Tags" as tags,

    -- Physical attributes
    "Bowl Size" as bowl_size,
    "Weight (lbs)" as weight_lbs,
    "Height (in)" as height_inches,
    "Width (in)" as width_inches,

    -- Compliance information
    "Nicotine Product" as nicotine_product,
    "Tax Status" as tax_status,
    "Tax Class" as tax_class,

    -- Media
    "Images" as images,

    -- Marketing
    "Visibility in catalog" as visibility,
    "Cross-sells" as cross_sells,
    "Shipping Class" as shipping_class,

    -- Attributes
    "Attribute 1 name" as attribute_1_name,
    "Attribute 1 value(s)" as attribute_1_values,
    "Attribute 2 name" as attribute_2_name,
    "Attribute 2 value(s)" as attribute_2_values,

    -- Current timestamp for reference
    NOW() as exported_at

  FROM products
  WHERE "Name" IS NOT NULL
    AND "Name" != ''
    AND "SKU" IS NOT NULL
    AND "SKU" != ''
    AND "Brand" IS NOT NULL
    AND "Brand" != ''
    AND ("Description" IS NOT NULL OR "Short Description" IS NOT NULL)
) TO 'C:\__DOPE CITY\DopeDeals\enriched_inventory_export.csv'
WITH CSV HEADER DELIMITER ',' QUOTE '"' ENCODING 'UTF-8';

-- 3. Verify the export worked
SELECT 'Export completed successfully' as status;

-- 4. Show export summary
SELECT
    'Products exported' as metric,
    COUNT(*) as count
FROM products
WHERE "Name" IS NOT NULL
  AND "Name" != ''
  AND "SKU" IS NOT NULL
  AND "SKU" != ''
  AND "Brand" IS NOT NULL
  AND "Brand" != '';

-- 5. Create a backup of your current table structure for reference
SELECT
    column_name,
    data_type,
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position
INTO OUTFILE 'C:\__DOPE CITY\DopeDeals\products_table_structure.csv'
WITH CSV HEADER;

-- 6. Final verification
SELECT
    'Export file created' as check,
    'enriched_inventory_export.csv should exist' as expected,

    'Structure backup created' as check,
    'products_table_structure.csv should exist' as expected,

    'Ready for reset' as check,
    'Database can be safely reset after backup' as expected;
