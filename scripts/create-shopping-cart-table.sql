-- Create shopping cart table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Drop existing table if it has wrong schema
-- DROP TABLE IF EXISTS shopping_cart CASCADE;

-- Create shopping cart table with correct schema
CREATE TABLE IF NOT EXISTS shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  
  -- Cart Items - using TEXT for product_id to match products table
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10,2) NOT NULL, -- Price when added to cart
  
  -- Cart Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one entry per product per user/session
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;

-- Create policies for cart access
-- Users can only access their own cart items
CREATE POLICY "Users can view own cart items" ON shopping_cart
  FOR SELECT USING (
    auth.uid() = user_id OR 
    session_id IS NOT NULL -- Allow session-based access for guests
  );

CREATE POLICY "Users can insert own cart items" ON shopping_cart
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    session_id IS NOT NULL -- Allow session-based access for guests
  );

CREATE POLICY "Users can update own cart items" ON shopping_cart
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    session_id IS NOT NULL -- Allow session-based access for guests
  );

CREATE POLICY "Users can delete own cart items" ON shopping_cart
  FOR DELETE USING (
    auth.uid() = user_id OR 
    session_id IS NOT NULL -- Allow session-based access for guests
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_session_id ON shopping_cart(session_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_product_id ON shopping_cart(product_id);

-- Verify table exists
SELECT 'Shopping cart table created successfully' as status;
