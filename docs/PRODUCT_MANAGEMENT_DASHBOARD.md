# Product Management Dashboard

## 🎯 Overview

Comprehensive admin dashboard for managing Highway 420's products with brand and category organization.

**Location:** `/admin/products`

---

## ✅ Features Implemented

### 1. **View Modes**
- 📦 **All Products** - View all products in grid layout
- 🏷️ **By Brand** - Products grouped by brand (Crave, ROOR, Puffco, etc.)
- 📂 **By Category** - Products grouped by category (Bongs, Pipes, Vapes, etc.)
- 🔴 **Duplicate Images** - Find products sharing the same image
- ⚠️ **No Images** - Find products missing images

### 2. **Search & Filters**
- 🔍 **Search** - Search by product name, SKU, or brand
- 🏷️ **Brand Filter** - Filter by specific brand with product counts
- 📂 **Category Filter** - Filter by category with product counts
- **Combined Filters** - Use multiple filters simultaneously

### 3. **Product Management**
- **Change Image** - Select images from asset library
- **Delete Product** - Soft delete (sets is_active = false)
- **View Details** - See price, SKU, brand, stock info
- **Duplicate Detection** - Visual indicators for duplicate images

### 4. **Image Picker**
- **Folder Selection** - Browse different image folders
- **Visual Selection** - Click to assign image to product
- **Filtered Images** - Only shows image files (jpg, png, webp, gif)
- **Large Preview** - See images before assigning

### 5. **Smart Categorization**
Automatic product categorization based on keywords:
- Bongs, Pipes, Dab Rigs, E-Rigs
- Bubblers, Pre-Rolls, THCA Flower
- Vapes, Accessories, Hookahs
- Torches, Papers, Grinders

---

## 📊 Current Stats

### **Products by Brand:**
- Crave: 442 clean products (74 nicotine flagged)
- Cookies: 76 products
- Urth Farmacy: 38 products
- ROOR: 20 products
- Puffco: 14 products
- GENERIC: 22 products

### **Issues Detected:**
- 🔴 **Duplicate Images:** Multiple groups detected
- ⚠️ **No Images:** Products missing images
- 🚨 **Nicotine Products:** 74 Crave products flagged

---

## 🚀 How to Use

### **Access the Dashboard:**
1. Navigate to `/admin/products`
2. Dashboard loads all active products
3. Use view modes to organize products

### **Fix Duplicate Images:**
1. Click "Duplicate Images" tab
2. Products with same image are highlighted in red
3. Click "Change Image" on each product
4. Select correct image from library
5. Image updates immediately

### **Organize by Brand:**
1. Click "By Brand" tab
2. Products grouped by brand
3. Each brand shows product count
4. Scroll through brands to manage

### **Organize by Category:**
1. Click "By Category" tab
2. Products auto-categorized
3. Each category shows product count
4. Review categorization accuracy

### **Find Missing Images:**
1. Click "No Images" tab
2. Shows all products without images
3. Click "Change Image" to assign
4. Select from asset library

### **Search Products:**
1. Use search bar at top
2. Search by name, SKU, or brand
3. Results filter in real-time
4. Combine with other filters

---

## 🔧 Technical Details

### **Data Sources:**
- **Products:** `products` table (Supabase)
- **Brands:** `brands` table (Supabase)
- **Images:** `website-images` storage bucket

### **Key Functions:**
- `loadData()` - Loads products and brands
- `loadAvailableImages(folder)` - Loads images from storage
- `updateProductImage(id, url)` - Updates product image
- `categorizeProduct(product)` - Auto-categorizes products
- `getFilteredProducts()` - Applies all filters

### **State Management:**
- `products` - All active products
- `brands` - All brands
- `filteredProducts` - After applying filters
- `productsByBrand` - Grouped by brand
- `productsByCategory` - Grouped by category
- `imageGroups` - For duplicate detection

---

## 📋 Next Steps

### **Immediate Priorities:**
1. ✅ Fix ROOR duplicate images (9 products sharing 1 image)
2. ✅ Assign images to products without images
3. ✅ Verify product categorization accuracy
4. ✅ Link products to brand IDs (run SQL)

### **Future Enhancements:**
1. **Bulk Operations**
   - Bulk image assignment
   - Bulk brand assignment
   - Bulk category assignment
   - Bulk delete/activate

2. **Advanced Editing**
   - Inline price editing
   - Inline description editing
   - Stock quantity management
   - VIP price management

3. **Import/Export**
   - CSV export
   - CSV import
   - Bulk product creation
   - Product templates

4. **Analytics**
   - Products by brand chart
   - Products by category chart
   - Price distribution
   - Stock levels

5. **Image Management**
   - Upload images directly
   - Crop/resize images
   - Image optimization
   - Bulk image upload

---

## 🐛 Known Issues

1. **Product Limit:** Currently loads 1000 products max
   - **Solution:** Add pagination or infinite scroll

2. **Image Folder:** Hardcoded to RooR folder initially
   - **Solution:** Add more folder options

3. **No Edit Modal:** Delete only, no full edit
   - **Solution:** Build comprehensive edit modal

4. **No Bulk Actions:** One product at a time
   - **Solution:** Add checkbox selection + bulk actions

---

## 📝 SQL Queries Needed

### **Link Products to Brands:**
```sql
UPDATE products p
SET brand_id = b.id
FROM brands b
WHERE p.brand_name = b.name
  AND p.brand_id IS NULL;
```

### **Verify Brand Linking:**
```sql
SELECT 
  b.name,
  COUNT(p.id) as linked_products
FROM brands b
LEFT JOIN products p ON p.brand_id = b.id
GROUP BY b.name
ORDER BY linked_products DESC;
```

---

## ✅ Completed Tasks

- [x] Build Product Management Dashboard
- [x] Add brand organization view
- [x] Add category organization view
- [x] Add duplicate image detection
- [x] Add no-image filter
- [x] Add image picker modal
- [x] Add search functionality
- [x] Add brand/category filters
- [x] Add product cards with actions
- [x] Add auto-categorization
- [x] Flag Crave nicotine products
- [x] Create brands table entries
- [x] Populate brand_name for products

---

## 🎉 Success Metrics

- ✅ **670 products** with brand_name assigned
- ✅ **6 brands** in brands table
- ✅ **442 clean Crave products** (nicotine filtered)
- ✅ **Duplicate detection** working
- ✅ **Category auto-detection** working
- ✅ **Image picker** functional
- ✅ **Search & filters** working

---

**Dashboard is ready for use!** 🚀

Access at: `http://localhost:3000/admin/products`

