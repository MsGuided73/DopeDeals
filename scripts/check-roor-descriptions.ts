import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY!;
const airtableBaseId = process.env.AIRTABLE_BASE_ID!;
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro';

const supabase = createClient(supabaseUrl, supabaseKey);

function hasDetailedDescription(description: string | null | undefined): boolean {
  if (!description) return false;
  
  // Remove HTML tags for analysis
  const cleanText = description.replace(/<[^>]*>/g, '').trim();
  
  // Consider it detailed if it has:
  // - More than 50 characters
  // - Contains product specifications or features
  // - Has multiple sentences or bullet points
  return cleanText.length > 50 && (
    cleanText.includes('.') || 
    cleanText.includes('•') || 
    cleanText.includes('-') ||
    cleanText.toLowerCase().includes('feature') ||
    cleanText.toLowerCase().includes('include') ||
    cleanText.toLowerCase().includes('specification') ||
    cleanText.toLowerCase().includes('dimension') ||
    cleanText.toLowerCase().includes('material')
  );
}

async function checkRoorDescriptions() {
  console.log('📝 CHECKING ROOR PRODUCT DESCRIPTIONS');
  console.log('=' .repeat(60));
  
  try {
    // 1. Get all RooR products from Airtable
    console.log('📥 Fetching RooR products from Airtable...');
    
    let allRoorRecords: any[] = [];
    let offset = '';
    
    do {
      const filterFormula = `OR(FIND("Roor",{Brands}),FIND("ROOR",{Brands}),FIND("roor",{Brands}),FIND("Roor",{Name}),FIND("ROOR",{Name}),FIND("roor",{Name}))`;
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`;
      
      const response = await fetch(airtableUrl, {
        headers: {
          'Authorization': `Bearer ${airtablePAT}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      allRoorRecords = allRoorRecords.concat(data.records || []);
      offset = data.offset || '';
      
    } while (offset);

    console.log(`✅ Found ${allRoorRecords.length} RooR products in Airtable`);

    // 2. Get all RooR products from Supabase
    console.log('\n📥 Fetching RooR products from Supabase...');
    
    const { data: supabaseRoor, error } = await supabase
      .from('products')
      .select('id, name, sku, description, short_description, brand_id, brand_name')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`✅ Found ${supabaseRoor?.length || 0} RooR products in Supabase`);

    // 3. Analyze Airtable descriptions
    console.log('\n📊 AIRTABLE DESCRIPTION ANALYSIS');
    console.log('=' .repeat(60));

    let airtableWithDescriptions = 0;
    let airtableWithoutDescriptions = 0;
    let airtableWithShortDescriptions = 0;

    const airtableMissingDescriptions: any[] = [];

    allRoorRecords.forEach((record, index) => {
      const description = record.fields.Description || '';
      const shortDescription = record.fields['Short description'] || '';
      
      const hasDetailed = hasDetailedDescription(description);
      const hasShort = hasDetailedDescription(shortDescription);
      
      if (hasDetailed) {
        airtableWithDescriptions++;
      } else if (hasShort) {
        airtableWithShortDescriptions++;
      } else {
        airtableWithoutDescriptions++;
        airtableMissingDescriptions.push({
          name: record.fields.Name,
          sku: record.fields.SKU,
          description: description.substring(0, 100) + '...',
          shortDescription: shortDescription.substring(0, 100) + '...'
        });
      }
    });

    console.log(`📈 Airtable Description Stats:`);
    console.log(`   ✅ With detailed descriptions: ${airtableWithDescriptions}`);
    console.log(`   📝 With short descriptions only: ${airtableWithShortDescriptions}`);
    console.log(`   ❌ Missing descriptions: ${airtableWithoutDescriptions}`);
    console.log(`   📊 Description coverage: ${((airtableWithDescriptions + airtableWithShortDescriptions) / allRoorRecords.length * 100).toFixed(1)}%`);

    // 4. Analyze Supabase descriptions
    console.log('\n📊 SUPABASE DESCRIPTION ANALYSIS');
    console.log('=' .repeat(60));

    let supabaseWithDescriptions = 0;
    let supabaseWithoutDescriptions = 0;
    let supabaseWithShortDescriptions = 0;

    const supabaseMissingDescriptions: any[] = [];

    supabaseRoor?.forEach((product) => {
      const hasDetailed = hasDetailedDescription(product.description);
      const hasShort = hasDetailedDescription(product.short_description);
      
      if (hasDetailed) {
        supabaseWithDescriptions++;
      } else if (hasShort) {
        supabaseWithShortDescriptions++;
      } else {
        supabaseWithoutDescriptions++;
        supabaseMissingDescriptions.push({
          name: product.name,
          sku: product.sku,
          description: (product.description || '').substring(0, 100) + '...',
          shortDescription: (product.short_description || '').substring(0, 100) + '...'
        });
      }
    });

    console.log(`📈 Supabase Description Stats:`);
    console.log(`   ✅ With detailed descriptions: ${supabaseWithDescriptions}`);
    console.log(`   📝 With short descriptions only: ${supabaseWithShortDescriptions}`);
    console.log(`   ❌ Missing descriptions: ${supabaseWithoutDescriptions}`);
    console.log(`   📊 Description coverage: ${supabaseRoor?.length ? ((supabaseWithDescriptions + supabaseWithShortDescriptions) / supabaseRoor.length * 100).toFixed(1) : 0}%`);

    // 5. Show products missing descriptions
    console.log('\n❌ AIRTABLE PRODUCTS MISSING DESCRIPTIONS:');
    if (airtableMissingDescriptions.length > 0) {
      airtableMissingDescriptions.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   SKU: ${product.sku || 'N/A'}`);
        console.log(`   Description: ${product.description || 'None'}`);
        console.log(`   Short Desc: ${product.shortDescription || 'None'}`);
        console.log('');
      });
      
      if (airtableMissingDescriptions.length > 10) {
        console.log(`   ... and ${airtableMissingDescriptions.length - 10} more`);
      }
    } else {
      console.log('   🎉 All Airtable RooR products have descriptions!');
    }

    console.log('\n❌ SUPABASE PRODUCTS MISSING DESCRIPTIONS:');
    if (supabaseMissingDescriptions.length > 0) {
      supabaseMissingDescriptions.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Description: ${product.description || 'None'}`);
        console.log(`   Short Desc: ${product.shortDescription || 'None'}`);
        console.log('');
      });
    } else {
      console.log('   🎉 All Supabase RooR products have descriptions!');
    }

    // 6. Summary and recommendations
    console.log('\n📋 SUMMARY & RECOMMENDATIONS');
    console.log('=' .repeat(60));
    
    console.log(`📊 Overall Stats:`);
    console.log(`   - Total RooR products in Airtable: ${allRoorRecords.length}`);
    console.log(`   - Total RooR products in Supabase: ${supabaseRoor?.length || 0}`);
    console.log(`   - Airtable missing descriptions: ${airtableWithoutDescriptions} (${(airtableWithoutDescriptions / allRoorRecords.length * 100).toFixed(1)}%)`);
    console.log(`   - Supabase missing descriptions: ${supabaseWithoutDescriptions} (${supabaseRoor?.length ? (supabaseWithoutDescriptions / supabaseRoor.length * 100).toFixed(1) : 0}%)`);

    if (airtableWithoutDescriptions > 0) {
      console.log('\n🔧 AIRTABLE RECOMMENDATIONS:');
      console.log(`   - ${airtableWithoutDescriptions} RooR products need detailed descriptions`);
      console.log('   - Focus on adding product specifications, features, and dimensions');
      console.log('   - Include material information and usage instructions');
    }

    if (supabaseWithoutDescriptions > 0) {
      console.log('\n🔧 SUPABASE RECOMMENDATIONS:');
      console.log(`   - ${supabaseWithoutDescriptions} RooR products need descriptions on website`);
      console.log('   - Sync descriptions from Airtable if available');
      console.log('   - Create SEO-friendly product descriptions for better search ranking');
    }

    const descriptionGap = airtableWithDescriptions - supabaseWithDescriptions;
    if (descriptionGap > 0) {
      console.log('\n🔄 SYNC OPPORTUNITY:');
      console.log(`   - ${descriptionGap} products have descriptions in Airtable but not in Supabase`);
      console.log('   - Run description sync to improve website content');
    }

    return {
      airtable: {
        total: allRoorRecords.length,
        withDescriptions: airtableWithDescriptions,
        withShortDescriptions: airtableWithShortDescriptions,
        missingDescriptions: airtableWithoutDescriptions,
        missingList: airtableMissingDescriptions
      },
      supabase: {
        total: supabaseRoor?.length || 0,
        withDescriptions: supabaseWithDescriptions,
        withShortDescriptions: supabaseWithShortDescriptions,
        missingDescriptions: supabaseWithoutDescriptions,
        missingList: supabaseMissingDescriptions
      }
    };

  } catch (error) {
    console.error('❌ Error checking RooR descriptions:', error);
    throw error;
  }
}

// Run the analysis
checkRoorDescriptions().then(() => {
  console.log('\n✅ RooR description analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Description analysis failed:', error);
  process.exit(1);
});
