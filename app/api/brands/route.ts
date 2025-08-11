import { NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

export async function GET() {
  try {
    const brands = await storage.getBrands();
    return NextResponse.json(brands);
  } catch (_error: any) {
    return NextResponse.json({ message: 'Failed to fetch brands' }, { status: 500 });
  }
}

