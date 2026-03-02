import { createClient } from '@supabase/supabase-js';

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
  checkoutAtomic?(data: any): Promise<any>;
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

// Storage abstraction layer for Next.js
export async function getStorage(): Promise<IStorage> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    // Products
    async getProducts(filters?: any) {
      let query = supabase.from('main_site_products').select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
        nicotine_product, tobacco_product, source_id, source_parent, ingredients, materials,
        created_at, updated_at
      `)
      // STRICT: No Kratom or related substances
      .not('name', 'ilike', '%kratom%')
      .not('name', 'ilike', '%7-oh%')
      .not('name', 'ilike', '%7-hydroxy%')
      .not('name', 'ilike', '%mitragynine%')
      .not('name', 'ilike', '%7-ohmz%')
      .not('description', 'ilike', '%kratom%')
      .not('description', 'ilike', '%7-oh%')
      .not('description', 'ilike', '%7-hydroxy%')
      .not('description', 'ilike', '%mitragynine%')
      .not('description', 'ilike', '%7-ohmz%')
      .not('name', 'ilike', '%tincture%')
      .not('name', 'ilike', '%salve%')
      .not('description', 'ilike', '%tincture%')
      .not('description', 'ilike', '%salve%');

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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        // STRICT: No Kratom-related categories
        .not('slug', 'ilike', '%kratom%')
        .not('slug', 'ilike', '%hydroxy%')
        .not('slug', 'ilike', '%7-oh%')
        .not('name', 'ilike', '%kratom%')
        .not('name', 'ilike', '%hydroxy%')
        .not('name', 'ilike', '%7-oh%')
        .not('slug', 'ilike', '%tincture%')
        .not('slug', 'ilike', '%salve%')
        .not('name', 'ilike', '%tincture%')
        .not('name', 'ilike', '%salve%')
        .order('name');
      
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

        const { data, error } = await supabase
          .from('main_site_products')
          .select(`
            id, name, description, short_description, our_price, sale_price,
            image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
            nicotine_product, tobacco_product, source_id, source_parent, ingredients, materials,
            created_at, updated_at
          `)
          .eq('is_active', true)
          // STRICT: No Kratom or related substances
          .not('name', 'ilike', '%kratom%')
          .not('name', 'ilike', '%7-oh%')
          .not('name', 'ilike', '%7-hydroxy%')
          .not('name', 'ilike', '%mitragynine%')
          .not('name', 'ilike', '%7-ohmz%')
          .not('description', 'ilike', '%kratom%')
          .not('description', 'ilike', '%7-oh%')
          .not('description', 'ilike', '%7-hydroxy%')
          .not('description', 'ilike', '%mitragynine%')
          .not('description', 'ilike', '%7-ohmz%')
          .not('name', 'ilike', '%tincture%')
          .not('name', 'ilike', '%salve%')
          .not('description', 'ilike', '%tincture%')
          .not('description', 'ilike', '%salve%')
          .limit(100);

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

    async updateOrder(id: string, updates: any) {
      // Map camelCase to snake_case for specific fields if needed
      const dbUpdates: any = { ...updates };
      if (updates.paymentStatus) {
        dbUpdates.payment_status = updates.paymentStatus;
        delete dbUpdates.paymentStatus;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
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
          gift_message: order.giftMessage ?? null,
          is_gift: order.isGift ?? false,
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
          price_at_purchase: item.priceAtPurchase,
          total_price: item.totalPrice,
        })
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
        .from('payment_transactions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getUserTransactions(userId: string) {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async getOrderTransactions(orderId: string) {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async createWebhookEvent(event: any) {
      const { data, error } = await supabase
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
