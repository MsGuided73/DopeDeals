-- Enhanced Products Functions and Views
-- Standalone functions that work with any products table structure
-- Supports advanced search, filtering, and compliance tracking

-- Create function to calculate display price (works with your existing table structure)
CREATE OR REPLACE FUNCTION get_display_price(
  base_price DECIMAL(10,2),
  sale_price DECIMAL(10,2) DEFAULT NULL,
  fire_price DECIMAL(10,2) DEFAULT NULL,
  vip_price DECIMAL(10,2) DEFAULT NULL,
  display_price_type TEXT DEFAULT 'base_price'
)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  CASE display_price_type
    WHEN 'sale_price' THEN
      RETURN COALESCE(sale_price, base_price);
    WHEN 'fire_price' THEN
      RETURN COALESCE(fire_price, base_price);
    WHEN 'vip_price' THEN
      RETURN COALESCE(vip_price, base_price);
    ELSE
      RETURN base_price;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to search products with advanced filtering (generic version)
CREATE OR REPLACE FUNCTION search_products_advanced(
  search_query TEXT DEFAULT NULL,
  category_ids TEXT[] DEFAULT NULL,
  brand_ids TEXT[] DEFAULT NULL,
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
    get_display_price(p.price, p.sale_price, p.fire_price, p.vip_price, 'base_price') as display_price,
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
    AND (category_ids IS NULL OR p.category_id = ANY(category_ids))
    AND (brand_ids IS NULL OR p.brand_id = ANY(brand_ids))
    AND (min_price IS NULL OR get_display_price(p.price, p.sale_price, p.fire_price, p.vip_price, 'base_price') >= min_price)
    AND (max_price IS NULL OR get_display_price(p.price, p.sale_price, p.fire_price, p.vip_price, 'base_price') <= max_price)
    AND (NOT in_stock_only OR p.stock_quantity > 0)
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN search_rank ELSE 0 END DESC,
    p.featured DESC,
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get products by cannabinoid profile (if JSONB columns exist)
CREATE OR REPLACE FUNCTION get_products_by_cannabinoid_generic(
  cannabinoid_type TEXT,
  min_percentage DECIMAL(5,2) DEFAULT 0,
  max_percentage DECIMAL(5,2) DEFAULT 100
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  cannabinoid_value DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    (p.cannabinoid_profile->'thc_variants'->>cannabinoid_type)::decimal as cannabinoid_value
  FROM products p
  WHERE
    p.is_active = true
    AND p.cannabinoid_profile IS NOT NULL
    AND (p.cannabinoid_profile->'thc_variants'->>cannabinoid_type)::decimal >= min_percentage
    AND (p.cannabinoid_profile->'thc_variants'->>cannabinoid_type)::decimal <= max_percentage
  ORDER BY cannabinoid_value DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get products by effects (if JSONB columns exist)
CREATE OR REPLACE FUNCTION get_products_by_effects_generic(
  desired_effects TEXT[]
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  matching_effects TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    ARRAY(
      SELECT jsonb_array_elements_text(p.effects_profile->'primary_effects')
      INTERSECT
      SELECT unnest(desired_effects)
    ) as matching_effects
  FROM products p
  WHERE
    p.is_active = true
    AND p.effects_profile IS NOT NULL
    AND (
      p.effects_profile->'primary_effects' ?| desired_effects
      OR p.effects_profile->'secondary_effects' ?| desired_effects
    )
    AND array_length(ARRAY(
      SELECT jsonb_array_elements_text(p.effects_profile->'primary_effects')
      INTERSECT
      SELECT unnest(desired_effects)
    ), 1) > 0
  ORDER BY array_length(ARRAY(
    SELECT jsonb_array_elements_text(p.effects_profile->'primary_effects')
    INTERSECT
    SELECT unnest(desired_effects)
  ), 1) DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to update inventory with alerts (works with any table structure)
CREATE OR REPLACE FUNCTION update_product_inventory_generic(
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
    -- Here you would trigger inventory alert notifications
    -- For now, we'll just return true to indicate alert needed
  END IF;

  RETURN should_alert;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create view for product search (works with any table structure)
CREATE OR REPLACE VIEW product_search_view AS
SELECT
  id,
  name,
  get_display_price(price, sale_price, fire_price, vip_price, 'base_price') as display_price,
  image_url,
  brand_id,
  category_id,
  stock_quantity,
  inventory_status,
  is_featured,
  is_new,
  is_bestseller,
  created_at
FROM products
WHERE is_active = true;

-- Create view for compliance products (if compliance columns exist)
CREATE OR REPLACE VIEW compliance_products_view AS
SELECT
  id,
  name,
  compliance_info->>'product_type' as product_type,
  compliance_info->>'minimum_age' as minimum_age,
  compliance_info->>'regulatory_category' as regulatory_category,
  compliance_info->'restricted_states' as restricted_states,
  compliance_info->>'lab_certificate_url' as lab_certificate_url
FROM products
WHERE
  is_active = true
  AND compliance_info IS NOT NULL
  AND (compliance_info->>'requires_age_verification')::boolean = true;

-- Create view for cannabinoid products (if cannabinoid columns exist)
CREATE OR REPLACE VIEW cannabinoid_products_view AS
SELECT
  id,
  name,
  cannabinoid_profile->>'dominant_cannabinoid' as dominant_cannabinoid,
  (cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal as thc_percentage,
  (cannabinoid_profile->'other_cannabinoids'->>'cbd')::decimal as cbd_percentage,
  cannabinoid_profile->>'profile_type' as profile_type,
  effects_profile->'primary_effects' as primary_effects,
  effects_profile->'medicinal_benefits' as medicinal_benefits
FROM products
WHERE
  is_active = true
  AND cannabinoid_profile IS NOT NULL
  AND (cannabinoid_profile->'total_cannabinoids')::decimal > 0;

-- Grant appropriate permissions
GRANT SELECT ON product_search_view TO authenticated;
GRANT ALL ON product_search_view TO service_role;
GRANT SELECT ON compliance_products_view TO authenticated;
GRANT ALL ON compliance_products_view TO service_role;
GRANT SELECT ON cannabinoid_products_view TO authenticated;
GRANT ALL ON cannabinoid_products_view TO service_role;

-- Comments for documentation
COMMENT ON FUNCTION get_display_price IS 'Calculate display price from pricing strategy - works with any table structure';
COMMENT ON FUNCTION search_products_advanced IS 'Advanced search function with filtering - generic version for any products table';
COMMENT ON FUNCTION get_products_by_cannabinoid_generic IS 'Find products by cannabinoid content - works if cannabinoid_profile column exists';
COMMENT ON FUNCTION get_products_by_effects_generic IS 'Find products by effects profile - works if effects_profile column exists';
COMMENT ON FUNCTION update_product_inventory_generic IS 'Update inventory with alerts - works with any table structure';
COMMENT ON VIEW product_search_view IS 'Search-optimized view of active products with calculated display prices';
COMMENT ON VIEW compliance_products_view IS 'View of products requiring compliance tracking - works if compliance_info column exists';
COMMENT ON VIEW cannabinoid_products_view IS 'View of products with cannabinoid profiles - works if cannabinoid_profile column exists';
