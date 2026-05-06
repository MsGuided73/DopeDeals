# 🚨 CRITICAL DATABASE POLICY - READ BEFORE MAKING CHANGES

## **ONLY USE main_site_products TABLE FOR PRODUCT DATA**

### **⚠️ STRICT REQUIREMENT:**
**ALL product queries MUST use the `main_site_products` table exclusively.**
**NO EXCEPTIONS until Zoho Inventory is reconnected and synced.**

### **❌ PROHIBITED TABLES:**
- `products` (legacy/deprecated)
- `products_compat` (legacy/deprecated)
- Any other product-related tables except `main_site_products`

### **✅ APPROVED DATA SOURCE:**
```javascript
// ✅ CORRECT - Use this pattern
const { data, error } = await supabase
  .from('main_site_products')
  .select('*')
```

### **🚫 FORBIDDEN PATTERNS:**
```javascript
// ❌ WRONG - Do NOT use these
const { data, error } = await supabase
  .from('products')  // DEPRECATED

const { data, error } = await supabase
  .from('products_compat')  // DEPRECATED
```

## **IS_ACTIVE FILTERING POLICY** (UPDATED 2026-05-05)

### **POLICY REVERSAL:**
**ALL customer-facing product LIST queries MUST filter `.eq('is_active', true)`.**

**Reason for change:** The original "do-not-filter" rule existed to prevent hiding live SKUs while Zoho was disconnected. With the import process now actively staging products into `main_site_products` (many with empty prices/descriptions/images), we need `is_active` to act as the publish toggle — products are activated only when they're complete and ready to sell. Filtering on it prevents in-progress imports from appearing on the storefront.

### **✅ REQUIRED PATTERN (customer-facing list queries):**
```javascript
const { data, error } = await supabase
  .from('main_site_products')
  .select('*')
  .eq('is_active', true)  // REQUIRED on all customer-facing list endpoints
```

### **WHERE TO APPLY IT:**
- Every route under `app/api/products/*` (category lists, search, featured, dope-deals, newest)
- The `ProductService.getProducts` / `getProductCount` helpers in `lib/product-service.ts`

### **WHERE NOT TO APPLY IT:**
- `app/api/products/[id]/route.ts` (PDP — direct/bookmarked product links must keep working even if temporarily inactive)
- `app/api/cart/*`, `app/api/checkout/*` (cart hydration and checkout must succeed for items already in flight)
- `app/api/admin/*` (admin tooling needs to see all products, including incomplete ones, to fix them)

## **COMPLIANCE CHECKLIST**

Before committing any database-related changes:

- [ ] Uses `main_site_products` table only
- [ ] Customer-facing list queries filter `.eq('is_active', true)`
- [ ] Single-product / cart / admin queries do NOT filter `is_active`
- [ ] Customer-facing list queries also use `applyImageRequiredFilter()` from `lib/product-display-filters.ts`
- [ ] Follows the patterns shown in ✅ REQUIRED sections above

## **VIOLATION CONSEQUENCES**

Code that violates this policy:
- **Will be immediately reverted**
- **May cause product display issues**
- **Could break the site functionality**
- **Will require immediate correction**

## **MAINTENANCE NOTES**

This policy is in effect during the manual inventory management phase. All product data should be managed through the `main_site_products` table until Zoho Inventory integration is restored.

**Last Updated:** 2026-05-05 (is_active policy reversed; image-required filter introduced)
**Policy Owner:** Development Team
**Review Date:** When Zoho integration is restored

---

*This document must be referenced in all PR descriptions that touch product data.*
