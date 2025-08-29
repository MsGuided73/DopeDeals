import { getSessionUser } from '@/lib/supabase-server-ssr';
import { NextResponse } from 'next/server';

export async function requireAuth(): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>> } | NextResponse> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return { user };
}

