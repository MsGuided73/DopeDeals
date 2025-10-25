SELECT
    'Staging table records' as metric,
    COUNT(*) as count
FROM enriched_inventory_staging
UNION ALL
SELECT
    'Pending records' as metric,
    COUNT(*) as count
FROM enriched_inventory_staging
WHERE import_status = 'pending'
UNION ALL
SELECT
    'Products in main table' as metric,
    COUNT(*) as count
FROM main_site_products;
