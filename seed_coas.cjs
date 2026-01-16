const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCOAs() {
  console.log('--- Seeding COA data via Supabase Client ---');

  // 1. Get some products
  const { data: products, error: prodError } = await supabase
    .from('main_site_products')
    .select('id, name, sku')
    .limit(3);

  if (prodError) {
    console.error('Error fetching products:', prodError);
    return;
  }

  if (!products || products.length === 0) {
    console.log('No products found to seed COAs for.');
    return;
  }

  for (const product of products) {
    console.log(`Seeding COA for ${product.name}...`);
    
    // Update compliance_info with a lab_certificate_url
    const { error: updateError } = await supabase
      .from('main_site_products')
      .update({
        compliance_info: {
          requires_lab_testing: true,
          lab_certificate_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/COA-Sample.pdf",
          lab_name: "Highway 420 Internal Lab",
          regulatory_category: "hemp"
        }
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Error updating product ${product.id}:`, updateError);
    } else {
      console.log(`Successfully updated compliance_info for ${product.name}`);
    }

    // Also add to lab_certificates table
    const { error: certError } = await supabase
      .from('lab_certificates')
      .upsert({
        product_id: product.id,
        batch_number: product.sku || 'BATCH-001',
        lab_name: "Kaycha Labs",
        tested_at: new Date().toISOString(),
        url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/COA-Sample.pdf",
        is_valid: true
      }, { onConflict: 'product_id, batch_number' });

    if (certError) {
      console.error(`Error inserting lab certificate for ${product.id}:`, certError);
    } else {
      console.log(`Successfully inserted lab certificate for ${product.name}`);
    }
  }
}

seedCOAs();
