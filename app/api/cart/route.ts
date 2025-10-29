import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to get session_id from headers
function getSessionIdFromHeaders(request: NextRequest): string | null {
  return request.headers.get('x-session-id');
}

// Helper function to get user from auth token
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

// Initialize cart on app load - ensures cart exists for user or session
async function initializeCart(userId?: string | null, sessionId?: string | null) {
  // If no user or session, nothing to initialize
  if (!userId && !sessionId) return;

  try {
    // Check if cart already exists
    let existingQuery = supabase.from('shopping_cart').select('id').limit(1);

    if (userId) {
      existingQuery = existingQuery.eq('user_id', userId);
    } else if (sessionId) {
      existingQuery = existingQuery.eq('session_id', sessionId);
    }

    const { data: existingCart } = await existingQuery;

    // If no cart exists, create one (shopping_cart table auto-creates via inserts)
    // We don't need to pre-create an empty cart, just let inserts happen naturally
    return existingCart?.[0]?.id || null;
  } catch (error) {
    console.error('Error initializing cart:', error);
    return null;
  }
}

// Get cart for display
async function getCartItems(userId?: string | null, sessionId?: string | null) {
  if (!userId && !sessionId) return [];

  try {
    // Query all cart items for this user/session
    let query = supabase
      .from('shopping_cart')
      .select(`
        id,
        user_id,
        session_id,
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

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: cartRows, error } = await query;

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    // Transform to cart item format expected by frontend
    return (cartRows || []).map(row => ({
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      priceAtTime: parseFloat(row.price_at_time) || 0,
      itemTotal: (parseFloat(row.price_at_time) || 0) * row.quantity,
      product: row.main_site_products as any ? {
        id: (row.main_site_products as any).id,
        name: (row.main_site_products as any).name,
        description: '',
        sku: `SKU-${row.product_id}`,
        currentPrice: parseFloat((row.main_site_products as any).our_price) || 0,
        vipPrice: parseFloat((row.main_site_products as any).fire_price) || null,
        imageUrl: (row.main_site_products as any).image_url || null,
        stockQuantity: (row.main_site_products as any).stock_quantity || 0,
        isActive: (row.main_site_products as any).is_active || false,
        inStock: ((row.main_site_products as any).stock_quantity || 0) > 0,
      } : null,
    }));

  } catch (error) {
    console.error('Error in getCartItems:', error);
    return [];
  }
}

// Add or update item in cart
async function manageCartItem(userId?: string | null, sessionId?: string | null, productId?: string, quantity?: number, action: 'add' | 'update' | 'remove' = 'add') {
  if (!productId || (!userId && !sessionId)) return null;

  try {
    const conditions = userId
      ? { user_id: userId, product_id: productId }
      : { session_id: sessionId, product_id: productId };

    if (action === 'add') {
      // Try to find existing item
      const { data: existingItem } = await supabase
        .from('shopping_cart')
        .select('*')
        .match(conditions)
        .single();

      if (existingItem) {
        // Update existing quantity
        const newQuantity = existingItem.quantity + (quantity || 1);
        const { error } = await supabase
          .from('shopping_cart')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .match(conditions);

        if (error) throw error;
        return { ...existingItem, quantity: newQuantity };
      } else {
        // Get product price
        const { data: product } = await supabase
          .from('main_site_products')
          .select('our_price')
          .eq('id', productId)
          .single();

        const price = parseFloat(product?.our_price) || 0;

        // Insert new item
        const { data: newItem, error } = await supabase
          .from('shopping_cart')
          .insert({
            user_id: userId || null,
            session_id: sessionId || null,
            product_id: productId,
            quantity: quantity || 1,
            price_at_time: price,
          })
          .select()
          .single();

        if (error) throw error;
        return newItem;
      }
    }

    if (action === 'update') {
      const { error } = await supabase
        .from('shopping_cart')
        .update({
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .match(conditions);

      if (error) throw error;
      return { quantity };
    }

    if (action === 'remove') {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .match(conditions);

      if (error) throw error;
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

    // Get session from headers for anonymous users
    const sessionId = getSessionIdFromHeaders(request);

    const userId = user?.id || null;

    // Initialize cart (ensures it exists, though with shopping_cart table, it's not strictly necessary)
    await initializeCart(userId, sessionId);

    // Get cart items
    const cartItems = await getCartItems(userId, sessionId);

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
      success: true,
      cart: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        total: 0
      }
    });
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

    // Get user and session info
    const user = await getCurrentUser();
    const sessionId = getSessionIdFromHeaders(request);

    const userId = user?.id || null;

    // Validate we have either user or session
    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    // Add to cart
    const result = await manageCartItem(userId, sessionId, productId, quantity, 'add');

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Item added to cart successfully',
        quantity: result.quantity
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
      { error: 'Internal server error' },
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

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be positive' },
        { status: 400 }
      );
    }

    // Get current user and session
    const user = await getCurrentUser();
    const sessionId = getSessionIdFromHeaders(request);
    const userId = user?.id || null;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify cart item belongs to current user/session
    let itemQuery = supabase
      .from('shopping_cart')
      .select('id, product_id, quantity')
      .eq('id', cartItemId);

    if (userId) {
      itemQuery = itemQuery.eq('user_id', userId);
    } else {
      itemQuery = itemQuery.eq('session_id', sessionId);
    }

    const { data: cartItemData } = await itemQuery.single();

    if (!cartItemData) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Get product details for stock validation
    const { data: product } = await supabase
      .from('main_site_products')
      .select('id, stock_quantity')
      .eq('id', cartItemData.product_id)
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

    // If quantity is 0, delete the item
    if (quantity === 0) {
      const conditions = userId
        ? { user_id: userId, id: cartItemId }
        : { session_id: sessionId, id: cartItemId };

      const { error: deleteError } = await supabase
        .from('shopping_cart')
        .delete()
        .match(conditions);

      if (deleteError) {
        console.error('Error removing cart item:', deleteError);
        return NextResponse.json(
          { error: 'Failed to remove item' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        action: 'removed'
      });
    }

    // Update quantity
    const conditions = userId
      ? { user_id: userId, id: cartItemId }
      : { session_id: sessionId, id: cartItemId };

    const { error: updateError } = await supabase
      .from('shopping_cart')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .match(conditions);

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return NextResponse.json(
        { error: 'Failed to update cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      action: 'updated',
      quantity
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Get current user and session
    const user = await getCurrentUser();
    const sessionId = getSessionIdFromHeaders(request);
    const userId = user?.id || null;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete all cart items for this user/session
    let deleteQuery = supabase.from('shopping_cart').delete();

    if (userId) {
      deleteQuery = deleteQuery.eq('user_id', userId);
    } else {
      deleteQuery = deleteQuery.eq('session_id', sessionId);
    }

    const { error } = await deleteQuery;

    if (error) {
      console.error('Error clearing cart:', error);
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
