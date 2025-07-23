-- Supabase Authentication Setup for VIP Smoke
-- Run this in your Supabase SQL Editor after creating the project

-- 1. Create users table to extend Supabase auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  age_verified BOOLEAN DEFAULT FALSE,
  age INTEGER,
  vip_member BOOLEAN DEFAULT FALSE,
  vip_tier TEXT DEFAULT 'standard',
  loyalty_points INTEGER DEFAULT 0,
  date_of_birth DATE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 4. Create trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, age_verified, age)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'age_verified')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, null)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Update existing tables to work with authenticated users
-- Add user_id to cart_items for persistent carts
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to user_behavior for recommendations
ALTER TABLE user_behavior ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to user_preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 8. Create policies for other tables (allowing all access for now - refine later)
CREATE POLICY "Allow authenticated users full access" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access" ON brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users full access" ON memberships FOR ALL TO authenticated USING (true);

-- User-specific policies
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 9. Enable realtime for live updates
ALTER publication supabase_realtime ADD TABLE users;
ALTER publication supabase_realtime ADD TABLE cart_items;
ALTER publication supabase_realtime ADD TABLE orders;

-- 10. Create age verification check function
CREATE OR REPLACE FUNCTION public.verify_user_age(birth_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(birth_date)) >= 21;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.verify_user_age(DATE) IS 'Verifies if user is 21 or older based on birth date';