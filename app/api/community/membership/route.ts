import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from the session
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', isMember: false },
        { status: 401 }
      );
    }

    // Check if the authenticated user is a community member
    const { data: subscriber, error: dbError } = await supabaseServer
      .from('community_subscribers')
      .select('id, email, is_active')
      .eq('email', user.email)
      .eq('is_active', true)
      .single();

    if (dbError && dbError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Database error checking membership:', dbError);
      return NextResponse.json(
        { error: 'Internal server error', isMember: false },
        { status: 500 }
      );
    }

    const isMember = !!subscriber;

    return NextResponse.json({
      isMember,
      userId: user.id,
      email: user.email
    });

  } catch (error) {
    console.error('Community membership check error:', error);
    return NextResponse.json(
      { error: 'Internal server error', isMember: false },
      { status: 500 }
    );
  }
}
