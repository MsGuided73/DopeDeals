import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  const dc = process.env.ZOHO_DC || 'us';

  const { data: tokenRow, error } = await supabase
    .from('zoho_tokens')
    .select('*')
    .eq('org_id', orgId)
    .single();

  if (error || !tokenRow) {
    return NextResponse.json({ status: 'missing_token', detail: error?.message || 'No token stored for org' }, { status: 404 });
  }

  // Live health ping to Zoho Items API
  const accessToken = await getValidAccessToken(tokenRow.refresh_token, dc);
  const itemsUrl = `https://inventory.${dc}.zoho.com/api/v1/items?organization_id=${orgId}&page=1&per_page=1`;
  const res = await fetch(itemsUrl, {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`
    }
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ status: 'token_or_scope_error', dc, orgId, detail }, { status: 502 });
  }

  const data = await res.json();
  const sample = (data.items && data.items[0]) ? { id: data.items[0].item_id, name: data.items[0].name, sku: data.items[0].sku } : null;

  return NextResponse.json({ status: 'ok', dc, orgId, hasRefreshToken: !!tokenRow.refresh_token, expires_at: tokenRow.expires_at, sampleItem: sample });
}

async function getValidAccessToken(refreshToken: string, dc: string): Promise<string> {
  // Try to use existing (if we had it), otherwise refresh every time for simplicity
  const tokenUrl = `https://accounts.${dc}.zoho.com/oauth/v2/token`;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error(`Failed to refresh Zoho access token: ${await res.text()}`);
  }
  const json = await res.json();
  return json.access_token as string;
}

