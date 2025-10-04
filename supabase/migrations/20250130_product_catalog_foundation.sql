BEGIN;

-- Ensure useful extensions are present
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Product type hierarchy -------------------------------------------------
CREATE TABLE IF NOT EXISTS product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  compliance_profile_id UUID,
  default_sort TEXT DEFAULT 'popularity',
  facet_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_type_relationships (
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  depth INTEGER NOT NULL DEFAULT 1,
  breadcrumb TEXT[] DEFAULT ARRAY[]::TEXT[],
  PRIMARY KEY (product_type_id, parent_id)
);

-- 2. Data sources -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL UNIQUE,
  sync_frequency TEXT,
  credentials_ref TEXT,
  last_success TIMESTAMPTZ,
  last_error TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Extend products with richer catalog fields -----------------------------
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS default_variant_id UUID,
  ADD COLUMN IF NOT EXISTS data_source_id UUID REFERENCES product_sources(id),
  ADD COLUMN IF NOT EXISTS search_vector TSVECTOR,
  ADD COLUMN IF NOT EXISTS merchandising_tags TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_published_at ON products(published_at);
CREATE INDEX IF NOT EXISTS idx_products_data_source ON products(data_source_id);
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN(search_vector);

-- 4. Variants & options -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  option_hash TEXT,
  barcode TEXT,
  price NUMERIC(10,2),
  compare_at_price NUMERIC(10,2),
  cost NUMERIC(10,2),
  weight_g INTEGER,
  dims_mm JSONB,
  inventory_policy TEXT DEFAULT 'deny' CHECK (inventory_policy IN ('deny','continue')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_default_variant_id_fkey'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_default_variant_id_fkey
      FOREIGN KEY (default_variant_id)
      REFERENCES product_variants(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS variant_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  warehouse_id TEXT NOT NULL DEFAULT 'main',
  available INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  incoming INTEGER NOT NULL DEFAULT 0,
  safety_stock INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (variant_id, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_variant_inventory_variant ON variant_inventory(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_inventory_warehouse ON variant_inventory(warehouse_id);

CREATE TABLE IF NOT EXISTS product_option_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID REFERENCES product_types(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input_type TEXT NOT NULL DEFAULT 'select' CHECK (input_type IN ('select','swatch','radio','text')),
  filter_behavior TEXT NOT NULL DEFAULT 'match_any' CHECK (filter_behavior IN ('match_any','match_all','range','none')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_option_definitions_product ON product_option_definitions(product_id);
CREATE INDEX IF NOT EXISTS idx_option_definitions_type ON product_option_definitions(product_type_id);

CREATE TABLE IF NOT EXISTS product_option_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_definition_id UUID NOT NULL REFERENCES product_option_definitions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  value_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  swatch_media_id UUID REFERENCES product_media(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(option_definition_id, value)
);

CREATE TABLE IF NOT EXISTS variant_option_values (
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  option_definition_id UUID NOT NULL REFERENCES product_option_definitions(id) ON DELETE CASCADE,
  option_value_id UUID NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, option_definition_id)
);

-- 5. Attributes -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attribute_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL CHECK (scope IN ('product','variant')),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  datatype TEXT NOT NULL CHECK (datatype IN ('text','number','boolean','json','date')), 
  units TEXT,
  searchable BOOLEAN DEFAULT FALSE,
  facetable BOOLEAN DEFAULT FALSE,
  compliance_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id UUID NOT NULL REFERENCES attribute_definitions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  value_text TEXT,
  value_number NUMERIC(18,6),
  value_boolean BOOLEAN,
  value_json JSONB,
  value_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT attribute_values_product_or_variant CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL)
    OR (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_attribute_values_product ON attribute_values(product_id);
CREATE INDEX IF NOT EXISTS idx_attribute_values_variant ON attribute_values(variant_id);
CREATE INDEX IF NOT EXISTS idx_attribute_values_definition ON attribute_values(definition_id);

-- 6. Media ------------------------------------------------------------------
ALTER TABLE product_media
  ADD COLUMN IF NOT EXISTS media_kind TEXT,
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT,
  ADD COLUMN IF NOT EXISTS transform_preset TEXT,
  ADD COLUMN IF NOT EXISTS colorway TEXT,
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

UPDATE product_media
SET media_kind = COALESCE(media_kind, type);

CREATE TABLE IF NOT EXISTS asset_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_collection_members (
  collection_id UUID NOT NULL REFERENCES asset_collections(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES product_media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, media_id)
);

CREATE TABLE IF NOT EXISTS variant_media (
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES product_media(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'gallery',
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (variant_id, media_id)
);

-- 7. Merchandising badges ---------------------------------------------------
CREATE TABLE IF NOT EXISTS product_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  badge_type TEXT DEFAULT 'marketing',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_badge_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id UUID NOT NULL REFERENCES product_badges(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (badge_id, product_id, variant_id)
);

-- 8. Source lineage ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_source_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES product_sources(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  payload JSONB,
  checksum TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, external_id)
);

-- 9. Search & facets --------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_search_index (
  product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  search_vector TSVECTOR,
  popularity_score NUMERIC(10,4) DEFAULT 0,
  last_synced TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_product_search_vector ON product_search_index USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS product_facets (
  product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  facets JSONB NOT NULL DEFAULT '{}'::jsonb,
  availability_summary JSONB,
  price_band TEXT,
  media_counts JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
