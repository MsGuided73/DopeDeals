import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, tag } = await req.json();
    if (!email || typeof email !== 'string') return NextResponse.json({ message: 'Email required' }, { status: 400 });
    // In production, insert into Supabase or ESP. For now, log to server output.
    console.log('subscribe', { email, tag });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

