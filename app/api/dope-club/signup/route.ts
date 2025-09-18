import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth,
      userId 
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('dope_club_members')
      .select('id')
      .eq('email', email)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'Email already registered in DOPE CLUB' },
        { status: 409 }
      );
    }

    // Create new DOPE CLUB member
    const { data: newMember, error } = await supabase
      .from('dope_club_members')
      .insert({
        user_id: userId,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        membership_tier: 'bronze',
        total_points: 0,
        available_points: 0,
        lifetime_spending: 0.00,
        is_active: true,
        joined_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating DOPE CLUB member:', error);
      return NextResponse.json(
        { error: 'Failed to create DOPE CLUB membership' },
        { status: 500 }
      );
    }

    // Award welcome bonus points
    const welcomePoints = 100;
    const { error: pointsError } = await supabase
      .from('dope_club_points_transactions')
      .insert({
        member_id: newMember.id,
        transaction_type: 'bonus',
        points_amount: welcomePoints,
        description: 'Welcome to DOPE CLUB! Bonus points for joining',
        metadata: { welcome_bonus: true }
      });

    if (!pointsError) {
      // Update member's available points
      await supabase
        .from('dope_club_members')
        .update({ 
          total_points: welcomePoints,
          available_points: welcomePoints 
        })
        .eq('id', newMember.id);
    }

    return NextResponse.json({
      success: true,
      member: {
        id: newMember.id,
        email: newMember.email,
        firstName: newMember.first_name,
        lastName: newMember.last_name,
        membershipTier: newMember.membership_tier,
        totalPoints: welcomePoints,
        availablePoints: welcomePoints,
        joinedAt: newMember.joined_at
      },
      welcomeBonus: welcomePoints
    });

  } catch (error) {
    console.error('DOPE CLUB signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('dope_club_members')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        date_of_birth,
        membership_tier,
        total_points,
        available_points,
        lifetime_spending,
        is_active,
        joined_at,
        last_activity
      `);

    if (email) {
      query = query.eq('email', email.toLowerCase());
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: member, error } = await query.single();

    if (error || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Get recent points transactions
    const { data: recentTransactions } = await supabase
      .from('dope_club_points_transactions')
      .select('*')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get tier benefits
    const { data: tierBenefits } = await supabase
      .from('dope_club_tier_benefits')
      .select('*')
      .eq('tier', member.membership_tier)
      .eq('is_active', true);

    // Calculate progress to next tier
    const { data: tierThresholds } = await supabase
      .from('dope_club_tier_thresholds')
      .select('*')
      .order('minimum_spending', { ascending: true });

    let nextTier = null;
    let progressToNextTier = 0;

    if (tierThresholds) {
      const currentTierIndex = tierThresholds.findIndex(t => t.tier === member.membership_tier);
      if (currentTierIndex < tierThresholds.length - 1) {
        nextTier = tierThresholds[currentTierIndex + 1];
        const remainingSpending = nextTier.minimum_spending - member.lifetime_spending;
        progressToNextTier = Math.max(0, Math.min(100, 
          (member.lifetime_spending / nextTier.minimum_spending) * 100
        ));
      }
    }

    return NextResponse.json({
      member: {
        id: member.id,
        email: member.email,
        firstName: member.first_name,
        lastName: member.last_name,
        phone: member.phone,
        dateOfBirth: member.date_of_birth,
        membershipTier: member.membership_tier,
        totalPoints: member.total_points,
        availablePoints: member.available_points,
        lifetimeSpending: member.lifetime_spending,
        isActive: member.is_active,
        joinedAt: member.joined_at,
        lastActivity: member.last_activity
      },
      recentTransactions: recentTransactions || [],
      tierBenefits: tierBenefits || [],
      nextTier: nextTier ? {
        tier: nextTier.tier,
        minimumSpending: nextTier.minimum_spending,
        remainingSpending: Math.max(0, nextTier.minimum_spending - member.lifetime_spending),
        progressPercentage: progressToNextTier
      } : null
    });

  } catch (error) {
    console.error('Error fetching DOPE CLUB member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
