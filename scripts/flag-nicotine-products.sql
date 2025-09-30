-- Flag all nicotine and tobacco products in the database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- 1. Flag nicotine pouch products
UPDATE products 
SET nicotine_product = true 
WHERE (
  name ILIKE '%NIC POUCH%' 
  OR name ILIKE '%NICOTINE POUCH%'
)
AND nicotine_product = false;

-- 2. Flag e-liquid/vape juice products
UPDATE products 
SET nicotine_product = true 
WHERE (
  name ILIKE '%E-LIQUID%' 
  OR name ILIKE '%VAPE JUICE%'
  OR name ILIKE '%E LIQUID%'
  OR description ILIKE '%NICOTINE%'
)
AND nicotine_product = false;

-- 3. Flag disposable vape products with nicotine
UPDATE products 
SET nicotine_product = true 
WHERE (
  (name ILIKE '%PUFFS%' AND (name ILIKE '%5%' OR name ILIKE '%MG'))
  OR name ILIKE '%DISPOSABLE%'
)
AND (
  name ILIKE '%TOBACCO%'
  OR description ILIKE '%NICOTINE%'
)
AND nicotine_product = false;

-- 4. Flag cigarette papers (tobacco-related)
UPDATE products 
SET tobacco_product = true 
WHERE (
  name ILIKE '%CIGARETTE PAPER%'
  OR name ILIKE '%CIG PAPER%'
  OR (name ILIKE '%ZIG ZAG%' AND name ILIKE '%CIG%')
)
AND tobacco_product = false;

-- 5. Flag tobacco wraps
UPDATE products 
SET tobacco_product = true 
WHERE (
  name ILIKE '%TOBACCO%WRAP%'
  OR name ILIKE '%BLUNT WRAP%'
  OR description ILIKE '%TOBACCO%'
)
AND tobacco_product = false;

-- 6. Verify the changes
SELECT 
  'Nicotine Products' as category,
  COUNT(*) as count
FROM products 
WHERE nicotine_product = true

UNION ALL

SELECT 
  'Tobacco Products' as category,
  COUNT(*) as count
FROM products 
WHERE tobacco_product = true

UNION ALL

SELECT 
  'Total Restricted' as category,
  COUNT(*) as count
FROM products 
WHERE nicotine_product = true OR tobacco_product = true;

-- 7. Show sample of flagged products
SELECT 
  name,
  sku,
  CASE 
    WHEN nicotine_product THEN 'Nicotine'
    WHEN tobacco_product THEN 'Tobacco'
  END as product_type
FROM products 
WHERE nicotine_product = true OR tobacco_product = true
ORDER BY name
LIMIT 20;

