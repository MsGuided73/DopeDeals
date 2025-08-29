-- Migration: product media + product columns + public images bucket policy
-- Safe to run multiple times. Uses IF NOT EXISTS guards.

BEGIN;

-- Ensure extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Augment products with PDP/editorial/shipping fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS description_md TEXT,
  ADD COLUMN IF NOT EXISTS video_urls JSONB,
  ADD COLUMN IF NOT EXISTS specs JSONB,
  ADD COLUMN IF NOT EXISTS attributes JSONB,
  ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS weight_g INTEGER,
  ADD COLUMN IF NOT EXISTS dim_mm JSONB,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS airtable_record_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS zoho_item_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS shipstation_product_id TEXT UNIQUE;

-- Helpful index for PDP lookup by slug
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
-- Optional uniqueness for sku if not already unique
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_products_sku_unique'
  ) THEN
    BEGIN
      CREATE UNIQUE INDEX idx_products_sku_unique ON products(sku);
    EXCEPTION WHEN others THEN
      -- ignore if sku allows duplicates in current data
      NULL;
    END;
  END IF;
END $$;

-- 2) Product media table (normalized gallery)
CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  path TEXT NOT NULL,
  alt TEXT,
  role TEXT CHECK (role IN ('hero','thumbnail','gallery','swatch')),
  sort INT DEFAULT 0,
  width INT,
  height INT,
  variant_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_role_sort ON product_media(product_id, role, sort);
-- One hero per product (partial unique index)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='uq_product_media_one_hero'
  ) THEN
    CREATE UNIQUE INDEX uq_product_media_one_hero ON product_media(product_id) WHERE role = 'hero';
  END IF;
END $$;

-- 3) RLS skeletons (enable + read policies)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='product_media'
  ) THEN RETURN; END IF;
END $$;

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
-- Products read policy (assuming is_active boolean exists; fallback allows all)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='read_active_products'
  ) THEN
    CREATE POLICY read_active_products ON products FOR SELECT USING (
      COALESCE(is_active, TRUE) = TRUE
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_media' AND policyname='read_media_for_active_products'
  ) THEN
    CREATE POLICY read_media_for_active_products ON product_media FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM products p WHERE p.id = product_media.product_id AND COALESCE(p.is_active, TRUE) = TRUE
      )
    );
  END IF;
END $$;

-- 4) Public read policy for Storage bucket "products"
-- Allow anonymous read; do not add write policies (service role bypasses RLS).
CREATE POLICY IF NOT EXISTS "Public read for products bucket" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'products');

COMMIT;

