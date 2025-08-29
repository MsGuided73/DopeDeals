-- Supabase migration: nicotine/tobacco restrictions, inventory, zipcode mapping
-- Safe to run multiple times (IF NOT EXISTS where supported). Requires Postgres 14+

BEGIN;

-- 1) Nicotine/tobacco flags on products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS nicotine_product BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tobacco_product  BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure is_active exists (in case of older schema variants)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2) Replace public products SELECT policy to hide restricted products for consumers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND polname = 'public_products_access'
  ) THEN
    EXECUTE 'DROP POLICY public_products_access ON products';
  END IF;
END$$;

CREATE POLICY public_products_access
ON products
FOR SELECT
USING (
  is_active = TRUE
  AND COALESCE(nicotine_product, FALSE) = FALSE
  AND COALESCE(tobacco_product,  FALSE) = FALSE
);

-- 3) Inventory table (normalized, future multi-warehouse)
CREATE TABLE IF NOT EXISTS inventory (
  product_id   VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id VARCHAR(255),
  available    INTEGER NOT NULL DEFAULT 0,
  reserved     INTEGER NOT NULL DEFAULT 0,
  source_version TEXT,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_wh ON inventory(warehouse_id);

-- 4) Zipcode to state mapping
CREATE TABLE IF NOT EXISTS us_zipcodes (
  zip   CHAR(5) PRIMARY KEY,
  state CHAR(2) NOT NULL,
  city  TEXT,
  county TEXT
);

CREATE INDEX IF NOT EXISTS idx_us_zipcodes_state ON us_zipcodes(state);

-- 5) Guardrail: prevent order_items for restricted products (DB-level)
CREATE OR REPLACE FUNCTION prevent_restricted_product_order_items()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = NEW.product_id
      AND (COALESCE(p.nicotine_product, FALSE) = TRUE OR COALESCE(p.tobacco_product, FALSE) = TRUE)
  ) THEN
    RAISE EXCEPTION 'Restricted product cannot be sold (nicotine/tobacco)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_restricted_oi ON order_items;
CREATE TRIGGER trg_prevent_restricted_oi
BEFORE INSERT OR UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION prevent_restricted_product_order_items();

COMMIT;

