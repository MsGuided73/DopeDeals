import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hasRealProductImage(imageUrl: string | null): boolean {
  if (!imageUrl) return false;
  
  const placeholderDomains = [
    'placehold.co',
    'placeholder.com',
    'via.placeholder.com',
    'unsplash.com',
    'picsum.photos',
    'lorempixel.com',
    'dummyimage.com',
    'example.com',
    'test.com'
  ];
  
  return !placeholderDomains.some(domain => imageUrl.toLowerCase().includes(domain));
}

function isValidImageUrl(imageUrl: string | null): boolean {
  if (!imageUrl) return false;
  
  // Check for common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    imageUrl.toLowerCase().includes(ext)
  );
  
  // Check for valid URL format
  const isValidUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
  
  return isValidUrl && (hasImageExtension || imageUrl.includes('images') || imageUrl.includes('media'));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Fetch products from Supabase
    const { data: allProducts, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        short_description,
        price,
        imageUrl,
        stock_quantity,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .gt('stock_quantity', 0)
      .not('imageUrl', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200); // Get more to filter from

    if (error) {
      console.error('Error fetching featured products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter for products with real, valid images
    let featuredProducts = (allProducts || [])
      .filter(product => hasRealProductImage(product.imageUrl))
      .filter(product => isValidImageUrl(product.imageUrl))
      .filter(product => product.price > 0) // Ensure valid pricing
      .slice(0, limit);

    // If we still don't have enough products, get any products with non-null images
    if (featuredProducts.length < 4) {
      const additionalProducts = (allProducts || [])
        .filter(product => product.imageUrl && product.imageUrl.trim() !== '')
        .filter(product => !featuredProducts.some(fp => fp.id === product.id))
        .filter(product => product.price > 0)
        .slice(0, Math.max(4, limit) - featuredProducts.length);

      featuredProducts = [...featuredProducts, ...additionalProducts];
    }

    // Sort by newest first
    featuredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      products: featuredProducts,
      total: featuredProducts.length
    });

  } catch (error) {
    console.error('Error in featured products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
