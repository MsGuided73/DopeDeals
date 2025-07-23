# Complete Supabase Configuration Guide

## Database Configuration

### 1. Database Password Reset
- Go to **Settings** → **Database**
- Click **"Reset database password"**
- Set a simple password: `vipsmoke2025!`
- Save and note this password

### 2. Connection String (After Password Reset)
After resetting password, copy the **Transaction pooler** URL:
```
postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Authentication Configuration

### 3. Site URL
Go to **Authentication** → **Settings** → **URL Configuration**

**Site URL:**
```
http://localhost:5000
```

### 4. Redirect URLs
In the same section, add these redirect URLs:

**Redirect URLs:**
```
http://localhost:5000
http://localhost:5000/auth/callback
http://localhost:5000/login
http://localhost:5000/signup
http://localhost:5000/dashboard
http://localhost:5000/profile
http://localhost:5000/checkout
http://localhost:5000/orders
http://localhost:5000/concierge
```

## API Configuration

### 5. CORS Settings (if needed)
Go to **Settings** → **API**

**Allowed Origins (if CORS issues arise):**
```
http://localhost:5000
http://localhost:3000
http://127.0.0.1:5000
http://127.0.0.1:3000
```

## RLS (Row Level Security) Policies

### 6. Database Policies Setup
Our application will need these policies for secure data access:

**Tables requiring RLS:**
- users
- orders
- payment_methods
- user_behavior
- user_preferences
- concierge_conversations

**Public tables (no RLS needed):**
- products
- categories
- brands
- memberships

## Environment Variables for Replit

### 7. Replit Secrets to Update
After Supabase configuration:

**DATABASE_URL:**
```
postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**SUPABASE_URL:** (from Settings → API)
```
https://qirbapivptotybspnbet.supabase.co
```

**SUPABASE_ANON_KEY:** (from Settings → API)
```
[Copy the anon/public key from Supabase dashboard]
```

**SUPABASE_SERVICE_ROLE_KEY:** (from Settings → API)
```
[Copy the service_role key from Supabase dashboard - keep secure]
```

## Future Production URLs

### 8. When Deploying to Production
Update these URLs when you get your production domain:

**Site URL:**
```
https://your-domain.replit.app
```

**Redirect URLs:**
```
https://your-domain.replit.app
https://your-domain.replit.app/auth/callback
https://your-domain.replit.app/login
https://your-domain.replit.app/signup
https://your-domain.replit.app/dashboard
https://your-domain.replit.app/profile
https://your-domain.replit.app/checkout
https://your-domain.replit.app/orders
https://your-domain.replit.app/concierge
```

## Order of Operations
1. Reset database password in Supabase
2. Copy new Transaction pooler URL
3. Update DATABASE_URL in Replit Secrets
4. Configure Auth URLs in Supabase
5. Test database connection
6. Set up RLS policies (when we implement user authentication)