import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nicotineParam = searchParams.get('nicotine');
    const nicotine = nicotineParam === 'true' ? true : nicotineParam === 'false' ? false : undefined;

    const filters = {
      categoryId: searchParams.get('categoryId') || undefined,
      brandId: searchParams.get('brandId') || undefined,
      material: searchParams.get('material') || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin') as string) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax') as string) : undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      vipExclusive: searchParams.get('vipExclusive') === 'true' ? true : searchParams.get('vipExclusive') === 'false' ? false : undefined,
    } as const;

    const usePrisma = !!process.env.DATABASE_URL;

    if (usePrisma) {
      const where: any = {};
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.brandId) where.brandId = filters.brandId;
      if (filters.material) where.material = filters.material;
      if (filters.featured !== undefined) where.featured = filters.featured;
      if (filters.vipExclusive !== undefined) where.vipExclusive = filters.vipExclusive;
      if (nicotine !== undefined) where.nicotine = nicotine;
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.price = {};
        if (filters.priceMin !== undefined) where.price.gte = filters.priceMin;
        if (filters.priceMax !== undefined) where.price.lte = filters.priceMax;
      }

      const prismaProducts = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(prismaProducts);
    }

    // Fallback to storage implementation
    const products = await storage.getProducts(filters);

    // Apply nicotine filter at the API layer to support both schemas:
    // - Prisma Product.nicotine (boolean)
    // - Drizzle/Supabase Product.nicotineProduct (boolean)
    let result = products;
    if (nicotine !== undefined) {
      result = products.filter((p: any) => {
        const value = p.nicotine ?? p.nicotineProduct ?? false;
        return value === nicotine;
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

