import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, shippingAddress, billingAddress, paymentMethod, sessionId, userId } = body;

    // Validate required fields
    if (!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.address1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zipcode) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    if (!sessionId && !userId) {
      return NextResponse.json(
        { error: 'Session ID or User ID required' },
        { status: 400 }
      );
    }

    // Get cart items
    let cartQuery = supabase
      .from('shopping_cart')
      .select(`
        id,
        product_id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          sku,
          image_url,
          stock_quantity,
          is_active
        )
      `);

    if (userId) {
      cartQuery = cartQuery.eq('user_id', userId);
    } else {
      cartQuery = cartQuery.eq('session_id', sessionId);
    }

    const { data: cartItems, error: cartError } = await cartQuery;

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cartItems) {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      if (!product?.is_active) {
        return NextResponse.json(
          { error: `Product ${product?.name || 'Unknown'} is no longer available` },
          { status: 400 }
        );
      }

      if ((product?.stock_quantity || 0) < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name || 'Unknown'}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price_at_time) * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
    const total = subtotal + taxAmount + shippingAmount;

    // Create order
    const orderData = {
      user_id: userId || null,
      customer_email: customerInfo.email,
      customer_first_name: customerInfo.firstName,
      customer_last_name: customerInfo.lastName,
      customer_phone: customerInfo.phone || null,
      status: 'pending',
      payment_status: 'pending',
      fulfillment_status: 'unfulfilled',
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      shipping_amount: parseFloat(shippingAmount.toFixed(2)),
      total_amount: parseFloat(total.toFixed(2)),
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      customer_notes: null,
      admin_notes: null
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Helper to parse image URLs that might be comma-separated strings
    const parseImageUrls = (value?: string[] | string | null) => {
      if (!value) return [] as string[];
      if (Array.isArray(value)) {
        return value
          .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
          .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
          .filter(Boolean);
      }
      if (typeof value !== 'string') return [value].filter(Boolean);
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    };

    // Create order items
    const orderItems = cartItems.map(item => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      const normalizedImages = parseImageUrls(product?.image_url);
      
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product?.name || 'Unknown Product',
        product_sku: product?.sku || 'N/A',
        product_image_url: normalizedImages[0] || product?.image_url || null,
        unit_price: parseFloat(item.price_at_time),
        quantity: item.quantity,
        total_price: parseFloat((parseFloat(item.price_at_time) * item.quantity).toFixed(2)),
        fulfillment_status: 'unfulfilled'
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to rollback the order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update product stock quantities
    for (const item of cartItems) {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      if (product) {
        const newStock = (product.stock_quantity || 0) - item.quantity;
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, newStock) })
          .eq('id', item.product_id);
      }
    }

    // Clear the cart
    let clearCartQuery = supabase.from('shopping_cart').delete();
    if (userId) {
      clearCartQuery = clearCartQuery.eq('user_id', userId);
    } else {
      clearCartQuery = clearCartQuery.eq('session_id', sessionId);
    }
    await clearCartQuery;

    // Create initial payment record
    const paymentData = {
      order_id: order.id,
      payment_method: paymentMethod,
      amount: parseFloat(total.toFixed(2)),
      currency: 'USD',
      status: 'pending'
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Don't fail the order creation for this
    }

    // Create order status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        from_status: null,
        to_status: 'pending',
        notes: 'Order created'
      });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total_amount,
      paymentId: payment?.id || null,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });

  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

