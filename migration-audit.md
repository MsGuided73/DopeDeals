## Next.js Migration Audit and User Workflow Analysis

### Summary
This document captures a comprehensive audit of legacy references from the Replit/Vite era and prescribes updates for the unified Next.js App Router app. It also outlines customer and admin workflows to guide feature implementation, UI, API coverage, auth, and integrations.

---

## Part 1: Migration Audit

### A) Files with legacy references and actions

1) DEV_PLAN.md
- Legacy reference: Mentions of Replit Secrets
- Update to: Next.js env files (.env.local) for development; deployment platform secrets (e.g., Vercel/Render) for production
- Action: Keep; align env guidance with NEXT_PUBLIC_* for client, server-only vars without NEXT_PUBLIC_

2) replit.md (legacy doc)
- Legacy references: Replit dev model, Vite build, Drizzle
- Update to: Add a “legacy” note or replace with Next.js dev flow (pnpm dev/build/start, .env.local)
- Safe to delete? Yes (doc only) — optional archive in docs/legacy/

3) REPLIT_CLEANUP_NOTES.md (doc)
- Legacy references: Replit-specific cleanup
- Update: None needed
- Safe to delete? Yes (doc only)

4) TECH_STACK_OVERVIEW.md (doc)
- Legacy references: Drizzle/Neon/Vite listed in dependency examples
- Update to: Reflect Next.js + Supabase; remove Drizzle/Neon/Vite or mark as legacy
- Safe to delete? Keep and update (useful overview)

5) NEON_CLEANUP_COMPLETE.md, SUPABASE_CLEANUP_COMPLETE.md (docs)
- Legacy references: Historical cleanup status
- Update: None; keep as history
- Safe to delete? Optional

6) todo.md
- Legacy references: VITE_SUPABASE_URL in Integration Credentials
- Update to: NEXT_PUBLIC_SUPABASE_URL for client; SUPABASE_URL for server
- Safe to delete? No; update

7) server/zoho/config.ts
- Legacy references: REPLIT_DEV_DOMAIN; default webhook http://localhost:5000
- Updated: Now defaults to `${BASE_URL || 'http://localhost:3000'}/api/zoho/webhook` and respects ZOHO_WEBHOOK_URL override
- Status: UPDATED

8) server/vite.ts (Vite middleware)
- Legacy references: Vite dev server, client/index.html
- Updated: File removed
- Status: DELETED

9) server/index.ts (Express)
- Legacy references: setupVite/serveStatic paths for legacy client
- Update to: If Express is no longer used, decommission; otherwise isolate behind legacy scripts only
- Safe to delete? Later, once confirmed unused

10) MIGRATION_PLAN_NEXT.md, STORAGE_CONSOLIDATION_PLAN.md (docs)
- Legacy references: Examples using VITE_* vars
- Update to: Replace examples with NEXT_PUBLIC_* (client) and server-only vars
- Safe to delete? Keep and update

11) drizzle.config.ts
- Legacy references: Drizzle Kit
- Updated: File removed
- Status: DELETED

12) tsconfig.json
- Legacy references: N/A (excludes client/src; aligns with migration)
- Update: None
- Safe to delete? No

13) "@/pages/*" imports
- Status: Removed from app/*; client pages deleted
- Update: None
- Safe to delete? N/A (done)

14) Local dev URLs
- Found: http://localhost:5000 in server/zoho/config.ts
- Update to: http://localhost:3000 or BASE_URL-driven

15) Drizzle ORM in code
- Status: Not found in active code (only docs and drizzle.config.ts)
- Action: Remove drizzle.config.ts if not needed

16) Neon references in code
- Status: Not found in active code (only docs)
- Action: None

17) Vite-specific imports/config
- Status: vite.config.ts removed; client/ removed; server/vite.ts removed
- Status: UPDATED

### B) Dependency cleanup (package.json)

Observations
- Legacy tooling present in devDependencies and scripts; legacy server deps pruned.

Safe to remove now (devDependencies)
- DONE: Removed vite, @vitejs/plugin-react, @tailwindcss/vite, esbuild, drizzle-kit
- DONE: Deleted drizzle.config.ts

Legacy server dependencies cleanup (status)
- REMOVED: express-session, memorystore, passport, passport-local, postgres, ws
- KEPT (admin/Express tools): express, multer (uploads), pdf-parse (COA parsing)

Scripts
- REMOVED: legacy:dev, legacy:build, legacy:start, db:push

Rationale
- These packages supported the legacy Vite/Express/Drizzle stack. With the Next.js App Router + Supabase model, they are unnecessary; admin/Express tools remain supported with express, multer, and pdf-parse retained.

---

## Part 2: User Workflow Analysis

### Customer Workflows

1) Product discovery and browsing
- Journey: Home → Categories/brands → Filter/sort → Product detail → Add to cart
- Screens: Home, Category listing, Product detail
- UI: Search, filters (brand, price, nicotine), sort, pagination, NicotineToggle, Add-to-cart
- APIs: GET /api/categories, /api/brands, /api/products?filters, /api/products/[id]
- Auth: Not required
- Integrations: Optional analytics

2) Account creation and authentication
- Journey: Sign up → Verify email (optional) → Sign in → Profile
- Screens: Auth (sign in/up), Profile/Settings
- UI: Forms with validation, toasts
- APIs: POST /api/auth; Supabase client methods
- Auth: Supabase Auth
- Integrations: Supabase Auth

3) Shopping cart and checkout
- Journey: Add to cart → Cart review → Address → Payment → Confirmation
- Screens: Cart, Checkout, Confirmation
- UI: Line items with qty edit, address form, payment form, order summary
- APIs: POST /api/checkout (exists); optional /api/cart
- Auth: Required to purchase
- Integrations: Payment (KajaPay/other), Zoho (Sales Order post-payment), optional tax

4) Order tracking and history
- Journey: Orders list → Order detail → Tracking
- Screens: Orders (exists), Order detail
- UI: Status chips, tracking link, reorder
- APIs: GET /api/orders, /api/orders/[id]
- Auth: Required
- Integrations: ShipStation (tracking), Zoho (status sync)

5) VIP membership and loyalty
- Journey: Join VIP → View benefits → Earn/redeem points
- Screens: VIP dashboard, Account loyalty tab, Checkout
- UI: Points balance, tier, redemption selector
- APIs: GET/POST /api/loyalty (planned)
- Auth: Required
- Integrations: Optional CRM

6) Age verification for restricted products
- Journey: Prompt verification pre-view or at checkout; block underage
- Screens: Age verification modal/page
- UI: DOB inputs, legal text
- APIs: POST /api/age-verification (planned)
- Auth: Optional; store verified state (user or anon)
- Integrations: Optional 3rd-party verification

7) Customer support interactions
- Journey: Contact support → Ticket → Updates
- Screens: Support/contact, Ticket status
- UI: Contact form, optional chat widget
- APIs: POST /api/support/tickets, GET /api/support/tickets/[id]
- Auth: Optional, recommended for history
- Integrations: Optional helpdesk

### Admin Workflows

1) Inventory management
- Journey: Sync from Zoho → Edit products → Manage stock → Map SKUs
- Screens: Admin products list, Product editor, Zoho sync dashboard
- UI: Import/sync controls, mapping table, stock adjustments
- APIs: GET /api/zoho/items (exists), POST /api/zoho/sync/products (planned)
- Auth: Admin role required
- Integrations: Zoho Inventory

2) Order processing and fulfillment
- Journey: View new orders → Pick/pack → Create shipment → Update status
- Screens: Order queue, Order detail, Shipment creation
- UI: Status transitions, label print, tracking
- APIs: GET/POST /api/orders, POST /api/shipments (planned)
- Auth: Admin role required
- Integrations: ShipStation (labels, tracking), Zoho SO sync

3) Customer management
- Journey: Search customers → View history → Notes/returns
- Screens: Customers list, Customer profile
- UI: Search and filters, timeline
- APIs: GET /api/customers, /api/customers/[id], POST /api/customers/[id]/notes (planned)
- Auth: Admin role required
- Integrations: Optional CRM

4) Compliance monitoring
- Journey: Review flagged items → Apply restrictions → Reports
- Screens: Compliance dashboard, Rules editor
- UI: State restrictions, lab certs upload, age flags
- APIs: GET/POST /api/compliance/rules, GET /api/reports/compliance (planned)
- Auth: Admin role required
- Integrations: Optional legal datasets

5) Analytics and reporting
- Journey: View sales trends → Conversion → Inventory turns
- Screens: Analytics dashboard, Export
- UI: Charts, filters, CSV export
- APIs: GET /api/analytics/sales, /api/analytics/inventory (planned)
- Auth: Admin role required
- Integrations: Optional analytics provider

### Screen Requirements (condensed)
- Customer: Home, Category list, Product detail, Cart, Checkout, Orders list/detail, Auth, VIP, Age verification, Support
- Admin: Products list/editor, Zoho sync, Orders queue/detail, Shipments, Customers list/profile, Compliance dashboard/rules, Analytics

### API Coverage (at a glance)
- Public: GET /api/categories, /api/brands, /api/products, /api/products/[id], /api/health
- Auth: POST /api/auth (sign in/out/up patterns with Supabase)
- Cart/Checkout: POST /api/checkout (exists), optional cart endpoints
- Orders: GET /api/orders, /api/orders/[id]
- Zoho: /api/zoho/oauth/start, /api/zoho/oauth/callback, /api/zoho/health, /api/zoho/items (exists), /api/zoho/sync/products (planned)
- ShipStation: /api/shipstation/* (planned)
- Admin: compliance, analytics, customers (planned)

---

## Recommended Next Steps

- Code tweaks
  - UPDATED: /api/zoho/oauth/start and /callback now use process.env.ZOHO_DC || 'us'
  - UPDATED: server/zoho/config.ts now defaults webhook to `${BASE_URL || 'http://localhost:3000'}/api/zoho/webhook`
- Dependency cleanup
  - UPDATED: Removed vite, @vitejs/plugin-react, @tailwindcss/vite, esbuild, drizzle-kit, and deleted drizzle.config.ts
  - TODO (post-Express): remove express*, passport*, multer, memorystore, ws, postgres, pdf-parse if unused; drop legacy:* scripts
- Docs
  - TODO: Update TECH_STACK_OVERVIEW.md and todo.md to remove Drizzle/Neon/VITE_* references


