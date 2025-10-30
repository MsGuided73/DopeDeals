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

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select('product_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({
        error: 'Failed to fetch favorites'
      }, { status: 500 });
    }

    return NextResponse.json({
      favorites: favorites.map(f => f.product_id) || []
    });

  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({
      error: 'Failed to fetch favorites'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { productSku } = body;

    if (!productSku) {
      return NextResponse.json({
        error: 'Product SKU is required'
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        product_id: productSku,
      });

    if (error) {
      // Ignore duplicate key errors
      if (error.code !== '23505') {
        console.error('Error adding favorite:', error);
        return NextResponse.json({
          error: 'Failed to add favorite'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Added to favorites'
    });

  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({
      error: 'Failed to add favorite'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { productSku } = body;

    if (!productSku) {
      return NextResponse.json({
        error: 'Product SKU is required'
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productSku);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({
        error: 'Failed to remove favorite'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites'
    });

  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({
      error: 'Failed to remove favorite'
    }, { status: 500 });
  }
}
