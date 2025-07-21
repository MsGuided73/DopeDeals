import { pgTable, text, uuid, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Emoji Usage Analytics Table
export const emojiUsage = pgTable("emoji_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  emoji: text("emoji").notNull(), // The actual emoji character
  emojiCode: text("emoji_code").notNull(), // Unicode or shortcode like :fire:
  context: text("context").notNull(), // 'product_review', 'comment', 'reaction', 'search'
  contextId: text("context_id"), // ID of product, review, etc.
  sentiment: text("sentiment"), // 'positive', 'negative', 'neutral'
  frequency: integer("frequency").default(1).notNull(),
  lastUsed: timestamp("last_used", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// User Emoji Preferences Table
export const userEmojiPreferences = pgTable("user_emoji_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  favoriteEmojis: text("favorite_emojis").array(), // Most used emojis
  preferredCategories: text("preferred_categories").array(), // 'smileys', 'objects', 'nature', etc.
  emojiPersonality: text("emoji_personality"), // 'expressive', 'minimal', 'professional'
  contextualPreferences: jsonb("contextual_preferences"), // Different preferences per context
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Emoji Recommendations Cache Table
export const emojiRecommendations = pgTable("emoji_recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  context: text("context").notNull(),
  contextData: jsonb("context_data"), // Product info, text content, etc.
  recommendedEmojis: jsonb("recommended_emojis").notNull(), // Array of emoji objects with scores
  algorithmVersion: text("algorithm_version").default("1.0").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  used: boolean("used").default(false),
  usedEmojiId: text("used_emoji_id"), // Which emoji was actually selected
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Product Emoji Associations Table
export const productEmojiAssociations = pgTable("product_emoji_associations", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  emoji: text("emoji").notNull(),
  emojiCode: text("emoji_code").notNull(),
  associationStrength: integer("association_strength").notNull(), // 0-100
  usageCount: integer("usage_count").default(1).notNull(),
  sentiment: text("sentiment"), // Overall sentiment for this product-emoji combo
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertEmojiUsageSchema = createInsertSchema(emojiUsage).omit({ id: true, createdAt: true });
export const insertUserEmojiPreferencesSchema = createInsertSchema(userEmojiPreferences).omit({ id: true, createdAt: true, lastUpdated: true });
export const insertEmojiRecommendationsSchema = createInsertSchema(emojiRecommendations).omit({ id: true, createdAt: true });
export const insertProductEmojiAssociationsSchema = createInsertSchema(productEmojiAssociations).omit({ id: true, createdAt: true, lastUpdated: true });

// Types
export type EmojiUsage = typeof emojiUsage.$inferSelect;
export type InsertEmojiUsage = z.infer<typeof insertEmojiUsageSchema>;
export type UserEmojiPreferences = typeof userEmojiPreferences.$inferSelect;
export type InsertUserEmojiPreferences = z.infer<typeof insertUserEmojiPreferencesSchema>;
export type EmojiRecommendations = typeof emojiRecommendations.$inferSelect;
export type InsertEmojiRecommendations = z.infer<typeof insertEmojiRecommendationsSchema>;
export type ProductEmojiAssociations = typeof productEmojiAssociations.$inferSelect;
export type InsertProductEmojiAssociations = z.infer<typeof insertProductEmojiAssociationsSchema>;

// Emoji recommendation interfaces
export interface EmojiRecommendation {
  emoji: string;
  emojiCode: string;
  name: string;
  category: string;
  confidence: number;
  reason: string;
  sentiment?: string;
}

export interface EmojiContext {
  type: 'product_review' | 'comment' | 'reaction' | 'search' | 'general';
  productId?: string;
  productName?: string;
  productCategory?: string;
  textContent?: string;
  currentMood?: 'happy' | 'excited' | 'satisfied' | 'disappointed' | 'neutral';
  previousEmojis?: string[];
}

export interface EmojiPersonalityProfile {
  expressiveness: number; // 0-100, how much user likes expressive emojis
  professionalism: number; // 0-100, preference for professional/simple emojis  
  creativity: number; // 0-100, willingness to try new/unique emojis
  sentimentAlignment: number; // 0-100, how much emojis match user's sentiment
  contextualAdaptation: number; // 0-100, how much context influences choices
}