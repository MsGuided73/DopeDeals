import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addPuffcoSlug() {
  console.log('🔥 Adding slug to Puffco brand...\n');

  try {
    // 1. Check current Puffco brand
    const { data: puffcoBrand, error: fetchError } = await supabase
      .from('brands')
      .select('*')
      .eq('name', 'Puffco')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching Puffco brand:', fetchError);
      return;
    }

    if (!puffcoBrand) {
      console.log('❌ Puffco brand not found');
      return;
    }

    console.log('📊 Current Puffco brand:', JSON.stringify(puffcoBrand, null, 2));

    // 2. Update with slug if it doesn't exist
    if (!puffcoBrand.slug) {
      console.log('\n🔗 Adding slug to Puffco brand...');
      
      const { data: updatedBrand, error: updateError } = await supabase
        .from('brands')
        .update({ slug: 'puffco' })
        .eq('id', puffcoBrand.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating Puffco brand:', updateError);
        return;
      }

      console.log('✅ Successfully added slug to Puffco brand:', updatedBrand);
    } else {
      console.log(`✅ Puffco brand already has slug: ${puffcoBrand.slug}`);
    }

    console.log('\n🎉 PUFFCO SLUG SETUP COMPLETE!');
    console.log('✅ Brand page will be available at: /brands/puffco');

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
  console.log('- Add slug "puffco" to the Puffco brand record');
  console.log('- Enable the /brands/puffco page to work');
  console.log('\nRun: npx tsx scripts/add-puffco-slug.ts --apply');
} else {
  addPuffcoSlug();
}
