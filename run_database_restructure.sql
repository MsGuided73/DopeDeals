-- Dope City Database Restructure - Main Site Products Table Creation
-- This script creates the foundation for the dual-table architecture

-- Create main site products table (non-nicotine only)
CREATE TABLE IF NOT EXISTS main_site_products (
  -- Core product fields (excluding updated_at which we'll define once at the end)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT,
  price DECIMAL(10,2) NOT NULL,
  vip_price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  brand_id TEXT,
  category_id TEXT,
  supplier_id TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT true,
  weight DECIMAL(8,3),
  dimensions JSONB,
  materials TEXT[],
  image_url TEXT,
  image_urls TEXT[],
  video_urls TEXT[],
  attributes JSONB DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  vip_exclusive BOOLEAN DEFAULT false,
  requires_membership BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Add main site specific fields
  main_site_approved BOOLEAN DEFAULT true,
  main_site_approved_at TIMESTAMPTZ DEFAULT NOW(),
  main_site_approved_by UUID REFERENCES users(id),

  -- Ensure no nicotine products can exist
  nicotine_free BOOLEAN DEFAULT true CHECK (nicotine_free = true),
  tobacco_free BOOLEAN DEFAULT true CHECK (tobacco_free = true),
  farm_bill_compliant BOOLEAN DEFAULT true,

  -- Hemp-specific cannabinoid and potency tracking (JSONB)
  cannabinoid_profile JSONB DEFAULT '{
    "thc_variants": {
      "delta9_thc": 0,
      "delta8_thc": 0,
      "thca": 0,
      "thcp": 0,
      "thcv": 0
    },
    "other_cannabinoids": {
      "cbd": 0,
      "cbg": 0,
      "cbn": 0,
      "cbc": 0
    },
    "total_cannabinoids": 0,
    "dominant_cannabinoid": null,
    "profile_type": "full_spectrum"
  }'::jsonb,

  -- Terpene profile for effects and aroma
  terpene_profile JSONB DEFAULT '{
    "primary_terpenes": [],
    "aroma_notes": [],
    "effects_influence": []
  }'::jsonb,

  -- Effects and benefits profile
  effects_profile JSONB DEFAULT '{
    "primary_effects": [],
    "secondary_effects": [],
    "medicinal_benefits": [],
    "best_for": [],
    "avoid_if": []
  }'::jsonb,

  -- Psychoactive compounds profile
  psychoactive_profile JSONB DEFAULT '{
    "thc_variants": {
      "delta9_thc": 0,
      "delta8_thc": 0,
      "thca": 0,
      "thcp": 0,
      "thcv": 0
    },
    "other_psychoactive": {}
  }'::jsonb,

  -- Single updated_at timestamp (no duplication)
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for main site products
CREATE INDEX IF NOT EXISTS idx_main_site_products_category ON main_site_products(category_id);
CREATE INDEX IF NOT EXISTS idx_main_site_products_brand ON main_site_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_main_site_products_nicotine_free ON main_site_products(nicotine_free) WHERE nicotine_free = true;
CREATE INDEX IF NOT EXISTS idx_main_site_products_compliant ON main_site_products(farm_bill_compliant) WHERE farm_bill_compliant = true;
CREATE INDEX IF NOT EXISTS idx_main_site_products_search ON main_site_products
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, '')));

-- JSONB indexes for cannabinoid and effects data
CREATE INDEX IF NOT EXISTS idx_main_site_cannabinoid_profile ON main_site_products USING GIN (cannabinoid_profile);
CREATE INDEX IF NOT EXISTS idx_main_site_terpene_profile ON main_site_products USING GIN (terpene_profile);
CREATE INDEX IF NOT EXISTS idx_main_site_effects_profile ON main_site_products USING GIN (effects_profile);
CREATE INDEX IF NOT EXISTS idx_main_site_psychoactive_profile ON main_site_products USING GIN (psychoactive_profile);

-- Enable RLS on main site products
ALTER TABLE main_site_products ENABLE ROW LEVEL SECURITY;

-- Main site RLS policy (non-nicotine products only)
DROP POLICY IF EXISTS "main_site_products_only" ON main_site_products;
CREATE POLICY "main_site_products_only" ON main_site_products
  FOR SELECT USING (
    nicotine_free = true
    AND farm_bill_compliant = true
    AND is_active = true
  );

-- Admin policy for main site
DROP POLICY IF EXISTS "main_site_admins_manage" ON main_site_products;
CREATE POLICY "main_site_admins_manage" ON main_site_products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Create tobacco site products table (nicotine only)
CREATE TABLE IF NOT EXISTS tobacco_site_products (
  -- Core product fields (excluding updated_at which we'll define once at the end)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT,
  price DECIMAL(10,2) NOT NULL,
  vip_price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  brand_id TEXT,
  category_id TEXT,
  supplier_id TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT true,
  weight DECIMAL(8,3),
  dimensions JSONB,
  materials TEXT[],
  image_url TEXT,
  image_urls TEXT[],
  video_urls TEXT[],
  attributes JSONB DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  vip_exclusive BOOLEAN DEFAULT false,
  requires_membership BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Add tobacco site specific fields
  tobacco_site_approved BOOLEAN DEFAULT true,
  tobacco_site_approved_at TIMESTAMPTZ DEFAULT NOW(),
  tobacco_site_approved_by UUID REFERENCES users(id),

  -- Ensure only nicotine products exist
  nicotine_free BOOLEAN DEFAULT false CHECK (nicotine_free = false),
  contains_tobacco BOOLEAN DEFAULT true,
  age_restriction INTEGER DEFAULT 21,
  requires_id_verification BOOLEAN DEFAULT true,

  -- Single updated_at timestamp (no duplication)
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for tobacco site products
CREATE INDEX IF NOT EXISTS idx_tobacco_site_products_category ON tobacco_site_products(category_id);
CREATE INDEX IF NOT EXISTS idx_tobacco_site_products_brand ON tobacco_site_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_tobacco_site_products_nicotine ON tobacco_site_products(nicotine_free) WHERE nicotine_free = false;
CREATE INDEX IF NOT EXISTS idx_tobacco_site_products_age_restriction ON tobacco_site_products(age_restriction);

-- Enable RLS on tobacco site products
ALTER TABLE tobacco_site_products ENABLE ROW LEVEL SECURITY;

-- Tobacco site RLS policy (nicotine products only)
DROP POLICY IF EXISTS "tobacco_site_products_only" ON tobacco_site_products;
CREATE POLICY "tobacco_site_products_only" ON tobacco_site_products
  FOR SELECT USING (
    nicotine_free = false
    AND is_active = true
    AND auth.role() = 'authenticated'
  );

-- Admin policy for tobacco site
DROP POLICY IF EXISTS "tobacco_site_admins_manage" ON tobacco_site_products;
CREATE POLICY "tobacco_site_admins_manage" ON tobacco_site_products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Create compatibility views
DROP VIEW IF EXISTS main_site_products_view;
CREATE VIEW main_site_products_view AS
SELECT * FROM main_site_products WHERE is_active = true;

DROP VIEW IF EXISTS tobacco_site_products_view;
CREATE VIEW tobacco_site_products_view AS
SELECT * FROM tobacco_site_products WHERE is_active = true;

DROP VIEW IF EXISTS all_products_view;
CREATE VIEW all_products_view AS
SELECT
  'main_site' as site_type,
  id, name, description, short_description, sku, price, vip_price,
  compare_at_price, brand_id, category_id, stock_quantity,
  weight, dimensions, materials, image_url, image_urls, video_urls,
  attributes, specs, tags, is_active, featured, vip_exclusive,
  seo_title, seo_description, seo_keywords, created_at, updated_at
FROM main_site_products
UNION ALL
SELECT
  'tobacco_site' as site_type,
  id, name, description, short_description, sku, price, vip_price,
  compare_at_price, brand_id, category_id, stock_quantity,
  weight, dimensions, materials, image_url, image_urls, video_urls,
  attributes, specs, tags, is_active, featured, vip_exclusive,
  seo_title, seo_description, seo_keywords, created_at, updated_at
FROM tobacco_site_products;

-- Grant permissions
GRANT SELECT ON main_site_products_view TO authenticated;
GRANT SELECT ON tobacco_site_products_view TO authenticated;
GRANT SELECT ON all_products_view TO authenticated;
GRANT ALL ON main_site_products TO service_role;
GRANT ALL ON tobacco_site_products TO service_role;

-- Verification queries
SELECT 'main_site_products' as table_name, COUNT(*) as record_count FROM main_site_products
UNION ALL
SELECT 'tobacco_site_products' as table_name, COUNT(*) as record_count FROM tobacco_site_products
UNION ALL
SELECT 'Total in views' as table_name, COUNT(*) as record_count FROM all_products_view;
