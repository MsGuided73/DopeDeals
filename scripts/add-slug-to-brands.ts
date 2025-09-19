import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function addSlugToBrands() {
  console.log('🔧 Adding slug field to brands...\n');

  try {
    // First, check if slug column exists
    const { data: brands, error: fetchError } = await supabase
      .from('brands')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching brands:', fetchError);
      return;
    }

    console.log('📊 Current brands:');
    brands?.forEach(b => {
      const slug = createSlug(b.name);
      console.log(`- ${b.name} → slug: "${slug}"`);
    });

    // Check if we can add slug field (this might fail if column doesn't exist)
    console.log('\n🔄 Attempting to add slugs to existing brands...');
    
    for (const brand of brands || []) {
      const slug = createSlug(brand.name);
      
      try {
        const { error: updateError } = await supabase
          .from('brands')
          .update({ slug })
          .eq('id', brand.id);

        if (updateError) {
          console.log(`❌ Failed to update ${brand.name}: ${updateError.message}`);
          
          // If slug column doesn't exist, we need to add it via SQL
          if (updateError.code === '42703') {
            console.log('\n⚠️  Slug column does not exist. You need to add it via SQL:');
            console.log('ALTER TABLE brands ADD COLUMN slug TEXT;');
            console.log('CREATE UNIQUE INDEX brands_slug_idx ON brands(slug);');
            return;
          }
        } else {
          console.log(`✅ Updated ${brand.name} with slug: "${slug}"`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${brand.name}:`, error);
      }
    }

    console.log('\n🎯 Slug update complete!');

  } catch (error) {
    console.error('❌ Process failed:', error);
  }
}

addSlugToBrands();
