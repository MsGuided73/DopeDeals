-- Dope City Categories and Brands Structure Creation
-- Combined script for Days 2-3 of the implementation plan

-- =====================================================
-- BRAND TIER SYSTEM DOCUMENTATION
-- =====================================================
--
-- BRAND TIER CLASSIFICATION CRITERIA:
--
-- PREMIUM TIER ($100+ average price):
-- - Puffco: $200-400 vaporizers, patented heat technology, premium materials
-- - ROOR: $150-500 glass pieces, German engineering, collector status
-- - GRAV: $100-300 scientific glass, lab-grade quality, precision manufacturing
-- - Higher Standards: $50-200 accessories, luxury positioning, premium brand
-- - Storz & Bickel: $300-600 vaporizers, medical-grade, clinical precision
-- - Empire Glassworks: $100-400 artistic glass, limited editions, craftsmanship
--
-- MID-RANGE TIER ($20-100 average price):
-- - RAW: $5-50 papers/rolling supplies, established brand, consistent quality
-- - Elements: $10-40 papers/rolling, recognizable brand, good materials
-- - Santa Cruz Shredder: $30-80 grinders, quality aluminum, established reputation
-- - Pulsar: $20-100 vaporizers/glass, good quality, recognizable designs
-- - Cookies: $20-80 accessories, lifestyle brand, growing recognition
-- - Diamond Glass: $50-150 glass pieces, good quality, brand recognition
-- - Hidden Hills: $30-100 hemp products, quality focus, emerging brand
--
-- BUDGET TIER (Under $20 average price):
-- - TrueMoola: Affordable hemp products, value pricing, accessibility focus
-- - Crave: Budget-friendly options, entry-level pricing, basic quality
-- - Generic: Unbranded products, store brands, functional basics
--
-- TIER ASSIGNMENT PROCESS:
-- 1. Analyze average product price across catalog
-- 2. Research brand reputation and market position
-- 3. Assess material quality and manufacturing standards
-- 4. Consider customer perception and brand recognition
-- 5. Validate against competitive landscape
--
-- DYNAMIC ADJUSTMENTS:
-- - Tiers can be adjusted based on actual sales data
-- - New brands added during product migration
-- - Existing brands moved between tiers as needed
-- - Criteria updated based on market changes
--
-- =====================================================

-- =====================================================
-- CATEGORIES STRUCTURE
-- =====================================================

-- Create categories table with hierarchical structure
CREATE TABLE IF NOT EXISTS categories_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories_new(id),
  tier TEXT DEFAULT 'main', -- 'main', 'sub', 'sub_sub'
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert comprehensive Dope City product categories
INSERT INTO categories_new (name, slug, description, tier, sort_order) VALUES

-- Main Categories (Level 1)
('Glass Pieces', 'glass-pieces', 'Premium glass smoking accessories for herbal products', 'main', 1),
('Hookahs', 'hookahs', 'Traditional hookah pipes and smoking accessories', 'main', 2),
('Vaporizers', 'vaporizers', 'Dry herb and concentrate vaporization devices', 'main', 3),
('Consumables', 'consumables', 'THCA flower, vapes, concentrates and hemp products', 'main', 4),
('CBD Products', 'cbd-products', 'Hemp-derived CBD items and wellness products', 'main', 5),
('Kratom Products', 'kratom-products', 'Kratom leaf and extracts', 'main', 6),
('Mushroom Products', 'mushroom-products', 'Medicinal and psychedelic mushroom products', 'main', 7),
('Nitrous Oxide', 'nitrous-oxide', 'N2O cartridges and dispensers', 'main', 8),
('Accessories', 'accessories', 'Grinders, papers, storage and smoking accessories', 'main', 9),
('Topicals', 'topicals', 'Hemp and kratom-derived topical products', 'main', 10),

-- Glass Pieces Subcategories (Level 2)
('Bongs', 'bongs', 'Water pipes and bongs for flower and concentrates', 'sub', 1),
('Dab Rigs', 'dab-rigs', 'Concentrate vaporization rigs and dab accessories', 'sub', 2),
('Hand Pipes', 'hand-pipes', 'Portable smoking pipes for on-the-go use', 'sub', 3),
('Bubblers', 'bubblers', 'Small water filtration pipes and portable bubblers', 'sub', 4),
('Ash Catchers', 'ash-catchers', 'Pre-coolers and ash filtration accessories', 'sub', 5),

-- Hookahs Subcategories (Level 2)
('Hookah Pipes', 'hookah-pipes', 'Complete hookah pipe systems', 'sub', 1),
('Hookah Accessories', 'hookah-accessories', 'Bowls, hoses, and replacement parts', 'sub', 2),

-- Vaporizers Subcategories (Level 2)
('Dry Herb Vaporizers', 'dry-herb-vaporizers', 'Portable and desktop dry herb vaporizers', 'sub', 1),
('Concentrate Vaporizers', 'concentrate-vaporizers', 'Wax and concentrate vaporization devices', 'sub', 2),
('Vaporizer Accessories', 'vaporizer-accessories', 'Coils, batteries, and vape accessories', 'sub', 3),

-- Consumables Subcategories (Level 2)
('THCA Flower', 'thca-flower', 'Hemp-derived THCA flower products (< 0.3% Delta-9 THC)', 'sub', 1),
('THCA Vapes', 'thca-vapes', 'Vaporizer cartridges and disposable vape pens', 'sub', 2),
('THCA Pre-Rolls', 'thca-pre-rolls', 'Pre-rolled hemp joints and blunts', 'sub', 3),
('Hemp Concentrates', 'hemp-concentrates', 'THCA diamonds, isolates, distillates and extracts', 'sub', 4),
('Hemp Edibles', 'hemp-edibles', 'Hemp-derived THC edibles and gummies', 'sub', 5),

-- CBD Products Subcategories (Level 2)
('Full Spectrum CBD', 'full-spectrum-cbd', 'Complete cannabinoid profile CBD products', 'sub', 1),
('Broad Spectrum CBD', 'broad-spectrum-cbd', 'THC-free CBD products with other cannabinoids', 'sub', 2),
('CBD Isolate', 'cbd-isolate', 'Pure CBD crystals and powders', 'sub', 3),
('CBD Tinctures', 'cbd-tinctures', 'CBD oil drops and tinctures', 'sub', 4),
('CBD Edibles', 'cbd-edibles', 'CBD-infused gummies and capsules', 'sub', 5),
('CBD Capsules', 'cbd-capsules', 'Pre-measured CBD capsules and softgels', 'sub', 6),
('CBD Topicals', 'cbd-topicals', 'CBD-infused creams, balms and salves', 'sub', 7),

-- Kratom Products Subcategories (Level 2)
('Kratom Leaf', 'kratom-leaf', 'Raw kratom leaf and powder', 'sub', 1),
('7-Hydroxymitragynine', '7-hydroxymitragynine', 'Kratom extract containing 7-OH', 'sub', 2),
('Kratom Extracts', 'kratom-extracts', 'Concentrated kratom extracts', 'sub', 3),
('Kratom Capsules', 'kratom-capsules', 'Pre-measured kratom capsules', 'sub', 4),
('Kratom Edibles', 'kratom-edibles', 'Kratom-infused gummies and treats', 'sub', 5),

-- Mushroom Products Subcategories (Level 2)
('Magic Mushrooms', 'magic-mushrooms', 'Premium mushroom products and varieties', 'sub', 1),
('Medicinal Mushrooms', 'medicinal-mushrooms', 'Lion''s Mane, Reishi, Cordyceps', 'sub', 2),
('Mushroom Extracts', 'mushroom-extracts', 'Concentrated mushroom supplements', 'sub', 3),
('Mushroom Edibles', 'mushroom-edibles', 'Mushroom-infused products', 'sub', 4),
('Grow Kits', 'grow-kits', 'Mushroom cultivation supplies', 'sub', 5),

-- Nitrous Oxide Subcategories (Level 2)
('N2O Cartridges', 'n2o-cartridges', 'Nitrous oxide whipped cream chargers', 'sub', 1),
('N2O Dispensers', 'n2o-dispensers', 'Whipped cream dispensers and crackers', 'sub', 2),
('N2O Accessories', 'n2o-accessories', 'Balloons, masks and related items', 'sub', 3),

-- Accessories Subcategories (Level 2)
('Grinders', 'grinders', 'Herb grinders and shredders', 'sub', 1),
('Papers & Wraps', 'papers-wraps', 'Rolling papers, wraps and cones', 'sub', 2),
('Storage', 'storage', 'Jars, containers and storage solutions', 'sub', 3),
('Cleaning Supplies', 'cleaning-supplies', 'Pipe cleaners and maintenance products', 'sub', 4),

-- Topicals Subcategories (Level 2)
('Pain Relief', 'pain-relief', 'Topical creams and balms for pain management', 'sub', 1),
('Skin Care', 'skin-care', 'Hemp and kratom skincare products', 'sub', 2),
('Muscle Recovery', 'muscle-recovery', 'Sports recovery and muscle relief products', 'sub', 3),
('Kratom Topicals', 'kratom-topicals', 'Kratom-infused topical products', 'sub', 4),
('CBD Salves', 'cbd-salves', 'CBD-infused salves and ointments', 'sub', 5),
('Hemp Lotions', 'hemp-lotions', 'Hemp-derived body lotions and moisturizers', 'sub', 6),
('Massage Oils', 'massage-oils', 'CBD and hemp-infused massage oils', 'sub', 7),
('Lip Balms', 'lip-balms', 'CBD-infused lip care products', 'sub', 8);

-- =====================================================
-- BRANDS STRUCTURE
-- =====================================================

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
-- Using brand_id field and creating initial brand structure
INSERT INTO brands_new (name, slug, tier, sort_order) VALUES
-- Premium Tier Brands
('Puffco', 'puffco', 'premium', 1),
('ROOR', 'roor', 'premium', 2),
('GRAV', 'grav', 'premium', 3),
('Higher Standards', 'higher-standards', 'premium', 4),
('Storz & Bickel', 'storz-bickel', 'premium', 5),
('Empire Glassworks', 'empire-glassworks', 'premium', 6),

-- Mid-Range Tier Brands
('RAW', 'raw', 'mid-range', 1),
('Elements', 'elements', 'mid-range', 2),
('Santa Cruz Shredder', 'santa-cruz-shredder', 'mid-range', 3),
('Pulsar', 'pulsar', 'mid-range', 4),
('Cookies', 'cookies', 'mid-range', 5),
('Diamond Glass', 'diamond-glass', 'mid-range', 6),
('Hidden Hills', 'hidden-hills', 'mid-range', 7),

-- Budget Tier Brands
('TrueMoola', 'truemoola', 'budget', 1),
('Crave', 'crave', 'budget', 2), -- Non-nicotine Crave products
('Generic', 'generic', 'budget', 3);

-- =====================================================
-- INDEXES AND SECURITY
-- =====================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories_new(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_tier ON categories_new(tier);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories_new(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories_new(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_search ON categories_new
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_tier ON brands_new(tier);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands_new(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands_new(sort_order);
CREATE INDEX IF NOT EXISTS idx_brands_search ON brands_new
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable RLS on categories
ALTER TABLE categories_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories_new FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_manage" ON categories_new FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role'
);

-- Enable RLS on brands
ALTER TABLE brands_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_public_read" ON brands_new FOR SELECT USING (is_active = true);
CREATE POLICY "brands_admin_manage" ON brands_new FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role'
);

-- Grant permissions
GRANT SELECT ON categories_new TO authenticated;
GRANT SELECT ON brands_new TO authenticated;
GRANT ALL ON categories_new TO service_role;
GRANT ALL ON brands_new TO service_role;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Categories verification
SELECT
  'CATEGORIES' as section,
  tier,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as names
FROM categories_new
GROUP BY tier
ORDER BY tier;

-- Brands verification
SELECT
  'BRANDS' as section,
  tier,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as names
FROM brands_new
GROUP BY tier
ORDER BY tier;

-- Hierarchical structure preview
SELECT
  'HIERARCHY' as section,
  main.name as main_category,
  COUNT(sub.id) as subcategory_count,
  STRING_AGG(sub.name, ', ') as subcategories
FROM categories_new main
LEFT JOIN categories_new sub ON main.id = sub.parent_id
WHERE main.tier = 'main'
GROUP BY main.id, main.name
ORDER BY main.sort_order;
