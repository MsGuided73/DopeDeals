# NicheNexus (Dope Deals) – Next.js App Router TODO (Post‑Migration)

> Consolidation note (2025-08-25): Active task tracking moved to taskmanage.md. This file remains for historical context.


Status: Next.js App Router migration is complete. All new work should target app/ and app/api/ using pnpm.

## ✅ Phased plan to complete migration + feature buildout

### Phase 0 — CI/Tooling stabilization (now)
- [ ] Finalize ESLint v9 flat config; local `pnpm lint` passes
- [ ] Re-enable Lint step in CI
- [ ] Scope TypeScript check to `app/` + `shared/` via `tsconfig.typecheck.json`
- [ ] Re-enable Type-check step in CI
- [ ] Add minimal vitest route smoke tests (health, products, checkout)
- Acceptance: PRs show green Lint, Type-check, Tests, and Build

### Phase 1 — App Router migration completion
- [ ] Remove legacy `client/` and `vite.config.ts`
- [ ] Verify Tailwind content globs include `app/**` and shared paths
- [ ] Ensure `.env.example` has NEXT_PUBLIC_/server secrets documented
- Acceptance: Single Next.js app; no legacy client/Vite; envs documented



## 🚨 CRITICAL PATH (NOW)

1. Checkout, Payments, Inventory
- [ ] Extend POST /api/checkout to capture payment with KajaPay
  - Create KajaPay client and handle authorize/capture, refunds, voids
  - Persist paymentTransactions; link to orders; store authCode/reference
  - On success: mark order paymentStatus=paid, decrement stock atomically, clear cart
  - On failure: paymentStatus=failed; return error details
- [ ] Implement inventory reservation/decrement in Supabase
  - Validate available stock per line; decrement on success (RPC or row updates)
  - Prevent oversell; handle race conditions gracefully
- [ ] Add tax + shipping placeholders to totals
  - Tax: simple state/zip rule; plan integration with TaxJar/Avalara
  - Shipping: placeholder rate calc; plan ShipStation rate quotes

2. Auth gating and envs
- [ ] Apply requireAuth to gated pages and API routes (checkout, orders, account, admin)
- [ ] Create .env.example with NEXT_PUBLIC_* and server secrets (Supabase, Zoho, KajaPay, ShipStation)

3. Orders & Fulfillment
- [ ] Add Orders API: GET /api/orders (self), GET /api/orders/[id], PATCH /api/orders/[id]/status
- [ ] On paid order, create ShipStation order (server-side) and persist mapping
- [ ] Add KajaPay and ShipStation webhook endpoints to update statuses

## 🗂 Required Screens (Next.js pages)

User (public)
- [ ] Home: /
- [ ] Products listing with filters: /products
- [ ] Product detail: /product/[id]
- [ ] Category listing: /categories and /category/[id]
- [ ] Search: /search
- [ ] Cart: /cart
- [ ] Checkout: /checkout
- [ ] Auth: /(public)/auth
- [ ] Static: /about, /contact, /privacy-policy, /terms-of-service, /vip-membership

User (account – protected)
- [ ] Account dashboard: /account
- [ ] Orders list: /orders
- [ ] Order detail: /orders/[id]
- [ ] Addresses: /account/addresses
- [ ] Payment methods: /account/payments
- [ ] Profile & security: /account/profile
- [ ] Loyalty/Rewards: /account/rewards
- [ ] Returns/Exchanges: /account/returns (optional)

Admin (protected; role-based)
- [ ] Admin dashboard: /admin
- [ ] Products: /admin/products, /admin/products/new, /admin/products/[id]
- [ ] Categories & Brands: /admin/categories, /admin/brands
- [ ] Orders: /admin/orders, /admin/orders/[id]
- [ ] Inventory: /admin/inventory (stock levels, adjustments)
- [ ] Customers: /admin/customers, /admin/customers/[id]
- [ ] Compliance: /admin/compliance (rules, audit log, violations)
- [ ] Shipping: /admin/shipping (ShipStation status, warehouses, rates)
- [ ] Payments: /admin/payments (transactions, settlements)
- [ ] Integrations: /admin/integrations (Zoho/KajaPay/ShipStation health)
- [ ] SEO/Content: /admin/seo (meta, redirects, sitemap)
- [ ] AI Console: /admin/ai (classification runs, emoji recs, concierge analytics)
- [ ] Monitoring: /admin/monitoring (health, logs)

## 🔌 Integrations (Next steps)

Zoho Inventory
- [ ] Items sync (SKU→Product mapping), delta updates, and stock sync
- [ ] Token refresh (already in health flow); schedule periodic sync
- [ ] Create Zoho Sales Order on paid order; status sync back

ShipStation
- [ ] Create order on paid order; store mapping
- [ ] Rate quotes endpoint for checkout
- [ ] Webhooks: shipment, tracking updates → update order status

KajaPay
- [ ] Client with auth; pay/refund/void endpoints
- [ ] Webhook: payment status updates → update transactions/orders

## 🧠 AI – Current, Ports, and New Ideas

In repo (legacy server, to port to app/api):
- [ ] AI Classification Service (/api/ai/classification)
- [ ] Emoji Recommendation System (/api/emoji/*)
- [ ] VIP Concierge AI (/api/concierge/*)
- [ ] Admin AI routes (/api/admin/ai/*) and background classifier

Additional AI‑powered features to add:
- [ ] Product content: description, bullet points, and SEO meta generation
- [ ] Image: auto alt‑text; optional background cleanup
- [ ] Personalized recommendations: embeddings + behavior; “Similar items” on PDP
- [ ] Smart search & autocomplete with semantic ranking
- [ ] Fraud/risk scoring at checkout (signals + heuristics + LLM rationale)
- [ ] Support copilot (admin): suggested replies, macros, tone control
- [ ] Auto tax category/classification suggestions for catalog
- [ ] Shipping rule recommendations (packaging, carrier, service)
- [ ] Cohort insights: churn risk, VIP targeting, promo suggestions

## 🔒 Security & Compliance
- [ ] Zod schemas on all API routes; sanitize inputs; rate limiting
- [ ] Age verification flow (policy‑driven; state rules)
- [ ] Security headers + CSP; HTTPS settings

## 📊 Observability & Quality
- [ ] Sentry for Next.js (server/client)
- [ ] Health endpoints: /api/health, /api/zoho/health, /api/kajapay/health, /api/shipstation/health
- [ ] Tests: API (checkout, orders), integration (E2E happy path), unit (utils)

## 🧱 Storage & Data (Supabase‑first)
- [ ] Use SupabaseStorage by default; MemStorage for local/dev only
- [ ] Align snake_case columns and DTOs; ensure order_items, transactions mappings
- [ ] Implement stock decrement atomically; consider RPC for multi‑row operations
- [ ] Remove Prisma path after parity; document RLS and table indexes

## 🗺️ Timeline (target)
- Week 1: Payments + checkout E2E, orders API, auth gating, envs
- Week 2: ShipStation create + webhooks, tax/shipping calc, admin orders screens
- Week 3: Zoho sync, catalog admin, AI ports to Next.js API, observability

## 🎯 Success metrics
- [ ] 0 oversell incidents; 99% payment success
- [ ] <300ms P95 key API routes; error rate <1%
- [ ] Automated fulfillment within 5 min of payment
- [ ] Admin can manage catalog/orders without console access


---

Preserved Original TODO (unchanged per request; Next.js migration notes appear above)

## Original TODO (VIP Smoke) – Preserved

## 🚨 CRITICAL ISSUES - MUST FIX BEFORE PRODUCTION

### 1. Missing Core E-commerce Flow (CRITICAL)
- [x] **Implement Checkout API Endpoint** (`/api/checkout`)
  - File: Next.js `app/api/checkout/route.ts` (migrated)
  - Connect cart items to order creation
  - Integrate payment processing with KajaPay
  - Add inventory validation before checkout
  - Estimated effort: 2-3 days

- [ ] **Complete Order Creation Workflow**
  - File: `server/storage.ts` (implement order creation methods)
  - Link payment success to order generation
  - Sync orders to Zoho Inventory
  - Create ShipStation fulfillment orders
  - Estimated effort: 2-3 days

- [ ] **Add Inventory Validation**
  - File: `server/routes.ts` (add stock checking)
  - Prevent overselling with real-time stock checks
  - Reserve inventory during checkout process
  - Handle inventory conflicts gracefully
  - Estimated effort: 1-2 days

### 2. Authentication System (CRITICAL)
- [x] **Activate Supabase Authentication**
  - Next.js Supabase SSR helpers in `app/lib/supabase-server-ssr.ts`; browser client in `app/lib/supabase-browser.ts`
  - Replace localStorage age verification with persistent auth
  - Implement user registration/login flows
  - Add protected routes for checkout
  - Estimated effort: 1-2 days

### 3. Integration Credentials (CRITICAL)
- [ ] **Add Missing Environment Variables**
  - Zoho: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ORGANIZATION_ID`
  - KajaPay: `KAJAPAY_USERNAME`, `KAJAPAY_PASSWORD`, `KAJAPAY_SOURCE_KEY`
  - ShipStation: `SHIPSTATION_API_KEY`, `SHIPSTATION_API_SECRET`
  - Supabase: `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Estimated effort: 1 day (admin task)

## 🔥 HIGH PRIORITY FEATURES

### 4. Order Management System
- [x] **User Order History Page**
  - File: Next.js `app/orders/page.tsx` (implemented)
  - Display past orders with status tracking
  - Add reorder functionality
  - Show shipping tracking information
  - Estimated effort: 2-3 days

- [ ] **Order Status Updates**
  - File: `server/routes.ts` (add order status endpoints)
  - Real-time order tracking
  - Email notifications for status changes
  - Integration with ShipStation webhooks
  - Estimated effort: 2 days

### 5. Admin Dashboard (Missing)
- [ ] **Create Admin Interface**
  - File: Create `client/src/pages/admin/` directory
  - Inventory management interface
  - Order processing workflow
  - Customer management system
  - Analytics and reporting dashboard
  - Estimated effort: 1-2 weeks

### 6. Payment Processing Enhancements
- [ ] **Tax Calculation System**
  - File: `server/routes.ts` (add tax calculation)
  - Location-based tax rates
  - Integration with tax service (TaxJar/Avalara)
  - Compliance with state tax laws
  - Estimated effort: 3-4 days

- [ ] **Shipping Rate Calculator**
  - File: `server/shipstation/service.ts` (enhance shipping rates)
  - Real-time shipping cost calculation
  - Multiple carrier options
  - Product weight/dimension handling
  - Estimated effort: 2-3 days

## 🛠️ MEDIUM PRIORITY IMPROVEMENTS

### 7. Testing Infrastructure (Missing)
- [ ] **Add Unit Tests**
  - Create `tests/` directory
  - Test API endpoints
  - Test business logic functions
  - Test React components
  - Estimated effort: 1 week

- [ ] **Integration Tests**
  - Test complete order flow
  - Test third-party integrations
  - Test compliance workflows
  - Estimated effort: 3-4 days

### 8. Error Handling & Monitoring
- [ ] **Improve Error Handling**
  - File: `server/index.ts` (enhance error middleware)
  - Structured error responses
  - Error logging and monitoring
  - User-friendly error messages
  - Estimated effort: 2-3 days

- [ ] **Add Application Monitoring**
  - Implement health check endpoints
  - Add performance monitoring
  - Set up error tracking (Sentry)
  - Database connection monitoring
  - Estimated effort: 2-3 days

### 9. Performance Optimizations
- [ ] **Database Query Optimization**
  - File: `server/supabase-storage.ts` (optimize queries)
  - Add database indexes
  - Optimize product filtering
  - Estimated effort: 2-3 days

- [ ] **Frontend Performance**
  - File: `client/src/` (various components)
  - Implement lazy loading
  - Optimize image loading
  - Add CDN for static assets
  - Bundle size optimization
  - Estimated effort: 3-4 days

## 📋 LOW PRIORITY ENHANCEMENTS

### 10. UI/UX Improvements
- [ ] **Design System Consistency**
  - Standardize component styling
  - Improve mobile responsiveness
  - Add loading states and skeletons
  - Enhance accessibility (WCAG compliance)
  - Estimated effort: 1 week

### 11. SEO & Marketing Features
- [ ] **SEO Optimization**
  - Next.js `app/robots.ts` and `app/sitemap.ts` exist; enhance meta and structured data via `metadata` exports
  - Implement Open Graph and JSON-LD per page
  - Ensure robots/sitemap reflect dynamic products/categories
  - Estimated effort: 2-3 days

### 12. Advanced Features

- [ ] **Loyalty Program Enhancement**
  - File: `server/routes.ts` (add loyalty endpoints)
  - Points earning and redemption
  - Membership tier benefits
  - Referral system
  - Estimated effort: 1 week

## 🔧 TECHNICAL DEBT

### 13. Storage Layer Consolidation (HIGH PRIORITY)

- [ ] **Consolidate to Supabase-Only Storage**
  - Remove Prisma storage implementation
  - Remove memory storage fallback
  - Simplify storage initialization logic
  - Update all storage interface calls
  - Estimated effort: 2-3 days

### 14. Code Quality Issues

- [ ] **Remove Duplicate Code**
  - Standardize API response formats
  - Extract common utility functions
  - Estimated effort: 1-2 days

- [ ] **Type Safety Improvements**
  - Fix TypeScript any types
  - Add proper error type definitions
  - Improve API response typing
  - Estimated effort: 2 days
