import { NextResponse } from 'next/server';
import { getStorage } from '../../../lib/storage';

export async function GET() {
  try {
    const storage = await getStorage();
    const brands = await storage.getBrands();
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json({ message: 'Failed to fetch brands' }, { status: 500 });
  }
}

