# 🚀 DopeDeals Coolify Deployment Checklist

## ✅ Pre-Deployment Preparation (COMPLETED)

- [x] **Build Issues Fixed**: React-dnd dependencies added, import paths corrected
- [x] **Docker Configuration**: Dockerfile and .dockerignore created
- [x] **Next.js Config**: Standalone output enabled for Docker
- [x] **Environment Variables**: All 20+ variables documented
- [x] **Build Test**: Application compiles successfully with warnings only

## 🎯 Ready for Coolify Deployment

### Step 1: Create Coolify Project
1. Go to your Coolify dashboard
2. Click "New Project"
3. Select "GitHub Repository"
4. Repository: `https://github.com/MsGuided73/DopeDeals.git`
5. Branch: `main`
6. **Build Pack: Docker** (NOT Static Site)

### Step 2: Configure Build Settings
```
Dockerfile Path: ./Dockerfile
Build Context: .
Port: 3000
Health Check: /
```

### Step 3: Add Environment Variables
Copy all variables from `.env.local` to Coolify environment settings:

**Critical Variables:**
- `NEXT_PUBLIC_SITE_URL` (update to your domain)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- All Zoho, Airtable, KajaPay, OpenAI credentials

### Step 4: Domain & SSL
1. Add your custom domain in Coolify
2. Enable SSL certificate (Let's Encrypt)
3. Update `NEXT_PUBLIC_SITE_URL` to match your domain

### Step 5: Deploy & Test
1. Click "Deploy"
2. Monitor build logs
3. Test core functionality once deployed

## 🧪 Post-Deployment Testing

### Core Features to Test:
- [ ] Homepage loads
- [ ] Product pages work
- [ ] Search functionality
- [ ] Cart operations
- [ ] User authentication
- [ ] Admin dashboard access
- [ ] API endpoints respond

### Integration Tests:
- [ ] Supabase database connection
- [ ] Zoho inventory sync
- [ ] Payment processing (sandbox)
- [ ] Image loading from Supabase storage

## 🚨 Common Issues & Solutions

**Build Failures:**
- Check all environment variables are set
- Verify Dockerfile syntax
- Monitor build logs in Coolify

**Runtime Errors:**
- Check server logs in Coolify dashboard
- Verify database connectivity
- Test API endpoints individually

**Performance Issues:**
- Enable CDN if available
- Check image optimization
- Monitor response times

## 📋 Environment Variables Quick Reference

**Total: 23 variables**
- Site: 1 variable
- Supabase: 4 variables  
- Zoho: 10 variables
- Airtable: 6 variables
- KajaPay: 6 variables
- OpenAI: 1 variable

All variables are documented in `COOLIFY_DEPLOYMENT_GUIDE.md`

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ Application starts and responds on port 3000
- ✅ Homepage loads with proper styling
- ✅ Database queries work (products display)
- ✅ Authentication system functions
- ✅ Admin dashboard is accessible

## 🔄 Next Steps After Deployment

1. **Test thoroughly** - All major features
2. **Monitor performance** - Response times, errors
3. **Set up monitoring** - Alerts for downtime
4. **Plan admin migration** - Port legacy admin UI
5. **Enhance features** - Image management, content editor

Ready to deploy! 🚀
