# Catalog Schema Foundation

This document summarizes the new product-catalog building blocks introduced in the `20250130_product_catalog_foundation` migration. The goal is to unlock richer merchandising, faceted navigation, and ingestion workflows without disrupting the existing storefront while data backfills are underway.

## Product hierarchy and sources
- **`product_types`** adds a first-class merchandising taxonomy with room for compliance defaults and custom facet presets.
- **`product_type_relationships`** stores adjacency information so we can build multi-level navigation trees without repeated recursive queries.
- **`product_sources`** and **`product_source_items`** record where each product or variant originated (Zoho, Airtable, manual upload, etc.), providing lineage for troubleshooting sync jobs.

## Variants, options, and attributes
- **`product_variants`** models purchasable units (size, strain, color) separately from the parent product, enabling accurate inventory, pricing, and availability tracking.
- **`variant_inventory`** tracks stock by warehouse for each variant.
- **`product_option_definitions`, `product_option_values`, and `variant_option_values`** describe selectable options that power PDP pickers and storefront filters.
- **`attribute_definitions`** and **`attribute_values`** normalize structured specifications so we can expose consistent filters (e.g., THC percentage, coil type) without embedding everything in JSON blobs.

## Media enrichment
- `product_media` gains metadata columns (`media_kind`, `storage_bucket`, `colorway`, `tags`, etc.) to differentiate hero, gallery, swatch, and document assets.
- **`variant_media`** links assets to specific variants for colorways or bundle shots.
- **`asset_collections`** and **`asset_collection_members`** support marketing-curated media sets (e.g., lifestyle galleries) that can be reused across PDPs.

## Merchandising and discovery
- **`product_badges`** and **`product_badge_assignments`** allow marketing callouts like “Limited Drop” or “Online Exclusive” without mutating the product rows.
- **`product_search_index`** provides a dedicated home for generated full-text vectors and ranking scores that can be refreshed asynchronously.
- **`product_facets`** stores the denormalized payload the storefront needs for snappy filter responses, keeping expensive joins out of the request path.

## Product table enhancements
The `products` table now references `product_types`, tracks publication status/timing, stores a pointer to its default variant, and captures merchandising tags along with a `tsvector` column ready for search indexing.

## Next steps
1. **Backfill data:** hydrate `product_types`, create default variants for existing SKUs, and populate the new attribution tables during the next ingestion run.
2. **API updates:** adjust catalog queries to leverage `product_variants`, `product_facets`, and the enriched media metadata.
3. **Search pipeline:** populate `product_search_index` and `products.search_vector`, adding triggers or ETL jobs once the first sync completes.
4. **Operational tooling:** expose management UI for product types, option definitions, and badge assignments so merchandising teams can self-serve updates.

These additions lay the groundwork for responsive filtering and richer media experiences while maintaining backward compatibility with the current storefront implementation.
