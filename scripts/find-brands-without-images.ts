import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function findBrandsWithoutImages() {
  console.log('🔍 Finding brands with products missing images...\n');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('brand_name, name, sku, image_url')
      .is('image_url', null)
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(100);
      
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    const brandCounts: Record<string, any[]> = {};
    products?.forEach(product => {
      const brand = product.brand_name || 'Unknown';
      if (!brandCounts[brand]) brandCounts[brand] = [];
      brandCounts[brand].push(product);
    });
    
    console.log('📊 Brands with products missing images:');
    const sortedBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1].length - a[1].length);
      
    sortedBrands.forEach(([brand, products]) => {
      console.log(`   ${brand}: ${products.length} products without images`);
      if (products.length <= 5) {
        products.forEach((p: any) => console.log(`      - ${p.name} (${p.sku})`));
      }
    });
    
    console.log(`\n📋 Top brands to focus on:`);
    sortedBrands.slice(0, 5).forEach(([brand, products]) => {
      console.log(`   🎯 ${brand}: ${products.length} products`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

findBrandsWithoutImages().catch(console.error);
