-- Carousel Slides Table Migration
-- Creates table for dynamic homepage carousel management

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create carousel_slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content fields
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT NOT NULL DEFAULT 'Learn More',
    cta_link TEXT NOT NULL DEFAULT '/',
    
    -- Visual styling
    background_image_url TEXT NOT NULL,
    text_color TEXT NOT NULL DEFAULT 'text-white',
    overlay_opacity DECIMAL(3,2) DEFAULT 0.4 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
    
    -- Management fields
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    display_duration INTEGER NOT NULL DEFAULT 5000, -- milliseconds
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- Reference to admin user who created it
    
    -- Constraints
    CONSTRAINT valid_cta_link CHECK (cta_link ~ '^(/|https?://).*'),
    CONSTRAINT valid_text_color CHECK (text_color IN ('text-white', 'text-black', 'text-gray-900', 'text-gray-100'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active_order ON carousel_slides (is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_carousel_slides_created_at ON carousel_slides (created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_carousel_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_carousel_slides_updated_at
    BEFORE UPDATE ON carousel_slides
    FOR EACH ROW
    EXECUTE FUNCTION update_carousel_slides_updated_at();

-- Insert the existing hardcoded slides as initial data
INSERT INTO carousel_slides (
    title, subtitle, description, cta_text, cta_link, 
    background_image_url, text_color, sort_order, is_active
) VALUES 
(
    'VIP CLUB',
    'EXCLUSIVE REWARDS',
    'Join our VIP Club and unlock exclusive rewards, early access to new products, and special member pricing.',
    'JOIN VIP CLUB',
    '/rewards',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIPClubblv1.jpeg',
    'text-white',
    1,
    true
),
(
    'PREMIUM GLASS',
    'ARTISAN COLLECTION',
    'Discover our curated collection of premium glass pieces from renowned artists and top brands.',
    'SHOP GLASS',
    '/bongs',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Bongs.jpeg',
    'text-white',
    2,
    true
),
(
    'THCA FLOWER',
    'PREMIUM QUALITY',
    'Experience the finest THCA flower strains, carefully selected for quality and potency.',
    'SHOP THCA',
    '/products?q=thca+flower',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_Flower.jpeg',
    'text-white',
    3,
    true
);

-- Add RLS (Row Level Security) policies
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active slides
CREATE POLICY "Anyone can view active carousel slides" ON carousel_slides
    FOR SELECT USING (is_active = true);

-- Policy: Only authenticated users can manage slides (for admin interface)
CREATE POLICY "Authenticated users can manage carousel slides" ON carousel_slides
    FOR ALL USING (auth.role() = 'authenticated');

-- Add comment for documentation
COMMENT ON TABLE carousel_slides IS 'Stores dynamic carousel slide data for homepage banner';
COMMENT ON COLUMN carousel_slides.display_duration IS 'Duration in milliseconds to display this slide';
COMMENT ON COLUMN carousel_slides.overlay_opacity IS 'Opacity of dark overlay on background image (0.0 to 1.0)';
COMMENT ON COLUMN carousel_slides.sort_order IS 'Order of slides in carousel (lower numbers first)';

-- Grant permissions
GRANT SELECT ON carousel_slides TO anon;
GRANT ALL ON carousel_slides TO authenticated;
