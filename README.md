# Dope Deals (VIP Smoke) / NicheNexus

[![CI](https://github.com/MsGuided73/DopeDeals/actions/workflows/ci.yml/badge.svg?branch=planning/nextjs-migration-and-integrations)](https://github.com/MsGuided73/DopeDeals/actions/workflows/ci.yml)

Unified Next.js App Router app with Supabase, shadcn/Tailwind, and TanStack Query.

## Local development

- corepack enable
- pnpm install
- pnpm dev

## Environment variables

- Client: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Server: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL (if using Prisma)

## Health checks

- /api/health returns Prisma/Supabase readiness flags

