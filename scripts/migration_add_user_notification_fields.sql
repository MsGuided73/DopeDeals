-- Migration: Add user notification fields
-- Description: Adds phone and subscription preference columns to the users table.
-- Execution: Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS subscribe_sms boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscribe_email boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Optional: Update search path or verify
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
