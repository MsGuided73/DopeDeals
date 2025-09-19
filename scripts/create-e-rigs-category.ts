import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createERigsCategory() {
  console.log('🔥 Creating E-Rigs Category...\n');

  try {
    // 1. Check if E-Rigs category already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('*')
      .eq('name', 'E-Rigs')
      .single();

    if (existingCategory) {
      console.log('✅ E-Rigs category already exists:', existingCategory);
      return;
    }

    // 2. Create E-Rigs category
    console.log('📝 Creating E-Rigs category...');
    
    const eRigsCategoryData = {
      name: 'E-Rigs',
      description: 'Electronic dab rigs and concentrate vaporizers. Experience precision temperature control, consistent hits, and the future of concentrate consumption. From desktop powerhouses like the Puffco Peak Pro to portable perfection with the Proxy.'
    };

    const { data: newCategory, error: categoryError } = await supabase
      .from('categories')
      .insert(eRigsCategoryData)
      .select()
      .single();

    if (categoryError) {
      console.error('❌ Error creating E-Rigs category:', categoryError);
      return;
    }

    console.log(`✅ Created E-Rigs category with ID: ${newCategory.id}`);

    // 3. Find products that should be in E-Rigs category
    console.log('\n🔍 Finding E-Rig products to categorize...');
    
    const { data: eRigProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, brand_name, category_id')
      .or('name.ilike.%peak%,name.ilike.%proxy%,name.ilike.%e-rig%,name.ilike.%electronic%')
      .eq('is_active', true);

    if (productsError) {
      console.error('❌ Error fetching potential E-Rig products:', productsError);
      return;
    }

    console.log(`📦 Found ${eRigProducts?.length || 0} potential E-Rig products:`);
    
    // Filter for actual e-rigs (mainly Puffco products for now)
    const actualERigs = eRigProducts?.filter(product => {
      const name = product.name.toUpperCase();
      return (
        name.includes('PEAK') || 
        name.includes('PROXY') ||
        (name.includes('PUFFCO') && !name.includes('CHAMBER') && !name.includes('TRAVEL'))
      );
    }) || [];

    console.log(`🎯 Identified ${actualERigs.length} actual E-Rig products:`);
    actualERigs.forEach((product, i) => {
      console.log(`${i + 1}. ${product.name} (${product.brand_name})`);
    });

    // 4. Update products to be in E-Rigs category
    if (actualERigs.length > 0) {
      console.log('\n🔗 Assigning products to E-Rigs category...');
      
      const productIds = actualERigs.map(p => p.id);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_id: newCategory.id })
        .in('id', productIds);

      if (updateError) {
        console.error('❌ Error updating products:', updateError);
        return;
      }

      console.log(`✅ Successfully assigned ${actualERigs.length} products to E-Rigs category`);
    }

    console.log('\n🎉 E-RIGS CATEGORY SETUP COMPLETE!');
    console.log(`✅ Category ID: ${newCategory.id}`);
    console.log(`✅ Category Slug: ${newCategory.slug}`);
    console.log(`✅ Products assigned: ${actualERigs.length}`);
    console.log(`✅ Category page will be available at: /category/e-rigs`);
    console.log(`✅ Navigation updated in GlobalMasthead and homepage`);

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
  console.log('- Create an E-Rigs category in the categories table');
  console.log('- Assign Puffco Peak and Proxy products to this category');
  console.log('- Enable the /category/e-rigs page to work');
  console.log('- Make E-Rigs appear in the main navigation');
  console.log('\nRun: npx tsx scripts/create-e-rigs-category.ts --apply');
} else {
  createERigsCategory();
}
