# Complete Supabase Migration Guide
*From Neon Database + Replit Auth → Full Supabase Integration*

## Overview
Migrating VIP Smoke to use Supabase for both database storage and user authentication, replacing the current Neon + Replit Auth setup.

## Phase 1: Fresh Supabase Project Setup

### 1. Create New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose organization and set:
   - **Project Name**: `vip-smoke-production`
   - **Database Password**: `vipsmoke2025` (simple, no special chars)
   - **Region**: `US West (Oregon)` or closest to your users
4. Wait for project creation (2-3 minutes)

### 2. Get Connection Details
Once project is ready:
1. Go to **Settings** → **Database**
2. Copy **Connection String** → **URI** format
3. Replace `[YOUR-PASSWORD]` with `vipsmoke2025`
4. Save this as your new DATABASE_URL

### 3. Configure Authentication
1. Go to **Authentication** → **Settings** → **URL Configuration**
2. Set **Site URL**: `https://your-repl-name.replit.app` (for production)
3. Add **Redirect URLs**:
   ```
   https://your-repl-name.replit.app
   https://your-repl-name.replit.app/auth/callback
   https://your-repl-name.replit.app/dashboard
   https://your-repl-name.replit.app/profile
   https://your-repl-name.replit.app/checkout
   https://your-repl-name.replit.app/orders
   http://localhost:5000 (for development)
   http://localhost:5000/auth/callback
   ```

## Phase 2: Database Migration

### 1. Update Database Configuration
- Replace DATABASE_URL with new Supabase connection string
- Test connection with new credentials
- Run database setup to create all tables

### 2. Enable Row Level Security (RLS)
Supabase requires RLS for security:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (temporarily for development)
CREATE POLICY "Allow all access" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access" ON products FOR ALL USING (true);
CREATE POLICY "Allow all access" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all access" ON brands FOR ALL USING (true);
CREATE POLICY "Allow all access" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all access" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all access" ON cart_items FOR ALL USING (true);
CREATE POLICY "Allow all access" ON memberships FOR ALL USING (true);
CREATE POLICY "Allow all access" ON loyalty_points FOR ALL USING (true);
```

## Phase 3: Authentication Integration

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase Client
Create `client/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-public-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Replace Age Verification with Supabase Auth
- Convert age verification to user registration
- Add age verification during signup process
- Integrate with VIP membership system

## Phase 4: User System Integration

### 1. User Registration Flow
1. Age verification (21+)
2. Account creation with Supabase Auth
3. Profile setup with VIP preferences
4. Shopping cart migration from session to user account

### 2. Authentication Features
- Email/password signup and login
- Password recovery
- Email verification
- Session management
- Protected routes for VIP content

### 3. User Profile System
- Personal information
- VIP membership status
- Order history
- Saved payment methods
- Shipping addresses
- Loyalty points tracking

## Phase 5: Enhanced Features

### 1. Persistent Shopping Cart
- Cart items tied to user account
- Cross-device synchronization
- Saved for later functionality

### 2. Personalized Recommendations
- User behavior tracking with authentication
- Purchase history analysis
- VIP-specific product recommendations

### 3. Order Management
- Order history per user
- Order status tracking
- Reorder functionality

## Implementation Benefits

### 1. Unified Platform
- Single provider for database + auth
- Consistent API patterns
- Better integration between services

### 2. Enhanced Security
- Row Level Security (RLS)
- Built-in user management
- Secure authentication flows

### 3. Scalability
- Auto-scaling database
- Global CDN for auth
- Real-time subscriptions support

### 4. Advanced Features
- Real-time product updates
- Live order tracking
- Instant cart synchronization

## Migration Checklist

- [ ] Create fresh Supabase project
- [ ] Configure authentication settings
- [ ] Update DATABASE_URL
- [ ] Test database connection
- [ ] Enable RLS and create policies
- [ ] Install Supabase client library
- [ ] Implement authentication components
- [ ] Migrate user system from age verification
- [ ] Update all API endpoints for authenticated users
- [ ] Test complete user flow
- [ ] Deploy with new configuration

## Next Steps
1. Create new Supabase project
2. Share connection details for immediate testing
3. Begin authentication system implementation