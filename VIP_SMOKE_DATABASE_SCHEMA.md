# VIP Smoke Database Schema Documentation

## Overview
This document provides a comprehensive overview of all database tables in the VIP Smoke platform, including both the main Highway420 site and the VIP Smoke (tobacco/nicotine) site. The platform uses a dual-site architecture with strict compliance separation.

## Table of Contents
1. [Core User & Authentication Tables](#core-user--authentication-tables)
2. [Product Management Tables](#product-management-tables)
3. [VIP Smoke Specific Tables](#vip-smoke-specific-tables)
4. [Order & Commerce Tables](#order--commerce-tables)
5. [Inventory Management Tables](#inventory-management-tables)
6. [Compliance & Regulatory Tables](#compliance--regulatory-tables)
7. [Content Management Tables](#content-management-tables)
8. [Analytics & Tracking Tables](#analytics--tracking-tables)
9. [Integration Tables](#integration-tables)
10. [AI & Recommendation Tables](#ai--recommendation-tables)

---

## Core User & Authentication Tables

### `users`
**Purpose**: Core user accounts and authentication
**Key Fields**:
- `id` (UUID, PK) - Unique user identifier
- `email` (TEXT, UNIQUE) - User email address
- `first_name`, `last_name` - User names
- `membership_tier_id` (UUID) - VIP membership level
- `age_verification_status` - Compliance status (not_verified, pending, verified, failed)
- `last_verification_check` - Last age verification timestamp
- `preferred_greeting` - Personalization field
- `login_count`, `last_login_at` - Usage tracking

**Compliance Notes**: Age verification is critical for tobacco/nicotine products

### `memberships`
**Purpose**: VIP membership tiers and benefits
**Key Fields**:
- `id` (UUID, PK)
- `tier_name` (TEXT) - Membership level name
- `monthly_price` (DECIMAL) - Subscription cost
- `benefits` (TEXT[]) - Array of membership benefits

---

## Product Management Tables

### `products` (Main Site)
**Purpose**: Primary product catalog for CBD/hemp products
**Key Fields**:
- `id` (UUID, PK)
- `name`, `description`, `shortDescription` - Product info
- `price`, `vipPrice`, `compareAtPrice` - Pricing
- `sku` (TEXT, UNIQUE) - Stock keeping unit
- `categoryId`, `brandId` - Organization
- `imageUrl`, `material` - Product details
- `inStock`, `featured`, `vipExclusive` - Status flags
- `nicotineProduct` (BOOLEAN) - Compliance flag
- `visibleOnMainSite`, `visibleOnTobaccoSite` - Site visibility
- `requiresLabTest`, `labTestUrl` - Compliance requirements
- `batchNumber`, `expirationDate` - Tracking fields

**Compliance Notes**: Products with `nicotineProduct = true` should be migrated to VIP Smoke

### `categories`
**Purpose**: Product categorization system
**Key Fields**:
- `id` (UUID, PK)
- `name`, `description` - Category info
- `slug` (TEXT, UNIQUE) - URL-friendly identifier

### `brands`
**Purpose**: Product brand management
**Key Fields**:
- `id` (UUID, PK)
- `name`, `description` - Brand info
- `slug` (TEXT, UNIQUE) - URL-friendly identifier

---

## VIP Smoke Specific Tables

### `vip_smoke_products`
**Purpose**: Separate product catalog for nicotine/tobacco products
**Key Fields**:
- `id` (UUID, PK)
- `name`, `description`, `shortDescription` - Product info
- `price`, `vipPrice`, `compareAtPrice`, `costPrice` - Pricing
- `sku` (TEXT, UNIQUE) - Stock keeping unit
- `brandId`, `categoryId`, `supplierId` - Organization
- `stockQuantity`, `lowStockThreshold` - Inventory
- `weight`, `dimensions`, `materials` - Physical attributes
- `imageUrl`, `imageUrls`, `videoUrls` - Media
- `attributes`, `specs`, `tags` - Product metadata
- **VIP Smoke Specific Fields**:
  - `nicotineContent` (DECIMAL) - mg/ml or percentage
  - `nicotineType` - freebase, salt, synthetic
  - `tobaccoType` - cigarette, cigar, pipe, chewing
  - `ageRestriction` (INTEGER, DEFAULT 21)
  - `requiresIdVerification` (BOOLEAN, DEFAULT true)
- **Compliance Fields**:
  - `restrictedStates` (TEXT[]) - Banned states
  - `restrictedZipcodes` (TEXT[]) - Banned zip codes
  - `complianceNotes`, `warningLabels` (TEXT[])
- `isActive`, `featured`, `vipExclusive` - Status
- `zoho_item_id`, `zoho_last_sync` - Integration

**Critical**: This table has RLS policies requiring authentication

### `vip_smoke_categories`
**Purpose**: Categories specific to tobacco/nicotine products
**Key Fields**:
- `id` (TEXT, PK)
- `name`, `description` - Category info
- `parent_id` - Hierarchical structure
- `age_restriction` (INTEGER, DEFAULT 21)
- `is_active`, `sort_order` - Management

**Default Categories**: nicotine-pouches, vapes, tobacco, accessories

### `vip_smoke_brands`
**Purpose**: Brands specific to tobacco/nicotine products
**Key Fields**:
- `id` (TEXT, PK)
- `name`, `description` - Brand info
- `logo_url`, `website_url` - Brand assets
- `is_active` - Status

---

## Order & Commerce Tables

### `orders`
**Purpose**: Customer order management
**Key Fields**:
- `id` (UUID, PK)
- `user_id` - Customer reference
- `order_number` (TEXT, UNIQUE) - Human-readable ID
- **Customer Info**: `customer_email`, `customer_first_name`, `customer_last_name`, `customer_phone`
- **Status Fields**: `status`, `payment_status`, `fulfillment_status`
- **Pricing**: `subtotal_amount`, `tax_amount`, `shipping_amount`, `discount_amount`, `total_amount`
- **Addresses**: `billing_address`, `shipping_address` (JSONB)
- **Payment**: `payment_method`, `transaction_id`
- **Shipping**: `tracking_number`, `carrier`
- **Timestamps**: `created_at`, `shipped_at`, `delivered_at`

### `order_items`
**Purpose**: Individual items within orders
**Key Fields**:
- `id` (UUID, PK)
- `order_id` - Parent order
- `product_id` - Product reference
- **Product Snapshot**: `product_name`, `product_sku`, `product_image_url`
- **Pricing**: `unit_price`, `quantity`, `total_price`
- `fulfillment_status` - Item-level fulfillment

### `order_status_history`
**Purpose**: Audit trail for order status changes
**Key Fields**:
- `order_id` - Parent order
- `from_status`, `to_status` - Status transition
- `changed_by` - User who made change
- `notes` - Change reason

---

## Inventory Management Tables

### `inventory`
**Purpose**: Real-time inventory tracking
**Key Fields**:
- `product_id` - Product reference
- `warehouse_id` (DEFAULT 'main') - Location
- **Stock Levels**: `available`, `reserved`, `committed`, `on_order`
- **Thresholds**: `low_stock_threshold`, `reorder_point`, `max_stock_level`
- **Sync Fields**: `sku`, `name`, `description`, `categories`
- `last_synced_at`, `source_version` - Integration tracking

### `inventory_reservations`
**Purpose**: Temporary stock holds during checkout
**Key Fields**:
- `product_id`, `warehouse_id` - Location
- `user_id`, `session_id` - Customer
- `quantity`, `reason` - Reservation details
- `reserved_at`, `expires_at`, `released_at` - Timing
- `status` - active, expired, released, converted
- `order_id` - Final order reference

---

## Compliance & Regulatory Tables

### `compliance_rules`
**Purpose**: Regulatory compliance definitions
**Key Fields**:
- `category` - THCA, Kratom, Nicotine, 7-Hydroxy
- `substance_type` - Finer categorization
- `restricted_states` (TEXT[]) - Banned states
- `age_requirement` (INTEGER) - 18 or 21
- `lab_testing_required`, `batch_tracking_required` - Requirements
- `warning_labels` (TEXT[]) - Required warnings
- `shipping_restrictions` (JSONB) - Carrier/weight limits

### `product_compliance`
**Purpose**: Links products to compliance rules
**Key Fields**:
- `product_id` - Product reference
- `compliance_id` - Rule reference
- Unique constraint on product+compliance

### `compliance_audit_log`
**Purpose**: Compliance violation tracking
**Key Fields**:
- `product_id` - Violating product
- `violation` - Description of issue
- `detected_at`, `resolved_at` - Timeline
- `resolved_by` - User or system
- `severity` - low, medium, high, critical

### `lab_certificates`
**Purpose**: COA (Certificate of Analysis) storage
**Key Fields**:
- `product_id`, `batch_number` - Product tracking
- `potency` (JSONB) - {delta9, thca, cbd, ...}
- `tested_at`, `expiration_date` - Validity
- `url` - Certificate location
- `parsed_by_ai` - AI processing flag
- `lab_name` - Testing facility
- `contaminant_results` (JSONB) - Safety results
- `is_valid`, `validation_errors` - Status

---

## Content Management Tables

### `carousel_slides`
**Purpose**: Dynamic homepage carousel management
**Key Fields**:
- `title`, `subtitle`, `description` - Content
- `cta_text`, `cta_link` - Call-to-action
- `background_image_url` - Visual
- `text_color`, `overlay_opacity` - Styling
- `is_active`, `sort_order` - Management
- `display_duration` - Timing (milliseconds)

### Page Builder System

### `page_templates`
**Purpose**: Predefined page layouts
**Key Fields**:
- `name`, `description`, `category` - Template info
- `thumbnail` - Preview image
- `design_config` (JSONB) - Complete page structure
- `is_active` - Status

### `user_pages`
**Purpose**: Custom pages built with visual editor
**Key Fields**:
- `title`, `slug` - Page identification
- `template_id` - Optional base template
- `design_config` (JSONB) - Page structure
- **SEO**: `meta_title`, `meta_description`, `meta_keywords`, `og_image`
- **Publishing**: `status`, `published_at`, `scheduled_at`
- **Versioning**: `version`, `parent_page_id`
- **Analytics**: `view_count`, `last_viewed_at`

### `component_library`
**Purpose**: Reusable UI components
**Key Fields**:
- `name`, `category` - Component info
- `component_type` - hero, card, button, form, gallery
- `default_props` (JSONB) - Default configuration
- `config_schema` (JSONB) - Configuration options
- `style_variants` (JSONB) - Style options
- `usage_count` - Popularity tracking

### `design_themes`
**Purpose**: Color schemes and styling presets
**Key Fields**:
- **Colors**: `primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`
- **Typography**: `primary_font`, `secondary_font`, `heading_font`
- **Layout**: `border_radius`, `spacing`
- **Effects**: `glassmorphism`, `gradients`, `shadows` (JSONB)
- `theme_config` (JSONB) - Complete theme object
- `is_default`, `is_active` - Status

### `media_assets`
**Purpose**: Media library for page builder
**Key Fields**:
- `filename`, `original_name`, `mime_type`, `file_size`
- **Storage**: `bucket_name`, `file_path`, `public_url`
- **Metadata**: `width`, `height`, `alt_text`, `caption`
- **Organization**: `category`, `tags` (JSONB)
- `usage_count` - Usage tracking

---

## Analytics & Tracking Tables

### `site_analytics`
**Purpose**: Overall site performance tracking
**Key Fields**:
- `site_type` - cbd, tobacco, admin
- `date` - Analytics date
- **Traffic**: `unique_visitors`, `page_views`, `sessions`, `bounce_rate`, `avg_session_duration`
- **Conversion**: `conversions`, `conversion_rate`, `revenue`, `avg_order_value`
- **Performance**: `avg_page_load_time`, `server_response_time`

### `page_analytics`
**Purpose**: Individual page performance
**Key Fields**:
- `site_type`, `page_path`, `page_title`
- **Metrics**: `views`, `unique_views`, `avg_time_on_page`, `bounces`, `exits`
- **Engagement**: `scroll_depth`, `click_through_rate`

### `user_sessions`
**Purpose**: Individual user session tracking
**Key Fields**:
- `session_id` (UNIQUE), `user_id`, `site_type`
- **Session**: `start_time`, `end_time`, `duration`, `page_views`
- **User Info**: `user_agent`, `ip_address`, `country`, `region`, `city`
- **Referral**: `referrer`, `utm_source`, `utm_medium`, `utm_campaign`
- **Device**: `device_type`, `browser`, `os`, `screen_resolution`
- **Conversion**: `converted`, `conversion_value`

### `event_tracking`
**Purpose**: Detailed user interaction tracking
**Key Fields**:
- `session_id`, `user_id`, `site_type`
- **Event**: `event_type`, `event_category`, `event_action`, `event_label`, `event_value`
- **Context**: `page_path`, `page_title`
- **Element**: `element_id`, `element_class`, `element_text`, `element_position` (JSONB)
- **Product**: `product_id`, `product_name`, `product_category`, `product_price`
- `metadata` (JSONB) - Additional data

---

## Integration Tables

### Zoho Integration

### `zoho_products`
**Purpose**: Sync with Zoho inventory system
**Key Fields**:
- `zoho_item_id` (UNIQUE) - Zoho identifier
- `local_product_id` - Local product reference
- `name`, `sku`, `description` - Product info
- `rate` - Price from Zoho
- **Stock**: `stock_on_hand`, `available_stock`, `actual_available_stock`
- `zoho_category_id`, `zoho_category_name`, `brand`
- `status` - active, inactive
- `last_modified_time`, `synced_at` - Sync tracking

### `zoho_orders`
**Purpose**: Sync orders with Zoho
**Key Fields**:
- `zoho_salesorder_id` (UNIQUE) - Zoho identifier
- `local_order_id` - Local order reference
- `salesorder_number`, `customer_id`, `customer_name`, `customer_email`
- `date`, `status`, `invoice_status`, `payment_status`
- **Pricing**: `sub_total`, `tax_total`, `total`, `currency_code`
- `last_modified_time`, `synced_at` - Sync tracking

### `zoho_sync_status`
**Purpose**: Track sync operations
**Key Fields**:
- `resource_type` - product, category, order, customer
- `resource_id`, `zoho_id` - ID mapping
- `last_synced`, `sync_status` - success, failed, pending
- `error_message`, `retry_count` - Error handling

### `zoho_webhook_events`
**Purpose**: Process Zoho webhooks
**Key Fields**:
- `event_id` (UNIQUE), `event_type`, `event_time`
- `organization_id`, `resource_type`, `resource_id`
- `operation` - create, update, delete
- `processed`, `processed_at`, `error_message`
- `raw_data` - Full webhook payload

### ShipStation Integration

### `shipstation_orders`
**Purpose**: Sync orders with ShipStation
**Key Fields**:
- `order_id` - Internal order ID
- `shipstation_order_id` - ShipStation ID
- `order_number`, `order_status`, `customer_id`
- `bill_to`, `ship_to` (JSONB) - Addresses
- `items` (JSONB) - Order items
- **Pricing**: `order_total`, `amount_paid`, `tax_amount`, `shipping_amount`
- **Shipping**: `carrier_code`, `service_code`, `tracking_number`
- **Options**: `weight`, `dimensions`, `insurance_options` (JSONB)

### `shipstation_shipments`
**Purpose**: Track shipments from ShipStation
**Key Fields**:
- `order_id`, `shipstation_order_id`, `shipment_id`
- `create_date`, `ship_date`, `ship_to` (JSONB)
- `tracking_number`, `carrier_code`, `service_code`
- `shipping_cost`, `insurance_cost`
- `voided`, `void_date`, `marketplace_notified`
- `shipment_items` (JSONB), `label_data`, `form_data`

### `shipstation_webhooks`
**Purpose**: Process ShipStation webhooks
**Key Fields**:
- `resource_url`, `resource_type`, `event_type`
- `data` (JSONB) - Webhook payload
- `processed`, `processed_at`, `error_message`, `retry_count`

---

## AI & Recommendation Tables

### User Behavior & Preferences

### `user_behavior`
**Purpose**: Track user actions for recommendations
**Key Fields**:
- `user_id`, `product_id`, `session_id`
- `action` - view, add_to_cart, purchase, wishlist, search
- `metadata` (JSONB) - Search terms, time spent, etc.

### `user_preferences`
**Purpose**: Store user preferences for personalization
**Key Fields**:
- `user_id` (UNIQUE)
- `preferred_categories`, `preferred_brands`, `preferred_materials` (TEXT[])
- `price_range_min`, `price_range_max`
- `vip_products_only` - VIP preference

### `product_similarity`
**Purpose**: Product similarity matrix for recommendations
**Key Fields**:
- `product_id1`, `product_id2` - Product pair
- `similarity_score` - Calculated similarity (0-1)
- `calculated_at` - Freshness tracking

### `recommendation_cache`
**Purpose**: Cache recommendations for performance
**Key Fields**:
- `user_id`, `recommendation_type` - trending, personalized, similar, category_based
- `product_ids` (TEXT[]) - Recommended products
- `score` - Recommendation confidence
- `expires_at` - Cache expiration

### Emoji System

### `emoji_usage`
**Purpose**: Track emoji usage patterns
**Key Fields**:
- `user_id`, `emoji`, `emoji_code`
- `context` - product_review, comment, reaction, search
- `context_id` - Related item ID
- `sentiment` - positive, negative, neutral
- `frequency`, `last_used`

### `user_emoji_preferences`
**Purpose**: User emoji personality profiles
**Key Fields**:
- `user_id` (UNIQUE)
- `favorite_emojis` (TEXT[]) - Most used
- `preferred_categories` (TEXT[]) - smileys, objects, nature
- `emoji_personality` - expressive, minimal, professional
- `contextual_preferences` (JSONB) - Context-specific preferences

### `emoji_recommendations`
**Purpose**: AI-generated emoji suggestions
**Key Fields**:
- `user_id`, `context`, `context_data` (JSONB)
- `recommended_emojis` (JSONB) - Emoji objects with scores
- `algorithm_version`, `confidence` - AI metadata
- `used`, `used_emoji_id` - Usage tracking
- `expires_at` - Cache expiration

### `product_emoji_associations`
**Purpose**: Product-emoji relationship mapping
**Key Fields**:
- `product_id`, `emoji`, `emoji_code`
- `association_strength` (0-100) - Relationship strength
- `usage_count` - How often used together
- `sentiment` - Overall sentiment for combo

### VIP Concierge System

### `concierge_conversations`
**Purpose**: AI concierge chat sessions
**Key Fields**:
- `id`, `session_id`, `user_id`
- `status` - active, completed, escalated
- `priority` - low, normal, high, vip
- `customer_info` (JSON) - Name, email, phone, membership
- `metadata` (JSON) - Browser info, page context
- `created_at`, `updated_at`, `last_active_at`

### `concierge_messages`
**Purpose**: Individual chat messages
**Key Fields**:
- `conversation_id`, `role` - user, assistant, system
- `content`, `message_type` - text, product_recommendation, image, link
- `metadata` (JSON) - Recommendations, products, context
- `ai_provider` - openai, perplexity, rule-based
- `confidence` - AI confidence score (0-100)
- `is_visible` - Message visibility

### `concierge_recommendations`
**Purpose**: Product recommendations within chats
**Key Fields**:
- `conversation_id`, `message_id`, `product_id`
- `recommendation_type` - primary, alternative, complementary, trending
- `confidence`, `reason` - Recommendation details
- `metadata` (JSON) - Price comparison, features, availability
- `user_feedback` - positive, negative, neutral
- `clicked_at`, `purchased_at` - Conversion tracking

### `concierge_analytics`
**Purpose**: Concierge system performance metrics
**Key Fields**:
- `conversation_id`, `event_type` - conversation_start, message_sent, recommendation_clicked, conversation_end
- `event_data` (JSON) - Event details
- `performance_metrics` (JSON) - Response time, AI confidence, user satisfaction

---

## Payment & Loyalty Tables

### `payment_methods`
**Purpose**: Stored customer payment methods
**Key Fields**:
- `user_id`, `kajapay_token` - Payment processor token
- `card_last4`, `card_type`, `expiry_month`, `expiry_year`
- `billing_name`, `billing_address` (JSONB)
- `is_default` - Default payment method

### `payment_transactions`
**Purpose**: Payment transaction history
**Key Fields**:
- `order_id`, `kajapay_transaction_id`, `kajapay_reference_number`
- `transaction_type` - charge, refund, void
- `amount`, `currency`, `status` - pending, approved, declined, refunded
- `kajapay_status_code`, `auth_code`, `error_message`
- `payment_method_data`, `transaction_details` (JSONB)

### `kajapay_webhook_events`
**Purpose**: Process payment webhooks
**Key Fields**:
- `event_type`, `kajapay_transaction_id`
- `payload` (JSONB) - Webhook data
- `processed`, `processed_at` - Processing status

### `loyalty_points`
**Purpose**: Customer loyalty point system
**Key Fields**:
- `user_id`, `points` - Point balance
- `transaction_type` - earn_purchase, redeem_discount, membership_bonus
- `order_id` - Related order

### `cart_items`
**Purpose**: Shopping cart persistence
**Key Fields**:
- `user_id`, `product_id`, `quantity`
- `created_at` - Cart item age

---

## Key Relationships & Constraints

### Critical Foreign Keys
- `products.category_id` → `categories.id`
- `products.brand_id` → `brands.id`
- `orders.user_id` → `users.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`
- `inventory.product_id` → `products.id`
- `vip_smoke_products` - Separate from main products table

### Unique Constraints
- `users.email` - One account per email
- `products.sku` - Unique product codes
- `vip_smoke_products.sku` - Unique VIP product codes
- `orders.order_number` - Unique order identifiers
- `categories.slug`, `brands.slug` - URL-friendly identifiers

### Compliance Constraints
- `vip_smoke_products.age_restriction` - Minimum age requirements
- `compliance_rules.restricted_states` - Geographic restrictions
- `lab_certificates.expiration_date` - Certificate validity
- Row Level Security (RLS) on VIP Smoke tables

---

## Database Indexes & Performance

### Critical Indexes
- `products(category_id, brand_id)` - Product filtering
- `orders(user_id, created_at)` - User order history
- `inventory(product_id, warehouse_id)` - Stock lookups
- `user_behavior(user_id, action, created_at)` - Recommendation engine
- `event_tracking(session_id, event_type, timestamp)` - Analytics
- Full-text search on product names and descriptions

### Performance Considerations
- JSONB fields for flexible metadata storage
- Array fields for tags, categories, restrictions
- Timestamp indexes for time-based queries
- Composite indexes for common filter combinations

---

## Security & Compliance

### Row Level Security (RLS)
- `vip_smoke_products` - Requires authentication
- `orders` - Users can only see their own orders
- `user_behavior` - Privacy protection
- `payment_methods` - User-specific access

### Data Privacy
- PII encryption for sensitive fields
- Audit logging for compliance changes
- Geographic data restrictions
- Age verification requirements

### Compliance Features
- Automatic product restriction enforcement
- Lab certificate validation
- Warning label requirements
- State-based product filtering
- Audit trails for regulatory reporting

---

## Migration & Sync Status

### Current State
- **Main Products**: ~4,579 products from Zoho sync
- **VIP Smoke Products**: Separate table ready for tobacco/nicotine products
- **Categories**: Basic structure in place, needs expansion
- **Brands**: Limited brand data, needs enhancement
- **Orders**: Full order management system
- **Inventory**: Real-time tracking with Zoho integration
- **Compliance**: Framework in place, needs rule population
- **Analytics**: Comprehensive tracking system
- **AI Features**: Recommendation engine and concierge system

### Recommended Actions
1. **Populate VIP Smoke Products**: Migrate nicotine products from main table
2. **Enhance Brand Data**: Add logos, descriptions, and metadata
3. **Expand Categories**: Create comprehensive category hierarchy
4. **Configure Compliance Rules**: Set up state restrictions and age requirements
5. **Implement Lab Certificates**: Add COA tracking for regulated products
6. **Test RLS Policies**: Ensure proper access control
7. **Optimize Indexes**: Add performance indexes for common queries
8. **Set Up Monitoring**: Implement compliance violation alerts

---

*Last Updated: January 24, 2025*
*Total Tables: 50+ across all systems*
*Database Engine: PostgreSQL with Supabase*
