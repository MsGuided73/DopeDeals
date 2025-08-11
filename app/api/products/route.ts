import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

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
    };

    const products = await storage.getProducts(filters);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

