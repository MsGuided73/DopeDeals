import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Available ROOR images in storage
const availableImages = [
  {
    filename: 'Roor-Classic-14-Beaker-50x5mm-Black-White.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Beaker-50x5mm-Black-White.webp',
    type: 'beaker',
    size: '14',
    colors: ['black', 'white'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-14-Color-Straight-50x5mm-Mint.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Color-Straight-50x5mm-Mint.webp',
    type: 'straight',
    size: '14',
    colors: ['mint', 'color'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-14-Straight-45x5mm-Tie-Dye.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Straight-45x5mm-Tie-Dye.webp',
    type: 'straight',
    size: '14',
    colors: ['tie-dye', 'mixed'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-18-Beaker-50x5mm-Flame-Polish-2.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Flame-Polish-2.webp',
    type: 'beaker',
    size: '18',
    colors: ['clear', 'flame-polish'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-18-Beaker-50x5mm-Flame-Polish.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Flame-Polish.webp',
    type: 'beaker',
    size: '18',
    colors: ['clear', 'flame-polish'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-18-Straight-45x5mm-White-Red.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-45x5mm-White-Red.webp',
    type: 'straight',
    size: '18',
    colors: ['white', 'red', 'mixed'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-Classic-18-Straight-50x5mm-Black-White.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp',
    type: 'straight',
    size: '18',
    colors: ['black', 'white'],
    thickness: '5mm'
  },
  {
    filename: 'Roor-PD-Classic-18-Beaker-45x5mm-White-No-Ice-Pinches.webp',
    url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-PD-Classic-18-Beaker-45x5mm-White-No-Ice-Pinches.webp',
    type: 'beaker',
    size: '18',
    colors: ['white', 'clear'],
    thickness: '5mm'
  }
];

async function matchRoorImagesToProducts() {
  console.log('🎯 Matching ROOR storage images to products...\n');
  
  // Get all ROOR products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, image_url')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Found ${products?.length || 0} ROOR products to match\n`);
  
  const matches = [];
  
  for (const product of products || []) {
    const productName = product.name.toLowerCase();
    let bestMatch = null;
    let matchScore = 0;
    
    // Score each available image
    for (const image of availableImages) {
      let score = 0;
      
      // Type matching (beaker vs straight tube)
      if (productName.includes('beaker') && image.type === 'beaker') score += 10;
      if (productName.includes('straight') && image.type === 'straight') score += 10;
      
      // Size matching
      if (productName.includes(`${image.size}"`)) score += 8;
      
      // Color matching
      for (const color of image.colors) {
        if (productName.includes(color)) score += 3;
        if (productName.includes('mixed') && (color === 'tie-dye' || color === 'mixed')) score += 5;
        if (productName.includes('clear') && (color === 'clear' || color === 'flame-polish')) score += 5;
      }
      
      // Prefer different images for different products
      const alreadyUsed = matches.some(m => m.image && m.image.filename === image.filename);
      if (alreadyUsed) score -= 2;
      
      if (score > matchScore) {
        matchScore = score;
        bestMatch = image;
      }
    }
    
    matches.push({
      product,
      image: bestMatch,
      score: matchScore,
      currentImage: product.image_url
    });
  }
  
  // Sort by match score (best matches first)
  matches.sort((a, b) => b.score - a.score);
  
  console.log('🎯 PROPOSED IMAGE MATCHES:\n');
  
  let updatedCount = 0;
  
  for (const match of matches) {
    console.log(`📦 ${match.product.name}`);
    console.log(`   Current: ${match.currentImage}`);
    
    if (match.image) {
      console.log(`   Proposed: ${match.image.filename} (Score: ${match.score})`);
      console.log(`   New URL: ${match.image.url}`);
      
      // Update the product image if it's a good match (score >= 8)
      if (match.score >= 8) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: match.image.url })
          .eq('id', match.product.id);
          
        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`);
        } else {
          console.log(`   ✅ UPDATED!`);
          updatedCount++;
        }
      } else {
        console.log(`   ⏭️  Score too low, keeping current image`);
      }
    } else {
      console.log(`   ❌ No suitable match found`);
    }
    
    console.log('');
  }
  
  console.log(`🎉 Updated ${updatedCount} products with better matching images!`);
}

matchRoorImagesToProducts();
