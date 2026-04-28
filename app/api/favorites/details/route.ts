export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { productService } from '../../../../lib/product-service';

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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get favorite IDs
    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    const productIds = favorites.map(f => f.product_id);
    
    // Fetch detailed product info
    // We use the productService to get transformed URLs and consistent data
    const products = await productService.getProductsByIds(productIds);

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Favorites details GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

