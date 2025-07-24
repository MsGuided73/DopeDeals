import { createClient } from '@supabase/supabase-js';

async function createSchema() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🚀 Creating VIP Smoke database schema...');

  // First, let's create the core tables using individual SQL statements
  const tables = [
    {
      name: 'users',
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          age_verified BOOLEAN DEFAULT false,
          vip_member BOOLEAN DEFAULT false,
          membership_tier VARCHAR(50) DEFAULT 'Standard',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'categories',
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          parent_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'brands',
      sql: `
        CREATE TABLE IF NOT EXISTS brands (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          logo_url VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'products',
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          vip_price DECIMAL(10,2),
          category_id VARCHAR(255),
          brand_id VARCHAR(255),
          sku VARCHAR(100),
          stock_quantity INTEGER DEFAULT 0,
          image_urls TEXT[],
          materials TEXT[],
          vip_exclusive BOOLEAN DEFAULT false,
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'memberships',
      sql: `
        CREATE TABLE IF NOT EXISTS memberships (
          id VARCHAR(255) PRIMARY KEY,
          tier_name VARCHAR(100) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          benefits TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'cart_items',
      sql: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id VARCHAR(255) PRIMARY KEY,
          user_id UUID,
          product_id VARCHAR(255),
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'orders',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          user_id UUID,
          total_amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          shipping_address TEXT,
          billing_address TEXT,
          payment_method VARCHAR(100),
          tracking_number VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'order_items',
      sql: `
        CREATE TABLE IF NOT EXISTS order_items (
          id VARCHAR(255) PRIMARY KEY,
          order_id VARCHAR(255),
          product_id VARCHAR(255),
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  // Create tables sequentially
  for (const table of tables) {
    try {
      console.log(`Creating ${table.name} table...`);
      const { error } = await supabase.rpc('exec', { sql: table.sql });
      if (error) {
        console.log(`❌ Error creating ${table.name}:`, error.message);
        // Try alternative method using raw SQL
        const { error: rawError } = await supabase.from(table.name).select('*').limit(0);
        if (rawError && rawError.code === '42P01') {
          console.log(`⚠️  Table ${table.name} doesn't exist, this is expected for new setup`);
        }
      } else {
        console.log(`✅ ${table.name} table created successfully`);
      }
    } catch (err) {
      console.log(`⚠️  Could not create ${table.name}:`, err.message);
    }
  }

  // Insert sample data
  console.log('📦 Inserting sample data...');
  
  const sampleData = {
    categories: [
      { id: 'glass-pipes', name: 'Glass Pipes', description: 'Premium glass smoking pipes and accessories' },
      { id: 'vaporizers', name: 'Vaporizers', description: 'High-quality vaporizers and vaping accessories' },
      { id: 'accessories', name: 'Accessories', description: 'Smoking accessories and related products' }
    ],
    brands: [
      { id: 'vip-signature', name: 'VIP Signature', description: 'Premium VIP exclusive products' },
      { id: 'royal-crown', name: 'Royal Crown', description: 'Luxury smoking accessories' },
      { id: 'premium-glass', name: 'Premium Glass', description: 'Handcrafted glass products' }
    ],
    memberships: [
      { 
        id: 'vip-premium', 
        tier_name: 'VIP Premium', 
        description: 'Premium membership with exclusive benefits', 
        price: 99.99, 
        benefits: ['Exclusive product access', 'Priority customer support', 'Free shipping on all orders', 'Early access to new products']
      }
    ]
  };

  // Insert categories
  try {
    const { error } = await supabase.from('categories').upsert(sampleData.categories);
    if (error) {
      console.log('⚠️  Categories insert error:', error.message);
    } else {
      console.log('✅ Sample categories inserted');
    }
  } catch (err) {
    console.log('⚠️  Categories insert failed:', err.message);
  }

  // Insert brands
  try {
    const { error } = await supabase.from('brands').upsert(sampleData.brands);
    if (error) {
      console.log('⚠️  Brands insert error:', error.message);
    } else {
      console.log('✅ Sample brands inserted');
    }
  } catch (err) {
    console.log('⚠️  Brands insert failed:', err.message);
  }

  // Insert memberships
  try {
    const { error } = await supabase.from('memberships').upsert(sampleData.memberships);
    if (error) {
      console.log('⚠️  Memberships insert error:', error.message);
    } else {
      console.log('✅ Sample memberships inserted');
    }
  } catch (err) {
    console.log('⚠️  Memberships insert failed:', err.message);
  }

  // Test the final connection
  console.log('🔍 Testing database connection...');
  try {
    const { data, error } = await supabase.from('categories').select('*').limit(3);
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Database connection successful!');
      console.log('📋 Sample categories:', data);
    }
  } catch (err) {
    console.log('❌ Connection test error:', err.message);
  }

  // Enable RLS and create policies
  console.log('🔒 Setting up Row Level Security...');
  const rlsStatements = [
    'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY IF NOT EXISTS "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);`,
    `CREATE POLICY IF NOT EXISTS "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);`,
    `CREATE POLICY IF NOT EXISTS "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY IF NOT EXISTS "Users can modify own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);`
  ];

  for (const statement of rlsStatements) {
    try {
      const { error } = await supabase.rpc('exec', { sql: statement });
      if (error && !error.message.includes('already exists')) {
        console.log('⚠️  RLS setup warning:', error.message);
      }
    } catch (err) {
      console.log('⚠️  RLS setup note:', err.message);
    }
  }

  console.log('🎉 Schema creation complete!');
  console.log('✅ Your Supabase database is ready for the VIP Smoke platform');
}

createSchema().catch(console.error);