# 🎯 Airtable → Supabase Field Mapping Strategy

## Overview
This document outlines the comprehensive field mapping strategy for syncing rich product data from Airtable to Supabase, ensuring a human-centric, intuitive e-commerce experience with proper compliance handling for high-risk products.

## 📋 Website Data Requirements Analysis

### **Product Card Requirements** (From UniversalProductCard, ProductCard components)
**Essential Fields:**
- `id`, `name`, `price`, `sku`
- `image_url` (primary image)
- `brand_id` (for brand display)
- `category_id` (for categorization)
- `stock_quantity` (for availability)
- `featured` (for highlighting)
- `vip_exclusive` (for membership items)

**Enhanced UX Fields:**
- `short_description` (for quick overview)
- `materials` (for material badges)
- `is_active` (for visibility control)
- `nicotine_product` (for compliance filtering)

### **Product Detail Page Requirements** (From ProductDetailsPage, SimpleProductPage)
**Rich Content Fields:**
- `description` (full product description)
- `description_md` (markdown formatted)
- `image_urls` (multiple product images)
- `video_urls` (product videos)
- `specs` (technical specifications)
- `attributes` (product attributes)

**Compliance & Safety:**
- `lab_test_url` (certificate of analysis)
- `batch_number` (for tracking)
- `expiration_date` (for perishable items)
- `requires_lab_test` (compliance flag)
- `nicotine_product` (age-restricted items)
- `tobacco_product` (tobacco classification)

**Enhanced Product Info:**
- `weight_g` (product weight)
- `dim_mm` (dimensions)
- `materials` (material composition)
- `compare_at_price` (for sale indicators)
- `vip_price` (member pricing)

### **Featured Products & Recommendations**
**Discovery Fields:**
- `featured` (homepage features)
- `is_new` (new arrivals)
- `is_sale` (sale items)
- `vip_exclusive` (member exclusives)
- `channels` (main site vs VIP site)

## 🛡️ Compliance Strategy for High-Risk Products

### **Product Classification System**
```typescript
// High-risk product detection logic
const HIGH_RISK_KEYWORDS = {
  kratom: ['kratom', 'mitragyna', 'speciosa'],
  thca: ['thca', 'thc-a', 'tetrahydrocannabinolic acid'],
  delta8: ['delta 8', 'delta-8', 'd8', 'delta8'],
  delta10: ['delta 10', 'delta-10', 'd10', 'delta10'],
  nicotine: ['nicotine', 'tobacco', 'cigarette', 'vape'],
  '7hydroxy': ['7-hydroxy', '7hydroxymitragynine', '7-oh']
};
```

### **Compliance Fields Required**
- `nicotine_content` (mg/ml for nicotine products)
- `nicotine_type` (freebase, salt, synthetic)
- `age_restriction` (18 or 21+)
- `restricted_states` (array of banned states)
- `restricted_zipcodes` (specific zip code restrictions)
- `requires_id_verification` (boolean)
- `warning_labels` (required warning text)
- `lab_testing_required` (boolean)
- `batch_tracking_required` (boolean)

## 📊 Recommended Airtable Base Structure

### **Core Product Information**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Product Name` | `name` | Text | ✅ | Primary product identifier |
| `SKU` | `sku` | Text | ✅ | Unique product code |
| `Short Description` | `short_description` | Long Text | ⚠️ | Product card summary |
| `Full Description` | `description` | Long Text | ⚠️ | Detail page content |
| `Price` | `price` | Number | ✅ | Base selling price |
| `Compare At Price` | `compare_at_price` | Number | ⚠️ | Original price for sales |
| `VIP Price` | `vip_price` | Number | ⚠️ | Member discount price |

### **Organization & Categorization**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Brand` | `brand_id` | Single Select | ✅ | Product brand |
| `Category` | `category_id` | Single Select | ✅ | Product category |
| `Subcategory` | `subcategory` | Text | ⚠️ | Detailed classification |
| `Tags` | `tags` | Multiple Select | ⚠️ | Search and filtering |

### **Physical Product Details**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Primary Image` | `image_url` | Attachment | ⚠️ | Main product photo |
| `Additional Images` | `image_urls` | Multiple Attachments | ⚠️ | Product gallery |
| `Product Video` | `video_urls` | URL | ⚠️ | Product demonstration |
| `Materials` | `materials` | Multiple Select | ⚠️ | Material composition |
| `Weight (g)` | `weight_g` | Number | ⚠️ | Product weight |
| `Dimensions` | `dim_mm` | Text | ⚠️ | Size specifications |

### **Technical Specifications**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Height` | `height` | Text | ⚠️ | Product dimensions |
| `Joint Size` | `joint_size` | Text | ⚠️ | Compatibility info |
| `Percolator` | `percolator` | Text | ⚠️ | Feature details |
| `Specifications` | `specs` | JSON/Long Text | ⚠️ | Technical details |

### **Compliance & Safety**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Product Type` | `nicotine_product` | Checkbox | ✅ | Nicotine classification |
| `Tobacco Product` | `tobacco_product` | Checkbox | ✅ | Tobacco classification |
| `Age Restriction` | `age_restriction` | Number | ⚠️ | 18+ or 21+ |
| `Restricted States` | `restricted_states` | Multiple Select | ⚠️ | Shipping restrictions |
| `Lab Test Required` | `requires_lab_test` | Checkbox | ⚠️ | Compliance requirement |
| `Lab Test URL` | `lab_test_url` | URL | ⚠️ | COA document |
| `Batch Number` | `batch_number` | Text | ⚠️ | Lot tracking |
| `Expiration Date` | `expiration_date` | Date | ⚠️ | Product expiry |

### **Business Logic Fields**
| Airtable Field | Supabase Field | Type | Required | Purpose |
|---|---|---|---|---|
| `Featured Product` | `featured` | Checkbox | ⚠️ | Homepage promotion |
| `New Arrival` | `is_new` | Checkbox | ⚠️ | New product badge |
| `VIP Exclusive` | `vip_exclusive` | Checkbox | ⚠️ | Member-only items |
| `Stock Quantity` | `stock_quantity` | Number | ⚠️ | Inventory level |
| `Active` | `is_active` | Checkbox | ✅ | Product visibility |

## 🎨 Human-Centric Design Considerations

### **Search & Discovery**
- **Intuitive Naming**: Product names should be descriptive and searchable
- **Rich Descriptions**: Short descriptions for quick scanning, full descriptions for details
- **Visual Hierarchy**: Primary image should be high-quality and representative
- **Clear Pricing**: Multiple price points (regular, VIP, sale) clearly displayed

### **Compliance-First UX**
- **Age Verification**: Automatic detection and appropriate restrictions
- **State Restrictions**: Clear messaging about shipping limitations
- **Warning Labels**: Prominent display of required warnings
- **Lab Results**: Easy access to certificates of analysis

### **Mobile-First Experience**
- **Image Optimization**: Fast-loading, properly sized images
- **Progressive Disclosure**: Show essential info first, details on demand
- **Touch-Friendly**: Easy quantity selection and cart addition
- **Clear CTAs**: Prominent "Add to Cart" buttons

## 🚀 Implementation Priority

### **Phase 1: Core Functionality** (Day 1)
1. ✅ **Airtable API Client** - Connection and basic fetching
2. **Schema Analysis** - Understand your actual Airtable structure
3. **Basic Field Mapping** - Core product information
4. **Image Sync** - Primary product images

### **Phase 2: Enhanced Features** (Day 2)
1. **Rich Content Sync** - Descriptions, specifications, videos
2. **Compliance Mapping** - Age restrictions, state limitations
3. **Advanced Categorization** - Brands, categories, tags
4. **Inventory Sync** - Stock levels and availability

### **Phase 3: Polish & Testing** (Day 2.5)
1. **Data Validation** - Ensure data quality and consistency
2. **Performance Optimization** - Efficient syncing and loading
3. **Error Handling** - Robust error management
4. **Monitoring Setup** - Sync status and health checks

## 📋 Next Steps

1. **Test Airtable Connection** - Verify API access and permissions
2. **Analyze Your Base Structure** - See what fields you actually have
3. **Create Custom Mapping** - Adapt this strategy to your specific data
4. **Implement Sync Logic** - Build the actual data transformation
5. **Test End-to-End** - Verify data flows correctly to website

This strategy ensures we capture ALL necessary information for a world-class, compliant e-commerce experience while maintaining the flexibility to adapt to your specific Airtable structure.
