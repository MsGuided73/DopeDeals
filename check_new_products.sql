-- Check if is_new column exists and how many products are marked as new
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'main_site_products' AND column_name = 'is_new';

-- Check how many products are marked as new (if column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'main_site_products' AND column_name = 'is_new') THEN
        RAISE NOTICE 'is_new column exists';
        EXECUTE 'SELECT COUNT(*) as new_products_count FROM main_site_products WHERE is_new = true';
    ELSE
        RAISE NOTICE 'is_new column does NOT exist';
    END IF;
END $$;

-- Show total products in table and recent updates
SELECT
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_new = true THEN 1 END) as new_products,
    MAX(created_at) as latest_product_date,
    MAX(created_at) as most_recent_update
FROM main_site_products;

-- Show a few recent products and their is_new status (if column exists)
SELECT id, name, is_new, created_at
FROM main_site_products
ORDER BY created_at DESC
LIMIT 5;
