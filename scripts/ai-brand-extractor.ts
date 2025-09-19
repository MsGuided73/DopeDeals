/*
  AI Brand Extraction and Mapping
  Uses OpenAI to extract brand names from product data and create brand mappings

  Usage: pnpm tsx scripts/ai-brand-extractor.ts
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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function extractBrandsFromProducts() {
  console.log('🔍 Extracting brands from product data...\n');

  // Get sample of products from both sources
  const { data: supabaseProducts } = await supa
    .from('products')
    .select('name, description, sku, brand_name')
    .limit(100);

  const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  const airtableData = await airtableResponse.json();
  const airtableProducts = airtableData.records || [];

  // Combine product names and descriptions for analysis
  const productTexts = [
    ...supabaseProducts?.map(p => `${p.name} | ${p.description} | ${p.sku}`) || [],
    ...airtableProducts.map(p => `${p.fields.Name} | ${p.fields.SKU} | ${p.fields.Categories || ''}`)
  ];

  const prompt = `
Analyze these product names, descriptions, and SKUs to extract brand names. Look for:

1. Well-known smoking/vaping brands (ROOR, RAW, Crave, Hidden Hills, etc.)
2. Brand names that appear in multiple products
3. Brand indicators in SKUs or product codes
4. Manufacturer names

PRODUCT DATA:
${productTexts.slice(0, 50).join('\n')}

Return a JSON object with:
{
  "brands": [
    {
      "name": "Brand Name",
      "variations": ["Brand", "BRAND", "brand-name"],
      "category": "glass" | "accessories" | "disposables" | "flower" | "other",
      "confidence": number (0-100),
      "examples": ["product names where this brand appears"]
    }
  ],
  "patterns": {
    "common_prefixes": ["patterns that indicate brands"],
    "sku_patterns": ["SKU patterns that contain brand info"]
  }
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    console.log('🏷️ Extracted Brands:');
    result.brands?.forEach((brand: any, index: number) => {
      console.log(`\n${index + 1}. ${brand.name}`);
      console.log(`   Category: ${brand.category}`);
      console.log(`   Confidence: ${brand.confidence}%`);
      console.log(`   Variations: ${brand.variations.join(', ')}`);
      console.log(`   Examples: ${brand.examples.slice(0, 2).join(', ')}`);
    });

    console.log('\n📊 Patterns Found:');
    console.log('Common Prefixes:', result.patterns?.common_prefixes?.join(', '));
    console.log('SKU Patterns:', result.patterns?.sku_patterns?.join(', '));

    // Save brand mapping for future use
    const brandMapping = {
      timestamp: new Date().toISOString(),
      brands: result.brands,
      patterns: result.patterns
    };

    fs.writeFileSync('brand-mapping.json', JSON.stringify(brandMapping, null, 2));
    console.log('\n💾 Brand mapping saved to brand-mapping.json');

    return result;

  } catch (error) {
    console.error('❌ Brand extraction error:', error);
    return null;
  }
}

async function createBrandMatchingRules(brands: any[]) {
  console.log('\n🤖 Creating brand matching rules...');

  const rules = brands.map(brand => ({
    brand: brand.name,
    patterns: [
      ...brand.variations.map((v: string) => new RegExp(`\\b${v}\\b`, 'i')),
      new RegExp(`${brand.name.replace(/\s+/g, '[-_\\s]*')}`, 'i')
    ],
    category: brand.category,
    confidence: brand.confidence
  }));

  console.log(`✅ Created ${rules.length} brand matching rules`);
  return rules;
}

async function testBrandMatching() {
  console.log('\n🧪 Testing brand matching on sample products...');

  const brands = await extractBrandsFromProducts();
  if (!brands) return;

  const rules = await createBrandMatchingRules(brands.brands);

  // Test on a few products
  const testProducts = [
    "10A90 ROOR",
    "Crave 4 Piece Drum Shaped Grinder",
    "Hidden Hills Mini Mart 1G THC-A Disposable",
    "1.5G Millyz Diamond Blunt"
  ];

  testProducts.forEach(productName => {
    console.log(`\n🔍 Testing: "${productName}"`);
    
    const matches = rules.filter(rule => 
      rule.patterns.some(pattern => pattern.test(productName))
    );

    if (matches.length > 0) {
      matches.forEach(match => {
        console.log(`   ✅ Matched: ${match.brand} (${match.category}, ${match.confidence}% confidence)`);
      });
    } else {
      console.log(`   ❌ No brand matches found`);
    }
  });
}

// Run the brand extraction and testing
testBrandMatching().catch(console.error);
