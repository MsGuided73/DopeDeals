# AGENTS

_Last updated: 2025-01-30_

Welcome! This document sets the collaboration contract for the DopeDeals monorepo. All contributors—human or automated—must follow these rules before touching any file within this repository unless a more specific `AGENTS.md` in a subdirectory overrides them.

## 1. Collaboration & Workflow Norms
- **Branching:** Create feature branches named `feat/<slug>`, `fix/<slug>`, or `chore/<slug>` that describe the work. Do not commit directly to `main`.
- **Commits:** Write conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:` …) that summarize the change scope. Squash only if the history becomes noisy.
- **Pull Requests:** Every change requires a PR with a succinct summary, testing notes, and any rollout considerations. Reference related planning docs when relevant.
- **Testing baseline:** Run `pnpm test` before opening a PR. If linting or typechecking is impacted, run `pnpm lint` and `pnpm typecheck`. Record any skipped checks and justify them in the PR description.
- **Static analysis:** Respect ESLint and TypeScript configurations. Do not introduce new lint suppressions unless you also document the rationale here.

## 2. Style Expectations
- **TypeScript/React:** Prefer functional components, hooks, and typed props. Avoid default exports in shared libraries. Keep files self-documenting with clear naming and avoid magic numbers.
- **Database interactions:** Use Drizzle schema helpers defined in `/shared`. No raw SQL in application code without prior approval.
- **Error handling:** Surface actionable errors; never wrap imports in `try/catch` blocks (project standard).
- **Documentation:** Update relevant markdown guides whenever you alter workflows, environment steps, or schema contracts.

## 3. Foundational Catalog Principles
- **Product hierarchy:** `product_types` is the authoritative merchandising taxonomy. Legacy `categories` remain for compatibility but should not drive new features.
- **Variants & options:** Purchasable units live in `product_variants`. Options and attributes must reference normalized definition tables so filters stay consistent.
- **Media enrichment:** Use `product_media` and `variant_media` to attach assets. Tag primary imagery and swatches for responsive merchandising.
- **Compliance:** Respect `compliance_profiles` defaults when exposing products. Always confirm age/shipping rules before publishing new types.
- **Search posture:** Maintain `product_search_index` and `product_facets` to keep filtering instant. Coordinate schema changes with search refresh procedures below.

## 4. Migration & Deployment Guardrails
- Ship database changes through Supabase migrations only (see `/supabase/AGENTS.md`).
- Every migration must be backwards-compatible with the running app, or the PR must include the necessary code toggles to handle the transition.
- After deploying migrations, monitor ingestion and search jobs for regressions for at least one cycle.

## 5. Runbooks
### 5.1 Migration rollout
1. Generate a new SQL migration via `pnpm supabase migration new <name>`.
2. Validate locally with `pnpm supabase db reset` and ensure `pnpm test` passes.
3. Update Drizzle schema definitions in `/shared` to mirror the migration.
4. Document notable changes in `docs/` and link them in the PR.
5. During deploy, run migrations first, then restart API processes.

### 5.2 Ingestion sync validation
1. Trigger the Zoho + Airtable sync jobs (see `DATA_CONSOLIDATION_STRATEGY.md`).
2. Inspect `product_sources` and `product_source_items` for new payloads.
3. Verify default variants exist and stock landed in `variant_inventory`.
4. Refresh `product_facets` (manual `REFRESH MATERIALIZED VIEW` if needed).
5. Smoke-test the storefront category and product detail pages.

### 5.3 Search index refresh
1. Ensure catalog ingestions are complete.
2. Run the search index job (`pnpm ts-node scripts/rebuild-search.ts` once implemented).
3. Confirm `product_search_index.last_synced` timestamps advance.
4. Rebuild edge caches/CDN for search endpoints if applicable.
5. Monitor search latency and facet accuracy for regressions.

## 6. Documentation Hygiene
- Update this file whenever foundational truths change. Add a changelog entry in the PR description when you do.
- Use nested `AGENTS.md` files for directory-specific instructions. Current children:
  - `/shared/AGENTS.md` – Drizzle schema and shared TypeScript guidance.
  - `/supabase/AGENTS.md` – Migration authoring and review etiquette.

Following these guidelines keeps the catalog foundation reliable, the search experience fast, and collaboration efficient. Reach out in the PR if something here blocks your work.
