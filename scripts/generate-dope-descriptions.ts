import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// DOPE CITY Brand Voice Guidelines
const BRAND_VOICE = {
  tone: 'Street-smart, authentic, confident',
  language: 'Urban, accessible, no pretentious jargon',
  personality: 'Cool, knowledgeable friend who knows the game',
  avoid: ['corporate speak', 'overly technical', 'boring descriptions'],
  include: ['real talk', 'quality focus', 'lifestyle connection', 'value proposition']
};

// Product description templates in DOPE CITY voice
const DESCRIPTION_TEMPLATES = {
  puffco_peak_pro: {
    short: "The Peak Pro V2 is straight fire - premium dabbing tech that hits different every time.",
    detailed: `Real talk - the Puffco Peak Pro V2 is the gold standard for concentrate enthusiasts who demand nothing but the best. This isn't just another e-rig; it's a precision-engineered masterpiece that delivers consistent, flavorful hits every single time.

**What Makes It DOPE:**
• **Smart Temperature Control** - Dial in your perfect temp and let the Peak Pro handle the rest
• **Premium Materials** - Built with quality components that last and perform
• **App Connectivity** - Fine-tune your sessions with smartphone precision
• **Lightning Fast Heat-Up** - No waiting around - ready when you are
• **Easy Maintenance** - Keep it clean, keep it hitting smooth

Whether you're a seasoned concentrate connoisseur or stepping up your game, the Peak Pro delivers that premium experience you've been looking for. This is what happens when cutting-edge technology meets authentic cannabis culture.

*At DOPE CITY, we only stock products that we'd use ourselves. The Peak Pro earned its spot in our collection.*`
  },
  
  puffco_proxy: {
    short: "Portable power that doesn't compromise - the Proxy brings premium dabbing anywhere you go.",
    detailed: `The Puffco Proxy is for those who refuse to compromise on quality, even on the move. This portable powerhouse proves that you don't need to sacrifice performance for portability.

**Why the Proxy Hits Different:**
• **True Portability** - Pocket-friendly without the pocket-sized performance
• **Modular Design** - Works with various glass attachments for custom setups
• **Consistent Performance** - Same quality hits whether you're home or on the road
• **Discreet Operation** - Keep it low-key while keeping it high-quality
• **Quick Sessions** - Perfect for when you need quality fast

The Proxy isn't trying to be everything to everyone - it's focused on doing one thing exceptionally well: delivering premium concentrate experiences wherever life takes you.

*DOPE CITY Approved: We test everything we sell, and the Proxy passed with flying colors.*`
  },
  
  puffco_chamber: {
    short: "Keep your sessions fresh with genuine Puffco chambers - because quality matters.",
    detailed: `Don't sleep on the importance of fresh chambers. These genuine Puffco replacement chambers are the difference between okay sessions and exceptional ones.

**Real Talk About Chambers:**
• **Authentic Puffco Quality** - No knockoffs, no compromises
• **Optimal Performance** - Fresh chambers = better flavor and vapor production
• **Easy Replacement** - Swap out in seconds, back to perfect hits
• **Value Pack** - Stock up and save, because you'll want backups
• **Universal Compatibility** - Works with your Peak Pro setup seamlessly

Think of chambers like fresh kicks - you could rock the beat-up ones, but why would you when you can step fresh? Keep your setup running at peak performance with genuine replacement chambers.

*Pro Tip: Rotate chambers regularly to keep every session tasting like the first.*`
  },
  
  puffco_accessories: {
    short: "Level up your Puffco game with premium accessories that make a real difference.",
    detailed: `Your Puffco setup is only as strong as its weakest link. These premium accessories aren't just add-ons - they're upgrades that transform your entire experience.

**What's in the Game:**
• **Travel-Ready Design** - Built for the lifestyle, not just the living room
• **Premium Materials** - Quality you can see, feel, and taste
• **Perfect Compatibility** - Designed specifically for your Puffco setup
• **Enhanced Functionality** - Not just different, actually better
• **Durable Construction** - Built to handle real-world use

Whether you're upgrading your home setup or building the perfect travel kit, these accessories bring that next-level functionality that separates the casual users from the connoisseurs.

*DOPE CITY Standard: If it doesn't make your experience better, we don't stock it.*`
  }
};

function generateDopeDescription(productName: string, productType: string): { short: string; detailed: string } {
  const name = productName.toLowerCase();
  
  // Determine product category and generate appropriate description
  if (name.includes('peak pro') && !name.includes('chamber') && !name.includes('travel')) {
    return DESCRIPTION_TEMPLATES.puffco_peak_pro;
  }
  
  if (name.includes('proxy') && !name.includes('chamber')) {
    return DESCRIPTION_TEMPLATES.puffco_proxy;
  }
  
  if (name.includes('chamber')) {
    return DESCRIPTION_TEMPLATES.puffco_chamber;
  }
  
  // Default to accessories template
  return DESCRIPTION_TEMPLATES.puffco_accessories;
}

async function generateDescriptionsForPuffcoProducts(dryRun: boolean = true) {
  console.log('🔥 GENERATING DOPE CITY BRAND DESCRIPTIONS');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Brand Voice: ${BRAND_VOICE.tone}`);
  
  try {
    // Get Puffco products that need better descriptions
    console.log('\n📥 Fetching Puffco products needing descriptions...');
    
    const { data: puffcoProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, sku, description, description_md, short_description, brand_name')
      .eq('brand_name', 'Puffco')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (fetchError) {
      throw new Error(`Error fetching Puffco products: ${fetchError.message}`);
    }

    console.log(`✅ Found ${puffcoProducts?.length || 0} Puffco products`);

    if (!puffcoProducts || puffcoProducts.length === 0) {
      console.log('❌ No Puffco products found');
      return;
    }

    // Filter products that need description updates
    const needsUpdate = puffcoProducts.filter(product => {
      const hasShortDesc = product.short_description && product.short_description.length > 20;
      const hasDetailedDesc = product.description_md && product.description_md.length > 100;
      return !hasShortDesc || !hasDetailedDesc;
    });

    console.log(`\n🎯 Products needing DOPE descriptions: ${needsUpdate.length}`);

    if (needsUpdate.length === 0) {
      console.log('✅ All Puffco products already have quality descriptions!');
      return;
    }

    // Generate and apply descriptions
    console.log(`\n${dryRun ? '📋 PREVIEW' : '🔄 APPLYING'} DOPE CITY DESCRIPTIONS:`);
    
    let updated = 0;
    let failed = 0;

    for (const product of needsUpdate) {
      try {
        const { short, detailed } = generateDopeDescription(product.name, 'puffco');
        
        console.log(`\n${dryRun ? '📝' : '✅'} ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        
        if (!product.short_description || product.short_description.length < 20) {
          console.log(`   📝 Short: "${short.substring(0, 80)}..."`);
        }
        
        if (!product.description_md || product.description_md.length < 100) {
          console.log(`   📖 Detailed: "${detailed.substring(0, 100)}..."`);
        }

        if (!dryRun) {
          const updateData: any = {
            updated_at: new Date().toISOString()
          };

          // Add short description if needed
          if (!product.short_description || product.short_description.length < 20) {
            updateData.short_description = short;
          }

          // Add detailed description if needed
          if (!product.description_md || product.description_md.length < 100) {
            updateData.description_md = detailed;
            updateData.description = detailed; // Also update regular description field
          }

          const { error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', product.id);

          if (updateError) {
            console.error(`❌ Failed to update ${product.name}:`, updateError.message);
            failed++;
          } else {
            updated++;
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing ${product.name}:`, error);
        failed++;
      }
    }

    console.log(`\n📊 DESCRIPTION GENERATION RESULTS:`);
    if (dryRun) {
      console.log(`   📝 Products ready for DOPE descriptions: ${needsUpdate.length}`);
      console.log(`   🎯 Brand voice: ${BRAND_VOICE.tone}`);
      console.log(`   💡 Run with --apply to update products`);
    } else {
      console.log(`   ✅ Successfully updated: ${updated}`);
      console.log(`   ❌ Failed to update: ${failed}`);
      console.log(`   📈 Success rate: ${updated > 0 ? ((updated / (updated + failed)) * 100).toFixed(1) : 0}%`);
    }

    // Show brand voice summary
    console.log(`\n🔥 DOPE CITY BRAND VOICE APPLIED:`);
    console.log(`   • Tone: ${BRAND_VOICE.tone}`);
    console.log(`   • Language: ${BRAND_VOICE.language}`);
    console.log(`   • Personality: ${BRAND_VOICE.personality}`);
    console.log(`   • Focus: Quality, authenticity, real value`);

  } catch (error) {
    console.error('❌ Error generating DOPE descriptions:', error);
    throw error;
  }
}

// Command line interface
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

generateDescriptionsForPuffcoProducts(dryRun)
  .then(() => {
    console.log('\n🔥 DOPE CITY description generation complete!');
    if (dryRun) {
      console.log('\n💡 To apply these DOPE descriptions, run with --apply flag');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Description generation failed:', error);
    process.exit(1);
  });
