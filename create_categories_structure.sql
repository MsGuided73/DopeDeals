-- Dope City Categories Structure Creation
-- This script creates the comprehensive hierarchical category system

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

-- Kratom Products Subcategories (Level 2)
('Kratom Leaf', 'kratom-leaf', 'Raw kratom leaf and powder', 'sub', 1),
('7-Hydroxymitragynine', '7-hydroxymitragynine', 'Kratom extract containing 7-OH', 'sub', 2),
('Kratom Extracts', 'kratom-extracts', 'Concentrated kratom extracts', 'sub', 3),
('Kratom Capsules', 'kratom-capsules', 'Pre-measured kratom capsules', 'sub', 4),
('Kratom Edibles', 'kratom-edibles', 'Kratom-infused gummies and treats', 'sub', 5),

-- Mushroom Products Subcategories (Level 2)
('Psilocybin Mushrooms', 'psilocybin-mushrooms', 'Psychedelic mushroom products', 'sub', 1),
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
('Kratom Topicals', 'kratom-topicals', 'Kratom-infused topical products', 'sub', 4);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories_new(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_tier ON categories_new(tier);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories_new(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories_new(sort_order);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_categories_search ON categories_new
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable RLS on categories
ALTER TABLE categories_new ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
CREATE POLICY "categories_public_read" ON categories_new
  FOR SELECT USING (is_active = true);

-- Only admins can modify categories
CREATE POLICY "categories_admin_manage" ON categories_new
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Grant permissions
GRANT SELECT ON categories_new TO authenticated;
GRANT ALL ON categories_new TO service_role;

-- Verification queries
SELECT
  tier,
  COUNT(*) as category_count,
  STRING_AGG(name, ', ') as categories
FROM categories_new
GROUP BY tier
ORDER BY tier;

-- Show hierarchical structure
SELECT
  main.name as main_category,
  sub.name as subcategory,
  sub.sort_order
FROM categories_new main
JOIN categories_new sub ON main.id = sub.parent_id
ORDER BY main.sort_order, sub.sort_order;
