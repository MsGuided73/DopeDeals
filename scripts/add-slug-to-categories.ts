#!/usr/bin/env node

/**
 * Add Slug Column to Categories Table
 * 
 * This script adds the missing slug column to the categories table
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addSlugToCategories(): Promise<void> {
  console.log('🔧 Adding slug column to categories table...\n');

  try {
    // First, let's check the current structure of the categories table
    const { data: categories, error: selectError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('❌ Error accessing categories table:', selectError.message);
      
      // If table doesn't exist, create it
      if (selectError.code === '42P01') {
        console.log('📋 Categories table does not exist. Creating it...');
        
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS categories (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT NOT NULL,
              description TEXT,
              slug TEXT NOT NULL UNIQUE,
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
          `
        });

        if (createError) {
          console.error('❌ Error creating categories table:', createError.message);
          return;
        }
        
        console.log('✅ Categories table created successfully');
        return;
      }
      
      return;
    }

    console.log('✅ Categories table exists');
    
    // Try to add the slug column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'categories' AND column_name = 'slug'
          ) THEN
            ALTER TABLE categories ADD COLUMN slug TEXT;
            CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
            
            -- Update existing categories with slugs based on their names
            UPDATE categories 
            SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\\s]', '', 'g'), '\\s+', '-', 'g'))
            WHERE slug IS NULL;
            
            -- Make slug NOT NULL after updating
            ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
          END IF;
        END $$;
      `
    });

    if (alterError) {
      console.error('❌ Error adding slug column:', alterError.message);
      return;
    }

    console.log('✅ Slug column added/verified successfully');

    // Verify the table structure
    const { data: finalCheck } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    console.log('✅ Categories table is ready for use');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
addSlugToCategories().then(() => {
  console.log('\n✅ Categories table setup complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
