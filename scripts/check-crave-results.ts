import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkCraveResults() {
  console.log('🎯 CRAVE PRODUCTS DESCRIPTION RESULTS\n');
  
  try {
    // Get Crave products with descriptions
    const { data: craveWithDesc, error } = await supabase
      .from('products')
      .select('id, name, short_description, description, price')
      .eq('brand_name', 'Crave')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .not('short_description', 'is', null)
      .neq('short_description', '')
      .limit(5);
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`✅ Found ${craveWithDesc?.length || 0} Crave products with descriptions`);
    
    if (craveWithDesc && craveWithDesc.length > 0) {
      console.log('\n🔥 SAMPLE DOPE CITY DESCRIPTIONS:\n');
      craveWithDesc.forEach((product, i) => {
        console.log(`${i + 1}. ${product.name}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Short: ${product.short_description?.slice(0, 100)}...`);
        console.log(`   Detailed: ${product.description?.slice(0, 150)}...`);
        console.log('');
      });
    }
    
    // Get total counts
    const { count: totalCrave } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_name', 'Crave')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);
      
    const { count: craveWithDescCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_name', 'Crave')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .not('short_description', 'is', null)
      .neq('short_description', '');
      
    console.log('📊 CRAVE PROGRESS:');
    console.log(`   Total Crave Products: ${totalCrave}`);
    console.log(`   With Descriptions: ${craveWithDescCount}`);
    console.log(`   Completion Rate: ${totalCrave ? ((craveWithDescCount || 0) / totalCrave * 100).toFixed(1) : 0}%`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCraveResults().catch(console.error);
