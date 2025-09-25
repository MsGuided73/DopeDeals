import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔍 ENHANCED URL-BASED MATCHING SYSTEM
// Maximizes information extraction from image_url filenames

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID!;

interface URLAnalysis {
  brand: string | null;
  productType: string | null;
  variant: string | null;
  size: string | null;
  color: string | null;
  confidence: number;
  extractedFeatures: string[];
}

// 🎯 PREMIUM BRAND PATTERNS (Puffco & RooR Focus)
const BRAND_PATTERNS = {
  puffco: {
    identifiers: ['puffco', 'peak', 'proxy', 'chamber', 'travel-glass'],
    products: {
      'peak-pro': ['peak.*pro', 'peakpro'],
      'peak': ['peak(?!.*pro)', '^peak$'],
      'proxy': ['proxy'],
      'chamber': ['chamber', '3d.*chamber'],
      'travel-glass': ['travel.*glass', 'glass.*travel'],
      'hot-knife': ['hot.*knife', 'knife']
    },
    variants: {
      'guardian': ['guardian'],
      'desert': ['desert'],
      'pearl': ['pearl'],
      'onyx': ['onyx'],
      'black': ['black'],
      'bloom': ['bloom'],
      'v2': ['v2', 'version.*2']
    }
  },
  roor: {
    identifiers: ['roor', 'beaker', 'straight.*tube', 'ash.*catcher'],
    products: {
      'beaker': ['beaker'],
      'straight-tube': ['straight.*tube', 'tube'],
      'ash-catcher': ['ash.*catcher', 'catcher']
    },
    variants: {
      'professional': ['professional', 'pro'],
      'premium': ['premium'],
      'classic': ['classic'],
      'custom': ['custom']
    },
    sizes: ['14.*inch', '16.*inch', '18.*inch', '20.*inch', '5mm', '7mm', '9mm']
  }
};

// 🔍 ANALYZE IMAGE URL FOR PRODUCT INFORMATION
function analyzeImageURL(imageUrl: string): URLAnalysis {
  const filename = imageUrl.split('/').pop()?.toLowerCase() || '';
  const urlPath = imageUrl.toLowerCase();
  
  let brand: string | null = null;
  let productType: string | null = null;
  let variant: string | null = null;
  let size: string | null = null;
  let color: string | null = null;
  let confidence = 0;
  const extractedFeatures: string[] = [];
  
  // Brand Detection
  for (const [brandName, patterns] of Object.entries(BRAND_PATTERNS)) {
    for (const identifier of patterns.identifiers) {
      const regex = new RegExp(identifier, 'i');
      if (regex.test(filename) || regex.test(urlPath)) {
        brand = brandName.charAt(0).toUpperCase() + brandName.slice(1);
        confidence += 30;
        extractedFeatures.push(`brand:${brand}`);
        break;
      }
    }
    if (brand) break;
  }
  
  // Product Type Detection (if brand found)
  if (brand && BRAND_PATTERNS[brand.toLowerCase()]) {
    const brandPatterns = BRAND_PATTERNS[brand.toLowerCase()];
    
    for (const [product, patterns] of Object.entries(brandPatterns.products)) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(filename)) {
          productType = product.replace('-', ' ');
          confidence += 25;
          extractedFeatures.push(`product:${productType}`);
          break;
        }
      }
      if (productType) break;
    }
    
    // Variant Detection
    for (const [variantName, patterns] of Object.entries(brandPatterns.variants)) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(filename)) {
          variant = variantName;
          confidence += 15;
          extractedFeatures.push(`variant:${variant}`);
          break;
        }
      }
    }
    
    // Size Detection (for RooR)
    if (brand.toLowerCase() === 'roor' && brandPatterns.sizes) {
      for (const sizePattern of brandPatterns.sizes) {
        const regex = new RegExp(sizePattern, 'i');
        const match = filename.match(regex);
        if (match) {
          size = match[0];
          confidence += 10;
          extractedFeatures.push(`size:${size}`);
          break;
        }
      }
    }
  }
  
  // Color Detection (common colors)
  const colors = ['black', 'white', 'clear', 'blue', 'red', 'green', 'purple', 'yellow', 'orange', 'pink'];
  for (const colorName of colors) {
    if (filename.includes(colorName)) {
      color = colorName;
      confidence += 5;
      extractedFeatures.push(`color:${color}`);
      break;
    }
  }
  
  return {
    brand,
    productType,
    variant,
    size,
    color,
    confidence,
    extractedFeatures
  };
}

// 🎯 ENHANCED MATCHING WITH URL ANALYSIS
function calculateEnhancedMatchScore(
  airtableProduct: any,
  supabaseProduct: any,
  urlAnalysis: URLAnalysis
): { score: number; reasons: string[]; confidence: 'HIGH' | 'MEDIUM' | 'LOW' } {
  let score = 0;
  const reasons: string[] = [];
  
  const airtableName = (airtableProduct.fields.Name || '').toLowerCase();
  const supabaseName = supabaseProduct.name.toLowerCase();
  const supabaseSKU = supabaseProduct.sku.toLowerCase();
  
  // URL Analysis Bonus (high weight for premium brands)
  if (urlAnalysis.brand && urlAnalysis.confidence > 50) {
    const brandInSupabase = supabaseName.includes(urlAnalysis.brand.toLowerCase()) ||
                           supabaseSKU.includes(urlAnalysis.brand.toLowerCase());
    
    if (brandInSupabase) {
      score += 150;
      reasons.push(`URL brand match: ${urlAnalysis.brand}`);
      
      // Product type match bonus
      if (urlAnalysis.productType && supabaseName.includes(urlAnalysis.productType.replace(' ', ''))) {
        score += 100;
        reasons.push(`Product type match: ${urlAnalysis.productType}`);
      }
      
      // Variant match bonus
      if (urlAnalysis.variant && supabaseName.includes(urlAnalysis.variant)) {
        score += 75;
        reasons.push(`Variant match: ${urlAnalysis.variant}`);
      }
      
      // Size match bonus (for RooR)
      if (urlAnalysis.size && supabaseName.includes(urlAnalysis.size.replace(/[^\d]/g, ''))) {
        score += 50;
        reasons.push(`Size match: ${urlAnalysis.size}`);
      }
    }
  }
  
  // Traditional matching (lower weight)
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
  
  // SKU partial matching (lower weight due to different formats)
  const airtableSKU = (airtableProduct.fields.SKU || '').toLowerCase();
  if (airtableSKU && supabaseSKU) {
    const skuWords = airtableSKU.split(/[-\s]+/).filter(w => w.length > 2);
    const supabaseSkuWords = supabaseSKU.split(/[-\s]+/).filter(w => w.length > 2);
    
    for (const skuWord of skuWords) {
      for (const sSkuWord of supabaseSkuWords) {
        if (skuWord === sSkuWord || skuWord.includes(sSkuWord) || sSkuWord.includes(skuWord)) {
          score += 25;
          reasons.push(`SKU component match: ${skuWord}`);
          break;
        }
      }
    }
  }
  
  // Confidence calculation
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (score >= 300 && urlAnalysis.confidence > 70) confidence = 'HIGH';
  else if (score >= 200 && urlAnalysis.confidence > 50) confidence = 'MEDIUM';
  
  return { score, reasons, confidence };
}

// 🚀 PREMIUM BRAND FOCUSED WORKFLOW
async function runPremiumBrandMatching(options: {
  dryRun?: boolean;
  targetBrand?: 'puffco' | 'roor';
  maxProducts?: number;
  minScore?: number;
} = {}) {
  const { dryRun = true, targetBrand, maxProducts = 25, minScore = 250 } = options;
  
  console.log('🎯 PREMIUM BRAND FOCUSED MATCHING');
  console.log('=' .repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Target Brand: ${targetBrand || 'All Premium Brands'}`);
  console.log(`Max Products: ${maxProducts}`);
  console.log(`Min Score: ${minScore}\n`);
  
  try {
    // Fetch Airtable products with brand filtering
    console.log('📡 Fetching Airtable products...');
    let filterFormula = `{Image_url}!=""`;
    
    if (targetBrand) {
      // Use simpler brand filtering that matches our analysis
      if (targetBrand === 'roor') {
        filterFormula = `AND(${filterFormula},OR(FIND("Roor",{Name}),FIND("ROOR",{Name}),FIND("roor",{Name})))`;
      } else if (targetBrand === 'crave') {
        filterFormula = `AND(${filterFormula},OR(FIND("Crave",{Name}),FIND("CRAVE",{Name}),FIND("crave",{Name})))`;
      }
    }
    
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?filterByFormula=${encodeURIComponent(filterFormula)}&maxRecords=100`;
    
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
    const airtableProducts = airtableData.records || [];
    
    console.log(`✅ Found ${airtableProducts.length} Airtable products`);
    
    // Analyze URLs
    console.log('🔍 Analyzing image URLs...');
    const analyzedProducts = airtableProducts.map(product => ({
      ...product,
      urlAnalysis: analyzeImageURL(product.fields.Image_url || '')
    }));
    
    // Show URL analysis results
    console.log('\n📊 URL Analysis Results:');
    analyzedProducts.forEach((product, i) => {
      if (product.urlAnalysis.confidence > 40) {
        console.log(`${i + 1}. ${product.fields.Name}`);
        console.log(`   URL: ${product.fields.Image_url}`);
        console.log(`   Analysis: ${product.urlAnalysis.extractedFeatures.join(', ')}`);
        console.log(`   Confidence: ${product.urlAnalysis.confidence}%\n`);
      }
    });
    
    // Fetch Supabase products
    console.log('🗄️ Fetching Supabase products...');
    let supabaseQuery = supabase
      .from('products')
      .select('id, sku, name, brand_name, image_url, price')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(maxProducts);
    
    if (targetBrand) {
      supabaseQuery = supabaseQuery.ilike('name', `%${targetBrand}%`);
    }
    
    const { data: supabaseProducts, error } = await supabaseQuery;
    if (error) throw error;
    
    console.log(`✅ Found ${supabaseProducts?.length || 0} Supabase products\n`);
    
    if (!supabaseProducts || supabaseProducts.length === 0) {
      console.log('No Supabase products found');
      return;
    }
    
    // Enhanced matching
    let processed = 0;
    let highConfidenceMatches = 0;
    
    for (const supabaseProduct of supabaseProducts) {
      console.log(`🔍 Processing: ${supabaseProduct.name}`);
      
      let bestMatch = null;
      let bestScore = 0;
      let bestResult = { score: 0, reasons: [], confidence: 'LOW' as const };
      
      for (const airtableProduct of analyzedProducts) {
        const matchResult = calculateEnhancedMatchScore(
          airtableProduct,
          supabaseProduct,
          airtableProduct.urlAnalysis
        );
        
        if (matchResult.score > bestScore) {
          bestMatch = airtableProduct;
          bestScore = matchResult.score;
          bestResult = matchResult;
        }
      }
      
      if (bestMatch && bestScore >= minScore) {
        console.log(`   ✅ MATCH: ${bestMatch.fields.Name}`);
        console.log(`   📊 Score: ${bestScore} (${bestResult.confidence})`);
        console.log(`   🎯 Reasons: ${bestResult.reasons.join(', ')}`);
        console.log(`   🖼️  Image: ${bestMatch.fields.Image_url}`);
        
        if (bestResult.confidence === 'HIGH') {
          highConfidenceMatches++;
        }
        
        if (!dryRun) {
          // Apply the match (implement upload logic here)
          console.log(`   🔄 Applying match...`);
        } else {
          console.log(`   🔍 DRY RUN: Would apply this match`);
        }
      } else {
        console.log(`   ❌ No suitable match (best score: ${bestScore})`);
      }
      
      console.log('');
      processed++;
    }
    
    console.log(`📊 PREMIUM BRAND MATCHING SUMMARY:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   High Confidence Matches: ${highConfidenceMatches}`);
    console.log(`   Success Rate: ${processed > 0 ? (highConfidenceMatches / processed * 100).toFixed(1) : 0}%`);
    
  } catch (error) {
    console.error('❌ Premium brand matching failed:', error);
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--live');
const brandArg = args.find(arg => arg.startsWith('--brand='));
const targetBrand = brandArg ? brandArg.split('=')[1] as 'puffco' | 'roor' : undefined;
const maxProductsArg = args.find(arg => arg.startsWith('--max-products='));
const maxProducts = maxProductsArg ? parseInt(maxProductsArg.split('=')[1]) : 25;
const minScoreArg = args.find(arg => arg.startsWith('--min-score='));
const minScore = minScoreArg ? parseInt(minScoreArg.split('=')[1]) : 250;

runPremiumBrandMatching({
  dryRun,
  targetBrand,
  maxProducts,
  minScore
}).catch(console.error);
