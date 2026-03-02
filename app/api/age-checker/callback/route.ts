import { NextRequest, NextResponse } from 'next/server';
import { parseAgeCheckCallback } from '../../../../lib/services/age-checker/service';

/**
 * POST /api/age-checker/callback
 *
 * Receives server-side callbacks from AgeChecker.Net after a verification
 * event (verified, denied, etc.). Used to log verification results and
 * optionally update order records.
 *
 * AgeChecker.Net sends this to your configured Callback URL.
 * Configure it in your AgeChecker.Net dashboard:
 *   Callback URL: https://highway420store.com/api/age-checker/callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Get signature from header (AgeChecker sends it here)
    const signature = request.headers.get('x-agechecker-signature') || body.signature || '';

    const result = parseAgeCheckCallback({ ...body, signature });

    console.log('[AgeChecker Callback]', {
      verified: result.verified,
      transactionId: result.transactionId,
      reason: result.reason,
      metadata: body.metadata
    });

    // If we have an email in metadata, update that user in Supabase
    // AgeChecker allows passing metadata during verification
    const email = body.metadata?.email;
    
    if (result.verified && email) {
      const supabase = createAdminClient();
      
      // Update user metadata via admin client (service role)
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (!listError) {
        const user = users.find((u: any) => u.email === email);
        if (user) {
          await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...user.user_metadata,
              age_verified: true,
              age_verified_at: new Date().toISOString(),
              age_checker_transaction_id: result.transactionId,
              age_checker_status: 'verified'
            }
          });
          console.log(`[AgeChecker Callback] Successfully updated user metadata for ${email}`);
        }
      }
    }

    return NextResponse.json({ received: true, verified: result.verified });
  } catch (error: any) {
    console.error('[AgeChecker Callback] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper to create Supabase admin client
function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
