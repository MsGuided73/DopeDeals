-- Fix storage policy for products bucket
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;

-- Create the correct policy for public read access
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Also ensure website-images bucket has public access
DROP POLICY IF EXISTS "Public read access for website-images" ON storage.objects;

CREATE POLICY "Public read access for website-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'website-images');

-- Verify the policies were created
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%Public read access%'
ORDER BY policyname;

