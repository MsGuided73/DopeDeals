-- Supabase Migration: Enhanced Products Schema
-- Deploy this after database reset to create enhanced table structure

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

-- Grant appropriate permissions
GRANT SELECT ON main_site_products TO authenticated;
GRANT ALL ON main_site_products TO service_role;

-- Comments for documentation
COMMENT ON TABLE main_site_products IS 'Enhanced main site products table with advanced search, filtering, and compliance tracking';
