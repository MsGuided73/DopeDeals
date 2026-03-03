import { NextResponse } from 'next/server';
import { DiditAdapter } from '../../../../lib/services/age-verification/didit-adapter';
import { supabaseServer } from '../../../../lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { data: { user } } = await supabaseServer.auth.getUser();

    // If no user is found, generate a temporary guest UUID for tracking during checkout.
    // In a fully integrated system, we'd ensure guests have stable IDs or are forced to login.
    const vendorDataId = user?.id || crypto.randomUUID();

    const adapter = new DiditAdapter();
    const sessionUrl = await adapter.createSession(vendorDataId);

    return NextResponse.json({ url: sessionUrl });
    
  } catch (error) {
    console.error('[Age Verification API] Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create verification session' }, { status: 500 });
  }
}
