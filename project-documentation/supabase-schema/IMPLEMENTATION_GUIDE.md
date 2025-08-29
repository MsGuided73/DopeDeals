# Supabase Schema Audit and Implementation Guide (VIP Smoke)

This document is the production-ready reference for setting up a fresh Supabase project compatible with the current Next.js app. It includes an audit summary of the existing VIP Smoke database, complete DDL (tables, indexes, RLS), functions, storage policies, environment variables, integration activation, and verification steps.

---

## 0) Audit summary (current vs. required)

Observed in VIP Smoke (public schema) via introspection:
- Present tables: brands, categories, products, orders, order_items, cart_items, users, memberships, inventory, compliance_rules, product_compliance, us_zipcodes, raw_zoho_items, zoho_tokens, compliance_audit_log (not referenced in code yet)
- Not found but used/expected by app:
  - product_media (gallery + thumbnails)
  - shipstation_* set: shipstation_orders, shipstation_shipments, shipstation_products, shipstation_warehouses, shipstation_webhooks, shipstation_sync_status
  - payment_transactions
  - concierge_* (concierge_messages, etc.) if AI/concierge features are enabled
- Products shape differences:
  - Existing includes: vip_price, image_urls TEXT[], materials TEXT[], channels TEXT[], is_active, nicotine_product, tobacco_product (OK)
  - App expects additional PDP/editorial fields: slug, short_description, description_md, specs, attributes, weight_g, dim_mm, seo_*
- Inventory shape differences:
  - Existing has product_id (varchar), warehouse_id, available, reserved, source_version, last_synced_at. The app can use available/reserved; warehouse_id is fine if multi-warehouse.

Conclusion: Add the missing integration/media/payment tables and PDP/editorial product columns. Keep existing columns (vip_price, image_urls) for compatibility.

---

## 1) One-time setup checklist

- Enable pgcrypto extension:
```sql
create extension if not exists pgcrypto;
```
- Create Storage bucket products (Public ON) in Dashboard
- Run the DDL below in order (Core → Compliance → Media → Integrations → Payments)
- Apply RLS policies
- Run functions (checkout_atomic)
- Configure environment variables

---

## 2) Core DDL (create/update)

```sql
-- users (app profile; auth.users is managed by Supabase Auth)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  age_verified boolean default false,
  vip_member boolean default false,
  membership_tier text default 'Standard',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- categories/brands
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  parent_id uuid references categories(id)
);
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text
);

-- products (augment existing with PDP/editorial + flags)
alter table products
  add column if not exists slug text unique,
  add column if not exists short_description text,
  add column if not exists description_md text,
  add column if not exists specs jsonb,
  add column if not exists attributes jsonb,
  add column if not exists weight_g int,
  add column if not exists dim_mm jsonb,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists zoho_item_id text,
  add column if not exists shipstation_product_id text,
  add column if not exists airtable_record_id text;

-- inventory (use existing; ensure indexes)
create index if not exists idx_inventory_product on inventory(product_id);

-- orders & order_items (ensure indexes)
create index if not exists idx_order_items_order on order_items(order_id);

-- cart (exists) ensure uniqueness
create unique index if not exists uq_cart_user_product on cart_items(user_id, product_id);

-- helpful catalog indexes
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_slug on products(slug);
```

---

## 3) Compliance and geography
```sql
create table if not exists compliance_rules (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  restricted_states text[] default '{}',
  age_requirement int,
  shipping_restrictions jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Two supported shapes exist for product_compliance; current project uses a denormalized record
-- Keep as-is and evolve later if needed.
create table if not exists product_compliance (
  product_id text not null,
  categories text[],
  flags jsonb,
  last_classified_at timestamptz,
  primary key(product_id)
);

create table if not exists us_zipcodes (
  zip char(5) primary key,
  state char(2) not null,
  city text,
  county text
);
```

---

## 4) Media (public images)
```sql
create table if not exists product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  type text not null check (type in ('image','video')),
  path text not null, -- path relative to products bucket
  alt text,
  role text check (role in ('hero','thumbnail','gallery','swatch')),
  sort int default 0,
  width int,
  height int,
  variant_key text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_product_media_product on product_media(product_id);
create index if not exists idx_product_media_role_sort on product_media(product_id, role, sort);
-- one hero per product (optional)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='uq_product_media_one_hero'
  ) THEN
    CREATE UNIQUE INDEX uq_product_media_one_hero ON product_media(product_id) WHERE role='hero';
  END IF; END $$;

-- Storage policy: public read for products bucket
create policy if not exists "Public read for products bucket" on storage.objects
for select to public using (bucket_id = 'products');
```

---

## 5) Integrations and payments
```sql
-- ShipStation mirrors used by service.ts
create table if not exists shipstation_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  shipstation_order_id text unique,
  order_number text not null,
  order_key text,
  order_date timestamptz not null,
  order_status text not null,
  customer_id text not null,
  bill_to jsonb,
  ship_to jsonb,
  items jsonb not null,
  order_total numeric(10,2) not null,
  amount_paid numeric(10,2),
  tax_amount numeric(10,2),
  shipping_amount numeric(10,2),
  customer_notes text,
  internal_notes text,
  carrier_code text,
  service_code text,
  package_code text,
  confirmation text,
  ship_date timestamptz,
  hold_until_date timestamptz,
  weight jsonb,
  dimensions jsonb,
  insurance_options jsonb,
  international_options jsonb,
  advanced_options jsonb,
  tag_ids jsonb,
  user_id text,
  synced_at timestamptz
);

create table if not exists shipstation_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  shipstation_order_id text not null,
  shipment_id text unique,
  user_id text,
  customer_email text,
  order_number text not null,
  create_date timestamptz not null,
  ship_date timestamptz not null,
  ship_to jsonb not null,
  weight jsonb,
  dimensions jsonb,
  insurance_cost numeric(10,2),
  shipping_cost numeric(10,2),
  tracking_number text,
  is_return_label boolean default false,
  batch_number text,
  carrier_code text,
  service_code text,
  package_code text,
  confirmation text,
  warehouse_id text,
  voided boolean default false,
  void_date timestamptz,
  marketplace_notified boolean default false,
  notify_error_message text,
  shipment_items jsonb,
  label_data text,
  form_data text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists shipstation_webhooks (
  id uuid primary key default gen_random_uuid(),
  resource_url text not null,
  resource_type text not null,
  event_type text not null,
  data jsonb not null,
  processed boolean default false,
  processed_at timestamptz,
  error_message text,
  retry_count int default 0,
  created_at timestamptz default now()
);

create table if not exists shipstation_products (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  sku text not null,
  name text not null,
  price numeric(10,2),
  default_cost numeric(10,2),
  length numeric(5,2), width numeric(5,2), height numeric(5,2),
  weight_oz numeric(5,2),
  internal_notes text,
  fulfillment_sku text,
  create_date timestamptz,
  modify_date timestamptz,
  active boolean default true,
  product_category jsonb,
  product_type text,
  warehouse_location text,
  default_carrier_code text,
  default_service_code text,
  default_package_code text,
  default_confirmation text,
  customs_description text,
  customs_value numeric(10,2),
  customs_tariff_no text,
  customs_country_code text,
  no_customs boolean default false,
  tags jsonb,
  synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists shipstation_warehouses (
  id uuid primary key default gen_random_uuid(),
  warehouse_id text not null unique,
  warehouse_name text not null,
  origin_address jsonb not null,
  return_address jsonb,
  create_date timestamptz,
  is_default boolean default false,
  synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists shipstation_sync_status (
  id uuid primary key default gen_random_uuid(),
  sync_type text not null,
  last_sync_at timestamptz,
  last_successful_sync_at timestamptz,
  status text not null,
  error_message text,
  records_processed int default 0,
  records_updated int default 0,
  records_created int default 0,
  records_errored int default 0,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payments
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  transaction_type text not null, -- charge|refund|void|auth
  amount numeric(10,2) not null,
  currency text default 'USD',
  transaction_details jsonb,
  created_at timestamptz default now()
);

-- Zoho helpers
create table if not exists raw_zoho_items (
  id uuid primary key default gen_random_uuid(),
  payload jsonb,
  created_at timestamptz default now()
);
create table if not exists zoho_tokens (
  org_id text primary key,
  refresh_token text,
  access_token text,
  expires_at timestamptz,
  dc text
);
```

---

## 6) RLS policies (minimum safe set)
```sql
-- Enable RLS
alter table users enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table products enable row level security;
alter table product_media enable row level security;

-- Users can read/update own profile
create policy if not exists users_select_self on users for select using (auth.uid() = id);
create policy if not exists users_update_self on users for update using (auth.uid() = id);

-- Catalog readable when active
create policy if not exists products_read_active on products for select using (coalesce(is_active,true));
create policy if not exists pm_read_active on product_media for select using (
  exists(select 1 from products p where p.id = product_media.product_id and coalesce(p.is_active,true))
);

-- Cart ownership
create policy if not exists cart_rw_self on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders visible to owner; items visible through orders
create policy if not exists orders_select_self on orders for select using (auth.uid() = user_id);
create policy if not exists orders_insert_self on orders for insert with check (auth.uid() = user_id);
create policy if not exists oi_select_self on order_items for select using (
  exists(select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);
```

---

## 7) Functions / RPCs
- checkout_atomic(p_user_id uuid, p_items jsonb, p_billing jsonb, p_shipping jsonb) returns jsonb
  - Paste and run supabase/functions/checkout_atomic.sql
- Optional follow-ups: restock_order_on_cancel, add_payment_tx_atomic, search_products_ft

---

## 8) Storage policies (public images)
- Create bucket products (Public ON)
- Policy provided above: "Public read for products bucket"
- Writes only via service role; no write policies required

---

## 9) Environment variables (Next.js)
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- SHIPSTATION_API_KEY, SHIPSTATION_API_SECRET, SHIPSTATION_WEBHOOK_URL, SHIPSTATION_ENABLE_WEBHOOKS=true (optional)
- AIRTABLE_TOKEN, AIRTABLE_BASE, AIRTABLE_TABLE (importer)
- KAJA_PAY_* (when enabling payments)

---

## 10) Integration activation & verification

- Zoho
  - Ensure zoho_tokens populated; run inventory sync to fill inventory.available
  - Verify: `select count(*) from inventory;`

- ShipStation
  - Set envs; call `POST /api/shipstation/webhooks/setup`
  - Verify: `GET /api/shipstation/health` returns healthy

- Airtable
  - Run: `pnpm run sync:airtable -- --limit 5`
  - Verify: product_media rows exist and images accessible via Storage public URLs

- Checkout
  - Run SQL function (checkout_atomic) and test `POST /api/checkout`

---

## 11) Troubleshooting
- RLS: if reads fail, verify products_read_active and pm_read_active policies
- Images 404: confirm bucket name "products" and product_media.path values
- Airtable rate limits: lower importer concurrency (already throttled ~200ms) and use `--since`
- ShipStation webhook 503: missing envs; set API key/secret and webhook URL

