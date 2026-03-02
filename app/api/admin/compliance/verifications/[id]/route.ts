import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, rejection_reason } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // 1. Get the verification record to find the user_id
    const { data: verification, error: fetchError } = await supabase
      .from('age_verifications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    // 2. Update the verification status
    const { error: updateError } = await supabase
      .from('age_verifications')
      .update({
        status,
        rejection_reason: rejection_reason || null,
        reviewed_at: new Date().toISOString(),
        // In a real app, we'd add 'reviewed_by' from the auth session
      })
      .eq('id', id);

    if (updateError) {
      console.error('[Compliance Update API] Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
    }

    // 3. If approved, update the profile's age_verified status
    if (status === 'approved') {
      const { error: profileError } = await supabase
        .from('users')
        .update({ 
          age_verification_status: 'verified',
          last_verification_check: new Date().toISOString()
        })
        .eq('id', verification.user_id);

      if (profileError) {
        console.error('[Compliance Update API] Profile error:', profileError);
        // We still return success for the verification record update
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Compliance Update API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
