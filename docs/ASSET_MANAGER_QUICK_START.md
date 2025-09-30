# Asset Manager Quick Start Guide

## 🔒 Security Status

```
┌─────────────────────────────────────────────────────────┐
│  🛡️  ASSET MANAGER SECURITY STATUS                      │
├─────────────────────────────────────────────────────────┤
│  ✅ Admin-Only Access                                   │
│  ✅ Multi-Layer Authentication                          │
│  ✅ Rate Limiting Enabled                               │
│  ✅ Input Validation Active                             │
│  ✅ Production Ready                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Access the Asset Manager

1. **Login as Admin**
   - Navigate to your site
   - Login with admin credentials
   - You'll be redirected to the admin dashboard

2. **Open Asset Manager**
   - Click "Asset Manager" in the sidebar (🖼️ icon)
   - Or navigate directly to `/admin/assets`

### Step 2: Upload Your First Asset

1. **Click "Upload Assets"** button (top right)
2. **Drag & drop** images or click "Choose Files"
3. **Select bucket:**
   - `products` - Product images
   - `website-images` - General website assets
   - `ads` - Marketing materials
4. **Wait for upload** to complete
5. **Done!** Your asset is now available

### Step 3: Use the Asset in Your Code

**Option 1: Copy URL (Quick)**
```
1. Find your asset in the grid
2. Click the "📋 Copy URL" button
3. Paste the URL in your code
```

**Option 2: Use Components (Recommended)**
```typescript
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  bucket="website-images"
  path="hero/cityscape.jpg"
  alt="City skyline"
  width={1200}
  height={600}
/>
```

---

## 📚 Common Tasks

### Upload Multiple Files
1. Click "Upload Assets"
2. Select multiple files (Ctrl/Cmd + Click)
3. All files upload with progress tracking

### Delete Assets
1. Select assets (checkbox on each)
2. Click "🗑️ Delete Selected"
3. Confirm deletion

### Search Assets
1. Use search bar in toolbar
2. Type asset name
3. Results filter in real-time

### Switch Buckets
1. Use bucket dropdown in toolbar
2. Select desired bucket
3. Assets reload automatically

---

## 🎓 Learn More

### View Examples
- Navigate to `/admin/assets/examples`
- See live code examples
- Copy and paste into your project

### Read Documentation
- **Full Guide:** `docs/ASSET_MANAGER.md`
- **Security:** `docs/ASSET_MANAGER_SECURITY.md`
- **Quick Reference:** Click 📖 button in asset manager

---

## 🔐 Security Features

### Who Can Access?
- ✅ **Admins Only** - Full access to asset manager
- ❌ **Regular Users** - Cannot access
- ❌ **Public** - Cannot access

### What's Protected?
- ✅ Asset manager interface
- ✅ Upload functionality
- ✅ Delete functionality
- ✅ All API endpoints

### Rate Limits
- **List Assets:** 100 requests/minute
- **Upload:** 20 files/minute
- **Delete:** 50 operations/minute

---

## ⚡ Pro Tips

### 1. Organize with Folders
Upload to specific folders for better organization:
```
website-images/
  ├── hero/
  ├── collections/
  ├── brands/
  └── logos/
```

### 2. Use Descriptive Names
Good: `hero-cityscape-night.jpg`  
Bad: `IMG_1234.jpg`

### 3. Optimize Before Upload
- Compress images before uploading
- Use appropriate dimensions
- Max file size: 10MB

### 4. Use Components
Always use `<OptimizedImage>` components instead of raw URLs for:
- Automatic optimization
- Responsive images
- Loading states
- Error handling

### 5. Check Examples
Visit `/admin/assets/examples` for:
- Live code examples
- Best practices
- Common patterns

---

## 🆘 Troubleshooting

### Can't Access Asset Manager
**Problem:** Redirected to home page  
**Solution:** Ensure you're logged in as admin

### Upload Fails
**Problem:** File won't upload  
**Solution:** Check:
- File size < 10MB
- File type is image
- Not exceeding rate limit (20/min)

### Image Not Loading
**Problem:** Broken image on website  
**Solution:** 
- Verify file path is correct
- Check bucket name
- Ensure file was uploaded successfully

### Rate Limit Error
**Problem:** "Rate limit exceeded" message  
**Solution:** Wait 1 minute and try again

---

## 📞 Need Help?

1. **Quick Reference** - Click 📖 in asset manager
2. **Examples** - Visit `/admin/assets/examples`
3. **Full Docs** - Read `docs/ASSET_MANAGER.md`
4. **Security** - Read `docs/ASSET_MANAGER_SECURITY.md`

---

## ✅ Checklist for New Users

- [ ] Login as admin
- [ ] Access asset manager
- [ ] Upload test image
- [ ] Copy URL and test
- [ ] Try using `<OptimizedImage>` component
- [ ] View examples page
- [ ] Read quick reference
- [ ] Organize assets in folders

---

## 🎉 You're Ready!

The asset manager is now your central hub for managing all website images. It's:
- ✅ Secure (admin-only)
- ✅ Fast (optimized delivery)
- ✅ Easy (drag & drop)
- ✅ Powerful (bulk operations)

Start uploading and enjoy efficient asset management! 🚀

