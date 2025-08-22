# VIP Smoke E-Commerce Development Plan

## Migration to Next.js – Current Status (as of 2025-08-22)

- [x] Initialize Next.js App Router structure and routing basics (2025-08-22)
- [x] Port core API endpoints to `app/api` (brands, categories, products, health) (2025-08-22)
- [x] Add health checks for Prisma and Supabase (`/api/health`) (2025-08-22)
- [x] Harmonize Supabase env usage (server uses `SUPABASE_URL` with `NEXT_PUBLIC_*` fallback; client uses `NEXT_PUBLIC_*`) (2025-08-22)
- [x] Replace legacy root page with `app/(public)/page.tsx` and remove old `app/page.tsx` + `client/index.html` (2025-08-22)
- [x] Remove legacy large assets from `attached_assets/` (2025-08-22)
- [ ] Standardize package manager to pnpm (remove `package-lock.json`, set VS Code `npm.packageManager = pnpm`)
- [ ] Remove legacy Vite client and `vite.config.ts` once all pages/components are ported
- [ ] Consolidate storage to Supabase-only implementation (remove Prisma/memory fallbacks when safe)

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
- Zoho Inventory API credentials (Client ID, Client Secret, Refresh Token)
- Zoho organization ID and region
- Current product schema in Zoho (fields, data types, required fields)
- Current inventory structure (categories, brands, product types)
- Webhook URLs for inventory sync
- API rate limits and pagination details

### Task 1.2: Environment Configuration
**Priority: HIGH**
**Requirements:**
- Set up Zoho API credentials in Replit Secrets
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
