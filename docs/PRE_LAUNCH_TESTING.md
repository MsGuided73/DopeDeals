# 🧪 PRE-LAUNCH TESTING CHECKLIST

**Before showing the website, test these critical areas:**

---

## 1. 🎠 HOMEPAGE CAROUSEL

Source: [`FullscreenCarousel.tsx`](../app/components/FullscreenCarousel.tsx).

### Test Items:

- [ ] Carousel auto-advances every **6 seconds**
- [ ] All **4 slides** display correctly
- [ ] **NO TEXT** appears on any slide (image-only design)
- [ ] Images load properly (from Supabase `Highway420_assets/Carousel-LP/…`):
  - [ ] Slide 1: `VIPMembership/VIP Membership - V3.png`
  - [ ] Slide 2: `Products/CG_ProdCard-Dab Rig.png`
  - [ ] Slide 3: `Bundles/Bundles-V1.png`
  - [ ] Slide 4: `RoadTrips/Road-Trips-V2.png`
- [ ] No dark overlay on images
- [ ] Slides are clickable and navigate to the correct pages:
  - [ ] Slide 1 → `/rewards`
  - [ ] Slide 2 → `/dabsntools`
  - [ ] Slide 3 → `/bundles`
  - [ ] Slide 4 → `/road-trips`
- [ ] Previous / Next arrows work
- [ ] Navigation dots: current dot is wider + gold-gradient fill, others are translucent white
- [ ] Clicking a dot or arrow pauses auto-advance for ~10 seconds, then resumes
- [ ] Gold progress bar fills across the bottom as the current slide plays
- [ ] "Shop now" bouncing CTA sits above the carousel bottom; clicking it smooth-scrolls to the `#collections-grid` section
- [ ] Aspect ratio: 4:3 on mobile, 16:9 on desktop (no letterboxing or image crop surprises)

### How to Test:

1. Go to the homepage (prod: https://highway420store.com, or local dev on whatever port is running).
2. Watch one full auto-advance cycle — confirm 4 unique slides and 6-second timing.
3. Click each slide in turn and verify it lands on the href above.
4. Use the arrows and dots; confirm the 10-second pause after interaction.
5. Click the "Shop now" chevron and confirm the page scrolls to Collections.

---

## 2. 🏺 BONGS PAGE

### Test Items:

- [ ] Page loads without errors
- [ ] Products display in grid
- [ ] **NO ZigZag papers** or rolling papers appear
- [ ] **NO nicotine products** appear
- [ ] Only bongs/water pipes/beakers show
- [ ] Product images display (after RLS fix)
- [ ] Product names, prices, brands show
- [ ] Filters work (brands, materials, price)
- [ ] Sort options work (price, name, newest)
- [ ] Pagination works
- [ ] View toggles (4 col grid, 3 col grid, 2 col grid/list) works

### Expected Products:

- ✅ ROOR Zeaker 9mm Beaker
- ✅ ROOR Zeaker 5mm Beaker
- ✅ WP RG Beaker products
- ❌ ZIG ZAG papers (should NOT appear)
- ❌ Nicotine pouches (should NOT appear)

### How to Test:

1. Go to: https://highway420store.com/bongs
2. Scroll through products
3. Verify first product is NOT ZigZag papers
4. Check filters and sorting
5. Test pagination
6. Check Toggles

---

## 3. 🏷️ BRAND PAGES

### Test Items:

- [ ] /brands/roor loads (no 404)
- [ ] /brands/puffco loads
- [ ] /brands/cookies loads
- [ ] /brands/crave loads
- [ ] Products display for each brand
- [ ] Brand logo/header shows
- [ ] Product images display
- [ ] Filters work

### How to Test:

1. Go to: http://localhost:3001/brands/roor
2. Verify page loads (not 404)
3. Check products display
4. Test other brand pages

---

## 4. 🖼️ PRODUCT IMAGES

### Test Items:

- [ ] **RLS policy applied in Supabase** (CRITICAL!)
- [ ] Product images load on bongs page
- [ ] Product images load on brand pages
- [ ] Product images load on products page
- [ ] No 400 Bad Request errors in console
- [ ] Images optimize properly (Next.js Image)
- [ ] Placeholder shows for products without images

### How to Test:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to /bongs
4. Check for image requests
5. Verify no 400 errors
6. Images should load from: `https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/...`

### If Images Don't Load:

**YOU MUST APPLY RLS POLICY FIRST!**
See: `docs/URGENT_FIXES_SUMMARY.md` Issue #1

---

## 5. 🚫 NICOTINE PRODUCT FILTERING

### Test Items:

- [ ] No nicotine pouches on main site
- [ ] No e-liquid products on main site
- [ ] No vape juice on main site
- [ ] No cigarette papers on main site
- [ ] Products page excludes nicotine
- [ ] Bongs page excludes nicotine
- [ ] Search excludes nicotine

### Products That Should NOT Appear:

- ❌ NU - NIC POUCH products
- ❌ CRAVE E-LIQUID products
- ❌ ZYN NIC POUCH products
- ❌ LUCY NIC POUCH products
- ❌ Any product with "NICOTINE" in name

### How to Test:

1. Go to /products
2. Search for "nicotine" - should return 0 results
3. Go to /bongs - no nicotine products
4. Check database flags are set

### If Nicotine Products Appear:

**YOU MUST RUN SQL TO FLAG THEM!**
See: `scripts/flag-nicotine-products.sql`

---

## 6. 🔍 SEARCH & FILTERS

### Test Items:

- [ ] Search bar in masthead works
- [ ] Search returns relevant results
- [ ] Search excludes nicotine products
- [ ] Filters work on product pages
- [ ] Category filters work
- [ ] Brand filters work
- [ ] Price range filters work
- [ ] "In Stock" filter works

### How to Test:

1. Use search bar in header
2. Search for "bong" - should show bongs
3. Search for "roor" - should show ROOR products
4. Search for "nicotine" - should show 0 results
5. Apply filters and verify results

---

## 7. 📱 MOBILE RESPONSIVENESS

### Test Items:

- [ ] Homepage carousel works on mobile
- [ ] Navigation menu works on mobile
- [ ] Product grids responsive
- [ ] Images load on mobile
- [ ] Filters accessible on mobile
- [ ] Cart icon visible
- [ ] Search bar works

### How to Test:

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test iPhone/Android sizes
4. Navigate through pages
5. Test all interactions

---

## 8. 🎨 DESIGN & BRANDING

Current brand system (see [`globals.css`](../app/globals.css), [`GlobalMasthead.tsx`](../app/components/GlobalMasthead.tsx), [`tailwind.config.ts`](../tailwind.config.ts)):

| Token | Value | Usage |
| --- | --- | --- |
| `--hw-forest-dark → --hw-forest` | `#145C3C → #1B7A4D` gradient | Masthead header |
| `--dg-green` / lime | `#52C41A` (bright `#63D420`, dark `#3DA614`) | All CTAs, accents, hover states |
| Ink neutrals | `#2A2B2A`, `#6B6B6B` | Body text |
| Body background | `#FFFFFF` / `#F5F5F5` alternating | Section shells |

### Test Items:

- [ ] Shield logo loads in the masthead (Supabase `Shield_Logo2.png` on mobile, `Aged Logo-Transparent.png` on desktop) and is vertically centered
- [ ] Masthead background is the **dark-forest gradient** (`#145C3C → #1B7A4D`) — **no black, no orange** anywhere in the header
- [ ] Double-rule navbar bottom border (thick outer white line + thin inner line) is visible under the nav links
- [ ] Primary CTAs (Add to Cart, Pay, View Details outline, etc.) use **lime green `#52C41A`** (gradient `#63D420 → #52C41A` on filled buttons)
- [ ] **No teal green** (`#5EB499`, `#5BAD52`, `#4A9442`, `#4C9141`) appears on headers, hero sections, buttons, or colored tabs
- [ ] Search bar button uses lime green gradient (not teal) with a matching darker hover
- [ ] Category-grid hover state: border turns lime, name text turns lime, arrow appears in lime
- [ ] Profile-modal avatar circle is lime, not the old `#4C9141`
- [ ] Masthead is consistent across every page (landing, `/bongs`, `/brands/*`, `/checkout/*`, product detail, etc.)
- [ ] Fonts load correctly:
  - [ ] **Fira Sans** is the primary UI font (body, nav, product cards, buttons)
  - [ ] **Bebas Neue** renders hero titles like "HOT PRODUCTS" / section display text
  - [ ] **Chalets** / **Twilight** / **Juicy-Fills** only appear where explicitly scoped (collection labels, decorative headers) — not globally
- [ ] Dark mode: project is light-mode only for launch; if `.dark` class gets applied somewhere, confirm it doesn't break the green masthead or lime CTAs

### How to Test:

1. Load the homepage and inspect the masthead gradient with DevTools (confirm `linear-gradient(to bottom, #145C3C, #1B7A4D)`).
2. Hover a product's "Add to Cart" button — confirm the lime gradient and box-shadow glow.
3. Search the DOM for `#5BAD52`, `#5EB499`, `#4A9442`, `#4C9141` — expect **zero matches** on the landing page.
4. Open the profile modal (account icon → the avatar badge should be lime).
5. Sanity-check the same masthead on `/bongs`, `/brands/roor`, `/cart`, `/checkout/shipping`, `/order-confirmation/[id]`.

---

## 9. ⚡ PERFORMANCE

### Test Items:

- [ ] Pages load quickly (< 3 seconds)
- [ ] Images optimize properly
- [ ] No console errors
- [ ] No 404 errors
- [ ] No 400 errors (after RLS fix)
- [ ] Smooth scrolling
- [ ] Smooth animations

### How to Test:

1. Open DevTools Console
2. Navigate through pages
3. Check for errors (red text)
4. Check Network tab for failed requests
5. Test page load times

---

## 10. 🔗 NAVIGATION & LINKS

### Test Items:

- [ ] All navigation links work
- [ ] Footer links work
- [ ] Product links work
- [ ] Brand links work
- [ ] Category links work
- [ ] Cart icon works
- [ ] Account icon works
- [ ] No broken links (404s)

### How to Test:

1. Click every link in navigation
2. Click footer links
3. Click product cards
4. Verify all pages load

---

## 🚨 CRITICAL PRE-LAUNCH TASKS

Both of the SQL tasks below were applied earlier in the project. They are
kept as **verification steps** — confirm they're still in place, and only
re-run the SQL if the check fails.

1. **Verify the Supabase Storage RLS policy is present** (1 minute)

   Expected policy:

   ```sql
   CREATE POLICY "Public read access for products"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'products');
   ```

   - Open the Supabase SQL editor:
     https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new
   - Run:
     ```sql
     SELECT policyname FROM pg_policies
      WHERE schemaname = 'storage' AND tablename = 'objects';
     ```
   - The `Public read access for products` policy should be listed.
     If it is **missing**, re-apply the `CREATE POLICY` SQL above.
   - Spot-check by loading a `/bongs` product on the live site — no
     400s in the Network tab.

2. **Verify nicotine products are flagged** (2 minutes)
   - Source: [`scripts/flag-nicotine-products.sql`](../scripts/flag-nicotine-products.sql).
   - Run in the Supabase SQL editor:
     ```sql
     SELECT count(*) FROM products
      WHERE is_nicotine = true AND is_active = true;
     ```
   - Then make sure no nicotine product leaks through the main catalog:
     ```sql
     SELECT name FROM products
      WHERE is_active = true
        AND (name ILIKE '%nicotine%' OR name ILIKE '%nic pouch%' OR name ILIKE '%zyn%' OR name ILIKE '%lucy%')
      LIMIT 20;
     ```
   - If the second query returns rows, re-run `flag-nicotine-products.sql`.

3. **Test Everything** (15 minutes)
   - Go through this checklist top to bottom.
   - Test on desktop and mobile.
   - Check for errors in the browser console and server logs.

---

## 11. 💳 KAJAPAY CUSTOM PAYMENT PAGE (PRODUCTION CUTOVER)

**Goal:** move from sandbox (`KAJAPAY_ENVIRONMENT=sandbox`, slug `TestXYZ123`)
to the production KajaPay slug with the Highway 420 custom payment page
uploaded and live.

### 4.1 Upload the custom Payment Page template

- [ ] Open KajaPay merchant dashboard, navigate to the Payment Page editor
      for the production slug.
- [ ] Paste/upload [.superdesign/design_iterations/kajapay_payment_page_1_1.html](../.superdesign/design_iterations/kajapay_payment_page_1_1.html).
- [ ] Confirm KajaPay's token syntax matches the `{{amount}}` / `{{invoice}}`
      / `{{subtotal}}` / `{{shipping}}` / `{{tax}}` / `{{description}}` /
      `{{customer_email}}` placeholders in the file — if different, run a
      single find/replace before save.
- [ ] If the dashboard strips `<script>` or external `<link>`, remove the
      cosmetic JS block and the Google Fonts link (system-font fallback
      is already wired in `--font-stack`).
- [ ] Verify the shield logo loads from the Supabase CDN URL in the
      masthead; base64-inline it if the dashboard blocks external images.
- [ ] Preview the rendered page inside the dashboard — brand continuity
      check (forest header, lime CTA, Fira Sans, shield logo top-left).

### 4.2 Production credentials & env vars

- [ ] Swap sandbox values out of `.env.local` and the production env
      (Vercel / deployment target):
  - [ ] `KAJAPAY_ENVIRONMENT=production`
  - [ ] `KAJAPAY_SOURCE_KEY=` ← new prod key
  - [ ] `KAJAPAY_PASSWORD=` ← new prod PIN/password
  - [ ] `KAJAPAY_PAYMENT_PAGE_SLUG=` ← new prod slug
  - [ ] `KAJAPAY_WEBHOOK_SECRET=` ← new prod secret
- [ ] Confirm [lib/services/kajapay/client.ts](../lib/services/kajapay/client.ts)
      builds with new env values and points at the production host.
- [ ] Redeploy so the app picks up the new env.

### 4.3 Redirect & webhook wiring

- [ ] Approve redirect → `https://highway420.com/order-confirmation/{{invoice}}`
- [ ] Decline redirect → `https://highway420.com/checkout/error`
- [ ] Webhook URL → `https://highway420.com/api/kajapay/webhook`
- [ ] Webhook secret matches the `KAJAPAY_WEBHOOK_SECRET` env var — sign
      a test event and confirm signature verification passes in
      [app/api/kajapay/webhook/route.ts](../app/api/kajapay/webhook/route.ts).

### 4.4 End-to-end test transaction

- [ ] Add a product to cart → Shipping → Review → Payment.
- [ ] Confirm `POST /api/checkout` returns a pay-link URL from the new
      slug and the browser is redirected to the custom page.
- [ ] Visual check on the hosted page: shield logo, lime CTA, order
      summary card populated with `{{invoice}}`, subtotal, tax, total.
- [ ] Pay with a KajaPay-approved test card ($0.50 minimum).
- [ ] Redirect lands on `/order-confirmation/[orderId]` with all data.
- [ ] Webhook fires → order status flips to `paid` → confirmation email
      sends via `lib/email-orders.ts`.
- [ ] Check `payment_transactions` row is inserted with auth code,
      masked PAN, AVS/CVV response codes.

### 4.5 Declined / cancelled flows

- [ ] Test a declined card → redirect lands on `/checkout/error` with
      the correct order id.
- [ ] Cart is preserved (not cleared on failure).
- [ ] Test explicit cancel / back from payment page → same error path.

### 4.6 Compliance & PCI hygiene

- [ ] Confirm NO analytics, tag managers, or trackers were injected
      into the uploaded template (keeps Highway 420 out of PCI scope).
- [ ] Confirm Highway 420 servers still never receive raw PAN — check
      `/api/checkout` payload logs do not contain card numbers.
- [ ] Age-gate / THCA zip restrictions still run in
      [`/api/checkout`](../app/api/checkout/route.ts) BEFORE the pay-link
      is generated.

### 4.7 Chrome extension live-assist

If stuck inside the KajaPay dashboard, open the Claude Chrome Extension
and paste the prompt from
[.superdesign/design_iterations/kajapay_chrome_assistant_prompt.md](../.superdesign/design_iterations/kajapay_chrome_assistant_prompt.md).
It briefs Claude on the slug, token map, redirect URLs, and the specific
upload/validation questions to answer against the live dashboard UI.

### How to test

1. Use the staging env with the production slug first if KajaPay
   supports it; otherwise schedule the cutover during low-traffic hours.
2. Keep the sandbox `TestXYZ123` slug configured on a non-prod branch
   so regression tests against sandbox still work.
3. After the first live transaction clears, refund it via the KajaPay
   dashboard to verify the refund path and
   [`/api/kajapay/webhook`](../app/api/kajapay/webhook/route.ts)
   `transaction.refunded` handler.

---

## ✅ LAUNCH READY CRITERIA

Your site is ready to demo when:

- ✅ Carousel shows images without text
- ✅ Bongs page shows only bongs (no papers)
- ✅ Brand pages load without 404
- ✅ Product images display (RLS policy applied)
- ✅ No nicotine products on main site (flags set)
- ✅ No console errors
- ✅ Mobile responsive
- ✅ All links work
- ✅ KajaPay production slug live, custom Payment Page uploaded,
  test transaction + webhook + refund all pass

---

## 📞 TROUBLESHOOTING

### Images Not Loading?

→ Apply RLS policy (see Critical Task #1)

### ZigZag Papers Still Showing?

→ Already fixed in code, refresh page

### Nicotine Products Showing?

→ Run flag-nicotine-products.sql (see Critical Task #2)

### Brand Pages 404?

→ Already fixed, refresh page

### Console Errors?

→ Check browser DevTools Console (F12)
→ Share error messages for help

---

**Good luck with your demo! 🚀**
