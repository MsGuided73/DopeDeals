-- Diagnostic script to understand current database state
-- This will help us fix the column conflicts once and for all

-- Check what tables currently exist
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check if products table exists and its structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check if main_site_products table exists
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'main_site_products'
ORDER BY ordinal_position;

-- Show current table status
SELECT
    'products' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'products') as exists,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'products'

UNION ALL

SELECT
    'main_site_products' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'main_site_products') as exists,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'main_site_products';
