-- Create THCA Vector Search RPC Function
-- This function provides vector-based search for THCA products with advanced filtering

CREATE OR REPLACE FUNCTION public.thca_vector_search(
  query_embedding vector,
  filters jsonb DEFAULT '{}'::jsonb,
  page_size int DEFAULT 24,
  page int DEFAULT 1
)
RETURNS TABLE(
  id uuid,
  name text,
  price decimal(10,2),
  sale_price decimal(10,2),
  image_url text,
  brand text,
  category text,
  subcategory text,
  stock_quantity int,
  inventory_status text,
  is_active boolean,
  featured boolean,
  cannabinoid_type text,
  search_rank real,
  total_count bigint
) AS $$
DECLARE
  offset_val int := (page - 1) * page_size;
  total_count_val bigint;
  brand_filter text[];
  category_filter text[];
  subcategory_filter text[];
  min_price decimal(10,2);
  max_price decimal(10,2);
  in_stock_only boolean := false;
  on_sale_only boolean := false;
  is_new_only boolean := false;
  featured_only boolean := false;
BEGIN
  -- Extract filters from JSONB
  brand_filter := CASE WHEN filters ? 'brands' AND jsonb_typeof(filters->'brands') = 'array'
    THEN array_agg(trim(b)::text)
    FROM jsonb_array_elements_text(filters->'brands') b
    ELSE NULL END;

  category_filter := CASE WHEN filters ? 'categories' AND jsonb_typeof(filters->'categories') = 'array'
    THEN array_agg(trim(c)::text)
    FROM jsonb_array_elements_text(filters->'categories') c
    ELSE NULL END;

  subcategory_filter := CASE WHEN filters ? 'subcategories' AND jsonb_typeof(filters->'subcategories') = 'array'
    THEN array_agg(trim(s)::text)
    FROM jsonb_array_elements_text(filters->'subcategories') s
    ELSE NULL END;

  min_price := CASE WHEN filters ? 'minPrice' THEN (filters->>'minPrice')::decimal(10,2) ELSE NULL END;
  max_price := CASE WHEN filters ? 'maxPrice' THEN (filters->>'maxPrice')::decimal(10,2) ELSE NULL END;
  in_stock_only := COALESCE((filters->>'inStock')::boolean, false);
  on_sale_only := COALESCE((filters->>'onSale')::boolean, false);
  is_new_only := COALESCE((filters->>'isNew')::boolean, false);
  featured_only := COALESCE((filters->>'featured')::boolean, false);

  -- Get total count for pagination
  SELECT COUNT(*) INTO total_count_val
  FROM main_site_products p
  WHERE p.is_active = true
    AND (p.cannabinoid_profile->'thc_variants'->>'thca')::decimal > 0
    AND (query_embedding IS NULL OR p.search_vec <=> query_embedding < 0.8)
    AND (brand_filter IS NULL OR p.brand_id = ANY(brand_filter))
    AND (category_filter IS NULL OR p.category_id = ANY(category_filter))
    AND (subcategory_filter IS NULL OR p.category_id = ANY(subcategory_filter))
    AND (min_price IS NULL OR get_display_price(p) >= min_price)
    AND (max_price IS NULL OR get_display_price(p) <= max_price)
    AND (NOT in_stock_only OR p.stock_quantity > 0)
    AND (NOT on_sale_only OR p.sale_price IS NOT NULL)
    AND (NOT is_new_only OR p.is_new = true)
    AND (NOT featured_only OR p.featured = true);

  -- Return paginated results with ranking
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    get_display_price(p) as price,
    p.sale_price,
    p.image_url,
    COALESCE(p.brand_id, '') as brand,
    COALESCE(p.category_id, '') as category,
    COALESCE(p.category_id, '') as subcategory, -- Using category_id as subcategory for now
    p.stock_quantity,
    p.inventory_status,
    p.is_active,
    p.featured,
    'THCA' as cannabinoid_type,
    CASE
      WHEN query_embedding IS NOT NULL THEN
        1 - (p.search_vec <=> query_embedding)
      ELSE 1.0
    END as search_rank,
    total_count_val as total_count
  FROM main_site_products p
  WHERE p.is_active = true
    AND (p.cannabinoid_profile->'thc_variants'->>'thca')::decimal > 0
    AND (query_embedding IS NULL OR p.search_vec <=> query_embedding < 0.8)
    AND (brand_filter IS NULL OR p.brand_id = ANY(brand_filter))
    AND (category_filter IS NULL OR p.category_id = ANY(category_filter))
    AND (subcategory_filter IS NULL OR p.category_id = ANY(subcategory_filter))
    AND (min_price IS NULL OR get_display_price(p) >= min_price)
    AND (max_price IS NULL OR get_display_price(p) <= max_price)
    AND (NOT in_stock_only OR p.stock_quantity > 0)
    AND (NOT on_sale_only OR p.sale_price IS NOT NULL)
    AND (NOT is_new_only OR p.is_new = true)
    AND (NOT featured_only OR p.featured = true)
  ORDER BY
    search_rank DESC,
    p.featured DESC,
    p.created_at DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.thca_vector_search(vector, jsonb, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.thca_vector_search(vector, jsonb, int, int) TO service_role;

-- Add comment for documentation
COMMENT ON FUNCTION public.thca_vector_search(vector, jsonb, int, int) IS 'Vector search function for THCA products with advanced filtering and pagination';
