# DATABASE_URL Special Characters Fix

## The Problem
Your password contains `@` and `!` characters which break URL parsing.

## Your Current Password
`SAB@459dcr!`

## URL-Encoded Password
`SAB%40459dcr%21`

## Action Required
1. Go to Replit Secrets (lock icon in sidebar)
2. Find your `DATABASE_URL` secret
3. Replace your current password `SAB@459dcr!` with `SAB%40459dcr%21`

## Your Fixed DATABASE_URL Should Be
```
postgresql://postgres:SAB%40459dcr%21@db.qirbapivptotybspnbet.supabase.co:6543/postgres
```

## Character Encoding Reference
- `@` becomes `%40`
- `!` becomes `%21`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`

After updating the secret, the database connection should work immediately.