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

  // TODO: persist refresh_token securely (Supabase table or Secrets Manager)
  // For now, return minimal info as a placeholder
  return NextResponse.json({ ok: true, received: Object.keys(data) });
}

