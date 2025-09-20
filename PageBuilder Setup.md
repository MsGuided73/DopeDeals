# 🚀 **DOPE CITY Page Builder Setup Guide**

## **Overview**
This guide will help you set up the complete Visual Page Builder system for your DOPE CITY admin dashboard, including diagnosing and fixing Zoho image migration issues.

---

## **Phase 1: Diagnose Zoho Image Issues**

### **Step 1: Run the Diagnostic Script**

1. **Open PowerShell as Administrator**
2. **Navigate to your project directory**:
   ```powershell
   cd "C:\__DOPE CITY\DopeDeals"
   ```

3. **Run the debug command**:
   ```powershell
   npx tsx scripts/fix-zoho-image-download.ts debug
   ```

4. **Expected Output** - Look for:
   ```
   📊 Found X products to check
   📦 Product: [Product Name] (ID: 123456)
   📸 Images found: 2  ← This tells us if images exist
   ❌ No images found   ← This means no images in Zoho
   ```

### **Step 2: Test Image Download**

1. **Run the test command**:
   ```powershell
   npx tsx scripts/fix-zoho-image-download.ts
   ```

2. **Look for success/failure messages**:
   - ✅ = Working correctly
   - ❌ = Still has issues (we'll fix them)

**📝 Note Results Here:**
- Total products checked: ___
- Products with images: ___
- Download test result: ___

---

## **Phase 2: Set Up Page Builder Database**

### **Step 3: Apply Database Migration**

1. **Open Supabase Dashboard** in browser
2. **Go to SQL Editor**
3. **Open file**: `supabase/migrations/20250120_page_builder_schema.sql`
4. **Copy entire contents and paste into SQL Editor**
5. **Click "Run"**
6. **Verify Success**: Should see "Success. No rows returned"

### **Step 4: Seed Initial Data**

1. **In Supabase SQL Editor**
2. **Open file**: `supabase/seed/page_builder_seed.sql`
3. **Copy entire contents and paste into SQL Editor**
4. **Click "Run"**
5. **Verify data was inserted**:
   - Go to "Table Editor"
   - Check `design_themes` table has 3 rows
   - Check `component_library` table has sample components

**✅ Database Setup Complete**

---

## **Phase 3: Install Dependencies**

### **Step 5: Install Required Packages**

1. **In PowerShell (project directory)**:
   ```powershell
   npm install react-dnd react-dnd-html5-backend
   ```

2. **Wait for installation to complete**
3. **Verify installation**: Should see packages in `package.json`

**✅ Dependencies Installed**

---

## **Phase 4: Test Page Builder**

### **Step 6: Start Your Development Server**

1. **Run your Next.js app**:
   ```powershell
   npm run dev
   ```

2. **Open browser and navigate to**:
   ```
   http://localhost:3000/admin/page-builder
   ```

3. **You should see**:
   - Component library on the left
   - Canvas area in the middle
   - Tabs for Components, Data, Styles, Animations

### **Step 7: Test Basic Functionality**

1. **Click on a component** (like "Hero Section")
2. **It should appear on the canvas**
3. **Click the "Data" tab**
4. **Select "Products" as data source**
5. **You should see your product data**

**📝 Test Results:**
- Page loads: ✅ / ❌
- Components drag/drop: ✅ / ❌
- Data connection works: ✅ / ❌

---

## **Phase 5: Fix Any Issues**

### **Step 8: Common Troubleshooting**

**If Page Builder doesn't load:**
1. Check browser console for errors (F12)
2. Look for missing dependencies
3. Verify database tables exist

**If Data tab shows no data:**
1. Check Supabase connection
2. Verify your products table has data
3. Check RLS policies allow access

**If images don't show:**
1. This is expected - we're fixing this in the next phase

---

## **Phase 6: Image Migration (If Zoho Has Images)**

### **Step 9: Run Bulk Image Migration** (Only if Step 1 found images)

**If diagnostic found images in Zoho:**

1. **Start with small batch**:
   ```powershell
   curl -X POST http://localhost:3000/api/admin/migrate-zoho-media -H "Content-Type: application/json" -d '{\"limit\": 5}'
   ```

2. **Check the response** for success/failure
3. **If successful, increase batch size**:
   ```powershell
   curl -X POST http://localhost:3000/api/admin/migrate-zoho-media -H "Content-Type: application/json" -d '{\"limit\": 50}'
   ```

**📝 Migration Results:**
- Images found in Zoho: ___
- Successfully migrated: ___
- Failed migrations: ___

---

## **Phase 7: Alternative Image Strategy** (If No Zoho Images)

### **Step 10: Set Up Placeholder Images**

1. **Create placeholder images** for each category:
   - Save images in `public/images/placeholders/`
   - Name them: `bongs.jpg`, `dab-rigs.jpg`, `pipes.jpg`, etc.

2. **Update products with category-based images**:
   ```sql
   -- In Supabase SQL Editor
   UPDATE products 
   SET image_url = '/images/placeholders/bongs.jpg' 
   WHERE category_id = 'your-bongs-category-id';
   
   UPDATE products 
   SET image_url = '/images/placeholders/dab-rigs.jpg' 
   WHERE category_id = 'your-dab-rigs-category-id';
   ```

**✅ Placeholder Strategy Implemented**

---

## **Phase 8: Test Complete System**

### **Step 11: Create Your First Page**

1. **Go to Page Builder**: `http://localhost:3000/admin/page-builder`
2. **Add a Hero Section**:
   - Click "Hero Section" component
   - It appears on canvas
3. **Connect to Data**:
   - Click "Data" tab
   - Select "Products"
   - Add filter: `category = "bongs"`
4. **Style the Component**:
   - Click "Styles" tab
   - Change font size, colors, etc.
5. **Add Animation**:
   - Click "Animations" tab
   - Add "Fade In" animation
6. **Save the Page**:
   - Click "Save Draft"

### **Step 12: Verify Everything Works**

1. **Check database**:
   - Go to Supabase → `user_pages` table
   - Your page should be saved there

2. **Test data connection**:
   - Your components should show real product data

3. **Test styling**:
   - Changes should appear immediately on canvas

**✅ Page Builder Fully Functional**

---

## **📋 Completion Checklist**

Mark each as complete:

- [ ] **Step 1**: Ran diagnostic script
- [ ] **Step 2**: Tested image download
- [ ] **Step 3**: Applied database migration
- [ ] **Step 4**: Seeded initial data
- [ ] **Step 5**: Installed dependencies
- [ ] **Step 6**: Started dev server
- [ ] **Step 7**: Tested page builder loads
- [ ] **Step 8**: Fixed any issues
- [ ] **Step 9**: Migrated images (if available)
- [ ] **Step 10**: Set up placeholders (if needed)
- [ ] **Step 11**: Created first page
- [ ] **Step 12**: Verified everything works

---

## **🆘 Troubleshooting Reference**

### **Common Error Messages & Solutions**

**"Module not found: react-dnd"**
- Solution: Run `npm install react-dnd react-dnd-html5-backend`

**"Table 'page_templates' doesn't exist"**
- Solution: Re-run Step 3 (database migration)

**"No products found"**
- Solution: Check your products table has data and RLS policies

**"Failed to download image: 401"**
- Solution: Zoho token expired, refresh in admin dashboard

**"Cannot read properties of undefined"**
- Solution: Check browser console, usually missing data

### **File Locations Reference**

- **Database Migration**: `supabase/migrations/20250120_page_builder_schema.sql`
- **Seed Data**: `supabase/seed/page_builder_seed.sql`
- **Diagnostic Script**: `scripts/fix-zoho-image-download.ts`
- **Page Builder**: `app/admin/page-builder/page.tsx`
- **Components**: `app/admin/page-builder/components/`

### **Important URLs**

- **Page Builder**: `http://localhost:3000/admin/page-builder`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

---

## **🎯 Success Criteria**

**You'll know it's working when:**
1. ✅ Diagnostic script shows image status
2. ✅ Page builder loads without errors
3. ✅ You can drag/drop components
4. ✅ Data tab shows your products
5. ✅ Styling controls work
6. ✅ Pages save to database
7. ✅ Images display (either migrated or placeholders)

---

## **📞 Next Steps After Completion**

1. **Create your first product showcase page**
2. **Test with different component types**
3. **Experiment with animations and styling**
4. **Set up more placeholder images for categories**
5. **Consider implementing image upload workflow**

**Estimated Time**: 2-3 hours total

**Best Time to Do This**: When you have uninterrupted time and stable internet connection

---

**💡 Pro Tips:**
- Keep browser dev tools open (F12) to catch errors early
- Take screenshots of any error messages
- Test each phase before moving to the next
- Don't skip the diagnostic step - it's crucial for understanding your image situation
