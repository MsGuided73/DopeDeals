import { pgTable, uuid, text, timestamp, jsonb, boolean, integer, varchar } from 'drizzle-orm/pg-core';

// Page Templates - Predefined layouts and designs
export const pageTemplates = pgTable("page_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'landing', 'product', 'collection', 'content', 'custom'
  thumbnail: text("thumbnail"), // Preview image URL
  isActive: boolean("is_active").default(true),
  designConfig: jsonb("design_config").notNull(), // Complete page structure and styling
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdBy: uuid("created_by"), // Admin user who created the template
});

// User Created Pages - Pages built using the visual editor
export const userPages = pgTable("user_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(), // URL slug for the page
  description: text("description"),
  templateId: uuid("template_id"), // Optional: based on a template
  designConfig: jsonb("design_config").notNull(), // Complete page structure and styling
  
  // SEO and Meta
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogImage: text("og_image"),
  
  // Publishing
  status: text("status").notNull().default("draft"), // 'draft', 'published', 'archived'
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  
  // Versioning
  version: integer("version").default(1),
  parentPageId: uuid("parent_page_id"), // For version history
  
  // Analytics
  viewCount: integer("view_count").default(0),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdBy: uuid("created_by").notNull(), // Admin user who created the page
});

// Component Library - Reusable UI components
export const componentLibrary = pgTable("component_library", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'layout', 'content', 'form', 'media', 'navigation', 'ecommerce'
  description: text("description"),
  thumbnail: text("thumbnail"), // Preview image
  
  // Component Definition
  componentType: text("component_type").notNull(), // 'hero', 'card', 'button', 'form', 'gallery', etc.
  defaultProps: jsonb("default_props").notNull(), // Default properties and styling
  configSchema: jsonb("config_schema").notNull(), // JSON schema for component configuration
  
  // Styling Options
  styleVariants: jsonb("style_variants"), // Predefined style variations
  customizable: boolean("customizable").default(true),
  
  // Usage
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Design Themes - Color schemes, fonts, and styling presets
export const designThemes = pgTable("design_themes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  
  // Color Palette
  primaryColor: text("primary_color").notNull(),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  backgroundColor: text("background_color"),
  textColor: text("text_color"),
  
  // Typography
  primaryFont: text("primary_font").notNull(),
  secondaryFont: text("secondary_font"),
  headingFont: text("heading_font"),
  
  // Spacing and Layout
  borderRadius: text("border_radius").default("0.5rem"),
  spacing: text("spacing").default("1rem"),
  
  // Effects
  glassmorphism: jsonb("glassmorphism"), // Glassmorphism settings
  gradients: jsonb("gradients"), // Gradient definitions
  shadows: jsonb("shadows"), // Shadow presets
  
  // Theme Configuration
  themeConfig: jsonb("theme_config").notNull(), // Complete theme object
  
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Page Analytics - Track page performance
export const pageAnalytics = pgTable("page_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  pageId: uuid("page_id").notNull(),
  
  // Traffic Data
  date: timestamp("date", { withTimezone: true }).notNull(),
  views: integer("views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  bounceRate: integer("bounce_rate").default(0), // Percentage
  avgTimeOnPage: integer("avg_time_on_page").default(0), // Seconds
  
  // Conversion Data
  conversions: integer("conversions").default(0),
  conversionRate: integer("conversion_rate").default(0), // Percentage
  
  // Device/Browser Data
  deviceData: jsonb("device_data"), // Device and browser breakdown
  trafficSources: jsonb("traffic_sources"), // Traffic source breakdown
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Media Assets - Images, videos, and other media for the page builder
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(), // In bytes
  
  // Storage
  bucketName: text("bucket_name").notNull(), // Supabase storage bucket
  filePath: text("file_path").notNull(),
  publicUrl: text("public_url").notNull(),
  
  // Metadata
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  caption: text("caption"),
  
  // Organization
  category: text("category"), // 'hero', 'product', 'background', 'icon', 'logo'
  tags: jsonb("tags"), // Array of tags for searching
  
  // Usage
  usageCount: integer("usage_count").default(0),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  uploadedBy: uuid("uploaded_by").notNull(),
});

// Export types for TypeScript
export type PageTemplate = typeof pageTemplates.$inferSelect;
export type InsertPageTemplate = typeof pageTemplates.$inferInsert;

export type UserPage = typeof userPages.$inferSelect;
export type InsertUserPage = typeof userPages.$inferInsert;

export type ComponentLibraryItem = typeof componentLibrary.$inferSelect;
export type InsertComponentLibraryItem = typeof componentLibrary.$inferInsert;

export type DesignTheme = typeof designThemes.$inferSelect;
export type InsertDesignTheme = typeof designThemes.$inferInsert;

export type PageAnalytics = typeof pageAnalytics.$inferSelect;
export type InsertPageAnalytics = typeof pageAnalytics.$inferInsert;

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
