-- Fix Supabase schema to match Zoho integration expectations
-- Run this in Supabase SQL Editor

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    age_verified BOOLEAN DEFAULT false,
    vip_member BOOLEAN DEFAULT false,
    membership_tier VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table with correct schema
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(500),
    parentId VARCHAR(255),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brands table with correct schema
CREATE TABLE brands (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logoUrl VARCHAR(500),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table with correct schema for Zoho integration
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    vipPrice DECIMAL(10,2),
    categoryId VARCHAR(255) REFERENCES categories(id),
    brandId VARCHAR(255) REFERENCES brands(id),
    sku VARCHAR(100),
    stockQuantity INTEGER DEFAULT 0,
    imageUrls TEXT[],
    materials TEXT[],
    vipExclusive BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    zohoItemId VARCHAR(255),
    zohoSyncStatus VARCHAR(50) DEFAULT 'pending',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memberships table
CREATE TABLE memberships (
    id VARCHAR(255) PRIMARY KEY,
    tierName VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    benefits TEXT[],
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
    id VARCHAR(255) PRIMARY KEY,
    userId UUID REFERENCES users(id) ON DELETE CASCADE,
    productId VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(userId, productId)
);

-- Create orders table
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    userId UUID REFERENCES users(id),
    totalAmount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shippingAddress TEXT,
    billingAddress TEXT,
    paymentMethod VARCHAR(100),
    trackingNumber VARCHAR(255),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id VARCHAR(255) PRIMARY KEY,
    orderId VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
    productId VARCHAR(255) REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample membership
INSERT INTO memberships (id, tierName, description, price, benefits) VALUES
('vip-premium', 'VIP Premium', 'Premium membership with exclusive benefits', 99.99, 
 ARRAY['Exclusive product access', 'Priority customer support', 'Free shipping on all orders', 'Early access to new products']);

-- Create indexes for performance
CREATE INDEX idx_products_categoryId ON products(categoryId);
CREATE INDEX idx_products_brandId ON products(brandId);
CREATE INDEX idx_products_vipExclusive ON products(vipExclusive);
CREATE INDEX idx_products_zohoItemId ON products(zohoItemId);
CREATE INDEX idx_cart_items_userId ON cart_items(userId);
CREATE INDEX idx_orders_userId ON orders(userId);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = userId);
CREATE POLICY "Users can modify own cart" ON cart_items FOR ALL USING (auth.uid() = userId);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = userId);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.orderId AND userId = auth.uid())
);

-- Success message
SELECT 'Schema updated successfully for Zoho integration!' as result;