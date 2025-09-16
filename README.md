# DOPE CITY - Premium Cannabis & Smoke Shop Platform

[![CI](https://github.com/MsGuided73/DopeDeals/actions/workflows/ci.yml/badge.svg?branch=planning/nextjs-migration-and-integrations)](https://github.com/MsGuided73/DopeDeals/actions/workflows/ci.yml)

**A Next.js 15 e-commerce platform with dual-site compliance architecture, AI-powered recommendations, and comprehensive inventory management.**

---

## 🏗️ **ARCHITECTURE OVERVIEW**

### **Tech Stack**
- **Frontend**: Next.js 15.4.6 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS 3.4.17 with custom Chalets font
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Payments**: KajaPay integration (sandbox/production)
- **Shipping**: ShipStation integration
- **Inventory**: Zoho Inventory API integration
- **AI**: OpenAI GPT-4 for product recommendations and chat
- **Package Manager**: pnpm 9.12.0

### **Dual-Site Compliance Architecture**
- **Main Site**: Non-nicotine products (glass, accessories, CBD)
- **Tobacco Site**: Nicotine/tobacco products (separate compliance)
- **Automatic Product Classification**: AI-powered nicotine detection
- **Age Verification**: Required for tobacco products
- **State-Based Restrictions**: PACT Act compliance

---

## 🚀 **QUICK START**

### **Prerequisites**
- Node.js 18+
- pnpm 9.12.0+
- Supabase account
- Zoho Inventory account (optional)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/MsGuided73/DopeDeals.git
cd DopeDeals

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see Environment Setup section)
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### **Build for Production**

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## ⚙️ **ENVIRONMENT SETUP**

### **Required Environment Variables**

Create a `.env.local` file with the following variables:

```bash
# ---------- Site Configuration ----------
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ---------- Supabase Database ----------
# Frontend (public keys)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (service key - KEEP SECRET)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database connection string
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require

# ---------- Zoho Inventory Integration ----------
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ORGANIZATION_ID=your_zoho_org_id
ZOHO_BASE_URL=https://www.zohoapis.com/inventory/v1

# Optional Zoho settings
ZOHO_INTEGRATION_ENABLED=true
ZOHO_SYNC_INTERVAL=30
ZOHO_BATCH_SIZE=100
ZOHO_RETRY_ATTEMPTS=3
ZOHO_RETRY_DELAY=5000

# ---------- Payment Processing ----------
# KajaPay (sandbox/production)
KAJAPAY_USERNAME=your_kajapay_username
KAJAPAY_PASSWORD=your_kajapay_password
KAJAPAY_SOURCE_KEY=your_kajapay_source_key
KAJAPAY_ENVIRONMENT=sandbox  # or 'production'
KAJAPAY_ENABLE_SAVED_CARDS=true
KAJAPAY_AUTO_CAPTURE=true

# ---------- Shipping Integration ----------
SHIPSTATION_API_KEY=your_shipstation_api_key
SHIPSTATION_API_SECRET=your_shipstation_api_secret
SHIPSTATION_ENABLE_WEBHOOKS=false

# ---------- AI Features ----------
OPENAI_API_KEY=your_openai_api_key

# ---------- Security ----------
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your_random_32_char_key
```

### **Supabase Setup**

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: Copy URL and keys from Settings > API
3. **Run Database Migrations**: Execute the SQL files in `/supabase/migrations/`
4. **Configure RLS**: Enable Row Level Security policies
5. **Set up Authentication**: Configure auth providers in Supabase dashboard

### **Zoho Inventory Setup**

1. **Create Zoho Account**: Sign up at [zoho.com/inventory](https://zoho.com/inventory)
2. **Create OAuth App**: Go to Zoho API Console and create a new app
3. **Get Credentials**: Copy Client ID, Client Secret, and Organization ID
4. **Generate Refresh Token**: Use OAuth flow to get refresh token
5. **Test Connection**: Run `GET /api/zoho/test-connection` to verify setup

---

## 📊 **DATABASE SCHEMA**

### **Core Tables**

#### **Users**
```sql
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  membership_tier_id UUID,
  age_verification_status TEXT DEFAULT 'not_verified',
  preferred_greeting TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### **Products**
```sql
products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  image_url TEXT,
  material TEXT,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  vip_exclusive BOOLEAN DEFAULT false,

  -- Compliance fields
  nicotine_product BOOLEAN DEFAULT false,
  visible_on_main_site BOOLEAN DEFAULT true,
  visible_on_tobacco_site BOOLEAN DEFAULT false,
  requires_lab_test BOOLEAN DEFAULT false,
  lab_test_url TEXT,
  batch_number TEXT,
  expiration_date TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
)
```

#### **Orders**
```sql
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'processing',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  subtotal_amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  shipping_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  billing_address JSONB,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### **Compliance Tables**

#### **US Zipcodes**
```sql
us_zipcodes (
  zip TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  city TEXT,
  county TEXT,
  latitude NUMERIC,
  longitude NUMERIC
)
```

#### **Compliance Rules**
```sql
compliance_rules (
  id UUID PRIMARY KEY,
  category TEXT NOT NULL,
  restricted_states TEXT[],
  age_requirement INTEGER DEFAULT 21,
  shipping_restrictions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🔌 **API DOCUMENTATION**

### **Base URL**
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### **Authentication**

Most endpoints require authentication via Supabase session cookies or Bearer tokens.

```bash
# Example authenticated request
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     https://your-domain.com/api/products
```

### **Core API Endpoints**

#### **Health Check**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-09-16T03:00:00.000Z"
}
```

#### **Products**

##### Get Products
```http
GET /api/products?page=1&limit=24&category=glass&featured=true
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (max: 50, default: 24)
- `category` (string): Filter by category slug
- `featured` (boolean): Filter featured products
- `search` (string): Search product names/descriptions

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Premium Glass Bong",
      "description": "High-quality borosilicate glass...",
      "price": "89.99",
      "sku": "GLASS-001",
      "imageUrl": "https://...",
      "inStock": true,
      "featured": true,
      "category": {
        "id": "uuid",
        "name": "Glass",
        "slug": "glass"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 150,
    "pages": 7
  }
}
```

##### Get Single Product
```http
GET /api/products/{id}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Premium Glass Bong",
  "description": "Detailed description...",
  "price": "89.99",
  "sku": "GLASS-001",
  "imageUrl": "https://...",
  "inStock": true,
  "category": { "id": "uuid", "name": "Glass" },
  "brand": { "id": "uuid", "name": "Brand Name" },
  "compliance": {
    "nicotineProduct": false,
    "ageRestricted": false,
    "restrictedStates": []
  }
}
```

#### **Categories**
```http
GET /api/categories
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Glass",
    "slug": "glass",
    "description": "Premium glass products"
  }
]
```

#### **Brands**
```http
GET /api/brands
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Brand Name",
    "slug": "brand-name",
    "description": "Brand description"
  }
]
```

#### **Authentication**

##### Sign Up
```http
POST /api/auth
Content-Type: application/json

{
  "type": "signUp",
  "email": "user@example.com",
  "password": "password123",
  "redirectTo": "http://localhost:3000/auth/callback"
}
```

##### Sign In
```http
POST /api/auth
Content-Type: application/json

{
  "type": "signInWithPassword",
  "email": "user@example.com",
  "password": "password123"
}
```

##### Sign Out
```http
POST /api/auth
Content-Type: application/json

{
  "type": "signOut"
}
```

#### **Checkout**
```http
POST /api/checkout
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "CA",
    "zip": "90210"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "CA",
    "zip": "90210"
  }
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "status": "processing",
    "totalAmount": "179.98"
  },
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "priceAtPurchase": "89.99"
    }
  ]
}
```

#### **Eligibility Check**
```http
GET /api/eligibility?zip=90210
```

**Response:**
```json
{
  "zip": "90210",
  "state": "CA",
  "city": "Beverly Hills",
  "county": "Los Angeles",
  "restrictedCategories": ["tobacco", "nicotine"],
  "shippingRestrictions": {
    "tobacco": {
      "allowed": false,
      "reason": "PACT Act restrictions"
    }
  }
}
```

#### **Eligible Products**
```http
GET /api/eligible-products?zip=90210&page=1&limit=24
```

**Response:**
```json
{
  "products": [...],
  "pagination": {...},
  "eligibility": {
    "zip": "90210",
    "state": "CA",
    "restrictedCategories": ["tobacco"]
  }
}
```

### **AI & Recommendations**

#### **AI Chat**
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "I'm looking for a glass bong under $100",
  "context": {
    "userId": "uuid",
    "sessionId": "uuid"
  }
}
```

**Response:**
```json
{
  "response": "I'd recommend checking out our premium borosilicate glass collection...",
  "recommendations": [
    {
      "id": "uuid",
      "name": "Premium Glass Bong",
      "price": "89.99",
      "reason": "Matches your budget and preferences"
    }
  ],
  "conversationId": "uuid"
}
```

#### **Product Recommendations**
```http
GET /api/recommendations?userId=uuid&productId=uuid&limit=6
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "name": "Related Product",
      "price": "49.99",
      "score": 0.95,
      "reason": "frequently_bought_together"
    }
  ]
}
```

### **Zoho Integration Endpoints**

#### **Test Zoho Connection**
```http
GET /api/zoho/test-connection
```

**Response:**
```json
{
  "status": "success",
  "tests": [
    {
      "name": "DNS Resolution",
      "status": "PASS",
      "duration": 45
    },
    {
      "name": "OAuth Endpoint",
      "status": "PASS",
      "duration": 120
    },
    {
      "name": "API Endpoint",
      "status": "PASS",
      "duration": 200
    }
  ],
  "summary": {
    "passed": 3,
    "failed": 0,
    "total": 3
  }
}
```

#### **Debug Zoho Fields**
```http
GET /api/zoho/debug-fields
```

**Response:**
```json
{
  "status": "success",
  "summary": {
    "totalProducts": 4579,
    "totalCategories": 20,
    "customFieldsConfigured": 0,
    "fieldsPerProduct": 107
  },
  "availableFields": {
    "basic": ["name", "sku", "description", "rate", "stock_on_hand"],
    "enhanced": ["brand", "manufacturer", "weight", "dimensions"],
    "images": ["image_name", "image_type", "image_document_id"],
    "custom": []
  },
  "sampleProduct": {
    "name": "Diamond Blunt P Blend 2.5g",
    "sku": "DB-PB-2.5",
    "rate": "25.00",
    "stock_on_hand": 50
  }
}
```

#### **Enhanced Zoho Sync**
```http
POST /api/zoho/sync-enhanced
```

**Response:**
```json
{
  "status": "success",
  "results": {
    "processed": 4579,
    "created": 4546,
    "updated": 33,
    "errors": 0
  },
  "fieldsProcessed": {
    "basic": 4579,
    "enhanced": 4579,
    "images": 3200,
    "customFields": 0
  },
  "nicotineDetection": {
    "detected": 1200,
    "mainSiteVisible": 3379,
    "tobaccoSiteVisible": 1200
  },
  "duration": 45000
}
```

#### **Sync Categories**
```http
POST /api/zoho/sync-categories
```

#### **Sync Inventory**
```http
POST /api/zoho/sync-inventory
```

### **Admin Endpoints** (Require Authentication)

#### **Upload Image**
```http
POST /api/admin/upload-image
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data

{
  "file": [binary data],
  "productId": "uuid",
  "alt": "Product image description"
}
```

### **Webhook Endpoints**

#### **Airtable Webhook**
```http
POST /api/airtable/webhook
Content-Type: application/json

{
  "base": "appXXXXXXXXXXXXXX",
  "webhook": {
    "id": "achXXXXXXXXXXXXXX"
  },
  "timestamp": "2025-09-16T03:00:00.000Z",
  "payloads": [...]
}
```

#### **ShipStation Webhook**
```http
POST /api/shipstation/webhook
Content-Type: application/json

{
  "resource_url": "https://ssapi.shipstation.com/orders/123456",
  "resource_type": "ORDER_NOTIFY",
  "data": {...}
}
```

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check Supabase credentials
curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     "https://YOUR_PROJECT.supabase.co/rest/v1/products?select=count"

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

#### **Zoho API Rate Limits**
- **Error**: `429 Too Many Requests`
- **Solution**: Wait 1 hour for rate limit reset
- **Prevention**: Implement exponential backoff in sync operations

#### **Network Connectivity Issues**
```bash
# Test DNS resolution
nslookup accounts.zoho.com
nslookup www.zohoapis.com

# Test HTTP connectivity
curl -I https://accounts.zoho.com
curl -I https://www.zohoapis.com
```

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm type-check
```

### **Debug Endpoints**

- `GET /api/health` - Overall system health
- `GET /api/zoho/test-connection` - Zoho connectivity
- `GET /api/zoho/debug-fields` - Available Zoho data
- `GET /api/kajapay/health` - Payment system status
- `GET /api/shipstation/health` - Shipping integration status

---

## 🚀 **DEPLOYMENT**

### **Environment-Specific Configuration**

#### **Development**
```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
KAJAPAY_ENVIRONMENT=sandbox
```

#### **Production**
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
KAJAPAY_ENVIRONMENT=production
```

### **Deployment Checklist**

1. **Environment Variables**
   - [ ] All required variables configured
   - [ ] Production URLs and keys
   - [ ] Security keys generated

2. **Database**
   - [ ] Migrations applied
   - [ ] RLS policies enabled
   - [ ] Indexes created for performance

3. **Integrations**
   - [ ] Zoho OAuth tokens refreshed
   - [ ] KajaPay production credentials
   - [ ] ShipStation webhooks configured

4. **Security**
   - [ ] HTTPS enabled
   - [ ] CORS configured
   - [ ] Rate limiting enabled
   - [ ] Input validation implemented

5. **Performance**
   - [ ] Images optimized
   - [ ] CDN configured
   - [ ] Database queries optimized
   - [ ] Caching implemented

---

## 📝 **DEVELOPMENT NOTES**

### **Key Features**
- **Dual-Site Architecture**: Automatic compliance separation
- **AI-Powered**: Product recommendations and chat support
- **Real-Time Sync**: Zoho inventory integration
- **Age Verification**: Compliant with tobacco regulations
- **State Restrictions**: PACT Act compliance
- **VIP Membership**: Tiered access and benefits
- **Analytics**: User behavior and sales tracking

### **Business Logic**
- **Nicotine Detection**: Multi-layer classification system
- **Inventory Management**: Real-time stock levels
- **Compliance Rules**: State-based product restrictions
- **Payment Processing**: Secure KajaPay integration
- **Shipping**: Automated ShipStation fulfillment

### **Performance Optimizations**
- **Database Indexing**: Optimized queries for products/categories
- **Image Optimization**: Next.js Image component with Supabase Storage
- **Caching**: Redis for session and product data
- **CDN**: Static asset delivery optimization

---

## 🤝 **CONTRIBUTING**

### **Development Workflow**
1. Create feature branch from `main`
2. Make changes with comprehensive tests
3. Run linting and type checking
4. Submit pull request with detailed description
5. Code review and approval required
6. Merge to `main` triggers deployment

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Testing**: Jest + React Testing Library

---

## 📄 **LICENSE**

This project is proprietary software owned by DOPE CITY. All rights reserved.

---

## 📞 **SUPPORT**

For technical support or questions:
- **Email**: support@dopecity.com
- **Documentation**: This README file
- **Issues**: GitHub Issues for bug reports
- **API Status**: Check `/api/health` endpoint

