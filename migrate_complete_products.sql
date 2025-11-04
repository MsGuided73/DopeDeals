-- Highway 420 Complete Products Migration
-- Migrates only products with complete information (images + descriptions)
-- Strategic launch with quality products only

-- =====================================================
-- CRITICAL: ANALYZE ACTUAL TABLE STRUCTURE FIRST
-- =====================================================
--
-- Before running migration, we MUST analyze the actual columns
-- in your current products table since data comes from website,
-- not Zoho inventory. Column names may be different!
--
-- =====================================================

-- Step 1: ANALYZE ACTUAL TABLE STRUCTURE (Run this first!)
SELECT
  '=== TABLE STRUCTURE ANALYSIS ===' as analysis_type,
  NOW() as analyzed_at
UNION ALL
SELECT
  'Column Name: ' || column_name || ' | Type: ' || data_type || ' | Nullable: ' || is_nullable,
  NOW()
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Step 2: Check for critical columns we need
SELECT
  '=== CRITICAL COLUMNS CHECK ===' as check_type,
  NOW() as checked_at
UNION ALL
SELECT
  'image_url column exists: ' || CASE WHEN EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN 'YES' ELSE 'NO' END,
  NOW()
UNION ALL
SELECT
  'description column exists: ' || CASE WHEN EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description'
  ) THEN 'YES' ELSE 'NO' END,
  NOW()
UNION ALL
SELECT
  'nicotine_free column exists: ' || CASE WHEN EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'nicotine_free'
  ) THEN 'YES' ELSE 'NO' END,
  NOW()
UNION ALL
SELECT
  'farm_bill_compliant column exists: ' || CASE WHEN EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'farm_bill_compliant'
  ) THEN 'YES' ELSE 'NO' END,
  NOW();

-- Step 3: Show sample of actual data structure
SELECT
  '=== SAMPLE DATA STRUCTURE ===' as sample_type,
  NOW() as sampled_at
UNION ALL
SELECT
  'First product columns: ' || STRING_AGG(column_name, ', '),
  NOW()
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position
LIMIT 1;

-- Step 4: DETAILED DATA ANALYSIS (Critical before migration)
SELECT
  '=== PRODUCT ANALYSIS ===' as analysis_phase,
  NOW() as analyzed_at
UNION ALL
SELECT
  'TOTAL_PRODUCTS' as metric,
  COUNT(*)::TEXT as count
FROM products
UNION ALL
SELECT
  'WITH_IMAGES' as metric,
  COUNT(*) FILTER (WHERE image_url IS NOT NULL)::TEXT as count
FROM products
UNION ALL
SELECT
  'WITH_DESCRIPTIONS' as metric,
  COUNT(*) FILTER (WHERE description IS NOT NULL AND description != '')::TEXT as count
FROM products
UNION ALL
SELECT
  'NICOTINE_FREE' as metric,
  COUNT(*) FILTER (WHERE nicotine_free = true)::TEXT as count
FROM products
UNION ALL
SELECT
  'FARM_BILL_COMPLIANT' as metric,
  COUNT(*) FILTER (WHERE farm_bill_compliant = true)::TEXT as count
FROM products
UNION ALL
SELECT
  '=== COMPLETE NON-NICOTINE PRODUCTS ===' as analysis_phase,
  NOW() as analyzed_at
UNION ALL
SELECT
  'Complete AND Non-Nicotine' as metric,
  COUNT(*) FILTER (WHERE
    image_url IS NOT NULL
    AND description IS NOT NULL
    AND description != ''
    AND nicotine_free = true
    AND farm_bill_compliant = true
  )::TEXT as count
FROM products
UNION ALL
SELECT
  'Complete BUT Nicotine' as metric,
  COUNT(*) FILTER (WHERE
    image_url IS NOT NULL
    AND description IS NOT NULL
    AND description != ''
    AND nicotine_free = false
  )::TEXT as count
FROM products
UNION ALL
SELECT
  'Incomplete Products' as metric,
  COUNT(*) FILTER (WHERE
    image_url IS NULL
    OR description IS NULL
    OR description = ''
  )::TEXT as count
FROM products
UNION ALL
SELECT
  '=== BREAKDOWN BY TYPE ===' as analysis_phase,
  NOW() as analyzed_at
UNION ALL
SELECT
  'Main Site Eligible' as metric,
  COUNT(*) FILTER (WHERE
    image_url IS NOT NULL
    AND description IS NOT NULL
    AND description != ''
    AND nicotine_free = true
    AND farm_bill_compliant = true
  )::TEXT as count
FROM products
UNION ALL
SELECT
  'Tobacco Site Only' as metric,
  COUNT(*) FILTER (WHERE nicotine_free = false)::TEXT as count
FROM products
UNION ALL
SELECT
  'Need Enhancement' as metric,
  COUNT(*) FILTER (WHERE
    image_url IS NULL
    OR description IS NULL
    OR description = ''
    OR farm_bill_compliant = false
  )::TEXT as count
FROM products;

-- Step 2: Create migration tracking table
CREATE TABLE IF NOT EXISTS migration_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_phase TEXT NOT NULL,
  products_processed INTEGER DEFAULT 0,
  products_successful INTEGER DEFAULT 0,
  products_failed INTEGER DEFAULT 0,
  errors TEXT[],
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  execution_time INTERVAL
);

-- Step 3: Migrate complete products to main site (BATCH PROCESSING)
INSERT INTO migration_log (migration_phase, started_at) VALUES ('complete_products_migration', NOW());

DO $$
DECLARE
  products_processed INTEGER := 0;
  products_successful INTEGER := 0;
  products_failed INTEGER := 0;
  error_list TEXT[] := ARRAY[]::TEXT[];
  migration_error TEXT;
  start_time TIMESTAMPTZ := NOW();
  batch_size INTEGER := 500; -- Process in batches of 500
  total_to_migrate INTEGER;
BEGIN
  -- Get count of products to migrate
  SELECT COUNT(*) INTO total_to_migrate
  FROM products
  WHERE image_url IS NOT NULL
    AND description IS NOT NULL
    AND nicotine_free = true
    AND farm_bill_compliant = true
    AND id NOT IN (SELECT id FROM main_site_products);

  RAISE NOTICE 'Starting migration of % products in batches of %', total_to_migrate, batch_size;

  -- Process in batches for better performance
  FOR i IN 0..CEIL(total_to_migrate / batch_size::FLOAT) - 1 LOOP
    BEGIN
      -- Batch insert for better performance
      INSERT INTO main_site_products (
        -- Core product fields
        id, name, description, short_description, sku, price, vip_price,
        compare_at_price, cost_price, brand_id, category_id, supplier_id,
        stock_quantity, low_stock_threshold, track_inventory, weight,
        dimensions, materials, image_url, image_urls, video_urls,
        attributes, specs, tags, is_active, featured, vip_exclusive,
        requires_membership, seo_title, seo_description, seo_keywords,
        created_at,

        -- Compliance fields
        nicotine_free, tobacco_free, farm_bill_compliant,

        -- Hemp-specific fields
        cannabinoid_profile, terpene_profile, effects_profile,
        psychoactive_profile,

        -- Timestamps
        updated_at
      )
      SELECT
        product_record.id, product_record.name, product_record.description,
        product_record.short_description, product_record.sku, product_record.price,
        product_record.vip_price, product_record.compare_at_price,
        product_record.cost_price, product_record.brand_id, product_record.category_id,
        product_record.supplier_id, product_record.stock_quantity,
        product_record.low_stock_threshold, product_record.track_inventory,
        product_record.weight, product_record.dimensions, product_record.materials,
        product_record.image_url, product_record.image_urls, product_record.video_urls,
        product_record.attributes, product_record.specs, product_record.tags,
        product_record.is_active, product_record.featured, product_record.vip_exclusive,
        product_record.requires_membership, product_record.seo_title,
        product_record.seo_description, product_record.seo_keywords,
        product_record.created_at,

        -- Compliance (ensured by WHERE clause)
        true, true, true,

        -- Hemp-specific profiles (default structure)
        '{
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
          "profile_type": "unknown"
        }'::jsonb,

        '{
          "primary_terpenes": [],
          "aroma_notes": [],
          "effects_influence": []
        }'::jsonb,

        '{
          "primary_effects": [],
          "secondary_effects": [],
          "medicinal_benefits": [],
          "best_for": [],
          "avoid_if": []
        }'::jsonb,

        '{
          "thc_variants": {
            "delta9_thc": 0,
            "delta8_thc": 0,
            "thca": 0,
            "thcp": 0,
            "thcv": 0
          },
          "other_psychoactive": {}
        }'::jsonb,

        NOW()
      FROM products product_record
      WHERE image_url IS NOT NULL
        AND description IS NOT NULL
        AND nicotine_free = true
        AND farm_bill_compliant = true
        AND id NOT IN (SELECT id FROM main_site_products)
      LIMIT batch_size OFFSET (i * batch_size);

      -- Count successful batch
      GET DIAGNOSTICS products_successful = ROW_COUNT;
      products_processed := products_processed + products_successful;

      RAISE NOTICE 'Batch % completed: % products migrated', i + 1, products_successful;

    EXCEPTION WHEN OTHERS THEN
      products_failed := products_failed + 1;
      migration_error := SQLERRM;
      error_list := array_append(error_list,
        'Batch ' || (i + 1) || ': ' || migration_error
      );
    END;
  END LOOP;

  -- Update migration log
  UPDATE migration_log
  SET
    products_processed = products_processed,
    products_successful = products_successful,
    products_failed = products_failed,
    errors = error_list,
    completed_at = NOW(),
    execution_time = NOW() - start_time
  WHERE migration_phase = 'complete_products_migration';

  RAISE NOTICE 'Main site migration completed: % processed, % successful, % failed',
    products_processed, products_successful, products_failed;

END $$;

-- Step 4: Migrate nicotine products to tobacco site
INSERT INTO migration_log (migration_phase, started_at) VALUES ('nicotine_products_migration', NOW());

DO $$
DECLARE
  nicotine_processed INTEGER := 0;
  nicotine_successful INTEGER := 0;
  nicotine_failed INTEGER := 0;
  nicotine_errors TEXT[] := ARRAY[]::TEXT[];
  nicotine_record RECORD;
  nicotine_error TEXT;
  nicotine_start_time TIMESTAMPTZ := NOW();
BEGIN
  -- Migrate nicotine products to tobacco site
  FOR nicotine_record IN
    SELECT * FROM products
    WHERE nicotine_free = false
      AND id NOT IN (SELECT id FROM tobacco_site_products)
  LOOP
    BEGIN
      nicotine_processed := nicotine_processed + 1;

      -- Insert into tobacco site products table
      INSERT INTO tobacco_site_products (
        id, name, description, short_description, sku, price, vip_price,
        compare_at_price, cost_price, brand_id, category_id, supplier_id,
        stock_quantity, low_stock_threshold, track_inventory, weight,
        dimensions, materials, image_url, image_urls, video_urls,
        attributes, specs, tags, is_active, featured, vip_exclusive,
        requires_membership, seo_title, seo_description, seo_keywords,
        created_at, nicotine_free, contains_tobacco, age_restriction,
        requires_id_verification, updated_at
      ) VALUES (
        nicotine_record.id, nicotine_record.name, nicotine_record.description,
        nicotine_record.short_description, nicotine_record.sku, nicotine_record.price,
        nicotine_record.vip_price, nicotine_record.compare_at_price,
        nicotine_record.cost_price, nicotine_record.brand_id, nicotine_record.category_id,
        nicotine_record.supplier_id, nicotine_record.stock_quantity,
        nicotine_record.low_stock_threshold, nicotine_record.track_inventory,
        nicotine_record.weight, nicotine_record.dimensions, nicotine_record.materials,
        nicotine_record.image_url, nicotine_record.image_urls, nicotine_record.video_urls,
        nicotine_record.attributes, nicotine_record.specs, nicotine_record.tags,
        nicotine_record.is_active, nicotine_record.featured, nicotine_record.vip_exclusive,
        nicotine_record.requires_membership, nicotine_record.seo_title,
        nicotine_record.seo_description, nicotine_record.seo_keywords,
        nicotine_record.created_at, false, true, 21, true, NOW()
      );

      nicotine_successful := nicotine_successful + 1;

    EXCEPTION WHEN OTHERS THEN
      nicotine_failed := nicotine_failed + 1;
      nicotine_error := SQLERRM;
      nicotine_errors := array_append(nicotine_errors,
        'Product ' || nicotine_record.id || ' (' || nicotine_record.name || '): ' || nicotine_error
      );
    END;
  END LOOP;

  -- Update nicotine migration log
  UPDATE migration_log
  SET
    products_processed = nicotine_processed,
    products_successful = nicotine_successful,
    products_failed = nicotine_failed,
    errors = nicotine_errors,
    completed_at = NOW(),
    execution_time = NOW() - nicotine_start_time
  WHERE migration_phase = 'nicotine_products_migration';

  RAISE NOTICE 'Nicotine migration completed: % processed, % successful, % failed',
    nicotine_processed, nicotine_successful, nicotine_failed;

END $$;

-- Step 5: Map products to new categories and brands
-- Update category relationships based on product names and existing data
UPDATE main_site_products SET
  category_id = new_cat.id
FROM categories_new new_cat
WHERE main_site_products.category_id IS NULL
  AND (
    -- Map based on product names and descriptions
    (main_site_products.name ILIKE '%bong%' OR main_site_products.description ILIKE '%bong%') AND new_cat.slug = 'bongs'
    OR (main_site_products.name ILIKE '%dab rig%' OR main_site_products.description ILIKE '%dab rig%') AND new_cat.slug = 'dab-rigs'
    OR (main_site_products.name ILIKE '%thca%' OR main_site_products.description ILIKE '%thca%') AND new_cat.slug = 'thca-flower'
    OR (main_site_products.name ILIKE '%cbd%' OR main_site_products.description ILIKE '%cbd%') AND new_cat.slug = 'full-spectrum-cbd'
    OR (main_site_products.name ILIKE '%kratom%' OR main_site_products.description ILIKE '%kratom%') AND new_cat.slug = 'kratom-leaf'
    OR (main_site_products.name ILIKE '%mushroom%' OR main_site_products.description ILIKE '%mushroom%') AND new_cat.slug = 'magic-mushrooms'
  );

-- Step 6: Verification and reporting
SELECT 'MIGRATION_SUMMARY' as report_type, NOW() as generated_at
UNION ALL
SELECT '=== MAIN SITE PRODUCTS ===' as report_type, NOW() as generated_at
UNION ALL
SELECT 'Total in main_site_products: ' || COUNT(*)::TEXT, NOW() FROM main_site_products
UNION ALL
SELECT 'With category relationships: ' || COUNT(*) FILTER (WHERE category_id IS NOT NULL)::TEXT, NOW() FROM main_site_products
UNION ALL
SELECT 'With brand relationships: ' || COUNT(*) FILTER (WHERE brand_id IS NOT NULL)::TEXT, NOW() FROM main_site_products
UNION ALL
SELECT '=== TOBACCO SITE PRODUCTS ===' as report_type, NOW() as generated_at
UNION ALL
SELECT 'Total in tobacco_site_products: ' || COUNT(*)::TEXT, NOW() FROM tobacco_site_products
UNION ALL
SELECT '=== MIGRATION LOG ===' as report_type, NOW() as generated_at
UNION ALL
SELECT
  migration_phase || ': ' || products_successful::TEXT || ' successful, ' || products_failed::TEXT || ' failed',
  NOW()
FROM migration_log
ORDER BY started_at;

-- Step 7: Create products needing enhancement view
CREATE OR REPLACE VIEW products_needing_enhancement AS
SELECT
  id, name, sku,
  CASE
    WHEN image_url IS NULL THEN 'Missing image'
    ELSE NULL
  END as missing_image,
  CASE
    WHEN description IS NULL OR description = '' THEN 'Missing description'
    ELSE NULL
  END as missing_description,
  CASE
    WHEN nicotine_free = false THEN 'Nicotine product'
    ELSE NULL
  END as nicotine_product,
  CASE
    WHEN farm_bill_compliant = false THEN 'Compliance issue'
    ELSE NULL
  END as compliance_issue
FROM products
WHERE image_url IS NULL
   OR description IS NULL
   OR description = ''
   OR nicotine_free = false
   OR farm_bill_compliant = false;

-- Grant access to enhancement view
GRANT SELECT ON products_needing_enhancement TO authenticated;

-- Final summary
SELECT
  'MIGRATION_COMPLETE' as status,
  COUNT(*) as migrated_products,
  (SELECT COUNT(*) FROM tobacco_site_products) as nicotine_products_migrated,
  (SELECT COUNT(*) FROM products_needing_enhancement) as products_needing_enhancement
FROM main_site_products;
