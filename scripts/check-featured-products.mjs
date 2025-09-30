// Check what products are being returned for Featured Products section
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function hasRealProductImage(imageUrl) {
  if (!imageUrl) return false;
  
  const placeholderDomains = [
    'placehold.co',
    'placeholder.com',
    'via.placeholder.com',
    'unsplash.com',
    'picsum.photos',
    'lorempixel.com',
    'dummyimage.com',
    'fakeimg.pl'
  ];
  
  return !placeholderDomains.some(domain => imageUrl.includes(domain));
}

function isValidImageUrl(imageUrl) {
  if (!imageUrl) return false;
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const lowerUrl = imageUrl.toLowerCase();
  
  return validExtensions.some(ext => lowerUrl.includes(ext));
}

async function checkFeaturedProducts() {
  console.log('🔍 Checking Featured Products Query...\n');

  // Replicate the exact query from the API
  const { data: allProducts, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      short_description,
      price,
      image_url,
      stock_quantity,
      is_active,
      created_at
    `)
    .eq('is_active', true)
    .gt('stock_quantity', 0)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allProducts.length} products with images\n`);

  // Filter for products with real, valid images
  const featuredProducts = allProducts
    .filter(product => hasRealProductImage(product.image_url))
    .filter(product => isValidImageUrl(product.image_url))
    .filter(product => product.price > 0)
    .slice(0, 8);

  console.log(`✅ ${featuredProducts.length} products pass all filters\n`);

  console.log('📦 Featured Products (first 8):\n');
  for (let i = 0; i < Math.min(8, featuredProducts.length); i++) {
    const product = featuredProducts[i];
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Stock: ${product.stock_quantity}`);
    console.log(`   Image: ${product.image_url}`);
    
    // Test if image is accessible
    try {
      const response = await fetch(product.image_url);
      const status = response.ok ? '✅' : '❌';
      console.log(`   Status: ${status} ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   Status: ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  // Check for products using broken 'products' bucket
  const brokenProducts = featuredProducts.filter(p => 
    p.image_url.includes('/storage/v1/object/public/products/')
  );

  if (brokenProducts.length > 0) {
    console.log(`⚠️  ${brokenProducts.length} featured products using broken 'products' bucket:\n`);
    brokenProducts.forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    ${p.image_url}`);
    });
    console.log('\n💡 Run scripts/update-image-urls.sql to fix these!');
  }

  // Check for products using working 'website-images' bucket
  const workingProducts = featuredProducts.filter(p => 
    p.image_url.includes('/storage/v1/object/public/website-images/')
  );

  if (workingProducts.length > 0) {
    console.log(`\n✅ ${workingProducts.length} featured products using working 'website-images' bucket`);
  }

  // Check for external URLs
  const externalProducts = featuredProducts.filter(p => 
    !p.image_url.includes('qirbapivptotybspnbet.supabase.co')
  );

  if (externalProducts.length > 0) {
    console.log(`\n🌐 ${externalProducts.length} featured products using external URLs`);
  }
}

checkFeaturedProducts().catch(console.error);

