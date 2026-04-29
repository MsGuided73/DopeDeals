-- Retag Puffco Proxy accessories from misleading slugs to a dedicated
-- 'proxy_accessories' subcategory_slug.
--
-- Why:
--   - 'percolator_bongs' is correctly used by 38 actual Roor/Diamond Glass
--     bongs; two Puffco Proxy items were mistagged there.
--   - Several Proxy bubblers/caps were tagged 'e_rig' but they are glass/cap
--     accessories for the Proxy, not the Proxy device itself.
--
-- Scope: only the five accessory SKUs below. Proxy device SKUs and Travel
-- Packs are intentionally not touched.
--
-- Rollback: previous slugs were 'e_rig' or 'percolator_bongs' (see comment
-- next to each row).

BEGIN;

-- Bubblers / glass attachments for Proxy
UPDATE main_site_products
   SET subcategory_slug = 'proxy_accessories'
 WHERE name IN (
   'Puffco Proxy Bubbler (Desert)',                 -- was 'e_rig'
   'Puffco Proxy Bubbler (Black)',                  -- was 'e_rig'
   'Puffco Proxy Bubblers (2 colors/styles available)', -- was 'percolator_bongs'
   'Puffco Proxy Droplet',                          -- was 'percolator_bongs'
   'Puffco Proxy Ball Cap Desert (6 Pack)'          -- was 'e_rig'
 );

-- Sanity check before commit
SELECT name, category_slug, subcategory_slug
  FROM main_site_products
 WHERE subcategory_slug = 'proxy_accessories'
 ORDER BY name;

COMMIT;
