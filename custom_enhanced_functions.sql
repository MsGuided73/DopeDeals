-- Custom Enhanced Functions for Your Specific CSV Structure
-- Based on your actual column headers from the enriched inventory

-- Enhanced search function using YOUR exact column names
CREATE OR REPLACE FUNCTION search_your_products(
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
  brand TEXT,
  sku TEXT,
  stock INTEGER,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    -- Use your pricing logic: Sale Price > Regular Price
    COALESCE(
      NULLIF(p."Sale Price", 0),
      NULLIF(p."Regular Price", 0),
      0
    ) as display_price,
    -- Use Images column for image_url (you might need to parse JSON)
    p."Images" as image_url,
    p."Brand" as brand,
    p."SKU" as sku,
    p."Stock" as stock,
    ts_rank(
      to_tsvector('english',
        p."Name" || ' ' ||
        COALESCE(p."Short Description", '') || ' ' ||
        COALESCE(p."Description", '') || ' ' ||
        COALESCE(p."Brand", '') || ' ' ||
        array_to_string(COALESCE(p."Tags", '{}'), ' ')
      ),
      plainto_tsquery('english', COALESCE(search_query, ''))
    ) as search_rank
  FROM products p
  WHERE
    (p."Visibility in catalog" = 'visible' OR p."Visibility in catalog" IS NULL)
    AND (search_query IS NULL OR
         to_tsvector('english',
           p."Name" || ' ' ||
           COALESCE(p."Short Description", '') || ' ' ||
           COALESCE(p."Description", '') || ' ' ||
           COALESCE(p."Brand", '') || ' ' ||
           array_to_string(COALESCE(p."Tags", '{}'), ' ')
         ) @@ plainto_tsquery('english', search_query)
    )
    AND (category_filter IS NULL OR p."Categories" ILIKE '%' || category_filter || '%')
    AND (brand_filter IS NULL OR p."Brand" = brand_filter)
    AND (min_price IS NULL OR COALESCE(NULLIF(p."Sale Price", 0), NULLIF(p."Regular Price", 0), 0) >= min_price)
    AND (max_price IS NULL OR COALESCE(NULLIF(p."Sale Price", 0), NULLIF(p."Regular Price", 0), 0) <= max_price)
    AND (NOT in_stock_only OR p."Stock" > 0)
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN search_rank ELSE 0 END DESC,
    p."Featured" DESC,
    p."Name" ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enhanced inventory function for your structure
CREATE OR REPLACE FUNCTION update_your_inventory(
  product_id UUID,
  new_quantity INTEGER,
  alert_threshold INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_quantity INTEGER;
  should_alert BOOLEAN := false;
  threshold INTEGER;
BEGIN
  -- Use your "Low Stock Amount" as threshold if provided, otherwise use parameter
  SELECT "Stock", "Low Stock Amount"
  INTO old_quantity, threshold
  FROM products
  WHERE id = product_id;

  -- Use your Low Stock Amount if available, otherwise use provided threshold
  threshold := COALESCE(alert_threshold, threshold, 5);

  -- Update inventory using your column names
  UPDATE products
  SET
    "Stock" = new_quantity,
    "Visibility in catalog" = CASE
      WHEN new_quantity = 0 THEN 'hidden'
      ELSE 'visible'
    END
  WHERE id = product_id;

  -- Check if we should alert (quantity crossed threshold)
  IF old_quantity > threshold AND new_quantity <= threshold THEN
    should_alert := true;
  END IF;

  RETURN should_alert;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate display price using YOUR pricing columns
CREATE OR REPLACE FUNCTION get_your_display_price(
  regular_price DECIMAL(10,2) DEFAULT 0,
  sale_price DECIMAL(10,2) DEFAULT 0
)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  -- Your logic: Sale Price takes priority if it exists and is greater than 0
  RETURN CASE
    WHEN sale_price > 0 THEN sale_price
    WHEN regular_price > 0 THEN regular_price
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enhanced view using YOUR column structure
CREATE OR REPLACE VIEW your_enhanced_products AS
SELECT
  id,
  "Name" as name,
  "SKU" as sku,
  "Brand" as brand,
  "Categories" as categories,
  "Tags" as tags,
  get_your_display_price("Regular Price", "Sale Price") as display_price,
  "Images" as images,
  "Stock" as stock_quantity,
  "Low Stock Amount" as low_stock_threshold,
  "Visibility in catalog" as visibility,
  "Type" as product_type,
  "Nicotine Product" as nicotine_product,
  "Short Description" as short_description,
  "Description" as description,
  "Bowl Size" as bowl_size,
  "Weight (lbs)" as weight_lbs,
  "Height (in)" as height_inches,
  "Width (in)" as width_inches,
  "Tax Status" as tax_status,
  "Tax Class" as tax_class,
  "Shipping Class" as shipping_class,
  "Cross-sells" as cross_sells,
  "Attribute 1 name" as attribute_1_name,
  "Attribute 1 value(s)" as attribute_1_values,
  "Attribute 2 name" as attribute_2_name,
  "Attribute 2 value(s)" as attribute_2_values,
  -- Enhanced search ranking
  ts_rank(
    to_tsvector('english',
      "Name" || ' ' ||
      COALESCE("Short Description", '') || ' ' ||
      COALESCE("Description", '') || ' ' ||
      COALESCE("Brand", '') || ' ' ||
      array_to_string(COALESCE("Tags", '{}'), ' ')
    ),
    plainto_tsquery('english', 'default')
  ) as search_rank
FROM products
WHERE "Visibility in catalog" = 'visible' OR "Visibility in catalog" IS NULL;

-- Function to find products by your brand structure
CREATE OR REPLACE FUNCTION get_products_by_brand(
  brand_name TEXT
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  sku TEXT,
  display_price DECIMAL(10,2),
  stock INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p."Name",
    p."SKU",
    get_your_display_price(p."Regular Price", p."Sale Price"),
    p."Stock"
  FROM products p
  WHERE
    p."Brand" = brand_name
    AND (p."Visibility in catalog" = 'visible' OR p."Visibility in catalog" IS NULL)
    AND p."Stock" > 0
  ORDER BY p."Name";
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to find products by your category structure
CREATE OR REPLACE FUNCTION get_products_by_category(
  category_name TEXT
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  sku TEXT,
  brand TEXT,
  display_price DECIMAL(10,2),
  stock INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p."Name",
    p."SKU",
    p."Brand",
    get_your_display_price(p."Regular Price", p."Sale Price"),
    p."Stock"
  FROM products p
  WHERE
    p."Categories" ILIKE '%' || category_name || '%'
    AND (p."Visibility in catalog" = 'visible' OR p."Visibility in catalog" IS NULL)
    AND p."Stock" > 0
  ORDER BY p."Brand", p."Name";
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant permissions
GRANT SELECT ON your_enhanced_products TO authenticated;
GRANT ALL ON your_enhanced_products TO service_role;

-- Comments for documentation
COMMENT ON FUNCTION search_your_products IS 'Enhanced search function using your exact CSV column names';
COMMENT ON FUNCTION update_your_inventory IS 'Inventory management using your Stock and Low Stock Amount columns';
COMMENT ON FUNCTION get_your_display_price IS 'Calculate display price using your Sale Price and Regular Price columns';
COMMENT ON FUNCTION get_products_by_brand IS 'Find products by your Brand column';
COMMENT ON FUNCTION get_products_by_category IS 'Find products by your Categories column';
COMMENT ON VIEW your_enhanced_products IS 'Enhanced view using your exact column structure';
