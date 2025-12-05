import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';

// Next 15 RouteContext expects params as a Promise in the type system
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    const storage = await getStorage();
    const rawProduct = await storage.getProduct(id);
    if (!rawProduct) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    // Transform raw database fields to match expected API format
    const product = {
      ...rawProduct,
      // Transform database price fields to API-friendly names
      price: parseFloat(rawProduct.our_price) || 0,
      compare_at_price: rawProduct.sale_price ? parseFloat(rawProduct.sale_price) : undefined,

      // Ensure consistent field names
      brand_id: rawProduct.brand_id,
      brand_name: rawProduct.brand_id, // Use brand_id as brand_name for consistency
      image_urls: rawProduct.image_urls || (rawProduct.image_url ? [rawProduct.image_url] : []),

      // Stock consistency
      inStock: (rawProduct.stock_quantity || 0) > 0,

      // Computed fields
      featured: Boolean(rawProduct.featured),
      isNew: rawProduct.created_at ?
        new Date(rawProduct.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : false,
      isSale: rawProduct.sale_price && parseFloat(rawProduct.sale_price) < parseFloat(rawProduct.our_price),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
