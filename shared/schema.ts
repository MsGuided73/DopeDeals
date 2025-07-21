import { pgTable, text, serial, integer, boolean, numeric, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  membershipTierId: uuid("membership_tier_id"),
  ageVerificationStatus: text("age_verification_status").notNull().default("not_verified"), // not_verified, pending, verified, failed
  lastVerificationCheck: timestamp("last_verification_check", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  sku: text("sku").notNull().unique(),
  categoryId: uuid("category_id").references(() => categories.id),
  brandId: uuid("brand_id").references(() => brands.id),
  imageUrl: text("image_url"),
  material: text("material"),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  vipExclusive: boolean("vip_exclusive").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  status: text("status").notNull().default("processing"), // processing, shipped, completed, failed, review_needed
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, processing, paid, failed, refunded
  paymentMethod: text("payment_method"), // card, ach, digital_wallet
  transactionId: text("transaction_id"),
  subtotalAmount: numeric("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  billingAddress: jsonb("billing_address"),
  shippingAddress: jsonb("shipping_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  productId: uuid("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});

export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  tierName: text("tier_name").notNull(),
  monthlyPrice: numeric("monthly_price", { precision: 10, scale: 2 }).notNull(),
  benefits: text("benefits").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const loyaltyPoints = pgTable("loyalty_points", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  points: integer("points").notNull(),
  transactionType: text("transaction_type").notNull(), // earn_purchase, redeem_discount, membership_bonus
  orderId: uuid("order_id").references(() => orders.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// User behavior tracking for recommendations
export const userBehavior = pgTable("user_behavior", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  action: text("action").notNull(), // view, add_to_cart, purchase, wishlist, search
  sessionId: text("session_id"),
  metadata: jsonb("metadata"), // Additional context like search terms, time spent, etc.
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// User preferences for better recommendations
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  preferredCategories: text("preferred_categories").array(),
  preferredBrands: text("preferred_brands").array(),
  preferredMaterials: text("preferred_materials").array(),
  priceRangeMin: numeric("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: numeric("price_range_max", { precision: 10, scale: 2 }),
  vipProductsOnly: boolean("vip_products_only").default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Product similarity matrix for collaborative filtering
export const productSimilarity = pgTable("product_similarity", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId1: uuid("product_id1").references(() => products.id),
  productId2: uuid("product_id2").references(() => products.id),
  similarityScore: numeric("similarity_score", { precision: 5, scale: 4 }).notNull(),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow(),
});

// Recommendation cache for performance
export const recommendationCache = pgTable("recommendation_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  recommendationType: text("recommendation_type").notNull(), // trending, personalized, similar, category_based
  productIds: text("product_ids").array().notNull(),
  score: numeric("score", { precision: 5, scale: 4 }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Payment Methods Table
export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  kajaPayToken: text("kajapay_token").notNull(),
  cardLast4: text("card_last4"),
  cardType: text("card_type"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  billingName: text("billing_name"),
  billingAddress: jsonb("billing_address"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Payment Transactions Table
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  kajaPayTransactionId: integer("kajapay_transaction_id"),
  kajaPayReferenceNumber: integer("kajapay_reference_number"),
  transactionType: text("transaction_type").notNull(), // charge, refund, void
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull(), // pending, approved, declined, refunded
  kajaPayStatusCode: text("kajapay_status_code"),
  authCode: text("auth_code"),
  errorMessage: text("error_message"),
  paymentMethodData: jsonb("payment_method_data"),
  transactionDetails: jsonb("transaction_details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// KajaPay Webhook Events Table
export const kajaPayWebhookEvents = pgTable("kajapay_webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: text("event_type").notNull(),
  kajaPayTransactionId: integer("kajapay_transaction_id"),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertMembershipSchema = createInsertSchema(memberships).omit({ id: true, createdAt: true });
export const insertLoyaltyPointSchema = createInsertSchema(loyaltyPoints).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertUserBehaviorSchema = createInsertSchema(userBehavior).omit({ id: true, createdAt: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, updatedAt: true });
export const insertProductSimilaritySchema = createInsertSchema(productSimilarity).omit({ id: true, calculatedAt: true });
export const insertRecommendationCacheSchema = createInsertSchema(recommendationCache).omit({ id: true, createdAt: true });
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertKajaPayWebhookEventSchema = createInsertSchema(kajaPayWebhookEvents).omit({ id: true, createdAt: true });

// Add emoji schema exports
export * from '../shared/emoji-schema';

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type LoyaltyPoint = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoint = z.infer<typeof insertLoyaltyPointSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type UserBehavior = typeof userBehavior.$inferSelect;
export type InsertUserBehavior = z.infer<typeof insertUserBehaviorSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type ProductSimilarity = typeof productSimilarity.$inferSelect;
export type InsertProductSimilarity = z.infer<typeof insertProductSimilaritySchema>;
export type RecommendationCache = typeof recommendationCache.$inferSelect;
export type InsertRecommendationCache = z.infer<typeof insertRecommendationCacheSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type KajaPayWebhookEvent = typeof kajaPayWebhookEvents.$inferSelect;
export type InsertKajaPayWebhookEvent = z.infer<typeof insertKajaPayWebhookEventSchema>;

// Zoho Integration Tables
export const zohoSyncStatus = pgTable("zoho_sync_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceType: text("resource_type").notNull(), // 'product', 'category', 'order', 'customer'
  resourceId: text("resource_id").notNull(), // Local ID
  zohoId: text("zoho_id").notNull(), // Zoho ID
  lastSynced: timestamp("last_synced", { withTimezone: true }).notNull(),
  syncStatus: text("sync_status").notNull(), // 'success', 'failed', 'pending'
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const zohoWebhookEvents = pgTable("zoho_webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  eventTime: timestamp("event_time", { withTimezone: true }).notNull(),
  organizationId: text("organization_id").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  operation: text("operation").notNull(), // 'create', 'update', 'delete'
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  rawData: text("raw_data").notNull(), // JSON string of the full webhook payload
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const zohoProducts = pgTable("zoho_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  zohoItemId: text("zoho_item_id").notNull().unique(),
  localProductId: uuid("local_product_id").references(() => products.id),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  description: text("description"),
  rate: numeric("rate", { precision: 10, scale: 2 }).notNull(),
  stockOnHand: integer("stock_on_hand").default(0).notNull(),
  availableStock: integer("available_stock").default(0).notNull(),
  actualAvailableStock: integer("actual_available_stock").default(0).notNull(),
  zohoCategoryId: text("zoho_category_id"),
  zohoCategoryName: text("zoho_category_name"),
  brand: text("brand"),
  status: text("status").notNull(), // 'active', 'inactive'
  lastModifiedTime: timestamp("last_modified_time", { withTimezone: true }).notNull(),
  syncedAt: timestamp("synced_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const zohoOrders = pgTable("zoho_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  zohoSalesorderId: text("zoho_salesorder_id").notNull().unique(),
  localOrderId: uuid("local_order_id").references(() => orders.id),
  salesorderNumber: text("salesorder_number").notNull(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
  invoiceStatus: text("invoice_status").notNull(),
  paymentStatus: text("payment_status").notNull(),
  subTotal: numeric("sub_total", { precision: 10, scale: 2 }).notNull(),
  taxTotal: numeric("tax_total", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currencyCode: text("currency_code").notNull(),
  lastModifiedTime: timestamp("last_modified_time", { withTimezone: true }).notNull(),
  syncedAt: timestamp("synced_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Zoho insert schemas
export const insertZohoSyncStatusSchema = createInsertSchema(zohoSyncStatus).omit({ id: true, createdAt: true, updatedAt: true });
export const insertZohoWebhookEventSchema = createInsertSchema(zohoWebhookEvents).omit({ id: true, createdAt: true });
export const insertZohoProductSchema = createInsertSchema(zohoProducts).omit({ id: true, createdAt: true, syncedAt: true });
export const insertZohoOrderSchema = createInsertSchema(zohoOrders).omit({ id: true, createdAt: true, syncedAt: true });

// Zoho types
export type ZohoSyncStatus = typeof zohoSyncStatus.$inferSelect;
export type InsertZohoSyncStatus = z.infer<typeof insertZohoSyncStatusSchema>;
export type ZohoWebhookEvent = typeof zohoWebhookEvents.$inferSelect;
export type InsertZohoWebhookEvent = z.infer<typeof insertZohoWebhookEventSchema>;
export type ZohoProduct = typeof zohoProducts.$inferSelect;
export type InsertZohoProduct = z.infer<typeof insertZohoProductSchema>;
export type ZohoOrder = typeof zohoOrders.$inferSelect;
export type InsertZohoOrder = z.infer<typeof insertZohoOrderSchema>;

export * from './emoji-schema';
export * from './concierge-schema';
