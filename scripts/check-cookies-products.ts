import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCookiesProducts() {
  console.log('🍪 Checking Cookies brand products in database...\n');
  
  try {
    // Search for Cookies products by name/brand
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, brand_name, price, description, image_url, is_active')
      .or('name.ilike.%cookies%,brand_name.ilike.%cookies%,description.ilike.%cookies%')
      .order('name');
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Found ${products.length} Cookies products:\n`);
    
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   SKU: ${p.sku}`);
      console.log(`   Brand: ${p.brand_name || 'Not set'}`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Active: ${p.is_active}`);
      console.log(`   Has Image: ${p.image_url ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Check if Cookies brand exists
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', '%cookies%')
      .single();
      
    console.log('🏷️ Cookies Brand Status:');
    if (brand) {
      console.log(`✅ Brand exists: ${brand.name} (ID: ${brand.id})`);
    } else {
      console.log('❌ Cookies brand not found in brands table');
    }
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`- Total Cookies products: ${products.length}`);
    console.log(`- Products with images: ${products.filter(p => p.image_url).length}`);
    console.log(`- Active products: ${products.filter(p => p.is_active).length}`);
    console.log(`- Products with brand_name set: ${products.filter(p => p.brand_name).length}`);
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkCookiesProducts();
