-- Ensure the products bucket is truly public
-- Run this in Supabase SQL Editor

-- Update the bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'products';

-- Verify
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('products', 'website-images');

-- Check existing policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;

