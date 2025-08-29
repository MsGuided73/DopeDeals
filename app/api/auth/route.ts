import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { type, email, password, redirectTo } = body || {};

  if (!type) return NextResponse.json({ error: 'Missing type' }, { status: 400 });

  try {
    if (type === 'signInWithPassword') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return NextResponse.json({ user: data.user, session: data.session });
    }

    if (type === 'signOut') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (type === 'signUp') {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo }});
      if (error) throw error;
      return NextResponse.json({ user: data.user });
    }

    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message || 'Auth error' }, { status: 400 });
  }
}

