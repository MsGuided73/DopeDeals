import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSessionUser } from '../../../../lib/supabase-server-ssr';
import { DiditAdapter } from '../../../../lib/services/age-verification/didit-adapter';

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const user = await getSessionUser();
    
    if (!user) {
      console.warn('[Sync Status] User session missing during sync attempt.');
      // Proceeding with 401 prevents arbitrary metadata updates
      return NextResponse.json({ error: 'Unauthorized. User session wiped across subdomain redirect.' }, { status: 401 });
    }

    const adapter = new DiditAdapter();
    const decision = await adapter.getSessionDecision(sessionId);

    if (decision.verified) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          age_verified: true,
          verification_provider: 'didit',
          verified_at: new Date().toISOString()
        }
      });

      if (updateError) {
        console.error('[Sync Status] Failed to update user metadata:', updateError);
        return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
      }

      console.log(`[Sync Status] Successfully native-synced age verification for user: ${user.id}`);
      return NextResponse.json({ success: true, verified: true });
    }

    return NextResponse.json({ success: true, verified: false, reason: decision.reason });
  } catch (error) {
    console.error('[Sync Status] Error syncing verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
