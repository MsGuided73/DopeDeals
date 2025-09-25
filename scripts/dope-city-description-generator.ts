import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 🔥 DOPE CITY BRAND VOICE GUIDELINES
const DOPE_CITY_VOICE = {
  tone: 'Street-smart, authentic, confident, premium',
  personality: 'Cool, knowledgeable friend who knows the game',
  language: 'Urban, accessible, real talk - no corporate BS',
  values: ['Quality over quantity', 'Authentic culture', 'Premium experience', 'Community first'],
  avoid: ['Corporate jargon', 'Overly technical', 'Boring descriptions', 'Health claims'],
  include: ['Real talk', 'Quality focus', 'Lifestyle connection', 'Value proposition', 'Street credibility']
};

// 🎯 PRODUCT CATEGORY TEMPLATES
const CATEGORY_TEMPLATES = {
  glass_bongs: {
    keywords: ['bong', 'water pipe', 'beaker', 'straight tube', 'percolator'],
    voice: 'Premium glass that hits smooth and looks fire',
    focus: ['Smooth hits', 'Quality glass', 'Filtration', 'Style']
  },
  pipes: {
    keywords: ['pipe', 'spoon', 'sherlock', 'chillum', 'one hitter'],
    voice: 'Classic pieces for the real ones who appreciate simplicity',
    focus: ['Portability', 'Classic design', 'Quality materials', 'Smooth smoke']
  },
  vaporizers: {
    keywords: ['vape', 'vaporizer', 'puffco', 'peak', 'proxy', 'e-rig'],
    voice: 'Next-level tech for the modern cannabis connoisseur',
    focus: ['Technology', 'Precision', 'Flavor', 'Innovation']
  },
  accessories: {
    keywords: ['grinder', 'lighter', 'ashtray', 'storage', 'tool'],
    voice: 'Essential gear that every serious smoker needs',
    focus: ['Functionality', 'Durability', 'Convenience', 'Quality']
  },
  papers_wraps: {
    keywords: ['paper', 'wrap', 'rolling', 'hemp', 'organic'],
    voice: 'Roll it right with papers that burn clean and taste pure',
    focus: ['Clean burn', 'Natural materials', 'Smooth taste', 'Easy rolling']
  }
};

// 🏷️ BRAND-SPECIFIC VOICE ADJUSTMENTS
const BRAND_VOICES = {
  'Puffco': 'Premium tech that revolutionizes your concentrate game',
  'ROOR': 'German engineering meets cannabis culture - precision glass for serious smokers',
  'Cookies': 'West Coast culture meets premium quality - straight from the streets to your session',
  'RAW': 'Natural, unrefined, authentic - just how rolling papers should be',
  'Storz & Bickel': 'German precision engineering for the ultimate vaping experience'
};

function detectProductCategory(productName: string): string {
  const name = productName.toLowerCase();
  
  for (const [category, template] of Object.entries(CATEGORY_TEMPLATES)) {
    if (template.keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'accessories'; // Default fallback
}

function extractProductFeatures(productName: string): string[] {
  const name = productName.toLowerCase();
  const features: string[] = [];
  
  // Size extraction
  const sizeMatch = name.match(/(\d+(?:\.\d+)?)[""′]/);
  if (sizeMatch) features.push(`${sizeMatch[1]}" size`);
  
  // Material detection
  if (name.includes('borosilicate') || name.includes('glass')) features.push('premium glass');
  if (name.includes('ceramic')) features.push('ceramic construction');
  if (name.includes('titanium')) features.push('titanium grade');
  if (name.includes('quartz')) features.push('quartz quality');
  
  // Quality indicators
  if (name.includes('premium') || name.includes('professional')) features.push('premium quality');
  if (name.includes('german') || name.includes('precision')) features.push('precision engineering');
  if (name.includes('hand') && name.includes('blown')) features.push('hand-blown craftsmanship');
  
  // Functionality
  if (name.includes('percolator') || name.includes('perc')) features.push('advanced filtration');
  if (name.includes('ash catcher')) features.push('ash catching system');
  if (name.includes('ice') && name.includes('catcher')) features.push('ice cooling');
  
  return features;
}

async function generateDopeDescription(
  productName: string, 
  brand: string, 
  price: number,
  category?: string
): Promise<{ short: string; detailed: string }> {
  
  const detectedCategory = category || detectProductCategory(productName);
  const categoryTemplate = CATEGORY_TEMPLATES[detectedCategory as keyof typeof CATEGORY_TEMPLATES] || CATEGORY_TEMPLATES.accessories;
  const brandVoice = BRAND_VOICES[brand as keyof typeof BRAND_VOICES] || '';
  const features = extractProductFeatures(productName);
  
  const prompt = `Write product descriptions for DOPE CITY - a premium cannabis culture brand with an authentic, street-smart voice.

PRODUCT INFO:
Name: ${productName}
Brand: ${brand}
Price: $${price}
Category: ${detectedCategory}
Features: ${features.join(', ') || 'Quality construction'}

DOPE CITY BRAND VOICE:
- Tone: ${DOPE_CITY_VOICE.tone}
- Personality: ${DOPE_CITY_VOICE.personality}
- Language: ${DOPE_CITY_VOICE.language}
- Values: ${DOPE_CITY_VOICE.values.join(', ')}

CATEGORY VOICE: ${categoryTemplate.voice}
${brandVoice ? `BRAND VOICE: ${brandVoice}` : ''}

REQUIREMENTS:
- Use authentic, street-smart language (not corporate)
- Focus on quality, performance, and lifestyle
- Be confident and knowledgeable
- Avoid health claims and overly technical jargon
- Make it sound like advice from a cool friend who knows the game

Generate:
1. SHORT (40-60 words): Punchy description for product cards
2. DETAILED (120-180 words): Full description for product pages with bullet points for key features

Format as JSON:
{
  "short": "Brief punchy description",
  "detailed": "Longer description with **Key Features:** bullet points"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 400
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return { 
        short: parsed.short, 
        detailed: parsed.detailed 
      };
    }
  } catch (error) {
    console.error('AI generation failed:', error);
  }
  
  // Fallback to template-based generation
  return generateFallbackDescription(productName, brand, detectedCategory, features);
}

function generateFallbackDescription(
  productName: string, 
  brand: string, 
  category: string, 
  features: string[]
): { short: string; detailed: string } {
  
  const categoryTemplate = CATEGORY_TEMPLATES[category as keyof typeof CATEGORY_TEMPLATES] || CATEGORY_TEMPLATES.accessories;
  
  const short = `${brand ? brand + ' ' : ''}${productName.split(' ').slice(-3).join(' ')} - ${categoryTemplate.voice}. ${features.length > 0 ? 'Features ' + features[0] + '.' : 'Quality construction.'}`;
  
  const detailed = `Real talk - this ${brand ? brand + ' ' : ''}piece is what you need for your setup. ${categoryTemplate.voice} and built to last.

**What Makes It DOPE:**
${features.length > 0 ? features.map(f => `• **${f.charAt(0).toUpperCase() + f.slice(1)}** - Built right, performs better`).join('\n') : '• **Quality Construction** - Made to perform and built to last'}
• **Authentic Design** - Real pieces for real smokers
• **Premium Experience** - Elevate your sessions

Whether you're building your collection or upgrading your game, this piece delivers that quality experience you're looking for. This is what happens when authentic cannabis culture meets premium craftsmanship.`;

  return { short: short.slice(0, 200), detailed };
}

async function processProductDescriptions(options: {
  dryRun?: boolean;
  batchSize?: number;
  brandFilter?: string;
  maxProducts?: number;
} = {}) {
  
  const { dryRun = true, batchSize = 10, brandFilter, maxProducts = 100 } = options;
  
  console.log('🔥 DOPE CITY DESCRIPTION GENERATOR');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Batch Size: ${batchSize}`);
  console.log(`Max Products: ${maxProducts}`);
  if (brandFilter) console.log(`Brand Filter: ${brandFilter}`);
  
  try {
    // Get products needing descriptions
    let query = supabase
      .from('products')
      .select('id, name, sku, price, brand_name, short_description, description')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .or('short_description.is.null,short_description.eq.,description.is.null,description.eq.')
      .limit(maxProducts);
    
    if (brandFilter) {
      query = query.eq('brand_name', brandFilter);
    }
    
    const { data: products, error } = await query;
    
    if (error) throw error;
    
    console.log(`\n📊 Found ${products?.length || 0} products needing descriptions`);
    
    if (!products || products.length === 0) {
      console.log('✅ All products already have descriptions!');
      return;
    }
    
    let processed = 0;
    let updated = 0;
    let failed = 0;
    
    // Process in batches
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
      
      for (const product of batch) {
        try {
          console.log(`   📝 ${product.name}`);
          
          const descriptions = await generateDopeDescription(
            product.name,
            product.brand_name || '',
            parseFloat(product.price) || 0
          );
          
          if (dryRun) {
            console.log(`      Short: ${descriptions.short.slice(0, 80)}...`);
            console.log(`      Detailed: ${descriptions.detailed.slice(0, 100)}...`);
          } else {
            const { error: updateError } = await supabase
              .from('products')
              .update({
                short_description: descriptions.short,
                description: descriptions.detailed,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id);
            
            if (updateError) {
              console.log(`      ❌ Update failed: ${updateError.message}`);
              failed++;
            } else {
              console.log(`      ✅ Updated successfully`);
              updated++;
            }
          }
          
          processed++;
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.log(`      ❌ Error: ${error}`);
          failed++;
        }
      }
    }
    
    console.log(`\n📊 DOPE CITY DESCRIPTION GENERATION COMPLETE:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    
    if (dryRun) {
      console.log('\n💡 To run live updates:');
      console.log('   npx tsx scripts/dope-city-description-generator.ts --live');
      console.log('   npx tsx scripts/dope-city-description-generator.ts --live --brand="Puffco"');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--live');
const brandArg = args.find(arg => arg.startsWith('--brand='));
const brandFilter = brandArg ? brandArg.split('=')[1] : undefined;
const maxArg = args.find(arg => arg.startsWith('--max='));
const maxProducts = maxArg ? parseInt(maxArg.split('=')[1]) : 100;

processProductDescriptions({
  dryRun,
  brandFilter,
  maxProducts,
  batchSize: 5
}).catch(console.error);
