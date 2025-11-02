import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Join the community newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('community_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const { data: newSubscriber, error } = await supabase
      .from('community_subscribers')
      .insert({
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to join the community. Please try again.' },
        { status: 500 }
      );
    }

    // Here you could add email service integration (e.g., Mailchimp, SendGrid)
    // For now, we'll just store in the database

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the Highway 420 community!',
      subscriber: {
        id: newSubscriber.id,
        fullName: newSubscriber.full_name,
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribed_at
      }
    });

  } catch (error) {
    console.error('Community join error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
