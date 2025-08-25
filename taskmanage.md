# Task Management (Consolidated)

Status: Active (2025-08-25)

## Priority Order
1) Checkout_atomic RPC and API integration
2) Design system + component enhancements (Nike-inspired industrial aesthetic)
3) Product Detail Page (PDP)
4) Collection pages with search/filter/sort
5) Docs consolidation

## Completed Today
- Added checkout_atomic PostgreSQL function (supabase/functions/checkout_atomic.sql)
- Updated storage interface and SupabaseStorage to expose checkoutAtomic()
- Updated POST /api/checkout to use atomic path when available
- Scaffolded PDP and Products listing with initial design components

## In Progress
- Visual design polish (textures, typography scale, motion)
- Filters: advanced facets (price, brand, material, availability), pagination

## Next Steps
- Hook up global search endpoint and client-side search UI
- Implement quick view modal for ProductCard
- Add API sorting and server-side pagination (cursor or page+limit)
- Create collection routes: /products/glass-pipes, /products/bongs, /products/dab-rigs, /products/accessories
- Write unit tests for checkoutAtomic integration and listing filters

## Notes
- Zoho/KajaPay/ShipStation remain opt-in; health endpoints exist. Add real integration after checkout is stable.

