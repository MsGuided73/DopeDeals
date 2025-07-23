import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { eq, and, gte, lte, inArray, desc, sql } from "drizzle-orm";
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
  type ConciergeRecommendation, type InsertConciergeRecommendation, type ConciergeAnalytics, type InsertConciergeAnalytics
} from "@shared/schema";

import {
  shipstationOrders, shipstationShipments, shipstationWebhooks, shipstationProducts, 
  shipstationWarehouses, shipstationSyncStatus,
  type ShipstationOrder, type InsertShipstationOrder, type ShipstationShipment, type InsertShipstationShipment,
  type ShipstationWebhook, type InsertShipstationWebhook, type ShipstationProduct, type InsertShipstationProduct,
  type ShipstationWarehouse, type InsertShipstationWarehouse, type ShipstationSyncStatus, type InsertShipstationSyncStatus
} from "@shared/shipstation-schema";

import { type IStorage } from "./storage";

const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Products
  async getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    material?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    vipExclusive?: boolean;
  }): Promise<Product[]> {
    let query = db.select().from(products);

    if (filters) {
      const conditions = [];
      
      if (filters.categoryId) {
        conditions.push(eq(products.categoryId, filters.categoryId));
      }
      if (filters.brandId) {
        conditions.push(eq(products.brandId, filters.brandId));
      }
      if (filters.material) {
        conditions.push(eq(products.material, filters.material));
      }
      if (filters.priceMin !== undefined) {
        conditions.push(gte(sql`CAST(${products.price} AS DECIMAL)`, filters.priceMin));
      }
      if (filters.priceMax !== undefined) {
        conditions.push(lte(sql`CAST(${products.price} AS DECIMAL)`, filters.priceMax));
      }
      if (filters.featured !== undefined) {
        conditions.push(eq(products.featured, filters.featured));
      }
      if (filters.vipExclusive !== undefined) {
        conditions.push(eq(products.vipExclusive, filters.vipExclusive));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    return await query;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    return result[0];
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const result = await db.insert(brands).values(brand).returning();
    return result[0];
  }

  // Memberships
  async getMemberships(): Promise<Membership[]> {
    return await db.select().from(memberships);
  }

  async getMembership(id: string): Promise<Membership | undefined> {
    const result = await db.select().from(memberships).where(eq(memberships.id, id)).limit(1);
    return result[0];
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const result = await db.insert(memberships).values(membership).returning();
    return result[0];
  }

  // Cart Items
  async getUserCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await db.select().from(cartItems)
      .where(and(
        eq(cartItems.userId, cartItem.userId),
        eq(cartItems.productId, cartItem.productId!)
      )).limit(1);

    if (existing.length > 0) {
      // Update quantity
      const updated = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + cartItem.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated[0];
    } else {
      // Insert new item
      const result = await db.insert(cartItems).values(cartItem).returning();
      return result[0];
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(orderItem).returning();
    return result[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Loyalty Points
  async getUserLoyaltyPoints(userId: string): Promise<LoyaltyPoint[]> {
    return await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId));
  }

  async addLoyaltyPoints(loyaltyPoint: InsertLoyaltyPoint): Promise<LoyaltyPoint> {
    const result = await db.insert(loyaltyPoints).values(loyaltyPoint).returning();
    return result[0];
  }

  // User Behavior for recommendations
  async trackUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior> {
    const result = await db.insert(userBehavior).values(behavior).returning();
    return result[0];
  }

  async getUserBehavior(userId: string, limit?: number): Promise<UserBehavior[]> {
    let query = db.select().from(userBehavior).where(eq(userBehavior.userId, userId)).orderBy(desc(userBehavior.createdAt));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    if (existing) {
      const result = await db.update(userPreferences)
        .set({ ...prefs, lastUpdated: new Date() })
        .where(eq(userPreferences.userId, prefs.userId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(userPreferences).values(prefs).returning();
      return result[0];
    }
  }

  // Product Similarity
  async getProductSimilarities(productId: string, similarityType: string, limit?: number): Promise<ProductSimilarity[]> {
    let query = db.select().from(productSimilarity)
      .where(and(
        eq(productSimilarity.productAId, productId),
        eq(productSimilarity.similarityType, similarityType)
      ))
      .orderBy(desc(productSimilarity.similarityScore));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async saveProductSimilarity(similarity: InsertProductSimilarity): Promise<ProductSimilarity> {
    const result = await db.insert(productSimilarity).values(similarity).returning();
    return result[0];
  }

  // Recommendation Cache
  async getRecommendationCache(userId: string, recommendationType: string): Promise<RecommendationCache | undefined> {
    const result = await db.select().from(recommendationCache)
      .where(and(
        eq(recommendationCache.userId, userId),
        eq(recommendationCache.recommendationType, recommendationType),
        gte(recommendationCache.expiresAt, new Date())
      )).limit(1);
    return result[0];
  }

  async saveRecommendationCache(cache: InsertRecommendationCache): Promise<RecommendationCache> {
    // Delete existing cache for this user and recommendation type
    await db.delete(recommendationCache)
      .where(and(
        eq(recommendationCache.userId, cache.userId),
        eq(recommendationCache.recommendationType, cache.recommendationType)
      ));
    
    const result = await db.insert(recommendationCache).values(cache).returning();
    return result[0];
  }

  // Payment Methods (placeholder implementations for interface compliance)
  async getPaymentMethods(): Promise<PaymentMethod[]> { return []; }
  async getPaymentMethod(): Promise<PaymentMethod | undefined> { return undefined; }
  async createPaymentMethod(): Promise<PaymentMethod> { throw new Error("Not implemented"); }
  async updatePaymentMethod(): Promise<PaymentMethod | undefined> { return undefined; }
  async deletePaymentMethod(): Promise<boolean> { return false; }
  async getPaymentTransactions(): Promise<PaymentTransaction[]> { return []; }
  async getPaymentTransaction(): Promise<PaymentTransaction | undefined> { return undefined; }
  async createPaymentTransaction(): Promise<PaymentTransaction> { throw new Error("Not implemented"); }
  async updatePaymentTransaction(): Promise<PaymentTransaction | undefined> { return undefined; }
  async getPaymentWebhookEvents(): Promise<KajaPayWebhookEvent[]> { return []; }
  async createPaymentWebhookEvent(): Promise<KajaPayWebhookEvent> { throw new Error("Not implemented"); }
  async processPaymentWebhookEvent(): Promise<boolean> { return false; }

  // Emoji system (placeholder implementations)
  async getEmojiUsage(): Promise<EmojiUsage[]> { return []; }
  async trackEmojiUsage(): Promise<EmojiUsage> { throw new Error("Not implemented"); }
  async getUserEmojiPreferences(): Promise<UserEmojiPreferences | undefined> { return undefined; }
  async updateUserEmojiPreferences(): Promise<UserEmojiPreferences> { throw new Error("Not implemented"); }
  async getEmojiRecommendations(): Promise<EmojiRecommendations[]> { return []; }
  async saveEmojiRecommendations(): Promise<EmojiRecommendations> { throw new Error("Not implemented"); }
  async getProductEmojiAssociations(): Promise<ProductEmojiAssociations[]> { return []; }
  async saveProductEmojiAssociation(): Promise<ProductEmojiAssociations> { throw new Error("Not implemented"); }

  // Concierge system (placeholder implementations)
  async getConciergeConversations(): Promise<ConciergeConversation[]> { return []; }
  async getConciergeConversation(): Promise<ConciergeConversation | undefined> { return undefined; }
  async createConciergeConversation(): Promise<ConciergeConversation> { throw new Error("Not implemented"); }
  async updateConciergeConversation(): Promise<ConciergeConversation | undefined> { return undefined; }
  async getConciergeMessages(): Promise<ConciergeMessage[]> { return []; }
  async createConciergeMessage(): Promise<ConciergeMessage> { throw new Error("Not implemented"); }
  async getConciergeRecommendations(): Promise<ConciergeRecommendation[]> { return []; }
  async createConciergeRecommendation(): Promise<ConciergeRecommendation> { throw new Error("Not implemented"); }
  async getConciergeAnalytics(): Promise<ConciergeAnalytics[]> { return []; }
  async updateConciergeAnalytics(): Promise<ConciergeAnalytics> { throw new Error("Not implemented"); }

  // ShipStation system (placeholder implementations)
  async insertShipstationOrder(): Promise<ShipstationOrder> { throw new Error("Not implemented"); }
  async getShipstationOrders(): Promise<ShipstationOrder[]> { return []; }
  async updateShipstationOrder(): Promise<ShipstationOrder | undefined> { return undefined; }
  async insertShipstationShipment(): Promise<ShipstationShipment> { throw new Error("Not implemented"); }
  async getShipstationShipments(): Promise<ShipstationShipment[]> { return []; }
  async updateShipstationShipment(): Promise<ShipstationShipment | undefined> { return undefined; }
  async insertShipstationWebhook(): Promise<ShipstationWebhook> { throw new Error("Not implemented"); }
  async getUnprocessedShipstationWebhooks(): Promise<ShipstationWebhook[]> { return []; }
  async markShipstationWebhookProcessed(): Promise<boolean> { return false; }
  async insertShipstationProduct(): Promise<ShipstationProduct> { throw new Error("Not implemented"); }
  async getShipstationProducts(): Promise<ShipstationProduct[]> { return []; }
  async updateShipstationProduct(): Promise<ShipstationProduct | undefined> { return undefined; }
  async insertShipstationWarehouse(): Promise<ShipstationWarehouse> { throw new Error("Not implemented"); }
  async getShipstationWarehouses(): Promise<ShipstationWarehouse[]> { return []; }
  async updateShipstationWarehouse(): Promise<ShipstationWarehouse | undefined> { return undefined; }
  async insertShipstationSyncStatus(): Promise<ShipstationSyncStatus> { throw new Error("Not implemented"); }
  async getLatestShipstationSyncStatus(): Promise<ShipstationSyncStatus | undefined> { return undefined; }
}