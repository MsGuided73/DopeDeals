-- Flag ZigZag papers and all rolling papers as tobacco products
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- Flag all ZigZag products
UPDATE products 
SET tobacco_product = true 
WHERE name ILIKE '%ZIG ZAG%'
  OR name ILIKE '%ZIGZAG%';

-- Flag all cigarette papers
UPDATE products 
SET tobacco_product = true 
WHERE name ILIKE '%CIG PAPER%'
  OR name ILIKE '%CIGARETTE PAPER%';

-- Flag all rolling papers
UPDATE products 
SET tobacco_product = true 
WHERE (name ILIKE '%ROLLING PAPER%' OR name ILIKE '%ROLLING%PAPER%')
  AND NOT (name ILIKE '%BONG%' OR name ILIKE '%PIPE%');

-- Verify the changes
SELECT 
  name,
  sku,
  tobacco_product,
  nicotine_product
FROM products
WHERE name ILIKE '%ZIG ZAG%'
   OR name ILIKE '%ZIGZAG%'
   OR name ILIKE '%ROLLING PAPER%'
ORDER BY name
LIMIT 20;

-- Count total tobacco products
SELECT COUNT(*) as total_tobacco_products
FROM products
WHERE tobacco_product = true;

