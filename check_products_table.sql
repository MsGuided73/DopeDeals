-- Check the actual structure of the products table
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Also show a sample of actual product IDs to understand their format
SELECT id, name FROM products LIMIT 3;
