# 🚀 Coolify Deployment Setup Guide
*Highway420 Production Deployment*

## ✅ Prerequisites Verified
- [x] Build issues fixed (duplicate routes removed)
- [x] Search page Suspense boundary added  
- [x] 4,540 products in database
- [x] Payment processing (KajaPay) configured
- [x] Orders system functional
- [x] Enhanced .gitignore added

## 🎯 Coolify Configuration Steps

### **1. Create Coolify Project**
1. **Go to your Coolify dashboard**
2. **Click "New Project"** 
3. **Select "GitHub Repository"**
4. **Repository**: `https://github.com/MsGuided73/Highway420.git`
5. **Branch**: `main` (or `deployment-ready` if using clean branch)
6. **Build Pack**: **Docker** (NOT Static Site)

### **2. Configure Build Settings**
```
Dockerfile Path: ./Dockerfile
Build Context: .
Port: 3000
Health Check: /
```

### **3. Environment Variables Configuration**
**Copy these 23 variables to Coolify environment settings:**

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Supabase (4 variables)
NEXT_PUBLIC_SUPABASE_URL=https://qirbapivptotybspnbet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://qirbapivptotybspnbet.supabase.co  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database
DATABASE_URL=your_database_connection_string

# Zoho Integration (6 variables)
ZOHO_DC=us
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ORGANIZATION_ID=your_zoho_org_id
ZOHO_REDIRECT_URI=https://your-domain.com/api/zoho/oauth/callback

# KajaPay Payment (3 variables)
KAJAPAY_USERNAME=your_kajapay_username
KAJAPAY_PASSWORD=your_kajapay_password
KAJAPAY_SOURCE_KEY=your_kajapay_source_key

# AI Features
OPENAI_API_KEY=your_openai_api_key

# Airtable (6 variables)
AIRTABLE_PAT=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=your_airtable_table_name
AIRTABLE_VIEW_NAME=your_airtable_view_name
AIRTABLE_BRANDS_TABLE=your_airtable_brands_table
AIRTABLE_BRANDS_VIEW=your_airtable_brands_view
```

**⚠️ Important**: Replace all `your_*` placeholders with actual values from your `.env.local` file

### **4. Domain & SSL Configuration**
1. **Add your custom domain** in Coolify
2. **Enable SSL certificate** (Let's Encrypt)
3. **Update DNS records** to point to your server
4. **Update `NEXT_PUBLIC_SITE_URL`** to match your domain

### **5. Deploy**
1. **Click "Deploy"** in Coolify
2. **Monitor build logs** for any issues
3. **Wait for deployment to complete** (usually 5-10 minutes)

## 🧪 Post-Deployment Testing

### **Core Features to Test:**
- [ ] Homepage loads with Highway 420 branding
- [ ] Product pages display correctly  
- [ ] Search functionality works
- [ ] Cart operations functional
- [ ] User authentication (sign up/sign in)
- [ ] Admin dashboard accessible
- [ ] API endpoints respond

### **Integration Tests:**
- [ ] Supabase database connection
- [ ] Payment processing (sandbox mode)
- [ ] Image loading from Supabase storage

## 🎉 Success Criteria

**Deployment successful when:**
- ✅ Build completes without errors
- ✅ Application responds on port 3000
- ✅ Homepage loads with proper styling
- ✅ Products display (even with placeholders)
- ✅ Authentication system works
- ✅ Cart functionality operational

## 📞 Next Steps After Deployment

1. **Test thoroughly** - All major features
2. **Monitor performance** - Response times, errors  
3. **Phase 2 improvements** - Categories, images, inventory
4. **Admin enhancements** - Bulk operations, analytics

## 🔥 Ready to Deploy!

Your Highway420 platform is production-ready with:
- ✅ 4,540 products ready to sell
- ✅ Complete ecommerce functionality
- ✅ Payment processing integrated
- ✅ Order management system
- ✅ User authentication working

**Deploy now and start generating revenue! 🚀**
