-- URGENT: Run this in Supabase SQL Editor to fix schema mismatch
-- This will drop and recreate the products table with correct column names

-- First, drop the existing products table and related constraints
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS user_behavior CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Recreate products table with proper column names that match our code
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  "categoryId" UUID REFERENCES categories(id),
  "brandId" UUID REFERENCES brands(id),
  "imageUrl" TEXT,
  material TEXT,
  "inStock" BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  "vipExclusive" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id),
  "productId" UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" UUID REFERENCES orders(id),
  "productId" UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  "priceAtPurchase" NUMERIC(10,2) NOT NULL
);

-- Recreate user_behavior table
CREATE TABLE user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id),
  "productId" UUID REFERENCES products(id),
  action TEXT NOT NULL,
  "sessionId" TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_categoryId ON products("categoryId");
CREATE INDEX idx_products_brandId ON products("brandId");
CREATE INDEX idx_products_vipExclusive ON products("vipExclusive");
CREATE INDEX idx_cart_items_userId ON cart_items("userId");
CREATE INDEX idx_user_behavior_userId ON user_behavior("userId");

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by service role" ON products FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Products are updatable by service role" ON products FOR UPDATE TO service_role USING (true);

-- Create RLS policies for cart_items (user-specific)
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (auth.uid() = "userId");

-- Success message
SELECT 'Schema regenerated with correct camelCase column names!' as result;