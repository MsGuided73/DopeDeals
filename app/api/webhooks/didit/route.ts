import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// V2 Signature Verification Logic (From Didit Docs)
function verifyWebhookV2(bodyText: string, signature: string, timestamp: string, secret: string): boolean {
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) {
    console.warn('[Didit Webhook] Timestamp expired.');
    return false;
  }
  
  // They require the raw string payload and timestamp to be hashed
  const message = `${timestamp}:${bodyText}`;
  const expected = crypto.createHmac('sha256', secret).update(message).digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-signature-v2');
    const timestamp = request.headers.get('x-timestamp');
    const secret = process.env.DIDIT_WEBHOOK_SECRET;

    if (!signature || !timestamp || !secret) {
      return NextResponse.json({ error: 'Missing signature headers or secret' }, { status: 400 });
    }

    const bodyText = await request.text();

    // Verify cryptographic origin
    if (!verifyWebhookV2(bodyText, signature, timestamp, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    console.log('[Didit Webhook] Received valid payload:', payload.webhook_type, payload.status);

    if (payload.webhook_type === 'status.updated' && payload.status === 'Approved') {
      const vendorData = payload.vendor_data; // This is the user ID we passed in during createSession

      // Use the Service Role Key to bypass RLS and update user metadata
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
         console.error('[Didit Webhook] Cannot update db: SUPABASE_SERVICE_ROLE_KEY missing.');
         return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
      }

      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      // Verify the user exists first (in case it was a guest test UUID)
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(vendorData);

      if (user && !userError) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(vendorData, {
          user_metadata: {
            ...user.user.user_metadata,
            age_verified: true,
            verification_provider: 'didit',
            verified_at: new Date().toISOString()
          }
        });

        if (updateError) {
          console.error('[Didit Webhook] Failed to update user metadata:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
        
        console.log(`[Didit Webhook] Successfully verified user: ${vendorData}`);
      } else {
        console.log(`[Didit Webhook] vendor_data (${vendorData}) is not a registered user ID. Ignored DB update.`);
      }
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('[Didit Webhook] Global processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
