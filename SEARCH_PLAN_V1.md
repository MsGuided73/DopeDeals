# Highway 420 – Search & `search_vec` Plan V1

_Last updated: 2025-11-17_

This plan builds on `SEARCH_AUDIT.md` and `VARIATION_AUDIT.md` and focuses on:

- Normalizing the meaning and usage of `search_vec`
- Defining how FTS, keyword search, and vector search coexist
- Outlining a safe rollout that does **not break existing user flows**

---

## 1. Core Judgment

- ✅ **Worth doing**: Current search has schema drift (`search_vec` ambiguity) and is not variation-aware; fixing this improves relevance, avoids type bugs, and lets us use a single, powerful search surface.
- Constraint: **Never break userspace** – existing pages (`/search`, `/products`, THCA pages, category pages) must keep working during migration.

---

## 2. Data Structures – Target State

### 2.1 Columns on `main_site_products`

We want **clear, single-purpose columns**:

- `fts_vector tsvector`  
  - Dedicated full-text search vector for classical FTS.
  - Backed by trigger or generated column.

- `embedding_vec vector`  
  - PGVector column storing semantic embeddings for the product’s textual representation.
  - Used by THCA and (later) global semantic search.

- `search_keywords text[]` (already present)  
  - Normalized keyword tokens we can feed into both FTS and embeddings.

- `variations jsonb` (already present – see `VARIATION_AUDIT.md`)  
  - Structured variation objects; their attributes will be flattened into `search_keywords`.

> Implementation nuance: we do **not** have to rename or remove the current `search_vec` immediately. We can:
>
> - Introduce `fts_vector` + `embedding_vec` alongside whatever currently exists.
> - Update code to point to the new names.
> - Later deprecate `search_vec` once all callsites are migrated.

---

## 3. Search Behavior – Target Model

### 3.1 When the user types a query

We split behavior into three cooperating layers:

1. **Keyword / FTS layer**
   - Uses `fts_vector` and `ts_rank` to handle normal textual queries.
   - Backed by a GIN index on `fts_vector`.

2. **Semantic / vector layer**
   - Uses `embedding_vec` and `<=>` similarity to catch fuzzier queries (
     e.g., “smooth dab rigs”, “sleep support gummies”).
   - For now, primarily used on THCA-heavy collections; later extend globally.

3. **Business / merchandising layer**
   - Applies filters (brand, category, price, stock, compliance, variation facets).
   - Applies business ordering toggles (`featured`, `is_bestseller`, `created_at`).

### 3.2 How FTS and vector search combine

We keep it simple:

- If `q` is **short or clearly structured** (e.g., looks like a brand/sku or 1–2 terms):
  - Use FTS only, with:

    ```sql
    ts_rank(fts_vector, plainto_tsquery('english', :q)) AS fts_rank
    ```

- If `q` is **longer, descriptive**, or we are explicitly in a semantic-only surface (e.g., THCA explorer):
  - Compute an embedding for `q`.
  - Use a vector RPC (like `thca_vector_search`) or a generic `product_vector_search` view, ordering by `1 - (embedding_vec <=> query_embedding)`.

- For future **hybrid search**, we can compute both and combine with a simple weighted score:

  ```sql
  combined_rank = 0.6 * fts_rank + 0.4 * (1 - embedding_vec <=> query_embedding)
  ```

…but this can wait until we have reliable embeddings and metrics.

---

## 4. API-Level Design

### 4.1 `/api/search` – Global Search

Current behavior (see `SEARCH_AUDIT.md`):

- Uses Supabase JS `.textSearch('search_vec', queryText, { type: 'websearch' })`.
- Does not surface a rank field; `sort: 'relevance'` falls back to `featured_product`, image presence, and `created_at`.

**Plan:**

1. **Switch to `fts_vector` via RPC or view, not direct `.textSearch` on a column**

   - Create a SQL function, e.g. `search_main_site_products_v2(...)` (or reuse/improve the existing `search_main_site_products`) that:
     - Works against `fts_vector`.
     - Returns `id`, `name`, `price`, `image_url`, etc., plus a `search_rank` column.

   - Update `/api/search` to:
     - Call this RPC with filters (brand, category, price, stock, variations facets TBD).
     - Use `search_rank` for `sort: 'relevance'`.

2. **Keep existing POST body contract stable**

   - Maintain current JSON shape `{ q, category, filters, sort, page, page_size }`.
   - Map those parameters to the RPC signature in the handler.

3. **Add a `debug` mode (optional)**

   - For admins/debug only, allow returning `search_rank` and the query plan or flags.
   - Makes it easier to tune search without impacting users.

### 4.2 `/products` page – Migration to `/api/search`

Current behavior:

- `ProductsPageContent` uses Supabase client-side and `.textSearch('search_vec', ...)` against `main_site_products`.
- It also runs a brand-detection query.

**Plan:**

1. Add a **`mode: 'products-page'`** flag (or `context: 'products'`) in `/api/search` that:
   - Applies the same filters/limits as the `/products` page currently does.
   - Optionally includes brand detection in the response payload.

2. Gradually refactor `ProductsPageContent` to:
   - Fetch from `/api/search` instead of direct Supabase.
   - Preserve current UX and filter semantics.

3. Once stable, **remove direct Supabase search from the client** for `/products`.

### 4.3 THCA Search – Align around a `product_vector_search` RPC

Current behavior:

- THCA endpoints use dedicated logic plus the `thca_vector_search` RPC with `search_vec <=> query_embedding`.

**Plan:**

1. Introduce a generic `product_vector_search` RPC that:
   - Accepts `query_embedding`, `filters jsonb`, `page_size`, `page`.
   - Filters by `cannabinoid_profile` and category when needed (THCA-specific filters can still be supported via jsonb fields).

2. Update THCA routes to:
   - Call `product_vector_search` with THCA-specific filters (e.g., `cannabinoid_type = 'THCA'`, or `thca > 0` in `cannabinoid_profile`).
   - Keep `thca_vector_search` as a compatible alias during migration.

3. Later, allow `/api/search` to opt in to semantic search by:
   - Accepting a `semantic: boolean` flag or choosing vector mode for longer descriptive queries.

---

## 5. Variation-Aware Search Integration (Bridge to Variation Plan)

We do **not** solve all variation modeling in this plan, but we define how search will consume it once available.

### 5.1 Flattening variation attributes into `search_keywords`

From `VARIATION_AUDIT.md`, we will standardize the `variations` JSONB schema. For each product row:

- Extract a set of strings from variations, e.g.:
  - Sizes: `"3.5g"`, `"7g"`, `"1g preroll"`, `"2g disposable"`
  - Flavors: `"Watermelon Bubblegum"`, `"Unicorn Piss"`, `"Flavorless"`
  - Strengths: `"Microdose"`, `"Standard"`, `"Mega"`
  - Forms: `"Capsule"`, `"Chocolate"`, etc.

- Maintain a helper function (SQL or server-side script) to:

  ```text
  variation attributes → normalized tokens → append to search_keywords
  ```

- Rebuild `fts_vector` using `search_keywords` alongside `name`, `description`, etc.

Result: a user searching for a **flavor** or **size** will now benefit from both FTS and (later) embeddings, without any UI changes.

### 5.2 Variation facets in `/api/search`

- Extend `filters` in `/api/search` to eventually include:

  ```ts
  filters: {
    // existing
    brand_slug?: string[];
    price_min?: number;
    price_max?: number;
    // new / planned
    sizes?: string[];
    strengths?: string[];
    flavors?: string[];
    forms?: string[];
  }
  ```

- On the SQL side, these map to:
  - Either JSONB `variations` queries (short term), e.g. `variations @> '[{"attributes": {"size": "3.5g"}}]'::jsonb`
  - Or `product_variations` joins (long term).

We will keep the initial rollout **read-only** for variations (facet support) and add per-variant inventory/pricing later via the variation plan.

---

## 6. Rollout Plan (Phased, Non-Breaking)

### Phase 1 – Introspection & Guardrails

- [ ] Confirm actual type and usage of any existing `search_vec` column on `main_site_products` in Supabase.
- [ ] Add database-level comments documenting the intended purpose of `fts_vector` and `embedding_vec` once created.
- [ ] Create a small set of **diagnostic queries** (stored in `search-debug.sql`) to inspect ranks and performance.

### Phase 2 – Schema Additions (No Behavior Change Yet)

- [ ] Add `fts_vector tsvector` to `main_site_products`.
  - Either as a **generated column** based on current text fields + `search_keywords`, or via trigger function (`update_fts_vector`).
- [ ] Add `embedding_vec vector` (nullable) to `main_site_products`.
- [ ] Create GIN index on `fts_vector` and IVFFLAT/HNSW index on `embedding_vec` (if available in current PG/pgvector version).

### Phase 3 – RPCs / Views

- [ ] Implement `search_main_site_products_v2(...)` that returns `search_rank` and reproduces `/api/search` filters.
- [ ] Implement `product_vector_search(...)` as a generalization of `thca_vector_search`.
- [ ] Keep existing functions in place; **do not remove** `thca_vector_search` until all callsites are migrated.

### Phase 4 – API Migration

- [ ] Update `/api/search` to call `search_main_site_products_v2` instead of inline Supabase `.textSearch`.
- [ ] For THCA endpoints, introduce optional path that calls `product_vector_search` while keeping the old path as a fallback.
- [ ] Add feature flags/env vars where necessary to toggle between old/new behaviors for debugging.

### Phase 5 – Client Migration

- [ ] Refactor `/products` page to call `/api/search` instead of Supabase client.
- [ ] Add smoke tests (manual or Vitest-based) for:
  - `/search` queries with/without `q`
  - `/products` with query
  - THCA flows with/without embeddings

### Phase 6 – Variation Integration (Coordinated with Variation Plan)

- [ ] Implement variation → `search_keywords` flattening script.
- [ ] Backfill `fts_vector` for a pilot set of products with rich variations (e.g., Packwoods, XSIR, mushrooms).
- [ ] Expose variation-based facets in `/api/search` (optional, behind a flag).

### Phase 7 – Cleanup (Future)

- [ ] Once confident and all consumers are migrated, deprecate historic uses of `search_vec` and/or rename it for clarity.
- [ ] Remove any unused legacy search paths.

---

## 7. Open Items / Decisions Needed

1. **Column strategy**
   - Do you prefer to add `fts_vector` + `embedding_vec` **alongside** the existing `search_vec`, or rename `search_vec` immediately?
   - Recommendation: add new columns first, keep `search_vec` untouched until everything is migrated.

2. **Embedding source**
   - Should `embedding_vec` be based on:
     - (A) `name + short_description + variation attributes`, or
     - (B) a longer, marketing-style summary (possibly AI-generated), or
     - (C) both, with some weightings?

3. **Where to run embedding generation?**
   - Options: n8n pipeline, Supabase edge function, or one-off scripts in `/scripts`.

4. **Scope of first pilot**
   - Which verticals should be included in the **first end-to-end test** of variation-aware search?
     - Candidate: **disposables + mushrooms + THCA flower**, since they have strong flavor/strength/size semantics.

Once these decisions are made, we can draft concrete SQL migrations and TypeScript changes under a dedicated branch (e.g., `search-and-variation-v2`) without impacting production until you’re ready to deploy.
