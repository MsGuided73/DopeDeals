# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project identity

This repo's `package.json` name is `highway-420` — it is the **Highway 420** premium cannabis / smoke-shop e-commerce store. The directory `c:\dev\DopeDeals-1` is just a local working copy; the brand and codebase are Highway 420. Many docs say "DopeDeals" only as a legacy/sister-store reference. Maintain Highway 420 branding (Highway Gothic / Bebas Neue, brand orange `#ff6b35`) and age-verification flow on every customer-facing page. See [HIGHWAY_420_STYLE_GUIDE.md](HIGHWAY_420_STYLE_GUIDE.md) and [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

## Common commands

Package manager is **pnpm 9.15.9** (pinned via `packageManager` field; Node ≥22.11). All scripts:

```bash
pnpm dev                  # next dev (port 3000)
pnpm build                # next build → standalone output for Docker
pnpm start                # next start
pnpm lint                 # eslint . --ext .ts,.tsx --max-warnings=0
pnpm test                 # vitest run (single run, not watch)
pnpm typecheck            # tsc -p tsconfig.typecheck.json (app + shared + lib)
pnpm typecheck:server     # tsc -p tsconfig.server.json (Express bits in /server)
pnpm sync:airtable        # tsx scripts/sync_airtable_to_supabase.ts
```

Run a single test file: `pnpm vitest run path/to/file.spec.ts`. Tests live under `tests/` and are matched by `**/*.{test,spec}.ts(x)`. Setup file: [tests/setup/env.ts](tests/setup/env.ts).

`next.config.js` has `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — `next build` will succeed with type errors, so always run `pnpm typecheck` before considering a change green.

## Architecture

### Two TypeScript projects, one repo

- **Next.js app (App Router)** — the real product. Lives under [app/](app/), [components/](components/), [lib/](lib/), [shared/](shared/). Configured by [tsconfig.json](tsconfig.json) and [tsconfig.typecheck.json](tsconfig.typecheck.json). Path aliases: `@/*` → `app/*`, `@shared/*` → `shared/*`, `@assets/*` → `attached_assets/*`. `tsconfig.json` explicitly **excludes `server/**`** and ESLint ignores it too.
- **Legacy Express server** under [server/](server/) ([index.ts](server/index.ts), [routes.ts](server/routes.ts), `server/admin/`, `server/services/`). Compiled with [tsconfig.server.json](tsconfig.server.json). Not deployed as part of the Next.js production image — treat it as supporting/admin tooling unless a task explicitly targets it.

### App layout

[app/layout.tsx](app/layout.tsx) wraps every page with `AppProviders` → `AgeGateModal` → `NavigationProvider` → `TrustStrip` → children → `Highway420Footer` → `FloatingNav` → `StickyCartPopup`. Age gate, trust strip, floating nav and cart popup are global; do not duplicate them per page.

[middleware.ts](middleware.ts) runs at the edge and:
1. Hard-blocks any path matched by [`isRestrictedPath`](lib/compliance-filters.ts) (Kratom paths) → redirects to `/?reason=kratom_blocked`.
2. Redirects unauthenticated users away from `protectedRoutes` (`/account`, `/orders`, `/profile`, `/wishlist`, `/payment-methods`, `/returns`) and `/admin` to `/signin`. The auth check is a cheap cookie-name sniff (`sb-*-auth-token`) because the Edge runtime can't run the full Supabase client — real auth still happens server-side in the page/API.

API routes live under [app/api/](app/api/) (Next.js Route Handlers). The legacy Express tree is separate.

### Data layer — Supabase + Drizzle

- Runtime database access goes through Supabase, not Drizzle. Three client factories:
  - [lib/supabase-server.ts](lib/supabase-server.ts) — eager `createServerClient` for RSC reads.
  - [lib/supabase-client-factory.ts](lib/supabase-client-factory.ts) — `createSupabaseClient()` (server, async/dynamic-import) and `createClientSupabaseClient()` (browser, anon key).
  - [lib/supabase-server-ssr.ts](lib/supabase-server-ssr.ts) — SSR variant.
  - [server/supabase-admin.ts](server/supabase-admin.ts) — service-role client, server-only.
- [shared/schema.ts](shared/schema.ts) is the **Drizzle schema of record**. Per [shared/AGENTS.md](shared/AGENTS.md), every Supabase migration must update Drizzle in the same PR, even though queries themselves use the Supabase client.
- Migrations live under [supabase/migrations/](supabase/migrations/) — see [supabase/AGENTS.md](supabase/AGENTS.md) for authoring rules (transactional, idempotent, `pnpm supabase migration new <slug>`).

### Critical product-data policy

[DATABASE_POLICY.md](DATABASE_POLICY.md) is binding for any product query:

- **Use only the `main_site_products` table.** `products` and `products_compat` are deprecated. Do not introduce queries against them.
- **Customer-facing list queries MUST filter `.eq('is_active', true)`** (policy reversed 2026-05-05; previous rule was the opposite). Single-product / cart / admin paths still must NOT filter `is_active`. See [DATABASE_POLICY.md](DATABASE_POLICY.md).
- **Customer-facing list queries MUST also use `applyImageRequiredFilter()`** from [lib/product-display-filters.ts](lib/product-display-filters.ts) so mid-import SKUs without images don't appear on the storefront.

When in doubt, mirror existing query shapes in [lib/product-service.ts](lib/product-service.ts) and `app/api/products/`.

### Catalog model (per [AGENTS.md](AGENTS.md))

`product_types` is the authoritative merchandising taxonomy; legacy `categories` exists for compatibility but should not back new features. Purchasable units live in `product_variants`; media in `product_media` / `variant_media`. Compliance defaults are driven by `compliance_profiles`. Search uses `product_search_index` and `product_facets` — schema changes that affect either must include a search-refresh step (see runbook in [AGENTS.md §5.3](AGENTS.md)).

### External integrations

- **Supabase** — database, auth, storage (assets are served from `qirbapivptotybspnbet.supabase.co/storage/...`, including self-hosted brand fonts referenced from [app/layout.tsx](app/layout.tsx)).
- **Zoho Inventory** ([lib/services/zoho/](lib/services/zoho/)) — product source of truth when reconnected; sync drives `product_sources` / `product_source_items`.
- **Airtable** — secondary product enrichment, see [scripts/sync_airtable_to_supabase.ts](scripts/sync_airtable_to_supabase.ts) and [AIRTABLE_FIELD_MAPPING_STRATEGY.md](AIRTABLE_FIELD_MAPPING_STRATEGY.md).
- **KajaPay** ([lib/services/kajapay/](lib/services/kajapay/), [app/api/kajapay/](app/api/kajapay/)) — payment processor.
- **ShipStation** ([lib/services/shipstation/](lib/services/shipstation/)).
- **AgeChecker** ([lib/services/age-checker/](lib/services/age-checker/), [app/api/age-checker/](app/api/age-checker/)) — third-party age verification, gating compliance.
- **OpenAI / Gemini** — product chat & background classification ([server/services/aiClassifier.ts](server/services/aiClassifier.ts), [components/AIProductChat.tsx](components/AIProductChat.tsx)).

### Compliance is non-negotiable

- Age verification (21+) must remain on all product flows; the global `AgeGateModal` is the entry point.
- The Kratom block in [middleware.ts](middleware.ts) is a legal gate, not UX polish — do not narrow `isRestrictedPath` without explicit approval.
- Cannabis/hemp shipping restrictions live in [lib/compliance-filters.ts](lib/compliance-filters.ts) and `compliance_profiles`. Use those rather than hardcoding state lists.
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) and [PAYMENT_PROCESSOR_READINESS_CHECKLIST.md](PAYMENT_PROCESSOR_READINESS_CHECKLIST.md) before any prod-affecting change.

### Schema convention quirk

Per the user's auto-memory and observed code: the Supabase column for COAs is **`"coa-url"`** (with a literal hyphen). Quote it in PostgREST/Supabase queries. Brand linkage on products goes through `brand_name`, not a foreign key, in legacy paths.

## Style and code expectations

From [AGENTS.md](AGENTS.md) and [shared/AGENTS.md](shared/AGENTS.md):

- Functional React components, typed props, no default exports in shared libraries.
- Drizzle helpers from [shared/](shared/) only — no raw SQL in app code without approval.
- Surface actionable errors; **do not wrap imports in `try/catch`** (project standard).
- ESLint config ([eslint.config.js](eslint.config.js)) currently has `no-unused-vars` disabled during the migration; do not add new lint suppressions without documenting the reason in [AGENTS.md](AGENTS.md).
- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`. Conventional Commits.
- Run `pnpm test` before opening a PR; run `pnpm lint` and `pnpm typecheck` if either is impacted.

### Frontend visual rules ([HIGHWAY_420_STYLE_GUIDE.md](HIGHWAY_420_STYLE_GUIDE.md))

- Highway Gothic / `font-chalets` is **never bold** (`font-weight: normal`, `letter-spacing: -0.01em`/`-0.02em`). The rule is enforced globally via `!important` in `app/globals.css`.
- Product grids cap at **3 columns** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Do not introduce `xl:grid-cols-4`+.
- Brand orange `#ff6b35` for "420" / accents; never bootstrap-style blues.

## Deployment

Production runs on **Coolify / Docker** ([Dockerfile](Dockerfile), [nixpacks.toml](nixpacks.toml), [COOLIFY_INSTALL.md](COOLIFY_INSTALL.md)). `next build` produces standalone output. Required runtime env (do not bake into image): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `OPENAI_API_KEY`, plus integration keys (`ZOHO_*`, `KAJAPAY_*`, `SHIPSTATION_*`). [next.config.js](next.config.js) sets `SUPABASE_SERVICE_ROLE_KEY ||= 'ci-placeholder'` so CI builds don't crash — never rely on that placeholder at runtime.

## Repository hygiene notes

- The repo root is heavy with one-off `.cjs` / `.ps1` / `.sql` debug scripts (`check_*`, `fix_*`, `test_*`, etc.) and dozens of historical planning markdowns. Treat them as scratch/history; do not extend them. New scripts belong under [scripts/](scripts/), new migrations under [supabase/migrations/](supabase/migrations/), new docs under [docs/](docs/).
- `.cursor/rules/design.mdc` and the previous `CLAUDE.md` content were SuperDesign VS Code extension instructions, not project guidance — ignore them for engineering tasks. They only apply when the user explicitly asks for `.superdesign/design_iterations/` HTML mockups.
- Nested `AGENTS.md` files override the root: [shared/AGENTS.md](shared/AGENTS.md) for Drizzle, [supabase/AGENTS.md](supabase/AGENTS.md) for migrations.
