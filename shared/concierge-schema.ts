import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { pgTable, text, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";

// Database tables for VIP Concierge system
export const conciergeConversations = pgTable("concierge_conversations", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: text("user_id"), // null for guest users
  status: text("status").notNull().default("active"), // active, completed, escalated
  priority: text("priority").notNull().default("normal"), // low, normal, high, vip
  customerInfo: json("customer_info"), // name, email, phone, membership status
  metadata: json("metadata"), // browser info, page context, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull()
});

export const conciergeMessages = pgTable("concierge_messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, product_recommendation, image, link
  metadata: json("metadata"), // recommendations, products, context
  aiProvider: text("ai_provider"), // openai, perplexity, rule-based
  confidence: integer("confidence"), // AI confidence score 0-100
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const conciergeRecommendations = pgTable("concierge_recommendations", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  messageId: text("message_id").notNull(),
  productId: text("product_id"),
  recommendationType: text("recommendation_type").notNull(), // primary, alternative, complementary, trending
  confidence: integer("confidence").notNull(),
  reason: text("reason").notNull(),
  metadata: json("metadata"), // price comparison, features, availability
  userFeedback: text("user_feedback"), // positive, negative, neutral
  clickedAt: timestamp("clicked_at"),
  purchasedAt: timestamp("purchased_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const conciergeAnalytics = pgTable("concierge_analytics", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  eventType: text("event_type").notNull(), // conversation_start, message_sent, recommendation_clicked, conversation_end
  eventData: json("event_data"),
  performanceMetrics: json("performance_metrics"), // response_time, ai_confidence, user_satisfaction
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertConciergeConversationSchema = createInsertSchema(conciergeConversations);
export const insertConciergeMessageSchema = createInsertSchema(conciergeMessages);
export const insertConciergeRecommendationSchema = createInsertSchema(conciergeRecommendations);
export const insertConciergeAnalyticsSchema = createInsertSchema(conciergeAnalytics);

// Types
export type ConciergeConversation = typeof conciergeConversations.$inferSelect;
export type ConciergeMessage = typeof conciergeMessages.$inferSelect;
export type ConciergeRecommendation = typeof conciergeRecommendations.$inferSelect;
export type ConciergeAnalytics = typeof conciergeAnalytics.$inferSelect;

export type InsertConciergeConversation = z.infer<typeof insertConciergeConversationSchema>;
export type InsertConciergeMessage = z.infer<typeof insertConciergeMessageSchema>;
export type InsertConciergeRecommendation = z.infer<typeof insertConciergeRecommendationSchema>;
export type InsertConciergeAnalytics = z.infer<typeof insertConciergeAnalyticsSchema>;

// Request/Response schemas for API
export interface CustomerProfile {
  name?: string;
  email?: string;
  phone?: string;
  membershipTier?: string;
  preferences?: {
    categories?: string[];
    brands?: string[];
    priceRange?: { min: number; max: number };
    materials?: string[];
  };
  purchaseHistory?: {
    productId: string;
    productName: string;
    category: string;
    purchaseDate: string;
  }[];
}

export interface ProductRecommendation {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    imageUrl?: string;
    inStock: boolean;
    vipExclusive: boolean;
  };
  type: 'primary' | 'alternative' | 'complementary' | 'trending';
  confidence: number;
  reason: string;
  features?: string[];
  alternatives?: string[];
}

export interface ConciergeContext {
  sessionId: string;
  conversationId?: string;
  customerProfile?: CustomerProfile;
  currentQuery: string;
  intent?: 'product_search' | 'comparison' | 'recommendation' | 'support' | 'general';
  context?: {
    currentPage?: string;
    viewedProducts?: string[];
    cartItems?: string[];
    searchHistory?: string[];
  };
}

export interface ConciergeResponse {
  message: string;
  messageType: 'text' | 'product_recommendation' | 'comparison' | 'support';
  recommendations?: ProductRecommendation[];
  suggestedQueries?: string[];
  escalate?: boolean;
  metadata?: {
    aiProvider: string;
    confidence: number;
    responseTime: number;
    searchResults?: any[];
  };
}