-- Add categories JSONB column to main_site_products table
-- This allows for multiple categories per product while keeping category_id for backward compatibility

-- Add new jsonb column for multiple categories
ALTER TABLE main_site_products ADD COLUMN categories JSONB DEFAULT '[]'::jsonb;

-- Migrate existing category_id data to categories array
UPDATE main_site_products
SET categories = jsonb_build_array(category_id)
WHERE category_id IS NOT NULL AND category_id != '';

-- Add index for performance on JSONB queries
CREATE INDEX idx_main_site_products_categories ON main_site_products USING gin(categories);

-- Add index for category_id lookups (still needed for backward compatibility)
CREATE INDEX idx_main_site_products_category_id_text ON main_site_products(category_id) WHERE category_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN main_site_products.categories IS 'Array of category IDs/paths for flexible categorization (e.g., ["pipes", "glass", "hand-pipes"])';

-- Create function to check if product belongs to category
CREATE OR REPLACE FUNCTION product_has_category(product_row main_site_products, target_category text)
RETURNS boolean AS $$
BEGIN
  -- Check single category_id field
  IF product_row.category_id = target_category THEN
    RETURN true;
  END IF;

  -- Check categories array
  IF product_row.categories IS NOT NULL AND jsonb_exists(product_row.categories, target_category) THEN
    RETURN true;
  END IF;

  -- Check if target_category exists in any categories array element
  IF product_row.categories IS NOT NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(product_row.categories) AS cat
      WHERE cat ILIKE '%' || target_category || '%'
    );
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant permissions
GRANT SELECT ON main_site_products TO authenticated;
GRANT ALL ON main_site_products TO service_role;
