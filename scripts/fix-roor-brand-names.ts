import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRoorBrandNames() {
  console.log('🔧 FIXING ROOR BRAND NAMES');
  console.log('=' .repeat(60));
  
  try {
    // 1. Get all RooR products
    console.log('📥 Fetching RooR products...');
    
    const { data: roorProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, sku, brand_id, brand_name')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (fetchError) {
      throw new Error(`Error fetching RooR products: ${fetchError.message}`);
    }

    console.log(`✅ Found ${roorProducts?.length || 0} RooR products`);

    if (!roorProducts || roorProducts.length === 0) {
      console.log('❌ No RooR products found');
      return;
    }

    // 2. Check current brand name status
    const withBrandName = roorProducts.filter(p => p.brand_name && p.brand_name !== 'Unknown');
    const withoutBrandName = roorProducts.filter(p => !p.brand_name || p.brand_name === 'Unknown');

    console.log(`\n📊 BRAND NAME STATUS:`);
    console.log(`   ✅ Products with brand names: ${withBrandName.length}`);
    console.log(`   ❌ Products without brand names: ${withoutBrandName.length}`);

    if (withoutBrandName.length === 0) {
      console.log('🎉 All RooR products already have proper brand names!');
      return;
    }

    // 3. Show products that need fixing
    console.log(`\n🔧 PRODUCTS NEEDING BRAND NAME FIXES:`);
    withoutBrandName.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Current brand_name: ${product.brand_name || 'NULL'}`);
      console.log(`   Brand ID: ${product.brand_id || 'NULL'}`);
      console.log('');
    });

    // 4. Check if ROOR brand exists in brands table
    console.log('🔍 Checking for ROOR brand in brands table...');
    
    const { data: roorBrand, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .ilike('name', '%ROOR%')
      .limit(1);

    if (brandError) {
      console.error('❌ Error checking brands table:', brandError);
    }

    let roorBrandId = null;
    
    if (roorBrand && roorBrand.length > 0) {
      roorBrandId = roorBrand[0].id;
      console.log(`✅ Found ROOR brand: ${roorBrand[0].name} (ID: ${roorBrandId})`);
    } else {
      console.log('❌ ROOR brand not found in brands table');
      
      // Create ROOR brand
      console.log('🔨 Creating ROOR brand...');
      const { data: newBrand, error: createError } = await supabase
        .from('brands')
        .insert({
          name: 'ROOR',
          description: 'Premium German glass water pipes and accessories'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating ROOR brand:', createError);
        throw createError;
      }

      roorBrandId = newBrand.id;
      console.log(`✅ Created ROOR brand with ID: ${roorBrandId}`);
    }

    // 5. Update products with proper brand information
    console.log(`\n🔄 Updating ${withoutBrandName.length} products with ROOR brand info...`);
    
    let updated = 0;
    let failed = 0;

    for (const product of withoutBrandName) {
      try {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            brand_id: roorBrandId,
            brand_name: 'ROOR',
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Failed to update ${product.name}:`, updateError.message);
          failed++;
        } else {
          console.log(`✅ Updated: ${product.name}`);
          updated++;
        }

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error updating ${product.name}:`, error);
        failed++;
      }
    }

    console.log(`\n📊 UPDATE RESULTS:`);
    console.log(`   ✅ Successfully updated: ${updated}`);
    console.log(`   ❌ Failed to update: ${failed}`);
    console.log(`   📈 Success rate: ${updated > 0 ? ((updated / (updated + failed)) * 100).toFixed(1) : 0}%`);

    // 6. Verify the fixes
    console.log(`\n🔍 VERIFYING FIXES...`);
    
    const { data: verifyProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, brand_name')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (verifyError) {
      console.error('❌ Error verifying fixes:', verifyError);
    } else {
      const nowWithBrandName = verifyProducts?.filter(p => p.brand_name && p.brand_name !== 'Unknown').length || 0;
      const stillWithoutBrandName = verifyProducts?.filter(p => !p.brand_name || p.brand_name === 'Unknown').length || 0;
      
      console.log(`✅ Products with brand names: ${nowWithBrandName}`);
      console.log(`❌ Products still without brand names: ${stillWithoutBrandName}`);
      
      if (stillWithoutBrandName === 0) {
        console.log('🎉 ALL ROOR PRODUCTS NOW HAVE PROPER BRAND NAMES!');
      }
    }

  } catch (error) {
    console.error('❌ Error fixing RooR brand names:', error);
    throw error;
  }
}

// Run the fix
fixRoorBrandNames()
  .then(() => {
    console.log('\n✅ RooR brand name fix complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Brand name fix failed:', error);
    process.exit(1);
  });
