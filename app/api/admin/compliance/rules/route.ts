import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: rules, error } = await supabase
      .from('compliance_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Compliance API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch compliance rules' }, { status: 500 });
    }

    return NextResponse.json({ rules: rules || [] });
  } catch (error) {
    console.error('[Compliance API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
