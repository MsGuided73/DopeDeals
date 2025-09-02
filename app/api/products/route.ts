import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/server-storage';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      categoryId: searchParams.get('categoryId') || undefined,
      brandId: searchParams.get('brandId') || undefined,
      material: searchParams.get('material') || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin') as string) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax') as string) : undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      vipExclusive: searchParams.get('vipExclusive') === 'true' ? true : searchParams.get('vipExclusive') === 'false' ? false : undefined,
    } as const;

    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'price_asc' | 'price_desc';

    const usePrisma = process.env.PRISMA_ENABLED === 'true';
    const storage = await getStorage();

    if (usePrisma) {
      const where: Record<string, unknown> = { isActive: true, inStock: true };
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.brandId) where.brandId = filters.brandId;
      if (filters.material) where.material = filters.material;
      if (filters.featured !== undefined) where.featured = filters.featured;
      if (filters.vipExclusive !== undefined) where.vipExclusive = filters.vipExclusive;
      // Always exclude nicotine/tobacco when Prisma path is enabled
      Object.assign(where, { nicotine: false, tobacco: false });
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.price = {} as Record<string, unknown>;
        if (filters.priceMin !== undefined) (where.price as Record<string, unknown>).gte = filters.priceMin;
        if (filters.priceMax !== undefined) (where.price as Record<string, unknown>).lte = filters.priceMax;
      }

      const prismaProducts = await prisma.product.findMany({
        where: q ? {
          ...where,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        } : where,
        orderBy: sort === 'price_asc' ? { price: 'asc' } : sort === 'price_desc' ? { price: 'desc' } : { createdAt: 'desc' },
      });
      return NextResponse.json(prismaProducts);
    }

    // Supabase path: storage enforces exclusion; no extra nicotine/tobacco filtering needed here
    let products = await storage.getProducts(filters);
    if (q) {
      const qlc = q.toLowerCase();
      products = products.filter((p: any) => String(p.name || '').toLowerCase().includes(qlc) || String(p.description || '').toLowerCase().includes(qlc));
    }
    if (sort === 'price_asc') products.sort((a: any, b: any) => Number(a.price) - Number(b.price));
    else if (sort === 'price_desc') products.sort((a: any, b: any) => Number(b.price) - Number(a.price));
    else products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

