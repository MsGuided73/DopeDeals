import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 🔥 DOPE CITY BRAND VOICE & RESEARCH SYSTEM
const DOPE_CITY_RESEARCH_PROMPTS = {
  puffco: `Research Puffco products focusing on:
- Technology features (temperature control, app connectivity, heating elements)
- Build quality and materials (ceramic, glass, titanium)
- User experience and performance benefits
- Concentrate vaping advantages
- Maintenance and cleaning features`,
  
  roor: `Research ROOR glass products focusing on:
- German borosilicate glass construction
- Scientific glass design principles
- Percolation and filtration systems
- Craftsmanship and build quality
- Smoking experience and smoothness`,
  
  cookies: `Research Cookies brand products focusing on:
- West Coast cannabis culture heritage
- Berner and the brand story
- Product quality and authenticity
- Street credibility and cultural impact
- Premium positioning in cannabis market`,
  
  raw: `Research RAW rolling papers focusing on:
- Natural, unrefined materials
- Josh Kesselman and brand philosophy
- Organic hemp and sustainable practices
- Rolling experience and burn quality
- Authenticity in cannabis culture`,
  
  general_glass: `Research glass smoking accessories focusing on:
- Borosilicate vs regular glass benefits
- Percolation types and filtration benefits
- Glass thickness and durability
- Cleaning and maintenance
- Smoking experience improvements`,
  
  vaporizers: `Research vaporizer technology focusing on:
- Convection vs conduction heating
- Temperature control benefits
- Vapor quality vs combustion
- Battery life and portability
- Maintenance and longevity`,
  
  grinders: `Research herb grinders focusing on:
- Material types (aluminum, titanium, wood)
- Tooth design and grinding efficiency
- Chamber systems and kief collection
- Build quality and durability
- User experience and ease of use`
};

// 🎯 PRODUCT RESEARCH FUNCTION
async function researchProduct(productName: string, brand: string): Promise<string> {
  const brandLower = brand.toLowerCase();
  const productLower = productName.toLowerCase();
  
  let researchPrompt = '';
  
  // Select appropriate research prompt
  if (brandLower.includes('puffco')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.puffco;
  } else if (brandLower.includes('roor')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.roor;
  } else if (brandLower.includes('cookies')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.cookies;
  } else if (brandLower.includes('raw')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.raw;
  } else if (productLower.includes('vape') || productLower.includes('vaporizer')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.vaporizers;
  } else if (productLower.includes('grinder')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.grinders;
  } else if (productLower.includes('glass') || productLower.includes('bong') || productLower.includes('pipe')) {
    researchPrompt = DOPE_CITY_RESEARCH_PROMPTS.general_glass;
  } else {
    researchPrompt = `Research ${brand} ${productName} focusing on key features, benefits, materials, and user experience.`;
  }
  
  const fullPrompt = `You are a cannabis industry expert researching products for DOPE CITY descriptions.

Product: ${brand} ${productName}

${researchPrompt}

Based on your knowledge of cannabis products and industry standards, provide:
1. Key technical features and specifications
2. Materials and build quality details  
3. User experience benefits
4. What makes this product stand out
5. Target audience and use cases

Focus on factual, verifiable information that would help write compelling product descriptions.
Format as a concise research summary (100-150 words).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 250
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Research failed:', error);
    return '';
  }
}

// 🔥 RESEARCH-ENHANCED DESCRIPTION GENERATOR
async function generateResearchedDescription(
  productName: string,
  brand: string,
  price: number,
  sku: string
): Promise<{ short: string; detailed: string; research: string }> {
  
  // Step 1: Research the product
  console.log(`   🔍 Researching ${brand} ${productName}...`);
  const research = await researchProduct(productName, brand);
  
  // Step 2: Generate DOPE CITY descriptions based on research
  const descriptionPrompt = `Write product descriptions for DOPE CITY - a premium cannabis culture brand.

PRODUCT INFO:
Name: ${productName}
Brand: ${brand}
Price: $${price}
SKU: ${sku}

RESEARCH FINDINGS:
${research}

DOPE CITY BRAND VOICE:
- Tone: Street-smart, authentic, confident, premium
- Personality: Cool, knowledgeable friend who knows the game  
- Language: Urban, accessible, real talk - no corporate BS
- Values: Quality over quantity, authentic culture, premium experience
- Avoid: Corporate jargon, health claims, overly technical language
- Include: Real talk, quality focus, lifestyle connection, street credibility

REQUIREMENTS:
- Use the research to highlight genuine product benefits
- Write in authentic DOPE CITY voice (street-smart but premium)
- Focus on user experience and quality
- Make it sound like advice from someone who really knows
- Be confident about the product's value

Generate:
1. SHORT (45-65 words): Punchy description for product cards that highlights key benefits
2. DETAILED (150-200 words): Full description with bullet points for key features

Format as JSON:
{
  "short": "Brief punchy description focusing on main benefits",
  "detailed": "Longer description with **Key Features:** section using bullet points"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: descriptionPrompt }],
      temperature: 0.8,
      max_tokens: 450
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return { 
        short: parsed.short, 
        detailed: parsed.detailed,
        research 
      };
    }
  } catch (error) {
    console.error('Description generation failed:', error);
  }
  
  // Fallback description
  return {
    short: `${brand} ${productName} - Premium quality that delivers the experience you're looking for. Built right, performs better.`,
    detailed: `Real talk - this ${brand} piece is what you need for your setup. Quality construction meets authentic design for sessions that hit different.

**Key Features:**
• **Premium Construction** - Built to last and perform
• **Authentic Design** - Real pieces for real smokers  
• **Quality Experience** - Elevate your sessions
• **Reliable Performance** - Consistent results every time

Whether you're building your collection or upgrading your game, this piece delivers that premium experience DOPE CITY is known for.`,
    research: research || 'Standard cannabis accessory with quality construction.'
  };
}

// 🚀 MAIN PROCESSING FUNCTION
async function processResearchedDescriptions(options: {
  dryRun?: boolean;
  batchSize?: number;
  brandFilter?: string;
  maxProducts?: number;
} = {}) {
  
  const { dryRun = true, batchSize = 5, brandFilter, maxProducts = 50 } = options;
  
  console.log('🔥 DOPE CITY RESEARCH-ENHANCED DESCRIPTION GENERATOR');
  console.log('=' .repeat(70));
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
      .not('brand_name', 'is', null)
      .neq('brand_name', '')
      .limit(maxProducts);
    
    if (brandFilter) {
      query = query.eq('brand_name', brandFilter);
    }
    
    const { data: products, error } = await query;
    
    if (error) throw error;
    
    console.log(`\n📊 Found ${products?.length || 0} products needing research-enhanced descriptions`);
    
    if (!products || products.length === 0) {
      console.log('✅ No products found matching criteria!');
      return;
    }
    
    let processed = 0;
    let updated = 0;
    let failed = 0;
    
    // Process in batches with rate limiting
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
      
      for (const product of batch) {
        try {
          console.log(`\n📝 ${product.brand_name} - ${product.name}`);
          
          const result = await generateResearchedDescription(
            product.name,
            product.brand_name || '',
            parseFloat(product.price) || 0,
            product.sku || ''
          );
          
          if (dryRun) {
            console.log(`   🔍 Research: ${result.research.slice(0, 100)}...`);
            console.log(`   📝 Short: ${result.short.slice(0, 80)}...`);
            console.log(`   📄 Detailed: ${result.detailed.slice(0, 100)}...`);
          } else {
            const { error: updateError } = await supabase
              .from('products')
              .update({
                short_description: result.short,
                description: result.detailed,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id);
            
            if (updateError) {
              console.log(`   ❌ Update failed: ${updateError.message}`);
              failed++;
            } else {
              console.log(`   ✅ Updated successfully`);
              updated++;
            }
          }
          
          processed++;
          
          // Rate limiting for API calls
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.log(`   ❌ Error: ${error}`);
          failed++;
        }
      }
      
      // Batch delay
      if (i + batchSize < products.length) {
        console.log('   ⏳ Cooling down between batches...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log(`\n🎯 RESEARCH-ENHANCED DESCRIPTION GENERATION COMPLETE:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    
    if (dryRun) {
      console.log('\n💡 To run live updates:');
      console.log('   npx tsx scripts/research-enhanced-descriptions.ts --live');
      console.log('   npx tsx scripts/research-enhanced-descriptions.ts --live --brand="Puffco"');
      console.log('   npx tsx scripts/research-enhanced-descriptions.ts --live --max=20');
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
const maxProducts = maxArg ? parseInt(maxArg.split('=')[1]) : 50;

processResearchedDescriptions({
  dryRun,
  brandFilter,
  maxProducts,
  batchSize: 3 // Smaller batches for research-enhanced processing
}).catch(console.error);
