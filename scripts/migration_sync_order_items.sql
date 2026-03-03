-- Comprehensive Migration to sync 'order_items' table with application schema
-- Run this in the Supabase Dashboard SQL Editor at:
-- https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

ALTER TABLE public.order_items 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS product_name text,
ADD COLUMN IF NOT EXISTS product_sku text,
ADD COLUMN IF NOT EXISTS product_image_url text,
ADD COLUMN IF NOT EXISTS unit_price numeric(10,2),
ADD COLUMN IF NOT EXISTS quantity integer,
ADD COLUMN IF NOT EXISTS total_price numeric(10,2),
ADD COLUMN IF NOT EXISTS fulfillment_status text DEFAULT 'unfulfilled',
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
