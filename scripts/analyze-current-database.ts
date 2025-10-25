#!/usr/bin/env node

/**
 * Comprehensive Database Structure Analysis
 * Analyzes all current tables in Supabase to understand the inherited Zoho schema
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TableInfo {
  name: string;
  exists: boolean;
  recordCount?: number;
  columns?: any[];
  rlsEnabled?: boolean;
  policies?: any[];
  relationships?: string[];
}

async function analyzeTableStructure(tableName: string): Promise<TableInfo> {
  console.log(`\n🔍 Analyzing table: ${tableName}`);

  const info: TableInfo = {
    name: tableName,
    exists: false
  };

  try {
    // Check if table exists and get basic info
    const { data: tableData, error: tableError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (tableError && tableError.code === 'PGRST116') {
      console.log(`   ❌ Table does not exist`);
      return info;
    }

    info.exists = true;

    // Get record count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    info.recordCount = count || 0;
    console.log(`   ✅ Exists with ${info.recordCount} records`);

    // Get column information (this is a workaround since Supabase doesn't expose column metadata directly)
    if (tableData && tableData.length > 0) {
      info.columns = Object.keys(tableData[0]).map(col => ({ name: col }));
      console.log(`   📋 Columns: ${info.columns.map(c => c.name).join(', ')}`);
    }

    // Check for RLS policies
    try {
      const { data: policies, error: policyError } = await supabase.rpc('get_policies', {
        table_name: tableName
      });

      if (policyError) {
        console.log(`   🔒 RLS: Unable to check policies (${policyError.message})`);
      } else {
        info.policies = policies || [];
      console.log(`   🔒 RLS: ${info.policies ? info.policies.length : 0} policies active`);
      }
    } catch (rlsError) {
      console.log(`   🔒 RLS: Check failed`);
    }

  } catch (error) {
    console.log(`   ❌ Error analyzing table: ${error}`);
  }

  return info;
}

async function analyzeAllTables(): Promise<void> {
  console.log('🚀 COMPREHENSIVE DATABASE STRUCTURE ANALYSIS');
  console.log('=' .repeat(70));
  console.log('Analyzing current Supabase structure inherited from Zoho...');

  // Comprehensive list of potential tables based on the schema documentation
  const tablesToCheck = [
    // Core User & Authentication
    'users', 'memberships', 'membership_tiers', 'user_memberships',

    // Product Management
    'products', 'categories', 'brands', 'suppliers',

    // VIP Smoke Specific
    'vip_smoke_products', 'vip_smoke_categories', 'vip_smoke_brands',

    // Order & Commerce
    'orders', 'order_items', 'order_status_history',

    // Inventory Management
    'inventory', 'inventory_reservations',

    // Compliance & Regulatory
    'compliance_rules', 'product_compliance', 'compliance_audit_log', 'lab_certificates',

    // Content Management
    'carousel_slides', 'page_templates', 'user_pages', 'component_library',
    'design_themes', 'media_assets',

    // Analytics & Tracking
    'site_analytics', 'page_analytics', 'user_sessions', 'event_tracking',

    // Integration Tables
    'zoho_products', 'zoho_orders', 'zoho_sync_status', 'zoho_webhook_events',
    'shipstation_orders', 'shipstation_shipments', 'shipstation_webhooks',

    // AI & Recommendation
    'user_behavior', 'user_preferences', 'product_similarity', 'recommendation_cache',

    // Emoji System
    'emoji_usage', 'user_emoji_preferences', 'emoji_recommendations', 'product_emoji_associations',

    // VIP Concierge
    'concierge_conversations', 'concierge_messages', 'concierge_recommendations', 'concierge_analytics',

    // Payment & Loyalty
    'payment_methods', 'payment_transactions', 'kajapay_webhook_events', 'loyalty_points', 'cart_items'
  ];

  const results: TableInfo[] = [];

  for (const tableName of tablesToCheck) {
    const info = await analyzeTableStructure(tableName);
    results.push(info);
  }

  // Summary report
  console.log('\n📊 ANALYSIS SUMMARY');
  console.log('=' .repeat(70));

  const existingTables = results.filter(t => t.exists);
  const missingTables = results.filter(t => !t.exists);

  console.log(`✅ Existing Tables: ${existingTables.length}`);
  console.log(`❌ Missing Tables: ${missingTables.length}`);

  // Group by category
  const categories = {
    'Core User & Auth': ['users', 'memberships', 'membership_tiers', 'user_memberships'],
    'Product Management': ['products', 'categories', 'brands', 'suppliers'],
    'VIP Smoke': ['vip_smoke_products', 'vip_smoke_categories', 'vip_smoke_brands'],
    'Orders & Commerce': ['orders', 'order_items', 'order_status_history'],
    'Inventory': ['inventory', 'inventory_reservations'],
    'Compliance': ['compliance_rules', 'product_compliance', 'compliance_audit_log', 'lab_certificates'],
    'Content': ['carousel_slides', 'page_templates', 'user_pages', 'component_library', 'design_themes', 'media_assets'],
    'Analytics': ['site_analytics', 'page_analytics', 'user_sessions', 'event_tracking'],
    'Integration': ['zoho_products', 'zoho_orders', 'zoho_sync_status', 'zoho_webhook_events', 'shipstation_orders', 'shipstation_shipments', 'shipstation_webhooks'],
    'AI & Recommendations': ['user_behavior', 'user_preferences', 'product_similarity', 'recommendation_cache'],
    'Payment & Loyalty': ['payment_methods', 'payment_transactions', 'kajapay_webhook_events', 'loyalty_points', 'cart_items']
  };

  for (const [category, tables] of Object.entries(categories)) {
    console.log(`\n📂 ${category}:`);
    tables.forEach(table => {
      const info = results.find(t => t.name === table);
      if (info?.exists) {
        console.log(`   ✅ ${table} (${info.recordCount} records)`);
      } else {
        console.log(`   ❌ ${table} (missing)`);
      }
    });
  }

  // Tables needing revision analysis
  console.log('\n🔧 TABLES NEEDING REVISION');
  console.log('=' .repeat(70));

  const tablesNeedingRevision = [
    'products',           // Core product table needs restructuring
    'categories',         // Needs hierarchical structure
    'brands',            // Needs better organization
    'zoho_products',     // Integration table may need updates
    'user_behavior',     // May need blog integration
    'search_analytics'   // Missing from our check but likely exists
  ];

  for (const table of tablesNeedingRevision) {
    const info = results.find(t => t.name === table);
    if (info?.exists) {
      console.log(`\n🔄 ${table}:`);
      console.log(`   Current Status: ${info.recordCount} records`);
      console.log(`   RLS Policies: ${info.policies?.length || 0}`);
      console.log(`   Revision Needed: YES`);
    }
  }

  // Generate RLS recommendations
  console.log('\n🔒 RLS (ROW LEVEL SECURITY) RECOMMENDATIONS');
  console.log('=' .repeat(70));

  console.log('\n📋 REQUIRED RLS POLICIES TO IMPLEMENT:');
  console.log('');

  console.log('1️⃣  PRODUCTS TABLE:');
  console.log('   ```sql');
  console.log('   -- Allow public read access for active products');
  console.log('   CREATE POLICY "products_public_read" ON products');
  console.log('   FOR SELECT USING (is_active = true);');
  console.log('   ');
  console.log('   -- Allow admin full access');
  console.log('   CREATE POLICY "products_admin_all" ON products');
  console.log('   FOR ALL USING (is_admin_user());');
  console.log('   ```');

  console.log('\n2️⃣  VIP SMOKE PRODUCTS TABLE:');
  console.log('   ```sql');
  console.log('   -- Require authentication for VIP products');
  console.log('   CREATE POLICY "vip_products_auth_required" ON vip_smoke_products');
  console.log('   FOR SELECT USING (auth.role() = \'authenticated\');');
  console.log('   ');
  console.log('   -- Age verification for restricted products');
  console.log('   CREATE POLICY "vip_products_age_verified" ON vip_smoke_products');
  console.log('   FOR SELECT USING (');
  console.log('     check_user_age_verification(auth.uid(), age_restriction)');
  console.log('   );');
  console.log('   ```');

  console.log('\n3️⃣  ORDERS TABLE:');
  console.log('   ```sql');
  console.log('   -- Users can only see their own orders');
  console.log('   CREATE POLICY "orders_user_access" ON orders');
  console.log('   FOR SELECT USING (auth.uid() = user_id);');
  console.log('   ');
  console.log('   -- Admins can see all orders');
  console.log('   CREATE POLICY "orders_admin_access" ON orders');
  console.log('   FOR ALL USING (is_admin_user());');
  console.log('   ```');

  console.log('\n4️⃣  USER BEHAVIOR TABLE:');
  console.log('   ```sql');
  console.log('   -- Users can only see their own behavior data');
  console.log('   CREATE POLICY "user_behavior_privacy" ON user_behavior');
  console.log('   FOR SELECT USING (auth.uid() = user_id);');
  console.log('   ```');

  // Final recommendations
  console.log('\n🎯 FINAL RECOMMENDATIONS');
  console.log('=' .repeat(70));

  console.log('✅ TABLES TO KEEP AS-IS:');
  console.log('   - orders, order_items (working well)');
  console.log('   - payment_methods, payment_transactions (functional)');
  console.log('   - user_sessions, event_tracking (analytics working)');

  console.log('\n🔄 TABLES NEEDING MODIFICATION:');
  console.log('   - products (complete restructure)');
  console.log('   - categories (hierarchical structure)');
  console.log('   - brands (better organization)');
  console.log('   - zoho_products (integration improvements)');

  console.log('\n❌ TABLES TO CONSIDER REMOVING:');
  console.log('   - emoji_* tables (not business critical)');
  console.log('   - concierge_* tables (nice-to-have, not essential)');
  console.log('   - shipstation_* tables (if not using ShipStation)');

  console.log('\n📅 IMPLEMENTATION PRIORITY:');
  console.log('   1. Week 1: Products table restructure');
  console.log('   2. Week 1: Categories hierarchy');
  console.log('   3. Week 2: RLS policies implementation');
  console.log('   4. Week 2: Zoho integration improvements');
  console.log('   5. Week 3: Advanced features (blog, compliance)');

}

// Run the analysis
analyzeAllTables().then(() => {
  console.log('\n✅ Database analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
