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

interface AirtableRecord {
  id: string;
  fields: {
    SKU?: string;
    Name?: string;
    Brands?: string; // Changed from Brand to Brands (plural)
    Images?: string; // Single URL string
    [key: string]: any;
  };
}

interface SupabaseProduct {
  id: string;
  name: string;
  sku: string;
  brand_id?: string;
  brand_name?: string;
  image_url?: string;
  image_urls?: string[];
}

// Extract key product identifiers from name
function extractProductIdentifiers(name: string): {
  brand: string | null;
  model: string | null;
  size: string | null;
  keywords: string[];
} {
  const normalized = name.toUpperCase();
  
  // Extract brand from name
  const brandPatterns = [
    /\bROOR\b/,
    /\bRAW\b/,
    /\bGRAV\b/,
    /\bPUFFCO\b/,
    /\bSTORZ\b/,
    /\bEMPIRE\b/,
    /\bCRAVE\b/,
    /\bHIGHER\b/,
    /\bGLASS\s+CITY\b/,
    /\bDANK\s+STOP\b/,
  ];
  
  let brand = null;
  for (const pattern of brandPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      brand = match[0];
      break;
    }
  }
  
  // Extract model numbers/references
  const modelPatterns = [
    /\bREF:\s*([A-Z0-9\-\s]+)/,
    /\bMODEL:\s*([A-Z0-9\-\s]+)/,
    /\b([A-Z]{1,3}\s*\d{2,4}[A-Z]?)\b/,
    /\b(\d{2,4}[A-Z]{1,3})\b/,
  ];
  
  let model = null;
  for (const pattern of modelPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      model = match[1].trim();
      break;
    }
  }
  
  // Extract size information
  const sizePatterns = [
    /(\d+(?:\.\d+)?)\s*(?:INCH|IN|")/,
    /(\d+(?:\.\d+)?)\s*MM/,
    /(\d+(?:\.\d+)?)\s*CM/,
  ];
  
  let size = null;
  for (const pattern of sizePatterns) {
    const match = normalized.match(pattern);
    if (match) {
      size = match[1];
      break;
    }
  }
  
  // Extract keywords (remove common words)
  const stopWords = new Set(['THE', 'A', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH', 'BY', 'PIPE', 'WATER', 'GLASS']);
  const keywords = normalized
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10); // Limit to top 10 keywords
  
  return { brand, model, size, keywords };
}

// Calculate enhanced similarity score
function calculateEnhancedSimilarity(airtableName: string, supabaseName: string): {
  score: number;
  details: string;
} {
  const airtableIds = extractProductIdentifiers(airtableName);
  const supabaseIds = extractProductIdentifiers(supabaseName);
  
  let score = 0;
  let details = [];
  
  // Brand matching (high weight)
  if (airtableIds.brand && supabaseIds.brand) {
    if (airtableIds.brand === supabaseIds.brand) {
      score += 0.4;
      details.push('brand_exact');
    }
  }
  
  // Model matching (high weight)
  if (airtableIds.model && supabaseIds.model) {
    if (airtableIds.model === supabaseIds.model) {
      score += 0.3;
      details.push('model_exact');
    } else if (airtableIds.model.includes(supabaseIds.model) || supabaseIds.model.includes(airtableIds.model)) {
      score += 0.2;
      details.push('model_partial');
    }
  }
  
  // Size matching (medium weight)
  if (airtableIds.size && supabaseIds.size) {
    if (airtableIds.size === supabaseIds.size) {
      score += 0.15;
      details.push('size_match');
    }
  }
  
  // Keyword overlap (medium weight)
  const commonKeywords = airtableIds.keywords.filter(k => supabaseIds.keywords.includes(k));
  if (commonKeywords.length > 0) {
    const keywordScore = (commonKeywords.length / Math.max(airtableIds.keywords.length, supabaseIds.keywords.length)) * 0.15;
    score += keywordScore;
    details.push(`keywords_${commonKeywords.length}`);
  }
  
  return { score, details: details.join(',') };
}

// Enhanced matching function
function findEnhancedMatches(airtableRecords: AirtableRecord[], supabaseProducts: SupabaseProduct[]): Array<{
  airtableRecord: AirtableRecord;
  supabaseProduct: SupabaseProduct;
  score: number;
  matchDetails: string;
}> {
  const matches = [];
  
  console.log('🔍 Processing enhanced matching...');
  
  for (let i = 0; i < airtableRecords.length; i++) {
    const airtableRecord = airtableRecords[i];
    const airtableName = airtableRecord.fields.Name || '';
    
    if (!airtableName || !airtableRecord.fields.Images) continue;
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const supabaseProduct of supabaseProducts) {
      // Skip products that already have images
      if (supabaseProduct.image_url || (supabaseProduct.image_urls && supabaseProduct.image_urls.length > 0)) {
        continue;
      }
      
      const similarity = calculateEnhancedSimilarity(airtableName, supabaseProduct.name);
      
      if (similarity.score > bestScore && similarity.score > 0.3) { // Lower threshold for name-based matching
        bestScore = similarity.score;
        bestMatch = {
          airtableRecord,
          supabaseProduct,
          score: similarity.score,
          matchDetails: similarity.details
        };
      }
    }
    
    if (bestMatch) {
      matches.push(bestMatch);
    }
    
    // Progress indicator
    if (i % 500 === 0) {
      console.log(`   Processed ${i}/${airtableRecords.length} records...`);
    }
  }
  
  // Sort by score (best matches first)
  matches.sort((a, b) => b.score - a.score);
  
  // Remove duplicate Supabase products (keep best match only)
  const usedSupabaseIds = new Set();
  const uniqueMatches = matches.filter(match => {
    if (usedSupabaseIds.has(match.supabaseProduct.id)) {
      return false;
    }
    usedSupabaseIds.add(match.supabaseProduct.id);
    return true;
  });
  
  return uniqueMatches;
}

// Main enhanced matching function
async function runEnhancedMatching() {
  console.log('🚀 ENHANCED PRODUCT MATCHING SYSTEM');
  console.log('=' .repeat(60));
  
  try {
    // Fetch Airtable records with images
    console.log('📥 Fetching Airtable records with images...');
    let allRecords: AirtableRecord[] = [];
    let offset = '';
    
    do {
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=NOT({Images}='')${offset ? `&offset=${offset}` : ''}`;
      
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
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset || '';
      
      console.log(`   Fetched ${data.records?.length || 0} records, total: ${allRecords.length}`);
    } while (offset);
    
    // Fetch Supabase products without images
    console.log('📥 Fetching Supabase products without images...');
    const { data: supabaseProducts, error } = await supabase
      .from('products')
      .select('id, name, sku, brand_id, brand_name, image_url, image_urls')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .is('image_url', null);
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`   Found ${supabaseProducts?.length || 0} products without images`);
    
    // Run enhanced matching
    const matches = findEnhancedMatches(allRecords, supabaseProducts || []);
    
    console.log(`\n📊 Enhanced Matching Results:`);
    console.log(`   - Products with images in Airtable: ${allRecords.length}`);
    console.log(`   - Products without images in Supabase: ${supabaseProducts?.length || 0}`);
    console.log(`   - Successful matches: ${matches.length}`);
    console.log(`   - Match rate: ${((matches.length / (supabaseProducts?.length || 1)) * 100).toFixed(1)}%`);
    
    // Show top matches
    console.log('\n🎯 Top Matches:');
    matches.slice(0, 15).forEach((match, index) => {
      console.log(`${index + 1}. Score: ${(match.score * 100).toFixed(1)}% | ${match.matchDetails}`);
      console.log(`   Airtable: ${match.airtableRecord.fields.Name}`);
      console.log(`   Supabase: ${match.supabaseProduct.name}`);
      console.log(`   SKUs: ${match.airtableRecord.fields.SKU} → ${match.supabaseProduct.sku}`);
      console.log('');
    });
    
    return matches;
    
  } catch (error) {
    console.error('❌ Enhanced matching error:', error);
    throw error;
  }
}

// Apply matches to Supabase
async function applyMatches(matches: any[], dryRun: boolean = true) {
  console.log(`\n🔄 ${dryRun ? 'DRY RUN' : 'APPLYING'} IMAGE UPDATES`);
  console.log('=' .repeat(60));
  
  let updated = 0;
  let failed = 0;
  
  for (const match of matches) {
    const { airtableRecord, supabaseProduct, score } = match;
    
    // Only apply high-confidence matches
    if (score < 0.5) {
      console.log(`⏭️  Skipping low confidence match: ${supabaseProduct.name} (${(score * 100).toFixed(1)}%)`);
      continue;
    }
    
    const imageUrl = airtableRecord.fields.Images;
    
    if (dryRun) {
      console.log(`✅ Would update: ${supabaseProduct.name}`);
      console.log(`   Image: ${imageUrl}`);
      updated++;
    } else {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            image_url: imageUrl,
            image_urls: [imageUrl],
            updated_at: new Date().toISOString()
          })
          .eq('id', supabaseProduct.id);
        
        if (error) {
          console.error(`❌ Failed to update ${supabaseProduct.name}:`, error.message);
          failed++;
        } else {
          console.log(`✅ Updated: ${supabaseProduct.name}`);
          updated++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${supabaseProduct.name}:`, error);
        failed++;
      }
    }
  }
  
  console.log(`\n📊 Results: ${updated} updated, ${failed} failed`);
  return { updated, failed };
}

// Export functions
export { runEnhancedMatching, applyMatches };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0] || 'analyze';
  
  runEnhancedMatching()
    .then(async (matches) => {
      if (command === 'apply') {
        await applyMatches(matches, false);
      } else if (command === 'dry-run') {
        await applyMatches(matches, true);
      }
      console.log('✅ Enhanced matching complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Enhanced matching failed:', error);
      process.exit(1);
    });
}
