-- Enhanced Main Site Products Schema
-- Based on comprehensive database restructuring plan
-- Supports advanced search, filtering, and compliance tracking

-- Drop existing table if it exists to ensure clean slate
DROP TABLE IF EXISTS main_site_products CASCADE;

-- Create enhanced main site products table
CREATE TABLE IF NOT EXISTS main_site_products (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic product information
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,

  -- Advanced pricing strategy
  our_price DECIMAL(10,2) NOT NULL CHECK (our_price > 0),
  their_price DECIMAL(10,2), -- Competitor price for comparison
  sale_price DECIMAL(10,2), -- Sale price (optional)
  fire_price DECIMAL(10,2), -- Special promotional price (optional)
  cost_price DECIMAL(10,2), -- Cost to business

  -- Price display logic (which price to show)
  display_price_type TEXT DEFAULT 'our_price' CHECK (display_price_type IN ('our_price', 'sale_price', 'fire_price')),
  price_comparison_enabled BOOLEAN DEFAULT true,

  -- Organization
  brand_id TEXT,
  category_id TEXT,
  supplier_id TEXT,

  -- Inventory management
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT true,
  inventory_status TEXT DEFAULT 'in_stock' CHECK (inventory_status IN ('in_stock', 'low_stock', 'out_of_stock', 'discontinued', 'pre_order')),

  -- Physical attributes
  weight DECIMAL(8,3),
  weight_unit TEXT DEFAULT 'oz' CHECK (weight_unit IN ('oz', 'g', 'lb', 'kg')),
  dimensions JSONB, -- {length, width, height, unit}
  materials TEXT[],

  -- Media and content
  image_url TEXT,
  image_urls TEXT[],
  video_urls TEXT[],
  gallery_images JSONB, -- {url, alt, caption, order}

  -- Product attributes and specifications
  attributes JSONB DEFAULT '{}', -- Flexible key-value pairs
  specs JSONB DEFAULT '{}', -- Technical specifications
  tags TEXT[],

  -- CANNABINOID PROFILE (JSONB) - For hemp/cannabis products
  cannabinoid_profile JSONB DEFAULT '{
    "thc_variants": {
      "delta9_thc": 0.0,
      "delta8_thc": 0.0,
      "thca": 0.0,
      "thcp": 0.0,
      "thcv": 0.0
    },
    "other_cannabinoids": {
      "cbd": 0.0,
      "cbg": 0.0,
      "cbn": 0.0,
      "cbc": 0.0
    },
    "total_cannabinoids": 0.0,
    "dominant_cannabinoid": "cbd",
    "profile_type": "isolate"
  }'::jsonb,

  -- EFFECTS PROFILE (JSONB) - User effects and benefits
  effects_profile JSONB DEFAULT '{
    "primary_effects": [],
    "secondary_effects": [],
    "medicinal_benefits": [],
    "best_for": [],
    "avoid_if": []
  }'::jsonb,

  -- TERPENE PROFILE (JSONB) - Aroma and effects
  terpene_profile JSONB DEFAULT '{
    "primary_terpenes": [],
    "aroma_notes": [],
    "effects_influence": []
  }'::jsonb,

  -- PSYCHOACTIVE PROFILE (JSONB) - For Kratom, 7-Hydroxy, N2O, Magic Mushrooms
  psychoactive_profile JSONB DEFAULT '{
    "thc_variants": {
      "delta9_thc": 0.0,
      "delta8_thc": 0.0,
      "thca": 0.0,
      "thcp": 0.0,
      "thcv": 0.0
    },
    "other_psychoactive": {
      "7_hydroxy_mitragynine": 0.0,
      "mitragynine": 0.0
    }
  }'::jsonb,

  -- COMPLIANCE TRACKING - For regulated products
  compliance_info JSONB DEFAULT '{
    "requires_age_verification": false,
    "minimum_age": 18,
    "restricted_states": [],
    "restricted_zipcodes": [],
    "requires_lab_testing": false,
    "lab_certificate_url": null,
    "product_type": "general",
    "regulatory_category": "unregulated"
  }'::jsonb,

  -- PRODUCT VARIATIONS - Support for different sizes, flavors, etc.
  variations JSONB DEFAULT '[]'::jsonb, -- Array of variation objects
  parent_product_id UUID REFERENCES main_site_products(id), -- For variation relationships

  -- SEO and marketing
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  meta_data JSONB DEFAULT '{}',

  -- Status and visibility
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,

  -- Farm Bill compliance (for hemp products)
  farm_bill_compliant BOOLEAN DEFAULT true,
  thc_compliant BOOLEAN DEFAULT true,

  -- External integrations
  zoho_item_id TEXT UNIQUE,
  zoho_last_sync TIMESTAMP WITH TIME ZONE,

  -- Search optimization
  search_keywords TEXT[], -- Additional searchable terms
  search_boost DECIMAL(3,2) DEFAULT 1.0, -- Boost search ranking

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_pricing CHECK (
    (sale_price IS NULL OR sale_price <= our_price) AND
    (fire_price IS NULL OR fire_price <= our_price) AND
    (their_price IS NULL OR their_price >= our_price)
  ),
  CONSTRAINT valid_stock CHECK (stock_quantity >= 0),
  CONSTRAINT valid_thc_content CHECK (
    (cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal >= 0 AND
    (cannabinoid_profile->'thc_variants'->>'delta9_thc')::decimal <= 100
  )
);

-- Create performance indexes (DROP IF EXISTS first to avoid conflicts)
DROP INDEX IF EXISTS idx_main_site_products_sku;
DROP INDEX IF EXISTS idx_main_site_products_brand;
DROP INDEX IF EXISTS idx_main_site_products_category;
DROP INDEX IF EXISTS idx_main_site_products_active;
DROP INDEX IF EXISTS idx_main_site_products_featured;
DROP INDEX IF EXISTS idx_main_site_products_pricing;
DROP INDEX IF EXISTS idx_main_site_products_stock;
DROP INDEX IF EXISTS idx_main_site_products_compliance;
DROP INDEX IF EXISTS idx_main_site_products_created;
DROP INDEX IF EXISTS idx_main_site_products_zoho;
DROP INDEX IF EXISTS idx_main_site_products_search;
DROP INDEX IF EXISTS idx_main_site_cannabinoid_profile;
DROP INDEX IF EXISTS idx_main_site_effects_profile;
DROP INDEX IF EXISTS idx_main_site_terpene_profile;
DROP INDEX IF EXISTS idx_main_site_psychoactive_profile;
DROP INDEX IF EXISTS idx_main_site_compliance_info;
DROP INDEX IF EXISTS idx_main_site_thc_content;
DROP INDEX IF EXISTS idx_main_site_primary_effects;
DROP INDEX IF EXISTS idx_main_site_age_restriction;

-- Create performance indexes
CREATE INDEX idx_main_site_products_sku ON main_site_products(sku);
CREATE INDEX idx_main_site_products_brand ON main_site_products(brand_id);
CREATE INDEX idx_main_site_products_category ON main_site_products(category_id);
CREATE INDEX idx_main_site_products_active ON main_site_products(is_active);
CREATE INDEX idx_main_site_products_featured ON main_site_products(featured);
CREATE INDEX idx_main_site_products_pricing ON main_site_products(our_price, sale_price, fire_price, display_price_type);
CREATE INDEX idx_main_site_products_stock ON main_site_products(stock_quantity);
CREATE INDEX idx_main_site_products_compliance ON main_site_products(farm_bill_compliant, thc_compliant);
CREATE INDEX idx_main_site_products_created ON main_site_products(created_at);
CREATE INDEX idx_main_site_products_zoho ON main_site_products(zoho_item_id);

-- Full-text search index for advanced search capabilities
CREATE INDEX idx_main_site_products_search ON main_site_products
USING gin(to_tsvector('english',
  name || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(short_description, '') || ' ' ||
  COALESCE(seo_title, '') || ' ' ||
  array_to_string(COALESCE(tags, '{}'), ' ') || ' ' ||
  array_to_string(COALESCE(search_keywords, '{}'), ' ')
));

-- GIN indexes for JSONB fields (crucial for advanced filtering)
CREATE INDEX idx_main_site_cannabinoid_profile ON main_site_products
USING gin(cannabinoid_profile);

CREATE INDEX idx_main_site_effects_profile ON main_site_products
USING gin(effects_profile);

CREATE INDEX idx_main_site_terpene_profile ON main_site_products
USING gin(terpene_profile);

CREATE INDEX idx_main_site_psychoactive_profile ON main_site_products
USING gin(psychoactive_profile);

CREATE INDEX idx_main_site_compliance_info ON main_site_products
USING gin(compliance_info);

-- Specialized indexes for common queries
CREATE INDEX idx_main_site_thc_content ON main_site_products
USING gin((cannabinoid_profile->'thc_variants'));

CREATE INDEX idx_main_site_primary_effects ON main_site_products
USING gin((effects_profile->'primary_effects'));

CREATE INDEX idx_main_site_age_restriction ON main_site_products
USING gin((compliance_info->'minimum_age'));

-- Enable Row Level Security
ALTER TABLE main_site_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "main_site_products_visible" ON main_site_products
  FOR SELECT USING (
    is_active = true AND
    farm_bill_compliant = true AND
    thc_compliant = true
  );

CREATE POLICY "main_site_admins_manage" ON main_site_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_main_site_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_main_site_products_updated_at
  BEFORE UPDATE ON main_site_products
  FOR EACH ROW
  EXECUTE FUNCTION update_main_site_products_updated_at();

-- Create function to calculate display price (IMMUTABLE for index usage)
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

-- Create function to search products with advanced filtering
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
    -- Here you would trigger inventory alert notifications
    -- For now, we'll just return true to indicate alert needed
  END IF;

  RETURN should_alert;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO main_site_products (
  name,
  description,
  sku,
  our_price,
  their_price,
  sale_price,
  brand_id,
  category_id,
  stock_quantity,
  tags,
  cannabinoid_profile,
  effects_profile,
  compliance_info,
  search_keywords
) VALUES
(
  'Premium CBD Flower - Sour Space Candy',
  'High-quality hemp flower with sweet and sour terpene profile. Perfect for daytime use.',
  'CBD-FLWR-001',
  45.00,
  55.00,
  39.99,
  'premium-hemp',
  'cbd-flower',
  25,
  ARRAY['cbd', 'hemp', 'flower', 'sour space candy'],
  '{
    "thc_variants": {
      "delta9_thc": 0.15,
      "delta8_thc": 0.0,
      "thca": 0.05,
      "thcp": 0.0,
      "thcv": 0.0
    },
    "other_cannabinoids": {
      "cbd": 18.5,
      "cbg": 0.8,
      "cbn": 0.1,
      "cbc": 0.3
    },
    "total_cannabinoids": 19.9,
    "dominant_cannabinoid": "cbd",
    "profile_type": "full_spectrum"
  }'::jsonb,
  '{
    "primary_effects": ["relaxed", "focused", "creative"],
    "secondary_effects": ["uplifted", "energetic"],
    "medicinal_benefits": ["stress_reduction", "mood_enhancement"],
    "best_for": ["daytime_use", "creative_work", "social_gathering"],
    "avoid_if": ["first_time_users"]
  }'::jsonb,
  '{
    "requires_age_verification": true,
    "minimum_age": 18,
    "restricted_states": [],
    "restricted_zipcodes": [],
    "requires_lab_testing": true,
    "lab_certificate_url": "https://example.com/lab-certificates/cbd-flower-001",
    "product_type": "hemp_flower",
    "regulatory_category": "farm_bill_compliant"
  }'::jsonb,
  ARRAY['cbd flower', 'hemp flower', 'sour space candy', 'premium hemp']
),
(
  '7-Hydroxy Mitragynine Extract - 20mg Capsules',
  'Premium 7-Hydroxy extract in convenient capsule form. Lab-tested for purity and potency.',
  '7OH-CAPS-020',
  89.99,
  109.99,
  79.99,
  'kratom-labs',
  'kratom-extracts',
  15,
  ARRAY['7-hydroxy', 'kratom', 'extract', 'capsules'],
  '{
    "thc_variants": {
      "delta9_thc": 0.0,
      "delta8_thc": 0.0,
      "thca": 0.0,
      "thcp": 0.0,
      "thcv": 0.0
    },
    "other_cannabinoids": {
      "cbd": 0.0,
      "cbg": 0.0,
      "cbn": 0.0,
      "cbc": 0.0
    },
    "total_cannabinoids": 0.0,
    "dominant_cannabinoid": "cbd",
    "profile_type": "isolate"
  }'::jsonb,
  '{
    "primary_effects": ["euphoric", "relaxed", "pain_relief"],
    "secondary_effects": ["sedated", "sleepy"],
    "medicinal_benefits": ["pain_management", "anxiety_reduction", "sleep_aid"],
    "best_for": ["evening_use", "pain_relief", "relaxation"],
    "avoid_if": ["operating_heavy_machinery", "daytime_use"]
  }'::jsonb,
  '{
    "requires_age_verification": true,
    "minimum_age": 21,
    "restricted_states": ["AL", "AR", "IN", "RI", "VT", "WI"],
    "restricted_zipcodes": [],
    "requires_lab_testing": true,
    "lab_certificate_url": "https://example.com/lab-certificates/7oh-caps-020",
    "product_type": "kratom_extract",
    "regulatory_category": "restricted_psychoactive"
  }'::jsonb,
  ARRAY['7-hydroxy', 'kratom extract', 'pain relief', 'relaxation']
);

-- Create views for common queries
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
COMMENT ON COLUMN main_site_products.cannabinoid_profile IS 'JSONB field containing THC variants, CBD, and other cannabinoid percentages';
COMMENT ON COLUMN main_site_products.effects_profile IS 'JSONB field containing user effects, medicinal benefits, and usage recommendations';
COMMENT ON COLUMN main_site_products.psychoactive_profile IS 'JSONB field for tracking psychoactive compounds in Kratom, 7-Hydroxy, etc.';
COMMENT ON COLUMN main_site_products.compliance_info IS 'JSONB field for age restrictions, state bans, and regulatory compliance';
COMMENT ON FUNCTION search_main_site_products IS 'Advanced search function with filtering by price, effects, cannabinoids, and compliance';
COMMENT ON FUNCTION get_products_by_cannabinoid IS 'Find products by specific cannabinoid content and percentage ranges';
COMMENT ON FUNCTION get_products_by_effects IS 'Find products that match desired effects profile';
