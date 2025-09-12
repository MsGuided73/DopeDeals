# 🚀 DopeDeals Comprehensive Implementation Plan
*Updated: September 12, 2025 - Post-Legacy Cleanup*

## **🎯 CRITICAL REQUIREMENTS SUMMARY**

### **🚨 COMPLIANCE REQUIREMENTS (NON-NEGOTIABLE)**
1. **NO nicotine/tobacco products** on main site (separate database/site)
2. **Age verification** before site entry
3. **Zipcode-based product filtering** (gray out unavailable items)
4. **Daily compliance monitoring** with AI agent
5. **Separate tobacco site** for nicotine products

### **🏗️ INFRASTRUCTURE REQUIREMENTS**
1. **Dual-site architecture** (CBD site + Tobacco site)
2. **Admin dashboard** with image/video upload and upscaling
3. **Loyalty program** with birthday gifts and events
4. **Zoho integration** optimization (missing images/descriptions)
5. **AI-powered monitoring** and management

---

## **📋 PHASE 1: COMPLIANCE & INFRASTRUCTURE (Week 1-2)**
*Priority: CRITICAL - Legal Compliance*

### **1.1 Database Architecture Setup**
- [ ] **Create separate Supabase instances**
  - Main DB: CBD/Hemp products only (`nicotine_free = true`)
  - Tobacco DB: Nicotine products (`nicotine_products = true`)
  - Shared services: Customer data, compliance rules

- [ ] **Implement product filtering policies**
  ```sql
  -- Main site RLS policy
  CREATE POLICY "cbd_only_products" ON products
  FOR SELECT USING (nicotine_free = true AND tobacco_free = true);
  ```

- [ ] **Set up zipcode restrictions table**
  ```sql
  CREATE TABLE zipcode_restrictions (
    zipcode VARCHAR(5) PRIMARY KEY,
    state VARCHAR(2),
    cbd_allowed BOOLEAN DEFAULT true,
    delta8_allowed BOOLEAN DEFAULT false,
    shipping_allowed BOOLEAN DEFAULT true
  );
  ```

### **1.2 Age Verification System**
- [ ] **Implement age gate component**
  - Cookie-based initial verification
  - Account creation with ID verification
  - Periodic re-verification system

- [ ] **Create age verification middleware**
  - Protect all product pages
  - Redirect to age gate if not verified
  - Session management for verified users

### **1.3 Compliance Monitoring System**
- [ ] **Build AI Compliance Agent**
  - Daily product classification checks
  - Regulation change monitoring
  - Automated compliance reports
  - Alert system for violations

---

## **📋 PHASE 2: ADMIN DASHBOARD & CONTENT MANAGEMENT (Week 2-3)**
*Priority: HIGH - Content Management*

### **2.1 Admin Dashboard Development**
- [ ] **Port existing admin dashboard** from `server/admin/adminUi.tsx`
  - Convert to Next.js pages in `app/admin/`
  - Maintain all existing functionality
  - Add new features for dual-site management

- [ ] **Image/Video Management System**
  - [ ] Bulk image upload interface
  - [ ] AI-powered image upscaling (using AI service)
  - [ ] Video upload and compression
  - [ ] Product association interface
  - [ ] SEO metadata editor

- [ ] **Product Content Editor**
  - [ ] Rich text editor for descriptions
  - [ ] SEO optimization tools
  - [ ] Compliance status checker
  - [ ] Bulk editing capabilities

### **2.2 Zoho Integration Enhancement**
- [ ] **Current Zoho Schema Analysis** ✅ COMPLETED
  ```typescript
  // AVAILABLE FROM ZOHO:
  ✅ name, sku, description, rate (price)
  ✅ category_name, brand, stock_on_hand
  ✅ Custom fields: cf_dtc_description, cf_msrp, cf_club_discount
  ✅ Custom fields: cf_age_required, cf_restricted_states

  // MISSING FROM ZOHO (need manual entry):
  ❌ product.images[] (critical for ecommerce)
  ❌ product.description_short (SEO optimized)
  ❌ product.description_long (detailed specs)
  ❌ product.seo_title, seo_description
  ❌ product.compliance_status (nicotine/tobacco classification)
  ```

- [ ] **Compliance Classification System**
  - [ ] Use Zoho custom field `cf_age_required` to identify restricted products
  - [ ] Use `cf_restricted_states` for zipcode filtering
  - [ ] Create AI classifier for nicotine/tobacco detection
  - [ ] Implement database separation logic

- [ ] **Content Enhancement Pipeline**
  - [ ] AI-generated descriptions for missing products
  - [ ] Image sourcing and upload system (priority)
  - [ ] SEO optimization for all 4,579 products
  - [ ] Bulk content editing interface

---

## **📋 PHASE 3: LOYALTY PROGRAM & CUSTOMER FEATURES (Week 3-4)**
*Priority: MEDIUM - Customer Retention*

### **3.1 Loyalty Program Database**
```sql
CREATE TABLE loyalty_members (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  points INTEGER DEFAULT 0,
  birthday DATE,
  lifetime_spend DECIMAL(10,2) DEFAULT 0,
  join_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_rewards (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES loyalty_members(id),
  reward_type VARCHAR(50), -- 'birthday_box', 'points', 'discount', 'event_invite'
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_date DATE,
  delivered_date TIMESTAMP
);
```

### **3.2 Loyalty Features Implementation**
- [ ] **Points system**
  - Earn points on purchases
  - Tier-based multipliers
  - Redemption system

- [ ] **Birthday program**
  - Automated birthday gift box scheduling
  - Personalized birthday offers
  - Special birthday tier bonuses

- [ ] **Events system**
  - In-person event management
  - VIP member exclusive events
  - Event RSVP and management

---

## **📋 PHASE 4: AI MANAGER & AUTOMATION (Week 4-5)**
*Priority: HIGH - Operational Efficiency*

### **4.1 AI Manager Service Architecture**
```typescript
// AI Manager Services
├── compliance-monitor.ts     # Daily compliance checks
├── inventory-sync.ts        # Zoho sync monitoring
├── content-generator.ts     # AI descriptions/SEO
├── image-processor.ts       # Upscaling and optimization
├── customer-analyzer.ts     # Behavior analysis
└── alert-system.ts         # Smart notifications
```

### **4.2 Automated Systems**
- [ ] **Daily compliance monitoring**
  - Product classification verification
  - Regulation change detection
  - Zipcode restriction updates
  - Automated compliance reports

- [ ] **Content automation**
  - AI-generated product descriptions
  - SEO optimization suggestions
  - Image processing and upscaling
  - Bulk content updates

---

## **📋 PHASE 5: DEPLOYMENT & OPTIMIZATION (Week 5-6)**
*Priority: HIGH - Go Live*

### **5.1 Server Deployment**
- [ ] **VPS Setup (Contabo)**
  - Docker + Coolify configuration
  - SSL certificates setup
  - Monitoring stack deployment
  - Backup systems configuration

- [ ] **Multi-site deployment**
  - Main CBD/Hemp site deployment
  - Separate tobacco site deployment
  - Admin dashboard deployment
  - AI manager services deployment

### **5.2 Performance Optimization**
- [ ] **Caching strategy**
  - Redis for session management
  - Product catalog caching
  - Image CDN setup
  - Database query optimization

- [ ] **Monitoring & Analytics**
  - Performance monitoring
  - Error tracking
  - Business analytics
  - Compliance monitoring dashboard

---

## **🔧 TECHNICAL SPECIFICATIONS**

### **Server Requirements:**
- **Storage**: 64GB SSD minimum (128GB recommended)
- **RAM**: 16GB minimum (32GB recommended)
- **CPU**: 4 cores minimum (8 cores recommended)
- **Bandwidth**: Unlimited or high allowance

### **Database Architecture:**
```
Main Supabase (CBD/Hemp):
├── products (nicotine_free = true only)
├── customers
├── orders
├── loyalty_members
└── compliance_rules

Tobacco Supabase (Separate):
├── products (nicotine_products = true)
├── customers (age_verified = true)
├── orders
└── compliance_rules

Redis Cache:
├── zipcode_restrictions
├── compliance_cache
├── session_data
└── product_cache
```

### **Compliance Features:**
- **Age Verification**: Multi-layer verification system
- **Product Filtering**: Database-level + application-level filtering
- **Zipcode Restrictions**: Real-time product availability checking
- **Daily Monitoring**: AI-powered compliance checking
- **Audit Trails**: Complete compliance audit logging

---

## **📊 SUCCESS METRICS**

### **Compliance Metrics:**
- Zero nicotine/tobacco products on main site
- 100% age verification before product access
- Daily compliance check completion rate
- Zero compliance violations

### **Business Metrics:**
- Product catalog completion rate (images + descriptions)
- Customer loyalty program adoption
- Average order value increase
- Customer retention improvement

### **Technical Metrics:**
- Site performance (Core Web Vitals)
- Uptime percentage (99.9% target)
- AI automation success rate
- Admin dashboard usage metrics
