-- Carousel Slides Table Setup for VIP Smoke Platform
-- Run this SQL in your Supabase Dashboard → SQL Editor

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
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active ON carousel_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_sort_order ON carousel_slides(sort_order);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_created_at ON carousel_slides(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carousel_slides_updated_at 
    BEFORE UPDATE ON carousel_slides 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access to active slides
CREATE POLICY "Anyone can view active carousel slides" ON carousel_slides
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage slides (admins)
CREATE POLICY "Authenticated users can manage carousel slides" ON carousel_slides
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert the updated carousel slides with your new images
INSERT INTO carousel_slides (
    title, subtitle, description, cta_text, cta_link, 
    background_image_url, text_color, overlay_opacity, sort_order, is_active, display_duration
) VALUES 
-- Slide 1: VIP Club with high-res image and lighter overlay
(
    'VIP CLUB',
    'EXCLUSIVE REWARDS',
    'Join our VIP Club and unlock exclusive rewards, early access to new products, and special member pricing.',
    'JOIN VIP CLUB',
    '/rewards',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIPClubblv1.jpeg',
    'text-white',
    0.15, -- Lighter overlay (3-5 shades lighter than 0.4)
    1,
    true,
    5000
),
-- Slide 2: Premium Glass with RooR Tech image
(
    'PREMIUM GLASS',
    'ARTISAN COLLECTION',
    'Discover our curated collection of premium glass pieces from renowned artists and top brands.',
    'SHOP GLASS',
    '/bongs',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/slide-us-0011-roortech.png',
    'text-white',
    0.4,
    2,
    true,
    5000
),
-- Slide 3: THCA Pre-Rolls with new image
(
    'THCA PRE-ROLLS',
    'PREMIUM QUALITY',
    'Experience the finest THCA pre-rolls, hand-rolled to perfection for quality and potency.',
    'SHOP PRE-ROLLS',
    '/products?category=pre-rolls',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/Light-preroll.jpeg',
    'text-white',
    0.4,
    3,
    true,
    5000
)
ON CONFLICT (id) DO NOTHING; -- Prevent duplicates if running multiple times

-- Add comment for documentation
COMMENT ON TABLE carousel_slides IS 'Stores dynamic carousel slide data for homepage banner with updated images';
COMMENT ON COLUMN carousel_slides.display_duration IS 'Duration in milliseconds to display this slide (5000 = 5 seconds)';
COMMENT ON COLUMN carousel_slides.overlay_opacity IS 'Opacity of dark overlay on background image (0.0 to 1.0, 0.15 = lighter overlay)';
COMMENT ON COLUMN carousel_slides.sort_order IS 'Order of slides in carousel (lower numbers first)';

-- Grant permissions
GRANT SELECT ON carousel_slides TO anon;
GRANT ALL ON carousel_slides TO authenticated;

-- Verify the data was inserted
SELECT 
    title,
    subtitle,
    background_image_url,
    overlay_opacity,
    sort_order,
    is_active,
    display_duration
FROM carousel_slides 
ORDER BY sort_order;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Carousel slides table created successfully with updated images!';
    RAISE NOTICE 'Slide 1: VIP Club with high-res image and lighter overlay (0.15)';
    RAISE NOTICE 'Slide 2: Premium Glass with RooR Tech image';
    RAISE NOTICE 'Slide 3: THCA Pre-Rolls with Light-preroll image';
    RAISE NOTICE 'All slides set to 5 seconds display duration';
END $$;
