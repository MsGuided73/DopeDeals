-- Migration: Fix cart schema to work with existing API
-- Add missing columns to carts and cart_items tables for proper cart functionality

-- First, check and add missing columns to carts table
-- The carts table currently has age verification fields, but we need cart metadata fields

DO $$
BEGIN
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'carts' AND column_name = 'updated_at') THEN
        ALTER TABLE carts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Ensure cart_items table has the correct structure
-- Drop and recreate cart_items table with proper schema since it's empty

DROP TABLE IF EXISTS cart_items CASCADE;

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES main_site_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10,2) NOT NULL CHECK (price_at_time >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one item per product per cart
  UNIQUE(cart_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for cart_items
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_cart_items_updated_at ON cart_items;
CREATE TRIGGER trigger_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update RLS policies for carts table (keep existing age verification policies but add cart access)
-- Drop existing cart policies that might conflict
DROP POLICY IF EXISTS "Users can access own carts" ON carts;

-- Create new cart access policy that works with both age verification and cart functionality
CREATE POLICY "Users can access own carts" ON carts
  FOR ALL USING (
    -- Authenticated user accessing their cart
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    -- Session-based access
    (session_id IS NOT NULL) OR
    -- Service role bypass
    (auth.jwt() ->> 'role' = 'service_role')
  );

-- RLS policies for cart_items table
DROP POLICY IF EXISTS "Cart items access via parent cart" ON cart_items;

CREATE POLICY "Cart items access via parent cart" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM carts c
      WHERE c.id = cart_items.cart_id
      AND (
        -- Authenticated user owns the cart
        (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
        -- Session-based access
        (c.session_id IS NOT NULL) OR
        -- Service role
        (auth.jwt() ->> 'role' = 'service_role')
      )
    )
  );

-- Add comment for documentation
COMMENT ON TABLE carts IS 'Stores cart metadata including user/session tracking and age verification';
COMMENT ON TABLE cart_items IS 'Stores individual items within shopping carts';
