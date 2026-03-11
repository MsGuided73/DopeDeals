import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSessionUser } from '../../../../lib/supabase-server-ssr';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ageVerified } = await request.json();

    if (!ageVerified) {
       return NextResponse.json({ error: 'Age verification failed' }, { status: 400 });
    }

    // Update public.users table using service role (protected from RLS for this specific update)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        age_verification_status: 'verified',
        last_verification_check: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Verify Self] Failed to update user status:', updateError);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    // Also update auth.users metadata for redundancy and consistency across redirects
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        age_verified: true,
        verification_method: 'site_gateway',
        verified_at: new Date().toISOString()
      }
    });

    if (authError) {
       console.warn('[Verify Self] Failed to update auth metadata, but database was updated:', authError);
    }

    return NextResponse.json({ success: true, verified: true });
    
  } catch (error) {
    console.error('[Verify Self] Error syncing verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
