-- Update featured products to ensure they have valid images
-- This migration replaces products without images in the Hot Products section

-- First, unmark all currently featured products
UPDATE main_site_products SET featured = false WHERE featured = true;

-- Now mark specific products with images as featured
-- PUFFCO Proxy
UPDATE main_site_products SET featured = true WHERE name ILIKE '%proxy%' AND brand_name = 'PUFFCO' AND image_url IS NOT NULL AND image_url != '';

-- THCA Gummies (look for various naming)
UPDATE main_site_products SET featured = true WHERE name ILIKE '%thca%gumm%' AND image_url IS NOT NULL AND image_url != '' ORDER BY id ASC LIMIT 1;

-- Zoomers Chocolate Bar
UPDATE main_site_products SET featured = true WHERE name ILIKE '%zoomers%chocolate%' AND image_url IS NOT NULL AND image_url != '' ORDER BY id ASC LIMIT 1;

-- Additional PUFFCO products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'PUFFCO' AND image_url IS NOT NULL AND image_url != '' AND featured = false ORDER BY id ASC LIMIT 2;

-- Glass Diamond products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'Glass Diamond' AND image_url IS NOT NULL AND image_url != '' AND featured = false ORDER BY id ASC LIMIT 1;

-- CRAVE products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'CRAVE' AND image_url IS NOT NULL AND image_url != '' AND featured = false ORDER BY id ASC LIMIT 1;

-- ROOR products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'ROOR' AND image_url IS NOT NULL AND image_url != '' AND featured = false ORDER BY id ASC LIMIT 1;

-- If we still don't have 6 products, add more from other brands with images
UPDATE main_site_products SET featured = true WHERE image_url IS NOT NULL AND image_url != '' AND featured = false ORDER BY id ASC LIMIT 6;

-- Ensure exactly 6 featured products by pruning any extras
UPDATE main_site_products SET featured = false WHERE id IN (
  SELECT id FROM main_site_products WHERE featured = true ORDER BY id ASC OFFSET 6
);

-- Verify the results - should have exactly 6 featured products with images
DO $$
DECLARE
  featured_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO featured_count FROM main_site_products WHERE featured = true AND image_url IS NOT NULL AND image_url != '';
  IF featured_count != 6 THEN
    RAISE EXCEPTION 'Expected exactly 6 featured products with images, but found %', featured_count;
  END IF;
END $$;
