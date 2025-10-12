import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get cart contents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or session ID required' },
        { status: 400 }
      );
    }

    // First, let's check if the shopping_cart table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('shopping_cart')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Shopping cart table error:', tableError);

      // If table doesn't exist, return empty cart
      if (tableError.code === 'PGRST116' || tableError.message?.includes('does not exist')) {
        console.log('Shopping cart table does not exist, returning empty cart');
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

      return NextResponse.json(
        { error: `Database error: ${tableError.message}` },
        { status: 500 }
      );
    }

    // Get cart items first
    let cartQuery = supabase
      .from('shopping_cart')
      .select('id, product_id, quantity, price_at_time, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (userId) {
      cartQuery = cartQuery.eq('user_id', userId);
    } else {
      cartQuery = cartQuery.eq('session_id', sessionId);
    }

    const { data: cartItems, error } = await cartQuery;

    if (error) {
      console.error('Error fetching cart:', error);
      return NextResponse.json(
        { error: `Failed to fetch cart: ${error.message}` },
        { status: 500 }
      );
    }

    // Get product details for each cart item
    const items = await Promise.all((cartItems || []).map(async (item) => {
      const { data: product } = await supabase
        .from('main_site_products')
        .select('id, name, description, short_description, our_price, fire_price, image_url, sku, stock_quantity, is_active')
        .eq('id', item.product_id)
        .single();

      const itemTotal = parseFloat(item.price_at_time) * item.quantity;

      return {
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        priceAtTime: parseFloat(item.price_at_time),
        itemTotal,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        product: product ? {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          currentPrice: parseFloat(product.our_price),
          vipPrice: product.fire_price ? parseFloat(product.fire_price) : null,
          image_url: product.image_url,
          stockQuantity: product.stock_quantity,
          isActive: product.is_active,
          inStock: (product.stock_quantity || 0) > 0
        } : null
      };
    }));

    // Calculate cart totals
    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

    // Calculate tax and shipping (basic logic - customize as needed)
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
    const total = subtotal + taxAmount + shippingAmount;

    return NextResponse.json({
      success: true,
      cart: {
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        shippingAmount: parseFloat(shippingAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, userId, sessionId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or session ID required' },
        { status: 400 }
      );
    }

    // Get product details and current price
    const { data: product, error: productError } = await supabase
      .from('main_site_products')
      .select('id, name, our_price, fire_price, stock_quantity, is_active, nicotine_product, tobacco_product')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.is_active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    // COMPLIANCE CHECK: Block nicotine/tobacco products
    if (product.nicotine_product || product.tobacco_product) {
      return NextResponse.json(
        { error: 'This product is not available for purchase on this site' },
        { status: 403 }
      );
    }

    // INVENTORY VALIDATION: Check against external inventory system
    const currentStock = product.stock_quantity || 0;

    // If stock is 0 or negative, try to get real-time inventory from external system
    if (currentStock <= 0) {
      console.log(`[Cart API] Product ${productId} has ${currentStock} stock, checking external inventory...`);

      // TODO: Add real-time inventory check from Zoho or external system
      // For now, block the purchase if local stock is 0
      if (currentStock < quantity) {
        return NextResponse.json(
          {
            error: 'Product is currently out of stock',
            details: 'Please check back later or contact support for availability'
          },
          { status: 400 }
        );
      }
    } else if (currentStock < quantity) {
      return NextResponse.json(
        {
          error: `Only ${currentStock} items available in stock`,
          requested: quantity,
          available: currentStock
        },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    let existingQuery = supabase
      .from('shopping_cart')
      .select('id, quantity')
      .eq('product_id', productId);

    if (userId) {
      existingQuery = existingQuery.eq('user_id', userId);
    } else {
      existingQuery = existingQuery.eq('session_id', sessionId);
    }

    const { data: existingItem } = await existingQuery.single();

    const currentPrice = parseFloat(product.our_price);

    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      
      if ((product.stock_quantity || 0) < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabase
        .from('shopping_cart')
        .update({ 
          quantity: newQuantity,
          price_at_time: currentPrice, // Update to current price
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id);

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
        quantity: newQuantity
      });

    } else {
      // Add new item
      const cartItem = {
        product_id: productId,
        quantity,
        price_at_time: currentPrice,
        ...(userId ? { user_id: userId } : { session_id: sessionId })
      };

      const { error: insertError } = await supabase
        .from('shopping_cart')
        .insert(cartItem);

      if (insertError) {
        console.error('Error adding to cart:', insertError);
        return NextResponse.json(
          { error: 'Failed to add to cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Item added to cart successfully',
        action: 'added',
        quantity
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity, userId, sessionId } = body;

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

    // Get current cart item and product details for validation
    let cartItemQuery = supabase
      .from('shopping_cart')
      .select('product_id, quantity')
      .eq('id', cartItemId);

    if (userId) {
      cartItemQuery = cartItemQuery.eq('user_id', userId);
    } else if (sessionId) {
      cartItemQuery = cartItemQuery.eq('session_id', sessionId);
    }

    const { data: cartItemData } = await cartItemQuery.single();

    if (!cartItemData) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Get current product stock
    const { data: product } = await supabase
      .from('main_site_products')
      .select('stock_quantity, is_active')
      .eq('id', cartItemData.product_id)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.is_active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    // Validate stock availability
    if ((product.stock_quantity || 0) < quantity) {
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
      let deleteQuery = supabase
        .from('shopping_cart')
        .delete()
        .eq('id', cartItemId);

      if (userId) {
        deleteQuery = deleteQuery.eq('user_id', userId);
      } else if (sessionId) {
        deleteQuery = deleteQuery.eq('session_id', sessionId);
      }

      const { error: deleteError } = await deleteQuery;

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
    let updateQuery = supabase
      .from('shopping_cart')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId);

    if (userId) {
      updateQuery = updateQuery.eq('user_id', userId);
    } else if (sessionId) {
      updateQuery = updateQuery.eq('session_id', sessionId);
    }

    const { error: updateError } = await updateQuery;

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

// Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or session ID required' },
        { status: 400 }
      );
    }

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
