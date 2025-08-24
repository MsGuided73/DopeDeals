import { NextResponse } from 'next/server';
import { getStorage } from '@/lib/server-storage';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (process.env.PRISMA_ENABLED === 'true') {
      const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(categories);
    }

    const storage = await getStorage();
    const categories = await storage.getCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

