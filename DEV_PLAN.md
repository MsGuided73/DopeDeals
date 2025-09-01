# VIP Smoke E-Commerce Development Plan

## Codebase Audit — 2025-08-28

Summary: The codebase is now a unified Next.js App Router app with Supabase-first storage, shadcn/Tailwind, and TanStack Query. Legacy Vite/client has been removed; a legacy Express server remains in the repo but is excluded from type-check and is not used by Next.js. Core health endpoints exist. Checkout API is implemented with Supabase atomic path available. Third-party integrations are scaffolded, with Zoho furthest along.

- Validation run
  - pnpm test: PASS (7 files, 9 tests)
  - /app/api/health reports migration readiness and env hygiene

### 1) Current State Analysis
- Next.js App Router
  - app/ and app/api/ in place; layout.tsx, providers.tsx, globals.css present
  - Tailwind configured with app/** and server/** globs; shadcn components wired via components.json
  - TanStack Query integrated via QueryClientProvider (app/lib/queryClient.ts + app/providers.tsx)
- Legacy code
  - No client/ folder; no vite.config.* in repo (only ignored in .gitignore)
  - server/index.ts references Express+Vite helpers, but vite middleware file was deleted; server/* is excluded by tsconfig for type-check and not part of Next.js runtime
- Supabase storage
  - server/supabase-storage.ts implements Supabase SDK path including checkoutAtomic rpc
  - server/storage.ts selects SupabaseStorage when SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set, else MemStorage fallback
  - app/api/health tests Supabase with service key and reports storageMode
- UI stack
  - shadcn: Tooltip/Toaster providers are referenced from components/ui
  - Tailwind + tailwindcss-animate + @tailwindcss/typography enabled

### 2) Feature Integration Assessment
- Zoho Inventory
  - Status: Partial
    - OAuth scaffolding present (app/api/zoho/oauth/*)
    - Health endpoint does live ping to Items API using refresh_token stored in Supabase (zoho_tokens) and ZOHO_DC/ORG
    - server/zoho/* client/config/types exist for full integration
  - Missing: scheduled token refresh/storage, items/stock sync jobs, sales order creation on paid orders
- KajaPay Payments
  - Status: Scaffolded
    - server/kajapay/* has a rich client/service and types
    - app/api/kajapay/health exists but returns uninitialized
  - Missing: payment capture in checkout, transactions persistence, webhook handler, refunds/void
- ShipStation
  - Status: Scaffolded/Partial
    - server/shipstation/* client/service present; webhook route dir exists
    - app/api/shipstation/health exists; checkout route optionally creates ShipStation order after atomic checkout (fire-and-forget)
  - Missing: rate quotes endpoint, robust order mapping, webhook processing and status sync
- Environment variables
  - Code uses NEXT_PUBLIC_* on client and server-only vars on server (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). No VITE_* usage in code; a few references remain in docs
  - .env.example covers Supabase, Zoho, KajaPay, ShipStation, OpenAI; suggest adding NEXT_SERVER_ACTIONS_ENCRYPTION_KEY and optional toggles (e.g., ZOHO_INTEGRATION_ENABLED, ZOHO_RETRY_*), and removing stray SUPABASE_ANON_KEY duplicate
- Health endpoints
  - Present: /api/health, /api/zoho/health, /api/kajapay/health, /api/shipstation/health

### 3) Development Gaps and Technical Debt
- Payments not integrated into checkout; no end-to-end capture/refund/void yet
- Orders API (list/get/update) not present in app/api
- ShipStation rate quotes + webhook processing not implemented
- Zoho items/stock sync not implemented; sales order creation not wired on paid orders
- Legacy Express server still present; consider decommissioning or isolating behind an npm script separate from Next.js
- Tests exist and pass but are minimal; need API/integration coverage for checkout + integrations
- Docs cleanup: replace VITE_* references in remaining docs; tighten .env.example

### 4) Updated Roadmap (Actionable, with estimates and dependencies)

A. Migration Completion and Hygiene
- A1 Remove/retire legacy Express server code paths or gate behind "legacy:*" scripts; document deprecation (0.5–1 day)
  - Dep: None
- A2 Update .env.example (add NEXT_SERVER_ACTIONS_ENCRYPTION_KEY; add Zoho/KajaPay/ShipStation toggles; remove duplicate SUPABASE_ANON_KEY) (0.25 day)
- A3 Docs sweep to purge VITE_* examples; update TECH_STACK_OVERVIEW, todo.md notes (0.5 day)

B. Payments (KajaPay)
- B1 Implement capture in POST /api/checkout using server/kajapay client; persist paymentTransactions; update order paymentStatus (1–2 days)
  - Dep: A2 (envs), C1 (atomic checkout available), D1 (orders API schema agreed)
- B2 Implement refund and void endpoints (app/api/payments/*) and service methods; link to orders (1 day)
  - Dep: B1
- B3 KajaPay webhook endpoint to upsert transactions and update order/payment status (0.5–1 day)
  - Dep: B1

C. Orders & Inventory
- C1 Ensure Supabase checkout_atomic RPC is present and validated; finalize mapping for order and order_items (0.5 day)
- C2 Orders API: GET /api/orders, GET /api/orders/[id], PATCH /api/orders/[id]/status (1 day)
  - Dep: C1
- C3 Inventory decrement/reservation semantics within checkout_atomic; prevent oversell (0.5–1 day)
  - Dep: C1

D. ShipStation
- D1 Create ShipStation order on paid orders; persist mapping in Supabase; add error handling/retries (1 day)
  - Dep: B1, C2
- D2 Rate quotes endpoint for checkout (app/api/shipping/rates) using server/shipstation client (0.75 day)
  - Dep: D1 optional
- D3 Webhooks: shipment/tracking updates to update order status (1 day)
  - Dep: D1

E. Zoho Inventory
- E1 Refresh-token scheduler and token persistence hardening; health endpoint asserts token freshness (0.5 day)
- E2 Items sync (SKU→Product mapping) initial import then delta by modified_time; store mapping table; log mismatches (1–2 days)
  - Dep: E1, C1
- E3 Stock sync job both directions (Zoho→site authoritative) with conflict policy (1 day)
  - Dep: E2
- E4 Create Zoho Sales Order on paid order; status sync back via polling or webhook if available (1–1.5 days)
  - Dep: B1, C2

F. Testing & Observability
- F1 Add API tests: checkout happy path with KajaPay mock, orders API, ShipStation quotes (1–2 days)
- F2 Integration tests: paid order → ShipStation order created; Zoho sales order created (1–2 days)
- F3 Add Sentry for Next.js (client/server) and extend /api/health to include integration readiness flags (0.5 day)

G. Deployment Preparation
- G1 CI: enable lint/type-check/tests/build gates; ensure pnpm-only (0.5 day)
- G2 Production env checklist: secrets in platform env, rotate any exposed keys, set NEXT_SERVER_ACTIONS_ENCRYPTION_KEY (0.25 day)

Immediate next focus aligned to owner preference: E (Zoho) then B (KajaPay) and D (ShipStation).

## Migration to Next.js – Current Status (as of 2025-08-22)

- [x] Initialize Next.js App Router structure and routing basics (2025-08-22)
- [x] Port core API endpoints to `app/api` (brands, categories, products, health) (2025-08-22)
- [x] Add health checks for Prisma and Supabase (`/api/health`) (2025-08-22)
- [x] Harmonize Supabase env usage (server uses `SUPABASE_URL` with `NEXT_PUBLIC_*` fallback; client uses `NEXT_PUBLIC_*`) (2025-08-22)
- [x] Replace legacy root page with `app/(public)/page.tsx` and remove old `app/page.tsx` + `client/index.html` (2025-08-22)
- [x] Remove legacy large assets from `attached_assets/` (2025-08-22)

## Phased plan to complete migration + feature buildout (concise)

- Phase 0 — CI/Tooling stabilization
  - Finalize ESLint v9 flat config; re‑enable Lint in CI
  - Scope TypeScript check to app/ + shared/; re‑enable tsc in CI
  - Add minimal vitest route smoke tests (health, products, checkout)
  - Acceptance: PRs gated by Lint, Type‑check, Tests, Build

- Phase 1 — App Router migration completion
  - Remove legacy client/ and vite.config.ts; verify Tailwind globs
  - Ensure .env.example documents NEXT_PUBLIC_ and server secrets
  - Acceptance: Single Next.js app; envs documented

- Phase 2 — Auth gating and accounts
  - Apply requireAuth to checkout, orders, account, admin; verify SSR auth
  - Acceptance: Anonymous redirected; signed‑in users access protected pages

- Phase 3 — Orders, Checkout, Inventory (Supabase)
  - Extend /api/checkout to create orders + order_items; decrement stock atomically
  - Implement checkout_atomic RPC and call via SupabaseStorage.checkoutAtomic()
  - Add Orders API (GET self, GET by id, PATCH status); tests
  - Acceptance: Happy‑path checkout creates paid order; inventory updates; tests pass

- Phase 4 — Payments (KajaPay) + webhooks
  - Implement client for pay/refund/void; persist paymentTransactions; handle webhooks
  - Acceptance: Capture → order paid; refund/void update state; webhook integration verified

- Phase 5 — Shipping (ShipStation)
  - Create order on paid order; tracking updates via webhooks; rate quotes for checkout
  - Acceptance: ShipStation mapping stored; tracking visible; quotes returned

- Phase 6 — Zoho inventory sync
  - OAuth/refresh; Items sync SKU→Product; stock sync; health endpoint OK
  - Acceptance: Catalog/stock synced; health OK

- Phase 7 — Admin, SEO, Observability
  - Admin screens for core entities; metadata via Next metadata API; Sentry added
  - Acceptance: Admin CRUD baseline; SEO metadata present; Sentry capturing

- Phase 8 — AI ports
  - Port legacy AI routes to app/api; add tests
  - Acceptance: AI endpoints reachable; tests green

## Acceptance criteria summary
- CI: Lint + Type‑check + Tests + Build green on PRs
- Checkout: creates paid order, order_items stored, stock decremented atomically
- Payments: capture/refund/void reflected in transactions and orders via webhooks
- Shipping: paid orders appear in ShipStation; tracking syncs back
- Zoho: items/stock sync working; health endpoint OK
- Admin: core screens usable; role‑gated
- SEO/Obs: metadata present; Sentry enabled; /api/health and integration health endpoints OK


- [ ] Standardize package manager to pnpm (remove `package-lock.json`, set VS Code `npm.packageManager = pnpm`)
- [ ] Remove legacy Vite client and `vite.config.ts` once all pages/components are ported
- [ ] Consolidate storage to Supabase-only implementation (remove Prisma/memory fallbacks when safe)


## Progress Update – 2025-08-22

Completed today

- [x] Supabase Auth scaffolding
  - SSR client helper with @supabase/ssr (app/lib/supabase-server-ssr.ts)
  - Browser client + /auth page (sign up/in/out)
  - Basic /api/auth route for testing
- [x] Checkout API (Phase A)
  - POST /api/checkout with auth gating via Supabase session
  - Payload validation (Zod)
  - Local inventory checks (inStock) and order creation with summary
- [x] Zoho OAuth scaffolding
  - /api/zoho/oauth/start and /api/zoho/oauth/callback
  - Token exchange + persistence in Supabase (zoho_tokens table)
  - /api/zoho/health reads stored token (org/DC) for verification
- [x] Dev UX fixes
  - Added QueryClient helper at '@/lib/queryClient'
  - Temporary UI placeholders for Tooltip/Toaster to unblock build

In progress

- [/] Standardize to pnpm (package-lock.json absent; add VS Code setting later)
- [/] App Router migration (continuing; remove legacy Vite after pages are ported)

Updated immediate next tasks

1) Checkout: persist order_items in storage (Supabase + MemStorage) and return line items in response
2) Zoho: add token refresh flow and a live health ping to Zoho Items API; then minimal Items sync (SKU→Product mapping)
3) Replace placeholder Tooltip/Toaster with shadcn UI components
4) Protect user pages with a small requireAuth helper and add an Orders page stub
5) Remove legacy Vite/client when safe; standardize workspace settings to pnpm

## Updated Immediate Priorities (Next.js-first ordering)

1) Standardize package manager to pnpm and update workspace settings
   - Remove `package-lock.json`
   - Add `.vscode/settings.json` with `{"npm.packageManager": "pnpm"}`
   - Optional: Add `"packageManager": "pnpm@<version>"` to `package.json`

2) Complete App Router migration
   - Port remaining API routes (if any) and UI pages
   - Decommission `client/` and `vite.config.ts`
   - Ensure all envs use `NEXT_PUBLIC_*` on the client and server-only vars are not exposed

3) Persistence & storage
   - Finalize Supabase Storage implementation path
   - Remove memory/Prisma fallbacks after verification

4) E‑commerce critical path (post-migration)
   - Checkout API + order creation workflow
   - Inventory validation at checkout
   - Activate Supabase Auth for gated flows

## Status Annotations for Existing Plan (do not remove original tasks)

- Phase 1 (Pre-Integration Setup): Partially complete; pending credentials & monitoring specifics
  - Task 1.1 Zoho Inventory Info – Pending (blocked: credentials)
  - Task 1.2 Environment Configuration – In Progress (health checks added 2025-08-22; Supabase envs harmonized 2025-08-22)
  - Task 1.3 ShipStation Info – Pending

- Phase 2 (Backend Infrastructure): Not started, planned after migration baseline
  - Task 2.1 Database Schema Updates – Planned (awaiting Zoho field mapping)
  - Task 2.2 Order Processing System – Planned (target after checkout endpoint)
  - Task 2.3 Inventory Management System – Planned

- Phase 3 (Zoho Integration): Not started (blocked by credentials)
  - Task 3.1 API Client Setup – Planned
  - Task 3.2 Product Sync Service – Planned
  - Task 3.3 Order Sync Service – Planned

- Phase 4 (Shipping & Fulfillment): Not started
  - Task 4.1 Shipping Restrictions Engine – Planned
  - Task 4.2 ShipStation Integration – Planned
  - Task 4.3 Shipping Calculator – Planned

- Phase 5 (Frontend Enhancements): Not started
  - Task 5.1 Loyalty Program – Planned
  - Task 5.2 Order Management UI – Planned
  - Task 5.3 Admin Dashboard – Planned

- Phase 6 (Testing & Deployment): In planning
  - Task 6.1 Integration Testing – Planned (health endpoint scaffold in place 2025-08-22)
  - Task 6.2 Performance Optimization – Planned

## Reordered Work Breakdown (reflecting current build)

- Now
  - Complete App Router migration tasks (pnpm standardization, remove Vite/client when safe)
  - Wire Supabase as primary storage path and validate `/api/health`
- Next
  - Implement Checkout API and Order workflow
  - Add Inventory validation
  - Activate Supabase Auth in gated flows
- Later
  - Zoho sync (import + real-time)
  - ShipStation integration and shipping calculator
  - Loyalty, Admin dashboard, Performance & Testing sweep

## Phase 1: Pre-Integration Setup (Days 1-2)

### Task 1.1: Gather Zoho Inventory Information
**Priority: HIGH**
**Info Needed:**
- Zoho Inventory OAuth credentials (Client ID, Client Secret) in .env.local (dev) / platform secrets (prod); refresh_token is stored in the database (zoho_tokens) after first OAuth callback
- Zoho organization ID and region
- Current product schema in Zoho (fields, data types, required fields) - where can I get this?
- Current inventory structure (categories, brands, product types)
- Webhook URLs for inventory sync
- API rate limits and pagination details

### Task 1.2: Environment Configuration
**Priority: HIGH**
**Requirements:**
- Set up Zoho API credentials in Next.js environment files (.env.local for dev) and platform secrets for deployments
- Configure environment variables for production/development
- Set up error logging and monitoring

### Task 1.3: ShipStation Information Gathering
**Priority: MEDIUM**
**Info Needed:**
- ShipStation API credentials
- Carrier configurations and shipping methods
- Product type shipping restrictions mapping
- Geographic shipping limitations by product type
- Packaging and weight requirements

## Phase 2: Backend Infrastructure (Days 3-5)

### Task 2.1: Database Schema Updates
**Priority: HIGH**
**Wait for Zoho integration before implementing**
- Update products table to match Zoho schema
- Add inventory tracking fields
- Add product type classification
- Add shipping restrictions fields

### Task 2.2: Order Processing System
**Priority: HIGH**
**Requirements:**
- Complete order workflow (pending → processing → shipped → delivered)
- Order status tracking and updates
- Order fulfillment pipeline
- Payment processing integration

### Task 2.3: Inventory Management System
**Priority: HIGH**
**Requirements:**
- Real-time inventory sync with Zoho
- Low stock alerts and notifications
- Inventory reservation during checkout
- Bulk inventory updates

## Phase 3: Zoho Inventory Integration (Days 6-8)

### Task 3.1: Zoho API Client Setup
**Priority: HIGH**
**Implementation:**
- OAuth 2.0 authentication flow
- API request/response handling
- Error handling and retry logic
- Rate limiting compliance

### Task 3.2: Product Sync Service
**Priority: HIGH**
**Features:**
- Initial product import from Zoho
- Real-time inventory updates
- Product information synchronization
- Image and media sync

### Task 3.3: Order Sync Service
**Priority: HIGH**
**Features:**
- Create sales orders in Zoho
- Sync order status updates
- Handle order modifications
- Track fulfillment status

## Phase 4: Shipping & Fulfillment (Days 9-11)

### Task 4.1: Shipping Restrictions Engine
**Priority: HIGH**
**Info Needed:**
- State-by-state shipping laws for:
  - Kratom products
  - CBD products
  - THC products
  - Nicotine products
- Age verification requirements by state
- Restricted ZIP codes or counties

### Task 4.2: ShipStation Integration
**Priority: HIGH**
**Features:**
- Automatic order creation in ShipStation
- Shipping label generation
- Tracking number updates
- Carrier selection logic

### Task 4.3: Shipping Calculator
**Priority: MEDIUM**
**Requirements:**
- Real-time shipping rate calculation
- Product weight and dimensions
- Packaging requirements
- Shipping method selection

## Phase 5: Frontend Enhancements (Days 12-14)

### Task 5.1: Loyalty Program Implementation
**Priority: MEDIUM**
**Features:**
- Points display in user dashboard
- Points earning calculation
- Points redemption system
- Membership tier benefits

### Task 5.2: Order Management UI
**Priority: HIGH**
**Features:**
- Order history and tracking
- Order status updates
- Reorder functionality
- Return/exchange requests

### Task 5.3: Admin Dashboard
**Priority: LOW**
**Features:**
- Inventory management interface
- Order processing workflow
- Customer management
- Analytics and reporting

## Phase 6: Testing & Deployment (Days 15-16)

### Task 6.1: Integration Testing
**Priority: HIGH**
- End-to-end order flow testing
- Inventory sync verification
- Shipping restrictions validation
- Payment processing testing

### Task 6.2: Performance Optimization
**Priority: MEDIUM**
- API response caching
- Database query optimization
- Image loading optimization
- CDN setup for static assets

## Critical Information Still Needed:

### Zoho Inventory Details:
1. **API Endpoints**: Specific endpoints for products, inventory, orders
2. **Data Schema**: Exact field mappings and data types
3. **Webhook Configuration**: Real-time sync capabilities
4. **Rate Limits**: API call limitations and best practices

### Shipping Compliance:
1. **Legal Requirements**: Age verification laws by state
2. **Product Classifications**: How to categorize products for shipping
3. **Restricted Areas**: ZIP codes, counties, or states with restrictions
4. **Carrier Requirements**: Specific shipping methods for different products

### Business Logic:
1. **Inventory Thresholds**: When to show "low stock" warnings
2. **Pricing Strategy**: VIP discounts, bulk pricing, promotional codes
3. **Return Policy**: Handling returns and exchanges
4. **Customer Service**: Support ticket system integration

## Immediate Next Steps:

1. **Today**: Get Zoho Inventory API credentials and explore the current schema
2. **Tomorrow**: Document Zoho product structure and begin API client setup
3. **Day 3**: Start implementing order processing workflow
4. **Day 4**: Begin shipping restrictions research and documentation

This plan assumes a 16-day development cycle but can be adjusted based on complexity and additional requirements discovered during Zoho integration.
