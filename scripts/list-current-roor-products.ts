import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCurrentRoorProducts() {
  console.log('📋 CURRENT ROOR PRODUCTS ON YOUR WEBSITE');
  console.log('=' .repeat(80));
  
  try {
    // Get all RooR products from Supabase
    const { data: roorProducts, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        description,
        description_md,
        short_description,
        price,
        image_url,
        image_urls,
        brand_name,
        zoho_category_name,
        manufacturer,
        is_active,
        created_at
      `)
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .order('name');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!roorProducts || roorProducts.length === 0) {
      console.log('❌ No RooR products found on your website');
      return;
    }

    console.log(`✅ Found ${roorProducts.length} RooR products on your website\n`);

    // Display each product with detailed information
    roorProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   📦 SKU: ${product.sku || 'N/A'}`);
      console.log(`   💰 Price: $${product.price || 'N/A'}`);
      console.log(`   🏷️  Brand: ${product.brand_name || 'N/A'}`);
      console.log(`   📂 Category: ${product.zoho_category_name || 'N/A'}`);
      console.log(`   🏭 Manufacturer: ${product.manufacturer || 'N/A'}`);
      
      // Check content status
      const hasImage = !!(product.image_url || (product.image_urls && product.image_urls.length > 0));
      const hasDescription = !!(product.description_md && product.description_md.length > 50);
      const hasShortDescription = !!(product.short_description && product.short_description.length > 20);
      
      console.log(`   🖼️  Image: ${hasImage ? '✅ Has image' : '❌ Missing image'}`);
      console.log(`   📝 Description: ${hasDescription ? '✅ Has detailed description' : '❌ Missing detailed description'}`);
      console.log(`   📄 Short Desc: ${hasShortDescription ? '✅ Has short description' : '❌ Missing short description'}`);
      
      // Show current description preview if exists
      if (product.description) {
        const descPreview = product.description.substring(0, 100).replace(/\n/g, ' ');
        console.log(`   📖 Current Desc: "${descPreview}${product.description.length > 100 ? '...' : ''}"`);
      }
      
      if (product.description_md) {
        const descMdPreview = product.description_md.substring(0, 100).replace(/\n/g, ' ');
        console.log(`   📋 Markdown Desc: "${descMdPreview}${product.description_md.length > 100 ? '...' : ''}"`);
      }
      
      if (product.short_description) {
        console.log(`   📄 Short Desc: "${product.short_description}"`);
      }
      
      if (product.image_url) {
        console.log(`   🔗 Image URL: ${product.image_url}`);
      }
      
      console.log(`   🆔 Product ID: ${product.id}`);
      console.log(`   📅 Added: ${new Date(product.created_at).toLocaleDateString()}`);
      console.log(''); // Empty line for spacing
    });

    // Summary statistics
    console.log('📊 CONTENT SUMMARY:');
    console.log('=' .repeat(40));
    
    const withImages = roorProducts.filter(p => p.image_url || (p.image_urls && p.image_urls.length > 0)).length;
    const withDescriptions = roorProducts.filter(p => p.description_md && p.description_md.length > 50).length;
    const withShortDescriptions = roorProducts.filter(p => p.short_description && p.short_description.length > 20).length;
    
    console.log(`📦 Total RooR Products: ${roorProducts.length}`);
    console.log(`🖼️  Products with Images: ${withImages} (${((withImages / roorProducts.length) * 100).toFixed(1)}%)`);
    console.log(`📝 Products with Detailed Descriptions: ${withDescriptions} (${((withDescriptions / roorProducts.length) * 100).toFixed(1)}%)`);
    console.log(`📄 Products with Short Descriptions: ${withShortDescriptions} (${((withShortDescriptions / roorProducts.length) * 100).toFixed(1)}%)`);
    
    const missingImages = roorProducts.length - withImages;
    const missingDescriptions = roorProducts.length - withDescriptions;
    const missingShortDescriptions = roorProducts.length - withShortDescriptions;
    
    if (missingImages > 0 || missingDescriptions > 0 || missingShortDescriptions > 0) {
      console.log('\n🔧 NEEDS ATTENTION:');
      if (missingImages > 0) console.log(`   - ${missingImages} products need images`);
      if (missingDescriptions > 0) console.log(`   - ${missingDescriptions} products need detailed descriptions`);
      if (missingShortDescriptions > 0) console.log(`   - ${missingShortDescriptions} products need short descriptions`);
    }

    // Show products by brand/category for easier matching
    console.log('\n🏷️  PRODUCTS BY BRAND/CATEGORY:');
    console.log('=' .repeat(40));
    
    const byBrand = roorProducts.reduce((acc, product) => {
      const brand = product.brand_name || product.manufacturer || 'Unknown Brand';
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(product);
      return acc;
    }, {} as Record<string, typeof roorProducts>);
    
    Object.entries(byBrand).forEach(([brand, products]) => {
      console.log(`\n${brand} (${products.length} products):`);
      products.forEach(product => {
        console.log(`   • ${product.name} (SKU: ${product.sku || 'N/A'})`);
      });
    });

    return roorProducts;

  } catch (error) {
    console.error('❌ Error listing RooR products:', error);
    throw error;
  }
}

// Run the listing
listCurrentRoorProducts()
  .then(() => {
    console.log('\n✅ RooR product listing complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Product listing failed:', error);
    process.exit(1);
  });
