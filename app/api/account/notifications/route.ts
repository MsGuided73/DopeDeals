import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer;
    const { orderId, email, phone, subscribeEmail, subscribeSms } = await req.json();

    // 1. Get current user if authorized
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Update Order contact info if orderId is provided
    if (orderId) {
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          customer_email: email,
          customer_phone: phone
        })
        .match({ id: orderId });

      if (orderError) {
        console.error('[Notifications] Order update error:', orderError);
      }
    }

    // 3. Update public.users profile if user is logged in
    if (user) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          phone,
          subscribe_sms: subscribeSms,
          subscribe_email: subscribeEmail,
          updated_at: new Date().toISOString()
        })
        .match({ id: user.id });

      if (userError) {
        console.error('[Notifications] User profile update error:', userError);
      }

      // Also update auth metadata for immediate client session access
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          notification_preferences: {
            email,
            phone,
            subscribeEmail,
            subscribeSms,
            updatedAt: new Date().toISOString()
          }
        }
      });

      if (metaError) {
        console.error('[Notifications] User metadata update error:', metaError);
      }
    }

    // 4. In a real production app, we would also push this to Zoho / Mailchimp / Klaviyo / ShipStation here
    console.log(`[Notifications] Opt-in recorded for ${email}/${phone}. Order: ${orderId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Notifications] Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
