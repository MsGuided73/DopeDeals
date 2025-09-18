-- Safe Cart System Migration (Checks for existing objects)
-- Run this in Supabase SQL Editor

-- Create shopping cart table (using TEXT for product_id to match existing products table)
CREATE TABLE IF NOT EXISTS shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  
  -- Cart Items (using TEXT to match products.id type)
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

-- Add foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'shopping_cart_product_id_fkey' 
    AND table_name = 'shopping_cart'
  ) THEN
    ALTER TABLE shopping_cart 
    ADD CONSTRAINT shopping_cart_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create orders table (simplified)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT generate_random_uuid()::text,
  
  -- Customer Information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  
  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table (using TEXT for product_id)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  
  -- Product snapshot at time of order
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image_url TEXT,
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for order_items only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_product_id_fkey' 
    AND table_name = 'order_items'
  ) THEN
    ALTER TABLE order_items 
    ADD CONSTRAINT order_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create user profiles table (simplified)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(email)
);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (with IF NOT EXISTS equivalent)
DO $$
BEGIN
  -- Shopping cart policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_cart' AND policyname = 'Users can view their own cart items') THEN
    CREATE POLICY "Users can view their own cart items" ON shopping_cart
      FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_cart' AND policyname = 'Users can insert their own cart items') THEN
    CREATE POLICY "Users can insert their own cart items" ON shopping_cart
      FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_cart' AND policyname = 'Users can update their own cart items') THEN
    CREATE POLICY "Users can update their own cart items" ON shopping_cart
      FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shopping_cart' AND policyname = 'Users can delete their own cart items') THEN
    CREATE POLICY "Users can delete their own cart items" ON shopping_cart
      FOR DELETE USING (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;
END $$;

-- Create indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_session_id ON shopping_cart(session_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_product_id ON shopping_cart(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create function to generate order numbers (safe to run multiple times)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'DC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers (safe to run multiple times)
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create function to update timestamps (safe to run multiple times)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers for updated_at
DROP TRIGGER IF EXISTS trigger_shopping_cart_updated_at ON shopping_cart;
CREATE TRIGGER trigger_shopping_cart_updated_at
  BEFORE UPDATE ON shopping_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
