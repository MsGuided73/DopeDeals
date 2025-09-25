#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductCardData() {
  console.log('🔍 Analyzing Product Card Data Population...\n');
  
  // Get total product count
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);

  console.log(`📊 Total Active Products: ${totalProducts}\n`);

  // Check key fields needed for product cards
  const keyFields = [
    'name',
    'price', 
    'image_url',
    'short_description',
    'description',
    'brand_name',
    'stock_quantity',
    'featured'
  ];

  console.log('🎯 Key Product Card Fields Analysis:');
  console.log('=' .repeat(60));

  for (const field of keyFields) {
    const { count: populatedCount } = await supabase
      .from('products')
      .select(field, { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .not(field, 'is', null)
      .neq(field, '');

    const completionRate = totalProducts ? ((populatedCount || 0) / totalProducts * 100).toFixed(1) : '0';
    const status = parseFloat(completionRate) > 80 ? '✅' : parseFloat(completionRate) > 50 ? '⚠️' : '❌';
    
    console.log(`${status} ${field.padEnd(20)} ${populatedCount?.toString().padStart(4)}/${totalProducts} (${completionRate}%)`);
  }

  console.log('\n🖼️ Image Analysis:');
  console.log('=' .repeat(40));

  // Check image quality
  const { data: productsWithImages } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('image_url', 'is', null)
    .neq('image_url', '')
    .limit(10);

  console.log(`Products with images: ${productsWithImages?.length || 0}`);
  
  if (productsWithImages && productsWithImages.length > 0) {
    console.log('\nSample image URLs:');
    productsWithImages.slice(0, 5).forEach((product, i) => {
      console.log(`${i + 1}. ${product.name}`);
      console.log(`   ${product.image_url}`);
    });
  }

  console.log('\n💰 Price Analysis:');
  console.log('=' .repeat(40));

  const { data: priceStats } = await supabase
    .from('products')
    .select('price')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('price', 'is', null)
    .order('price', { ascending: true });

  if (priceStats && priceStats.length > 0) {
    const prices = priceStats.map(p => parseFloat(p.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    console.log(`Price range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);
    console.log(`Average price: $${avgPrice.toFixed(2)}`);
  }

  console.log('\n🏷️ Brand Analysis:');
  console.log('=' .repeat(40));

  const { data: brandStats } = await supabase
    .from('products')
    .select('brand_name')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('brand_name', 'is', null)
    .neq('brand_name', '');

  if (brandStats) {
    const brandCounts: { [key: string]: number } = {};
    brandStats.forEach(product => {
      const brand = product.brand_name;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    const topBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    console.log('Top 10 brands by product count:');
    topBrands.forEach(([brand, count], i) => {
      console.log(`${(i + 1).toString().padStart(2)}. ${brand.padEnd(20)} ${count} products`);
    });
  }

  console.log('\n🎯 Recommendations for Product Card Population:');
  console.log('=' .repeat(60));
  
  const recommendations = [];
  
  if (totalProducts === 0) {
    recommendations.push('❌ CRITICAL: No active products found - run Zoho sync first');
  }
  
  const { count: noImageCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .or('image_url.is.null,image_url.eq.');
    
  if (noImageCount && noImageCount > (totalProducts || 0) * 0.5) {
    recommendations.push('🖼️ HIGH: Populate product images - over 50% missing');
  }
  
  const { count: noDescCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .or('short_description.is.null,short_description.eq.');
    
  if (noDescCount && noDescCount > (totalProducts || 0) * 0.3) {
    recommendations.push('📝 MEDIUM: Generate product descriptions - over 30% missing');
  }

  const { count: noBrandCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .or('brand_name.is.null,brand_name.eq.');
    
  if (noBrandCount && noBrandCount > (totalProducts || 0) * 0.2) {
    recommendations.push('🏷️ MEDIUM: Populate brand names - over 20% missing');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Product data looks good for card display!');
  }

  recommendations.forEach(rec => console.log(rec));
}

checkProductCardData().catch(console.error);
