# Asset Manager Security Documentation

## 🔒 Security Overview

The Highway420 Asset Manager implements multiple layers of security to ensure only authorized administrators can access and manage website assets.

---

## Security Layers

### 1. ✅ Middleware Protection (First Line of Defense)

**File:** `middleware.ts`

All `/admin/*` routes are protected at the middleware level:

```typescript
// Admin routes definition
const adminRoutes = ['/admin'];

// Check if route is admin route
const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

if (isAdminRoute) {
  // 1. Check if user is authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/(public)/auth', request.url));
  }

  // 2. Check if user has admin role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const isAdmin = user.app_metadata?.role === 'admin' || 
                 user.user_metadata?.role === 'admin' ||
                 profile?.role === 'admin';

  if (!isAdmin) {
    // Redirect non-admin users to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

**Protection Scope:**
- `/admin` - Dashboard
- `/admin/assets` - Asset Manager
- `/admin/assets/examples` - Examples Page
- All other `/admin/*` routes

**What it does:**
1. Checks if user is authenticated
2. Verifies user has admin role in:
   - `app_metadata.role`
   - `user_metadata.role`
   - Database `users.role` field
3. Redirects unauthorized users to home page
4. Redirects unauthenticated users to login

---

### 2. ✅ Layout Protection (Second Line of Defense)

**File:** `app/admin/layout.tsx`

All admin pages are wrapped in a layout that requires admin authentication:

```typescript
export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Require admin role with automatic redirect
  const user = await requireAdminWithRedirect();

  return <AdminShell user={user}>{children}</AdminShell>;
}
```

**Protection Scope:**
- All pages under `/admin/*` directory
- Includes asset manager pages
- Server-side verification

**What it does:**
1. Calls `requireAdminWithRedirect()` on server
2. Verifies admin role before rendering
3. Automatically redirects if not admin
4. Passes verified user to AdminShell

---

### 3. ✅ API Route Protection (Third Line of Defense)

**Files:**
- `app/api/admin/assets/route.ts`
- `app/api/admin/assets/upload/route.ts`
- `app/api/admin/assets/delete/route.ts`

Every API endpoint requires admin authentication:

```typescript
export async function GET(req: NextRequest) {
  // First line: Check admin authentication
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  // Rest of the endpoint logic...
}
```

**Protection Scope:**
- `GET /api/admin/assets` - List assets
- `POST /api/admin/assets/upload` - Upload files
- `POST /api/admin/assets/delete` - Delete files

**What it does:**
1. Verifies admin authentication on every request
2. Returns 401/403 if not authorized
3. Prevents direct API access without admin role
4. Works independently of frontend protection

---

### 4. ✅ Input Validation & Sanitization

#### File Upload Validation

**File:** `app/api/admin/assets/upload/route.ts`

```typescript
// 1. File size validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: 'File size exceeds 10MB limit' },
    { status: 400 }
  );
}

// 2. File type validation
if (!file.type.startsWith('image/')) {
  return NextResponse.json(
    { error: 'Only image files are allowed' },
    { status: 400 }
  );
}

// 3. Filename sanitization
const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
const fileName = `${timestamp}-${sanitizedName}`;
```

**Protections:**
- ✅ Max file size: 10MB
- ✅ Only image files allowed
- ✅ Filename sanitization (removes special characters)
- ✅ Timestamp prefix prevents overwrites
- ✅ No executable files allowed

#### Bucket Validation

```typescript
const BUCKETS = new Set(['products', 'website-images', 'ads']);

if (!bucket || !BUCKETS.has(bucket)) {
  return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
}
```

**Protections:**
- ✅ Only predefined buckets allowed
- ✅ Prevents path traversal attacks
- ✅ Whitelist approach (not blacklist)

---

### 5. ✅ Supabase Storage Security

**Storage Bucket Policies:**

Each bucket has Row Level Security (RLS) policies:

```sql
-- Public read access (for serving images)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'website-images', 'ads'));

-- Admin-only write access
CREATE POLICY "Admin write access"
ON storage.objects FOR INSERT
USING (auth.jwt() ->> 'role' = 'admin');

-- Admin-only delete access
CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');
```

**Protections:**
- ✅ Public can read (view images on website)
- ✅ Only admins can upload
- ✅ Only admins can delete
- ✅ Database-level enforcement

---

## Security Features Summary

### Authentication & Authorization
- ✅ Multi-layer authentication checks
- ✅ Role-based access control (RBAC)
- ✅ Server-side verification
- ✅ Automatic redirects for unauthorized access
- ✅ Session-based authentication via Supabase

### Input Validation
- ✅ File type validation (images only)
- ✅ File size limits (10MB max)
- ✅ Filename sanitization
- ✅ Bucket whitelist validation
- ✅ Path traversal prevention

### Data Protection
- ✅ Supabase RLS policies
- ✅ Admin-only write/delete operations
- ✅ Public read for serving images
- ✅ Secure file storage
- ✅ CDN caching with immutable headers

### API Security
- ✅ Admin authentication on all endpoints
- ✅ HTTPS enforcement (production)
- ✅ CORS protection
- ✅ Rate limiting (via Supabase)
- ✅ Error handling without information leakage

---

## Access Control Matrix

| Resource | Public | Authenticated User | Admin |
|----------|--------|-------------------|-------|
| View Images (via URL) | ✅ | ✅ | ✅ |
| Access `/admin/assets` | ❌ | ❌ | ✅ |
| List Assets (API) | ❌ | ❌ | ✅ |
| Upload Assets (API) | ❌ | ❌ | ✅ |
| Delete Assets (API) | ❌ | ❌ | ✅ |
| View Examples Page | ❌ | ❌ | ✅ |

---

## Security Testing Checklist

### Manual Testing

- [ ] **Unauthenticated Access**
  - Navigate to `/admin/assets` without login
  - Should redirect to login page
  
- [ ] **Non-Admin Access**
  - Login as regular user
  - Navigate to `/admin/assets`
  - Should redirect to home page

- [ ] **API Direct Access**
  - Try `GET /api/admin/assets` without auth
  - Should return 401 Unauthorized
  
- [ ] **File Upload Validation**
  - Try uploading file > 10MB
  - Try uploading non-image file
  - Try uploading with malicious filename
  - All should be rejected

- [ ] **Bucket Validation**
  - Try accessing invalid bucket
  - Try path traversal (`../../../etc/passwd`)
  - Should be rejected

### Automated Testing

```bash
# Test unauthenticated access
curl -I https://yourdomain.com/admin/assets
# Expected: 302 Redirect

# Test API without auth
curl -X GET https://yourdomain.com/api/admin/assets
# Expected: 401 Unauthorized

# Test invalid bucket
curl -X GET https://yourdomain.com/api/admin/assets?bucket=invalid
# Expected: 400 Bad Request
```

---

## Security Best Practices

### For Administrators

1. **Strong Passwords**
   - Use unique, complex passwords
   - Enable 2FA if available
   - Don't share admin credentials

2. **Regular Audits**
   - Review uploaded assets periodically
   - Check for suspicious files
   - Monitor storage usage

3. **Access Logs**
   - Review Supabase logs regularly
   - Monitor for unauthorized access attempts
   - Set up alerts for suspicious activity

### For Developers

1. **Never Bypass Security**
   - Don't remove `requireAdmin()` checks
   - Don't expose admin APIs publicly
   - Always validate input

2. **Keep Dependencies Updated**
   - Regularly update Supabase SDK
   - Update Next.js and React
   - Monitor security advisories

3. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate keys periodically

---

## Incident Response

### If Unauthorized Access Detected

1. **Immediate Actions**
   - Revoke compromised admin access
   - Change Supabase service role key
   - Review recent uploads/deletions
   - Check access logs

2. **Investigation**
   - Identify how access was gained
   - Review all admin accounts
   - Check for backdoors
   - Audit recent changes

3. **Remediation**
   - Fix security vulnerability
   - Remove malicious content
   - Restore from backup if needed
   - Update security documentation

4. **Prevention**
   - Implement additional monitoring
   - Add rate limiting
   - Enhance logging
   - Train team on security

---

## Compliance & Privacy

### Data Protection
- ✅ No personal data in asset manager
- ✅ Public images only (no sensitive content)
- ✅ Secure storage with encryption at rest
- ✅ HTTPS for data in transit

### Audit Trail
- ✅ Supabase logs all storage operations
- ✅ Timestamps on all uploads
- ✅ User ID tracked for all operations
- ✅ Retention policy configurable

---

## Security Contacts

For security issues or questions:
- Review this documentation
- Check Supabase security docs
- Contact system administrator
- Report vulnerabilities responsibly

---

## Conclusion

The Asset Manager implements defense-in-depth security with multiple layers:

1. **Middleware** - First line of defense
2. **Layout** - Server-side verification
3. **API Routes** - Endpoint protection
4. **Input Validation** - Data sanitization
5. **Supabase RLS** - Database-level security

This multi-layered approach ensures that even if one layer fails, others provide protection. The system is secure by default and requires explicit admin authentication for all management operations.

---

**Last Updated:** 2025-01-15  
**Version:** 1.0  
**Status:** ✅ Production Ready

