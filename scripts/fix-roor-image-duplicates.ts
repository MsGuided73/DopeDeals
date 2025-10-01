#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Available ROOR images (based on what we know exists)
const availableImages = {
  beakers: [
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-14-Beaker-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-PD-Classic-18-Beaker-45x5mm-White-No-Ice-Pinches.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-16-Beaker-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-20-Beaker-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-PD-Classic-16-Beaker-45x5mm-White-No-Ice-Pinches.webp'
  ],
  straightTubes: [
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-14-Color-Straight-50x5mm-Mint.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-14-Straight-45x5mm-Tie-Dye.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-16-Straight-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-20-Straight-50x5mm-Black-White.webp'
  ]
};

// Product-specific image matching rules
const productImageRules = [
  {
    sku: 'ROARCUSTOMKINGPUB',
    name: 'ROOR Custom King Pub - Collector\'s Edition Masterpiece',
    price: 1437.5,
    suggestedImage: availableImages.beakers[4], // Use 20" beaker for premium collector's piece
    reason: 'Premium collector\'s piece - needs most distinctive large beaker image'
  },
  {
    sku: 'R24BK509',
    name: 'ROOR Premium Beaker 20" - Scientific Borosilicate Glass Construction',
    price: 372.5,
    suggestedImage: availableImages.beakers[3], // Use 18" beaker
    reason: '20" beaker - use 18" beaker image'
  },
  {
    sku: 'ZEAKER9MMROOR',
    name: 'ROOR Zeaker 9mm - Ultra Thick Glass Beaker',
    price: 337,
    suggestedImage: availableImages.beakers[0], // Use 14" beaker
    reason: '9mm thick - use standard 14" beaker'
  },
  {
    sku: 'L181019-MIX',
    name: 'ROOR Professional Beaker 20" - Precision Engineered Borosilicate Glass',
    price: 308,
    suggestedImage: availableImages.beakers[5], // Use 16" white beaker
    reason: 'Professional series - use clean 16" white beaker'
  },
  {
    sku: 'ZEAKER5MMROOR',
    name: 'ROOR Zeaker 5mm - Premium Thick Glass Beaker',
    price: 294,
    suggestedImage: availableImages.beakers[2], // Use 16" black beaker
    reason: '5mm thick - use 16" black beaker'
  },
  {
    sku: 'L18B19-MIX',
    name: 'ROOR Premium Beaker 18" - Mixed Colors',
    price: 308,
    suggestedImage: availableImages.beakers[3], // Use 18" beaker
    reason: '18" beaker - use matching 18" beaker image'
  },
  {
    sku: 'R24BK505-MIX',
    name: 'ROOR Professional Beaker 16" with Ash Catcher - Mixed Colors',
    price: 271.5,
    suggestedImage: availableImages.beakers[2], // Use 16" beaker
    reason: '16" beaker with ash catcher - use 16" beaker image'
  }
];

async function fixRoorImageDuplicates() {
  console.log('🔧 FIXING ROOR IMAGE DUPLICATES');
  console.log('================================================================================\n');

  try {
    // Get current ROOR products with duplicate images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, price, imageUrl, brand_name')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .order('price', { ascending: false });

    if (error) throw error;

    if (!products || products.length === 0) {
      console.log('❌ No ROOR products found');
      return;
    }

    console.log(`✅ Found ${products.length} ROOR products\n`);

    // Apply fixes
    let updatedCount = 0;
    
    for (const rule of productImageRules) {
      const product = products.find(p => p.sku === rule.sku);
      
      if (!product) {
        console.log(`⚠️  Product not found: ${rule.sku}`);
        continue;
      }

      if (product.imageUrl === rule.suggestedImage) {
        console.log(`✅ ${product.name} - Already has correct image`);
        continue;
      }

      console.log(`🔄 Updating: ${product.name}`);
      console.log(`   Current: ${product.imageUrl}`);
      console.log(`   New: ${rule.suggestedImage}`);
      console.log(`   Reason: ${rule.reason}`);

      // Update the product image
      const { error: updateError } = await supabase
        .from('products')
        .update({ imageUrl: rule.suggestedImage })
        .eq('id', product.id);

      if (updateError) {
        console.log(`❌ Failed to update ${product.name}: ${updateError.message}`);
      } else {
        console.log(`✅ Successfully updated ${product.name}`);
        updatedCount++;
      }
      console.log('');
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Products checked: ${productImageRules.length}`);
    console.log(`   Products updated: ${updatedCount}`);
    console.log(`   Products skipped: ${productImageRules.length - updatedCount}`);

    if (updatedCount > 0) {
      console.log('\n🎉 Image duplicates have been fixed!');
      console.log('   The ROOR Custom King Pub and other products now have unique images.');
      console.log('   Refresh your website to see the changes.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the fix
fixRoorImageDuplicates();
