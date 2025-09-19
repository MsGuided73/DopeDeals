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

async function findRoorMatches() {
  console.log('🔍 FINDING ROOR PRODUCT MATCHES');
  console.log('=' .repeat(60));
  
  try {
    // 1. Get all RooR products from Airtable
    console.log('📥 Fetching RooR products from Airtable...');
    
    let allRoorRecords: any[] = [];
    let offset = '';
    
    do {
      // Search for RooR in both Brands field and Name field
      const filterFormula = `OR(FIND("Roor",{Brands}),FIND("ROOR",{Brands}),FIND("roor",{Brands}),FIND("Roor",{Name}),FIND("ROOR",{Name}),FIND("roor",{Name}))`;
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`;
      
      const response = await fetch(airtableUrl, {
        headers: {
          'Authorization': `Bearer ${airtablePAT}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      allRoorRecords = allRoorRecords.concat(data.records || []);
      offset = data.offset || '';
      
      console.log(`   Fetched ${data.records?.length || 0} RooR records, total: ${allRoorRecords.length}`);
    } while (offset);

    console.log(`✅ Found ${allRoorRecords.length} RooR products in Airtable`);

    // 2. Get all RooR products from Supabase
    console.log('\n📥 Fetching RooR products from Supabase...');
    
    const { data: supabaseRoor, error } = await supabase
      .from('products')
      .select('id, name, sku, brand_id, brand_name, image_url, image_urls')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`✅ Found ${supabaseRoor?.length || 0} RooR products in Supabase`);

    // 3. Show detailed comparison
    console.log('\n📊 DETAILED ROOR PRODUCT ANALYSIS');
    console.log('=' .repeat(60));

    console.log('\n🏪 AIRTABLE ROOR PRODUCTS:');
    allRoorRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.fields.Name}`);
      console.log(`   SKU: ${record.fields.SKU || 'N/A'}`);
      console.log(`   Brand: ${record.fields.Brands || 'N/A'}`);
      console.log(`   Has Image: ${record.fields.Images ? 'Yes' : 'No'}`);
      if (record.fields.Images) {
        console.log(`   Image: ${record.fields.Images.substring(0, 80)}...`);
      }
      console.log('');
    });

    console.log('\n💾 SUPABASE ROOR PRODUCTS:');
    supabaseRoor?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Brand ID: ${product.brand_id || 'N/A'}`);
      console.log(`   Brand Name: ${product.brand_name || 'N/A'}`);
      console.log(`   Has Images: ${product.image_url || product.image_urls ? 'Yes' : 'No'}`);
      console.log('');
    });

    // 4. Try to find matches
    console.log('\n🔗 ATTEMPTING TO MATCH PRODUCTS');
    console.log('=' .repeat(60));

    const matches = [];
    const productsNeedingImages = supabaseRoor?.filter(p => !p.image_url && (!p.image_urls || p.image_urls.length === 0)) || [];
    
    console.log(`Products needing images: ${productsNeedingImages.length}`);

    for (const supabaseProduct of productsNeedingImages) {
      console.log(`\n🔍 Looking for match for: "${supabaseProduct.name}"`);
      
      let bestMatch = null;
      let bestScore = 0;
      
      for (const airtableRecord of allRoorRecords) {
        if (!airtableRecord.fields.Images) continue;
        
        const airtableName = airtableRecord.fields.Name || '';
        const supabaseName = supabaseProduct.name;
        
        // Simple keyword matching
        const airtableWords = airtableName.toUpperCase().split(/\s+/);
        const supabaseWords = supabaseName.toUpperCase().split(/\s+/);
        
        const commonWords = airtableWords.filter(word => 
          supabaseWords.some(sWord => sWord.includes(word) || word.includes(sWord))
        );
        
        const score = commonWords.length / Math.max(airtableWords.length, supabaseWords.length);
        
        if (score > bestScore && score > 0.2) {
          bestScore = score;
          bestMatch = {
            airtableRecord,
            supabaseProduct,
            score,
            commonWords
          };
        }
      }
      
      if (bestMatch) {
        console.log(`   ✅ MATCH FOUND (${(bestScore * 100).toFixed(1)}%)`);
        console.log(`   Airtable: ${bestMatch.airtableRecord.fields.Name}`);
        console.log(`   Supabase: ${bestMatch.supabaseProduct.name}`);
        console.log(`   Common words: ${bestMatch.commonWords.join(', ')}`);
        console.log(`   Image: ${bestMatch.airtableRecord.fields.Images}`);
        matches.push(bestMatch);
      } else {
        console.log(`   ❌ No match found`);
      }
    }

    console.log(`\n📊 MATCHING SUMMARY:`);
    console.log(`   - RooR products in Airtable: ${allRoorRecords.length}`);
    console.log(`   - RooR products in Supabase: ${supabaseRoor?.length || 0}`);
    console.log(`   - Supabase products needing images: ${productsNeedingImages.length}`);
    console.log(`   - Successful matches: ${matches.length}`);
    console.log(`   - Match rate: ${productsNeedingImages.length > 0 ? ((matches.length / productsNeedingImages.length) * 100).toFixed(1) : 0}%`);

    // 5. Apply matches if requested
    const args = process.argv.slice(2);
    if (args.includes('--apply') && matches.length > 0) {
      console.log('\n🔄 APPLYING IMAGE UPDATES...');
      
      let updated = 0;
      let failed = 0;
      
      for (const match of matches) {
        try {
          const { error } = await supabase
            .from('products')
            .update({
              image_url: match.airtableRecord.fields.Images,
              image_urls: [match.airtableRecord.fields.Images],
              updated_at: new Date().toISOString()
            })
            .eq('id', match.supabaseProduct.id);
          
          if (error) {
            console.error(`❌ Failed to update ${match.supabaseProduct.name}:`, error.message);
            failed++;
          } else {
            console.log(`✅ Updated: ${match.supabaseProduct.name}`);
            updated++;
          }
        } catch (error) {
          console.error(`❌ Error updating ${match.supabaseProduct.name}:`, error);
          failed++;
        }
      }
      
      console.log(`\n📊 Update Results: ${updated} updated, ${failed} failed`);
    } else if (matches.length > 0) {
      console.log('\n💡 To apply these matches, run with --apply flag');
    }

    return { allRoorRecords, supabaseRoor, matches };

  } catch (error) {
    console.error('❌ Error finding RooR matches:', error);
    throw error;
  }
}

// Run the analysis
findRoorMatches().then(() => {
  console.log('\n✅ RooR matching analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ RooR matching failed:', error);
  process.exit(1);
});
