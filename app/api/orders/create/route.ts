import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';
import { requireAuth } from '../../../lib/requireAuth';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  items: z.array(z.object({ 
    productId: z.string().uuid(), 
    quantity: z.number().int().positive() 
  })).min(1),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('US'),
    phone: z.string().optional()
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('US'),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional(),
  customerNotes: z.string().optional(),
  giftMessage: z.string().optional(),
  isGift: z.boolean().default(false)
});

// Generate order number in format: DC-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `DC-${year}${month}${day}-${random}`;
}

// Calculate tax based on shipping address
function calculateTax(subtotal: number, shippingState: string): number {
  // Simplified tax calculation - in production, use a proper tax service
  const taxRates: Record<string, number> = {
    'CA': 0.0875, // California
    'NY': 0.08,   // New York
    'TX': 0.0625, // Texas
    'FL': 0.06,   // Florida
    'WA': 0.065,  // Washington
    // Add more states as needed
  };
  
  const rate = taxRates[shippingState] || 0;
  return subtotal * rate;
}

// Calculate shipping based on order total and location
function calculateShipping(subtotal: number, shippingState: string): number {
  if (subtotal >= 75) return 0;
  
  // Different rates for different regions
  const shippingRates: Record<string, number> = {
    'CA': 8.99,
    'NY': 9.99,
    'TX': 7.99,
    'FL': 8.99,
    'WA': 9.99,
  };
  
  return shippingRates[shippingState] || 12.99; // Default rate for other states
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = CreateOrderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid order data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { items, shippingAddress, billingAddress, customerNotes, giftMessage, isGift } = parse.data;

    // Get storage instance
    const storage = await getStorage();

    // Validate all products exist and are in stock
    const productDetails = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await storage.getProduct(item.productId);
      if (!product) {
        return NextResponse.json({ 
          error: `Product not found: ${item.productId}` 
        }, { status: 404 });
      }

      if (product.inStock === false) {
        return NextResponse.json({ 
          error: `Product out of stock: ${product.name}` 
        }, { status: 409 });
      }

      // Check if we have enough stock (if stock tracking is enabled)
      if (product.stockQuantity !== null && product.stockQuantity < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
        }, { status: 409 });
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      productDetails.push({
        product,
        quantity: item.quantity,
        unitPrice: Number(product.price),
        totalPrice: itemTotal
      });
    }

    // Perform real-time inventory validation
    try {
      const inventoryValidation = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/inventory/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          userId: user.id
        })
      });

      if (inventoryValidation.ok) {
        const validationResult = await inventoryValidation.json();
        if (!validationResult.valid) {
          const invalidItems = validationResult.items.filter((item: any) => !item.isValid);
          return NextResponse.json({
            error: 'Insufficient inventory for order',
            details: invalidItems.map((item: any) => ({
              productName: item.productName,
              error: item.error
            }))
          }, { status: 409 });
        }
      } else {
        console.warn('[Order Creation] Inventory validation request failed');
      }
    } catch (error) {
      console.error('[Order Creation] Inventory validation error:', error);
      // Continue with order creation but log the error
    }

    // Calculate tax and shipping
    const tax = calculateTax(subtotal, shippingAddress.state);
    const shipping = calculateShipping(subtotal, shippingAddress.state);
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Use billing address if provided, otherwise use shipping address
    const finalBillingAddress = billingAddress || {
      ...shippingAddress,
      email: user.email
    };

    // Create order using atomic checkout if available
    if (typeof storage.checkoutAtomic === 'function') {
      try {
        const { order, items: createdItems } = await storage.checkoutAtomic({
          userId: user.id,
          items: items,
          shippingAddress,
          billingAddress: finalBillingAddress,
          orderNumber,
          customerNotes,
          giftMessage,
          isGift,
          subtotal: subtotal.toString(),
          taxAmount: tax.toString(),
          shippingAmount: shipping.toString(),
          totalAmount: total.toString()
        });

        return NextResponse.json({
          success: true,
          order: {
            id: order.id,
            orderNumber: order.orderNumber || orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            subtotal,
            tax,
            shipping,
            total,
            createdAt: order.createdAt
          },
          items: createdItems.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: Number(item.priceAtPurchase),
            totalPrice: Number(item.priceAtPurchase) * item.quantity
          })),
          shippingAddress,
          billingAddress: finalBillingAddress
        }, { status: 201 });

      } catch (error) {
        console.error('[Order Creation] Atomic checkout failed:', error);
        // Fall through to manual creation
      }
    }

    // Manual order creation (fallback)
    const order = await storage.createOrder({
      userId: user.id,
      orderNumber,
      subtotalAmount: subtotal.toString(),
      taxAmount: tax.toString(),
      shippingAmount: shipping.toString(),
      totalAmount: total.toString(),
      paymentStatus: 'pending',
      paymentMethod: null,
      shippingAddress,
      billingAddress: finalBillingAddress,
      status: 'pending',
      customerNotes,
      giftMessage,
      isGift
    });

    // Create order items
    const createdItems = [];
    for (const detail of productDetails) {
      const orderItem = await storage.createOrderItem({
        orderId: order.id,
        productId: detail.product.id,
        productName: detail.product.name,
        productSku: detail.product.sku,
        productImageUrl: detail.product.imageUrl,
        quantity: detail.quantity,
        priceAtPurchase: detail.unitPrice.toString(),
        totalPrice: detail.totalPrice.toString()
      });

      createdItems.push({
        id: orderItem.id,
        productId: orderItem.productId,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        unitPrice: detail.unitPrice,
        totalPrice: detail.totalPrice
      });
    }

    // Clear user's cart
    await storage.clearCart(user.id);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber || orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal,
        tax,
        shipping,
        total,
        createdAt: order.createdAt
      },
      items: createdItems,
      shippingAddress,
      billingAddress: finalBillingAddress
    }, { status: 201 });

  } catch (error) {
    console.error('[Order Creation] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}
