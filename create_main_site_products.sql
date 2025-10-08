-- Create main site products table (non-nicotine only)
CREATE TABLE main_site_products (
  -- Inherit all fields from products table
  LIKE products INCLUDING ALL,

  -- Add main site specific fields
  main_site_approved BOOLEAN DEFAULT true,
  main_site_approved_at TIMESTAMPTZ DEFAULT NOW(),
  main_site_approved_by UUID REFERENCES users(id),

  -- Ensure no nicotine products can exist
  nicotine_free BOOLEAN DEFAULT true CHECK (nicotine_free = true),
  tobacco_free BOOLEAN DEFAULT true CHECK (tobacco_free = true),
  farm_bill_compliant BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for main site products
CREATE INDEX idx_main_site_products_category ON main_site_products(category_id);
CREATE INDEX idx_main_site_products_brand ON main_site_products(brand_id);
CREATE INDEX idx_main_site_products_nicotine_free ON main_site_products(nicotine_free) WHERE nicotine_free = true;
CREATE INDEX idx_main_site_products_compliant ON main_site_products(farm_bill_compliant) WHERE farm_bill_compliant = true;
CREATE INDEX idx_main_site_products_search ON main_site_products
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, '')));

-- Enable RLS on main site products
ALTER TABLE main_site_products ENABLE ROW LEVEL SECURITY;

-- Main site RLS policy (non-nicotine products only)
CREATE POLICY "main_site_products_only" ON main_site_products
  FOR SELECT USING (
    nicotine_free = true
    AND farm_bill_compliant = true
    AND is_active = true
  );

-- Admin policy for main site
CREATE POLICY "main_site_admins_manage" ON main_site_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
    )
  );
