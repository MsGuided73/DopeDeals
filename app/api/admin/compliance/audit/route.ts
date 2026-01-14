import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: logs, error } = await supabase
      .from('compliance_audit_log')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[Compliance Audit API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    console.error('[Compliance Audit API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
