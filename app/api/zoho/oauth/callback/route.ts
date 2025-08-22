import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const dc = 'us';

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    redirect_uri: process.env.ZOHO_REDIRECT_URI!,
  });

  const tokenUrl = `https://accounts.${dc}.zoho.com/oauth/v2/token`;
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: 'Token exchange failed', detail: text }, { status: 400 });
  }

  const data = await res.json();

  // Persist tokens in Supabase table 'zoho_tokens'
  const { access_token, refresh_token, expires_in } = data as Record<string, unknown>;
  const expires_at = new Date(Date.now() + ((expires_in as number) || 3600) * 1000).toISOString();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  const dataCenter = process.env.ZOHO_DC || 'us';

  const { error } = await supabase
    .from('zoho_tokens')
    .upsert({ org_id: orgId, refresh_token, access_token, expires_at, dc: dataCenter })
    .eq('org_id', orgId);

  if (error) {
    return NextResponse.json({ ok: false, error: 'Failed to persist token', detail: error.message }, { status: 500 });
  }

  return NextResponse.redirect('/api/zoho/health');
}

