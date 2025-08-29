import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const hasCreds = !!process.env.SHIPSTATION_API_KEY && !!process.env.SHIPSTATION_API_SECRET;
  if (!hasCreds) {
    return NextResponse.json({ status: 'disabled', message: 'ShipStation credentials not configured' }, { status: 503 });
  }
  return NextResponse.json({ status: 'uninitialized', message: 'ShipStation services scaffolded; enable full integration in migration phases' });
}

