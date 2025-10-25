-- DOPE CITY CATEGORIES - CLEAR AND RECREATE FROM SCRATCH
-- This script clears all existing categories and creates the new structure

-- Step 1: Clear existing categories (be careful - this removes all data)
TRUNCATE TABLE categories_new RESTART IDENTITY CASCADE;

-- Step 2: Create main categories (these should work)
INSERT INTO categories_new (name, slug, description, tier, sort_order) VALUES
('THCA & More', 'thca-and-more', 'THCA flower, vapes, edibles, prerolls, concentrates and topical products', 'main', 1),
('Glass Pieces', 'glass-pieces', 'Premium glass smoking accessories and water pipes', 'main', 2),
('Dab Rigs', 'dab-rigs', 'Concentrate vaporization rigs including traditional and electronic dab rigs', 'main', 3),
('Vaporizers', 'vaporizers', 'Dry herb and concentrate vaporizers for discreet consumption', 'main', 4),
('Botanicals', 'botanicals', 'Mushroom products, kratom, and other botanical supplements', 'main', 5),
('Nitrous Oxide', 'nitrous-oxide', 'N2O cartridges and whipped cream dispensers', 'main', 6),
('Accessories', 'accessories', 'Smoking accessories, grinders, papers and tools', 'main', 7);

-- Step 3: Get THCA ID and create its subcategories
DO $$
DECLARE thca_id UUID;
BEGIN
  SELECT id INTO thca_id FROM categories_new WHERE slug = 'thca-and-more';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (thca_id, 'THCA Flower', 'thca-flower', 'Premium THCA hemp flower products', 'sub', 1),
  (thca_id, 'THCA Vapes', 'thca-vapes', 'THCA vaporizer cartridges and disposable pens', 'sub', 2),
  (thca_id, 'THCA Pre-Rolls', 'thca-pre-rolls', 'Pre-rolled THCA hemp joints and blunts', 'sub', 3),
  (thca_id, 'THCA Concentrates', 'thca-concentrates', 'THCA diamonds, isolates, distillates and extracts', 'sub', 4),
  (thca_id, 'THCA Edibles', 'thca-edibles', 'THCA-infused gummies, chocolates and edibles', 'sub', 5),
  (thca_id, 'THCA Topicals', 'thca-topicals', 'THCA-infused salves, balms and topical products', 'sub', 6);
END $$;

-- Step 4: Get Glass Pieces ID and create its subcategories
DO $$
DECLARE glass_id UUID;
BEGIN
  SELECT id INTO glass_id FROM categories_new WHERE slug = 'glass-pieces';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (glass_id, 'Bongs', 'bongs', 'Water pipes and bongs for flower and concentrates', 'sub', 1),
  (glass_id, 'Pipes', 'pipes', 'Hand pipes and smoking pipes', 'sub', 2),
  (glass_id, 'Hookahs', 'hookahs', 'Traditional hookah pipes and smoking accessories', 'sub', 3);
END $$;

-- Step 5: Get Dab Rigs ID and create its subcategories
DO $$
DECLARE dab_id UUID;
BEGIN
  SELECT id INTO dab_id FROM categories_new WHERE slug = 'dab-rigs';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (dab_id, 'Traditional Dab Rigs', 'traditional-dab-rigs', 'Classic glass dab rigs and concentrate pipes', 'sub', 1),
  (dab_id, 'E-Rigs', 'erigs', 'Electronic dab rigs and smart rigs', 'sub', 2),
  (dab_id, 'Dab Accessories', 'dab-accessories', 'Bangers, carb caps, and dab tools', 'sub', 3);
END $$;

-- Step 6: Get Vaporizers ID and create its subcategories
DO $$
DECLARE vaporizer_id UUID;
BEGIN
  SELECT id INTO vaporizer_id FROM categories_new WHERE slug = 'vaporizers';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (vaporizer_id, 'Dry Herb Vaporizers', 'dry-herb-vaporizers', 'Portable and desktop dry herb vaporizers', 'sub', 1),
  (vaporizer_id, 'Concentrate Vaporizers', 'concentrate-vaporizers', 'Wax and concentrate vaporization devices', 'sub', 2),
  (vaporizer_id, 'Vaporizer Accessories', 'vaporizer-accessories', 'Coils, batteries, and vape accessories', 'sub', 3);
END $$;

-- Step 7: Get Botanicals ID and create its subcategories
DO $$
DECLARE botanical_id UUID;
BEGIN
  SELECT id INTO botanical_id FROM categories_new WHERE slug = 'botanicals';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (botanical_id, 'Magic Mushrooms', 'magic-mushrooms', 'Premium psilocybin mushroom products', 'sub', 1),
  (botanical_id, 'Mushroom Edibles', 'mushroom-edibles', 'Mushroom-infused gummies and chocolates', 'sub', 2),
  (botanical_id, 'Kratom Products', 'kratom-products', 'Kratom extracts and capsules', 'sub', 3),
  (botanical_id, '7-Hydroxymitragynine', '7-hydroxymitragynine', 'Premium 7-Hydroxy kratom extracts', 'sub', 4);
END $$;

-- Step 8: Get N2O ID and create its subcategories
DO $$
DECLARE n2o_id UUID;
BEGIN
  SELECT id INTO n2o_id FROM categories_new WHERE slug = 'nitrous-oxide';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (n2o_id, 'N2O Cartridges', 'n2o-cartridges', 'Nitrous oxide whipped cream chargers', 'sub', 1),
  (n2o_id, 'N2O Dispensers', 'n2o-dispensers', 'Whipped cream dispensers and crackers', 'sub', 2),
  (n2o_id, 'N2O Accessories', 'n2o-accessories', 'Balloons, masks and related items', 'sub', 3);
END $$;

-- Step 9: Get Accessories ID and create its subcategories
DO $$
DECLARE accessory_id UUID;
BEGIN
  SELECT id INTO accessory_id FROM categories_new WHERE slug = 'accessories';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (accessory_id, 'Grinders', 'grinders', 'Herb grinders and shredders', 'sub', 1),
  (accessory_id, 'Papers & Wraps', 'papers-wraps', 'Rolling papers, wraps and cones', 'sub', 2),
  (accessory_id, 'Lighters & Torches', 'lighters-torches', 'Premium lighters and torch accessories', 'sub', 3),
  (accessory_id, 'Storage', 'storage', 'Jars, containers and storage solutions', 'sub', 4);
END $$;

-- Step 10: Add your specific bong types
DO $$
DECLARE bongs_id UUID;
BEGIN
  SELECT id INTO bongs_id FROM categories_new WHERE slug = 'bongs';

  INSERT INTO categories_new (parent_id, name, slug, description, tier, sort_order) VALUES
  (bongs_id, 'Percolator Bongs', 'percolator-bongs', 'Bongs with advanced percolation systems', 'sub', 1),
  (bongs_id, 'Beaker Bongs', 'beaker-bongs', 'Classic beaker-shaped water pipes', 'sub', 2),
  (bongs_id, 'Straight Bongs', 'straight-bongs', 'Straight tube water pipes', 'sub', 3);
END $$;

-- Step 11: Verification queries
SELECT
  main.name as main_category,
  sub.name as subcategory,
  sub.sort_order
FROM categories_new main
LEFT JOIN categories_new sub ON main.id = sub.parent_id
WHERE main.tier = 'main'
ORDER BY main.sort_order, sub.sort_order;

-- Show complete hierarchy
WITH category_tree AS (
  SELECT
    id,
    name,
    slug,
    parent_id,
    tier,
    0 as level
  FROM categories_new
  WHERE parent_id IS NULL

  UNION ALL

  SELECT
    c.id,
    c.name,
    c.slug,
    c.parent_id,
    c.tier,
    ct.level + 1
  FROM categories_new c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT
  REPEAT('  ', level) || name as category_hierarchy,
  tier,
  slug
FROM category_tree
ORDER BY level, name;

-- Show summary counts
SELECT
  tier,
  COUNT(*) as count
FROM categories_new
GROUP BY tier
ORDER BY tier;
