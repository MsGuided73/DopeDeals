import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/supabase-server-ssr';

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { user };
}
