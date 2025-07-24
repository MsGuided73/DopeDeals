# 🚀 Supabase Schema Setup Guide

## ✅ Connection Status Verified
- **Supabase URL**: Configured ✅
- **Anon Key**: Configured ✅  
- **Service Role Key**: Configured ✅
- **Admin Client**: Working ✅

## 📋 Next Steps: Create Database Schema

Since programmatic schema creation isn't available, you'll need to create the tables manually in Supabase:

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Schema Creation Script
Copy and paste this SQL into the editor and run it:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    age_verified BOOLEAN DEFAULT false,
    vip_member BOOLEAN DEFAULT false,
    membership_tier VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    vip_price DECIMAL(10,2),
    category_id VARCHAR(255) REFERENCES categories(id),
    brand_id VARCHAR(255) REFERENCES brands(id),
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    image_urls TEXT[],
    materials TEXT[],
    vip_exclusive BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(255) PRIMARY KEY,
    tier_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    benefits TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(100),
    tracking_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO categories (id, name, description) VALUES
('glass-pipes', 'Glass Pipes', 'Premium glass smoking pipes and accessories'),
('vaporizers', 'Vaporizers', 'High-quality vaporizers and vaping accessories'),
('accessories', 'Accessories', 'Smoking accessories and related products')
ON CONFLICT (id) DO NOTHING;

INSERT INTO brands (id, name, description) VALUES
('vip-signature', 'VIP Signature', 'Premium VIP exclusive products'),
('royal-crown', 'Royal Crown', 'Luxury smoking accessories'),
('premium-glass', 'Premium Glass', 'Handcrafted glass products')
ON CONFLICT (id) DO NOTHING;

INSERT INTO memberships (id, tier_name, description, price, benefits) VALUES
('vip-premium', 'VIP Premium', 'Premium membership with exclusive benefits', 99.99, ARRAY['Exclusive product access', 'Priority customer support', 'Free shipping on all orders', 'Early access to new products'])
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_vip ON products(vip_exclusive);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
```

### Step 3: Verify Setup
After running the SQL, test the connection:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const admin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
admin.from('categories').select('*').then(console.log).catch(console.error);
"
```

### Step 4: Frontend Auth Test
Once tables are created, test the frontend client in browser DevTools console:

```javascript
supabase.auth.getSession().then(console.log);
```

Expected result: `{ data: { session: null }, ... }` (indicates auth is working)

## 🎯 What This Enables

Once the schema is created, you'll have:
- **User Authentication**: Registration, login, password reset
- **Persistent Shopping Cart**: Cart tied to user accounts
- **Order Management**: Complete order processing workflow  
- **Row Level Security**: Automatic data protection per user
- **Real-time Features**: Cart updates, inventory changes
- **VIP System**: Membership tiers and exclusive products

## Next Steps After Schema Setup
1. Implement user registration/login UI
2. Connect cart to Supabase instead of memory storage
3. Add order checkout flow
4. Enable real-time cart synchronization
5. Integrate with existing Zoho/KajaPay systems

Let me know when you've run the SQL script and I'll verify the connection and continue with the authentication implementation.