-- Backfill category_slug and subcategory_slug for smoking accessories
-- This script assigns:
--   category_slug: 'accessory' for all smoking accessories
--   subcategory_slug: specific accessory type (grinder, papers, tray, etc.)

-- Grinders
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'grinder'
WHERE category_slug IS NULL
  AND (name ILIKE '%grinder%' OR name ILIKE '%herb shredder%' OR name ILIKE '%cutter%');

-- Rolling Papers and Wraps
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'rolling-paper'
WHERE category_slug IS NULL
  AND (name ILIKE '%paper%' OR name ILIKE '%wrap%' OR name ILIKE '%rolling%' OR name ILIKE '%blunt wrap%' OR name ILIKE '%cone%');

-- Pipes Screens and Filters
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'pipe-screen'
WHERE category_slug IS NULL
  AND (name ILIKE '%screen%' OR name ILIKE '%filter screen%' OR name ILIKE '%pipe screen%' OR name ILIKE '%bowl screen%');

-- Metal Pipes and One-Hitters
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'metal-pipe'
WHERE category_slug IS NULL
  AND (name ILIKE '%metal pipe%' OR name ILIKE '%one hitter%' OR name ILIKE '%digipipe%' OR name ILIKE '%pacifier%');

-- Storage and Cases
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'storage'
WHERE category_slug IS NULL
  AND (name ILIKE '%case%' OR name ILIKE '%container%' OR name ILIKE '%jar%' OR name ILIKE '%stash%' OR name ILIKE '%storage%' OR name ILIKE '%holster%');

-- Ashtrays and Trays
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'ashtray'
WHERE category_slug IS NULL
  AND (name ILIKE '%ash tray%' OR name ILIKE '%ashtray%' OR name ILIKE '%tray%' OR name ILIKE '%catch tray%');

-- Torches and Lighters
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'torch'
WHERE category_slug IS NULL
  AND (name ILIKE '%torch%' OR name ILIKE '%lighter%' OR name ILIKE '%ignition%' OR name ILIKE '%flame%');

-- Cleaning Supplies and Brushes
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'cleaning'
WHERE category_slug IS NULL
  AND (name ILIKE '%clean%' OR name ILIKE '%brush%' OR name ILIKE '%pick%' OR name ILIKE '%scraper%' OR name ILIKE '%tool cleaner%');

-- Scales and Measurement Tools
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'scale'
WHERE category_slug IS NULL
  AND (name ILIKE '%scale%' OR name ILIKE '%balance%' OR name ILIKE '%weigh%' OR name ILIKE '%gram scale%');

-- Tamping Tools and Stems
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'tamping-tool'
WHERE category_slug IS NULL
  AND (name ILIKE '%tamp%' OR name ILIKE '%tamper%' OR name ILIKE '%stem%' OR name ILIKE '%poker%' OR name ILIKE '%prod%');

-- Bong Attachments and Percolators
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'bong-attachment'
WHERE category_slug IS NULL
  AND (name ILIKE '%bong ice catcher%' OR name ILIKE '%percolator attachment%' OR name ILIKE '%bong bowl replacement%' OR name ILIKE '%bong stem%' OR name ILIKE '%ash catcher%' OR name ILIKE '%bong diffuser%');

-- Smoking Accessories (miscellaneous)
UPDATE main_site_products
SET
  category_slug = 'accessory',
  subcategory_slug = 'misc-smoke'
WHERE category_slug IS NULL
  AND (name ILIKE '%rolling machine%' OR name ILIKE '%tobacco tin%' OR name ILIKE '%carb cap%' OR name ILIKE '%stand%' OR name ILIKE '%holder%');

-- Report results
SELECT
  subcategory_slug,
  COUNT(*) as count
FROM main_site_products
WHERE category_slug = 'accessory'
GROUP BY subcategory_slug
ORDER BY count DESC;
