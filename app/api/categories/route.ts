import { NextResponse } from 'next/server';
import { getStorage } from '../../../lib/storage';

export async function GET() {
  try {
    const storage = await getStorage();
    const categories = await storage.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

