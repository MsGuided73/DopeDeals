import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds, action, status } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Order IDs are required' },
        { status: 400 }
      );
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Determine the status based on action
    if (action === 'status_processing') {
      updateData.status = 'processing';
    } else if (action === 'status_shipped') {
      updateData.status = 'shipped';
      updateData.shipped_at = new Date().toISOString();
    } else if (action === 'status_delivered') {
      updateData.status = 'delivered';
      updateData.delivered_at = new Date().toISOString();
    } else if (action === 'status_cancelled') {
      updateData.status = 'cancelled';
    } else if (status) {
      updateData.status = status;
    } else {
      return NextResponse.json(
        { error: 'Invalid action or status' },
        { status: 400 }
      );
    }

    // Update all orders
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .in('id', orderIds)
      .select('id, order_number, status');

    if (error) {
      console.error('Error updating orders:', error);
      return NextResponse.json(
        { error: 'Failed to update orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${data.length} orders`,
      updatedOrders: data
    });

  } catch (error) {
    console.error('Admin bulk update orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
