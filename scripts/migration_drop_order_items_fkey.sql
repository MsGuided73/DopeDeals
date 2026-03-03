-- Fix for order_items foreign key constraint
-- Run this in the Supabase Dashboard SQL Editor at:
-- https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- The application uses both 'products' and 'main_site_products' tables concurrently right now.
-- Enforcing a strict foreign key to the old 'products' table causes checkout to fail for all new items.
-- We drop the constraint here to allow order_items to contain product IDs from either table.

ALTER TABLE public.order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
