/*
  Quick Brand-Based Product Matcher
  Fast matching based on brand patterns and keywords

  Usage: pnpm tsx scripts/quick-brand-matcher.ts
*/

// Suppress punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return; // Ignore punycode warnings
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

// Brand patterns from our analysis
const brandPatterns = [
  { name: 'ROOR', pattern: /\bROOR\b/i, category: 'glass' },
  { name: 'Crave', pattern: /\bCRAVE\b/i, category: 'accessories' },
  { name: 'Hidden Hills', pattern: /\bHIDDEN\s*HILLS\b/i, category: 'disposables' },
  { name: 'Millyz Diamond', pattern: /\bMILLYZ\s*DIAMOND\b/i, category: 'flower' },
  { name: '21 Cannabis', pattern: /\b21\s*CANNABIS\b/i, category: 'flower' },
  { name: 'Backwoods', pattern: /\bBACKWOODS\b/i, category: 'accessories' },
  { name: 'Bar Juice', pattern: /\bBAR\s*JUICE\b/i, category: 'disposables' },
  { name: 'Airis', pattern: /\bAIRIS\b/i, category: 'disposables' }
];

// Product type patterns
const typePatterns = [
  { type: 'pipe', pattern: /\b(pipe|water\s*pipe|beaker|bong)\b/i },
  { type: 'grinder', pattern: /\b(grinder|herb\s*grinder)\b/i },
  { type: 'disposable', pattern: /\b(disposable|vape|cart|puff)\b/i },
  { type: 'blunt', pattern: /\b(blunt|pre.*roll|joint)\b/i },
  { type: 'glass', pattern: /\b(glass|borosilicate)\b/i }
];

async function getAirtableProducts() {
  const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data.records || [];
}

function extractBrand(text: string): string | null {
  for (const brand of brandPatterns) {
    if (brand.pattern.test(text)) {
      return brand.name;
    }
  }
  return null;
}

function extractType(text: string): string | null {
  for (const type of typePatterns) {
    if (type.pattern.test(text)) {
      return type.type;
    }
  }
  return null;
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word1 of words1) {
    if (word1.length > 2 && words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
}

async function quickMatch() {
  console.log('🚀 Quick Brand-Based Product Matching\n');

  const [supabaseProducts, airtableProducts] = await Promise.all([
    supa.from('products').select('id, name, description, sku, brand_name, image_url, price').is('image_url', null).limit(50),
    getAirtableProducts()
  ]);

  const products = supabaseProducts.data || [];
  console.log(`📊 Analyzing ${products.length} products without images\n`);

  const matches = [];

  for (const product of products) {
    const productText = `${product.name} ${product.description} ${product.sku}`;
    const productBrand = extractBrand(productText);
    const productType = extractType(productText);

    console.log(`🔍 ${product.name.substring(0, 50)}...`);
    console.log(`   Brand: ${productBrand || 'Unknown'} | Type: ${productType || 'Unknown'}`);

    let bestMatch = null;
    let bestScore = 0;

    for (const airtableProduct of airtableProducts) {
      const fields = airtableProduct.fields || {};
      if (!fields.Images) continue;

      const airtableText = `${fields.Name} ${fields.SKU} ${fields.Categories || ''}`;
      const airtableBrand = extractBrand(airtableText);
      const airtableType = extractType(airtableText);

      let score = 0;

      // Brand match (highest priority)
      if (productBrand && airtableBrand && productBrand === airtableBrand) {
        score += 50;
      }

      // Type match
      if (productType && airtableType && productType === airtableType) {
        score += 20;
      }

      // Name similarity
      const nameSimilarity = calculateSimilarity(product.name, fields.Name || '');
      score += nameSimilarity * 30;

      if (score > bestScore && score > 40) {
        bestScore = score;
        bestMatch = {
          airtableProduct,
          score,
          reasoning: `Brand: ${productBrand} → ${airtableBrand}, Type: ${productType} → ${airtableType}, Name similarity: ${(nameSimilarity * 100).toFixed(1)}%`
        };
      }
    }

    if (bestMatch) {
      matches.push({
        supabaseProduct: product,
        airtableProduct: bestMatch.airtableProduct,
        score: bestMatch.score,
        reasoning: bestMatch.reasoning
      });

      console.log(`   ✅ MATCH! Score: ${bestMatch.score.toFixed(1)}`);
      console.log(`   → ${bestMatch.airtableProduct.fields.Name}`);
      console.log(`   → ${bestMatch.reasoning}\n`);
    } else {
      console.log(`   ❌ No matches found\n`);
    }
  }

  console.log(`\n🎉 Found ${matches.length} matches!`);

  // Show top matches
  matches.sort((a, b) => b.score - a.score);
  
  console.log('\n🏆 TOP MATCHES:');
  matches.slice(0, 10).forEach((match, index) => {
    console.log(`\n${index + 1}. ${match.supabaseProduct.name}`);
    console.log(`   → ${match.airtableProduct.fields.Name}`);
    console.log(`   Score: ${match.score.toFixed(1)} | ${match.reasoning}`);
    console.log(`   Image: ${match.airtableProduct.fields.Images}`);
  });

  // Save results
  fs.writeFileSync('quick-matches.json', JSON.stringify(matches, null, 2));
  console.log(`\n💾 Results saved to quick-matches.json`);

  return matches;
}

quickMatch().catch(console.error);
