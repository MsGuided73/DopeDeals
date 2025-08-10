import { NextResponse } from 'next/server';

export async function GET() {
  const hasCreds = !!process.env.ZOHO_CLIENT_ID && !!process.env.ZOHO_CLIENT_SECRET && !!process.env.ZOHO_REFRESH_TOKEN && !!process.env.ZOHO_ORGANIZATION_ID;
  if (!hasCreds) {
    return NextResponse.json({ status: 'disabled', message: 'Zoho credentials not configured' }, { status: 503 });
  }
  // Placeholder: real handler will call Zoho client health once migrated
  return NextResponse.json({ status: 'uninitialized', message: 'Zoho services scaffolded; enable full integration in migration phases' });
}

