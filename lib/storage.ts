import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from './compliance-filters';

/**
 * IMPORTANT: Database Table Usage Guide for DOPE CITY
 *
 * CORRECT TABLE: Use "main_site_products" for all product operations
 * - This is the primary products table with proper schema
 * - Contains: id, name, description, our_price, image_url, image_urls, etc.
 * - Supports both single image_url and image_urls array
 *
 * DEPRECATED TABLES: DO NOT USE
 * - "brands_new" - Legacy brands table, not for products
 * - "products" - Old products table, replaced by main_site_products
 *
 * IMAGE HANDLING:
 * - Primary image: Use image_url field
 * - Gallery images: Use image_urls array field
 * - Both fields are text type, image_urls supports arrays
 */

// Storage interface for consistency
export interface IStorage {
  getProducts(filters?: any): Promise<any[]>;
  getProduct(id: string): Promise<any>;
  getProductVariations(product: any): Promise<any[]>;
  createProduct(product: any): Promise<any>;
  getCategories(): Promise<any[]>;
  getBrands(): Promise<any[]>;
  getUser(id: string): Promise<any>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, updates: any): Promise<any>;
  trackUserBehavior(behavior: any): Promise<any>;
  getUserBehavior(userId: string, limit?: number): Promise<any[]>;
  getAllProducts(): Promise<any[]>;
  getUserOrders(userId: string): Promise<any[]>;
  getOrder(id: string): Promise<any>;
  getProductSimilarity(productId: string): Promise<any[]>;
  createProductSimilarity(similarity: any): Promise<any>;
  
  // operations for database persistence
  checkoutAtomic?(params: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress?: unknown;
    billingAddress?: unknown;
    orderNumber?: string;
    subtotal?: string;
    taxAmount?: string;
    shippingAmount?: string;
    totalAmount?: string;
    customerNotes?: string;
    giftMessage?: string;
    isGift?: boolean;
  }): Promise<any>;
  createOrder(order: any): Promise<any>;
  updateOrder(id: string, updates: any): Promise<any>;
  createOrderItem(item: any): Promise<any>;
  clearCart(userId: string): Promise<void>;
  createTransaction(tx: any): Promise<any>;
  updateTransaction(id: string, updates: any): Promise<any>;
  getUserTransactions(userId: string): Promise<any[]>;
  getOrderTransactions(orderId: string): Promise<any[]>;
  createWebhookEvent(event: any): Promise<any>;
  createPaymentMethod?(pm: any): Promise<any>;
  [key: string]: any;
}

// Module-level singleton — created once per process, reused on every request.
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient(): ReturnType<typeof createClient> | null {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // During next build, env vars may be placeholder strings — don't crash the build.
  const isPlaceholder = (v?: string) =>
    !v || v === 'placeholder' || v.includes('placeholder.supabase');

  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseKey)) {
    return null;
  }

  _supabase = createClient(supabaseUrl!, supabaseKey!);
  return _supabase;
}

// Storage abstraction layer for Next.js
export async function getStorage(): Promise<IStorage> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase client not available — check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  return {
    // Products
    async getProducts(filters?: any) {
      let query = supabase.from('main_site_products').select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
        nicotine_product, tobacco_product, source_id, source_parent, ingredients, materials,
        created_at, updated_at
      `)
      .eq('is_active', true); // DEFAULT: only return active products
      // STRICT: No restricted substances or product types (centralized in compliance-filters.ts)
      query = applyRestrictedProductFilter(query);

      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.brandId) query = query.eq('brand_id', filters.brandId);
      if (filters?.featured !== undefined) query = query.eq('featured', filters.featured);
      if (filters?.vipExclusive !== undefined) query = query.eq('vip_exclusive', filters.vipExclusive);
      if (filters?.priceMin) query = query.gte('our_price', filters.priceMin);
      if (filters?.priceMax) query = query.lte('our_price', filters.priceMax);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getProduct(id: string) {
      // Handle both UUID strings and integer IDs
      let productId: string | number = id;

      // If it's a valid UUID format, keep as string
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        // Try to parse as integer for backward compatibility
        const parsedInt = parseInt(id, 10);
        if (!isNaN(parsedInt)) {
          productId = parsedInt;
        }
      }

      const { data, error } = await supabase
        .from('main_site_products')
        .select(`
          id, name, display_name, description, short_description, our_price, sale_price,
          image_url, image_urls, gallery_images, sku, stock_quantity, is_active, featured, 
          brand_id, brand_name, category_id, category_slug, product_type,
          nicotine_product, tobacco_product, source_id, source_parent, ingredients, materials,
          "coa-url", ship_restrictions, cannabinoid_profile, compliance_info,
          farm_bill_compliant, age_restricted, minimum_age,
          created_at, updated_at
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error, 'ID:', productId);
        throw error;
      }

      // STRICT COMPLIANCE: Verify product is not Kratom-related
      if (data) {
        const name = data.name?.toLowerCase() || '';
        const desc = data.description?.toLowerCase() || '';
        const prohibited = ['kratom', '7-oh', '7-hydroxy', 'mitragynine', '7-ohmz'];
        
        if (prohibited.some(term => name.includes(term) || desc.includes(term))) {
          console.warn(`🛑 COMPLIANCE: Blocked fetching prohibited product ID ${productId}: ${data.name}`);
          return null;
        }
      }

      return data;
    },

    async getProductVariations(product: any) {
      if (!product) return [];

      const parentId = product.source_parent || product.source_id;
      if (!parentId) return [];

      const { data, error } = await supabase
        .from('main_site_products')
        .select(`
          id, name, image_url, image_urls, our_price, sale_price, stock_quantity, source_id, source_parent
        `)
        .or(`source_id.eq.${parentId},source_parent.eq.${parentId}`)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching variations:', error);
        return [];
      }

      return data || [];
    },

    async createProduct(product: any) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Categories
    async getCategories() {
      let catQuery = supabase
        .from('categories')
        .select('*');
      // STRICT: No restricted categories (centralized in compliance-filters.ts)
      catQuery = applyRestrictedProductFilter(catQuery, ['slug', 'name']);
      const { data, error } = await catQuery.order('name');
      
      if (error) throw error;
      return data || [];
    },

    // Brands
    async getBrands() {
      const { data, error } = await supabase
        .from('brands_new')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },

    // Users
    async getUser(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async createUser(user: any) {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateUser(id: string, updates: any) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // User Behavior for Recommendations (with graceful fallback)
    async trackUserBehavior(behavior: any) {
      try {
        const { data, error } = await supabase
          .from('user_behavior')
          .insert(behavior)
          .select()
          .single();

        if (error) {
          // If table doesn't exist, log but don't throw
          if (error.code === '42P01') {
            console.warn('⚠️ user_behavior table does not exist, skipping behavior tracking');
            return null;
          }
          throw error;
        }
        return data;
      } catch (error) {
        console.warn('⚠️ Error tracking user behavior:', error);
        return null;
      }
    },

    async getUserBehavior(userId: string, limit = 50) {
      try {
        const { data, error } = await supabase
          .from('user_behavior')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          // If table doesn't exist, return empty array
          if (error.code === '42P01') {
            console.warn('⚠️ user_behavior table does not exist, returning empty behavior');
            return [];
          }
          throw error;
        }
        return data || [];
      } catch (error) {
        console.warn('⚠️ Error fetching user behavior:', error);
        return [];
      }
    },

    // Get all products for recommendations (COMPLIANCE: Excludes nicotine products and prohibited substances)
    async getAllProducts() {
      try {
        console.log('🔒 COMPLIANCE: Fetching only safe products for recommendations');

        let recQuery = supabase
          .from('main_site_products')
          .select(`
            id, name, description, short_description, our_price, sale_price,
            image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
            nicotine_product, tobacco_product, source_id, source_parent, ingredients, materials,
            created_at, updated_at
          `)
          .eq('is_active', true);
        // STRICT: No restricted substances or product types (centralized in compliance-filters.ts)
        recQuery = applyRestrictedProductFilter(recQuery);
        const { data, error } = await recQuery.limit(100);

        if (error) throw error;

        const products = data || [];
        console.log(`✅ COMPLIANCE: Filtered ${products.length} products for recommendations`);

        return products;
      } catch (error) {
        console.warn('⚠️ Error fetching all products:', error);
        return [];
      }
    },

    async getUserOrders(userId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async getOrder(id: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) return null;
      return data;
    },

    // Product Similarity for Recommendations
    async getProductSimilarity(productId: string) {
      const { data, error } = await supabase
        .from('product_similarity')
        .select('*')
        .eq('product_id', productId)
        .order('similarity_score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },

    async createProductSimilarity(similarity: any) {
      const { data, error } = await supabase
        .from('product_similarity')
        .insert(similarity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async createOrder(order: any) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: order.userId,
          order_number: order.orderNumber,
          customer_email: order.customerEmail,
          customer_first_name: order.customerFirstName,
          customer_last_name: order.customerLastName,
          customer_phone: order.customerPhone ?? null,
          status: order.status ?? 'pending',
          payment_status: order.paymentStatus ?? 'pending',
          payment_method: order.paymentMethod ?? null,
          subtotal_amount: order.subtotalAmount,
          tax_amount: order.taxAmount,
          shipping_amount: order.shippingAmount,
          total_amount: order.totalAmount,
          shipping_address: order.shippingAddress,
          billing_address: order.billingAddress,
          customer_notes: order.customerNotes ?? null,
          admin_notes: order.adminNotes ?? null,
          gift_message: order.giftMessage ?? null,
          is_gift: order.isGift ?? false,
          transaction_id: order.transactionId ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async createOrderItem(item: any) {
      const { data, error } = await supabase
        .from('order_items')
        .insert({
          order_id: item.orderId,
          product_id: item.productId,
          product_name: item.productName,
          product_sku: item.productSku ?? null,
          product_image_url: item.productImageUrl ?? null,
          quantity: item.quantity,
          unit_price: item.unitPrice ?? item.priceAtPurchase,
          total_price: item.totalPrice,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateOrder(id: string, updates: any) {
      const dbUpdates: any = { ...updates };
      
      // Map camelCase to snake_case
      if (updates.userId) { dbUpdates.user_id = updates.userId; delete dbUpdates.userId; }
      if (updates.orderNumber) { dbUpdates.order_number = updates.orderNumber; delete dbUpdates.orderNumber; }
      if (updates.customerEmail) { dbUpdates.customer_email = updates.customerEmail; delete dbUpdates.customerEmail; }
      if (updates.customerFirstName) { dbUpdates.customer_first_name = updates.customerFirstName; delete dbUpdates.customerFirstName; }
      if (updates.customerLastName) { dbUpdates.customer_last_name = updates.customerLastName; delete dbUpdates.customerLastName; }
      if (updates.customerPhone) { dbUpdates.customer_phone = updates.customerPhone; delete dbUpdates.customerPhone; }
      if (updates.paymentStatus) { dbUpdates.payment_status = updates.paymentStatus; delete dbUpdates.paymentStatus; }
      if (updates.paymentMethod) { dbUpdates.payment_method = updates.paymentMethod; delete dbUpdates.paymentMethod; }
      if (updates.fulfillmentStatus) { dbUpdates.fulfillment_status = updates.fulfillmentStatus; delete dbUpdates.fulfillmentStatus; }
      if (updates.transactionId) { dbUpdates.transaction_id = updates.transactionId; delete dbUpdates.transactionId; }
      if (updates.subtotalAmount) { dbUpdates.subtotal_amount = updates.subtotalAmount; delete dbUpdates.subtotalAmount; }
      if (updates.taxAmount) { dbUpdates.tax_amount = updates.taxAmount; delete dbUpdates.taxAmount; }
      if (updates.shippingAmount) { dbUpdates.shipping_amount = updates.shippingAmount; delete dbUpdates.shippingAmount; }
      if (updates.discountAmount) { dbUpdates.discount_amount = updates.discountAmount; delete dbUpdates.discountAmount; }
      if (updates.totalAmount) { dbUpdates.total_amount = updates.totalAmount; delete dbUpdates.totalAmount; }
      if (updates.billingAddress) { dbUpdates.billing_address = updates.billingAddress; delete dbUpdates.billingAddress; }
      if (updates.shippingAddress) { dbUpdates.shipping_address = updates.shippingAddress; delete dbUpdates.shippingAddress; }
      if (updates.customerNotes) { dbUpdates.customer_notes = updates.customerNotes; delete dbUpdates.customerNotes; }
      if (updates.adminNotes) { dbUpdates.admin_notes = updates.adminNotes; delete dbUpdates.adminNotes; }
      if (updates.giftMessage) { dbUpdates.gift_message = updates.giftMessage; delete dbUpdates.giftMessage; }
      if (updates.isGift !== undefined) { dbUpdates.is_gift = updates.isGift; delete dbUpdates.isGift; }
      if (updates.trackingNumber) { dbUpdates.tracking_number = updates.trackingNumber; delete dbUpdates.trackingNumber; }
      if (updates.shippedAt) { dbUpdates.shipped_at = updates.shippedAt; delete dbUpdates.shippedAt; }
      if (updates.deliveredAt) { dbUpdates.delivered_at = updates.deliveredAt; delete dbUpdates.deliveredAt; }

      const { data, error } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async clearCart(userId: string) {
      // Find the user's cart, then delete its items
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (cart?.id) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);
      }
    },

    async createTransaction(tx: any) {
      const { data, error } = await supabase
        // @ts-ignore
        .from('payment_transactions')
        .insert({
          order_id: tx.orderId,
          kajapay_transaction_id: tx.kajaPayTransactionId,
          kajapay_reference_number: tx.kajaPayReferenceNumber,
          transaction_type: tx.transactionType,
          amount: tx.amount,
          currency: tx.currency || 'USD',
          status: tx.status,
          kajapay_status_code: tx.kajaPayStatusCode,
          auth_code: tx.authCode,
          error_message: tx.errorMessage,
          payment_method_data: tx.paymentMethodData,
          transaction_details: tx.transactionDetails
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateTransaction(id: string, updates: any) {
      const dbUpdates: any = { ...updates };
      
      // Map camelCase to snake_case
      if (updates.orderId) { dbUpdates.order_id = updates.orderId; delete dbUpdates.orderId; }
      if (updates.kajaPayTransactionId) { dbUpdates.kajapay_transaction_id = updates.kajaPayTransactionId; delete dbUpdates.kajaPayTransactionId; }
      if (updates.kajaPayReferenceNumber) { dbUpdates.kajapay_reference_number = updates.kajaPayReferenceNumber; delete dbUpdates.kajaPayReferenceNumber; }
      if (updates.transactionType) { dbUpdates.transaction_type = updates.transactionType; delete dbUpdates.transactionType; }
      if (updates.kajaPayStatusCode) { dbUpdates.kajapay_status_code = updates.kajaPayStatusCode; delete dbUpdates.kajaPayStatusCode; }
      if (updates.authCode) { dbUpdates.auth_code = updates.authCode; delete dbUpdates.authCode; }
      if (updates.errorMessage) { dbUpdates.error_message = updates.errorMessage; delete dbUpdates.errorMessage; }
      if (updates.paymentMethodData) { dbUpdates.payment_method_data = updates.paymentMethodData; delete dbUpdates.paymentMethodData; }
      if (updates.transactionDetails) { dbUpdates.transaction_details = updates.transactionDetails; delete dbUpdates.transactionDetails; }

      const { data, error } = await supabase
        // @ts-ignore
        .from('payment_transactions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getUserTransactions(userId: string) {
      // First get all order IDs for this user
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', userId);
      
      if (!orders || orders.length === 0) return [];
      
      const orderIds = orders.map(o => o.id);
      
      const { data, error } = await supabase
        // @ts-ignore
        .from('payment_transactions')
        .select('*')
        .in('order_id', orderIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async getOrderTransactions(orderId: string) {
      const { data, error } = await supabase
        // @ts-ignore
        .from('payment_transactions')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async createWebhookEvent(event: any) {
      const { data, error } = await supabase
        // @ts-ignore
        .from('kajapay_webhook_events')
        .insert({
          event_type: event.eventType,
          kajapay_transaction_id: event.kajaPayTransactionId,
          payload: event.payload,
          processed: event.processed,
          processed_at: event.processedAt
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  };
}
