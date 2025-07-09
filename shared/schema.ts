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
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
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
  preferredCategories: text("preferred_categories").array().default('{}'),
  preferredBrands: text("preferred_brands").array().default('{}'),
  preferredMaterials: text("preferred_materials").array().default('{}'),
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
