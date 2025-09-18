-- VIP Smoke Products Table Migration
-- Creates separate table for nicotine/tobacco products

-- Create VIP Smoke products table (mirrors main products table structure)
CREATE TABLE IF NOT EXISTS vip_smoke_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic product info
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  vip_price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  
  -- Organization
  brand_id TEXT,
  category_id TEXT,
  supplier_id TEXT,
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT true,
  
  -- Physical attributes
  weight DECIMAL(8,3),
  dimensions JSONB, -- {length, width, height, unit}
  materials TEXT[],
  
  -- Images and media
  image_url TEXT,
  image_urls TEXT[],
  video_urls TEXT[],
  
  -- Product attributes
  attributes JSONB DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  tags TEXT[],
  
  -- VIP Smoke specific fields
  nicotine_content DECIMAL(5,2), -- mg/ml or percentage
  nicotine_type TEXT, -- 'freebase', 'salt', 'synthetic', etc.
  tobacco_type TEXT, -- 'cigarette', 'cigar', 'pipe', 'chewing', etc.
  age_restriction INTEGER DEFAULT 21,
  requires_id_verification BOOLEAN DEFAULT true,
  
  -- Compliance and restrictions
  restricted_states TEXT[], -- States where product is banned
  restricted_zipcodes TEXT[], -- Specific zip codes where banned
  compliance_notes TEXT,
  warning_labels TEXT[],
  
  -- Status and visibility
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  vip_exclusive BOOLEAN DEFAULT false,
  requires_membership BOOLEAN DEFAULT false,
  
  -- SEO and marketing
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Zoho integration
  zoho_item_id TEXT UNIQUE,
  zoho_last_sync TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT positive_price CHECK (price > 0),
  CONSTRAINT positive_stock CHECK (stock_quantity >= 0),
  CONSTRAINT valid_nicotine_content CHECK (nicotine_content >= 0 AND nicotine_content <= 100)
);

-- Create indexes for performance
CREATE INDEX idx_vip_smoke_products_sku ON vip_smoke_products(sku);
CREATE INDEX idx_vip_smoke_products_brand ON vip_smoke_products(brand_id);
CREATE INDEX idx_vip_smoke_products_category ON vip_smoke_products(category_id);
CREATE INDEX idx_vip_smoke_products_active ON vip_smoke_products(is_active);
CREATE INDEX idx_vip_smoke_products_featured ON vip_smoke_products(featured);
CREATE INDEX idx_vip_smoke_products_price ON vip_smoke_products(price);
CREATE INDEX idx_vip_smoke_products_stock ON vip_smoke_products(stock_quantity);
CREATE INDEX idx_vip_smoke_products_nicotine ON vip_smoke_products(nicotine_content);
CREATE INDEX idx_vip_smoke_products_zoho ON vip_smoke_products(zoho_item_id);
CREATE INDEX idx_vip_smoke_products_created ON vip_smoke_products(created_at);

-- Create full-text search index
CREATE INDEX idx_vip_smoke_products_search ON vip_smoke_products 
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, '')));

-- Enable RLS
ALTER TABLE vip_smoke_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for VIP Smoke products
CREATE POLICY "VIP Smoke products visible to authenticated users" ON vip_smoke_products
  FOR SELECT USING (
    is_active = true AND 
    auth.role() = 'authenticated'
  );

-- Admin policies
CREATE POLICY "Admins can manage VIP Smoke products" ON vip_smoke_products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Create VIP Smoke categories table
CREATE TABLE IF NOT EXISTS vip_smoke_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES vip_smoke_categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  age_restriction INTEGER DEFAULT 21,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert VIP Smoke categories
INSERT INTO vip_smoke_categories (id, name, description, age_restriction) VALUES
('nicotine-pouches', 'Nicotine Pouches', 'Tobacco-free nicotine pouches and strips', 21),
('vapes', 'Vapes & E-Cigarettes', 'Electronic cigarettes and vaping devices', 21),
('tobacco', 'Tobacco Products', 'Traditional tobacco products', 21),
('accessories', 'Smoking Accessories', 'Accessories for tobacco and nicotine products', 18);

-- Create VIP Smoke brands table
CREATE TABLE IF NOT EXISTS vip_smoke_brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common VIP Smoke brands
INSERT INTO vip_smoke_brands (id, name, description) VALUES
('zyn', 'ZYN', 'Premium nicotine pouches'),
('juul', 'JUUL', 'E-cigarette and vaping products'),
('vuse', 'Vuse', 'Electronic cigarettes'),
('marlboro', 'Marlboro', 'Traditional tobacco products'),
('camel', 'Camel', 'Cigarettes and tobacco products');

-- Create function to migrate products from main table to VIP Smoke table
CREATE OR REPLACE FUNCTION migrate_to_vip_smoke()
RETURNS TABLE(migrated_count INTEGER, skipped_count INTEGER) AS $$
DECLARE
  migrated INTEGER := 0;
  skipped INTEGER := 0;
  product_record RECORD;
BEGIN
  -- Loop through products that should be in VIP Smoke
  FOR product_record IN 
    SELECT * FROM products 
    WHERE nicotine_product = true OR tobacco_product = true
  LOOP
    BEGIN
      -- Insert into VIP Smoke table
      INSERT INTO vip_smoke_products (
        id,
        name,
        description,
        short_description,
        sku,
        price,
        vip_price,
        compare_at_price,
        brand_id,
        category_id,
        stock_quantity,
        weight,
        materials,
        image_url,
        image_urls,
        attributes,
        specs,
        tags,
        is_active,
        featured,
        vip_exclusive,
        created_at,
        updated_at,
        zoho_item_id
      ) VALUES (
        product_record.id,
        product_record.name,
        product_record.description,
        product_record.short_description,
        product_record.sku,
        product_record.price,
        product_record.vip_price,
        product_record.compare_at_price,
        product_record.brand_id,
        product_record.category_id,
        product_record.stock_quantity,
        product_record.weight,
        product_record.materials,
        product_record.image_url,
        product_record.image_urls,
        product_record.attributes,
        product_record.specs,
        product_record.tags,
        product_record.is_active,
        product_record.featured,
        product_record.vip_exclusive,
        product_record.created_at,
        product_record.updated_at,
        product_record.zoho_item_id
      );
      
      migrated := migrated + 1;
      
    EXCEPTION WHEN OTHERS THEN
      -- Skip duplicates or other errors
      skipped := skipped + 1;
      CONTINUE;
    END;
  END LOOP;
  
  RETURN QUERY SELECT migrated, skipped;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up migrated products from main table
CREATE OR REPLACE FUNCTION cleanup_migrated_products()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete products that have been migrated to VIP Smoke
  DELETE FROM products 
  WHERE (nicotine_product = true OR tobacco_product = true)
  AND id IN (SELECT id FROM vip_smoke_products);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for VIP Smoke products
CREATE OR REPLACE FUNCTION update_vip_smoke_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vip_smoke_products_updated_at
  BEFORE UPDATE ON vip_smoke_products
  FOR EACH ROW
  EXECUTE FUNCTION update_vip_smoke_updated_at();
