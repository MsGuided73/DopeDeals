# Complete Supabase Configuration Guide
*Proper Supabase Integration with Authentication + Database*

## Problem Solved
The previous setup was using Supabase as just a PostgreSQL provider through Drizzle, bypassing Supabase's authentication and real-time features. Now we have proper Supabase integration.

## Required Environment Variables

### Frontend (Client-side)
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Backend (Server-side)
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...  # Still needed for Drizzle complex queries
```

## What Changed

### 1. Proper Supabase Client Integration
- **Frontend**: Uses `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Backend**: Uses service role key for admin operations
- **Authentication**: Now uses Supabase auth instead of localStorage

### 2. Hybrid Storage Architecture
- **Simple Operations**: Direct Supabase client calls (faster, real-time)
- **Complex Queries**: Drizzle with PostgreSQL connection (advanced filtering)
- **Authentication**: Supabase auth system with RLS

### 3. Real-time Features Enabled
- Cart updates sync across devices
- Order status changes in real-time
- User behavior tracking with live analytics

## How to Get Credentials

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: `vip-smoke-production`
3. Wait for project initialization

### Step 2: Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public**: `eyJ...` (client-side key)
   - **service_role**: `eyJ...` (server-side key)

### Step 3: Get Database URL
1. Go to **Settings** → **Database**
2. Copy **Connection string** → **URI**
3. Replace `[YOUR-PASSWORD]` with your database password

### Step 4: Configure Authentication
1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `https://your-repl-name.replit.app`
3. Add **Redirect URLs**:
   ```
   https://your-repl-name.replit.app/auth/callback
   https://your-repl-name.replit.app/dashboard
   https://your-repl-name.replit.app/profile
   http://localhost:5000 (for development)
   ```

## Database Setup
Run the SQL setup script in Supabase SQL Editor:
```sql
-- Run setup-supabase-auth.sql in Supabase dashboard
-- This creates user profiles, RLS policies, and triggers
```

## Benefits of This Approach

### ✅ Full Supabase Features
- Real-time subscriptions
- Row Level Security (RLS)
- Built-in authentication
- Automatic user management

### ✅ Hybrid Performance
- Fast simple queries via Supabase
- Complex analytics via Drizzle
- Best of both worlds

### ✅ Scalable Architecture
- Automatic scaling
- Global CDN
- Built-in security

## Testing the Integration

### 1. Check Frontend Connection
```javascript
// Should not throw error
import { supabase } from '@/lib/supabase'
console.log('Supabase URL:', supabase.supabaseUrl)
```

### 2. Test Authentication
```javascript
// Register new user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'securepassword123',
  options: {
    data: { age_verified: true, age: 25 }
  }
})
```

### 3. Test Database Operations
```javascript
// Insert data
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(5)
```

## Migration Benefits

### Before (Drizzle Only)
- ❌ No real authentication
- ❌ No real-time updates  
- ❌ Manual session management
- ❌ Complex security setup

### After (Proper Supabase)
- ✅ Built-in authentication
- ✅ Real-time cart/order updates
- ✅ Automatic user sessions
- ✅ Row Level Security
- ✅ Cross-device synchronization

## Next Steps After Setup
1. Create fresh Supabase project
2. Add all environment variables
3. Run database setup SQL
4. Test authentication flow
5. Enable real-time features

This setup gives you the full power of Supabase while maintaining the flexibility of Drizzle for complex operations.