import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE || 'Products';

// 🎯 SCALABLE BRAND INTEGRATION WORKFLOW
// Designed to handle 4500+ products efficiently with minimal manual intervention

interface BrandConfig {
  name: string;
  searchTerms: string[];
  categories: string[];
  imageKeywords: string[];
  descriptionTemplate: string;
  priority: number; // 1 = highest priority
}

// 📋 BRAND CONFIGURATIONS - Easy to add new brands
const BRAND_CONFIGS: BrandConfig[] = [
  {
    name: 'Puffco',
    searchTerms: ['puffco', 'peak', 'proxy', 'chamber', 'travel glass'],
    categories: ['E-Rigs', 'Vaporizers', 'Accessories'],
    imageKeywords: ['peak', 'proxy', 'chamber', 'glass', 'puffco'],
    descriptionTemplate: 'premium_tech',
    priority: 1
  },
  {
    name: 'RooR',
    searchTerms: ['roor', 'beaker', 'straight tube', 'ash catcher', 'german'],
    categories: ['Bongs', 'Water Pipes', 'Glass'],
    imageKeywords: ['roor', 'beaker', 'tube', 'glass', 'bong'],
    descriptionTemplate: 'premium_glass',
    priority: 1
  },
  {
    name: 'Crave',
    searchTerms: ['crave', 'disposable', 'vape', 'thca', 'cart'],
    categories: ['Disposables', 'Vaporizers', 'THCA'],
    imageKeywords: ['crave', 'disposable', 'vape', 'cart'],
    descriptionTemplate: 'modern_vape',
    priority: 1
  },
  {
    name: 'Urth Farms',
    searchTerms: ['urth', 'farms', 'flower', 'preroll', 'cannabis'],
    categories: ['Flower', 'Pre-Rolls', 'Cannabis'],
    imageKeywords: ['urth', 'flower', 'preroll', 'cannabis'],
    descriptionTemplate: 'premium_cannabis',
    priority: 2
  }
];

// 🎨 DESCRIPTION TEMPLATES
const DESCRIPTION_TEMPLATES = {
  premium_tech: {
    short: "Premium electronic device with advanced technology and superior performance.",
    detailed: "Experience the pinnacle of vaping technology with this premium device. Engineered for performance, built for reliability, and designed for the discerning enthusiast who demands the best."
  },
  premium_glass: {
    short: "Premium German borosilicate glass with exceptional craftsmanship.",
    detailed: "Crafted from premium German borosilicate glass, this piece represents the highest standards of glasswork. Each piece is meticulously designed for optimal function and aesthetic appeal."
  },
  modern_vape: {
    short: "Modern vaping device with sleek design and reliable performance.",
    detailed: "Discover the perfect balance of style and functionality with this modern vaping solution. Designed for convenience and engineered for consistent, satisfying performance."
  },
  premium_cannabis: {
    short: "Premium cannabis product with exceptional quality and potency.",
    detailed: "Experience premium cannabis at its finest. Carefully cultivated and expertly processed to deliver exceptional quality, potency, and flavor in every use."
  }
};

// 🔍 INTELLIGENT MATCHING ALGORITHM
function calculateBrandMatchScore(
  airtableRecord: any, 
  supabaseProduct: any, 
  brandConfig: BrandConfig
): { score: number; reasons: string[]; confidence: 'HIGH' | 'MEDIUM' | 'LOW' } {
  let score = 0;
  const reasons: string[] = [];
  
  const airtableName = (airtableRecord.fields.Name || '').toLowerCase();
  const airtableSKU = (airtableRecord.fields.SKU || '').toLowerCase();
  const airtableBrands = (airtableRecord.fields.Brands || '').toLowerCase();
  
  const supabaseName = (supabaseProduct.name || '').toLowerCase();
  const supabaseSKU = supabaseProduct.sku.toLowerCase();
  
  // Brand name matching (highest weight)
  const brandName = brandConfig.name.toLowerCase();
  if ((airtableName.includes(brandName) || airtableBrands.includes(brandName)) &&
      (supabaseName.includes(brandName) || supabaseSKU.includes(brandName))) {
    score += 100;
    reasons.push(`Brand match: ${brandConfig.name}`);
  }
  
  // Search terms matching
  let termMatches = 0;
  for (const term of brandConfig.searchTerms) {
    if (airtableName.includes(term) && supabaseName.includes(term)) {
      score += 30;
      termMatches++;
      reasons.push(`Term match: ${term}`);
    }
  }
  
  // SKU matching
  if (airtableSKU === supabaseSKU) {
    score += 200;
    reasons.push('Exact SKU match');
  } else if (airtableSKU.includes(supabaseSKU) || supabaseSKU.includes(airtableSKU)) {
    score += 75;
    reasons.push('Partial SKU match');
  }
  
  // Word similarity
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
  
  score += commonWords * 15;
  if (commonWords > 0) reasons.push(`${commonWords} common words`);
  
  // Determine confidence
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (score >= 300) confidence = 'HIGH';
  else if (score >= 200) confidence = 'MEDIUM';
  
  return { score, reasons, confidence };
}

// 📤 IMAGE UPLOAD FUNCTION
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

// 🤖 AI DESCRIPTION GENERATION
async function generateBrandDescription(
  productName: string, 
  brandConfig: BrandConfig, 
  price?: number
): Promise<{ short: string; detailed: string }> {
  try {
    const template = DESCRIPTION_TEMPLATES[brandConfig.descriptionTemplate as keyof typeof DESCRIPTION_TEMPLATES];
    
    const prompt = `Create compelling product descriptions for this ${brandConfig.name} product:

Product: ${productName}
Brand: ${brandConfig.name}
Price: ${price ? `$${price}` : 'Not specified'}
Categories: ${brandConfig.categories.join(', ')}

Create:
1. Short description (under 80 characters)
2. Detailed description (2-3 sentences, marketing-focused)

Guidelines:
- Use DOPE CITY brand voice (authentic, street-smart, confident)
- Focus on quality and performance
- Mention ${brandConfig.name} brand reputation
- Avoid health claims
- Be specific about features when possible

Format as JSON:
{
  "short": "Brief product summary",
  "detailed": "Detailed marketing description"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return { short: parsed.short, detailed: parsed.detailed };
    }
  } catch (error) {
    console.error('AI description generation failed:', error);
  }
  
  // Fallback to template
  const template = DESCRIPTION_TEMPLATES[brandConfig.descriptionTemplate as keyof typeof DESCRIPTION_TEMPLATES];
  return { short: template.short, detailed: template.detailed };
}

// 🚀 MAIN WORKFLOW FUNCTION
async function processBrandIntegration(
  brandConfig: BrandConfig, 
  options: {
    dryRun?: boolean;
    maxProducts?: number;
    minMatchScore?: number;
    forceUpdate?: boolean;
  } = {}
) {
  const { dryRun = true, maxProducts = 50, minMatchScore = 200, forceUpdate = false } = options;
  
  console.log(`\n🔥 PROCESSING BRAND: ${brandConfig.name.toUpperCase()}`);
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Priority: ${brandConfig.priority}`);
  console.log(`Max Products: ${maxProducts}`);
  console.log(`Min Match Score: ${minMatchScore}\n`);
  
  try {
    // Fetch Airtable records for this brand
    const brandTerms = brandConfig.searchTerms.join('|');
    const filterFormula = `AND(OR(${brandConfig.searchTerms.map(term => 
      `FIND("${term}",UPPER({Name}))`
    ).join(',')}),{Image_url}!="")`;
    
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
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
    const airtableRecords = airtableData.records || [];
    
    // Fetch Supabase products for this brand
    const { data: supabaseProducts } = await supabase
      .from('products')
      .select('id, sku, name, image_url, brand_name, price, short_description, description')
      .or(brandConfig.searchTerms.map(term => `name.ilike.%${term}%`).join(','))
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(maxProducts);
    
    console.log(`📊 Found ${airtableRecords.length} Airtable records, ${supabaseProducts?.length || 0} Supabase products\n`);
    
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const supabaseProduct of supabaseProducts || []) {
      if (processed >= maxProducts) break;
      
      console.log(`🔍 Processing: ${supabaseProduct.name}`);
      
      // Find best match
      let bestMatch = null;
      let bestScore = 0;
      let bestMatchResult = { score: 0, reasons: [], confidence: 'LOW' as const };
      
      for (const airtableRecord of airtableRecords) {
        const matchResult = calculateBrandMatchScore(airtableRecord, supabaseProduct, brandConfig);
        if (matchResult.score > bestScore) {
          bestMatch = airtableRecord;
          bestScore = matchResult.score;
          bestMatchResult = matchResult;
        }
      }
      
      if (!bestMatch || bestScore < minMatchScore) {
        console.log(`   ❌ No suitable match (best score: ${bestScore})`);
        skipped++;
        processed++;
        continue;
      }
      
      console.log(`   ✅ Match: ${bestMatch.fields.Name} (Score: ${bestScore}, ${bestMatchResult.confidence})`);
      
      // Check what needs updating
      const needsImage = !supabaseProduct.image_url || forceUpdate;
      const needsDescription = !supabaseProduct.short_description || !supabaseProduct.description || forceUpdate;
      
      if (!needsImage && !needsDescription) {
        console.log(`   ⏭️  Already complete`);
        skipped++;
        processed++;
        continue;
      }
      
      if (dryRun) {
        console.log(`   🔍 DRY RUN: Would update ${needsImage ? 'image' : ''} ${needsDescription ? 'descriptions' : ''}`);
        processed++;
        continue;
      }
      
      // Perform updates
      const updates: any = { updated_at: new Date().toISOString() };
      
      // Update image
      if (needsImage && bestMatch.fields.Image_url) {
        console.log(`   📤 Uploading image...`);
        const uploadedUrl = await uploadImageToSupabase(
          bestMatch.fields.Image_url, 
          supabaseProduct.sku, 
          brandConfig.name
        );
        
        if (uploadedUrl) {
          updates.image_url = uploadedUrl;
          console.log(`   ✅ Image updated`);
        }
      }
      
      // Update descriptions
      if (needsDescription) {
        console.log(`   📝 Generating descriptions...`);
        const descriptions = await generateBrandDescription(
          supabaseProduct.name, 
          brandConfig, 
          supabaseProduct.price
        );
        
        updates.short_description = descriptions.short;
        updates.description = descriptions.detailed;
        console.log(`   ✅ Descriptions generated`);
      }
      
      // Apply updates
      if (Object.keys(updates).length > 1) { // More than just updated_at
        const { error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', supabaseProduct.id);
        
        if (error) {
          console.log(`   ❌ Update failed: ${error.message}`);
        } else {
          console.log(`   ✅ Product updated successfully`);
          updated++;
        }
      }
      
      processed++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 ${brandConfig.name.toUpperCase()} SUMMARY:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${brandConfig.name}:`, error);
  }
}

// 🎯 BATCH PROCESSING FOR ALL BRANDS
async function runScalableBrandIntegration(options: {
  dryRun?: boolean;
  brands?: string[];
  maxProductsPerBrand?: number;
  priorityOnly?: boolean;
} = {}) {
  const { dryRun = true, brands, maxProductsPerBrand = 50, priorityOnly = false } = options;
  
  console.log('🚀 DOPE CITY SCALABLE BRAND INTEGRATION WORKFLOW');
  console.log('=' .repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE PROCESSING'}`);
  console.log(`Max Products Per Brand: ${maxProductsPerBrand}`);
  console.log(`Priority Only: ${priorityOnly}\n`);
  
  let brandsToProcess = BRAND_CONFIGS;
  
  // Filter by priority if requested
  if (priorityOnly) {
    brandsToProcess = brandsToProcess.filter(b => b.priority === 1);
  }
  
  // Filter by specific brands if requested
  if (brands && brands.length > 0) {
    brandsToProcess = brandsToProcess.filter(b => 
      brands.some(brand => b.name.toLowerCase().includes(brand.toLowerCase()))
    );
  }
  
  // Sort by priority
  brandsToProcess.sort((a, b) => a.priority - b.priority);
  
  console.log(`📋 Processing ${brandsToProcess.length} brands: ${brandsToProcess.map(b => b.name).join(', ')}\n`);
  
  for (const brandConfig of brandsToProcess) {
    await processBrandIntegration(brandConfig, {
      dryRun,
      maxProducts: maxProductsPerBrand,
      minMatchScore: 200,
      forceUpdate: false
    });
    
    // Delay between brands to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 SCALABLE BRAND INTEGRATION COMPLETE!');
  
  if (dryRun) {
    console.log('\n💡 To run live updates:');
    console.log('   pnpm exec tsx scripts/scalable-brand-integration-workflow.ts --live');
    console.log('   pnpm exec tsx scripts/scalable-brand-integration-workflow.ts --live --priority-only');
    console.log('   pnpm exec tsx scripts/scalable-brand-integration-workflow.ts --live --brands="Puffco,RooR"');
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--live');
const priorityOnly = args.includes('--priority-only');
const brandsArg = args.find(arg => arg.startsWith('--brands='));
const brands = brandsArg ? brandsArg.split('=')[1].split(',') : undefined;
const maxProductsArg = args.find(arg => arg.startsWith('--max-products='));
const maxProductsPerBrand = maxProductsArg ? parseInt(maxProductsArg.split('=')[1]) : 50;

runScalableBrandIntegration({
  dryRun,
  brands,
  maxProductsPerBrand,
  priorityOnly
}).catch(console.error);
