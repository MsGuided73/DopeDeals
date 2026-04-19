# Highway 420 — Session Handoff

> **Mission for the next session:** add two new pages — `/road-trips` and `/bundles`. Both already exist as **carousel slides** on the landing page that link out, so the visual concept is half-defined. This doc gives you the fact base + recommendations to build them fast without re-doing exploration work.

---

## 5-minute orientation

**Stack:** Next.js (App Router), TypeScript, Supabase (Postgres + Auth + Storage), Tailwind. Live site at `qirbapivptotybspnbet.supabase.co`. Cart + sandbox payments confirmed working.

**Recent shipped work** (last few sessions):
- **Review feature** — net-new, see [`app/api/reviews/`](app/api/reviews/) + [`app/components/reviews/`](app/components/reviews/), wired into [`EnhancedPDP.tsx`](app/components/EnhancedPDP.tsx). Migration applied in production. Not browser-tested end-to-end yet.
- **Trusted Brands Bulletin Board** — [`app/components/TrustedBrandsBulletin.tsx`](app/components/TrustedBrandsBulletin.tsx) replaced the old scrolling carousel on the landing page (live)
- **Wood-grain treatment** for masthead, nav buttons, collections grid frame, trusted brands frame. Texture URLs are in supabase under `Highway420_assets/Textures/`.
- **Dab Rigs collection page (`/dabsntools/`)** got a "Pit Stop" hero treatment + Diner v2 hero variant — design mockups live in `.superdesign/design_iterations/` (HTML files), production page is in `app/dabsntools/`.
- **Hot Products section** + standalone `/hot-products` page got the dark "Diner v2" hero (the homepage section was reverted to its original treatment after testing; the standalone page kept it).
- **Footer (Highway420Footer.tsx)** overlay flipped from dark wash → cream wash so the black foreground text on the Big Sur image reads correctly.

---

## The brand visual language (compressed)

| Token | Value | Usage |
|---|---|---|
| **Amber** | `#e8920a` (light: `#f4ab2e`, deep: `#c5751a`, soft: `#fef2e0`) | Primary accent, CTAs, badges, hot indicators |
| **Highway shield green** | `rgba(22,100,50,0.9)` (deep: `#0f4523`) | Verified Buyer badges, masthead bg, brand identity (route shield motif) |
| **Cream / paper** | `#f0eadc` (deep: `#e6dcc6`, card: `#fffcf4`) | Light section backgrounds (High Praise, footer overlay, review modal) |
| **Walnut wood** | `#1c1208` / `#2a1c0d` / `#3a2614` | Dark wood accents, plank headers |
| **Asphalt dark** | `#0d0d0b` / `#1a1a1a` / `#2a1e15` | Hero sections (carousel, hot-products page) |
| **Desert dusk gradient** | `#2d2622 → #5a4a3a → #a07a4a` (180deg) | Hot Products section bg |
| **Ink** | `#2a2218` / `#5a4a3a` (soft) | Body text on cream surfaces |

**Fonts:**
- **BebasNeue** / **Bebas Neue** — display (section titles, hero), 0.04–0.08em letter-spacing
- **DM Sans** — body, UI (10–22px depending on context)
- **Source Serif 4** — italic blockquotes, editorial titles
- **Oswald** — collection grid labels, uppercase nav
- **Special Elite** — typewriter accents (bulletin board, stamps, captions)
- **Caveat** — handwritten captions (only used in polaroid mockup so far)
- **Monoton** — neon sign mockups
- **Helvetica Neue** — footer headlines (legacy)

Fonts are loaded ad-hoc per component via `<style>{`@import url(...)`}</style>` blocks. Some load in [`app/globals.css`](app/globals.css) too.

**Recurring motifs:**
- **Highway shield** badge (green, used in Verified Rider/Buyer pills) — see SVG path in [`SpotlightReviews.tsx:65-100`](app/components/SpotlightReviews.tsx#L65) and replicated in [`ReviewCard.tsx`](app/components/reviews/ReviewCard.tsx)
- **Dashed amber road stripe** (`repeating-linear-gradient(180deg, #e8920a 0px, #e8920a 16px, transparent 16px, transparent 32px)` at 18% opacity) running down section centers
- **Wood plank header** (with two metallic "nail head" pseudo-elements at corners) — see [`TrustedBrandsBulletin.tsx`](app/components/TrustedBrandsBulletin.tsx)
- **Glass / glassmorphism** with `backdrop-filter: blur(...)` on filter rails and overlays
- **CRT scanlines** on dark surfaces — `repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 3px)`
- **Neon glow text** — multi-layer text-shadow stacking amber tones

---

## Reusable components — use these first

| Component | Purpose | When to use |
|---|---|---|
| [`GlobalMasthead`](app/components/GlobalMasthead.tsx) | Site header (wood + green badge) | Every page (already in layout) |
| [`Highway420Footer`](components/Highway420Footer.tsx) | Site footer | Every page (already in layout) |
| [`GlobalBreadcrumbs`](app/components/GlobalBreadcrumbs.tsx) | Breadcrumb trail | Below masthead on category pages |
| [`FeaturedProductsSection`](app/components/FeaturedProductsSection.tsx) | Hot Products carousel | Reference for product card pattern |
| [`UniversalProductCard`](app/components/UniversalProductCard.tsx) | Single product card | Reuse for any product listing |
| [`AutoScrollContainer`](app/components/AutoScrollContainer.tsx) | Horizontal scrolling rail | Marquee-style brand or product strips |
| [`CollectionsGrid`](app/components/CollectionsGrid.tsx) | Monitor/CRT grid of categories | Reference for the rack-style layout |
| [`SpotlightReviews`](app/components/SpotlightReviews.tsx) | Beach-photo testimonials band | Reference for cream/sand band layout |
| [`TrustedBrandsBulletin`](app/components/TrustedBrandsBulletin.tsx) | Cork board with pinned cards | Reference for tilted-cards treatment |
| [`reviews/ProductRatingBadge`](app/components/reviews/ProductRatingBadge.tsx) | Compact star rating | If you build a product list, drop this in each card |
| [`reviews/StarRating`](app/components/reviews/StarRating.tsx) | Interactive or read-only stars | Anywhere stars are needed |

**Two more things to know:**
- **`Highway420Footer` is conditionally hidden** on `/cart`, `/checkout`, `/age-verification`, and `/blog` paths via the `hasCustomFooter` flag from [`NavigationContext`](app/contexts/NavigationContext.tsx). If a new page (e.g. a checkout-flow step or a custom landing) wants its own footer, set `setHasCustomFooter(true)` in a `useEffect`.
- **`addToCart` utility** at [`app/lib/cart-utils.ts`](app/lib/cart-utils.ts) is the canonical way to add items to the cart from any product card. Already used by `FeaturedProductsSection`, `UniversalProductCard`, the standalone `/hot-products` page, etc. The new `/bundles` page will definitely need this — handles toast notifications and cart updates internally.

---

## File / route conventions

```
app/
  page.tsx                  ← landing page (compose sections)
  layout.tsx                ← global wrapper (masthead + footer)
  <route>/page.tsx          ← e.g. app/road-trips/page.tsx → /road-trips
  <route>/<Component>.tsx   ← page-scoped components (e.g. RoadTripsHero.tsx)
  <route>/components/       ← multiple page-scoped components
  api/<route>/route.ts      ← API endpoints
  components/               ← global reusable components
  contexts/                 ← React Context providers
  lib/                      ← utilities
components/                 ← legacy shared components (still in use)
supabase/migrations/        ← SQL migrations (timestamped: YYYYMMDDHHMMSS_name.sql)
scripts/                    ← Per the supabase_migration skill, also keep a copy of new migration SQL here as `migration_<name>.sql`
.superdesign/design_iterations/  ← HTML mockups for design iteration (NOT runtime — pure preview)
.agent/skills/              ← Per-skill .md docs read by agents
```

**Adding a new route:** create `app/<slug>/page.tsx` that exports a default React component plus a `metadata` object for SEO. Look at [`app/dabsntools/page.tsx`](app/dabsntools/page.tsx) for a real example with full metadata + structured data.

---

## For the /road-trips page

**Existing context:**
- The Road Trips carousel slide on the landing page is at [`FullscreenCarousel.tsx`](app/components/FullscreenCarousel.tsx) and references the image at `Highway420_assets/Carousel-LP/RoadTrips/Road-Trips-V2.png`. That image + slide tagline already define the visual concept the user has approved.
- Theme on that slide is travel/lifestyle/adventure — leans into the "open road" Highway 420 narrative.

**Recommended approach:**
1. **Hero band** — full-width photo from supabase (the carousel image or a higher-res cousin). Overlay treatment similar to the High Praise band ([`SpotlightReviews.tsx`](app/components/SpotlightReviews.tsx)) — image fills, content overlays. BebasNeue title `ROAD TRIPS` with amber tagline below.
2. **Below the hero** — pick from these patterns based on what the user wants the page to *do*:
   - **Editorial / lifestyle blog** — cream `#f0eadc` band with Source Serif headlines (matches High Praise typography)
   - **Curated product bundles** for travel — could reuse the FeaturedProductsSection card pattern or build a "trip kit" composite card
   - **Destination guide** — map-pin / mile-marker metaphor (the unused Atlas mockup at [`.superdesign/design_iterations/dabrigs_atlas_1.html`](.superdesign/design_iterations/dabrigs_atlas_1.html) has a mile-marker sidebar pattern that would work beautifully here)
3. **Footer CTA** — link to the Bundles page (cross-link with discounted travel bundles)

**Ask the user first:** "Is the Road Trips page editorial content (articles, guides), product (travel-friendly bundles), or both?" That decision drives 80% of the layout.

**Files to look at:**
- [`SpotlightReviews.tsx`](app/components/SpotlightReviews.tsx) — full-width photo hero with overlay content
- [`.superdesign/design_iterations/dabrigs_atlas_1.html`](.superdesign/design_iterations/dabrigs_atlas_1.html) — mile-marker sidebar pattern
- [`FullscreenCarousel.tsx`](app/components/FullscreenCarousel.tsx) — find the Road Trips slide config to see the existing tagline/image

---

## For the /bundles page

**Existing context:**
- Carousel slide image at `Highway420_assets/Carousel-LP/Bundles/Bundles-V1.png`
- "Bundles" is a product offering — so this is a **shopping page** (product list with bundle pricing), not editorial

**Recommended approach:**
1. **Hero band** — Diner v2 dark hero treatment (matches what we built for `/hot-products`) with title `BUNDLES`, amber tagline. See [`app/hot-products/page.tsx`](app/hot-products/page.tsx) for the working version.
2. **Filter rail (sticky)** — same pattern as [`/dabsntools/mockup/page.tsx`](app/dabsntools/mockup/page.tsx) (the Pit Stop layout). Filter chips for bundle categories: *Starter Kit · Travel · Connoisseur · Gift · Subscription*.
3. **Bundle cards** — reuse [`FeaturedProductsSection.tsx`](app/components/FeaturedProductsSection.tsx) renderProductCard pattern. Add a "BUNDLE" badge in the corner (analogous to the `🔥 HOT` badge). Show component products inline if possible (e.g. "Includes: rig + carb cap + torch").
4. **Pricing display** — show bundle price + "you save $X" delta, since bundles imply discount.

**Database question for the user:** How are bundles modeled? Three options:
- (a) **As a product** in `main_site_products` with a special `is_bundle` flag and a `bundle_items` join table
- (b) **As a discount code** applied at checkout when N specific items are in cart
- (c) **No backend yet** — manually curated list

If (a), check whether the schema already exists. If (c), recommend (a) for v1 since it's the cleanest path.

**Files to look at:**
- [`app/hot-products/page.tsx`](app/hot-products/page.tsx) — full standalone product listing page with the diner v2 hero
- [`app/dabsntools/mockup/page.tsx`](app/dabsntools/mockup/page.tsx) — Pit Stop layout with filter chips
- [`app/components/FeaturedProductsSection.tsx`](app/components/FeaturedProductsSection.tsx) — product card pattern

---

## Known gotchas (won't bite you twice)

1. **`main_site_products`, NOT `products`** — the canonical products table is `main_site_products`. The old `products` table reference still appears in some legacy migration files (`order_items` FK declares `products(id)` even though it actually contains `main_site_products.id` UUIDs). For new code, always reference `main_site_products`.

2. **`order_items.id` is `TEXT`, not `UUID`** — despite the original migration declaring it UUID. Don't trust the migration file; trust the live DB.

3. **Stale credentials** — `DATABASE_URL` password and `SUPABASE_ACCESS_TOKEN` in `.env`/`.env.local` are stale. The site works because the runtime uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` (both fine). But CLI tools fail: `psql`, `npx supabase db push`, `supabase link` — all return auth errors. Don't waste time debugging this.

4. **Migrations: dashboard SQL editor only** — Per [`.agent/skills/supabase_migration/SKILL.md`](.agent/skills/supabase_migration/SKILL.md), every programmatic method has been tested and fails on this project. Direct the user to https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new — paste, run. Always include `DROP IF EXISTS ... CASCADE` at the top of new migration SQL for idempotency since the dashboard doesn't track migration state.

5. **Pre-existing TS errors (NOT from recent work)** — `app/api/orders/create/route.ts:199`, `lib/services/shipstation/routes.ts:255`, `lib/services/zoho/compliance.ts:101+158`. These were there before the recent sessions. They may or may not block production builds. Run `npm run build` to confirm before deploying.

6. **Image domains** — `next.config.js` may not include all the supabase URLs we use. If you use `<Image>` from `next/image` with a supabase URL, add `unoptimized` prop or update `images.remotePatterns` in next.config.

7. **Skill files in `.agent/skills/`** — read these before doing anything tricky. Especially `supabase_migration` (above) and `git_safe_sync`.

---

## Visual mockup workflow

Per [`CLAUDE.md`](CLAUDE.md), when designing a new UI, generate HTML mockups in `.superdesign/design_iterations/` first, named `<feature>_<variant>_<n>.html`. The user iterates on those before you port to React. Examples in that folder: `dabrigs_pitstop_1.html`, `dabrigs_diner_2.html`, `trustedbrands_bulletin_2.html`.

These are **not** runtime — they're standalone HTML files the user opens by double-clicking. Include Tailwind CDN, Google Fonts, and inline `<script>` for interactivity.

---

## Pre-deploy checklist

```bash
# Type check (currently 4 pre-existing errors in unrelated files — see gotcha #5)
npx tsc --noEmit

# Production build (will fail if any TS errors block)
npm run build

# Dev server for browser QA
npm run dev
```

Before reporting a feature as "ready to deploy," manually verify in browser: golden path + edge cases. Per project rules: "if you can't test the UI, say so explicitly rather than claiming success."

---

## Loose ends from prior sessions

- **Review feature** is shipped to repo but **not browser-QA'd end-to-end**. Need a user with a delivered order containing a product, sign in, navigate to PDP, hit Reviews tab, write+submit, verify it appears with verified-buyer badge. Photo upload also untested.
- **Reviews verification gates** rely on `users.age_verification_status = 'verified'` AND `user_profiles.email_verified = true`. Confirm these flags are being set correctly during signup/checkout flows. If not, no one will be able to leave reviews.
- **`user_profiles` columns** assumed to be `first_name` and `last_name`. If the actual columns are different, reviewer names will fall back to "Anonymous" / "Verified Rider" — no crash, just a display issue. Verify with `\d user_profiles` in the Supabase SQL editor.
- **Three trusted-brands bulletin board variations** exist as HTML mockups (v2 scattered, v3 curated grid, v4 polaroid). v2 is what's live. v3 has had its dark frame issue fixed; if the user later prefers v3, swap is a 5-minute port. v4 (polaroids) is the most distinctive but unused.

---

## Quick start for the next instance

1. Read this file (you just did)
2. Skim [`CLAUDE.md`](CLAUDE.md) for project-specific conventions (especially the design workflow rules)
3. Read [`.agent/skills/supabase_migration/SKILL.md`](.agent/skills/supabase_migration/SKILL.md) before touching the DB
4. Ask the user: "Editorial or product page?" for /road-trips, "How are bundles modeled?" for /bundles
5. Build mockups in `.superdesign/design_iterations/` first, get sign-off, then port to React
6. Follow file conventions: `app/<slug>/page.tsx` + page-scoped components in same folder
7. Use existing reusable components — don't rebuild what exists
