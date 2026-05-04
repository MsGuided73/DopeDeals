BEGIN;

ALTER TABLE public.main_site_products
  ADD COLUMN IF NOT EXISTS zoho_stock_on_hand integer,
  ADD COLUMN IF NOT EXISTS zoho_available_stock integer,
  ADD COLUMN IF NOT EXISTS zoho_status text,
  ADD COLUMN IF NOT EXISTS zoho_sync_status text,
  ADD COLUMN IF NOT EXISTS zoho_sync_error text,
  ADD COLUMN IF NOT EXISTS zoho_raw jsonb;

COMMENT ON COLUMN public.main_site_products.zoho_stock_on_hand IS
  'Zoho stock_on_hand mirror. Reference only — never overrides stock_quantity, which is the customer-facing count on Highway 420.';
COMMENT ON COLUMN public.main_site_products.zoho_available_stock IS
  'Zoho available_stock mirror (on_hand minus committed). Reference only — promote to stock_quantity via admin action when trusted.';
COMMENT ON COLUMN public.main_site_products.zoho_status IS
  'Zoho item status (active/inactive). Separate from is_active so a Zoho deactivation never silently hides a live SKU.';
COMMENT ON COLUMN public.main_site_products.zoho_sync_status IS
  'Per-row sync health: synced | error | manual_override | not_in_zoho. Drives admin visibility into integration state.';
COMMENT ON COLUMN public.main_site_products.zoho_sync_error IS
  'Last error message from a failed Zoho sync attempt for this row, for debugging without re-hitting the API.';
COMMENT ON COLUMN public.main_site_products.zoho_raw IS
  'Last-known full Zoho item payload. Replay/debug source of truth; do not query directly in app code — use derived columns.';

COMMIT;
