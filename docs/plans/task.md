# Task List: Fix Image Display and Truncation

| Task | Status | Description |
| :--- | :---: | :--- |
| Research truncation root cause | [x] | Identified `split(',')` in API routes as the cause for broken Cookies/RooR images. |
| Identify path casing issue | [x] | Found that DB uses lowercase `/products/` but bucket uses uppercase `/PRODUCTS/`. |
| Create `image-utils.ts` | [x] | Centralized logic for smart URL parsing that ignores commas in filenames. |
| Update `app/api/dope-deals/route.ts` | [x] | Applied `normalizeProductImages` to deal results. |
| Update `app/api/search/route.ts` | [x] | Applied `parseImageUrls` to search results. |
| Update `app/api/newest/products/route.ts` | [x] | Applied `normalizeProductImages` to fresh drops. |
| Update `app/api/products/route.ts` | [x] | Applied `normalizeProductImages` to main product list. |
| Update category-specific API routes | [x] | All major routes updated to use the new image utility. |
| Bulk-fix database URLs casing | [x] | Fixed 128 products by changing `/products/` to `/PRODUCTS/` in two batches. |
| Verify image rendering in frontend | [x] | Confirmed RooR (Zeaker, etc.) and Cookies images are now visible on the live site. |
