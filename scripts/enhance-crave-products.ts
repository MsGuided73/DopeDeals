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

interface CraveProduct {
  id: string;
  name: string;
  sku: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  price: number;
  nicotine_product?: boolean;
  tobacco_product?: boolean;
  zoho_category_name?: string;
}

// Product categories and their descriptions
const PRODUCT_CATEGORIES = {
  'disposables': {
    keywords: ['puff', 'disposable', 'vape', 'turbo', 'max', 'mega', 'bc7000'],
    description: 'Premium disposable vaping devices'
  },
  'accessories': {
    keywords: ['battery', 'charger', 'mod', 'grinder', 'display'],
    description: 'Vaping accessories and hardware'
  },
  'glass': {
    keywords: ['hand pipe', 'pipe', 'glass'],
    description: 'Glass smoking accessories'
  },
  'cannabis': {
    keywords: ['thca', 'preroll', 'shorties', 'cart', 'resin'],
    description: 'Cannabis products and accessories'
  }
};

function categorizeProduct(product: CraveProduct): string {
  const name = product.name.toLowerCase();
  const sku = product.sku.toLowerCase();
  
  for (const [category, info] of Object.entries(PRODUCT_CATEGORIES)) {
    if (info.keywords.some(keyword => name.includes(keyword) || sku.includes(keyword))) {
      return category;
    }
  }
  return 'accessories';
}

async function generateProductDescription(product: CraveProduct): Promise<{
  short_description: string;
  description: string;
}> {
  const category = categorizeProduct(product);
  const categoryInfo = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];
  
  const prompt = `Generate product descriptions for this Crave brand product:

Product Name: ${product.name}
SKU: ${product.sku}
Price: $${product.price}
Category: ${categoryInfo.description}

Create:
1. A short description (1-2 sentences, under 100 characters)
2. A detailed description (2-3 paragraphs, marketing-focused)

Guidelines:
- Focus on quality, performance, and value
- Mention Crave brand reputation
- Include relevant technical specs if apparent from name
- Use engaging, professional language
- Avoid health claims
- Be specific about features when possible

Format as JSON:
{
  "short_description": "Brief product summary",
  "description": "Detailed marketing description with features and benefits"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error generating description for ${product.name}:`, error);
    
    // Fallback descriptions
    const category = categorizeProduct(product);
    return {
      short_description: `Premium Crave ${category === 'disposables' ? 'disposable device' : 'accessory'}`,
      description: `Experience quality and performance with this premium Crave product. Designed for reliability and satisfaction, this ${category === 'disposables' ? 'disposable vaping device' : 'accessory'} delivers consistent results. Crave is known for innovative design and superior craftsmanship in the vaping industry.`
    };
  }
}

async function enhanceCraveProducts() {
  console.log('🚀 Enhancing Crave brand products...\n');
  
  // Get clean Crave products (no nicotine)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, description, short_description, image_url, price, nicotine_product, tobacco_product, zoho_category_name')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Found ${products?.length || 0} clean Crave products\n`);
  
  let enhanced = 0;
  let skipped = 0;
  
  for (const product of products || []) {
    const needsDescription = !product.description || product.description.length < 50;
    const needsShortDescription = !product.short_description || product.short_description.length < 20;
    
    if (!needsDescription && !needsShortDescription) {
      console.log(`⏭️ Skipping ${product.name} - already has good descriptions`);
      skipped++;
      continue;
    }
    
    console.log(`🔧 Enhancing: ${product.name}`);
    
    try {
      const descriptions = await generateProductDescription(product);
      
      const updateData: any = {};
      if (needsShortDescription) {
        updateData.short_description = descriptions.short_description;
      }
      if (needsDescription) {
        updateData.description = descriptions.description;
      }
      
      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError);
        continue;
      }
      
      console.log(`✅ Enhanced ${product.name}`);
      console.log(`   Short: ${descriptions.short_description}`);
      console.log(`   Description: ${descriptions.description.substring(0, 100)}...`);
      console.log('');
      
      enhanced++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${product.name}:`, error);
    }
  }
  
  console.log('\n📈 ENHANCEMENT SUMMARY:');
  console.log(`   ✅ Products enhanced: ${enhanced}`);
  console.log(`   ⏭️ Products skipped: ${skipped}`);
  console.log(`   📦 Total processed: ${enhanced + skipped}`);
}

// Run the function
enhanceCraveProducts();
