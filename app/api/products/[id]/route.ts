import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/server-storage';
import { prisma } from '@/lib/prisma';

// Next 15 RouteContext expects params as a Promise in the type system
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    if (process.env.PRISMA_ENABLED === 'true') {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      return NextResponse.json(product);
    }

    const storage = await getStorage();
    const product = await storage.getProduct(id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
