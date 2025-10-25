-- Supabase Migration: Enhanced Functions and Views
-- Deploy advanced search and filtering functions for the enhanced products table

-- Create function to calculate display price
CREATE OR REPLACE FUNCTION get_display_price(product_row main_site_products)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  CASE product_row.display_price_type
    WHEN 'sale_price' THEN
      RETURN COALESCE(product_row.sale_price, product_row.our_price);
    WHEN 'fire_price' THEN
      RETURN COALESCE(product_row.fire_price, product_row.our_price);
    ELSE
      RETURN product_row.our_price;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create advanced search function
CREATE OR REPLACE FUNCTION search_main_site_products(
  search_query TEXT DEFAULT NULL,
  category_ids TEXT[] DEFAULT NULL,
  brand_ids TEXT[] DEFAULT NULL,
  min_price DECIMAL(10,2) DEFAULT NULL,
  max_price DECIMAL(10,2) DEFAULT NULL,
  effects TEXT[] DEFAULT NULL,
  min_thc DECIMAL(5,2) DEFAULT NULL,
  max_thc DECIMAL(5,2) DEFAULT NULL,
  age_restriction INTEGER DEFAULT NULL,
  in_stock_only BOOLEAN DEFAULT false
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  display_price DECIMAL(10,2),
  image_url TEXT,
  cannabinoid_profile JSONB,
  effects_profile JSONB,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    get_display_price(p) as display_price,
    p.image_url,
    p.cannabinoid_profile,
    p.effects_profile,
    ts_rank(
      to_tsvector('english',
        p.name || ' ' ||
        COALESCE(p.description, '') || ' ' ||
        COALESCE(p.short_description, '') || ' ' ||
        array_to_string(COALESCE(p.tags, '{}'), ' ')
      ),
      plainto_tsquery('english', COALESCE(search_query, ''))
    ) as search_rank
  FROM main_site_products p
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
    AND (min_price IS NULL OR get_display_price(p) >= min_price)
    AND (max_price IS NULL OR get_display_price(p) <= max_price)
    AND (effects IS NULL OR p.effects_profile->'primary_effects' ?| effects)
    AND (min_thc IS NULL OR (p.cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal >= min_thc)
    AND (max_thc IS NULL OR (p.cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal <= max_thc)
    AND (age_restriction IS NULL OR (p.compliance_info->>'minimum_age')::integer <= age_restriction)
    AND (NOT in_stock_only OR p.stock_quantity > 0)
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN search_rank ELSE 0 END DESC,
    p.featured DESC,
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get products by cannabinoid profile
CREATE OR REPLACE FUNCTION get_products_by_cannabinoid(
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
  FROM main_site_products p
  WHERE
    p.is_active = true
    AND (p.cannabinoid_profile->'thc_variants'->>cannabinoid_type)::decimal >= min_percentage
    AND (p.cannabinoid_profile->'thc_variants'->>cannabinoid_type)::decimal <= max_percentage
  ORDER BY cannabinoid_value DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get products by effects
CREATE OR REPLACE FUNCTION get_products_by_effects(
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
  FROM main_site_products p
  WHERE
    p.is_active = true
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

-- Create function to update inventory with alerts
CREATE OR REPLACE FUNCTION update_product_inventory(
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
  FROM main_site_products
  WHERE id = product_id;

  -- Update inventory
  UPDATE main_site_products
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

-- Create enhanced view for common queries
CREATE OR REPLACE VIEW product_search_view AS
SELECT
  id,
  name,
  get_display_price(main_site_products) as display_price,
  image_url,
  brand_id,
  category_id,
  stock_quantity,
  inventory_status,
  is_featured,
  is_new,
  is_bestseller,
  cannabinoid_profile->>'dominant_cannabinoid' as dominant_cannabinoid,
  (cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal as thc_percentage,
  (cannabinoid_profile->'other_cannabinoids'->>'cbd')::decimal as cbd_percentage,
  effects_profile->'primary_effects' as primary_effects,
  compliance_info->>'minimum_age' as minimum_age,
  compliance_info->>'product_type' as product_type,
  created_at
FROM main_site_products
WHERE is_active = true;

-- Grant appropriate permissions
GRANT SELECT ON main_site_products TO authenticated;
GRANT ALL ON main_site_products TO service_role;
GRANT SELECT ON product_search_view TO authenticated;
GRANT ALL ON product_search_view TO service_role;

-- Comments for documentation
COMMENT ON TABLE main_site_products IS 'Enhanced main site products table with advanced search, filtering, and compliance tracking';
COMMENT ON FUNCTION search_main_site_products IS 'Advanced search function with filtering by price, effects, cannabinoids, and compliance';
COMMENT ON FUNCTION get_products_by_cannabinoid IS 'Find products by specific cannabinoid content and percentage ranges';
COMMENT ON FUNCTION get_products_by_effects IS 'Find products that match desired effects profile';
COMMENT ON VIEW product_search_view IS 'Search-optimized view of active products with calculated display prices';
