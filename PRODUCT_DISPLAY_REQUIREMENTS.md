# Product Display Requirements - All Products Page

## Critical Requirements

### 1. **NEVER Limit Product Scanning**
- **ALWAYS** scan all 4,511 active products from the database
- **NEVER** implement any form of pagination or limiting at the database query level
- **NEVER** use `LIMIT` clauses that would prevent full inventory scanning
- All filtering must happen client-side after fetching the complete dataset

### 2. **Image Validation Filtering**
- From the complete 4,511 products, **filter out products without valid images**
- Only display products that have valid, working image URLs
- Products with `null`, empty, or broken image URLs must be excluded from display
- This filtering happens client-side after the full dataset is fetched

### 3. **Product Card Design**
- Use the same product card design as the pipes page (`PipesProductCard`)
- Features the distinctive Highway 420 green branding (#2d8f47)
- Highway Gothic font styling
- Premium card layout with proper spacing and visual hierarchy

## Implementation Notes

- Database query must fetch ALL active products without LIMIT
- Client-side filtering handles image validation
- UI maintains consistent branding across product pages
- Performance considerations: Large dataset (4,511 products) requires efficient client-side filtering
