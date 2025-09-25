import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Try to create the initial slides if table exists but is empty
    const initialSlides = [
      {
        title: 'VIP CLUB',
        subtitle: 'EXCLUSIVE REWARDS',
        description: 'Join our VIP Club and unlock exclusive rewards, early access to new products, and special member pricing.',
        cta_text: 'JOIN VIP CLUB',
        cta_link: '/rewards',
        background_image_url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIPClubblv1.jpeg',
        text_color: 'text-white',
        sort_order: 1,
        is_active: true,
        display_duration: 5000,
        overlay_opacity: 0.4
      },
      {
        title: 'PREMIUM GLASS',
        subtitle: 'ARTISAN COLLECTION',
        description: 'Discover our curated collection of premium glass pieces from renowned artists and top brands.',
        cta_text: 'SHOP GLASS',
        cta_link: '/bongs',
        background_image_url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Bongs.jpeg',
        text_color: 'text-white',
        sort_order: 2,
        is_active: true,
        display_duration: 5000,
        overlay_opacity: 0.4
      },
      {
        title: 'THCA FLOWER',
        subtitle: 'PREMIUM QUALITY',
        description: 'Experience the finest THCA flower strains, carefully selected for quality and potency.',
        cta_text: 'SHOP THCA',
        cta_link: '/products?q=thca+flower',
        background_image_url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_Flower.jpeg',
        text_color: 'text-white',
        sort_order: 3,
        is_active: true,
        display_duration: 5000,
        overlay_opacity: 0.4
      }
    ];

    // Check if slides already exist
    const { data: existingSlides, error: checkError } = await supabase
      .from('carousel_slides')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json({ 
        error: 'Table does not exist. Please run the SQL migration first.',
        sql: `
-- Run this SQL in your Supabase Dashboard:
CREATE TABLE IF NOT EXISTS carousel_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT NOT NULL DEFAULT 'Learn More',
    cta_link TEXT NOT NULL DEFAULT '/',
    background_image_url TEXT NOT NULL,
    text_color TEXT NOT NULL DEFAULT 'text-white',
    overlay_opacity DECIMAL(3,2) DEFAULT 0.4,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    display_duration INTEGER NOT NULL DEFAULT 5000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- Enable RLS
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active carousel slides" ON carousel_slides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage carousel slides" ON carousel_slides
    FOR ALL USING (auth.role() = 'authenticated');
        `
      }, { status: 400 });
    }

    if (existingSlides && existingSlides.length > 0) {
      return NextResponse.json({ 
        message: 'Slides already exist',
        count: existingSlides.length 
      });
    }

    // Insert initial slides
    const { data, error } = await supabase
      .from('carousel_slides')
      .insert(initialSlides)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Initial slides created successfully',
      slides: data 
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
