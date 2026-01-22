import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';

// Next 15 RouteContext expects params as a Promise in the type system
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    console.log('Product API: Looking up product with ID:', id);

    const storage = await getStorage();
    const rawProduct = await storage.getProduct(id);

    if (!rawProduct) {
      console.log('Product API: Product not found for ID:', id);
      // Try to find similar products or provide helpful error
      try {
        const allProducts = await storage.getProducts();
        console.log('Product API: Total products in database:', allProducts.length);
        const sampleIds = allProducts.slice(0, 5).map(p => p.id);
        console.log('Product API: Sample product IDs:', sampleIds);
      } catch (debugError) {
        console.log('Product API: Could not get product list for debugging');
      }
      return NextResponse.json({
        message: 'Product not found',
        productId: id,
        suggestion: 'This product may have been removed or the ID may be incorrect'
      }, { status: 404 });
    }

    // Fetch variations
    let variations: any[] = [];
    try {
      variations = await storage.getProductVariations(rawProduct);
    } catch (varError) {
      console.error('Error fetching variations:', varError);
    }

    const parseImageUrls = (value?: string[] | string | null) => {
      if (!value) return [] as string[];
      if (Array.isArray(value)) {
        return value
          .flatMap((entry) => entry.split(','))
          .map((entry) => entry.trim())
          .filter(Boolean);
      }
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    };

    const normalizedImages = Array.from(new Set([
      ...parseImageUrls(rawProduct.image_urls),
      ...parseImageUrls(rawProduct.image_url)
    ]));

    // Transform raw database fields to match expected API format
    const product = {
      ...rawProduct,
      // Transform database price fields to API-friendly names
      price: parseFloat(rawProduct.our_price) || 0,
      compare_at_price: rawProduct.sale_price ? parseFloat(rawProduct.sale_price) : undefined,

      // Ensure consistent field names
      brand_id: rawProduct.brand_id,
      brand_name: rawProduct.brand_id, // Use brand_id as brand_name for consistency
      image_url: normalizedImages[0] || rawProduct.image_url,
      image_urls: normalizedImages,

      // Stock consistency
      inStock: (rawProduct.stock_quantity || 0) > 0,

      // Computed fields
      featured: Boolean(rawProduct.featured),
      isNew: rawProduct.created_at ?
        new Date(rawProduct.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : false,
      isSale: rawProduct.sale_price && parseFloat(rawProduct.sale_price) < parseFloat(rawProduct.our_price),
      
      // Include variations
      variations: variations.map((v: any) => ({
        id: v.id,
        name: v.name,
        image_url: v.image_url,
        price: parseFloat(v.our_price) || 0,
        sale_price: v.sale_price ? parseFloat(v.sale_price) : undefined,
        inStock: (v.stock_quantity || 0) > 0
      }))
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
