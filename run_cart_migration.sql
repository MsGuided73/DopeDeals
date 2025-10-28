-- Cart Migration Script for Highway 420
-- Run this in your Supabase SQL editor or via CLI

-- Shopping Cart & Orders System Migration
-- Creates tables for cart, orders, payments, and user profiles

-- Create user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,

  -- Shipping Address
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zipcode TEXT,
  shipping_country TEXT DEFAULT 'US',

  -- Billing Address
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zipcode TEXT,
  billing_country TEXT DEFAULT 'US',
  billing_same_as_shipping BOOLEAN DEFAULT true,

  -- Preferences
  marketing_emails BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,

  -- Account Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(email)
);

-- Create shopping cart table
CREATE TABLE IF NOT EXISTS shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users

  -- Cart Items
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10,2) NOT NULL, -- Price when added to cart

  -- Cart Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one entry per product per user/session
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own cart" ON shopping_cart
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all" ON user_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all carts" ON shopping_cart
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_shopping_cart_updated_at
  BEFORE UPDATE ON shopping_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
