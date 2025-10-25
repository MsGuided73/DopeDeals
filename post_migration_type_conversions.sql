-- Post-Migration Type Conversions
-- Run this AFTER importing your CSV data to optimize column types

-- 1. Convert boolean-like text columns to actual BOOLEAN
-- Update columns that contain 'true'/'false' or 'yes'/'no' text

ALTER TABLE products ADD COLUMN IF NOT EXISTS requires_age_verification BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN;

-- Convert text booleans to actual booleans
UPDATE products SET
  requires_age_verification = CASE
    WHEN "Nicotine Product" ILIKE '%true%' OR "Nicotine Product" ILIKE '%yes%' THEN true
    WHEN "Nicotine Product" ILIKE '%false%' OR "Nicotine Product" ILIKE '%no%' THEN false
    ELSE false
  END,
  is_featured = CASE
    WHEN "Featured" ILIKE '%true%' OR "Featured" ILIKE '%yes%' THEN true
    ELSE false
  END,
  is_bestseller = CASE
    WHEN "Bestseller" ILIKE '%true%' OR "Bestseller" ILIKE '%yes%' THEN true
    ELSE false
  END,
  is_active = CASE
    WHEN "Visibility in catalog" = 'visible' THEN true
    WHEN "Visibility in catalog" = 'hidden' THEN false
    ELSE true
  END;

-- 2. Add JSONB columns for advanced features (initially empty)
ALTER TABLE products ADD COLUMN IF NOT EXISTS compliance_info JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS cannabinoid_profile JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS effects_profile JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_attributes JSONB DEFAULT '{}';

-- 3. Convert your attribute columns to JSONB
UPDATE products SET
  product_attributes = jsonb_build_object(
    'attribute_1_name', "Attribute 1 name",
    'attribute_1_values', "Attribute 1 value(s)",
    'attribute_2_name', "Attribute 2 name",
    'attribute_2_values', "Attribute 2 value(s)"
  )
WHERE "Attribute 1 name" IS NOT NULL OR "Attribute 2 name" IS NOT NULL;

-- 4. Convert Categories and Tags to arrays for better querying
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories_array TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags_array TEXT[];

UPDATE products SET
  categories_array = string_to_array(REPLACE("Categories", '|', ','), ','),
  tags_array = string_to_array(REPLACE("Tags", '|', ','), ',')
WHERE "Categories" IS NOT NULL OR "Tags" IS NOT NULL;

-- 5. Add computed columns for better performance
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update computed columns
UPDATE products SET
  display_price = get_your_display_price("Regular Price", "Sale Price"),
  search_vector = to_tsvector('english',
    COALESCE("Name", '') || ' ' ||
    COALESCE("Short Description", '') || ' ' ||
    COALESCE("Description", '') || ' ' ||
    COALESCE("Brand", '') || ' ' ||
    array_to_string(COALESCE(tags_array, '{}'), ' ')
  );

-- 6. Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_display_price ON products(display_price);
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_compliance_info ON products USING gin(compliance_info);
CREATE INDEX IF NOT EXISTS idx_products_categories_array ON products USING gin(categories_array);
CREATE INDEX IF NOT EXISTS idx_products_tags_array ON products USING gin(tags_array);

-- 7. Create a function to update search vectors (for future use)
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW."Name", '') || ' ' ||
    COALESCE(NEW."Short Description", '') || ' ' ||
    COALESCE(NEW."Description", '') || ' ' ||
    COALESCE(NEW."Brand", '') || ' ' ||
    array_to_string(COALESCE(NEW.tags_array, '{}'), ' ')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic search vector updates
DROP TRIGGER IF EXISTS trigger_update_search_vector ON products;
CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- 8. Create a comprehensive product view with all enhancements
CREATE OR REPLACE VIEW complete_products_view AS
SELECT
  p.*,
  p.display_price,
  p.search_vector,
  p.categories_array,
  p.tags_array,
  p.product_attributes,
  -- Nicotine/restricted products detection
  CASE
    WHEN p."Nicotine Product" ILIKE '%true%' THEN 'nicotine'
    WHEN p."Name" ILIKE '%kratom%' THEN 'kratom'
    WHEN p."Name" ILIKE '%7-hydroxy%' THEN 'hydroxy'
    ELSE 'general'
  END as product_category,
  -- Age restriction detection
  CASE
    WHEN p."Nicotine Product" ILIKE '%true%' THEN 21
    WHEN p.product_category IN ('kratom', 'hydroxy') THEN 21
    ELSE 18
  END as minimum_age
FROM products p;

-- Grant permissions
GRANT SELECT ON complete_products_view TO authenticated;
GRANT ALL ON complete_products_view TO service_role;

-- Comments
COMMENT ON VIEW complete_products_view IS 'Complete product view with all enhancements and computed columns';
COMMENT ON FUNCTION update_product_search_vector IS 'Automatically updates search vectors when products are modified';
