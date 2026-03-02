import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Fetch user profiles with some basic order stats
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        age_verification_status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Customers API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // In a production app, we would join with orders for real stats
    // For now, we'll map to the expected UI format
    const customers = (users || []).map((p: any) => ({
      id: p.id,
      name: p.full_name || 'Anonymous',
      email: p.email,
      orders: 0, // Placeholder
      total: 0, // Placeholder
      status: p.age_verification_status === 'verified' ? 'VIP' : 'Active',
      joined_at: p.created_at
    }));

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('[Customers API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
