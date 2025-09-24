import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const ValidateInventorySchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    warehouseId: z.string().optional().default('main')
  })).min(1),
  userId: z.string().uuid().optional(),
  sessionId: z.string().optional()
});

// Initialize Supabase client with service role for inventory operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = ValidateInventorySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid validation request', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { items, userId, sessionId } = parse.data;

    // Validate each item's stock availability
    const validationResults = [];
    let allValid = true;

    for (const item of items) {
      try {
        // Get available stock using our custom function
        const { data: stockData, error: stockError } = await supabase
          .rpc('get_available_stock', {
            p_product_id: item.productId,
            p_warehouse_id: item.warehouseId
          });

        if (stockError) {
          console.error('[Inventory Validation] Stock check error:', stockError);
          validationResults.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableStock: 0,
            isValid: false,
            error: 'Unable to check stock availability'
          });
          allValid = false;
          continue;
        }

        const availableStock = stockData || 0;
        const isValid = availableStock >= item.quantity;

        if (!isValid) {
          allValid = false;
        }

        // Get product details for better error messages
        const { data: product } = await supabase
          .from('products')
          .select('name, sku')
          .eq('id', item.productId)
          .single();

        validationResults.push({
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          productSku: product?.sku || 'N/A',
          requestedQuantity: item.quantity,
          availableStock,
          isValid,
          error: !isValid ? `Insufficient stock. Available: ${availableStock}, Requested: ${item.quantity}` : null
        });

      } catch (error) {
        console.error('[Inventory Validation] Error validating item:', error);
        validationResults.push({
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableStock: 0,
          isValid: false,
          error: 'Validation failed'
        });
        allValid = false;
      }
    }

    // Return validation results
    return NextResponse.json({
      valid: allValid,
      items: validationResults,
      summary: {
        totalItems: items.length,
        validItems: validationResults.filter(r => r.isValid).length,
        invalidItems: validationResults.filter(r => !r.isValid).length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Validation] Error:', error);
    return NextResponse.json({
      error: 'Failed to validate inventory'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const warehouseId = searchParams.get('warehouseId') || 'main';

    if (!productId) {
      return NextResponse.json({ 
        error: 'productId parameter is required' 
      }, { status: 400 });
    }

    // Get available stock for single product
    const { data: stockData, error: stockError } = await supabase
      .rpc('get_available_stock', {
        p_product_id: productId,
        p_warehouse_id: warehouseId
      });

    if (stockError) {
      console.error('[Inventory Validation] Stock check error:', stockError);
      return NextResponse.json({
        error: 'Unable to check stock availability'
      }, { status: 500 });
    }

    // Get detailed inventory information
    const { data: inventory, error: invError } = await supabase
      .from('inventory_status')
      .select('*')
      .eq('product_id', productId)
      .eq('warehouse_id', warehouseId)
      .single();

    if (invError && invError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[Inventory Validation] Inventory query error:', invError);
    }

    return NextResponse.json({
      productId,
      warehouseId,
      availableStock: stockData || 0,
      inventory: inventory || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Inventory Validation] Error:', error);
    return NextResponse.json({
      error: 'Failed to get inventory status'
    }, { status: 500 });
  }
}
