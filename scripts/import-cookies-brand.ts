import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importCookiesBrand() {
  console.log('🍪 Starting Cookies Brand Import Process...\n');
  
  try {
    // Step 1: Create Cookies brand if it doesn't exist
    console.log('📝 Step 1: Creating Cookies brand...');
    
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', '%cookies%')
      .single();
      
    let cookiesBrand;
    
    if (existingBrand) {
      console.log(`✅ Cookies brand already exists: ${existingBrand.name} (ID: ${existingBrand.id})`);
      cookiesBrand = existingBrand;
    } else {
      const cookiesId = randomUUID();
      const { data: newBrand, error: brandError } = await supabase
        .from('brands')
        .insert({
          id: cookiesId,
          name: 'Cookies',
          slug: 'cookies',
          description: 'Premium cannabis brand founded by Berner, known for high-quality flower, pre-rolls, and accessories. Cookies has become synonymous with top-tier cannabis genetics and lifestyle products.'
        })
        .select()
        .single();
        
      if (brandError) {
        console.error('❌ Error creating Cookies brand:', brandError);
        return;
      }
      
      console.log(`✅ Created Cookies brand: ${newBrand.name} (ID: ${newBrand.id})`);
      cookiesBrand = newBrand;
    }
    
    // Step 2: Get all Cookies products
    console.log('\n📊 Step 2: Finding Cookies products...');
    
    const { data: cookiesProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, sku, brand_name, price, description, image_url, is_active')
      .or('name.ilike.%cookies%,brand_name.ilike.%cookies%,description.ilike.%cookies%')
      .order('name');
      
    if (productsError) {
      console.error('❌ Error fetching Cookies products:', productsError);
      return;
    }
    
    console.log(`📦 Found ${cookiesProducts.length} Cookies products`);
    
    // Step 3: Update products to link to Cookies brand
    console.log('\n🔗 Step 3: Linking products to Cookies brand...');
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of cookiesProducts) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          brand_id: cookiesBrand.id,
          brand_name: 'Cookies'
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`❌ Error updating product ${product.sku}:`, updateError.message);
        errorCount++;
      } else {
        updatedCount++;
        if (updatedCount % 10 === 0) {
          console.log(`   ✅ Updated ${updatedCount} products...`);
        }
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed to update ${errorCount} products`);
    }
    
    // Step 4: Categorize products by type
    console.log('\n📂 Step 4: Analyzing product categories...');
    
    const categories = {
      flower: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('flower') || 
        p.name.toLowerCase().includes('thca') ||
        p.name.toLowerCase().includes('bag') ||
        p.name.toLowerCase().includes('jar')
      ),
      prerolls: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('preroll') || 
        p.name.toLowerCase().includes('pre roll') ||
        p.name.toLowerCase().includes('blunt') ||
        p.name.toLowerCase().includes('joint')
      ),
      disposables: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('disposable') || 
        p.name.toLowerCase().includes('dispo')
      ),
      batteries: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('battery') || 
        p.name.toLowerCase().includes('batt')
      ),
      accessories: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('tray') || 
        p.name.toLowerCase().includes('backpack') ||
        p.name.toLowerCase().includes('display') ||
        p.name.toLowerCase().includes('holder')
      ),
      edibles: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('gummies') || 
        p.name.toLowerCase().includes('chocolate')
      ),
      eliquid: cookiesProducts.filter(p => 
        p.name.toLowerCase().includes('e-liquid') || 
        p.name.toLowerCase().includes('eliq')
      )
    };
    
    console.log('\n📊 Product breakdown by category:');
    Object.entries(categories).forEach(([category, products]) => {
      if (products.length > 0) {
        console.log(`   - ${category.charAt(0).toUpperCase() + category.slice(1)}: ${products.length} products`);
      }
    });
    
    // Step 5: Create Cookies brand page directory
    console.log('\n📄 Step 5: Creating brand page structure...');
    
    const brandPagePath = 'app/brands/cookies';
    console.log(`   📁 Brand page should be created at: ${brandPagePath}/`);
    console.log(`   📝 Files needed:`);
    console.log(`      - page.tsx (main brand page)`);
    console.log(`      - CookiesBrandPageContent.tsx (client component)`);
    
    // Step 6: Summary and next steps
    console.log('\n🎉 Import Summary:');
    console.log(`✅ Cookies brand: ${cookiesBrand.name} (ID: ${cookiesBrand.id})`);
    console.log(`✅ Products linked: ${updatedCount}/${cookiesProducts.length}`);
    console.log(`✅ Products with images: ${cookiesProducts.filter(p => p.image_url).length}`);
    console.log(`✅ Active products: ${cookiesProducts.filter(p => p.is_active).length}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Create Cookies brand page at /brands/cookies');
    console.log('2. Add Cookies to product categorization system');
    console.log('3. Source and upload missing product images');
    console.log('4. Enhance product descriptions');
    console.log('5. Set up proper product categories');
    
    return {
      brand: cookiesBrand,
      productsUpdated: updatedCount,
      totalProducts: cookiesProducts.length,
      categories
    };
    
  } catch (error) {
    console.error('❌ Import error:', error);
    throw error;
  }
}

// Run the import
importCookiesBrand()
  .then((result) => {
    console.log('\n🚀 Cookies brand import completed successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
