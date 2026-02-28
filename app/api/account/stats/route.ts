import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Fetch order statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status')
      .eq('user_id', user.id);

    if (ordersError) {
      console.error('Error fetching orders for stats:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch order statistics' }, { status: 500 });
    }

    // Calculate totals
    const ordersCount = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

    // Fetch favorites count
    const { count: favoritesCount, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (favoritesError) {
      console.error('Error fetching favorites for stats:', favoritesError);
      // We don't fail the whole request for this, just default to 0
    }

    // Fetch user profile for VIP status
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('membership_tier_id')
      .eq('id', user.id)
      .maybeSingle();

    const isVip = !!profile?.membership_tier_id;

    return NextResponse.json({
      ordersCount,
      totalSpent,
      favoritesCount: favoritesCount || 0,
      isVip
    });

  } catch (error) {
    console.error('Account stats GET error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
