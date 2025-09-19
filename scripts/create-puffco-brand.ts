import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createPuffcoBrand() {
  console.log('🔥 Creating Puffco Brand & Linking Products...\n');

  try {
    // 1. Create Puffco brand record
    console.log('📝 Creating Puffco brand record...');
    
    const puffcoBrandData = {
      id: randomUUID(),
      name: 'Puffco',
      description: 'Premium electronic dabbing devices and accessories. Puffco revolutionized concentrate consumption with innovative technology, precision engineering, and unmatched performance. From the legendary Peak Pro to the portable Proxy, Puffco delivers the ultimate dabbing experience.',
      logo_url: null
    };

    const { data: newBrand, error: brandError } = await supabase
      .from('brands')
      .insert(puffcoBrandData)
      .select()
      .single();

    if (brandError) {
      console.error('❌ Error creating Puffco brand:', brandError);
      return;
    }

    console.log(`✅ Created Puffco brand with ID: ${newBrand.id}`);

    // 2. Get all Puffco products
    console.log('\n📦 Fetching Puffco products...');
    
    const { data: puffcoProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, brand_name')
      .or('brand_name.ilike.%puffco%,name.ilike.%puffco%');

    if (productsError) {
      console.error('❌ Error fetching Puffco products:', productsError);
      return;
    }

    console.log(`📊 Found ${puffcoProducts?.length || 0} Puffco products to link`);

    // 3. Update all Puffco products to link to the new brand
    if (puffcoProducts && puffcoProducts.length > 0) {
      console.log('\n🔗 Linking products to Puffco brand...');
      
      const productIds = puffcoProducts.map(p => p.id);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          brand_id: newBrand.id,
          brand_name: 'Puffco' // Ensure consistent naming
        })
        .in('id', productIds);

      if (updateError) {
        console.error('❌ Error linking products to brand:', updateError);
        return;
      }

      console.log(`✅ Successfully linked ${puffcoProducts.length} products to Puffco brand`);
      
      // List updated products
      puffcoProducts.forEach((product, i) => {
        console.log(`${i + 1}. ${product.name}`);
      });
    }

    console.log('\n🎯 PUFFCO BRAND SETUP COMPLETE!');
    console.log(`✅ Brand ID: ${newBrand.id}`);
    console.log(`✅ Products linked: ${puffcoProducts?.length || 0}`);
    console.log(`✅ Brand page will be available at: /brands/puffco`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
const args = process.argv.slice(2);
const shouldApply = args.includes('--apply');

if (!shouldApply) {
  console.log('🔍 DRY RUN MODE - Add --apply flag to execute changes');
  console.log('This would:');
  console.log('- Create a Puffco brand record in the brands table');
  console.log('- Link all existing Puffco products to this brand');
  console.log('- Enable the /brands/puffco page to work properly');
  console.log('\nRun: npx tsx scripts/create-puffco-brand.ts --apply');
} else {
  createPuffcoBrand();
}
