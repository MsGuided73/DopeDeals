import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  short_description?: string;
  description_md?: string;
}

async function generateRoorProductNames() {
  console.log('🏺 Generating descriptive ROOR product names...\n');
  
  // Get ROOR products with SKU-like names
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, price, short_description, description_md')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Found ${products?.length || 0} ROOR products\n`);
  
  // Filter products that need better names (SKU-like names)
  const productsNeedingNames = products?.filter(p => 
    /^[A-Z0-9\-]+/.test(p.name) && 
    (p.name.includes('MIX') || p.name.includes('-') || /^\w+\d+/.test(p.name)) &&
    !p.name.toLowerCase().includes('beaker') &&
    !p.name.toLowerCase().includes('straight') &&
    !p.name.toLowerCase().includes('zeaker')
  ) || [];
  
  console.log(`🔧 ${productsNeedingNames.length} products need descriptive names\n`);
  
  for (let i = 0; i < productsNeedingNames.length; i++) {
    const product = productsNeedingNames[i];
    console.log(`\n${i + 1}/${productsNeedingNames.length}: ${product.name}`);
    
    try {
      const prompt = `Create a descriptive product name for this ROOR glass piece:

Current Name: ${product.name}
SKU: ${product.sku}
Price: $${product.price}
Short Description: ${product.short_description || 'N/A'}

ROOR Product Categories:
- Beakers: Wide-base water pipes with beaker-style chambers
- Straight Tubes: Classic straight tube water pipes
- Ash Catchers: Filtration accessories with joint connections
- Custom Pieces: Unique artistic or specialty items

Naming Guidelines:
- Use descriptive terms like "Beaker", "Straight Tube", "Ash Catcher"
- Include size/height when possible (infer from price: $200-300 = 14-16", $300-400 = 18-20")
- Add style descriptors like "Classic", "Premium", "Professional"
- Keep "ROOR" at the end
- Make it sound premium and appealing to collectors
- Avoid technical SKU codes

Examples:
- "ROOR Classic Beaker 18\" - Clear Glass"
- "ROOR Professional Straight Tube 16\" - Mixed Colors"
- "ROOR Premium Ash Catcher 14.5mm Joint"

Generate ONE descriptive name (no quotes, no explanation):`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 100
      });
      
      const newName = response.choices[0]?.message?.content?.trim();
      if (!newName) {
        console.log('❌ No response from OpenAI');
        continue;
      }
      
      // Update the product name in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({ name: newName })
        .eq('id', product.id);
        
      if (updateError) {
        console.log('❌ Failed to update product:', updateError.message);
        continue;
      }
      
      console.log('✅ Updated name');
      console.log(`   Old: ${product.name}`);
      console.log(`   New: ${newName}`);
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log('❌ Error generating name:', error);
      continue;
    }
  }
  
  console.log('\n🎉 ROOR product name generation complete!');
  
  // Verify the results
  console.log('\n🔍 Verification - checking updated names:');
  const { data: updatedProducts } = await supabase
    .from('products')
    .select('name, sku, price')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  updatedProducts?.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
  });
}

generateRoorProductNames();
