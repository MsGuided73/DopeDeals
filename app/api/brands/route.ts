import { NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(brands);
    }

    const brands = await storage.getBrands();
    return NextResponse.json(brands);
  } catch (_error: any) {
    return NextResponse.json({ message: 'Failed to fetch brands' }, { status: 500 });
  }
}

