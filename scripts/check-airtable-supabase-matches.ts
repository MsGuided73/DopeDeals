import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE || 'Products';

async function checkProductMatches() {
  console.log('🔍 Checking for product matches between Airtable and Supabase...\n');
  
  try {
    // Get first 20 Airtable records with images
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=20`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const airtableRecords = data.records.filter((record: any) => 
      record.fields.Image_url && record.fields.SKU
    );
    
    console.log(`📊 Found ${airtableRecords.length} Airtable records with images and SKUs\n`);
    
    // Get sample Supabase products
    const { data: supabaseProducts } = await supabase
      .from('products')
      .select('sku, name, image_url')
      .limit(20);
    
    console.log(`📊 Found ${supabaseProducts?.length || 0} Supabase products (sample)\n`);
    
    // Show patterns
    console.log('📋 Airtable SKU patterns:');
    airtableRecords.slice(0, 10).forEach((record: any) => {
      console.log(`   - ${record.fields.SKU} (${record.fields.Name?.substring(0, 50)}...)`);
    });
    
    console.log('\n📋 Supabase SKU patterns:');
    supabaseProducts?.slice(0, 10).forEach(product => {
      console.log(`   - ${product.sku} (${product.name?.substring(0, 50)}...)`);
    });
    
    // Check for matches
    console.log('\n🔍 Checking for exact SKU matches...');
    let exactMatches = 0;
    let partialMatches = 0;
    let noMatches = 0;
    
    for (const airtableRecord of airtableRecords.slice(0, 10)) {
      const airtableSKU = airtableRecord.fields.SKU;
      const airtableName = airtableRecord.fields.Name;
      
      // Try exact match first
      const { data: exactMatch } = await supabase
        .from('products')
        .select('sku, name, image_url')
        .eq('sku', airtableSKU)
        .single();
      
      if (exactMatch) {
        console.log(`   ✅ EXACT: ${airtableSKU} → ${exactMatch.sku}`);
        console.log(`      Has image: ${exactMatch.image_url ? 'Yes' : 'No'}`);
        exactMatches++;
        continue;
      }
      
      // Try partial matches
      const { data: partialMatchesData } = await supabase
        .from('products')
        .select('sku, name, image_url')
        .or(`sku.ilike.%${airtableSKU}%,name.ilike.%${airtableName?.split(' ')[0]}%`)
        .limit(3);
      
      if (partialMatchesData && partialMatchesData.length > 0) {
        console.log(`   🔍 PARTIAL: ${airtableSKU} found ${partialMatchesData.length} matches:`);
        partialMatchesData.forEach(match => {
          console.log(`      - ${match.sku} (${match.name?.substring(0, 40)}...)`);
        });
        partialMatches++;
      } else {
        console.log(`   ❌ NO MATCH: ${airtableSKU} (${airtableName?.substring(0, 40)}...)`);
        noMatches++;
      }
    }
    
    console.log(`\n📊 Match Summary:`);
    console.log(`   Exact matches: ${exactMatches}`);
    console.log(`   Partial matches: ${partialMatches}`);
    console.log(`   No matches: ${noMatches}`);
    
    // Check products without images
    const { data: productsWithoutImages } = await supabase
      .from('products')
      .select('sku, name, image_url')
      .is('image_url', null)
      .limit(10);
    
    console.log(`\n📊 Supabase products without images: ${productsWithoutImages?.length || 0} (sample)`);
    productsWithoutImages?.forEach(product => {
      console.log(`   - ${product.sku} (${product.name?.substring(0, 50)}...)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductMatches().catch(console.error);
