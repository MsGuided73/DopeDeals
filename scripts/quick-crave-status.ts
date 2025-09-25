import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function quickCraveStatus() {
  try {
    const { count: totalCrave } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_name', 'Crave')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);
      
    const { count: craveWithDesc } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('brand_name', 'Crave')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .not('short_description', 'is', null)
      .neq('short_description', '');
      
    console.log('🔥 CRAVE DESCRIPTION PROGRESS:');
    console.log(`Total: ${totalCrave} | With Descriptions: ${craveWithDesc} | Rate: ${totalCrave ? ((craveWithDesc || 0) / totalCrave * 100).toFixed(1) : 0}%`);
  } catch (error) {
    console.error('Error:', error);
  }
}

quickCraveStatus();
