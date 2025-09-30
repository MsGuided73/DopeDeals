-- Create RLS policies for public read access to products bucket
-- Run this in Supabase SQL Editor

-- First, enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access for products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to products" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;

-- Create a policy that allows anyone to read from the products bucket
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Also allow authenticated users to upload (optional, for admin)
DROP POLICY IF EXISTS "Authenticated users can upload to products" ON storage.objects;
CREATE POLICY "Authenticated users can upload to products"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to update (optional, for admin)
DROP POLICY IF EXISTS "Authenticated users can update products" ON storage.objects;
CREATE POLICY "Authenticated users can update products"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete (optional, for admin)
DROP POLICY IF EXISTS "Authenticated users can delete from products" ON storage.objects;
CREATE POLICY "Authenticated users can delete from products"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

