-- First, unmark all currently featured products
UPDATE main_site_products SET featured = false WHERE featured = true;

-- Now mark specific products with images as featured
-- Puffco Proxy
UPDATE main_site_products SET featured = true WHERE name ILIKE '%proxy%' AND brand_name = 'Puffco' AND image_url IS NOT NULL AND image_url != '';

-- THCA Gummies (look for various naming)
UPDATE main_site_products SET featured = true WHERE name ILIKE '%thca%gumm%' AND image_url IS NOT NULL AND image_url != '' LIMIT 1;

-- Zoomers Chocolate Bar
UPDATE main_site_products SET featured = true WHERE name ILIKE '%zoomers%chocolate%' AND image_url IS NOT NULL AND image_url != '' LIMIT 1;

-- Additional Puffco products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'Puffco' AND image_url IS NOT NULL AND image_url != '' AND featured = false LIMIT 2;

-- Cookies products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'Cookies' AND image_url IS NOT NULL AND image_url != '' AND featured = false LIMIT 1;

-- Crave products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'Crave' AND image_url IS NOT NULL AND image_url != '' AND featured = false LIMIT 1;

-- ROOR products with images
UPDATE main_site_products SET featured = true WHERE brand_name = 'ROOR' AND image_url IS NOT NULL AND image_url != '' AND featured = false LIMIT 1;

-- Verify the results
SELECT id, name, brand_name, image_url, featured FROM main_site_products WHERE featured = true AND image_url IS NOT NULL AND image_url != '' ORDER BY brand_name, name;
