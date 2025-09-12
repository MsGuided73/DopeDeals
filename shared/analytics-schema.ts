import { pgTable, uuid, text, timestamp, integer, decimal, jsonb, boolean, index } from "drizzle-orm/pg-core";

// ==================== CORE ANALYTICS TABLES ====================

// Site Analytics - Track overall site performance
export const siteAnalytics = pgTable("site_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteType: text("site_type").notNull(), // 'cbd', 'tobacco', 'admin'
  date: timestamp("date", { withTimezone: true }).notNull(),
  
  // Traffic Metrics
  uniqueVisitors: integer("unique_visitors").default(0),
  pageViews: integer("page_views").default(0),
  sessions: integer("sessions").default(0),
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }),
  avgSessionDuration: integer("avg_session_duration"), // seconds
  
  // Conversion Metrics
  conversions: integer("conversions").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0"),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }),
  
  // Performance Metrics
  avgPageLoadTime: integer("avg_page_load_time"), // milliseconds
  serverResponseTime: integer("server_response_time"), // milliseconds
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  siteTypeIdx: index("site_analytics_site_type_idx").on(table.siteType),
  dateIdx: index("site_analytics_date_idx").on(table.date),
}));

// Page Analytics - Track individual page performance
export const pageAnalytics = pgTable("page_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteType: text("site_type").notNull(),
  pagePath: text("page_path").notNull(),
  pageTitle: text("page_title"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  
  // Page Metrics
  views: integer("views").default(0),
  uniqueViews: integer("unique_views").default(0),
  avgTimeOnPage: integer("avg_time_on_page"), // seconds
  bounces: integer("bounces").default(0),
  exits: integer("exits").default(0),
  
  // Engagement Metrics
  scrollDepth: decimal("scroll_depth", { precision: 5, scale: 2 }), // percentage
  clickThroughRate: decimal("click_through_rate", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  siteTypeIdx: index("page_analytics_site_type_idx").on(table.siteType),
  pagePathIdx: index("page_analytics_page_path_idx").on(table.pagePath),
  dateIdx: index("page_analytics_date_idx").on(table.date),
}));

// User Sessions - Track individual user sessions
export const userSessions = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: uuid("user_id"), // null for anonymous users
  siteType: text("site_type").notNull(),
  
  // Session Info
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  duration: integer("duration"), // seconds
  pageViews: integer("page_views").default(0),
  
  // User Info
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  
  // Referral Info
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  
  // Device Info
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'
  browser: text("browser"),
  os: text("os"),
  screenResolution: text("screen_resolution"),
  
  // Conversion Info
  converted: boolean("converted").default(false),
  conversionValue: decimal("conversion_value", { precision: 12, scale: 2 }),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  sessionIdIdx: index("user_sessions_session_id_idx").on(table.sessionId),
  userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
  siteTypeIdx: index("user_sessions_site_type_idx").on(table.siteType),
  startTimeIdx: index("user_sessions_start_time_idx").on(table.startTime),
}));

// Event Tracking - Track all user interactions
export const eventTracking = pgTable("event_tracking", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: uuid("user_id"), // null for anonymous users
  siteType: text("site_type").notNull(),
  
  // Event Details
  eventType: text("event_type").notNull(), // 'page_view', 'click', 'search', 'add_to_cart', etc.
  eventCategory: text("event_category").notNull(), // 'navigation', 'product', 'checkout', etc.
  eventAction: text("event_action").notNull(), // 'view', 'click', 'submit', etc.
  eventLabel: text("event_label"), // Additional context
  eventValue: decimal("event_value", { precision: 12, scale: 2 }), // Monetary value if applicable
  
  // Page Context
  pagePath: text("page_path").notNull(),
  pageTitle: text("page_title"),
  
  // Element Context (for clicks)
  elementId: text("element_id"),
  elementClass: text("element_class"),
  elementText: text("element_text"),
  elementPosition: jsonb("element_position"), // {x, y, width, height}
  
  // Product Context (if applicable)
  productId: uuid("product_id"),
  productName: text("product_name"),
  productCategory: text("product_category"),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }),
  
  // Additional Metadata
  metadata: jsonb("metadata"), // Flexible additional data
  
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
}, (table) => ({
  sessionIdIdx: index("event_tracking_session_id_idx").on(table.sessionId),
  eventTypeIdx: index("event_tracking_event_type_idx").on(table.eventType),
  siteTypeIdx: index("event_tracking_site_type_idx").on(table.siteType),
  timestampIdx: index("event_tracking_timestamp_idx").on(table.timestamp),
  productIdIdx: index("event_tracking_product_id_idx").on(table.productId),
}));
