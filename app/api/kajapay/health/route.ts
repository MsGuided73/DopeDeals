import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const hasCreds = !!process.env.KAJAPAY_USERNAME && !!process.env.KAJAPAY_PASSWORD && !!process.env.KAJAPAY_SOURCE_KEY;
  if (!hasCreds) {
    return NextResponse.json({ status: 'disabled', message: 'KajaPay credentials not configured' }, { status: 503 });
  }
  return NextResponse.json({ status: 'uninitialized', message: 'KajaPay services scaffolded; enable full integration in migration phases' });
}

