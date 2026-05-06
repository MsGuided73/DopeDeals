-- ─────────────────────────────────────────────────────────────────────────────
-- Add slug column to main_site_products + backfill from name
--
-- Why: app/lib/article-recommendations.ts and several other paths (search,
-- sitemap, /products list, fresh-drops, hot-products) query
-- main_site_products.slug. The column was historically only on the deprecated
-- `products` table — never carried over when main_site_products became the
-- canonical product table. Production logs are throwing
-- `column main_site_products.slug does not exist` constantly.
--
-- Backfill strategy:
--   slug = lower(regexp_replace(name, '[^a-z0-9]+', '-', 'gi'))
--   Deduplicates by appending '-2', '-3', etc. via ROW_NUMBER() partitioned by
--   the candidate slug. Idempotent — running again is a no-op because the
--   column will already be populated.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- 1. Add nullable column first (so we can backfill before constraining)
ALTER TABLE public.main_site_products
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Backfill: only rows where slug IS NULL (idempotent / safe to re-run)
WITH candidates AS (
  SELECT
    id,
    -- slugify: lowercase, alphanumerics + hyphens only, collapse runs, trim hyphens
    trim(BOTH '-' FROM
      regexp_replace(
        regexp_replace(lower(coalesce(name, '')), '[^a-z0-9]+', '-', 'g'),
        '-{2,}', '-', 'g'
      )
    ) AS base_slug
  FROM public.main_site_products
  WHERE slug IS NULL
),
ranked AS (
  SELECT
    id,
    -- Empty names → fall back to id-prefix so we always get *some* slug
    CASE WHEN base_slug = '' THEN 'product-' || substring(id::text, 1, 8) ELSE base_slug END AS base_slug,
    ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS dup_n
  FROM candidates
)
UPDATE public.main_site_products m
SET slug = CASE WHEN r.dup_n = 1 THEN r.base_slug ELSE r.base_slug || '-' || r.dup_n END
FROM ranked r
WHERE m.id = r.id AND m.slug IS NULL;

-- 3. Add unique index (use index, not constraint, so future migrations can
-- add CONCURRENTLY without rewriting the table)
CREATE UNIQUE INDEX IF NOT EXISTS idx_main_site_products_slug_unique
  ON public.main_site_products (slug)
  WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_main_site_products_slug
  ON public.main_site_products (slug);

COMMENT ON COLUMN public.main_site_products.slug IS
  'URL-safe identifier derived from name. Used by article recommendations, search, sitemap, and PDP routing. Backfilled 2026-05-06.';

COMMIT;

-- ─── Rollback ───────────────────────────────────────────────────────────────
-- BEGIN;
-- DROP INDEX IF EXISTS public.idx_main_site_products_slug_unique;
-- DROP INDEX IF EXISTS public.idx_main_site_products_slug;
-- ALTER TABLE public.main_site_products DROP COLUMN IF EXISTS slug;
-- COMMIT;
