// Check what products are being returned for bongs page
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBongsData() {
  console.log('🔍 Checking Bongs Page Data...\n');

  // Replicate the exact query from BongsPageContent.tsx
  const bongKeywords = [
    'BONG',
    'WATER PIPE',
    'BEAKER',
    'STRAIGHT TUBE',
    'PERCOLATOR',
    'BUBBLER',
    'RIG',
    'DAB RIG'
  ];

  const nameConditions = bongKeywords.map(keyword => `name.ilike.%${keyword}%`).join(',');
  const descConditions = bongKeywords.map(keyword => `description.ilike.%${keyword}%`).join(',');
  const combinedConditions = `${nameConditions},${descConditions}`;

  console.log('📋 Query conditions:', combinedConditions.substring(0, 200) + '...\n');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(combinedConditions)
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Found ${data.length} products\n`);

  // Show first 10 products
  console.log('📦 First 10 Products:\n');
  data.slice(0, 10).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Brand: ${product.brand_name || 'N/A'}`);
    console.log(`   Category: ${product.zoho_category_name || 'N/A'}`);
    console.log(`   Image: ${product.image_url ? '✅' : '❌'}`);
    console.log(`   Nicotine: ${product.nicotine_product ? '⚠️ YES' : '✅ NO'}`);
    console.log(`   Tobacco: ${product.tobacco_product ? '⚠️ YES' : '✅ NO'}`);
    console.log(`   Price: $${product.price}`);
    console.log('');
  });

  // Check for ZigZag papers
  const zigzag = data.find(p => p.name.toLowerCase().includes('zigzag') || p.name.toLowerCase().includes('zig zag'));
  if (zigzag) {
    console.log('⚠️ FOUND ZIGZAG PAPERS IN BONGS RESULTS!');
    console.log(`   Name: ${zigzag.name}`);
    console.log(`   Why it matched: Checking description...`);
    console.log(`   Description: ${zigzag.description?.substring(0, 200)}...`);
    console.log('');
  }

  // Analyze categories
  const categories = {};
  data.forEach(p => {
    const cat = p.zoho_category_name || 'Uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  console.log('📊 Category Breakdown:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

  // Check for nicotine products that slipped through
  const nicotineProducts = data.filter(p => p.nicotine_product === true);
  if (nicotineProducts.length > 0) {
    console.log(`\n⚠️ WARNING: ${nicotineProducts.length} nicotine products found!`);
    nicotineProducts.forEach(p => {
      console.log(`   - ${p.name}`);
    });
  }

  // Check for products without images
  const noImages = data.filter(p => !p.image_url);
  console.log(`\n📷 Products without images: ${noImages.length}/${data.length}`);
}

checkBongsData().catch(console.error);

