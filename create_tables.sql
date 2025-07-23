-- Create all necessary tables for VIP Smoke platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    membership_tier_id UUID,
    age_verification_status TEXT NOT NULL DEFAULT 'not_verified',
    last_verification_check TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    image_url TEXT,
    material TEXT,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    vip_exclusive BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier_name TEXT NOT NULL,
    monthly_price NUMERIC(10,2) NOT NULL,
    benefits TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'processing',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    subtotal_amount NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    billing_address JSONB,
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(10,2) NOT NULL
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Points table
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    points INTEGER NOT NULL DEFAULT 0,
    transaction_type TEXT NOT NULL,
    transaction_reference TEXT,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Behavior tracking for recommendations
CREATE TABLE IF NOT EXISTS user_behavior (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT,
    action_type TEXT NOT NULL,
    product_id UUID REFERENCES products(id),
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences for recommendations
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    preferred_categories TEXT[],
    preferred_brands TEXT[],
    preferred_materials TEXT[],
    price_range_min NUMERIC(10,2),
    price_range_max NUMERIC(10,2),
    interaction_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Product Similarity matrix
CREATE TABLE IF NOT EXISTS product_similarity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_a_id UUID REFERENCES products(id),
    product_b_id UUID REFERENCES products(id),
    similarity_score NUMERIC(5,4) NOT NULL,
    similarity_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_a_id, product_b_id, similarity_type)
);

-- Recommendation Cache
CREATE TABLE IF NOT EXISTS recommendation_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    product_ids TEXT[] NOT NULL,
    scores NUMERIC(5,4)[] NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, recommendation_type)
);

-- Zoho Integration tables
CREATE TABLE IF NOT EXISTS zoho_sync_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    last_sync_at TIMESTAMPTZ,
    next_sync_at TIMESTAMPTZ,
    sync_status TEXT NOT NULL DEFAULT 'idle',
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type)
);

CREATE TABLE IF NOT EXISTS zoho_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zoho_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zoho_item_id TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    item_type TEXT,
    product_type TEXT,
    brand TEXT,
    manufacturer TEXT,
    upc TEXT,
    ean TEXT,
    isbn TEXT,
    part_number TEXT,
    item_category_id TEXT,
    item_category_name TEXT,
    item_sub_category_id TEXT,
    item_sub_category_name TEXT,
    account_id TEXT,
    account_name TEXT,
    inventory_account_id TEXT,
    inventory_account_name TEXT,
    purchase_account_id TEXT,
    purchase_account_name TEXT,
    purchase_description TEXT,
    purchase_rate NUMERIC(10,4),
    sales_rate NUMERIC(10,4),
    minimum_order_quantity INTEGER,
    maximum_order_quantity INTEGER,
    reorder_level INTEGER,
    initial_stock INTEGER,
    initial_stock_rate NUMERIC(10,4),
    vendor_id TEXT,
    vendor_name TEXT,
    stock_on_hand INTEGER DEFAULT 0,
    available_stock INTEGER DEFAULT 0,
    actual_available_stock INTEGER DEFAULT 0,
    committed_stock INTEGER DEFAULT 0,
    available_for_sale_stock INTEGER DEFAULT 0,
    unit TEXT,
    stock_value NUMERIC(10,4),
    average_cost NUMERIC(10,4),
    last_purchase_rate NUMERIC(10,4),
    is_combo_product BOOLEAN DEFAULT false,
    is_linked_with_zohocrm BOOLEAN DEFAULT false,
    zcrm_product_id TEXT,
    description TEXT,
    rate NUMERIC(10,4),
    tax_id TEXT,
    tax_name TEXT,
    tax_percentage NUMERIC(5,2),
    purchase_tax_id TEXT,
    purchase_tax_name TEXT,
    purchase_tax_percentage NUMERIC(5,2),
    item_tax_preferences JSONB,
    is_taxable BOOLEAN DEFAULT true,
    tax_exemption_id TEXT,
    tax_exemption_code TEXT,
    has_attachment BOOLEAN DEFAULT false,
    is_returnable BOOLEAN DEFAULT true,
    image_name TEXT,
    image_type TEXT,
    image_document_id TEXT,
    created_time TIMESTAMPTZ,
    last_modified_time TIMESTAMPTZ,
    custom_fields JSONB,
    package_details JSONB,
    warehouse_details JSONB,
    pricebook_rate NUMERIC(10,4),
    status TEXT DEFAULT 'active',
    source TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    documents JSONB,
    warehouses JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zoho_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zoho_salesorder_id TEXT NOT NULL UNIQUE,
    salesorder_number TEXT NOT NULL,
    date DATE,
    due_date DATE,
    shipment_date DATE,
    customer_id TEXT,
    customer_name TEXT,
    company_name TEXT,
    contact_category TEXT,
    status TEXT,
    invoice_status TEXT,
    payment_status TEXT,
    shipped_status TEXT,
    currency_id TEXT,
    currency_code TEXT,
    exchange_rate NUMERIC(10,6) DEFAULT 1,
    discount_type TEXT,
    is_discount_before_tax BOOLEAN DEFAULT true,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(10,4) DEFAULT 0,
    is_inclusive_tax BOOLEAN DEFAULT false,
    line_items JSONB,
    shipping_charges NUMERIC(10,4) DEFAULT 0,
    delivery_method TEXT,
    delivery_method_id TEXT,
    salesorder_date DATE,
    expected_delivery_date DATE,
    reference_number TEXT,
    notes TEXT,
    terms TEXT,
    custom_fields JSONB,
    template_id TEXT,
    template_name TEXT,
    page_width TEXT,
    page_height TEXT,
    orientation TEXT,
    template_type TEXT,
    attachment_name TEXT,
    can_send_in_mail BOOLEAN DEFAULT false,
    salesperson_id TEXT,
    salesperson_name TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    sub_total NUMERIC(10,4) NOT NULL DEFAULT 0,
    total NUMERIC(10,4) NOT NULL DEFAULT 0,
    tax_total NUMERIC(10,4) DEFAULT 0,
    price_precision INTEGER DEFAULT 2,
    taxes JSONB,
    payment_terms INTEGER,
    payment_terms_label TEXT,
    delivery_date DATE,
    delivery_days INTEGER,
    due_by_days INTEGER,
    due_in_days INTEGER,
    created_by_id TEXT,
    last_modified_by_id TEXT,
    created_time TIMESTAMPTZ,
    last_modified_time TIMESTAMPTZ,
    is_emailed BOOLEAN DEFAULT false,
    reminders_sent INTEGER DEFAULT 0,
    last_reminder_sent_date DATE,
    payment_reminder_enabled BOOLEAN DEFAULT false,
    last_payment_reminder_date DATE,
    documents JSONB,
    zcrm_potential_id TEXT,
    zcrm_potential_name TEXT,
    submitted_by TEXT,
    submitted_by_id TEXT,
    approver_id TEXT,
    project_or_estimate_id TEXT,
    estimate_id TEXT,
    is_autobill_enabled BOOLEAN DEFAULT false,
    place_of_supply TEXT,
    gst_no TEXT,
    gst_treatment TEXT,
    tax_treatment TEXT,
    hsn_or_sac TEXT,
    is_pre_gst BOOLEAN DEFAULT false,
    adjustment NUMERIC(10,4) DEFAULT 0,
    adjustment_description TEXT,
    pricebook_id TEXT,
    vat_treatment TEXT,
    tax_authority_id TEXT,
    tax_exemption_id TEXT,
    tax_exemption_code TEXT,
    avatax_exempt_no TEXT,
    avatax_use_code TEXT,
    source_of_supply TEXT,
    destination_of_supply TEXT,
    vat_reg_no TEXT,
    avatax_tax_code TEXT,
    tds_calculation_type TEXT,
    entity_type TEXT,
    destination_country TEXT,
    source_country TEXT,
    round_off_value NUMERIC(10,4) DEFAULT 0,
    local_order_id UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- KajaPay Payment Integration tables
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    kajapay_payment_method_id TEXT UNIQUE,
    payment_type TEXT NOT NULL,
    card_last_four TEXT,
    card_brand TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    bank_name TEXT,
    account_last_four TEXT,
    account_type TEXT,
    is_default BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    kajapay_transaction_id TEXT UNIQUE,
    payment_method_id UUID REFERENCES payment_methods(id),
    transaction_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    gateway_response JSONB,
    failure_reason TEXT,
    processed_at TIMESTAMPTZ,
    refunded_amount NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kajapay_event_id TEXT UNIQUE,
    event_type TEXT NOT NULL,
    transaction_id TEXT,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Emoji Recommendation System tables
CREATE TABLE IF NOT EXISTS emoji_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    context_type TEXT NOT NULL,
    context_data JSONB,
    usage_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, emoji, context_type)
);

CREATE TABLE IF NOT EXISTS emoji_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    favorite_emojis TEXT[],
    emoji_personality JSONB,
    usage_patterns JSONB,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emoji_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    context_type TEXT NOT NULL,
    context_data JSONB,
    recommended_emojis TEXT[],
    recommendation_scores NUMERIC(5,4)[],
    algorithm_used TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emoji_product_associations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    emoji TEXT NOT NULL,
    association_strength NUMERIC(5,4) NOT NULL,
    association_type TEXT NOT NULL,
    user_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, emoji, association_type)
);

-- VIP Concierge AI System tables
CREATE TABLE IF NOT EXISTS concierge_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id TEXT NOT NULL UNIQUE,
    user_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    total_messages INTEGER DEFAULT 0,
    customer_satisfaction_rating INTEGER,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS concierge_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES concierge_conversations(conversation_id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    tools_used TEXT[],
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS concierge_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    avg_conversation_length INTEGER DEFAULT 0,
    avg_satisfaction_rating NUMERIC(3,2),
    popular_topics TEXT[],
    escalation_count INTEGER DEFAULT 0,
    resolution_rate NUMERIC(5,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
);

-- ShipStation Integration tables
CREATE TABLE IF NOT EXISTS shipstation_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    local_order_id UUID REFERENCES orders(id),
    shipstation_order_id TEXT UNIQUE,
    shipstation_order_number TEXT,
    shipstation_order_key TEXT,
    order_status TEXT,
    customer_id TEXT,
    customer_username TEXT,
    customer_email TEXT,
    create_date TIMESTAMPTZ,
    modify_date TIMESTAMPTZ,
    order_date TIMESTAMPTZ,
    payment_date TIMESTAMPTZ,
    ship_by_date DATE,
    ship_date DATE,
    carrier_code TEXT,
    service_code TEXT,
    package_code TEXT,
    confirmation TEXT,
    warehouse_id TEXT,
    void_date TIMESTAMPTZ,
    void_reason TEXT,
    hold_until_date DATE,
    weight JSONB,
    dimensions JSONB,
    insurance_options JSONB,
    international_options JSONB,
    advanced_options JSONB,
    tag_ids TEXT[],
    user_id TEXT,
    externally_fulfilled BOOLEAN DEFAULT false,
    externally_fulfilled_by TEXT,
    label_messages TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    items JSONB,
    amount_paid NUMERIC(10,2),
    tax_amount NUMERIC(10,2),
    shipping_amount NUMERIC(10,2),
    customer_notes TEXT,
    internal_notes TEXT,
    gift BOOLEAN DEFAULT false,
    gift_message TEXT,
    payment_method TEXT,
    requested_shipping_service TEXT,
    tracking_number TEXT,
    shipment_cost NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipstation_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_type TEXT NOT NULL,
    resource_url TEXT,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial data
INSERT INTO categories (name, description, slug) VALUES
('Glass Pipes', 'Handcrafted artisan glass pipes', 'glass-pipes'),
('Dab Rigs', 'Premium concentrate rigs and accessories', 'dab-rigs'),
('Vaporizers', 'Electronic vaporizing devices', 'vaporizers'),
('Accessories', 'Smoking accessories and tools', 'accessories')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO brands (name, description, slug) VALUES
('VIP Signature', 'Premium VIP Smoke house brand', 'vip-signature'),
('Crown Glass', 'Luxury glass artisan pieces', 'crown-glass'),
('Royal Collection', 'High-end smoking accessories', 'royal-collection'),
('Imperial Series', 'Elite concentrate tools', 'imperial-series'),
('Platinum Line', 'Professional grade equipment', 'platinum-line')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO memberships (tier_name, monthly_price, benefits) VALUES
('VIP Gold', 29.99, ARRAY['15% off all orders', 'Free shipping on orders $75+', 'Early access to new products', 'Monthly curated box']),
('VIP Platinum', 49.99, ARRAY['25% off all orders', 'Free shipping on all orders', 'Priority customer support', 'Exclusive member-only products', 'Monthly premium curated box']),
('VIP Diamond', 99.99, ARRAY['35% off all orders', 'Free expedited shipping', '24/7 concierge support', 'Custom product requests', 'Weekly premium curated box', 'Private member events'])
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_vip_exclusive ON products(vip_exclusive);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_action_type ON user_behavior(action_type);
CREATE INDEX IF NOT EXISTS idx_user_behavior_product_id ON user_behavior(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_user_id ON recommendation_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_expires_at ON recommendation_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_zoho_products_item_id ON zoho_products(zoho_item_id);
CREATE INDEX IF NOT EXISTS idx_zoho_products_status ON zoho_products(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_concierge_conversations_conversation_id ON concierge_conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_concierge_messages_conversation_id ON concierge_messages(conversation_id);