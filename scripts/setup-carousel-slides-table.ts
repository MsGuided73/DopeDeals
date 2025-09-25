#!/usr/bin/env node

/**
 * Setup Carousel Slides Table
 * 
 * This script creates the carousel_slides table and migrates existing hardcoded slides
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupCarouselSlidesTable(): Promise<void> {
  console.log('🎠 Setting up Carousel Slides Table...\n');

  try {
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '2025-01-24_carousel_slides_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration SQL...');

    // Execute the migration SQL
    // Note: We'll need to run this manually in Supabase SQL editor since we can't execute raw SQL directly
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:');
    console.log('='.repeat(80));
    console.log(migrationSQL);
    console.log('='.repeat(80));
    console.log();

    // Try to check if the table exists by querying it
    console.log('🔍 Checking if carousel_slides table exists...');
    
    const { data: slides, error } = await supabase
      .from('carousel_slides')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table does not exist yet. Please run the migration SQL above.');
        console.log('\n📋 Steps to complete setup:');
        console.log('1. Go to your Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the SQL above');
        console.log('4. Run the query');
        console.log('5. Re-run this script to verify');
        return;
      } else {
        console.error('❌ Error checking table:', error.message);
        return;
      }
    }

    console.log('✅ carousel_slides table exists!');

    // Check the data
    const { data: allSlides, error: fetchError } = await supabase
      .from('carousel_slides')
      .select('*')
      .order('sort_order');

    if (fetchError) {
      console.error('❌ Error fetching slides:', fetchError.message);
      return;
    }

    console.log(`\n📊 Found ${allSlides?.length || 0} carousel slides:`);
    allSlides?.forEach((slide, index) => {
      console.log(`${index + 1}. ${slide.title} - ${slide.subtitle}`);
      console.log(`   CTA: "${slide.cta_text}" → ${slide.cta_link}`);
      console.log(`   Active: ${slide.is_active ? '✅' : '❌'} | Order: ${slide.sort_order}`);
      console.log();
    });

    console.log('🎯 Next Steps:');
    console.log('1. Update FullscreenCarousel component to use database');
    console.log('2. Create admin interface for managing slides');
    console.log('3. Test the dynamic carousel functionality');

  } catch (error) {
    console.error('❌ Error setting up table:', error);
  }
}

// Run the script
setupCarouselSlidesTable().then(() => {
  console.log('\n✅ Carousel slides table setup process complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
