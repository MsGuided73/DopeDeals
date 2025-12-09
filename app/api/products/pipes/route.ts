import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly in development
if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(process.cwd(), '.env.local');
  config({ path: envPath });
}

// Generate brand-inspired descriptions for pipes
function generatePipeDescription(style: string, brand: string | null, size: string, material: string) {
  const brandName = brand || 'Premium Glass Artisan';
  const materialDesc = material.toLowerCase();

  // Base descriptions for each pipe style
  const descriptions = {
    'Hand Pipe': {
      short: `Classic ${brandName} hand pipe crafted from ${materialDesc} for smooth, portable sessions.`,
      full: `Experience premium smoking with this ${size.toLowerCase()} glass hand pipe from ${brandName}. Perfectly crafted from durable ${materialDesc} with optimal airflow for efficient vaporization. This exquisite piece combines traditional design with modern functionality.

**Key Features:**
• Smooth, even heat distribution
• Optimal bowl-to-mouthpiece ratio for cooling
• Ergonomic shape for comfortable handling
• Premium ${materialDesc} construction

**Perfect For:** Daily use, travel, or as a dependable companion in your smoking collection.`
    },
    'Chillum': {
      short: `${brandName}'s classic chillum design - traditional, efficient, and timeless.`,
      full: `Discover the ancient art of chillum smoking with this authentic ${brandName} piece. Handcrafted from premium ${materialDesc}, this ${size.toLowerCase()} chillum delivers pure, unfiltered experience with minimal effort.

**Pros:**
• Ultra-efficient vaporization - minimal waste
• Traditional aesthetic and spirituality
• Enhances natural flavors of your herbs
• Easy to use - just pack and draw

**Cons:**
• Steeper learning curve for optimal draws
• Less forgiving for beginners
• Can run hot if not packed properly

**Ideal For:** Sessions where purity and efficiency matter most.`
    },
    'Sherlock': {
      short: `${brandName} Sherlock pipe - the classic hammer design with legendary performance.`,
      full: `Legendary Sherlock pipe from ${brandName}, featuring the iconic hammer shape that revolutionized modern glasswork. This ${size.toLowerCase()} beauty is precision-crafted from ${materialDesc} for unmatched smoothness and durability.

**Why It's Iconic:**
• Innovative hammer design for cooling vapor
• Extended neck prevents overheating
• Signature straight-tube comfort
• Multiple carves add artistic flair

**Best For:** Those who appreciate classic American style with enhanced functionality.`
    },
    'One Hitter': {
      short: `${brandName} classic one-hitter - discrete and portable.`,
      full: `Compact and convenient ${brandName} one-hitter pipe, perfect for on-the-go smoking. Crafted from high-quality ${materialDesc} with thoughtful design that ensures optimal performance in a tiny package.

**Advantages:**
• Extremely portable - fits anywhere
• Stealth smoking option
• Fast, efficient sessions
• Consistent vaporization

**Considerations:**
• Single hit sessions
• Small bowl may need frequent packing
• Best for quick, intense experiences

**Perfect For:** Travel, discreet sessions, or when you need a quick fix without the bulk.`
    },
    'Steamroller': {
      short: `${brandName} Steamroller - curved comfort meets modern efficiency.`,
      full: `Sleek Steamroller design from ${brandName} that combines flowing curves with practical function. This ${size.toLowerCase()} pipe features beautiful wraparound geometry crafted from premium ${materialDesc}.

**Design Benefits:**
• Comfortable mouth-to-bowl angle
• Elegant flowing curves
• Excellent balance in hand
• Modern aesthetic

**Experience:** Smooth, progressive vaporization with a cooling effect that enhances every draw.`
    },
    'Gandalf': {
      short: `${brandName} Gandalf pipe - wizard-grade smoking in compact form.`,
      full: `Wizard-worthy Gandalf style from ${brandName}, offering premium performance in a compact, versatile design. Masterfully crafted from ${materialDesc} with the distinctive stem design that delivers exceptional filtration.

**Signature Features:**
• Unique stem filtration for cooling
• Compact yet powerful performance
• Balance of style and function
• Traditional yet modern feel

**For:** Sessions where you want the best of both worlds - efficiency and aesthetics.`
    },
    'Spoon Pipe': {
      short: `${brandName}'s classic spoon design - simplicity meets elegance.`,
      full: `Timeless spoon pipe from ${brandName}, featuring the beloved spoon shape that's been pleasing smokers for generations. This ${size.toLowerCase()} piece is expertly crafted from ${materialDesc} with optimal proportions for perfect hits.

**Why It Works:**
• Bowl and mouthpiece design maximize cooling
• Easy to clean and maintain
• Versatile for different herb amounts
• Timeless, recognizable design

**Ideal:** Reliable everyday smoking with consistent performance.`
    },
    'Bowl': {
      short: `${brandName} premium bowl attachment - upgrade your still or bong.`,
      full: `Premium bowl attachment from ${brandName}, designed for use with stils, bubblers, or bongs. Crafted from durable ${materialDesc} with precision engineering for superior airflow and filtration.

**Compatibility:** Works seamlessly with all standard glass fittings.

**Features:**
• Enhanced vapor chamber
• Superior herb retention
• Easy ash cleanup
• Durable construction

**Perfect Upgrade:** Take your water pipe experience to the next level.`
    }
  };

  // Default fallback for unknown styles
  const defaultDesc = {
    short: `${brandName} premium hand pipe - crafted for exceptional smoking experiences.`,
    full: `Elevate your smoking ritual with this exceptional piece from ${brandName}. Crafted from premium ${materialDesc} with expert design that delivers smooth, flavorful hits every time.

**Quality You Can Trust:**
• Professional glasswork construction
• Optimal airflow and filtration
• Beautiful, functional design
• Durable and reliable

**Experience:** The perfect balance of style, performance, and portability for discerning smokers.`
  };

  return descriptions[style as keyof typeof descriptions] || defaultDesc;
}

export async function GET(req: NextRequest) {
  try {
    // Ensure environment variables are loaded in development
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Pipes API - Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + '...',
        keyPrefix: supabaseKey?.substring(0, 20) + '...'
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Pipes API - Missing credentials:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      });
      return NextResponse.json({
        message: 'Supabase credentials not configured',
        debug: process.env.NODE_ENV === 'development' ? {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        } : undefined
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search ALL products first, then filter for pipes with images
    const { data: allProducts, error: allError } = await supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        vip_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        materials,
        featured,
        is_active,
        specs,
        attributes,
        brand_name,
        category_id,
        categories,
        category_slug,
        subcategory_slug,
        seo_keywords,
        created_at
      `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Add back when connecting to Zoho Inventory for automated product management
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%'); // Exclude sample products

    if (allError) {
      console.error('Error fetching all products:', allError);
      return NextResponse.json({
        message: 'Failed to fetch products',
        error: allError.message
      }, { status: 500 });
    }

    console.log(`🔍 Searching through ${allProducts?.length || 0} total products for pipes with images...`);

    // Filter for pipe products that have valid images
    const pipeProducts = allProducts?.filter(product => {
      // Check if it's a pipe product using category_slug (more reliable than name matching)
      const isPipeProduct = product.category_slug === 'pipes' ||
                           product.category_slug === 'hand-pipes' ||
                           product.subcategory_slug === 'pipes' ||
                           (Array.isArray(product.categories) &&
                            product.categories.some(cat =>
                              cat?.toLowerCase().includes('pipe') &&
                              !cat?.toLowerCase().includes('water') &&
                              !cat?.toLowerCase().includes('bong')
                            ));

      // Check if it has a valid image URL (strict validation)
      const hasValidImage = product.image_url &&
                           product.image_url.trim() !== '' &&
                           product.image_url.trim() !== 'NULL' &&
                           product.image_url.trim() !== 'null' &&
                           !product.image_url.includes('placehold') &&
                           !product.image_url.includes('placeholder') &&
                           !product.image_url.includes('example.com') &&
                           !product.image_url.includes('test.com') &&
                           (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) &&
                           (product.image_url.includes('.jpg') ||
                            product.image_url.includes('.jpeg') ||
                            product.image_url.includes('.png') ||
                            product.image_url.includes('.webp') ||
                            product.image_url.includes('sigdistro.com') ||
                            product.image_url.includes('supabase.co'));

      return isPipeProduct && hasValidImage;
    }) || [];

    console.log(`🎯 Found ${pipeProducts.length} pipe products with valid images!`);

    // Transform products to match our interface
    const transformedProducts = pipeProducts.map((product: any) => {
      // Determine pipe style from name
      const name = product.name.toLowerCase();
      let style = 'Hand Pipe';
      
      if (name.includes('chillum')) style = 'Chillum';
      else if (name.includes('sherlock')) style = 'Sherlock';
      else if (name.includes('one hitter') || name.includes('onehitter')) style = 'One Hitter';
      else if (name.includes('steamroller')) style = 'Steamroller';
      else if (name.includes('gandalf')) style = 'Gandalf';
      else if (name.includes('spoon')) style = 'Spoon Pipe';
      else if (name.includes('bowl')) style = 'Bowl';

      // Determine size from name or specs
      let size = 'Medium';
      if (name.includes('mini') || name.includes('small')) size = 'Small';
      else if (name.includes('large') || name.includes('big')) size = 'Large';
      else if (name.includes('xl') || name.includes('extra large')) size = 'XL';

      // Determine if it's on sale
      const isSale = product.sale_price && product.sale_price > product.our_price;
      
      // Determine if it's new (created within last 30 days)
      const isNew = product.created_at &&
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Generate brand-inspired descriptions based on pipe style
      const { full: description, short: shortDescription } = generatePipeDescription(style, product.brand_name, size, product.materials?.[0] || 'Glass');

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.our_price),
        vip_price: undefined, // fire_price column doesn't exist in main_site_products
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: product.image_url,
        image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
        brand_id: product.brand_name, // Keep for backward compatibility
        brand: product.brand_name, // Add the brand name field
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Glass',
        vip_exclusive: false, // Default to false since column doesn't exist
        featured: product.featured || false,

        is_active: product.is_active,
        description: product.description || description,
        short_description: product.short_description || shortDescription,
        specs: product.specs,
        attributes: product.attributes,

        // Computed fields
        style,
        size,
        inStock: (product.stock_quantity || 0) > 0,
        isNew,
        isSale,
        features: [
          'Premium Construction',
          'Smooth Airflow',
          'Easy to Clean',
          'Portable Design'
        ],
        tags: ['pipe', 'glass', 'smoking', style.toLowerCase().replace(' ', '-')]
      };
    }) || [];

    return NextResponse.json({
      message: 'Products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching pipe products:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
