import { pgTable, text, serial, integer, boolean, numeric, timestamp, date, uuid, jsonb, unique, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name"), // Computed field for backward compatibility
  role: text("role").notNull().default("user"),
  membershipTierId: uuid("membership_tier_id"),
  isActive: boolean("is_active").default(true),
  ageVerificationStatus: text("age_verification_status").notNull().default("not_verified"), // not_verified, pending, verified, failed
  lastVerificationCheck: timestamp("last_verification_check", { withTimezone: true }),

  // Personalization fields
  preferredGreeting: text("preferred_greeting"), // "Hi", "Hello", "Hey", etc.
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  loginCount: integer("login_count").default(0),

  phone: text("phone"),
  subscribeSms: boolean("subscribe_sms").default(false),
  subscribeEmail: boolean("subscribe_email").default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const vipSignups = pgTable("vip_signups", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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

export const productTypes = pgTable("product_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  complianceProfileId: uuid("compliance_profile_id"),
  defaultSort: text("default_sort").default("popularity"),
  facetConfig: jsonb("facet_config"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productTypeRelationships = pgTable(
  "product_type_relationships",
  {
    productTypeId: uuid("product_type_id")
      .references(() => productTypes.id, { onDelete: "cascade" })
      .notNull(),
    parentId: uuid("parent_id")
      .references(() => productTypes.id, { onDelete: "cascade" })
      .notNull(),
    depth: integer("depth").default(1).notNull(),
    breadcrumb: text("breadcrumb").array(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productTypeId, table.parentId] }),
  })
);

export const productSources = pgTable("product_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  systemName: text("system_name").notNull().unique(),
  syncFrequency: text("sync_frequency"),
  credentialsRef: text("credentials_ref"),
  lastSuccess: timestamp("last_success", { withTimezone: true }),
  lastError: timestamp("last_error", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  sku: text("sku").notNull().unique(),
  categoryId: uuid("category_id").references(() => categories.id),
  brandId: uuid("brand_id").references(() => brands.id),
  productTypeId: uuid("product_type_id").references(() => productTypes.id),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  defaultVariantId: uuid("default_variant_id"),
  dataSourceId: uuid("data_source_id").references(() => productSources.id),
  searchVector: text("search_vector"),
  merchandisingTags: text("merchandising_tags").array(),
  imageUrl: text("image_url"),
  material: text("material"),
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  vipExclusive: boolean("vip_exclusive").default(false),
  
  // Compliance fields for high-risk products
  nicotineProduct: boolean("nicotine_product").default(false),
  visibleOnMainSite: boolean("visible_on_main_site").default(true),
  visibleOnTobaccoSite: boolean("visible_on_tobacco_site").default(false),
  requiresLabTest: boolean("requires_lab_test").default(false),
  labTestUrl: text("lab_test_url"),
  batchNumber: text("batch_number"),
  expirationDate: timestamp("expiration_date", { withTimezone: true }),
  hiddenReason: text("hidden_reason"),
  overrideRestrictions: jsonb("override_restrictions"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  sku: text("sku"),
  optionHash: text("option_hash"),
  barcode: text("barcode"),
  price: numeric("price", { precision: 10, scale: 2 }),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  weightG: integer("weight_g"),
  dimsMm: jsonb("dims_mm"),
  inventoryPolicy: text("inventory_policy").default("deny"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const variantInventory = pgTable("variant_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .references(() => productVariants.id, { onDelete: "cascade" })
    .notNull(),
  warehouseId: text("warehouse_id").default("main").notNull(),
  available: integer("available").default(0).notNull(),
  reserved: integer("reserved").default(0).notNull(),
  incoming: integer("incoming").default(0).notNull(),
  safetyStock: integer("safety_stock").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productMedia = pgTable("product_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  path: text("path").notNull(),
  alt: text("alt"),
  role: text("role"),
  sort: integer("sort").default(0),
  width: integer("width"),
  height: integer("height"),
  variantKey: text("variant_key"),
  mediaKind: text("media_kind"),
  storageBucket: text("storage_bucket"),
  transformPreset: text("transform_preset"),
  colorway: text("colorway"),
  isPrimary: boolean("is_primary"),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productOptionDefinitions = pgTable("product_option_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productTypeId: uuid("product_type_id").references(() => productTypes.id, { onDelete: "set null" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  inputType: text("input_type").default("select").notNull(),
  filterBehavior: text("filter_behavior").default("match_any").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productOptionValues = pgTable("product_option_values", {
  id: uuid("id").defaultRandom().primaryKey(),
  optionDefinitionId: uuid("option_definition_id")
    .references(() => productOptionDefinitions.id, { onDelete: "cascade" })
    .notNull(),
  value: text("value").notNull(),
  valueKey: text("value_key"),
  sortOrder: integer("sort_order").default(0).notNull(),
  swatchMediaId: uuid("swatch_media_id").references(() => productMedia.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const variantOptionValues = pgTable(
  "variant_option_values",
  {
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    optionDefinitionId: uuid("option_definition_id")
      .references(() => productOptionDefinitions.id, { onDelete: "cascade" })
      .notNull(),
    optionValueId: uuid("option_value_id")
      .references(() => productOptionValues.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantId, table.optionDefinitionId] }),
  })
);

export const attributeDefinitions = pgTable("attribute_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  scope: text("scope").notNull(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  datatype: text("datatype").notNull(),
  units: text("units"),
  searchable: boolean("searchable").default(false),
  facetable: boolean("facetable").default(false),
  complianceTag: text("compliance_tag"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const attributeValues = pgTable("attribute_values", {
  id: uuid("id").defaultRandom().primaryKey(),
  definitionId: uuid("definition_id")
    .references(() => attributeDefinitions.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
  valueText: text("value_text"),
  valueNumber: numeric("value_number", { precision: 18, scale: 6 }),
  valueBoolean: boolean("value_boolean"),
  valueJson: jsonb("value_json"),
  valueDate: timestamp("value_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const assetCollections = pgTable("asset_collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const assetCollectionMembers = pgTable(
  "asset_collection_members",
  {
    collectionId: uuid("collection_id")
      .references(() => assetCollections.id, { onDelete: "cascade" })
      .notNull(),
    mediaId: uuid("media_id")
      .references(() => productMedia.id, { onDelete: "cascade" })
      .notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.mediaId] }),
  })
);

export const variantMedia = pgTable(
  "variant_media",
  {
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    mediaId: uuid("media_id")
      .references(() => productMedia.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantId, table.mediaId] }),
  })
);

export const productBadges = pgTable("product_badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  badgeType: text("badge_type").default("marketing"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const productBadgeAssignments = pgTable("product_badge_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  badgeId: uuid("badge_id")
    .references(() => productBadges.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const productSearchIndex = pgTable("product_search_index", {
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .primaryKey(),
  searchVector: text("search_vector"),
  popularityScore: numeric("popularity_score", { precision: 10, scale: 4 }).default("0"),
  lastSynced: timestamp("last_synced", { withTimezone: true }),
});

export const productFacets = pgTable("product_facets", {
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .primaryKey(),
  facets: jsonb("facets").notNull(),
  availabilitySummary: jsonb("availability_summary"),
  priceBand: text("price_band"),
  mediaCounts: jsonb("media_counts"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productSourceItems = pgTable("product_source_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .references(() => productSources.id, { onDelete: "cascade" })
    .notNull(),
  externalId: text("external_id").notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  payload: jsonb("payload"),
  checksum: text("checksum"),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  orderNumber: text("order_number").unique(),

  // Customer Information
  customerEmail: text("customer_email").notNull(),
  customerFirstName: text("customer_first_name").notNull(),
  customerLastName: text("customer_last_name").notNull(),
  customerPhone: text("customer_phone"),

  // Order Status
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled, refunded, returned
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, processing, paid, failed, refunded, partially_refunded, voided
  fulfillmentStatus: text("fulfillment_status").notNull().default("unfulfilled"), // unfulfilled, partial, fulfilled, shipped, delivered, returned

  // Payment Information
  paymentMethod: text("payment_method"), // card, ach, digital_wallet
  transactionId: text("transaction_id"),

  // Pricing
  subtotalAmount: numeric("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  // Addresses
  billingAddress: jsonb("billing_address").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),

  // Order Notes
  customerNotes: text("customer_notes"),
  adminNotes: text("admin_notes"),
  giftMessage: text("gift_message"),
  isGift: boolean("is_gift").default(false),

  // Shipping Information
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  shippedAt: timestamp("shipped_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid("product_id"), // Removed references(() => products.id) to support main_site_products

  // Product Information (snapshot at time of order)
  productName: text("product_name").notNull(),
  productSku: text("product_sku").notNull(),
  productImageUrl: text("product_image_url"),

  // Pricing
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),

  // Fulfillment
  fulfillmentStatus: text("fulfillment_status").default("unfulfilled"), // unfulfilled, fulfilled, cancelled

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Order Status History
export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: 'cascade' }),

  // Status Change
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: uuid("changed_by").references(() => users.id, { onDelete: 'set null' }),

  // Notes
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  warehouseId: text("warehouse_id").default("main"),

  // Stock levels
  available: integer("available").notNull().default(0),
  reserved: integer("reserved").notNull().default(0),
  committed: integer("committed").notNull().default(0),
  onOrder: integer("on_order").notNull().default(0),

  // Thresholds and alerts
  lowStockThreshold: integer("low_stock_threshold").default(5),
  reorderPoint: integer("reorder_point").default(10),
  maxStockLevel: integer("max_stock_level"),

  // Tracking and sync
  sku: text("sku"),
  name: text("name"),
  description: text("description"),
  shortDescription: text("short_description"),
  categories: text("categories"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }).defaultNow(),
  sourceVersion: text("source_version"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const inventoryReservations = pgTable("inventory_reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  warehouseId: text("warehouse_id").default("main"),
  userId: uuid("user_id").references(() => users.id),
  sessionId: text("session_id"),

  // Reservation details
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull().default("checkout"),

  // Timing
  reservedAt: timestamp("reserved_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  releasedAt: timestamp("released_at", { withTimezone: true }),

  // Status
  status: text("status").notNull().default("active"), // active, expired, released, converted

  // References
  orderId: uuid("order_id").references(() => orders.id),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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

// Compliance Engine Tables
//
// Schema is wide because hemp-derived cannabinoid law is volatile and per-row
// auditability is the point of the table. See migration
// supabase/migrations/20260508_compliance_rules_expansion.sql for triggers
// (last_updated_at maintained on UPDATE) and the generated next_review_due_at
// column. Drizzle doesn't model trigger-maintained or STORED-generated columns
// directly; the columns are present here so reads return them, but writes
// should never set last_updated_at or next_review_due_at — the DB owns those.
export const complianceRules = pgTable("compliance_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(), // "THCA Flower", "Delta-8", "HHC", "Adaptogenic Mushrooms", etc.
  substanceType: text("substance_type"), // optional finer detail
  restrictedStates: text("restricted_states").array().default([]), // ["ID","IN","UT"]
  ageRequirement: integer("age_requirement").default(21), // 18 or 21
  labTestingRequired: boolean("lab_testing_required").default(false),
  batchTrackingRequired: boolean("batch_tracking_required").default(false),
  warningLabels: text("warning_labels").array().default([]), // ["Not FDA approved"]
  shippingRestrictions: jsonb("shipping_restrictions"), // legacy free-form blob; new code should prefer carrierPolicies rows
  // Synthetic / Nov 2026 federal change tracking
  synthetic: boolean("synthetic").default(false), // HHC / D8 / D10 / THC-P — excluded from hemp definition Nov 2026
  excludedFromHempAt: date("excluded_from_hemp_at"), // 2026-11-12 for the synthetic isomers
  effectiveFrom: date("effective_from"), // when this rule starts applying
  effectiveUntil: date("effective_until"), // null = currently in force
  totalThcLimitMgPerContainer: numeric("total_thc_limit_mg_per_container", { precision: 10, scale: 3 }), // 0.4mg federal cap
  totalThcFormula: text("total_thc_formula"), // "(THCA × 0.877) + Delta-9 THC"
  description: text("description"),
  seizureRiskLevel: text("seizure_risk_level"), // 'low' | 'medium' | 'high' | 'very_high'
  intermediateProductRestricted: boolean("intermediate_product_restricted").default(false), // distillate/isolate-to-consumer ban
  miscRestrictions: jsonb("misc_restrictions").default([]), // [{type, jurisdiction, note}, ...]
  sourceReportId: uuid("source_report_id"), // FK → compliance_reports.id (set up in migration)
  // Review-cadence tracking
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow(), // maintained by trigger; do not set from app code
  nextReviewDueAt: timestamp("next_review_due_at", { withTimezone: true }), // STORED generated column = last_reviewed_at + 7 days
  reviewedBy: uuid("reviewed_by"), // FK to users(id), nullable for service accounts / report imports
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Per-(rule, carrier) shipping policy. Replaces the unstructured
// compliance_rules.shipping_restrictions jsonb for new code.
export const carrierPolicies = pgTable("carrier_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  ruleId: uuid("rule_id").references(() => complianceRules.id, { onDelete: "cascade" }).notNull(),
  carrier: text("carrier").notNull(), // 'USPS' | 'UPS' | 'FedEx' | 'DHL' | 'OnTrac' | 'Other'
  status: text("status").notNull(), // 'permitted' | 'gray_area' | 'conditional' | 'prohibited'
  requirements: text("requirements").array().default([]), // ['COA', 'ASR', 'Hemp agreement', 'License verification']
  prohibitedItems: text("prohibited_items").array().default([]),
  exceptions: text("exceptions"),
  notes: text("notes"),
  sourceReportId: uuid("source_report_id"),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow(),
  nextReviewDueAt: timestamp("next_review_due_at", { withTimezone: true }), // STORED generated
  reviewedBy: uuid("reviewed_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// State / city / county-level limits and bans that don't fit a single column
// on compliance_rules (e.g. CT 3mg/container, MN 5mg/serving, Chicago bans).
export const complianceStateLimits = pgTable("compliance_state_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  ruleId: uuid("rule_id").references(() => complianceRules.id, { onDelete: "cascade" }).notNull(),
  jurisdictionType: text("jurisdiction_type").notNull(), // 'state' | 'city' | 'county' | 'territory'
  stateAbbr: text("state_abbr").notNull(),
  jurisdictionName: text("jurisdiction_name"), // 'Chicago, IL' for sub-state
  limitType: text("limit_type").notNull(), // see migration CHECK for allowed values
  limitValueMg: numeric("limit_value_mg", { precision: 10, scale: 3 }),
  isOutrightBan: boolean("is_outright_ban").default(false),
  citation: text("citation"), // statute / regulation reference
  notes: text("notes"),
  sourceReportId: uuid("source_report_id"),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow(),
  nextReviewDueAt: timestamp("next_review_due_at", { withTimezone: true }),
  reviewedBy: uuid("reviewed_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Append-only audit trail of every review event across compliance tables.
// Insert one row per manual review or automated update; never UPDATE/DELETE.
export const complianceReviewLog = pgTable("compliance_review_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableName: text("table_name").notNull(), // 'compliance_rules' | 'carrier_policies' | 'compliance_state_limits' | 'compliance_reports'
  recordId: uuid("record_id").notNull(),
  action: text("action").notNull(), // 'created' | 'updated' | 'deactivated' | 'reactivated' | 'reviewed_no_change' | 'imported_from_report'
  reviewedBy: uuid("reviewed_by"),
  reviewerName: text("reviewer_name"), // captured at write-time so log stays meaningful even if user record is later deleted
  diff: jsonb("diff"), // { before: {...}, after: {...} } for updates
  source: text("source"), // 'manual_review' | 'admin_edit' | 'report_ingest' | 'automated_check'
  notes: text("notes"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow(),
});

// Source documents of record. Stores each ingested compliance report verbatim
// so any rule change can be traced back to its source.
export const complianceReports = pgTable("compliance_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  reportDate: date("report_date").notNull(),
  effectiveAsOf: text("effective_as_of"), // free-form, e.g. "March 2026"
  federalChanges: jsonb("federal_changes"),
  rawPayload: jsonb("raw_payload").notNull(),
  sourceUrl: text("source_url"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
  ingestedBy: uuid("ingested_by"),
  notes: text("notes"),
});

export const productCompliance = pgTable("product_compliance", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  complianceId: uuid("compliance_id").references(() => complianceRules.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueProductCompliance: unique().on(table.productId, table.complianceId),
}));

export const complianceAuditLog = pgTable("compliance_audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  violation: text("violation").notNull(),
  detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow(),
  resolvedBy: text("resolved_by"), // user id or "n8n"
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  severity: text("severity").default("medium"), // low, medium, high, critical
  notes: text("notes"),
});

// Lab Certificate Table for COA storage and parsing
export const labCertificates = pgTable("lab_certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  batchNumber: text("batch_number"),
  potency: jsonb("potency"), // {delta9:0.27, thca:23.1, cbd:15.2, ...}
  testedAt: timestamp("tested_at", { withTimezone: true }),
  url: text("url").notNull(),
  parsedByAI: boolean("parsed_by_ai").default(false),
  labName: text("lab_name"),
  expirationDate: timestamp("expiration_date", { withTimezone: true }),
  contaminantResults: jsonb("contaminant_results"), // {pesticides: "pass", heavyMetals: "pass", ...}
  isValid: boolean("is_valid").default(true),
  validationErrors: text("validation_errors").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const carouselSlides = pgTable("carousel_slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  ctaText: text("cta_text").notNull().default("Learn More"),
  ctaLink: text("cta_link").notNull().default("/"),
  backgroundImageUrl: text("background_image_url").notNull(),
  textColor: text("text_color").notNull().default("text-white"),
  overlayOpacity: numeric("overlay_opacity", { precision: 3, scale: 2 }).default("0.4"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  displayDuration: integer("display_duration").notNull().default(5000),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdBy: uuid("created_by"),
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

// User Addresses Table
export const userAddresses = pgTable("user_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text("type").notNull(), // shipping, billing
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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
export const insertOrderStatusHistorySchema = createInsertSchema(orderStatusHistory).omit({ id: true, createdAt: true });
export const insertMembershipSchema = createInsertSchema(memberships).omit({ id: true, createdAt: true });
export const insertLoyaltyPointSchema = createInsertSchema(loyaltyPoints).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertUserBehaviorSchema = createInsertSchema(userBehavior).omit({ id: true, createdAt: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, updatedAt: true });
export const insertProductSimilaritySchema = createInsertSchema(productSimilarity).omit({ id: true, calculatedAt: true });
export const insertRecommendationCacheSchema = createInsertSchema(recommendationCache).omit({ id: true, createdAt: true });
export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({ id: true, createdAt: true, updatedAt: true });
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
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = z.infer<typeof insertOrderStatusHistorySchema>;
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
export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;
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

// Compliance schemas and types
export const insertComplianceRuleSchema = createInsertSchema(complianceRules).omit({ id: true, createdAt: true });
export const insertProductComplianceSchema = createInsertSchema(productCompliance).omit({ id: true, createdAt: true });
export const insertComplianceAuditLogSchema = createInsertSchema(complianceAuditLog).omit({ id: true, detectedAt: true });
export const insertLabCertificateSchema = createInsertSchema(labCertificates).omit({ id: true, createdAt: true });

export type ComplianceRule = typeof complianceRules.$inferSelect;
export type InsertComplianceRule = z.infer<typeof insertComplianceRuleSchema>;
export type ProductCompliance = typeof productCompliance.$inferSelect;
export type InsertProductCompliance = z.infer<typeof insertProductComplianceSchema>;
export type ComplianceAuditLog = typeof complianceAuditLog.$inferSelect;
export type InsertComplianceAuditLog = z.infer<typeof insertComplianceAuditLogSchema>;
export type LabCertificate = typeof labCertificates.$inferSelect;
export type InsertLabCertificate = z.infer<typeof insertLabCertificateSchema>;

export * from './emoji-schema';
export * from './concierge-schema';

export const insertVipSignupSchema = createInsertSchema(vipSignups).omit({ id: true, createdAt: true });
export type VipSignup = typeof vipSignups.$inferSelect;
export type InsertVipSignup = z.infer<typeof insertVipSignupSchema>;

// ─── Higher Learning article recommendations ───────────────────────────────
// Editor-curated product picks per article. Read by the article layout to
// render the right-rail "Shop This Setup" list (slot='rail') and the
// mid-article "Upgrade Your Setup" carousel (slot='inline').
//
// productId is a UUID FK to main_site_products(id). main_site_products is not
// (yet) modeled in this Drizzle schema, so the reference is kept as an
// untyped uuid column — same precedent as orderItems.productId. Supersession
// columns (superseded_by_product_id, supersession_note) live on
// main_site_products itself; see migration 20260504_article_recommendations_and_supersession.sql.
export const articleRecommendedProducts = pgTable("article_recommended_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleSlug: text("article_slug").notNull(),
  productId: uuid("product_id").notNull(),
  // 'rail' = sticky right-rail; 'inline' = mid-article carousel.
  slot: text("slot").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slotPositionUnique: unique("article_recommended_products_slot_position_unique")
    .on(table.articleSlug, table.slot, table.position),
  slotProductUnique: unique("article_recommended_products_slot_product_unique")
    .on(table.articleSlug, table.slot, table.productId),
}));

export const insertArticleRecommendedProductSchema = createInsertSchema(articleRecommendedProducts)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type ArticleRecommendedProduct = typeof articleRecommendedProducts.$inferSelect;
export type InsertArticleRecommendedProduct = z.infer<typeof insertArticleRecommendedProductSchema>;
