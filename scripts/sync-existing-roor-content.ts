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

interface ContentMatch {
  supabaseProduct: any;
  airtableRecord: any;
  matchType: string;
  confidence: number;
  needsImages: boolean;
  needsDescription: boolean;
  needsShortDescription: boolean;
}

// Enhanced matching function for existing products
function findContentMatches(supabaseProducts: any[], airtableRecords: any[]): ContentMatch[] {
  const matches: ContentMatch[] = [];
  
  console.log('🔍 Matching existing Supabase products with Airtable content...');
  
  for (const supabaseProduct of supabaseProducts) {
    let bestMatch: ContentMatch | null = null;
    let bestScore = 0;
    
    for (const airtableRecord of airtableRecords) {
      let score = 0;
      let matchType = '';
      
      const supabaseSKU = (supabaseProduct.sku || '').toUpperCase();
      const airtableSKU = (airtableRecord.fields.SKU || '').toUpperCase();
      const supabaseName = (supabaseProduct.name || '').toUpperCase();
      const airtableName = (airtableRecord.fields.Name || '').toUpperCase();
      
      // 1. Exact SKU match (highest priority)
      if (supabaseSKU && airtableSKU && supabaseSKU === airtableSKU) {
        score = 1.0;
        matchType = 'EXACT_SKU';
      }
      // 2. Partial SKU match
      else if (supabaseSKU && airtableSKU) {
        if (supabaseSKU.includes(airtableSKU) || airtableSKU.includes(supabaseSKU)) {
          score = 0.8;
          matchType = 'PARTIAL_SKU';
        }
      }
      
      // 3. Name-based matching if no good SKU match
      if (score < 0.7) {
        const supabaseWords = supabaseName.split(/\s+/).filter(w => w.length > 2);
        const airtableWords = airtableName.split(/\s+/).filter(w => w.length > 2);
        
        const commonWords = supabaseWords.filter(word => 
          airtableWords.some(aWord => aWord.includes(word) || word.includes(aWord))
        );
        
        if (commonWords.length > 0) {
          const nameScore = commonWords.length / Math.max(supabaseWords.length, airtableWords.length);
          if (nameScore > score && nameScore > 0.3) {
            score = nameScore * 0.7; // Lower weight for name matches
            matchType = 'NAME_SIMILARITY';
          }
        }
      }
      
      if (score > bestScore && score > 0.3) {
        const needsImages = !supabaseProduct.image_url && (!supabaseProduct.image_urls || supabaseProduct.image_urls.length === 0);
        const needsDescription = !supabaseProduct.description_md || supabaseProduct.description_md.length < 50;
        const needsShortDescription = !supabaseProduct.short_description || supabaseProduct.short_description.length < 20;
        
        bestMatch = {
          supabaseProduct,
          airtableRecord,
          matchType,
          confidence: score,
          needsImages: needsImages && !!airtableRecord.fields.Images,
          needsDescription: needsDescription && !!airtableRecord.fields.Description,
          needsShortDescription: needsShortDescription && !!airtableRecord.fields['Short description']
        };
        bestScore = score;
      }
    }
    
    if (bestMatch) {
      matches.push(bestMatch);
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}

async function syncExistingRoorContent(dryRun: boolean = true) {
  console.log('🔄 SYNCING EXISTING ROOR PRODUCT CONTENT');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  
  try {
    // 1. Get existing RooR products from Supabase
    console.log('\n📥 Fetching existing RooR products from Supabase...');
    
    const { data: supabaseRoor, error: supabaseError } = await supabase
      .from('products')
      .select('id, name, sku, description, description_md, short_description, image_url, image_urls, brand_id')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log(`✅ Found ${supabaseRoor?.length || 0} existing RooR products in Supabase`);

    // 2. Get all RooR products from Airtable
    console.log('\n📥 Fetching RooR content from Airtable...');
    
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

    console.log(`✅ Found ${allRoorRecords.length} RooR records in Airtable`);

    // 3. Find matches
    const matches = findContentMatches(supabaseRoor || [], allRoorRecords);
    
    console.log(`\n🎯 Found ${matches.length} content matches`);

    // 4. Analyze what needs to be updated
    const needsImages = matches.filter(m => m.needsImages);
    const needsDescriptions = matches.filter(m => m.needsDescription);
    const needsShortDescriptions = matches.filter(m => m.needsShortDescription);

    console.log(`\n📊 CONTENT ANALYSIS:`);
    console.log(`   - Products needing images: ${needsImages.length}`);
    console.log(`   - Products needing descriptions: ${needsDescriptions.length}`);
    console.log(`   - Products needing short descriptions: ${needsShortDescriptions.length}`);

    // 5. Show detailed matches
    console.log(`\n🔗 DETAILED MATCHES:`);
    matches.forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.supabaseProduct.name}`);
      console.log(`   → ${match.airtableRecord.fields.Name}`);
      console.log(`   Match: ${match.matchType} (${(match.confidence * 100).toFixed(1)}%)`);
      console.log(`   SKUs: ${match.supabaseProduct.sku} → ${match.airtableRecord.fields.SKU || 'N/A'}`);
      
      const updates = [];
      if (match.needsImages) updates.push('Images');
      if (match.needsDescription) updates.push('Description');
      if (match.needsShortDescription) updates.push('Short Description');
      
      if (updates.length > 0) {
        console.log(`   Will update: ${updates.join(', ')}`);
      } else {
        console.log(`   ✅ Already has all content`);
      }
    });

    // 6. Apply updates if not dry run
    if (!dryRun && matches.length > 0) {
      console.log(`\n🔄 APPLYING CONTENT UPDATES...`);
      
      let updated = 0;
      let failed = 0;
      
      for (const match of matches) {
        if (!match.needsImages && !match.needsDescription && !match.needsShortDescription) {
          continue; // Skip if no updates needed
        }
        
        try {
          const updateData: any = {
            updated_at: new Date().toISOString()
          };
          
          // Add images if needed
          if (match.needsImages && match.airtableRecord.fields.Images) {
            updateData.image_url = match.airtableRecord.fields.Images;
            updateData.image_urls = [match.airtableRecord.fields.Images];
          }
          
          // Add description if needed
          if (match.needsDescription && match.airtableRecord.fields.Description) {
            updateData.description = match.airtableRecord.fields.Description;
          }
          
          // Add short description if needed
          if (match.needsShortDescription && match.airtableRecord.fields['Short description']) {
            updateData.short_description = match.airtableRecord.fields['Short description'];
          }
          
          const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', match.supabaseProduct.id);
          
          if (error) {
            console.error(`❌ Failed to update ${match.supabaseProduct.name}:`, error.message);
            failed++;
          } else {
            console.log(`✅ Updated: ${match.supabaseProduct.name}`);
            updated++;
          }
          
          // Small delay to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Error updating ${match.supabaseProduct.name}:`, error);
          failed++;
        }
      }
      
      console.log(`\n📊 UPDATE RESULTS: ${updated} updated, ${failed} failed`);
    }

    // 7. Final summary
    console.log(`\n📋 FINAL SUMMARY:`);
    console.log(`   - Existing RooR products: ${supabaseRoor?.length || 0}`);
    console.log(`   - Successfully matched: ${matches.length}`);
    console.log(`   - Match rate: ${supabaseRoor?.length ? ((matches.length / supabaseRoor.length) * 100).toFixed(1) : 0}%`);
    
    if (dryRun) {
      console.log(`\n💡 To apply these updates, run with --apply flag`);
    }

    return matches;

  } catch (error) {
    console.error('❌ Error syncing RooR content:', error);
    throw error;
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

syncExistingRoorContent(dryRun)
  .then(() => {
    console.log('\n✅ RooR content sync complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Content sync failed:', error);
    process.exit(1);
  });
