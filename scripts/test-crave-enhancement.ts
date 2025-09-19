import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function testEnhancement() {
  console.log('🧪 Testing Crave product enhancement...\n');
  
  // Get just 3 clean Crave products for testing
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, description, short_description, image_url, price')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .limit(3);
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Testing with ${products?.length || 0} products\n`);
  
  for (const product of products || []) {
    console.log(`🔧 Testing: ${product.name}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Current description: ${product.description ? 'Has description' : 'No description'}`);
    console.log(`   Current short desc: ${product.short_description ? 'Has short desc' : 'No short desc'}`);
    console.log(`   Image: ${product.image_url ? 'Has image' : 'No image'}`);
    console.log('');
  }
}

testEnhancement();
