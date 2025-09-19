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
  needsBrand: boolean;
}

// Function to clean HTML and unwanted content from descriptions
function cleanDescription(text: string | null | undefined): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove HTML entities
  cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;/g, ' ');
  
  // Remove React/ChatGPT artifacts
  cleaned = cleaned.replace(/data-[a-zA-Z0-9-]+="[^"]*"/g, '');
  cleaned = cleaned.replace(/className="[^"]*"/g, '');
  cleaned = cleaned.replace(/style="[^"]*"/g, '');
  
  // Remove div/span artifacts
  cleaned = cleaned.replace(/\n<div[^>]*>/g, '\n');
  cleaned = cleaned.replace(/<\/div>/g, '');
  cleaned = cleaned.replace(/<span[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/span>/g, '');
  
  // Remove ChatGPT conversation artifacts
  cleaned = cleaned.replace(/react-scroll-to-bottom[^"]*"/g, '');
  cleaned = cleaned.replace(/conversation-turn-\d+/g, '');
  cleaned = cleaned.replace(/data-testid="[^"]*"/g, '');
  cleaned = cleaned.replace(/data-message-[^=]*="[^"]*"/g, '');
  
  // Remove markdown artifacts
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1'); // Bold
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1'); // Italic
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  cleaned = cleaned.trim();
  
  // Remove empty lines and excessive spacing
  cleaned = cleaned.split('\n').filter(line => line.trim().length > 0).join('\n');
  
  return cleaned;
}

// Enhanced matching function for Puffco products
function findPuffcoMatches(supabaseProducts: any[], airtableRecords: any[]): ContentMatch[] {
  const matches: ContentMatch[] = [];
  
  console.log('🔍 Matching existing Supabase Puffco products with Airtable content...');
  
  for (const supabaseProduct of supabaseProducts) {
    let bestMatch: ContentMatch | null = null;
    let bestScore = 0;
    
    for (const airtableRecord of airtableRecords) {
      let score = 0;
      let matchType = '';
      
      const supabaseSKU = (supabaseProduct.sku || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const airtableSKU = (airtableRecord.fields.SKU || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const supabaseName = (supabaseProduct.name || '').toUpperCase();
      const airtableName = (airtableRecord.fields.Name || '').toUpperCase();
      
      // 1. Exact SKU match (highest priority)
      if (supabaseSKU && airtableSKU && supabaseSKU === airtableSKU) {
        score = 1.0;
        matchType = 'EXACT_SKU';
      }
      // 2. Partial SKU match
      else if (supabaseSKU && airtableSKU && supabaseSKU.length > 3 && airtableSKU.length > 3) {
        if (supabaseSKU.includes(airtableSKU) || airtableSKU.includes(supabaseSKU)) {
          score = 0.8;
          matchType = 'PARTIAL_SKU';
        }
      }
      
      // 3. Name-based matching
      if (score < 0.7) {
        // Extract key product identifiers
        const supabaseWords = supabaseName.split(/\s+/).filter(w => w.length > 2);
        const airtableWords = airtableName.split(/\s+/).filter(w => w.length > 2);
        
        // Look for common Puffco model names
        const puffcoModels = ['PEAK', 'PROXY', 'PLUS', 'PRO', 'CHAMBER', 'ATOMIZER', 'CARB', 'CAP'];
        const supabaseModels = supabaseWords.filter(w => puffcoModels.includes(w));
        const airtableModels = airtableWords.filter(w => puffcoModels.includes(w));
        
        const commonModels = supabaseModels.filter(model => airtableModels.includes(model));
        
        if (commonModels.length > 0) {
          const modelScore = commonModels.length / Math.max(supabaseModels.length, airtableModels.length, 1);
          if (modelScore > score) {
            score = modelScore * 0.9;
            matchType = 'MODEL_MATCH';
          }
        }
        
        // General name similarity as fallback
        if (score < 0.5) {
          const commonWords = supabaseWords.filter(word => 
            airtableWords.some(aWord => aWord.includes(word) || word.includes(aWord))
          );
          
          if (commonWords.length > 0) {
            const nameScore = commonWords.length / Math.max(supabaseWords.length, airtableWords.length);
            if (nameScore > score && nameScore > 0.3) {
              score = nameScore * 0.6;
              matchType = 'NAME_SIMILARITY';
            }
          }
        }
      }
      
      if (score > bestScore && score > 0.3) {
        const needsImages = !supabaseProduct.image_url && (!supabaseProduct.image_urls || supabaseProduct.image_urls.length === 0);
        const needsDescription = !supabaseProduct.description_md || supabaseProduct.description_md.length < 50;
        const needsShortDescription = !supabaseProduct.short_description || supabaseProduct.short_description.length < 20;
        const needsBrand = !supabaseProduct.brand_name || supabaseProduct.brand_name === 'Unknown';
        
        bestMatch = {
          supabaseProduct,
          airtableRecord,
          matchType,
          confidence: score,
          needsImages: needsImages && !!airtableRecord.fields.Images,
          needsDescription: needsDescription && !!airtableRecord.fields.Description,
          needsShortDescription: needsShortDescription && !!airtableRecord.fields['Short description'],
          needsBrand: needsBrand && !!airtableRecord.fields.Brands
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

async function syncPuffcoProducts(dryRun: boolean = true) {
  console.log('🔄 SYNCING PUFFCO PRODUCT CONTENT');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  
  try {
    // 1. Get existing Puffco products from Supabase
    console.log('\n📥 Fetching existing Puffco products from Supabase...');
    
    const { data: supabasePuffco, error: supabaseError } = await supabase
      .from('products')
      .select('id, name, sku, description, description_md, short_description, image_url, image_urls, brand_id, brand_name')
      .or('name.ilike.%PUFFCO%,sku.ilike.%PUFFCO%,description.ilike.%PUFFCO%,brand_name.ilike.%PUFFCO%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log(`✅ Found ${supabasePuffco?.length || 0} existing Puffco products in Supabase`);

    // 2. Get all Puffco products from Airtable
    console.log('\n📥 Fetching Puffco content from Airtable...');
    
    let allPuffcoRecords: any[] = [];
    let offset = '';
    
    do {
      const filterFormula = `OR(FIND("Puffco",{Brands}),FIND("PUFFCO",{Brands}),FIND("puffco",{Brands}),FIND("Puffco",{Name}),FIND("PUFFCO",{Name}),FIND("puffco",{Name}))`;
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
      allPuffcoRecords = allPuffcoRecords.concat(data.records || []);
      offset = data.offset || '';
      
    } while (offset);

    console.log(`✅ Found ${allPuffcoRecords.length} Puffco records in Airtable`);

    // 3. Show sample of what we found
    console.log('\n📋 SAMPLE AIRTABLE PUFFCO PRODUCTS:');
    allPuffcoRecords.slice(0, 5).forEach((record, index) => {
      const description = cleanDescription(record.fields.Description);
      const shortDesc = cleanDescription(record.fields['Short description']);
      
      console.log(`${index + 1}. ${record.fields.Name}`);
      console.log(`   SKU: ${record.fields.SKU || 'N/A'}`);
      console.log(`   Brand: ${record.fields.Brands || 'N/A'}`);
      console.log(`   Description: ${description ? description.substring(0, 100) + '...' : 'None'}`);
      console.log(`   Short Desc: ${shortDesc ? shortDesc.substring(0, 50) + '...' : 'None'}`);
      console.log(`   Image: ${record.fields.Images ? 'Yes' : 'No'}`);
      console.log('');
    });

    // 4. Find matches if we have existing products
    let matches: ContentMatch[] = [];
    if (supabasePuffco && supabasePuffco.length > 0) {
      matches = findPuffcoMatches(supabasePuffco, allPuffcoRecords);
      console.log(`\n🎯 Found ${matches.length} content matches`);
    } else {
      console.log('\n📝 No existing Puffco products in Supabase to match');
    }

    // 5. Analyze what needs to be updated
    const needsImages = matches.filter(m => m.needsImages);
    const needsDescriptions = matches.filter(m => m.needsDescription);
    const needsShortDescriptions = matches.filter(m => m.needsShortDescription);
    const needsBrands = matches.filter(m => m.needsBrand);

    console.log(`\n📊 CONTENT ANALYSIS:`);
    console.log(`   - Products needing images: ${needsImages.length}`);
    console.log(`   - Products needing descriptions: ${needsDescriptions.length}`);
    console.log(`   - Products needing short descriptions: ${needsShortDescriptions.length}`);
    console.log(`   - Products needing brand info: ${needsBrands.length}`);

    // 6. Show detailed matches
    if (matches.length > 0) {
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
        if (match.needsBrand) updates.push('Brand');
        
        if (updates.length > 0) {
          console.log(`   Will update: ${updates.join(', ')}`);
        } else {
          console.log(`   ✅ Already has all content`);
        }
      });
    }

    // 7. Apply updates if not dry run
    if (!dryRun && matches.length > 0) {
      console.log(`\n🔄 APPLYING CONTENT UPDATES...`);

      let updated = 0;
      let failed = 0;

      for (const match of matches) {
        if (!match.needsImages && !match.needsDescription && !match.needsShortDescription && !match.needsBrand) {
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

          // Add cleaned descriptions if needed
          if (match.needsDescription && match.airtableRecord.fields.Description) {
            const cleanedDescription = cleanDescription(match.airtableRecord.fields.Description);
            updateData.description = cleanedDescription; // Regular description field
            updateData.description_md = cleanedDescription; // Markdown description field
          }

          // Add cleaned short description if needed - Clean HTML from short description too
          if (match.needsShortDescription && match.airtableRecord.fields['Short description']) {
            updateData.short_description = cleanDescription(match.airtableRecord.fields['Short description']);
          }

          // Add brand info if needed - Map Airtable Brands to Supabase brand_name
          if (match.needsBrand && match.airtableRecord.fields.Brands) {
            updateData.brand_name = match.airtableRecord.fields.Brands;
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

    return { matches, allPuffcoRecords };

  } catch (error) {
    console.error('❌ Error syncing Puffco content:', error);
    throw error;
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

syncPuffcoProducts(dryRun)
  .then((result) => {
    console.log('\n✅ Puffco content sync analysis complete!');
    if (dryRun) {
      console.log('\n💡 To apply these updates, run with --apply flag');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Content sync failed:', error);
    process.exit(1);
  });
