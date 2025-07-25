-- Fix Supabase column names to match Zoho integration expectations
-- Run this in Supabase SQL Editor

-- First, let's see what columns we have
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'products' AND table_schema = 'public';

-- Rename columns to match camelCase expectations
ALTER TABLE products 
  RENAME COLUMN category_id TO "categoryId";

ALTER TABLE products 
  RENAME COLUMN brand_id TO "brandId";

ALTER TABLE products 
  RENAME COLUMN image_url TO "imageUrl";

ALTER TABLE products 
  RENAME COLUMN in_stock TO "inStock";

ALTER TABLE products 
  RENAME COLUMN vip_exclusive TO "vipExclusive";

ALTER TABLE products 
  RENAME COLUMN created_at TO "createdAt";

-- Update categories table
ALTER TABLE categories 
  RENAME COLUMN created_at TO "createdAt";

-- Update brands table  
ALTER TABLE brands
  RENAME COLUMN logo_url TO "logoUrl";

ALTER TABLE brands
  RENAME COLUMN created_at TO "createdAt";

-- Update other tables for consistency
ALTER TABLE users
  RENAME COLUMN age_verified TO "ageVerified";

ALTER TABLE users
  RENAME COLUMN vip_member TO "vipMember";

ALTER TABLE users
  RENAME COLUMN membership_tier TO "membershipTier";

ALTER TABLE users
  RENAME COLUMN created_at TO "createdAt";

ALTER TABLE users
  RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE cart_items
  RENAME COLUMN user_id TO "userId";

ALTER TABLE cart_items
  RENAME COLUMN product_id TO "productId";

ALTER TABLE cart_items
  RENAME COLUMN created_at TO "createdAt";

ALTER TABLE cart_items
  RENAME COLUMN updated_at TO "updatedAt";

-- Update indexes to match new column names
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_brand;
DROP INDEX IF EXISTS idx_products_vip;
DROP INDEX IF EXISTS idx_cart_items_user;

CREATE INDEX idx_products_categoryId ON products("categoryId");
CREATE INDEX idx_products_brandId ON products("brandId");
CREATE INDEX idx_products_vipExclusive ON products("vipExclusive");
CREATE INDEX idx_cart_items_userId ON cart_items("userId");

-- Success message
SELECT 'Column names updated to match Zoho integration!' as result;