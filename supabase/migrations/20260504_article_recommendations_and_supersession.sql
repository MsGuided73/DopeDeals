-- ─────────────────────────────────────────────────────────────────────────────
-- Higher Learning article recommendations + product supersession
--
-- Adds:
--   1. article_recommended_products — editor-curated product picks per article,
--      keyed by article_slug + slot ('rail' | 'inline') + position. Read by
--      the Higher Learning article layout to render the right-rail "Shop This
--      Setup" list and the mid-article "Upgrade Your Setup" carousel.
--   2. main_site_products.superseded_by_product_id — self-referencing pointer
--      to a newer model. When set, surfaces a "Newer model available" affordance
--      on every list/rail that renders the older product.
--   3. main_site_products.supersession_note — optional copy override
--      (e.g., "2025 model with 30% larger chamber").
--
-- The supersession columns live on the product (not on the recommendations
-- table) so a single edit propagates to every article that ever recommends
-- that SKU.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─── Supersession columns on main_site_products ─────────────────────────────
ALTER TABLE public.main_site_products
  ADD COLUMN IF NOT EXISTS superseded_by_product_id UUID
    REFERENCES public.main_site_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supersession_note TEXT;

COMMENT ON COLUMN public.main_site_products.superseded_by_product_id IS
  'Optional pointer to a newer model that supersedes this product. When set, list/rail surfaces show a "Newer model available" affordance and (if this product is out of stock) prefer routing the click to the successor.';
COMMENT ON COLUMN public.main_site_products.supersession_note IS
  'Optional short copy override shown alongside the supersession badge (e.g., "2025 model with 30% larger chamber"). Falls back to a generic "Newer model available" string when null.';

CREATE INDEX IF NOT EXISTS idx_main_site_products_superseded_by
  ON public.main_site_products (superseded_by_product_id)
  WHERE superseded_by_product_id IS NOT NULL;

-- ─── article_recommended_products ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_recommended_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug  TEXT NOT NULL,
  product_id    UUID NOT NULL REFERENCES public.main_site_products(id) ON DELETE CASCADE,
  -- 'rail'   = sticky right-rail "Shop This Setup" (typ. the SKUs the article photographs/discusses)
  -- 'inline' = mid-article "Upgrade Your Setup" carousel (the upgrade path after the reader has decided)
  slot          TEXT NOT NULL CHECK (slot IN ('rail','inline')),
  position      SMALLINT NOT NULL CHECK (position >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One product per slot-position per article. Re-ordering = update positions.
  CONSTRAINT article_recommended_products_slot_position_unique
    UNIQUE (article_slug, slot, position),
  -- Same product cannot occupy two positions in the same slot of the same article.
  CONSTRAINT article_recommended_products_slot_product_unique
    UNIQUE (article_slug, slot, product_id)
);

CREATE INDEX IF NOT EXISTS idx_article_recommended_products_lookup
  ON public.article_recommended_products (article_slug, slot, position);

CREATE INDEX IF NOT EXISTS idx_article_recommended_products_product
  ON public.article_recommended_products (product_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- Recommendations are public read (they're rendered to anonymous visitors on
-- the article page). Writes are restricted to service-role only — admin tooling
-- uses the service-role client, anon/authenticated users have no need to write.
ALTER TABLE public.article_recommended_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read article recommendations" ON public.article_recommended_products;
CREATE POLICY "Public can read article recommendations"
  ON public.article_recommended_products
  FOR SELECT
  USING (true);

-- ─── updated_at trigger ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_article_recommended_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_article_recommended_products_updated_at
  ON public.article_recommended_products;
CREATE TRIGGER trg_article_recommended_products_updated_at
  BEFORE UPDATE ON public.article_recommended_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_article_recommended_products_updated_at();

COMMIT;

-- ─── Rollback ───────────────────────────────────────────────────────────────
-- BEGIN;
-- DROP TRIGGER IF EXISTS trg_article_recommended_products_updated_at ON public.article_recommended_products;
-- DROP FUNCTION IF EXISTS public.set_article_recommended_products_updated_at();
-- DROP TABLE IF EXISTS public.article_recommended_products;
-- ALTER TABLE public.main_site_products
--   DROP COLUMN IF EXISTS supersession_note,
--   DROP COLUMN IF EXISTS superseded_by_product_id;
-- COMMIT;
