import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Get order with all related data for admin view
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        status,
        payment_status,
        fulfillment_status,
        subtotal_amount,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        shipping_address_line_1,
        shipping_address_line_2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        billing_address_line_1,
        billing_address_line_2,
        billing_city,
        billing_state,
        billing_postal_code,
        billing_country,
        customer_notes,
        admin_notes,
        tracking_number,
        carrier,
        payment_confirmed_at,
        kajapay_transaction_id,
        shipstation_order_id,
        shipstation_order_key,
        created_at,
        updated_at,
        shipped_at,
        delivered_at,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            sku,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      console.error('Error fetching order details:', error);
      return NextResponse.json(
        { error: 'Failed to fetch order details' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedOrder = {
      ...order,
      subtotal_amount: parseFloat(order.subtotal_amount) || 0,
      tax_amount: parseFloat(order.tax_amount) || 0,
      shipping_amount: parseFloat(order.shipping_amount) || 0,
      discount_amount: parseFloat(order.discount_amount) || 0,
      total_amount: parseFloat(order.total_amount) || 0,
      order_items: order.order_items?.map((item: any) => ({
        ...item,
        unit_price: parseFloat(item.unit_price) || 0,
        total_price: parseFloat(item.total_price) || 0,
        products: item.products || {}
      })) || []
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    console.error('Admin order details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
