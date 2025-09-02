import { NextRequest, NextResponse } from 'next/server';
import { recommend, type VibeInputs } from '@/lib/productFilters';

export async function POST(req: NextRequest) {
  try {
    const inputs = (await req.json()) as VibeInputs;
    const recs = recommend(inputs);
    return NextResponse.json(recs);
  } catch (e) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

