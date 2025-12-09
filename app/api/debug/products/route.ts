import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';

export async function GET(_req: NextRequest) {
  try {
    const storage = await getStorage();
    const products = await storage.getProducts();

    const summary = {
      totalProducts: products.length,
      sampleProducts: products.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        hasImage: !!p.image_url,
        isActive: p.is_active
      })),
      activeProducts: products.filter(p => p.is_active).length,
      productsWithImages: products.filter(p => p.image_url).length
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Debug products error:', error);
    return NextResponse.json({
      error: 'Failed to fetch product debug info',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
