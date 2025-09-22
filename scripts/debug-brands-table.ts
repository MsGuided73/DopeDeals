import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugBrandsTable() {
  console.log('🔍 Debugging brands table...\n');
  
  try {
    // First, let's see the table structure by querying information_schema
    console.log('📊 Checking table structure...');
    
    const { data: columns, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'brands' })
      .single();
      
    if (schemaError) {
      console.log('Schema query failed, trying direct approach...');
      
      // Try creating with explicit UUID
      const { randomUUID } = await import('crypto');
      const testId = randomUUID();
      
      console.log('🧪 Testing brand creation with explicit UUID...');
      
      const { data: testBrand, error: testError } = await supabase
        .from('brands')
        .insert({
          id: testId,
          name: 'Test Cookies',
          slug: 'test-cookies-' + Date.now(),
          description: 'Test brand'
        })
        .select()
        .single();
        
      if (testError) {
        console.error('❌ Test with explicit UUID failed:', testError);
      } else {
        console.log('✅ Test with explicit UUID succeeded:', testBrand);
        
        // Clean up
        await supabase.from('brands').delete().eq('id', testId);
        console.log('🧹 Test brand cleaned up');
      }
    }
    
    // Let's also check if there are any triggers or constraints
    console.log('\n🔍 Checking existing brands for pattern...');
    const { data: existingBrands } = await supabase
      .from('brands')
      .select('id, name, slug, created_at')
      .limit(5);
      
    if (existingBrands) {
      existingBrands.forEach(brand => {
        console.log(`Brand: ${brand.name}`);
        console.log(`  ID: ${brand.id}`);
        console.log(`  Slug: ${brand.slug}`);
        console.log(`  Created: ${brand.created_at}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugBrandsTable();
