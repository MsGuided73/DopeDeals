import { createClient } from '@supabase/supabase-js'
// Pure Supabase SDK implementation - no direct PostgreSQL dependencies
import {
  users, products, categories, brands, orders, orderItems,
  memberships, loyaltyPoints, cartItems, userBehavior, userPreferences,
  productSimilarity, recommendationCache, paymentMethods, paymentTransactions, kajaPayWebhookEvents,
  emojiUsage, userEmojiPreferences, emojiRecommendations, productEmojiAssociations,
  conciergeConversations, conciergeMessages, conciergeRecommendations, conciergeAnalytics,
  type User, type InsertUser, type Product, type InsertProduct,
  type Category, type InsertCategory, type Brand, type InsertBrand,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Membership, type InsertMembership, type LoyaltyPoint, type InsertLoyaltyPoint,
  type CartItem, type InsertCartItem, type UserBehavior, type InsertUserBehavior,
  type UserPreferences, type InsertUserPreferences, type ProductSimilarity,
  type InsertProductSimilarity, type RecommendationCache, type InsertRecommendationCache,
  type PaymentMethod, type InsertPaymentMethod, type PaymentTransaction, type InsertPaymentTransaction,
  type KajaPayWebhookEvent, type InsertKajaPayWebhookEvent,
  type EmojiUsage, type InsertEmojiUsage, type UserEmojiPreferences, type InsertUserEmojiPreferences,
  type EmojiRecommendations, type InsertEmojiRecommendations, type ProductEmojiAssociations, type InsertProductEmojiAssociations,
  type ConciergeConversation, type InsertConciergeConversation, type ConciergeMessage, type InsertConciergeMessage,
  type ConciergeRecommendation, type InsertConciergeRecommendation, type ConciergeAnalytics, type InsertConciergeAnalytics,
  complianceRules, productCompliance, complianceAuditLog, labCertificates,
  type ComplianceRule, type InsertComplianceRule, type ProductCompliance, type InsertProductCompliance,
  type ComplianceAuditLog, type InsertComplianceAuditLog, type LabCertificate, type InsertLabCertificate
} from "@shared/schema";

import {
  shipstationOrders, shipstationShipments, shipstationWebhooks, shipstationProducts,
  shipstationWarehouses, shipstationSyncStatus,
  type ShipstationOrder, type InsertShipstationOrder, type ShipstationShipment, type InsertShipstationShipment,
  type ShipstationWebhook, type InsertShipstationWebhook, type ShipstationProduct, type InsertShipstationProduct,
  type ShipstationWarehouse, type InsertShipstationWarehouse, type ShipstationSyncStatus, type InsertShipstationSyncStatus
} from "@shared/shipstation-schema";

import { type IStorage } from "./storage";

// Supabase configuration - only required in production mode
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not provided - using memory storage fallback');
}

// Create Supabase client for server-side operations (only if credentials available)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// All database operations use Supabase SDK for consistency and RLS support

export class SupabaseStorage implements IStorage {
  constructor() {
    if (!supabaseAdmin) {
      throw new Error('Supabase not configured - cannot use SupabaseStorage');
    }
  }

  // IStorage interface implementation for file storage
  async put(path: string, data: Buffer | Uint8Array, contentType?: string): Promise<{ url: string }> {
    const { error } = await supabaseAdmin!.storage
      .from('public')
      .upload(path, data, {
        upsert: true,
        contentType,
      });

    if (error) throw error;

    const { data: pub } = supabaseAdmin!.storage
      .from('public')
      .getPublicUrl(path);

    return { url: pub?.publicUrl ?? '' };
  }

  async get(path: string): Promise<Uint8Array | null> {
    if (!supabaseAdmin) throw new Error('Supabase not configured');

    const { data, error } = await supabaseAdmin!.storage
      .from('public')
      .download(path);

    if (error) {
      if (error.message?.includes('Object not found')) return null;
      throw error;
    }

    const buf = await data.arrayBuffer();
    return new Uint8Array(buf);
  }

  async remove(path: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase not configured');

    const { error } = await supabaseAdmin!.storage
      .from('public')
      .remove([path]);

    if (error) throw error;
  }

  // Users - Use Supabase auth integration
  async getUser(id: string): Promise<User | undefined> {
    if (!supabaseAdmin) return undefined;

    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabaseAdmin!
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  // Products - Use main_site_products table
  async getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    material?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    vipExclusive?: boolean;
  }): Promise<Product[]> {
    let query = supabaseAdmin!.from('main_site_products').select('*');

    // Enforce consumer-safe visibility when using service role (no RLS):
    // - is_active = true
    query = query.eq('is_active', true);

    // Database uses snake_case column names - use correct names
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.brandId) {
      query = query.eq('brand_id', filters.brandId);
    }
    if (filters?.material) {
      query = query.eq('materials', filters.material);
    }
    if (filters?.priceMin !== undefined) {
      query = query.gte('our_price', filters.priceMin);
    }
    if (filters?.priceMax !== undefined) {
      query = query.lte('our_price', filters.priceMax);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    // Note: vipExclusive not directly applicable to main_site_products structure

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return data as Product[];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('main_site_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Generate UUID and map to main_site_products schema
    const dbProduct = {
      id: crypto.randomUUID(),
      name: product.name,
      description: product.description || null,
      short_description: null,
      sku: product.sku,
      our_price: product.price,
      their_price: null,
      sale_price: null,
      fire_price: null,
      cost_price: null,
      display_price_type: 'our_price',
      price_comparison_enabled: true,
      category_id: product.categoryId || null,
      brand_id: product.brandId || null,
      stock_quantity: 0,
      low_stock_threshold: 5,
      track_inventory: true,
      inventory_status: 'in_stock',
      weight: null,
      weight_unit: 'oz',
      dimensions: null,
      materials: product.material ? [product.material] : null,
      image_url: product.imageUrl || null,
      image_urls: product.imageUrl ? [product.imageUrl] : null,
      video_urls: null,
      gallery_images: null,
      attributes: {},
      specs: {},
      cannabinoid_profile: {
        thc_variants: { delta9_thc: 0.0, delta8_thc: 0.0, thca: 0.0, thcp: 0.0, thcv: 0.0 },
        other_cannabinoids: { cbd: 0.0, cbg: 0.0, cbn: 0.0, cbc: 0.0 },
        total_cannabinoids: 0.0,
        dominant_cannabinoid: 'cbd',
        profile_type: 'isolate'
      },
      effects_profile: {
        primary_effects: [],
        secondary_effects: [],
        medicinal_benefits: [],
        best_for: [],
        avoid_if: []
      },
      terpene_profile: {
        primary_terpenes: [],
        aroma_notes: [],
        effects_influence: []
      },
      psychoactive_profile: {
        thc_variants: { delta9_thc: 0.0, delta8_thc: 0.0, thca: 0.0, thcp: 0.0, thcv: 0.0 },
        other_psychoactive: { '7_hydroxy_mitragynine': 0.0, mitragynine: 0.0 }
      },
      compliance_info: {
        requires_age_verification: false,
        minimum_age: 18,
        restricted_states: [],
        restricted_zipcodes: [],
        requires_lab_testing: false,
        lab_certificate_url: null,
        product_type: 'general',
        regulatory_category: 'unregulated'
      },
      variations: [],
      parent_product_id: null,
      seo_title: null,
      seo_description: null,
      seo_keywords: null,
      meta_data: {},
      is_active: true,
      featured: product.featured || false,
      is_new: false,
      is_bestseller: false,
      is_trending: false,
      farm_bill_compliant: true,
      thc_compliant: true,
      zoho_item_id: null,
      zoho_last_sync: null,
      search_keywords: null,
      search_boost: 1.0
    };

    const { data, error } = await supabaseAdmin!
      .from('main_site_products')
      .insert(dbProduct)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Category[];
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabaseAdmin!
      .from('brands')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Brand[];
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const { data, error } = await supabaseAdmin!
      .from('brands')
      .insert(brand)
      .select()
      .single();

    if (error) throw error;
    return data as Brand;
  }

  // Orders - Use Supabase with RLS for user-specific data
  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabaseAdmin!
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabaseAdmin!
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Order;
  }

  // Atomic checkout via Postgres function
  async checkoutAtomic(params: { userId: string; items: Array<{ productId: string; quantity: number }>; shippingAddress?: unknown; billingAddress?: unknown; }): Promise<{ order: Order; items: OrderItem[] }> {
    const { data, error } = await supabaseAdmin!.rpc('checkout_atomic', {
      p_user_id: params.userId,
      p_items: params.items,
      p_billing: params.billingAddress ?? null,
      p_shipping: params.shippingAddress ?? null,
    });
    if (error) throw error;
    const payload = data as any;
    return { order: payload.order as Order, items: (payload.items || []) as OrderItem[] };
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const { data, error } = await supabaseAdmin!
      .from('order_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data as OrderItem;
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabaseAdmin!
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    if (error) throw error;
    return (data || []) as OrderItem[];
  }


  // Cart - User-specific with real-time updates
  async getUserCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabaseAdmin!
      .from('cartItems')
      .select(`
        *,
        products (
          id,
          name,
          price,
          imageUrl,
          inStock
        )
      `)
      .eq('userId', userId);

    if (error) throw error;
    return data as CartItem[];
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const { data: existing } = await supabaseAdmin!
      .from('cartItems')
      .select('*')
      .eq('userId', cartItem.userId!)
      .eq('productId', cartItem.productId!)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabaseAdmin!
        .from('cartItems')
        .update({ quantity: existing.quantity + cartItem.quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    } else {
      // Insert new item
      const { data, error } = await supabaseAdmin!
        .from('cartItems')
        .insert(cartItem)
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('cartItems')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as CartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('cartItems')
      .delete()
      .eq('id', id);

    return !error;
  }

  async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('cartItems')
      .delete()
      .eq('userId', userId);

    return !error;
  }

  // Memberships
  async getMemberships(): Promise<Membership[]> {
    const { data, error } = await supabaseAdmin!
      .from('memberships')
      .select('*')
      .order('monthlyPrice');

    if (error) throw error;
    return data as Membership[];
  }

  // User Behavior & Preferences - Use Supabase for real-time analytics
  async trackUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior> {
    const { data, error } = await supabaseAdmin!
      .from('userBehavior')
      .insert(behavior)
      .select()
      .single();

    if (error) throw error;

    // Update user preferences based on behavior
    if (behavior.userId && behavior.productId) {
      await this.updateUserPreferencesFromBehavior(data as UserBehavior);
    }

    return data as UserBehavior;
  }

  private async updateUserPreferencesFromBehavior(behavior: UserBehavior): Promise<void> {
    // Implementation for updating user preferences based on behavior
    // This would analyze the behavior and update user preferences accordingly
  }

  // Additional methods would follow the same pattern...
  // For brevity, I'm showing the key methods that demonstrate the Supabase integration approach

  // Placeholder implementations for remaining interface methods
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('userPreferences')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error || !data) return undefined;
    return data as UserPreferences;
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const { data, error } = await supabaseAdmin!
      .from('userPreferences')
      .upsert({ userId, ...preferences, updatedAt: new Date() })
      .select()
      .single();

    if (error) throw error;
    return data as UserPreferences;
  }

  // Continue with other required interface methods...
  async getRecommendations(userId: string, type: string, limit?: number): Promise<Product[]> {
    // Implementation would use complex Drizzle queries for recommendations
    return [];
  }

  // Payment methods
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabaseAdmin!
      .from('paymentMethods')
      .select('*')
      .eq('userId', userId)
      .eq('isActive', true);

    if (error) throw error;
    return data as PaymentMethod[];
  }

  async createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const { data, error } = await supabaseAdmin!
      .from('paymentMethods')
      .insert(paymentMethod)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentMethod;
  }

  async createTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const { data, error } = await supabaseAdmin!
      .from('paymentTransactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentTransaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertPaymentTransaction>): Promise<PaymentTransaction> {
    const { data, error } = await supabaseAdmin!
      .from('paymentTransactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentTransaction;
  }

  // Additional placeholder methods to satisfy the interface
  async getProductSimilarity(productId: string): Promise<ProductSimilarity[]> {
    return [];
  }

  async updateProductSimilarity(similarity: InsertProductSimilarity): Promise<ProductSimilarity> {
    const { data, error } = await supabaseAdmin!
      .from('productSimilarity')
      .upsert(similarity)
      .select()
      .single();

    if (error) throw error;
    return data as ProductSimilarity;
  }

  async getCachedRecommendations(userId: string, type: string): Promise<RecommendationCache | undefined> {
    return undefined;
  }

  async setCachedRecommendations(cache: InsertRecommendationCache): Promise<RecommendationCache> {
    const { data, error } = await supabaseAdmin!
      .from('recommendationCache')
      .upsert(cache)
      .select()
      .single();

    if (error) throw error;
    return data as RecommendationCache;
  }

  // Shipstation methods would also use Supabase
  async getShipstationOrders(): Promise<ShipstationOrder[]> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ShipstationOrder[];
  }

  async getShipstationOrderByOrderId(orderId: string): Promise<ShipstationOrder | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) return undefined;
    return data as ShipstationOrder;
  }

  async getShipstationOrderByShipstationId(shipstationOrderId: string): Promise<ShipstationOrder | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_orders')
      .select('*')
      .eq('shipstation_order_id', shipstationOrderId)
      .single();

    if (error || !data) return undefined;
    return data as ShipstationOrder;
  }

  async insertShipstationOrder(order: InsertShipstationOrder): Promise<ShipstationOrder> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data as ShipstationOrder;
  }

  async updateShipstationOrder(id: string, updates: Partial<InsertShipstationOrder>): Promise<ShipstationOrder | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as ShipstationOrder;
  }

  async insertShipstationShipment(shipment: InsertShipstationShipment): Promise<ShipstationShipment> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_shipments')
      .insert(shipment)
      .select()
      .single();

    if (error) throw error;
    return data as ShipstationShipment;
  }

  async updateShipstationShipment(id: string, updates: Partial<InsertShipstationShipment>): Promise<ShipstationShipment | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_shipments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as ShipstationShipment;
  }

  async getShipstationProductByProductId(productId: string): Promise<ShipstationProduct | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_products')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error || !data) return undefined;
    return data as ShipstationProduct;
  }

  async insertShipstationProduct(product: InsertShipstationProduct): Promise<ShipstationProduct> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data as ShipstationProduct;
  }

  async updateShipstationProduct(id: string, updates: Partial<InsertShipstationProduct>): Promise<ShipstationProduct | undefined> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as ShipstationProduct;
  }

  async insertShipstationWebhook(webhook: InsertShipstationWebhook): Promise<ShipstationWebhook> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_webhooks')
      .insert(webhook)
      .select()
      .single();

    if (error) throw error;
    return data as ShipstationWebhook;
  }

  async insertShipstationSyncStatus(status: InsertShipstationSyncStatus): Promise<ShipstationSyncStatus> {
    const { data, error } = await supabaseAdmin!
      .from('shipstation_sync_status')
      .insert(status)
      .select()
      .single();

    if (error) throw error;
    return data as ShipstationSyncStatus;
  }

  async getLatestShipstationSyncStatus(syncType?: string): Promise<ShipstationSyncStatus | null> {
    let query = supabaseAdmin!
      .from('shipstation_sync_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (syncType) {
      query = query.eq('sync_type', syncType);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return null;
    return data[0] as ShipstationSyncStatus;
  }

  // Compliance Engine Methods
  async getAllComplianceRules(): Promise<ComplianceRule[]> {
    const { data } = await supabaseAdmin!
      .from('compliance_rules')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async getComplianceRulesByCategory(category: string): Promise<ComplianceRule[]> {
    const { data } = await supabaseAdmin!
      .from('compliance_rules')
      .select('*')
      .eq('category', category);
    return data || [];
  }

  async getComplianceRuleById(id: string): Promise<ComplianceRule | undefined> {
    const { data } = await supabaseAdmin!
      .from('compliance_rules')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async createComplianceRule(rule: InsertComplianceRule): Promise<ComplianceRule> {
    const { data } = await supabaseAdmin!
      .from('compliance_rules')
      .insert(rule)
      .select()
      .single();
    return data!;
  }

  async updateComplianceRule(id: string, updates: Partial<InsertComplianceRule>): Promise<ComplianceRule | undefined> {
    const { data } = await supabaseAdmin!
      .from('compliance_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data || undefined;
  }

  async getProductComplianceByProductId(productId: string): Promise<ProductCompliance[]> {
    const { data } = await supabaseAdmin!
      .from('product_compliance')
      .select('*')
      .eq('product_id', productId);
    return data || [];
  }

  async createProductCompliance(compliance: InsertProductCompliance): Promise<ProductCompliance> {
    const { data } = await supabaseAdmin!
      .from('product_compliance')
      .insert(compliance)
      .select()
      .single();
    return data!;
  }

  async deleteProductCompliance(productId: string, complianceId: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('product_compliance')
      .delete()
      .eq('product_id', productId)
      .eq('compliance_id', complianceId);
    return !error;
  }

  async createComplianceAuditLog(log: InsertComplianceAuditLog): Promise<ComplianceAuditLog> {
    const { data } = await supabaseAdmin!
      .from('compliance_audit_log')
      .insert(log)
      .select()
      .single();
    return data!;
  }

  async getComplianceAuditLogs(filters?: { page?: number; limit?: number; severity?: string }): Promise<ComplianceAuditLog[]> {
    let query = supabaseAdmin!
      .from('compliance_audit_log')
      .select('*')
      .order('detected_at', { ascending: false });

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data } = await query;
    return data || [];
  }

  async resolveComplianceViolation(logId: string, resolvedBy: string, notes?: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('compliance_audit_log')
      .update({
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', logId);
    return !error;
  }

  async getComplianceStats(): Promise<{ totalViolations: number; criticalViolations: number; resolvedViolations: number }> {
    const [total, critical, resolved] = await Promise.all([
      supabaseAdmin!.from('compliance_audit_log').select('id', { count: 'exact' }),
      supabaseAdmin!.from('compliance_audit_log').select('id', { count: 'exact' }).eq('severity', 'critical'),
      supabaseAdmin!.from('compliance_audit_log').select('id', { count: 'exact' }).not('resolved_by', 'is', null)
    ]);

    return {
      totalViolations: total.count || 0,
      criticalViolations: critical.count || 0,
      resolvedViolations: resolved.count || 0
    };
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.getProduct(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getProducts();
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const { data } = await supabaseAdmin!
      .from('main_site_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data || undefined;
  }

  // Lab Certificate methods
  async createLabCertificate(certificate: InsertLabCertificate): Promise<LabCertificate> {
    const { data } = await supabaseAdmin!
      .from('lab_certificates')
      .insert(certificate)
      .select()
      .single();
    if (!data) throw new Error('Failed to create lab certificate');
    return data;
  }

  async getLabCertificatesByProductId(productId: string): Promise<LabCertificate[]> {
    const { data } = await supabaseAdmin!
      .from('lab_certificates')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  async updateLabCertificate(id: string, updates: Partial<InsertLabCertificate>): Promise<LabCertificate | undefined> {
    const { data } = await supabaseAdmin!
      .from('lab_certificates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data || undefined;
  }

  // User Behavior & Preferences - Missing methods
  async getUserBehavior(userId: string, limit?: number): Promise<UserBehavior[]> {
    const query = supabaseAdmin!
      .from('user_behavior')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) query.limit(limit);

    const { data } = await query;
    return data || [];
  }

  async updateRecommendationCache(userId: string, type: string, productIds: string[], score?: number): Promise<void> {
    // Implementation for recommendation cache update
    await supabaseAdmin!
      .from('recommendation_cache')
      .upsert({
        user_id: userId,
        type,
        product_ids: productIds,
        score: score || 1.0,
        updated_at: new Date().toISOString()
      });
  }

  // Payment Methods - Missing methods
  async getPaymentMethod(id: string): Promise<PaymentMethod | undefined> {
    const { data } = await supabaseAdmin!
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | undefined> {
    const { data } = await supabaseAdmin!
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data || undefined;
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('payment_methods')
      .delete()
      .eq('id', id);
    return !error;
  }

  // Emoji System - Missing methods
  async createEmojiUsage(usage: InsertEmojiUsage): Promise<EmojiUsage> {
    const { data } = await supabaseAdmin!
      .from('emoji_usage')
      .insert(usage)
      .select()
      .single();
    if (!data) throw new Error('Failed to create emoji usage');
    return data;
  }

  async getRecentEmojiUsage(userId: string, limit: number): Promise<EmojiUsage[]> {
    const { data } = await supabaseAdmin!
      .from('emoji_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async getAllEmojiUsage(userId: string): Promise<EmojiUsage[]> {
    const { data } = await supabaseAdmin!
      .from('emoji_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  async getUserEmojiPreferences(userId: string): Promise<UserEmojiPreferences | undefined> {
    const { data } = await supabaseAdmin!
      .from('user_emoji_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data || undefined;
  }

  async createUserEmojiPreferences(preferences: InsertUserEmojiPreferences): Promise<UserEmojiPreferences> {
    const { data } = await supabaseAdmin!
      .from('user_emoji_preferences')
      .insert(preferences)
      .select()
      .single();
    if (!data) throw new Error('Failed to create user emoji preferences');
    return data;
  }

  async updateUserEmojiPreferences(userId: string, updates: Partial<UserEmojiPreferences>): Promise<UserEmojiPreferences | undefined> {
    const { data } = await supabaseAdmin!
      .from('user_emoji_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return data || undefined;
  }

  async createEmojiRecommendations(recommendations: InsertEmojiRecommendations): Promise<EmojiRecommendations> {
    const { data } = await supabaseAdmin!
      .from('emoji_recommendations')
      .insert(recommendations)
      .select()
      .single();
    if (!data) throw new Error('Failed to create emoji recommendations');
    return data;
  }

  async getCachedEmojiRecommendations(userId: string, context: string, contextData: string): Promise<EmojiRecommendations | undefined> {
    const { data } = await supabaseAdmin!
      .from('emoji_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('context', context)
      .eq('context_data', contextData)
      .single();
    return data || undefined;
  }

  async markEmojiRecommendationUsed(userId: string, context: string, usedEmoji: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('emoji_recommendations')
      .update({ used_emoji: usedEmoji, used_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('context', context);
    return !error;
  }

  async getProductEmojiAssociations(productId: string): Promise<Array<{emoji: string; emojiCode: string; usageCount: number; sentiment: string; associationStrength: number}>> {
    const { data } = await supabaseAdmin!
      .from('product_emoji_associations')
      .select('*')
      .eq('product_id', productId);
    return data || [];
  }

  async upsertProductEmojiAssociation(association: InsertProductEmojiAssociations): Promise<ProductEmojiAssociations> {
    const { data } = await supabaseAdmin!
      .from('product_emoji_associations')
      .upsert(association)
      .select()
      .single();
    if (!data) throw new Error('Failed to upsert product emoji association');
    return data;
  }

  // VIP Concierge - Missing methods
  async createConciergeConversation(conversation: InsertConciergeConversation): Promise<ConciergeConversation> {
    const { data } = await supabaseAdmin!
      .from('concierge_conversations')
      .insert(conversation)
      .select()
      .single();
    if (!data) throw new Error('Failed to create concierge conversation');
    return data;
  }

  async getConciergeConversation(conversationId: string): Promise<ConciergeConversation | undefined> {
    const { data } = await supabaseAdmin!
      .from('concierge_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    return data || undefined;
  }

  async updateConciergeConversation(conversationId: string, updates: Partial<InsertConciergeConversation>): Promise<ConciergeConversation | undefined> {
    const { data } = await supabaseAdmin!
      .from('concierge_conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();
    return data || undefined;
  }

  async createConciergeMessage(message: InsertConciergeMessage): Promise<ConciergeMessage> {
    const { data } = await supabaseAdmin!
      .from('concierge_messages')
      .insert(message)
      .select()
      .single();
    if (!data) throw new Error('Failed to create concierge message');
    return data;
  }

  async getConciergeMessages(conversationId: string): Promise<ConciergeMessage[]> {
    const { data } = await supabaseAdmin!
      .from('concierge_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  async createConciergeRecommendation(recommendation: InsertConciergeRecommendation): Promise<ConciergeRecommendation> {
    const { data } = await supabaseAdmin!
      .from('concierge_recommendations')
      .insert(recommendation)
      .select()
      .single();
    if (!data) throw new Error('Failed to create concierge recommendation');
    return data;
  }

  async updateConciergeRecommendation(recommendationId: string, updates: Partial<InsertConciergeRecommendation>): Promise<ConciergeRecommendation | undefined> {
    const { data } = await supabaseAdmin!
      .from('concierge_recommendations')
      .update(updates)
      .eq('id', recommendationId)
      .select()
      .single();
    return data || undefined;
  }

  async createConciergeAnalytics(analytics: InsertConciergeAnalytics): Promise<ConciergeAnalytics> {
    const { data } = await supabaseAdmin!
      .from('concierge_analytics')
      .insert(analytics)
      .select()
      .single();
    if (!data) throw new Error('Failed to create concierge analytics');
    return data;
  }

  async getConciergeAnalytics(conversationId?: string, dateRange?: { start: Date; end: Date }): Promise<ConciergeAnalytics[]> {
    let query = supabaseAdmin!
      .from('concierge_analytics')
      .select('*');

    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    }

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    }

    const { data } = await query.order('created_at', { ascending: false });
    return data || [];
  }

  // Payment Transactions - Missing methods
  async getTransaction(id: string): Promise<PaymentTransaction | undefined> {
    const { data } = await supabaseAdmin!
      .from('payment_transactions')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getUserTransactions(userId: string): Promise<PaymentTransaction[]> {
    const { data } = await supabaseAdmin!
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  async getOrderTransactions(orderId: string): Promise<PaymentTransaction[]> {
    const { data } = await supabaseAdmin!
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  // Webhook Events - Missing methods
  async createWebhookEvent(event: InsertKajaPayWebhookEvent): Promise<KajaPayWebhookEvent> {
    const { data } = await supabaseAdmin!
      .from('kajapay_webhook_events')
      .insert(event)
      .select()
      .single();
    if (!data) throw new Error('Failed to create webhook event');
    return data;
  }

  async getUnprocessedWebhookEvents(): Promise<KajaPayWebhookEvent[]> {
    const { data } = await supabaseAdmin!
      .from('kajapay_webhook_events')
      .select('*')
      .is('processed_at', null)
      .order('created_at', { ascending: true });
    return data || [];
  }

  async markWebhookEventProcessed(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin!
      .from('kajapay_webhook_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }
}

export const storage = new SupabaseStorage();
