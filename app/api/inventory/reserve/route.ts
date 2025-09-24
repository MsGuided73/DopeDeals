import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../../../lib/requireAuth';
import { z } from 'zod';

const ReserveInventorySchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    warehouseId: z.string().optional().default('main')
  })).min(1),
  sessionId: z.string().optional(),
  holdMinutes: z.number().int().min(1).max(60).optional().default(15),
  reason: z.string().optional().default('checkout')
});

const ReleaseReservationSchema = z.object({
  reservationIds: z.array(z.string().uuid()).min(1)
});

// Initialize Supabase client with service role for inventory operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Get user authentication (optional for guest checkout)
    let user = null;
    try {
      const auth = await requireAuth();
      if (!(auth instanceof NextResponse)) {
        user = auth.user;
      }
    } catch (error) {
      // Allow guest checkout - user will be null
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = ReserveInventorySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid reservation request', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { items, sessionId, holdMinutes, reason } = parse.data;

    // Ensure we have either user ID or session ID
    if (!user?.id && !sessionId) {
      return NextResponse.json({
        error: 'Either user authentication or session ID is required'
      }, { status: 400 });
    }

    // Reserve inventory for each item
    const reservations = [];
    const errors = [];

    for (const item of items) {
      try {
        // Reserve inventory using our custom function
        const { data: reservationId, error: reserveError } = await supabase
          .rpc('reserve_inventory', {
            p_product_id: item.productId,
            p_quantity: item.quantity,
            p_user_id: user?.id || null,
            p_session_id: sessionId || null,
            p_warehouse_id: item.warehouseId,
            p_hold_minutes: holdMinutes
          });

        if (reserveError) {
          console.error('[Inventory Reservation] Reserve error:', reserveError);
          errors.push({
            productId: item.productId,
            error: reserveError.message || 'Failed to reserve inventory'
          });
          continue;
        }

        // Get product details for response
        const { data: product } = await supabase
          .from('products')
          .select('name, sku')
          .eq('id', item.productId)
          .single();

        reservations.push({
          reservationId,
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          productSku: product?.sku || 'N/A',
          quantity: item.quantity,
          warehouseId: item.warehouseId,
          expiresAt: new Date(Date.now() + holdMinutes * 60 * 1000).toISOString()
        });

      } catch (error) {
        console.error('[Inventory Reservation] Error reserving item:', error);
        errors.push({
          productId: item.productId,
          error: 'Reservation failed'
        });
      }
    }

    // Return reservation results
    const success = reservations.length > 0;
    const response = {
      success,
      reservations,
      errors,
      summary: {
        totalItems: items.length,
        reservedItems: reservations.length,
        failedItems: errors.length,
        holdMinutes,
        expiresAt: reservations.length > 0 ? reservations[0].expiresAt : null
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { 
      status: success ? 201 : (errors.length === items.length ? 400 : 207) // 207 = Multi-Status
    });

  } catch (error) {
    console.error('[Inventory Reservation] Error:', error);
    return NextResponse.json({
      error: 'Failed to reserve inventory'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get user authentication (optional for guest checkout)
    let user = null;
    try {
      const auth = await requireAuth();
      if (!(auth instanceof NextResponse)) {
        user = auth.user;
      }
    } catch (error) {
      // Allow guest operations
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = ReleaseReservationSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid release request', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { reservationIds } = parse.data;

    // Release each reservation
    const results = [];
    const errors = [];

    for (const reservationId of reservationIds) {
      try {
        // Verify ownership if user is authenticated
        if (user?.id) {
          const { data: reservation } = await supabase
            .from('inventory_reservations')
            .select('user_id, session_id')
            .eq('id', reservationId)
            .single();

          if (reservation && reservation.user_id !== user.id) {
            errors.push({
              reservationId,
              error: 'Unauthorized to release this reservation'
            });
            continue;
          }
        }

        // Release reservation using our custom function
        const { data: released, error: releaseError } = await supabase
          .rpc('release_inventory_reservation', {
            p_reservation_id: reservationId
          });

        if (releaseError) {
          console.error('[Inventory Reservation] Release error:', releaseError);
          errors.push({
            reservationId,
            error: releaseError.message || 'Failed to release reservation'
          });
          continue;
        }

        results.push({
          reservationId,
          released: released || false
        });

      } catch (error) {
        console.error('[Inventory Reservation] Error releasing reservation:', error);
        errors.push({
          reservationId,
          error: 'Release failed'
        });
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      released: results,
      errors,
      summary: {
        totalReservations: reservationIds.length,
        releasedReservations: results.length,
        failedReleases: errors.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Reservation] Error:', error);
    return NextResponse.json({
      error: 'Failed to release reservations'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get user authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    // Get user's active reservations
    let query = supabase
      .from('inventory_reservations')
      .select(`
        id,
        product_id,
        warehouse_id,
        quantity,
        reason,
        reserved_at,
        expires_at,
        status,
        products:product_id (
          name,
          sku,
          price
        )
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString());

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      query = query.eq('user_id', user.id);
    }

    const { data: reservations, error } = await query;

    if (error) {
      console.error('[Inventory Reservation] Query error:', error);
      return NextResponse.json({
        error: 'Failed to get reservations'
      }, { status: 500 });
    }

    return NextResponse.json({
      reservations: reservations || [],
      count: reservations?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Reservation] Error:', error);
    return NextResponse.json({
      error: 'Failed to get reservations'
    }, { status: 500 });
  }
}
