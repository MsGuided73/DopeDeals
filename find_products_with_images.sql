-- Find products with valid images from specific brands
SELECT
    id,
    name,
    brand_name,
    image_url,
    featured,
    is_active
FROM main_site_products
WHERE
    is_active = true
    AND image_url IS NOT NULL
    AND image_url != ''
    AND brand_name IN ('Puffco', 'Cookies', 'Crave', 'ROOR', 'Zoomers')
ORDER BY brand_name, name
LIMIT 20;
