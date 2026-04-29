-- ─────────────────────────────────────────────────────────────────────
-- RooR Bongs subcategorization backfill
-- ─────────────────────────────────────────────────────────────────────
--
-- Background: every RooR bong currently has subcategory_slug='percolator_bongs'
-- regardless of actual shape or whether it has a percolator. This script
-- backfills three orthogonal dimensions:
--
--   1) subcategory_slug  → primary SHAPE (one of: beaker, straight_tube,
--      bubbler, bubble_base, recycler, ash_catcher)
--   2) percolator_types  → ARRAY of perc types present (tree, barrel, inline)
--   3) is_recycler       → boolean (built-in reclaim, X 1130 / Eleven30 line)
--
-- Scope: 68 RooR rows where category_slug='bongs' (active + inactive).
-- Out of scope: ashtrays (already correctly tagged, surface in accessories
-- via the accessories API's category_slug filter), and the 4 ash-catchers
-- with category_slug='ash_catchers' (separate cleanup later).
--
-- Rollback: previous subcategory_slug was 'percolator_bongs' for all rows
-- in scope, except 5 ash-catchers tagged 'variation' and 1 tagged
-- 'percolator_bongs'. New columns can be dropped if needed.
-- ─────────────────────────────────────────────────────────────────────

BEGIN;

-- ── 1. Schema: add new dimension columns ──────────────────────────────
ALTER TABLE main_site_products
  ADD COLUMN IF NOT EXISTS percolator_types text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_recycler      boolean DEFAULT false;

-- ── 2. Backfill subcategory_slug (SHAPE) ──────────────────────────────
-- Priority order — first match wins. A single CASE expression keeps the
-- ordering explicit and lets us re-run idempotently.
UPDATE main_site_products
   SET subcategory_slug = CASE
     WHEN name ~* 'ash[ -]catcher'                     THEN 'ash_catcher'
     WHEN name ~* 'x ?1130|eleven30|recycler'          THEN 'recycler'
     WHEN name ~* 'bubble base'                        THEN 'bubble_base'
     WHEN name ~* 'bubbler'                            THEN 'bubbler'
     WHEN name ~* 'beaker|zeaker'                      THEN 'beaker'
     WHEN name ~* 'straight|inline|zumo|snapper'       THEN 'straight_tube'
     ELSE 'straight_tube'
   END
 WHERE category_slug = 'bongs'
   AND name ~* '^roor';

-- ── 3. Backfill percolator_types (multi-valued) ───────────────────────
-- Build the array from boolean tests on the name. Includes generic perc
-- words (tree/barrel/inline) and the N-arm pattern (4-arm, 10 arm) which
-- is always a tree-style perc.
UPDATE main_site_products
   SET percolator_types = ARRAY(
     SELECT t FROM (VALUES
       (CASE WHEN name ~* 'tree|\d+[ -]?arm' THEN 'tree'   ELSE NULL END),
       (CASE WHEN name ~* 'barrel'           THEN 'barrel' ELSE NULL END),
       (CASE WHEN name ~* 'inline'           THEN 'inline' ELSE NULL END)
     ) AS v(t)
     WHERE t IS NOT NULL
   )
 WHERE category_slug = 'bongs'
   AND name ~* '^roor';

-- ── 4. Backfill is_recycler ───────────────────────────────────────────
UPDATE main_site_products
   SET is_recycler = (name ~* 'x ?1130|eleven30|recycler')
 WHERE category_slug = 'bongs'
   AND name ~* '^roor';

-- ── 5. Sanity-check SELECTs (review BEFORE COMMIT) ────────────────────

-- Distribution by new shape slug
SELECT subcategory_slug AS shape, COUNT(*) AS n
  FROM main_site_products
 WHERE category_slug = 'bongs' AND name ~* '^roor'
 GROUP BY subcategory_slug
 ORDER BY n DESC;

-- Distribution by percolator types
SELECT percolator_types, COUNT(*) AS n
  FROM main_site_products
 WHERE category_slug = 'bongs' AND name ~* '^roor'
 GROUP BY percolator_types
 ORDER BY n DESC;

-- Recycler count
SELECT COUNT(*) AS recycler_rows
  FROM main_site_products
 WHERE category_slug = 'bongs' AND name ~* '^roor' AND is_recycler;

-- Per-row preview (truncate name for readability)
SELECT
    LEFT(name, 60)        AS name,
    subcategory_slug      AS shape,
    percolator_types      AS percs,
    is_recycler           AS recycler,
    is_active             AS active
  FROM main_site_products
 WHERE category_slug = 'bongs' AND name ~* '^roor'
 ORDER BY subcategory_slug, name;

-- If everything looks right, replace ROLLBACK below with COMMIT and re-run.
ROLLBACK;
