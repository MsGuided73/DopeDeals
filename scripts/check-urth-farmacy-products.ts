import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUrthFarmacyProducts() {
  console.log('🌿 Checking Urth Farmacy products in database...\n');
  
  try {
    // Search for Urth Farmacy products by name/brand
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, brand_name, price, description, image_url, is_active')
      .or('name.ilike.%urth%,brand_name.ilike.%urth%,description.ilike.%urth%,name.ilike.%farmacy%,brand_name.ilike.%farmacy%,description.ilike.%farmacy%')
      .order('name');
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Found ${products.length} Urth Farmacy products:\n`);
    
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   SKU: ${p.sku}`);
      console.log(`   Brand: ${p.brand_name || 'Not set'}`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Active: ${p.is_active}`);
      console.log(`   Has Image: ${p.image_url ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Check if Urth Farmacy brand exists
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .or('name.ilike.%urth%,name.ilike.%farmacy%')
      .single();
      
    console.log('🏷️ Urth Farmacy Brand Status:');
    if (brand) {
      console.log(`✅ Brand exists: ${brand.name} (ID: ${brand.id})`);
    } else {
      console.log('❌ Urth Farmacy brand not found in brands table');
    }
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`- Total Urth Farmacy products: ${products.length}`);
    console.log(`- Products with images: ${products.filter(p => p.image_url).length}`);
    console.log(`- Active products: ${products.filter(p => p.is_active).length}`);
    console.log(`- Products with brand_name set: ${products.filter(p => p.brand_name).length}`);
    
    // Analyze product types
    console.log('\n🔍 Product Type Analysis:');
    const productTypes = {
      flower: products.filter(p => 
        p.name.toLowerCase().includes('flower') || 
        p.name.toLowerCase().includes('thca') ||
        p.name.toLowerCase().includes('bag') ||
        p.name.toLowerCase().includes('jar')
      ),
      prerolls: products.filter(p => 
        p.name.toLowerCase().includes('preroll') || 
        p.name.toLowerCase().includes('pre roll') ||
        p.name.toLowerCase().includes('blunt') ||
        p.name.toLowerCase().includes('joint')
      ),
      disposables: products.filter(p => 
        p.name.toLowerCase().includes('disposable') || 
        p.name.toLowerCase().includes('dispo')
      ),
      cartridges: products.filter(p => 
        p.name.toLowerCase().includes('cartridge') || 
        p.name.toLowerCase().includes('cart')
      ),
      edibles: products.filter(p => 
        p.name.toLowerCase().includes('gummies') || 
        p.name.toLowerCase().includes('chocolate') ||
        p.name.toLowerCase().includes('edible')
      ),
      concentrates: products.filter(p => 
        p.name.toLowerCase().includes('wax') || 
        p.name.toLowerCase().includes('shatter') ||
        p.name.toLowerCase().includes('rosin') ||
        p.name.toLowerCase().includes('badder')
      )
    };
    
    Object.entries(productTypes).forEach(([type, items]) => {
      if (items.length > 0) {
        console.log(`   - ${type.charAt(0).toUpperCase() + type.slice(1)}: ${items.length} products`);
      }
    });
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkUrthFarmacyProducts();
