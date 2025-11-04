# 🧪 PRE-LAUNCH TESTING CHECKLIST

**Before showing the website, test these critical areas:**

---

## 1. 🎠 HOMEPAGE CAROUSEL

### Test Items:
- [ ] Carousel auto-advances every 5 seconds
- [ ] All 3 slides display correctly
- [ ] **NO TEXT** appears on any slide
- [ ] Images load properly:
  - [ ] Slide 1: PreWritten_DopeClub.jpg (VIP Club)
  - [ ] Slide 2: slide-us-0011-roortech.png (ROOR Tech)
  - [ ] Slide 3: Light-preroll.jpeg (Pre-Roll)
- [ ] No dark overlay on images
- [ ] Slides are clickable and navigate to correct pages:
  - [ ] Slide 1 → /rewards
  - [ ] Slide 2 → /bongs
  - [ ] Slide 3 → /pre-rolls
- [ ] Navigation dots work
- [ ] Previous/Next arrows work

### How to Test:
1. Go to homepage: http://localhost:3001
2. Wait and watch carousel auto-advance
3. Click each slide to verify links
4. Use navigation controls

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
- [ ] View toggle (grid/list) works

### Expected Products:
- ✅ ROOR Zeaker 9mm Beaker
- ✅ ROOR Zeaker 5mm Beaker
- ✅ WP RG Beaker products
- ❌ ZIG ZAG papers (should NOT appear)
- ❌ Nicotine pouches (should NOT appear)

### How to Test:
1. Go to: http://localhost:3001/bongs
2. Scroll through products
3. Verify first product is NOT ZigZag papers
4. Check filters and sorting
5. Test pagination

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

### Test Items:
- [ ] Highway 420 logo
- [ ] Logo fills title bar height
- [ ] Black title bar (no orange)
- [ ] Consistent masthead across pages
- [ ] Navigation bar styling consistent
- [ ] Orange accent colors used properly
- [ ] Dark mode works (if enabled)
- [ ] Fonts load correctly (Chalets, Inter)

### How to Test:
1. Check homepage masthead
2. Navigate to different pages
3. Verify consistent styling
4. Check logo sizing
5. Verify color scheme

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

### **MUST DO BEFORE DEMO:**

1. **Apply Supabase RLS Policy** (2 minutes)
   ```sql
   CREATE POLICY "Public read access for products"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'products');
   ```
   - Go to: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new
   - Paste and run the SQL above
   - **This will make ALL images display!**

2. **Flag Nicotine Products** (5 minutes)
   - Open: `scripts/flag-nicotine-products.sql`
   - Copy all SQL
   - Go to: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new
   - Paste and run
   - **This will hide nicotine products from main site!**

3. **Test Everything** (15 minutes)
   - Go through this checklist
   - Test on desktop and mobile
   - Check for errors in console

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

