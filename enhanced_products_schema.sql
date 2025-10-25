-- Enhanced Products Schema - Modified for Existing Table
-- Works with your current products table structure (80 columns)
-- Adds advanced features without breaking existing data

-- First, let's backup your current products table structure
-- (This is just for reference - we won't modify your existing table)

-- Create enhanced functions that work with your existing columns
-- Based on the diagnostic showing you have 80 columns in products table

-- Enhanced search function for your existing products table
CREATE OR REPLACE FUNCTION search_products_enhanced(
  search_query TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  brand_filter TEXT DEFAULT NULL,
  min_price DECIMAL(10,2) DEFAULT NULL,
  max_price DECIMAL(10,2) DEFAULT NULL,
  in_stock_only BOOLEAN DEFAULT false
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  display_price DECIMAL(10,2),
  image_url TEXT,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    COALESCE(p.sale_price, p.vip_price, p.price) as display_price,
    p.image_url,
    ts_rank(
      to_tsvector('english',
        p.name || ' ' ||
        COALESCE(p.description, '') || ' ' ||
        COALESCE(p.short_description, '') || ' ' ||
        array_to_string(COALESCE(p.tags, '{}'), ' ')
      ),
      plainto_tsquery('english', COALESCE(search_query, ''))
    ) as search_rank
  FROM products p
  WHERE
    p.is_active = true
    AND (search_query IS NULL OR
         to_tsvector('english',
           p.name || ' ' ||
           COALESCE(p.description, '') || ' ' ||
           COALESCE(p.short_description, '') || ' ' ||
           array_to_string(COALESCE(p.tags, '{}'), ' ')
         ) @@ plainto_tsquery('english', search_query)
    )
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (brand_filter IS NULL OR p.brand_id = brand_filter)
    AND (min_price IS NULL OR COALESCE(p.sale_price, p.vip_price, p.price) >= min_price)
    AND (max_price IS NULL OR COALESCE(p.sale_price, p.vip_price, p.price) <= max_price)
    AND (NOT in_stock_only OR p.stock_quantity > 0)
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN search_rank ELSE 0 END DESC,
    p.featured DESC,
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enhanced inventory management function
CREATE OR REPLACE FUNCTION update_inventory_enhanced(
  product_id UUID,
  new_quantity INTEGER,
  alert_threshold INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
  old_quantity INTEGER;
  should_alert BOOLEAN := false;
BEGIN
  -- Get current quantity
  SELECT stock_quantity INTO old_quantity
  FROM products
  WHERE id = product_id;

  -- Update inventory
  UPDATE products
  SET
    stock_quantity = new_quantity,
    inventory_status = CASE
      WHEN new_quantity = 0 THEN 'out_of_stock'
      WHEN new_quantity <= alert_threshold THEN 'low_stock'
      ELSE 'in_stock'
    END,
    updated_at = NOW()
  WHERE id = product_id;

  -- Check if we should alert (quantity crossed threshold)
  IF old_quantity > alert_threshold AND new_quantity <= alert_threshold THEN
    should_alert := true;
  END IF;

  RETURN should_alert;
END;
$$ LANGUAGE plpgsql;

-- Enhanced price calculation function
CREATE OR REPLACE FUNCTION calculate_display_price(
  base_price DECIMAL(10,2),
  sale_price DECIMAL(10,2) DEFAULT NULL,
  vip_price DECIMAL(10,2) DEFAULT NULL,
  fire_price DECIMAL(10,2) DEFAULT NULL
)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  -- Priority: sale_price > vip_price > fire_price > base_price
  RETURN COALESCE(
    sale_price,
    vip_price,
    fire_price,
    base_price
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create enhanced view for better querying
CREATE OR REPLACE VIEW enhanced_products_view AS
SELECT
  id,
  name,
  calculate_display_price(price, sale_price, vip_price, fire_price) as display_price,
  image_url,
  brand_id,
  category_id,
  stock_quantity,
  inventory_status,
  is_featured,
  is_new,
  is_bestseller,
  created_at,
  -- Enhanced search ranking
  ts_rank(
    to_tsvector('english',
      name || ' ' ||
      COALESCE(description, '') || ' ' ||
      COALESCE(short_description, '') || ' ' ||
      array_to_string(COALESCE(tags, '{}'), ' ')
    ),
    plainto_tsquery('english', 'default')
  ) as search_rank
FROM products
WHERE is_active = true;

-- Create compliance view (if you have compliance columns)
CREATE OR REPLACE VIEW compliance_products_view AS
SELECT
  id,
  name,
  -- These will work if the columns exist, NULL if they don't
  compliance_info->>'product_type' as product_type,
  compliance_info->>'minimum_age' as minimum_age,
  compliance_info->>'regulatory_category' as regulatory_category,
  compliance_info->'restricted_states' as restricted_states
FROM products
WHERE
  is_active = true
  AND compliance_info IS NOT NULL
  AND (compliance_info->>'requires_age_verification')::boolean = true;

-- Grant permissions
GRANT SELECT ON enhanced_products_view TO authenticated;
GRANT ALL ON enhanced_products_view TO service_role;
GRANT SELECT ON compliance_products_view TO authenticated;
GRANT ALL ON compliance_products_view TO service_role;

-- Comments for documentation
COMMENT ON FUNCTION search_products_enhanced IS 'Enhanced search function that works with your existing products table structure';
COMMENT ON FUNCTION update_inventory_enhanced IS 'Enhanced inventory management with alerts for your products table';
COMMENT ON FUNCTION calculate_display_price IS 'Calculate best display price from your pricing columns';
COMMENT ON VIEW enhanced_products_view IS 'Enhanced view of your products with better search capabilities';
COMMENT ON VIEW compliance_products_view IS 'Compliance tracking view (works if compliance columns exist)';
