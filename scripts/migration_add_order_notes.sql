-- Migration to add missing note columns to orders table
-- Run this in the Supabase Dashboard SQL Editor at:
-- https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_notes text,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS gift_message text,
ADD COLUMN IF NOT EXISTS is_gift boolean DEFAULT false;

-- To confirm they were added successfully:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';
