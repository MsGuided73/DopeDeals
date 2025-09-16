import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';

// Next 15 RouteContext expects params as a Promise in the type system
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    const storage = await getStorage();
    const product = await storage.getProduct(id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
