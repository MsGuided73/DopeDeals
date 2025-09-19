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
  description?: string;
}

async function generateRoorDescriptions() {
  console.log('🏺 Generating ROOR product descriptions...\n');
  
  // Get ROOR products missing descriptions
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, price, short_description, description')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Found ${products?.length || 0} ROOR products\n`);
  
  const productsNeedingDescriptions = products?.filter(p => 
    !p.description || p.description.trim().length < 50 ||
    !p.short_description || p.short_description.trim().length < 20
  ) || [];
  
  console.log(`🔧 ${productsNeedingDescriptions.length} products need descriptions\n`);
  
  for (let i = 0; i < productsNeedingDescriptions.length; i++) {
    const product = productsNeedingDescriptions[i];
    console.log(`\n${i + 1}/${productsNeedingDescriptions.length}: ${product.name}`);
    
    try {
      const prompt = `Create professional product descriptions for this ROOR glass product:

Product Name: ${product.name}
SKU: ${product.sku}
Price: $${product.price}

ROOR is a premium German glass company known for:
- Scientific borosilicate glass construction
- Precision engineering and craftsmanship
- Iconic straight tubes, beakers, and ash catchers
- Superior smoke filtration and cooling
- Collector-quality pieces with lifetime durability

Generate:
1. SHORT_DESCRIPTION (30-50 words): Concise product highlight for product cards
2. LONG_DESCRIPTION (100-150 words): Detailed description for product pages

Focus on:
- German engineering and quality
- Glass thickness and durability
- Functionality and performance
- Collector appeal
- Professional tone suitable for premium glass market

Format as JSON:
{
  "short_description": "...",
  "long_description": "..."
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.log('❌ No response from OpenAI');
        continue;
      }
      
      let descriptions;
      try {
        descriptions = JSON.parse(content);
      } catch (parseError) {
        console.log('❌ Failed to parse JSON response');
        continue;
      }
      
      // Update the product in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({
          short_description: descriptions.short_description,
          description: descriptions.long_description
        })
        .eq('id', product.id);
        
      if (updateError) {
        console.log('❌ Failed to update product:', updateError.message);
        continue;
      }
      
      console.log('✅ Updated descriptions');
      console.log(`   Short: ${descriptions.short_description.substring(0, 60)}...`);
      console.log(`   Long: ${descriptions.long_description.substring(0, 80)}...`);
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log('❌ Error generating description:', error);
      continue;
    }
  }
  
  console.log('\n🎉 ROOR description generation complete!');
}

generateRoorDescriptions();
