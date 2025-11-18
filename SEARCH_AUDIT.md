# Highway 420 Search System – Audit V1

_Last updated: 2025-11-17_

## 1. Purpose

This document maps the current Highway 420 search stack so we can:

- Design a robust **search + product-variation model** that doesn’t break existing flows
- Identify mismatches between the **intended enhanced schema** and what the app is actually using
- Prepare a safe path toward a **single, consistent search surface** backed by `main_site_products`

---

## 2. High-Level Architecture (Today)

### 2.1 Data Surfaces

**Primary product surfaces in codebase:**

1. `main_site_products` (Supabase)
   - Defined in `supabase_migration_001.sql` and `enhanced_main_site_products_schema.sql`
   - Key fields used or intended for search:
     - Text: `name`, `description`, `short_description`, `seo_title`, `tags[]`, `search_keywords[]`
     - JSONB: `cannabinoid_profile`, `effects_profile`, `psychoactive_profile`, `compliance_info`
     - Search helpers: `search_boost`, `variations` (JSONB), `parent_product_id`
     - Status / merchandising: `is_active`, `featured`, `is_new`, `is_bestseller`, `is_trending`
   - Indexes:
     - `idx_main_site_products_search` – GIN on **computed** `to_tsvector('english', ...)`
     - Multiple JSONB GIN indexes (cannabinoids, effects, compliance, etc.)

2. Legacy `products` table (80 columns)
   - Used by `search_products_enhanced` in `enhanced_products_schema.sql`
   - Exposes `enhanced_products_view` + `compliance_products_view`
   - Represents transitional/compatibility layer; not the main focus of the new search API.

3. THCA-specific vector search surface
   - `public.thca_vector_search(...)` in `supabase/migrations/20251105185109_create_thca_vector_search_function.sql`
   - Operates on `main_site_products` with:
     - `query_embedding vector`
     - Filters from `filters jsonb` (brands, categories, price, stock, etc.)
     - Uses `p.search_vec <=> query_embedding` for similarity and `search_rank` scoring
     - Enforces THCA-only: `(p.cannabinoid_profile->'thc_variants'->>'thca')::decimal > 0`

> **Important:** There is some schema drift between older FTS-only design and newer vector design (see §4).

---

## 3. Core Search Flows

### 3.1 Global Product Search API – `/api/search`

**File:** `app/api/search/route.ts`

- Accepts JSON body:
  - `q?: string` – search query
  - `category?: string` – category slug (e.g. `pipes`, `bongs`)
  - `filters?: { brand_slug?, price_min?, price_max?, in_stock_only?, inventory_status?, materials?, tags? }`
  - `sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popularity'` (default `relevance`)
  - `page?: number`, `page_size?: number`

- Creates Supabase client against `main_site_products`:

  ```ts
  let q1 = supabase
    .from("main_site_products")
    .select("id,name,brand_name,brand_slug,image_url,sale_price,our_price,their_price,fire_price,inventory_status,stock_quantity,is_active,created_at", { count: "exact" });
  ```

- **Category filter:**

  ```ts
  if (category) q1 = q1.eq("category_slug", category);
  ```

- **Search behavior:**
  - If `q` length ≥ 2:

    ```ts
    // FTS via Supabase textSearch
    // @ts-expect-error: textSearch exists at runtime
    q1 = (q1 as any).textSearch("search_vec", queryText, {
      type: "websearch",
      config: "english",
    });
    ```

  - Else if `q` is non-empty but < 2 chars:

    ```ts
    const like = `%${queryText}%`;
    q1 = q1.or([
      `name.ilike.${like}`,
      `description.ilike.${like}`,
      `short_description.ilike.${like}`,
    ].join(","));
    ```

- **Filters:** brand_slug, price_min/max (via `PRICE_EXPR`), stock-only, inventory_status, `materials` + `tags` via `.overlaps`.

- **Sorting:**
  - `price_asc` / `price_desc` via `order(PRICE_EXPR)`
  - `newest` via `created_at`
  - `popularity` via `is_bestseller` then `created_at`
  - `relevance` fallback orders by `featured_product`, `image_url`, `created_at` – notably **not** by any FTS rank value.

- **Paging:** uses Supabase `.range(offset, offset + limit - 1)` and returns `{ items, total, page, page_size }`.

**Frontend usage (partial):**

- `app/components/EnhancedSearchBar.tsx`:
  - Calls `/api/search/autosuggest` for suggestions (separate endpoint not yet audited here).
  - On submit, routes to `/search?q=...` with URL params.
- `app/search/SearchResultsContent.tsx`:
  - Reads `searchParams` → `q`, filters.
  - Calls `fetch('/api/search', { method: 'POST', body: JSON.stringify({ q, filters, sort }) })`.
  - Handles pagination and displays total count.

### 3.2 Products Page Search – `/products`

**File:** `app/products/ProductsPageContent.tsx`

- Uses Supabase directly from the client:

  ```ts
  if (searchQuery.trim()) {
    // PostgreSQL full-text search with the search vector
    query = query.textSearch('search_vec', searchQuery.trim(), {
      type: 'websearch',
      config: 'english',
    });
  }
  ```

- Also performs a **brand detection pass** when `searchQuery.length >= 3`, using a separate brands table.
- This is a separate search surface from `/api/search` and may diverge in behavior, filters, and future enhancements.

### 3.3 THCA Search Flows

Key files:

- `app/thca/ThcaPageContent.tsx`
  - Client-side logic that:
    - Generates embeddings for `searchQuery` via `/api/embeddings` when provided.
    - Calls `/api/search/thca` (not fully audited yet) with embeddings and filters.

- `app/api/products/thca-flower/route.ts`
- `app/api/products/thca-pre-rolls/route.ts`
- `app/api/products/thca-pre-rolls/route_vec.ts`

Patterns:

- THCA endpoints parse query params `q`, `sort`, filters (price, brands, sizes, styles, inStock, onSale, isNew, featured, etc.).
- When `q` is present, they request an embedding from `/api/embeddings` with `{ text: searchQuery, type: 'search' }`.
- They then call **either**:
  - A vector-powered RPC (`thca_vector_search`) with `query_embedding` and filter JSON; **or**
  - A simplified fallback search `performRegularSearch` that uses more conventional filters and ordering.

Result: THCA flows already treat **vector search** and **filter JSON** as first-class. Global search is still primarily FTS + some filter logic.

---

## 4. `search_vec` / Search Vector State

### 4.1 Historical FTS Design

Early enhanced schema (e.g. `enhanced_main_site_products_schema.sql`, `supabase_migration_001.sql`) defined **GIN index on an expression**:

```sql
CREATE INDEX idx_main_site_products_search ON main_site_products
USING gin(to_tsvector('english',
  name || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(short_description, '') || ' ' ||
  COALESCE(seo_title, '') || ' ' ||
  array_to_string(COALESCE(tags, '{}'), ' ') || ' ' ||
  array_to_string(COALESCE(search_keywords, '{}'), ' ')
));
```

Notably, these migrations do **not** define a dedicated `search_vec` column; they index the computed tsvector directly.

### 4.2 Legacy `products.search_vector`

`post_migration_type_conversions.sql` adds a `search_vector tsvector` column on the older `products` table plus a trigger `update_product_search_vector()`.

This is separate from `main_site_products` and predates the current `/api/search` endpoint.

### 4.3 Current Code Expectations

- `/api/search` and `ProductsPageContent` both call `.textSearch('search_vec', ...)` against `main_site_products`.
- THCA vector function expects `p.search_vec` of type **`vector`** and uses `<=>` similarity operator.

> This implies there is a more recent migration (not yet reviewed) that adds `search_vec vector` to `main_site_products`. That column name is now being used for **two different purposes** in different parts of the stack:
>
> - As a FTS tsvector in Supabase JS `.textSearch()` calls
> - As a PGVector `vector` type column for THCA semantic search
>
> These two usages are **incompatible**; they cannot both be correct unless there are two separate columns or the FTS calls are actually hitting a different table/view.

This is a key area to clarify before any refactors.

---

## 5. Variation Modeling – Current Hooks (High-Level)

Variation modeling will be detailed in `VARIATION_AUDIT.md`, but from the search perspective:

- `main_site_products` includes:
  - `variations JSONB DEFAULT '[]'` – intended for size/flavor/etc. arrays.
  - `parent_product_id UUID REFERENCES main_site_products(id)` – parent/child linking.
- No dedicated `product_variations` table is currently active in the migrations (though docs mention one).
- Existing search flows **do not** explicitly:
  - Expand variations into separate rows for indexing, or
  - Aggregate variation attributes (e.g., flavors, mg strengths) into search keywords.

This means search relevance is currently biased toward the **parent SKU text fields**, not variation-level attributes.

---

## 6. Key Risks / Inconsistencies

1. **`search_vec` type ambiguity**
   - Code treats `search_vec` as both FTS tsvector and PGVector.
   - Risk: runtime errors in Supabase `.textSearch` or incorrect usage of `<=>` if types don’t match.

2. **Multiple search surfaces with diverging behavior**
   - `/api/search` vs `/products` vs THCA endpoints.
   - Each has its own filter set, ranking logic, and sometimes data sources.

3. **No explicit variation-aware search**
   - Variations JSON and parent-child fields are not integrated into search ranking, autosuggest, or filters.

4. **Ranking by `featured` and `created_at` under "relevance"**
   - `/api/search`’s `relevance` sort does not currently use a rank field (e.g., `ts_rank` or vector similarity) even when FTS is used.

---

## 7. Immediate Improvement Opportunities (Design-Level)

These are **design candidates**, not yet implemented:

1. **Normalize `search_vec` responsibility**
   - Decide on a single meaning for `search_vec` on `main_site_products`:
     - Option A: `search_vec` = PGVector only (semantic search), and use the existing expression index for FTS.
     - Option B: Add separate named columns: `fts_vector tsvector`, `embedding_vec vector`.
   - Update all Supabase JS calls accordingly.

2. **Unify global search around `/api/search`**
   - Gradually move `ProductsPageContent` from direct Supabase access to the `/api/search` endpoint (or a THCA-specific variant) so there’s a single place to evolve logic.

3. **Introduce variation-aware indexing**
   - Decide on canonical variation model (JSON vs `product_variations` table).
   - Ensure: variation titles, flavors, strengths, and pack sizes are baked into
     - `search_keywords`
     - Autosuggest surface
     - Filter facets

4. **Add real relevance ordering**
   - For FTS: use `ts_rank` from a view or RPC instead of only `featured/created_at`.
   - For vector search: expose and sort by `search_rank` from `thca_vector_search`.

---

## 8. Open Questions / Clarifications Needed

1. What is the **current actual type** of `main_site_products.search_vec` in Supabase?
   - `vector`, `tsvector`, or something else?
2. Are we ready to treat `main_site_products` as the **single source of truth** for all public search (including legacy `/products` page), or do we need a compatibility phase?
3. For variations, are you leaning toward:
   - A dedicated `product_variations` table with its own inventory and pricing, or
   - Keeping variations in the `variations` JSONB + parent/child rows?

---

## 9. Next Steps

Planned in follow-up work:

- Create `VARIATION_AUDIT.md` to map current and desired variation models.
- Propose a concrete `search_vec` / `fts_vector` / `embedding` schema that:
  - Keeps THCA vector RPC working
  - Gives `/api/search` a clean mapping for FTS and vector relevance
- Design how variation attributes feed into:
  - `search_keywords`
  - Autosuggest
  - Filter facets (sizes, flavors, mg strength, count, etc.)
