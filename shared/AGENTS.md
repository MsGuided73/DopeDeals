# AGENTS — Shared Libraries & Drizzle Schema

_Last updated: 2025-01-30_

This file governs contributions under `/shared` (TypeScript utilities, Drizzle schema, cross-app helpers).

## Schema evolution guidelines
- Reflect every Supabase migration in Drizzle models during the same PR; mismatches block merges.
- Use `pgTable`, enums, and helper builders from the existing schema to keep conventions consistent (camelCase property names, snake_case SQL columns).
- Default to nullable fields only when the business domain genuinely allows missing data. Prefer explicit enums/booleans over string flags.
- When introducing new relationships, export typed relations via `relations()` so downstream queries remain type-safe.

## TypeScript style
- Export named constants for tables and types (e.g., `export const productTypes = pgTable(...)`). Also export `type` aliases via `typeof` so API layers can reuse them.
- Keep files organized by domain section with headings/comments sparingly. Avoid default exports.
- Document non-obvious constraints with block comments directly above the field definition.

## Testing & validation
- After editing schema definitions, run `pnpm test` and any targeted unit tests that touch the affected domain.
- If adding utility functions, include vitest coverage in `/tests` when feasible.

## Search integrations
- When adjusting search-related tables (`product_search_index`, `product_facets`), update the runbook in the root `AGENTS.md` if the workflow changes.
- Provide helper views or SQL fragments for search refresh scripts when adding new fields that need indexing.

## Documentation sync
- Mirror significant schema additions in `docs/catalog-schema-foundation.md` to keep the data model reference current.
- Note any required data backfills or default values in the PR body so operators can execute them.

Follow these conventions to keep the shared layer predictable for both the Next.js app and background services.
