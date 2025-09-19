#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSlugToRoorBrand() {
  console.log('🎯 Adding slug field to ROOR brand...');
  
  try {
    // First, let's see if the brands table has a slug column by trying to update
    const { data: updatedBrand, error } = await supabase
      .from('brands')
      .update({ slug: 'roor' })
      .eq('name', 'ROOR')
      .select()
      .single();
      
    if (error) {
      if (error.message.includes('slug')) {
        console.log('❌ Brands table does not have a slug column');
        console.log('💡 The brand page will need to be modified to work without slugs');
        return null;
      } else {
        console.error('❌ Error updating brand:', error);
        return null;
      }
    }
    
    console.log('✅ Successfully added slug to ROOR brand:', updatedBrand);
    return updatedBrand;
    
  } catch (error) {
    console.error('❌ Script error:', error);
    return null;
  }
}

// Run the script
addSlugToRoorBrand().then((result) => {
  if (result) {
    console.log('🎉 ROOR brand now has slug: roor');
    console.log('🌐 You can visit: http://localhost:3001/brands/roor');
  } else {
    console.log('💡 Consider modifying the brand page to work with brand IDs instead of slugs');
  }
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
