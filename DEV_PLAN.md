# VIP Smoke E-Commerce Development Plan

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
