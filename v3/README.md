# V3 — "Asphalt Americana" / Wood-Grain Dark Theme

Snapshot taken: 2026-04-20

This folder preserves the Highway 420 **v3 design** — the dark, vintage road-trip aesthetic
("Asphalt Americana") before the DankGeek-inspired white headshop redesign was applied.

## What's in here

| File | Role |
|---|---|
| `GlobalMasthead.tsx` | Dark wood-grain masthead with shield logo, category road-sign badges, inset search bar |
| `page.tsx` | Homepage layout: dark bg `#0D0D0B`, vintage-map CollectionsGrid, gold dividers |
| `globals.css` | Design tokens: Bebas Neue headings, Twilight/Chalets fonts, highway-green accent |
| `CollectionsGrid.tsx` | Category grid with vintage map background texture |
| `FeaturedProductsSection.tsx` | "Hot Products" section with dark styling |
| `NewProductsSection.tsx` | New arrivals section with dark styling |
| `UniversalProductCard.tsx` | Product card component — dark variant |
| `DopeDealsSection.tsx` | Deals/sale section |
| `TrustedBrandsBulletin.tsx` | Brands marquee |
| `SpotlightReviews.tsx` | "High Praise" reviews section |
| `AboutHighway420.tsx` | About/footer section |

## To restore v3

Copy any of these files back to their original location in `app/`:

```powershell
# Restore full v3 design
Copy-Item v3\GlobalMasthead.tsx  app\components\GlobalMasthead.tsx  -Force
Copy-Item v3\page.tsx            app\page.tsx                       -Force
Copy-Item v3\globals.css         app\globals.css                    -Force
Copy-Item v3\CollectionsGrid.tsx app\components\CollectionsGrid.tsx -Force
# ... repeat for other files as needed
```
