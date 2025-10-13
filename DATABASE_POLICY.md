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

## **IS_ACTIVE FILTERING POLICY**

### **⚠️ CRITICAL NOTICE:**
**DO NOT filter by `is_active` field until Zoho Inventory is reconnected and synced.**

**Current State:** Manual inventory management phase
**Zoho Status:** Disconnected (will be reconnected later)
**Sync Status:** Not yet performed

### **✅ CURRENT CORRECT PATTERN:**
```javascript
// ✅ CORRECT - No is_active filtering during manual phase
const { data, error } = await supabase
  .from('main_site_products')
  .select('*')
  // Note: NO .eq('is_active', true) filter
```

### **🚫 FORBIDDEN UNTIL ZOHO SYNC:**
```javascript
// ❌ WRONG - Do NOT use until Zoho is synced
const { data, error } = await supabase
  .from('main_site_products')
  .select('*')
  .eq('is_active', true)  // REMOVE THIS LINE
```

## **RECONNECTION PROCEDURE**

When Zoho Inventory is reconnected:

1. **Notify all developers** of the reconnection
2. **Run complete inventory sync** from Zoho to main_site_products
3. **Add `is_active` filtering** back to all queries
4. **Update this document** to reflect the change

## **COMPLIANCE CHECKLIST**

Before committing any database-related changes:

- [ ] Uses `main_site_products` table only
- [ ] Does NOT filter by `is_active` field
- [ ] Includes comment explaining the manual inventory phase
- [ ] Follows the patterns shown in ✅ CORRECT sections above

## **VIOLATION CONSEQUENCES**

Code that violates this policy:
- **Will be immediately reverted**
- **May cause product display issues**
- **Could break the site functionality**
- **Will require immediate correction**

## **MAINTENANCE NOTES**

This policy is in effect during the manual inventory management phase. All product data should be managed through the `main_site_products` table until Zoho Inventory integration is restored.

**Last Updated:** October 13, 2025
**Policy Owner:** Development Team
**Review Date:** When Zoho integration is restored

---

*This document must be referenced in all PR descriptions that touch product data.*
