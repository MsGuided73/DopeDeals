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
    });

    // TODO: If orderId is in the metadata, log the result against the order in Supabase
    // const orderId = body.metadata?.orderId;
    // if (orderId) { await updateOrderAgeVerification(orderId, result); }

    return NextResponse.json({ received: true, verified: result.verified });
  } catch (error: any) {
    console.error('[AgeChecker Callback] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
