import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get order items with product information to calculate top products
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        quantity,
        total_price,
        products (
          id,
          name,
          image_url
        )
      `)
      .not('products', 'is', null);

    if (itemsError) throw itemsError;

    // Aggregate sales data by product
    const productSales: { [key: string]: any } = {};

    orderItems?.forEach(item => {
      const product = item.products;
      if (!product || !Array.isArray(product) || product.length === 0) return;

      const productData = product[0]; // Get the first product from the array
      const productId = productData.id;

      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          name: productData.name,
          sales: 0,
          revenue: 0,
          image_url: productData.image_url
        };
      }

      productSales[productId].sales += item.quantity || 0;
      productSales[productId].revenue += parseFloat(item.total_price || 0);
    });

    // Convert to array and sort by revenue (highest first)
    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5) // Top 5 products
      .map((product: any) => ({
        id: product.id,
        name: product.name,
        sales: product.sales,
        revenue: Math.round(product.revenue * 100) / 100, // Round to 2 decimal places
        image_url: product.image_url
      }));

    return NextResponse.json({
      products: topProducts
    });

  } catch (error) {
    console.error('Admin dashboard top products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
}
