/*
  ROOR Brand Product Matcher
  Specifically matches ROOR products between Supabase and Airtable
  
  Usage: pnpm tsx scripts/roor-matcher.ts --apply
*/

// Suppress punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return;
  }
  console.warn(warning);
});

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvFile();

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// ROOR-specific patterns
const roorPatterns = {
  brand: /\bROOR\b/i,
  productTypes: [
    { name: 'beaker', pattern: /beaker/i, score: 10 },
    { name: 'straight', pattern: /straight/i, score: 8 },
    { name: 'bubble', pattern: /bubble/i, score: 10 },
    { name: 'tree', pattern: /tree/i, score: 8 },
    { name: 'perc', pattern: /(perc|percolator)/i, score: 8 },
    { name: 'arm', pattern: /arm/i, score: 6 },
    { name: 'tech', pattern: /tech/i, score: 6 },
    { name: 'base', pattern: /base/i, score: 4 }
  ],
  sizes: [
    { name: '14mm', pattern: /14\s*mm/i, score: 5 },
    { name: '18mm', pattern: /18\s*mm/i, score: 5 },
    { name: 'joint', pattern: /joint/i, score: 3 }
  ]
};

async function getRoorProducts() {
  console.log('🔍 Finding ROOR products in your database...\n');
  
  const { data, error } = await supa
    .from('products')
    .select('id, name, description, sku, brand_name, image_url, price, materials')
    .or('name.ilike.%ROOR%,description.ilike.%ROOR%,sku.ilike.%ROOR%,brand_name.ilike.%ROOR%');

  if (error) throw error;
  
  const roorProducts = (data || []).filter(product => 
    roorPatterns.brand.test(`${product.name} ${product.description} ${product.sku} ${product.brand_name || ''}`)
  );

  console.log(`✅ Found ${roorProducts.length} ROOR products in your database:`);
  roorProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} (${product.sku}) - ${product.image_url ? '🖼️ Has Image' : '❌ No Image'}`);
  });

  return roorProducts;
}

async function getRoorAirtableProducts() {
  console.log('\n🔍 Finding ROOR products in Airtable...\n');
  
  const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  const allRecords = data.records || [];
  
  const roorProducts = allRecords.filter(record => {
    const fields = record.fields || {};
    const searchText = `${fields.Name || ''} ${fields.SKU || ''} ${fields.Categories || ''}`;
    return roorPatterns.brand.test(searchText) && fields.Images;
  });

  console.log(`✅ Found ${roorProducts.length} ROOR products in Airtable:`);
  roorProducts.forEach((product, index) => {
    const fields = product.fields || {};
    console.log(`${index + 1}. ${fields.Name} (${fields.SKU}) - $${fields['Regular price']}`);
  });

  return roorProducts;
}

function calculateRoorMatch(supabaseProduct: any, airtableProduct: any): { score: number, details: string[] } {
  const fields = airtableProduct.fields || {};
  const supabaseText = `${supabaseProduct.name} ${supabaseProduct.description}`.toLowerCase();
  const airtableText = `${fields.Name || ''} ${fields.Categories || ''}`.toLowerCase();
  
  let score = 0;
  const details: string[] = [];

  // Base ROOR brand match
  if (roorPatterns.brand.test(supabaseText) && roorPatterns.brand.test(airtableText)) {
    score += 30;
    details.push('✅ ROOR brand match');
  }

  // Product type matching
  for (const type of roorPatterns.productTypes) {
    const inSupabase = type.pattern.test(supabaseText);
    const inAirtable = type.pattern.test(airtableText);
    
    if (inSupabase && inAirtable) {
      score += type.score;
      details.push(`✅ ${type.name} type match (+${type.score})`);
    }
  }

  // Size matching
  for (const size of roorPatterns.sizes) {
    const inSupabase = size.pattern.test(supabaseText);
    const inAirtable = size.pattern.test(airtableText);
    
    if (inSupabase && inAirtable) {
      score += size.score;
      details.push(`✅ ${size.name} size match (+${size.score})`);
    }
  }

  // Price similarity (if available)
  const airtablePrice = fields['Regular price'];
  if (airtablePrice && supabaseProduct.price) {
    const priceDiff = Math.abs(supabaseProduct.price - airtablePrice) / Math.max(supabaseProduct.price, airtablePrice);
    if (priceDiff < 0.3) { // Within 30%
      const priceScore = Math.round((1 - priceDiff) * 10);
      score += priceScore;
      details.push(`✅ Price similarity (+${priceScore})`);
    }
  }

  // Word overlap bonus
  const supabaseWords = supabaseText.split(/\s+/).filter(w => w.length > 3);
  const airtableWords = airtableText.split(/\s+/).filter(w => w.length > 3);
  const commonWords = supabaseWords.filter(word => 
    airtableWords.some(aWord => aWord.includes(word) || word.includes(aWord))
  );
  
  if (commonWords.length > 0) {
    const wordScore = Math.min(commonWords.length * 3, 15);
    score += wordScore;
    details.push(`✅ Common words: ${commonWords.join(', ')} (+${wordScore})`);
  }

  return { score, details };
}

async function matchRoorProducts(dryRun = true) {
  console.log('\n🤖 Starting ROOR-specific product matching...\n');
  
  const [supabaseRoor, airtableRoor] = await Promise.all([
    getRoorProducts(),
    getRoorAirtableProducts()
  ]);

  if (supabaseRoor.length === 0) {
    console.log('❌ No ROOR products found in your database');
    return [];
  }

  if (airtableRoor.length === 0) {
    console.log('❌ No ROOR products found in Airtable');
    return [];
  }

  console.log(`\n🔄 Matching ${supabaseRoor.length} Supabase ROOR products against ${airtableRoor.length} Airtable ROOR products...\n`);

  const matches = [];

  for (const supabaseProduct of supabaseRoor) {
    console.log(`🔍 Analyzing: "${supabaseProduct.name}"`);
    
    let bestMatch = null;
    let bestScore = 0;

    for (const airtableProduct of airtableRoor) {
      const matchResult = calculateRoorMatch(supabaseProduct, airtableProduct);
      
      if (matchResult.score > bestScore && matchResult.score >= 35) { // Minimum threshold
        bestScore = matchResult.score;
        bestMatch = {
          airtableProduct,
          score: matchResult.score,
          details: matchResult.details
        };
      }
    }

    if (bestMatch) {
      matches.push({
        supabaseProduct,
        airtableProduct: bestMatch.airtableProduct,
        score: bestMatch.score,
        details: bestMatch.details
      });

      console.log(`   ✅ MATCH! Score: ${bestMatch.score}`);
      console.log(`   → ${bestMatch.airtableProduct.fields.Name}`);
      console.log(`   → ${bestMatch.details.join(', ')}`);
      console.log(`   → Image: ${bestMatch.airtableProduct.fields.Images}\n`);
    } else {
      console.log(`   ❌ No strong matches found\n`);
    }
  }

  console.log(`🎉 Found ${matches.length} ROOR matches!\n`);

  // Show summary
  matches.sort((a, b) => b.score - a.score);
  console.log('🏆 ROOR MATCHES SUMMARY:');
  matches.forEach((match, index) => {
    console.log(`\n${index + 1}. ${match.supabaseProduct.name}`);
    console.log(`   → ${match.airtableProduct.fields.Name}`);
    console.log(`   Score: ${match.score} | Image: ${match.airtableProduct.fields.Images}`);
  });

  if (!dryRun && matches.length > 0) {
    console.log('\n🚀 Applying ROOR matches to database...');

    // Track which Airtable records we've already used
    const usedAirtableRecords = new Set();

    for (const match of matches) {
      // Check if this product already has an image
      const { data: currentProduct } = await supa
        .from('products')
        .select('image_url')
        .eq('id', match.supabaseProduct.id)
        .single();

      if (currentProduct?.image_url) {
        console.log(`⏭️ Skipped: ${match.supabaseProduct.name} (already has image)`);
        continue;
      }

      // Prepare update data
      const updateData: any = {
        image_url: match.airtableProduct.fields.Images,
        updated_at: new Date().toISOString()
      };

      // Only set airtable_record_id if we haven't used this record yet
      if (!usedAirtableRecords.has(match.airtableProduct.id)) {
        updateData.airtable_record_id = match.airtableProduct.id;
        usedAirtableRecords.add(match.airtableProduct.id);
      }

      const { error } = await supa
        .from('products')
        .update(updateData)
        .eq('id', match.supabaseProduct.id);

      if (error) {
        console.error(`❌ Error updating ${match.supabaseProduct.name}:`, error);
      } else {
        console.log(`✅ Updated: ${match.supabaseProduct.name}`);
      }
    }
  }

  // Save results
  fs.writeFileSync('roor-matches.json', JSON.stringify(matches, null, 2));
  console.log(`\n💾 ROOR matches saved to roor-matches.json`);

  return matches;
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

console.log(`🎯 ROOR Product Matcher`);
console.log(`   Mode: ${dryRun ? 'DRY RUN (preview only)' : 'APPLY CHANGES'}\n`);

matchRoorProducts(dryRun).catch(console.error);
