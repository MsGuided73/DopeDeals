import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Fetch age verifications joined with user profiles
    const { data: verifications, error } = await supabase
      .from('age_verifications')
      .select(`
        id,
        user_id,
        status,
        submitted_at,
        date_of_birth,
        verification_method,
        profiles (
          email,
          full_name
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('[Compliance Verifications API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
    }

    // Map to UI format
    const formattedVerifications = (verifications || []).map((v: any) => ({
      id: v.id,
      user_id: v.user_id,
      user_email: v.profiles?.email || 'N/A',
      user_name: v.profiles?.full_name || 'Anonymous',
      verification_method: v.verification_method || 'id_upload',
      status: v.status,
      submitted_at: v.submitted_at,
      date_of_birth: v.date_of_birth,
      age: v.date_of_birth ? Math.floor((new Date().getTime() - new Date(v.date_of_birth).getTime()) / 31557600000) : 0,
      location: 'California, USA', // Placeholder
      ip_address: '0.0.0.0' // Placeholder
    }));

    return NextResponse.json({ verifications: formattedVerifications });
  } catch (error) {
    console.error('[Compliance Verifications API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
