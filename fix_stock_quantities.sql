-- Fix stock quantities for all active products
-- Set stock_quantity to 5-10 for all active products

-- First, check current status
SELECT
  COUNT(*) as total_products,
  COUNT(CASE WHEN stock_quantity IS NULL OR stock_quantity = 0 THEN 1 END) as out_of_stock,
  COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as in_stock
FROM main_site_products
WHERE is_active = true;

-- Update all products to have stock_quantity between 5-10
UPDATE main_site_products
SET stock_quantity = (floor(random() * 6) + 5)::integer
WHERE is_active = true;

-- Verify the update
SELECT
  COUNT(*) as total_products,
  COUNT(CASE WHEN stock_quantity IS NULL OR stock_quantity = 0 THEN 1 END) as out_of_stock,
  COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as in_stock,
  MIN(stock_quantity) as min_stock,
  MAX(stock_quantity) as max_stock,
  AVG(stock_quantity) as avg_stock
FROM main_site_products
WHERE is_active = true;

-- Show sample of updated products
SELECT id, name, stock_quantity
FROM main_site_products
WHERE is_active = true
ORDER BY RANDOM()
LIMIT 10;
