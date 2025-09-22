import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importUrthFarmacyBrand() {
  console.log('🌿 Starting Urth Farmacy Brand Import Process...\n');
  
  try {
    // Step 1: Create Urth Farmacy brand if it doesn't exist
    console.log('📝 Step 1: Creating Urth Farmacy brand...');
    
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('*')
      .or('name.ilike.%urth%,name.ilike.%farmacy%')
      .single();
      
    let urthFarmacyBrand;
    
    if (existingBrand) {
      console.log(`✅ Urth Farmacy brand already exists: ${existingBrand.name} (ID: ${existingBrand.id})`);
      urthFarmacyBrand = existingBrand;
    } else {
      const urthFarmacyId = randomUUID();
      const { data: newBrand, error: brandError } = await supabase
        .from('brands')
        .insert({
          id: urthFarmacyId,
          name: 'Urth Farmacy',
          slug: 'urth-farmacy',
          description: 'Premium cannabis brand specializing in high-quality THCA products, live resin cartridges, and innovative disposables. Urth Farmacy combines pharmaceutical-grade extraction methods with exotic genetics to deliver exceptional cannabis experiences.'
        })
        .select()
        .single();
        
      if (brandError) {
        console.error('❌ Error creating Urth Farmacy brand:', brandError);
        return;
      }
      
      console.log(`✅ Created Urth Farmacy brand: ${newBrand.name} (ID: ${newBrand.id})`);
      urthFarmacyBrand = newBrand;
    }
    
    // Step 2: Get all Urth Farmacy products
    console.log('\n📊 Step 2: Finding Urth Farmacy products...');
    
    const { data: urthFarmacyProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, sku, brand_name, price, description, image_url, is_active')
      .or('name.ilike.%urth%,brand_name.ilike.%urth%,description.ilike.%urth%,name.ilike.%farmacy%,brand_name.ilike.%farmacy%,description.ilike.%farmacy%')
      .order('name');
      
    if (productsError) {
      console.error('❌ Error fetching Urth Farmacy products:', productsError);
      return;
    }
    
    console.log(`📦 Found ${urthFarmacyProducts.length} Urth Farmacy products`);
    
    // Step 3: Update products to link to Urth Farmacy brand
    console.log('\n🔗 Step 3: Linking products to Urth Farmacy brand...');
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of urthFarmacyProducts) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          brand_id: urthFarmacyBrand.id,
          brand_name: 'Urth Farmacy'
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`❌ Error updating product ${product.sku}:`, updateError.message);
        errorCount++;
      } else {
        updatedCount++;
        if (updatedCount % 5 === 0) {
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
      cartridges: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('cart') || 
        p.name.toLowerCase().includes('cartridge')
      ),
      disposables: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('dispo') || 
        p.name.toLowerCase().includes('disposable')
      ),
      prerolls: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('preroll') || 
        p.name.toLowerCase().includes('pre roll')
      ),
      liveResin: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('live resin') ||
        p.name.toLowerCase().includes('livrsn')
      ),
      liquidDiamond: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('liquid diamond') ||
        p.name.toLowerCase().includes('liq diamd')
      ),
      pharmaBlend: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('pharma blend') ||
        p.name.toLowerCase().includes('phrmblnd')
      ),
      exoticBlend: urthFarmacyProducts.filter(p => 
        p.name.toLowerCase().includes('exotic blend') ||
        p.name.toLowerCase().includes('exo blnd')
      )
    };
    
    console.log('\n📊 Product breakdown by category:');
    Object.entries(categories).forEach(([category, products]) => {
      if (products.length > 0) {
        console.log(`   - ${category.charAt(0).toUpperCase() + category.slice(1)}: ${products.length} products`);
      }
    });
    
    // Step 5: Create Urth Farmacy brand page directory
    console.log('\n📄 Step 5: Creating brand page structure...');
    
    const brandPagePath = 'app/brands/urth-farmacy';
    console.log(`   📁 Brand page should be created at: ${brandPagePath}/`);
    console.log(`   📝 Files needed:`);
    console.log(`      - page.tsx (main brand page)`);
    console.log(`      - UrthFarmacyBrandPageContent.tsx (client component)`);
    
    // Step 6: Summary and next steps
    console.log('\n🎉 Import Summary:');
    console.log(`✅ Urth Farmacy brand: ${urthFarmacyBrand.name} (ID: ${urthFarmacyBrand.id})`);
    console.log(`✅ Products linked: ${updatedCount}/${urthFarmacyProducts.length}`);
    console.log(`✅ Products with images: ${urthFarmacyProducts.filter(p => p.image_url).length}`);
    console.log(`✅ Active products: ${urthFarmacyProducts.filter(p => p.is_active).length}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Create Urth Farmacy brand page at /brands/urth-farmacy');
    console.log('2. Add Urth Farmacy to product categorization system');
    console.log('3. Source and upload missing product images');
    console.log('4. Enhance product descriptions with strain details');
    console.log('5. Set up proper product categories for THCA/CBD products');
    
    return {
      brand: urthFarmacyBrand,
      productsUpdated: updatedCount,
      totalProducts: urthFarmacyProducts.length,
      categories
    };
    
  } catch (error) {
    console.error('❌ Import error:', error);
    throw error;
  }
}

// Run the import
importUrthFarmacyBrand()
  .then((result) => {
    console.log('\n🚀 Urth Farmacy brand import completed successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
