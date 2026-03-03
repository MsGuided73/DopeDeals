-- Comprehensive Migration to sync 'orders' table with application schema
-- Run this in the Supabase Dashboard SQL Editor at:
-- https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS order_number text UNIQUE,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_first_name text,
ADD COLUMN IF NOT EXISTS customer_last_name text,
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_status text DEFAULT 'unfulfilled',
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS subtotal_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS tax_amount numeric(10,2) DEFAULT '0',
ADD COLUMN IF NOT EXISTS shipping_amount numeric(10,2) DEFAULT '0',
ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT '0',
ADD COLUMN IF NOT EXISTS total_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS billing_address jsonb,
ADD COLUMN IF NOT EXISTS shipping_address jsonb,
ADD COLUMN IF NOT EXISTS customer_notes text,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS gift_message text,
ADD COLUMN IF NOT EXISTS is_gift boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS carrier text,
ADD COLUMN IF NOT EXISTS shipped_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone;
