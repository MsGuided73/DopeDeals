import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  const dc = process.env.ZOHO_DC || 'us';

  const { data: tokenRow } = await supabase
    .from('zoho_tokens')
    .select('*')
    .eq('org_id', orgId)
    .single();

  if (!tokenRow) return NextResponse.json({ error: 'No token' }, { status: 404 });

  // Fetch a page of items from Zoho
  const accessToken = await getValidAccessToken(tokenRow.refresh_token, dc);
  const url = new URL(`https://inventory.${dc}.zoho.com/api/v1/items`);
  url.searchParams.set('organization_id', orgId);
  url.searchParams.set('page', '1');
  url.searchParams.set('per_page', '50');

  const res = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }});
  if (!res.ok) return NextResponse.json({ error: 'Fetch failed', detail: await res.text() }, { status: 502 });

  const data = await res.json();

  // Optionally map to local products by SKU
  // For now, return items with basic fields
  const items = (data.items || []).map((i: any) => ({ id: i.item_id, name: i.name, sku: i.sku, rate: i.rate, available_stock: i.available_stock }));

  return NextResponse.json({ items });
}

async function getValidAccessToken(refreshToken: string, dc: string): Promise<string> {
  const tokenUrl = `https://accounts.${dc}.zoho.com/oauth/v2/token`;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });
  const res = await fetch(tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  if (!res.ok) throw new Error(`Refresh failed: ${await res.text()}`);
  const json = await res.json();
  return json.access_token as string;
}

