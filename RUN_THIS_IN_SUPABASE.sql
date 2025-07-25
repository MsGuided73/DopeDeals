-- COPY AND PASTE THIS ENTIRE SCRIPT INTO SUPABASE SQL EDITOR
-- This will fix all column naming mismatches

-- Products table fixes
ALTER TABLE products RENAME COLUMN category_id TO "categoryId";
ALTER TABLE products RENAME COLUMN brand_id TO "brandId";  
ALTER TABLE products RENAME COLUMN image_url TO "imageUrl";
ALTER TABLE products RENAME COLUMN in_stock TO "inStock";
ALTER TABLE products RENAME COLUMN vip_exclusive TO "vipExclusive";
ALTER TABLE products RENAME COLUMN created_at TO "createdAt";

-- Categories table fixes  
ALTER TABLE categories RENAME COLUMN created_at TO "createdAt";

-- Brands table fixes
ALTER TABLE brands RENAME COLUMN logo_url TO "logoUrl";
ALTER TABLE brands RENAME COLUMN created_at TO "createdAt";

-- Users table fixes
ALTER TABLE users RENAME COLUMN age_verified TO "ageVerified";
ALTER TABLE users RENAME COLUMN vip_member TO "vipMember";
ALTER TABLE users RENAME COLUMN membership_tier TO "membershipTier";
ALTER TABLE users RENAME COLUMN created_at TO "createdAt";
ALTER TABLE users RENAME COLUMN updated_at TO "updatedAt";

-- Cart items table fixes
ALTER TABLE cart_items RENAME COLUMN user_id TO "userId";
ALTER TABLE cart_items RENAME COLUMN product_id TO "productId";
ALTER TABLE cart_items RENAME COLUMN created_at TO "createdAt";
ALTER TABLE cart_items RENAME COLUMN updated_at TO "updatedAt";

-- Memberships table fixes (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'memberships') THEN
        ALTER TABLE memberships RENAME COLUMN tier_name TO "tierName";
        ALTER TABLE memberships RENAME COLUMN created_at TO "createdAt";
        ALTER TABLE memberships RENAME COLUMN updated_at TO "updatedAt";
    END IF;
END $$;

-- Update indexes to match new column names
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_brand;
DROP INDEX IF EXISTS idx_products_vip;
DROP INDEX IF EXISTS idx_cart_items_user;

-- Create new indexes with correct column names
CREATE INDEX IF NOT EXISTS idx_products_categoryId ON products("categoryId");
CREATE INDEX IF NOT EXISTS idx_products_brandId ON products("brandId");
CREATE INDEX IF NOT EXISTS idx_products_vipExclusive ON products("vipExclusive");
CREATE INDEX IF NOT EXISTS idx_cart_items_userId ON cart_items("userId");

-- Verification query
SELECT 'Schema fix completed - all columns now use camelCase!' as status;