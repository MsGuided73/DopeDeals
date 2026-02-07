-- Add new filter columns to main_site_products table

ALTER TABLE main_site_products
ADD COLUMN IF NOT EXISTS flavor TEXT,
ADD COLUMN IF NOT EXISTS strain_type TEXT CHECK (strain_type IN ('sativa', 'indica', 'hybrid', 'hybrid-sativa', 'hybrid-indica') OR strain_type IS NULL),
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS material TEXT; -- useful for bongs/pipes (Glass, Silicone, Ceramic)

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_main_site_products_flavor ON main_site_products(flavor);
CREATE INDEX IF NOT EXISTS idx_main_site_products_strain_type ON main_site_products(strain_type);
CREATE INDEX IF NOT EXISTS idx_main_site_products_color ON main_site_products(color);
