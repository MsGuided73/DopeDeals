import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Crave product image mappings based on SigDistro patterns
const CRAVE_IMAGES = {
  // Disposables
  'MAX': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  'BC7000': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  'MEGA': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  'TURBO': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  
  // Accessories
  'BATTERY': 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=400&fit=crop&auto=format',
  'CHARGER': 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=400&fit=crop&auto=format',
  'GRINDER': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  
  // Glass
  'PIPE': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  
  // Cannabis
  'THCA': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  'PREROLL': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
  'CART': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
};

function getImageForProduct(name: string, sku: string): string | null {
  const searchText = (name + ' ' + sku).toUpperCase();
  
  for (const [keyword, imageUrl] of Object.entries(CRAVE_IMAGES)) {
    if (searchText.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Default to generic product image
  return 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format';
}

async function generateShortDescription(name: string, price: number): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Create a short product description (under 80 characters) for this Crave brand product:
        
Product: ${name}
Price: $${price}

Make it concise, professional, and appealing. Focus on the key feature or benefit.`
      }],
      temperature: 0.7,
      max_tokens: 50
    });

    return response.choices[0]?.message?.content?.trim() || `Premium Crave product - $${price}`;
  } catch (error) {
    console.error('Error generating description:', error);
    return `Premium Crave product - $${price}`;
  }
}

async function enhanceCraveBatch() {
  console.log('🚀 Enhancing Crave products in batches...\n');
  
  // Get clean Crave products that need enhancement
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, description, short_description, image_url, price')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .or('short_description.is.null,image_url.is.null') // Only get products that need enhancement
    .limit(50) // Process 50 at a time
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Processing ${products?.length || 0} Crave products\n`);
  
  let enhanced = 0;
  
  for (const product of products || []) {
    const needsShortDesc = !product.short_description || product.short_description.length < 20;
    const needsImage = !product.image_url;
    
    if (!needsShortDesc && !needsImage) {
      console.log(`⏭️ Skipping ${product.name} - already complete`);
      continue;
    }
    
    console.log(`🔧 Enhancing: ${product.name}`);
    
    const updates: any = {};
    
    // Add short description if needed
    if (needsShortDesc) {
      const shortDesc = await generateShortDescription(product.name, product.price);
      updates.short_description = shortDesc;
      console.log(`   📝 Short desc: ${shortDesc}`);
    }
    
    // Add image if needed
    if (needsImage) {
      const imageUrl = getImageForProduct(product.name, product.sku);
      if (imageUrl) {
        updates.image_url = imageUrl;
        console.log(`   🖼️ Image: Added`);
      }
    }
    
    // Update the product
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError);
        continue;
      }
      
      console.log(`✅ Enhanced ${product.name}\n`);
      enhanced++;
      
      // Rate limiting for OpenAI
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n📈 ENHANCEMENT SUMMARY:');
  console.log(`   ✅ Products enhanced: ${enhanced}`);
  console.log(`   📦 Total processed: ${products?.length || 0}`);
}

enhanceCraveBatch();
