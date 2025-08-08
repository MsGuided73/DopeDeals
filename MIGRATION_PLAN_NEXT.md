# Dope Deals → Next.js App Router Migration (Scaffold PR)

This PR scaffolds a minimal Next.js App Router structure to enable an incremental migration while keeping the existing Express API running.

## Contents Added
- app/layout.tsx and app/page.tsx placeholders
- app/api/health/route.ts basic health endpoint
- app/api/{zoho,kajapay,shipstation}/health/route.ts that reflect disabled vs scaffolded status based on env vars
- next.config.js with basic security headers for /api/*
- Tailwind content globs updated to include app/**
- .env.example exists; follow-up PR will reconcile NEXT_PUBLIC_* and server-only vars

## Next Steps (follow-up PRs)
1. Port legacy and new design pages from client/src/pages/** into app/** file-based routes
2. Port Express endpoints from server/routes.ts into app/api/** route handlers
3. Introduce storage singleton for Next API: SupabaseStorage when env present; MemStorage in dev
4. Convert SEO utilities to Next metadata API per page
5. Add /robots.txt and /sitemap.xml handlers via app/robots.ts and app/sitemap.ts
6. Wire integration modules (Zoho, KajaPay, ShipStation, Compliance, AI) to Next API handlers and confirm health endpoints
7. Provide a full verification checklist for integration activation

