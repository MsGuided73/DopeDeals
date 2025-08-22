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

  // Basic shape response; later we can call Zoho API for a live health check
  return NextResponse.json({ status: 'ok', dc, orgId, hasRefreshToken: !!tokenRow.refresh_token, expires_at: tokenRow.expires_at });
}

