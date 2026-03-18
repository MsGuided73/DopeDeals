-- Add rich text markdown and structured content fields to main_site_products
ALTER TABLE main_site_products
ADD COLUMN IF NOT EXISTS description_markdown TEXT,
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS allergy_warning TEXT,
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS flavors JSONB DEFAULT '[]'::jsonb;
