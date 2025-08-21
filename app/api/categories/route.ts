import { NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (process.env.PRISMA_ENABLED === 'true') {
      const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(categories);
    }

    const categories = await storage.getCategories();
    return NextResponse.json(categories);
  } catch (_error: any) {
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

