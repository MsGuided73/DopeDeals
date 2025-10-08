-- Dope City Brands Structure Creation
-- This script creates the brand tier system (Premium/Mid-Range/Budget)

-- Create brands table with tier system
CREATE TABLE IF NOT EXISTS brands_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tier TEXT DEFAULT 'mid-range', -- 'premium', 'mid-range', 'budget'
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert brand tiers based on current product data
INSERT INTO brands_new (name, slug, tier, sort_order)
SELECT DISTINCT
  COALESCE(brand_name, manufacturer, 'Generic') as name,
  LOWER(REPLACE(COALESCE(brand_name, manufacturer, 'generic'), ' ', '-')) as slug,
  CASE
    WHEN brand_name IN ('Puffco', 'ROOR', 'GRAV', 'Higher Standards', 'Storz & Bickel', 'Empire Glassworks') THEN 'premium'
    WHEN brand_name IN ('RAW', 'Elements', 'Santa Cruz Shredder', 'Pulsar', 'Cookies', 'Crave') THEN 'mid-range'
    ELSE 'budget'
  END as tier,
  ROW_NUMBER() OVER (ORDER BY brand_name) as sort_order
FROM (
  SELECT DISTINCT brand_name FROM products WHERE brand_name IS NOT NULL
  UNION
  SELECT DISTINCT manufacturer FROM products WHERE manufacturer IS NOT NULL
) brands
WHERE COALESCE(brand_name, manufacturer, 'Generic') != 'Generic';

-- Create indexes for brands
CREATE INDEX IF NOT EXISTS idx_brands_tier ON brands_new(tier);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands_new(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands_new(sort_order);

-- Create full-text search index for brands
CREATE INDEX IF NOT EXISTS idx_brands_search ON brands_new
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable RLS on brands
ALTER TABLE brands_new ENABLE ROW LEVEL SECURITY;

-- Brands are publicly readable
CREATE POLICY "brands_public_read" ON brands_new
  FOR SELECT USING (is_active = true);

-- Only admins can modify brands
CREATE POLICY "brands_admin_manage" ON brands_new
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Grant permissions
GRANT SELECT ON brands_new TO authenticated;
GRANT ALL ON brands_new TO service_role;

-- Verification queries
SELECT
  tier,
  COUNT(*) as brand_count,
  STRING_AGG(name, ', ') as brands
FROM brands_new
GROUP BY tier
ORDER BY tier;

-- Show brand distribution by tier
SELECT
  tier,
  COUNT(*) as count,
  ARRAY_AGG(name ORDER BY name) as brand_names
FROM brands_new
GROUP BY tier
ORDER BY
  CASE
    WHEN tier = 'premium' THEN 1
    WHEN tier = 'mid-range' THEN 2
    WHEN tier = 'budget' THEN 3
  END;
