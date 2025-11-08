import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validation helpers
function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Setup session-based RLS using PostgreSQL GUC
async function setupSessionRLS(sessionId?: string | null, userId?: string | null) {
  try {
    // Set GUC variables for session-based RLS
    if (sessionId) {
      await supabase.rpc('exec_sql', {
        sql: `SET LOCAL app.current_session_id = '${sessionId.replace(/'/g, "''")}'`
      });
    }

    if (userId) {
      await supabase.rpc('exec_sql', {
        sql: `SET LOCAL app.current_user_id = '${userId.replace(/'/g, "''")}'`
      });
    }
  } catch (error) {
    // Fallback: Try direct set_config calls
    console.warn('GUC setup via RPC failed, this may be expected in some environments');
  }
}

// Helper function to get session_id from headers/cookies
async function getSessionId(request: NextRequest): Promise<string | null> {
  // Try headers first
  const headerSession = request.headers.get('x-session-id');
  if (headerSession) return headerSession;

  // Try cookies second
  const cookieStore = await cookies();
  const cookieSession = cookieStore.get('cart_session_id')?.value;
  if (cookieSession) return cookieSession;

  return null;
}

// Helper function to get session_id from headers (for backwards compatibility)
function getSessionIdFromHeaders(request: NextRequest): string | null {
  return request.headers.get('x-session-id');
}

// Helper function to get current auth user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

// Get or create cart for user/session with session RLS
async function getOrCreateCart(sessionId?: string | null, userId?: string | null): Promise<string | null> {
  if (!sessionId && !userId) return null;

  try {
    // First setup the session RLS
    await setupSessionRLS(sessionId, userId);

    // Try to find existing cart
    let cartQuery = supabase.from('carts').select('id').limit(1);

    if (userId) {
      cartQuery = cartQuery.eq('user_id', userId);
    } else if (sessionId) {
      cartQuery = cartQuery.eq('session_id', sessionId);
    }

    const { data: existingCart } = await cartQuery;
    if (existingCart && existingCart.length > 0) {
      return existingCart[0].id;
    }

    // Create new cart if none exists
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({
        user_id: userId,
        session_id: sessionId,
      })
      .select('id')
      .single();

    if (error) throw error;
    return newCart.id;
  } catch (error) {
    console.error('Error getting/creating cart:', error);
    return null;
  }
}

// Get cart contents with proper RLS
async function getCartItems(sessionId?: string | null, userId?: string | null) {
  if (!sessionId && !userId) return [];

  try {
    // Setup session RLS first
    await setupSessionRLS(sessionId, userId);

    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        price_at_time,
        created_at,
        updated_at,
        main_site_products (
          id,
          name,
          our_price,
          fire_price,
          stock_quantity,
          is_active,
          nicotine_product,
          tobacco_product,
          image_url
        )
      `);

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    // Transform to expected format - cart_items.id is varchar
    return (cartItems || []).map(item => ({
      id: item.id.toString(), // Convert to string to match expected interface
      productId: item.product_id,
      quantity: item.quantity,
      priceAtTime: parseFloat(item.price_at_time?.toString() || '0') || 0,
      itemTotal: (parseFloat(item.price_at_time?.toString() || '0') || 0) * item.quantity,
      product: item.main_site_products ? {
        id: (item.main_site_products as any).id,
        name: (item.main_site_products as any).name,
        description: '',
        sku: `SKU-${item.product_id}`,
        currentPrice: parseFloat((item.main_site_products as any).our_price) || 0,
        vipPrice: parseFloat((item.main_site_products as any).fire_price) || null,
        imageUrl: (item.main_site_products as any).image_url || null,
        stockQuantity: (item.main_site_products as any).stock_quantity || 0,
        isActive: (item.main_site_products as any).is_active || false,
        inStock: ((item.main_site_products as any).stock_quantity || 0) > 0,
      } : null,
    }));

  } catch (error) {
    console.error('Error in getCartItems:', error);
    return [];
  }
}

// Add or update cart item with session-based UPSERT logic
async function manageCartItem(
  sessionId?: string | null,
  userId?: string | null,
  itemId?: string,
  productId?: string,
  quantity?: number,
  action: 'add' | 'update' | 'remove' = 'add'
) {
  if (!productId || (!sessionId && !userId)) return null;

  try {
    // Setup session RLS
    await setupSessionRLS(sessionId, userId);

    // Get cart ID first
    const cartId = await getOrCreateCart(sessionId, userId);
    if (!cartId) throw new Error('Could not create or find cart');

    const conditions = { cart_id: cartId, product_id: productId };

    if (action === 'add') {
      // Try UPSERT instead of separate check/insert
      const finalQuantity = quantity || 1;

      // Get current quantity if item exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('quantity')
        .match(conditions)
        .single();

      let newQuantity = finalQuantity;
      if (existingItem) {
        newQuantity = existingItem.quantity + finalQuantity;
      }

      // Get fresh product price
      const { data: product } = await supabase
        .from('main_site_products')
        .select('our_price')
        .eq('id', productId)
        .single();

      const price = parseFloat(product?.our_price) || 0;

      // Upsert the item
      const { data: upsertedItem, error } = await supabase
        .from('cart_items')
        .upsert({
          cart_id: cartId,
          product_id: productId,
          quantity: newQuantity,
          price_at_time: price,
        }, {
          onConflict: 'cart_id,product_id'
        })
        .select()
        .single();

      if (error) throw error;
      return upsertedItem;

    } else if (action === 'update') {
      // Update specific item by ID
      if (!itemId) throw new Error('Item ID required for update');

      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('cart_id', cartId); // Security: only update items in current cart

      if (error) throw error;
      return { quantity };

    } else if (action === 'remove') {
      if (itemId) {
        // Remove by item ID
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('cart_id', cartId);

        if (error) throw error;
      } else if (productId) {
        // Remove by product ID
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .match(conditions);

        if (error) throw error;
      }

      return null;
    }

  } catch (error) {
    console.error('Cart management error:', error);
    throw error;
  }
}

// GET - Fetch cart contents
export async function GET(request: NextRequest) {
  try {
    // Try to get authenticated user first
    const user = await getCurrentUser();

    // Get session from headers/cookies for anonymous users
    const sessionId = await getSessionId(request);

    const userId = user?.id || null;

    // Get cart items (cart will be created automatically if needed)
    const cartItems = await getCartItems(sessionId, userId);

    // Calculate totals
    let subtotal = 0;
    let itemCount = 0;

    cartItems.forEach(item => {
      subtotal += item.itemTotal;
      itemCount += item.quantity;
    });

    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + taxAmount + shippingAmount;

    return NextResponse.json({
      success: true,
      cart: {
        items: cartItems,
        itemCount,
        subtotal,
        taxAmount,
        shippingAmount,
        total
      }
    });

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({
      success: false,
      cart: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        total: 0
      },
      error: 'Failed to fetch cart'
    }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Get user and session info
    const user = await getCurrentUser();
    const sessionId = await getSessionId(request);

    const userId = user?.id || null;

    // Validate we have either user or session
    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required - please refresh the page to establish a session' },
        { status: 401 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('main_site_products')
      .select('id, name, our_price, stock_quantity, nicotine_product, tobacco_product, is_active')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is active
    if (!product.is_active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 403 }
      );
    }

    // Compliance check
    if (product.nicotine_product || product.tobacco_product) {
      return NextResponse.json(
        { error: 'This product is not available for purchase on this site' },
        { status: 403 }
      );
    }

    // Inventory validation
    const currentStock = product.stock_quantity || 0;
    if (currentStock < quantity) {
      return NextResponse.json(
        {
          error: `Only ${currentStock} items available in stock`,
          requested: quantity,
          available: currentStock
        },
        { status: 400 }
      );
    }

    // Add to cart - correct parameter order: sessionId, userId, itemId?, productId, quantity?, action
    const result = await manageCartItem(sessionId, userId, undefined, productId, quantity, 'add');

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Item added to cart successfully',
        quantity: result.quantity,
        itemId: result.id
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to add item to cart' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (!validateUUID(cartItemId) && typeof cartItemId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid cart item ID format' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    // Get current user and session
    const user = await getCurrentUser();
    const sessionId = await getSessionId(request);
    const userId = user?.id || null;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required - please refresh the page to establish a session' },
        { status: 401 }
      );
    }

    // Check if we have access to this cart item via RLS
    const { data: cartItem, error: itemError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        carts!inner(user_id, session_id)
      `)
      .eq('id', cartItemId)
      .single();

    if (itemError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found or access denied' },
        { status: 404 }
      );
    }

    // Verify the cart item belongs to current user/session (additional server-side check)
    const cartData = cartItem.carts as any;
    const isOwner = (userId && cartData.user_id === userId) ||
                   (sessionId && cartData.session_id === sessionId);

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized access to cart item' },
        { status: 403 }
      );
    }

    // Get product details for stock validation
    const { data: product } = await supabase
      .from('main_site_products')
      .select('stock_quantity')
      .eq('id', cartItem.product_id)
      .single();

    // Validate stock availability
    if (product && (product.stock_quantity || 0) < quantity) {
      return NextResponse.json(
        {
          error: `Only ${product.stock_quantity} items available in stock`,
          requested: quantity,
          available: product.stock_quantity
        },
        { status: 400 }
      );
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      const result = await manageCartItem(sessionId, userId, cartItemId, cartItem.product_id, 0, 'remove');

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        action: 'removed'
      });
    }

    // Update quantity
    const result = await manageCartItem(sessionId, userId, cartItemId, cartItem.product_id, quantity, 'update');

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Cart updated successfully',
        action: 'updated',
        quantity: result.quantity || quantity
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Get current user and session
    const user = await getCurrentUser();
    const sessionId = await getSessionId(request);
    const userId = user?.id || null;



    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required - please refresh the page to establish a session' },
        { status: 401 }
      );
    }

    // Find all carts that belong to this user/session
    let cartQuery = supabase.from('carts').select('id, user_id, session_id');

    if (userId) {
      // For authenticated users, find all their carts (across all sessions)
      cartQuery = cartQuery.eq('user_id', userId);
    } else if (sessionId) {
      // For anonymous users, find cart from current session
      cartQuery = cartQuery.eq('session_id', sessionId);
    }

    const { data: userCarts, error: cartQueryError } = await cartQuery;

    if (cartQueryError || !userCarts || userCarts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Cart cleared successfully',
        itemsCleared: 0
      });
    }

    // Get all cart IDs for this user/session
    const cartIds = userCarts.map(cart => cart.id);

    // Delete all cart items for all user's carts
    const { data: deleteResult, error } = await supabase
      .from('cart_items')
      .delete()
      .in('cart_id', cartIds)
      .select();

    if (error) {
      console.error('Error clearing cart:', error);
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      itemsCleared: deleteResult?.length || 0
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
