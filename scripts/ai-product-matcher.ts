/*
  AI-Powered Product Matching System
  Uses OpenAI to intelligently match products between Supabase and Airtable
  based on brand, name, description, and contextual patterns

  Usage: pnpm tsx scripts/ai-product-matcher.ts --limit 50 --dry-run
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
import OpenAI from 'openai';

// Load environment variables from .env.local
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

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_ID!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface ProductMatch {
  supabaseProduct: any;
  airtableProduct: any;
  confidence: number;
  reasoning: string;
  matchType: 'brand' | 'name' | 'description' | 'hybrid';
}

async function getAirtableProducts() {
  console.log('📡 Fetching Airtable products...');
  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data = await response.json();
  return data.records || [];
}

async function getSupabaseProducts(limit = 100) {
  console.log('🗄️ Fetching Supabase products...');
  const { data, error } = await supa
    .from('products')
    .select('id, name, description, sku, brand_name, image_url, price')
    .limit(limit);

  if (error) throw error;
  return data || [];
}

async function analyzeProductMatch(supabaseProduct: any, airtableProduct: any): Promise<ProductMatch | null> {
  const airtableFields = airtableProduct.fields || {};
  
  const prompt = `
You are an expert product matcher for an e-commerce platform. Analyze these two products and determine if they are the same product from different sources.

SUPABASE PRODUCT:
- Name: "${supabaseProduct.name}"
- Description: "${supabaseProduct.description}"
- SKU: "${supabaseProduct.sku}"
- Brand: "${supabaseProduct.brand_name || 'Unknown'}"
- Price: $${supabaseProduct.price}

AIRTABLE PRODUCT:
- Name: "${airtableFields.Name || 'Unknown'}"
- SKU: "${airtableFields.SKU || 'Unknown'}"
- Price: $${airtableFields['Regular price'] || 'Unknown'}
- Attributes: ${JSON.stringify({
    'Attribute 1': airtableFields['Attribute 1 name'] + ': ' + airtableFields['Attribute 1 value(s)'],
    'Categories': airtableFields.Categories,
    'Tags': airtableFields.Tags
  })}

MATCHING CRITERIA:
1. Brand names may appear in product names, descriptions, or SKUs
2. Product names may be similar but not identical
3. SKUs will likely be different (added by different entities)
4. Look for brand indicators like "ROOR", "Crave", "Hidden Hills", etc.
5. Consider product type (pipe, grinder, disposable, etc.)
6. Price similarity can be a factor but not definitive

Respond with a JSON object:
{
  "isMatch": boolean,
  "confidence": number (0-100),
  "reasoning": "detailed explanation of why they match or don't match",
  "matchType": "brand" | "name" | "description" | "hybrid" | "none",
  "extractedBrand": "brand name if found in airtable product"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    if (result.isMatch && result.confidence > 60) {
      return {
        supabaseProduct,
        airtableProduct,
        confidence: result.confidence,
        reasoning: result.reasoning,
        matchType: result.matchType
      };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
  }

  return null;
}

async function findMatches(dryRun = true, limit = 50) {
  console.log('🤖 Starting AI-powered product matching...\n');
  
  const [supabaseProducts, airtableProducts] = await Promise.all([
    getSupabaseProducts(limit),
    getAirtableProducts()
  ]);

  console.log(`📊 Analyzing ${supabaseProducts.length} Supabase products against ${airtableProducts.length} Airtable products\n`);

  const matches: ProductMatch[] = [];
  let analyzed = 0;

  for (const supabaseProduct of supabaseProducts) {
    // Skip products that already have images
    if (supabaseProduct.image_url) continue;

    console.log(`🔍 Analyzing: "${supabaseProduct.name.substring(0, 50)}..."`);

    for (const airtableProduct of airtableProducts) {
      const airtableFields = airtableProduct.fields || {};
      
      // Skip if no image in Airtable
      if (!airtableFields.Images) continue;

      const match = await analyzeProductMatch(supabaseProduct, airtableProduct);
      
      if (match) {
        matches.push(match);
        console.log(`✅ MATCH FOUND! Confidence: ${match.confidence}%`);
        console.log(`   Reasoning: ${match.reasoning}\n`);
        break; // Found a match, move to next Supabase product
      }
    }

    analyzed++;
    if (analyzed % 10 === 0) {
      console.log(`📈 Progress: ${analyzed}/${supabaseProducts.length} products analyzed\n`);
    }
  }

  console.log(`\n🎉 Analysis Complete!`);
  console.log(`✅ Found ${matches.length} potential matches`);
  console.log(`📊 Success rate: ${((matches.length / analyzed) * 100).toFixed(1)}%\n`);

  // Display matches
  matches.forEach((match, index) => {
    console.log(`\n--- MATCH ${index + 1} ---`);
    console.log(`Supabase: "${match.supabaseProduct.name}"`);
    console.log(`Airtable: "${match.airtableProduct.fields.Name}"`);
    console.log(`Confidence: ${match.confidence}%`);
    console.log(`Match Type: ${match.matchType}`);
    console.log(`Image: ${match.airtableProduct.fields.Images}`);
    console.log(`Reasoning: ${match.reasoning}`);
  });

  if (!dryRun && matches.length > 0) {
    console.log('\n🚀 Applying matches to database...');
    
    for (const match of matches) {
      const { error } = await supa
        .from('products')
        .update({
          image_url: match.airtableProduct.fields.Images,
          airtable_record_id: match.airtableProduct.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', match.supabaseProduct.id);

      if (error) {
        console.error(`❌ Error updating ${match.supabaseProduct.name}:`, error);
      } else {
        console.log(`✅ Updated: ${match.supabaseProduct.name}`);
      }
    }
  }

  return matches;
}

// Parse command line arguments
const args = process.argv.slice(2);
const limit = parseInt(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '50');
const dryRun = !args.includes('--apply');

console.log(`🎯 Running AI Product Matcher`);
console.log(`   Limit: ${limit} products`);
console.log(`   Mode: ${dryRun ? 'DRY RUN (preview only)' : 'APPLY CHANGES'}\n`);

findMatches(dryRun, limit).catch(console.error);
