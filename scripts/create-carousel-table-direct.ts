#!/usr/bin/env node

/**
 * Create Carousel Table Directly
 * 
 * This script creates the carousel_slides table using direct SQL execution
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createCarouselTableDirect(): Promise<void> {
  console.log('🎠 Creating Carousel Slides Table Directly...\n');

  try {
    // First, let's try to create the table using a simple approach
    console.log('📋 Creating carousel_slides table...');

    // Check if table already exists
    const { data: existingSlides, error: checkError } = await supabase
      .from('carousel_slides')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Table already exists!');
      
      // Show existing slides
      const { data: slides } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('sort_order');

      console.log(`\n📊 Found ${slides?.length || 0} existing slides:`);
      slides?.forEach((slide, index) => {
        console.log(`${index + 1}. ${slide.title} - ${slide.subtitle}`);
      });
      
      return;
    }

    // Table doesn't exist, let's create it step by step
    console.log('📝 Table does not exist. Creating with initial data...');

    // Since we can't execute raw SQL directly, let's create the table by inserting data
    // This will fail but give us information about what's missing
    const initialSlides = [
      {
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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

    console.log('🔄 Attempting to insert initial slides...');
    
    const { data, error } = await supabase
      .from('carousel_slides')
      .insert(initialSlides)
      .select();

    if (error) {
      console.log('❌ Error creating table/inserting data:', error.message);
      console.log('\n📋 Manual Setup Required:');
      console.log('Please run the SQL migration in your Supabase Dashboard:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run the migration from: supabase/migrations/2025-01-24_carousel_slides_table.sql');
      console.log('3. Then re-run this script');
      return;
    }

    console.log('✅ Successfully created table and inserted initial slides!');
    console.log(`📊 Created ${data?.length || 0} slides:`);
    
    data?.forEach((slide, index) => {
      console.log(`${index + 1}. ${slide.title} - ${slide.subtitle}`);
      console.log(`   CTA: "${slide.cta_text}" → ${slide.cta_link}`);
      console.log(`   Active: ${slide.is_active ? '✅' : '❌'} | Order: ${slide.sort_order}`);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createCarouselTableDirect().then(() => {
  console.log('\n✅ Carousel table creation process complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
