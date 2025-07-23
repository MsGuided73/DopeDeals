# Supabase Connection Troubleshooting

## Current Issue
Database connection failing with DNS resolution error for hostname: `db.qirbapivptotybspnbet.supabase.co`

## Current DATABASE_URL
```
postgres://postgres:SAB%40459dcr%21@db.qirbapivptotybspnbet.supabase.co:6543/postgres
```

## Possible Solutions

### 1. Check Project Status
- Go to your Supabase dashboard
- Ensure your project is **active** (not paused)
- Paused projects show a "Resume" button

### 2. Get Fresh Connection String
From your Supabase dashboard:
1. Go to **Settings** → **Database**
2. Look for **Connection string** section
3. Select **Transaction pooler** (middle option)
4. Copy the EXACT string shown
5. Replace `[YOUR-PASSWORD]` with `SAB%40459dcr%21`

### 3. Alternative: Try Session Pooler
If Transaction pooler doesn't work:
1. Try the **Session pooler** option (bottom one)
2. This uses port 5432 instead of 6543

### 4. Check IPv4 vs IPv6
Some environments prefer IPv4 addresses. Look for:
- IPv4 pooler endpoints in your dashboard
- Direct IP addresses instead of hostnames

### 5. Verify Region
Ensure you're using the correct regional endpoint for your project.

## Next Steps
1. Check if project is paused in Supabase dashboard
2. Copy fresh Transaction pooler URL
3. If still failing, try Session pooler URL
4. Update DATABASE_URL environment variable with new URL