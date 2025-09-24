import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for cleanup operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Verify this is an internal request (could add API key validation)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clean up expired reservations using our custom function
    const { data: cleanedCount, error: cleanupError } = await supabase
      .rpc('cleanup_expired_reservations');

    if (cleanupError) {
      console.error('[Inventory Cleanup] Cleanup error:', cleanupError);
      return NextResponse.json({
        error: 'Failed to cleanup expired reservations'
      }, { status: 500 });
    }

    // Get current reservation statistics
    const { data: stats, error: statsError } = await supabase
      .from('inventory_reservations')
      .select('status')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const statusCounts = data?.reduce((acc, reservation) => {
          acc[reservation.status] = (acc[reservation.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        return { data: statusCounts, error: null };
      });

    if (statsError) {
      console.warn('[Inventory Cleanup] Stats error:', statsError);
    }

    console.log(`[Inventory Cleanup] Cleaned up ${cleanedCount} expired reservations`);

    return NextResponse.json({
      success: true,
      cleanedReservations: cleanedCount || 0,
      statistics: stats || {},
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Cleanup] Error:', error);
    return NextResponse.json({
      error: 'Cleanup operation failed'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get inventory statistics and health check
    const { data: inventoryStats, error: invError } = await supabase
      .from('inventory_status')
      .select('stock_status')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const statusCounts = data?.reduce((acc, item) => {
          acc[item.stock_status] = (acc[item.stock_status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        return { data: statusCounts, error: null };
      });

    if (invError) {
      console.error('[Inventory Cleanup] Inventory stats error:', invError);
    }

    // Get reservation statistics
    const { data: reservationStats, error: resError } = await supabase
      .from('inventory_reservations')
      .select('status, expires_at')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const now = new Date();
        const stats = {
          total: data?.length || 0,
          active: 0,
          expired: 0,
          released: 0,
          converted: 0,
          expiringSoon: 0 // expires within 5 minutes
        };

        data?.forEach(reservation => {
          stats[reservation.status as keyof typeof stats]++;
          
          if (reservation.status === 'active' && reservation.expires_at) {
            const expiresAt = new Date(reservation.expires_at);
            const minutesUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60);
            if (minutesUntilExpiry <= 5 && minutesUntilExpiry > 0) {
              stats.expiringSoon++;
            }
          }
        });

        return { data: stats, error: null };
      });

    if (resError) {
      console.error('[Inventory Cleanup] Reservation stats error:', resError);
    }

    // Get low stock alerts
    const { data: lowStockItems, error: lowStockError } = await supabase
      .from('inventory_status')
      .select('product_name, sku, truly_available, low_stock_threshold, stock_status')
      .in('stock_status', ['out_of_stock', 'low_stock', 'reorder_needed'])
      .order('truly_available', { ascending: true })
      .limit(10);

    if (lowStockError) {
      console.error('[Inventory Cleanup] Low stock query error:', lowStockError);
    }

    return NextResponse.json({
      health: 'ok',
      inventory: {
        statusCounts: inventoryStats || {},
        lowStockAlerts: lowStockItems || []
      },
      reservations: reservationStats || {},
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Cleanup] Health check error:', error);
    return NextResponse.json({
      health: 'error',
      error: 'Health check failed'
    }, { status: 500 });
  }
}
