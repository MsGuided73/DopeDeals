import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🚀 STREAMLINED BRAND INTEGRATION WORKFLOW
// Optimized for your actual Airtable structure: tblAVv84OmqHj8ckr

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID!; // tblAVv84OmqHj8ckr

interface AirtableProduct {
  id: string;
  fields: {
    Name?: string;
    SKU?: string;
    Image_url?: string;
    Type?: string | string[];
    'Regular price'?: number;
    [key: string]: any;
  };
}

interface SupabaseProduct {
  id: string;
  sku: string;
  name: string;
  brand_name?: string;
  image_url?: string;
  price: number;
}

// 🎯 BRAND DETECTION PATTERNS
const BRAND_PATTERNS = {
  'Puffco': ['puffco', 'peak', 'proxy', 'chamber'],
  'RooR': ['roor', 'beaker', 'straight tube', 'german glass'],
  'Crave': ['crave', 'disposable', 'vape'],
  'RAW': ['raw', 'papers', 'rolling'],
  'Cookies': ['cookies', 'berner'],
  'Urth Farms': ['urth', 'farms', 'flower'],
  'GRAV': ['grav', 'gravitron'],
  'Empire Glassworks': ['empire', 'glassworks'],
  'Higher Standards': ['higher standards', 'higher standard']
};

// 🔍 SMART BRAND DETECTION
function detectBrandFromProduct(name: string, sku: string): string | null {
  const searchText = `${name} ${sku}`.toLowerCase();
  
  for (const [brand, patterns] of Object.entries(BRAND_PATTERNS)) {
    for (const pattern of patterns) {
      if (searchText.includes(pattern.toLowerCase())) {
        return brand;
      }
    }
  }
  
  // Extract potential brand from first word of name
  const firstWord = name.split(' ')[0];
  if (firstWord && firstWord.length > 2 && /^[A-Z]/.test(firstWord)) {
    return firstWord;
  }
  
  return null;
}

// 📊 CALCULATE MATCH SCORE
function calculateMatchScore(airtable: AirtableProduct, supabase: SupabaseProduct): {
  score: number;
  reasons: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  let score = 0;
  const reasons: string[] = [];
  
  const airtableName = (airtable.fields.Name || '').toLowerCase();
  const airtableSKU = (airtable.fields.SKU || '').toLowerCase();
  const supabaseName = supabase.name.toLowerCase();
  const supabaseSKU = supabase.sku.toLowerCase();
  
  // Exact SKU match (highest confidence)
  if (airtableSKU === supabaseSKU) {
    score += 200;
    reasons.push('Exact SKU match');
  } else if (airtableSKU.includes(supabaseSKU) || supabaseSKU.includes(airtableSKU)) {
    score += 100;
    reasons.push('Partial SKU match');
  }
  
  // Brand detection match
  const airtableBrand = detectBrandFromProduct(airtable.fields.Name || '', airtable.fields.SKU || '');
  const supabaseBrand = detectBrandFromProduct(supabase.name, supabase.sku);
  
  if (airtableBrand && supabaseBrand && airtableBrand === supabaseBrand) {
    score += 150;
    reasons.push(`Brand match: ${airtableBrand}`);
  }
  
  // Name similarity
  const airtableWords = airtableName.split(/\s+/).filter(w => w.length > 2);
  const supabaseWords = supabaseName.split(/\s+/).filter(w => w.length > 2);
  
  let commonWords = 0;
  for (const aWord of airtableWords) {
    for (const sWord of supabaseWords) {
      if (aWord === sWord || aWord.includes(sWord) || sWord.includes(aWord)) {
        commonWords++;
        break;
      }
    }
  }
  
  score += commonWords * 20;
  if (commonWords > 0) reasons.push(`${commonWords} common words`);
  
  // Price similarity (if available)
  if (airtable.fields['Regular price'] && Math.abs(airtable.fields['Regular price'] - supabase.price) < 5) {
    score += 50;
    reasons.push('Similar price');
  }
  
  // Determine confidence
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (score >= 300) confidence = 'HIGH';
  else if (score >= 200) confidence = 'MEDIUM';
  
  return { score, reasons, confidence };
}

// 📤 UPLOAD IMAGE TO SUPABASE
async function uploadImageToSupabase(imageUrl: string, sku: string, brandName: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlParts = imageUrl.split('/');
    const originalFilename = urlParts[urlParts.length - 1] || 'product_image.jpg';
    const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
    const sanitizedBrand = brandName.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = Date.now();
    const extension = originalFilename.split('.').pop() || 'jpg';
    const fileName = `${sanitizedBrand}_${sanitizedSku}_${timestamp}.${extension}`;
    const filePath = `products/${sanitizedBrand}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, buffer, {
        upsert: true,
        contentType: response.headers.get('content-type') || 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable'
      });

    if (error) return null;

    const { data: publicData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    return null;
  }
}

// 🚀 MAIN STREAMLINED WORKFLOW
async function runStreamlinedBrandWorkflow(options: {
  dryRun?: boolean;
  maxProducts?: number;
  minScore?: number;
  brandFilter?: string;
} = {}) {
  const { dryRun = true, maxProducts = 50, minScore = 200, brandFilter } = options;
  
  console.log('🚀 STREAMLINED BRAND INTEGRATION WORKFLOW');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Max Products: ${maxProducts}`);
  console.log(`Min Score: ${minScore}`);
  console.log(`Brand Filter: ${brandFilter || 'All brands'}\n`);
  
  try {
    // Fetch Airtable products with images
    console.log('📡 Fetching Airtable products...');
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?filterByFormula={Image_url}!=""&maxRecords=500`;
    
    const airtableResponse = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!airtableResponse.ok) {
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }
    
    const airtableData = await airtableResponse.json();
    const airtableProducts: AirtableProduct[] = airtableData.records || [];
    
    console.log(`✅ Found ${airtableProducts.length} Airtable products with images`);
    
    // Fetch Supabase products needing enhancement
    console.log('🗄️ Fetching Supabase products...');
    let supabaseQuery = supabase
      .from('products')
      .select('id, sku, name, brand_name, image_url, price')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .or('image_url.is.null,brand_name.is.null')
      .limit(maxProducts);
    
    // Apply brand filter if specified
    if (brandFilter) {
      supabaseQuery = supabaseQuery.ilike('name', `%${brandFilter}%`);
    }
    
    const { data: supabaseProducts, error } = await supabaseQuery;
    
    if (error) throw error;
    
    console.log(`✅ Found ${supabaseProducts?.length || 0} Supabase products needing enhancement\n`);
    
    if (!supabaseProducts || supabaseProducts.length === 0) {
      console.log('No Supabase products found needing enhancement');
      return;
    }
    
    // Process matches
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const supabaseProduct of supabaseProducts) {
      console.log(`🔍 Processing: ${supabaseProduct.name}`);
      console.log(`   SKU: ${supabaseProduct.sku}`);
      
      // Find best match
      let bestMatch: AirtableProduct | null = null;
      let bestScore = 0;
      let bestMatchResult = { score: 0, reasons: [], confidence: 'LOW' as const };
      
      for (const airtableProduct of airtableProducts) {
        const matchResult = calculateMatchScore(airtableProduct, supabaseProduct);
        if (matchResult.score > bestScore) {
          bestMatch = airtableProduct;
          bestScore = matchResult.score;
          bestMatchResult = matchResult;
        }
      }
      
      if (!bestMatch || bestScore < minScore) {
        console.log(`   ❌ No suitable match (best score: ${bestScore})`);
        skipped++;
        processed++;
        continue;
      }
      
      console.log(`   ✅ Match: ${bestMatch.fields.Name} (Score: ${bestScore}, ${bestMatchResult.confidence})`);
      console.log(`   📊 Reasons: ${bestMatchResult.reasons.join(', ')}`);
      
      // Detect brand for this product
      const detectedBrand = detectBrandFromProduct(
        bestMatch.fields.Name || '', 
        bestMatch.fields.SKU || ''
      );
      
      if (dryRun) {
        console.log(`   🔍 DRY RUN: Would update with brand "${detectedBrand}" and image`);
        processed++;
        continue;
      }
      
      // Apply updates
      const updates: any = { updated_at: new Date().toISOString() };
      
      // Update brand if detected and missing
      if (detectedBrand && !supabaseProduct.brand_name) {
        updates.brand_name = detectedBrand;
        console.log(`   🏷️  Setting brand: ${detectedBrand}`);
      }
      
      // Update image if missing
      if (!supabaseProduct.image_url && bestMatch.fields.Image_url) {
        console.log(`   📤 Uploading image...`);
        const uploadedUrl = await uploadImageToSupabase(
          bestMatch.fields.Image_url,
          supabaseProduct.sku,
          detectedBrand || 'unknown'
        );
        
        if (uploadedUrl) {
          updates.image_url = uploadedUrl;
          console.log(`   ✅ Image uploaded`);
        }
      }
      
      // Apply updates
      if (Object.keys(updates).length > 1) { // More than just updated_at
        const { error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', supabaseProduct.id);
        
        if (updateError) {
          console.log(`   ❌ Update failed: ${updateError.message}`);
        } else {
          console.log(`   ✅ Product updated successfully`);
          updated++;
        }
      }
      
      processed++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 WORKFLOW SUMMARY:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    
    if (dryRun) {
      console.log(`\n💡 To run live updates:`);
      console.log(`   pnpm exec tsx scripts/streamlined-brand-workflow.ts --live`);
      console.log(`   pnpm exec tsx scripts/streamlined-brand-workflow.ts --live --brand="Puffco"`);
    }
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--live');
const maxProductsArg = args.find(arg => arg.startsWith('--max-products='));
const maxProducts = maxProductsArg ? parseInt(maxProductsArg.split('=')[1]) : 50;
const minScoreArg = args.find(arg => arg.startsWith('--min-score='));
const minScore = minScoreArg ? parseInt(minScoreArg.split('=')[1]) : 200;
const brandArg = args.find(arg => arg.startsWith('--brand='));
const brandFilter = brandArg ? brandArg.split('=')[1] : undefined;

runStreamlinedBrandWorkflow({
  dryRun,
  maxProducts,
  minScore,
  brandFilter
}).catch(console.error);
