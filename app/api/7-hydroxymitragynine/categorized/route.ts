import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  our_price: number;
  sale_price?: number;
  image_url?: string;
  image_urls?: string[];
  sku: string;
  stock_quantity: number;
  brand_name?: string;
  category_id?: string;
  tags?: string[];
  psychoactive_profile?: any;
}

interface CategorizedProducts {
  gummies: {
    kratom: Product[];
    hydroxy: Product[];
  };
  tablets: {
    kratom: Product[];
    hydroxy: Product[];
  };
  liquid: {
    kratom: Product[];
    hydroxy: Product[];
  };
  vape: {
    kratom: Product[];
    hydroxy: Product[];
  };
}

function determineProductType(product: Product): string | null {
  const textToCheck = `${product.name} ${product.description || ''} ${product.short_description || ''} ${product.tags?.join(' ') || ''}`.toLowerCase();

  if (textToCheck.includes('gummi') || textToCheck.includes('gummy')) {
    return 'gummies';
  }
  if (textToCheck.includes('tablet') || textToCheck.includes('capsule') || textToCheck.includes('pill')) {
    return 'tablets';
  }
  if (textToCheck.includes('liquid') || textToCheck.includes('tincture') || textToCheck.includes('extract') || textToCheck.includes('shot')) {
    return 'liquid';
  }
  if (textToCheck.includes('vape') || textToCheck.includes('vapor') || textToCheck.includes('inhale')) {
    return 'vape';
  }

  return null;
}

function determineActiveIngredient(product: Product): 'kratom' | 'hydroxy' | null {
  const textToCheck = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();

  // Check psychoactive_profile first
  if (product.psychoactive_profile) {
    try {
      const profile = typeof product.psychoactive_profile === 'string'
        ? JSON.parse(product.psychoactive_profile)
        : product.psychoactive_profile;

      const hydroxyLevel = profile?.other_psychoactive?.['7_hydroxy_mitragynine'] || 0;
      const mitragynineLevel = profile?.other_psychoactive?.mitragynine || 0;

      if (hydroxyLevel > 0 && hydroxyLevel > mitragynineLevel) {
        return 'hydroxy';
      }
      if (mitragynineLevel > 0) {
        return 'kratom';
      }
    } catch (e) {
      // Continue with text-based detection
    }
  }

  // Text-based detection
  if (textToCheck.includes('7-oh') || textToCheck.includes('7-hydroxy') || textToCheck.includes('7 hydroxymitragynine')) {
    return 'hydroxy';
  }
  if (textToCheck.includes('kratom') || textToCheck.includes('mitragynine')) {
    return 'kratom';
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query products containing 7-OH, 7-Hydroxymitragynine, or kratom keywords
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        brand_name,
        category_id,
        tags,
        psychoactive_profile
      `)
      .or('name.ilike.%7-OH%,name.ilike.%7-Hydroxymitragynine%,name.ilike.%kratom%,description.ilike.%7-OH%,description.ilike.%7-Hydroxymitragynine%,description.ilike.%kratom%,short_description.ilike.%7-OH%,short_description.ilike.%7-Hydroxymitragynine%,short_description.ilike.%kratom%')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch hydroxy/kratom products', details: error.message }, { status: 500 });
    }

    // Initialize categorized structure
    const categorized: CategorizedProducts = {
      gummies: { kratom: [], hydroxy: [] },
      tablets: { kratom: [], hydroxy: [] },
      liquid: { kratom: [], hydroxy: [] },
      vape: { kratom: [], hydroxy: [] },
    };

    // Process and categorize products
    const products = (rawProducts || []).filter(product => {
      // Apply post-query filter for image validation
      const hasValidImageUrl = product.image_url &&
        product.image_url !== '' &&
        product.image_url !== 'null' &&
        product.image_url !== 'undefined' &&
        product.image_url.trim() !== '';

      const hasValidImageUrls = Array.isArray(product.image_urls) &&
        product.image_urls.length > 0;

      return hasValidImageUrl || hasValidImageUrls;
    });

    products.forEach(product => {
      const productType = determineProductType(product);
      const activeIngredient = determineActiveIngredient(product);

      if (productType && activeIngredient && categorized[productType as keyof CategorizedProducts]) {
        categorized[productType as keyof CategorizedProducts][activeIngredient].push(product);
      }
    });

    // Get total counts
    const totalProducts = products.length;
    const categorizedCount = Object.values(categorized).reduce((total, type) =>
      total + type.kratom.length + type.hydroxy.length, 0
    );

    return NextResponse.json({
      categorized,
      summary: {
        totalProducts,
        categorizedProducts: categorizedCount,
        productTypes: {
          gummies: categorized.gummies.kratom.length + categorized.gummies.hydroxy.length,
          tablets: categorized.tablets.kratom.length + categorized.tablets.hydroxy.length,
          liquid: categorized.liquid.kratom.length + categorized.liquid.hydroxy.length,
          vape: categorized.vape.kratom.length + categorized.vape.hydroxy.length,
        },
        activeIngredients: {
          kratom: Object.values(categorized).reduce((total, type) => total + type.kratom.length, 0),
          hydroxy: Object.values(categorized).reduce((total, type) => total + type.hydroxy.length, 0),
        }
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categorized products', details: String(error) }, { status: 500 });
  }
}
