BEGIN;

ALTER TABLE public.main_site_products
  ADD COLUMN IF NOT EXISTS zoho_price numeric;

COMMENT ON COLUMN public.main_site_products.zoho_price IS
  'Wholesale list price pulled from Zoho Inventory (parent company B2B price). Reference / margin only — never overrides our_price, which is the customer-facing price on Highway 420.';

COMMIT;
