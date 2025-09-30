-- Update all product image URLs to use website-images bucket instead of products bucket
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- Update all products that have image_url pointing to products bucket
UPDATE products
SET image_url = REPLACE(
  image_url,
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/',
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/'
)
WHERE image_url LIKE '%/storage/v1/object/public/products/%';

-- Verify the changes
SELECT 
  name,
  sku,
  image_url
FROM products
WHERE image_url LIKE '%website-images/products/%'
ORDER BY name
LIMIT 20;

-- Count how many were updated
SELECT 
  COUNT(*) as total_updated
FROM products
WHERE image_url LIKE '%website-images/products/%';

