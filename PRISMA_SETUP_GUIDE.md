# Prisma Integration Setup Guide

## Overview

Prisma has been implemented as an alternative ORM solution for VIP Smoke, providing enhanced type safety and better schema management compared to Drizzle. This guide explains how to set up and use Prisma alongside the existing Supabase integration.

## Current Status

- ✅ Prisma schema created with complete table mappings
- ✅ PrismaStorage class implemented with all required methods
- ✅ Column name mapping using @map directive for snake_case compatibility
- ⚠️ Requires session mode connection (port 5432) instead of transaction mode (port 6543)

## Database Connection Requirements

### For Prisma to work, you need:

1. **Session Mode Connection**: Prisma requires the session mode connection string (port 5432)
2. **Transaction Mode vs Session Mode**: 
   - Transaction Mode (6543): Used for serverless deployments, short connections
   - Session Mode (5432): Used for persistent connections, required by Prisma

### Updating DATABASE_URL

If your current DATABASE_URL uses port 6543, change it to 5432:

```bash
# Current (Transaction Mode)
DATABASE_URL="postgresql://postgres.yourproject:password@db.yourproject.supabase.co:6543/postgres"

# Change to (Session Mode)  
DATABASE_URL="postgresql://postgres.yourproject:password@db.yourproject.supabase.co:5432/postgres"
```

## Prisma Schema Features

The Prisma schema includes:

- **Column Mapping**: Uses @map directive to handle snake_case database columns with camelCase TypeScript properties
- **Relationships**: Properly defined foreign key relationships between tables
- **Type Safety**: Full TypeScript integration with generated types
- **UUID Support**: Configured for Supabase UUID generation

### Example Mapping

```prisma
model Product {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name         String
  categoryId   String?  @map("category_id") @db.Uuid  // Maps to category_id in database
  brandId      String?  @map("brand_id") @db.Uuid     // Maps to brand_id in database
  imageUrl     String?  @map("image_url")             // Maps to image_url in database
  vipExclusive Boolean  @default(false) @map("vip_exclusive") // Maps to vip_exclusive in database
  createdAt    DateTime @default(now()) @map("created_at")    // Maps to created_at in database
  
  @@map("products") // Maps to products table
}
```

## Activating Prisma Storage

To switch from Supabase storage to Prisma storage:

1. **Update DATABASE_URL** to use port 5432 (session mode)
2. **Modify server/storage.ts**:

```typescript
// Replace Supabase storage with Prisma
import PrismaStorage from './prisma-storage';

let storage: IStorage;

if (process.env.DATABASE_URL) {
  console.log('🔄 Initializing Prisma storage...');
  storage = new PrismaStorage();
  (storage as PrismaStorage).connect().catch(console.error);
} else {
  console.log('⚠️  Add DATABASE_URL for Prisma database');
  storage = new MemStorage();
}
```

## Benefits of Prisma Integration

### 1. **Enhanced Type Safety**
- Generated types automatically sync with database schema
- Compile-time type checking for all database operations
- IntelliSense support for all database queries

### 2. **Better Schema Management**
- Single source of truth for database schema
- Automatic migration generation
- Column mapping for naming convention differences

### 3. **Improved Developer Experience**
- Rich query API with powerful filtering and relations
- Built-in connection pooling and optimization
- Excellent TypeScript integration

### 4. **Advanced Features**
- Relation loading with `include` and `select`
- Transaction support
- Raw query capabilities when needed
- Performance optimization through query analysis

## Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database (development)
npx prisma db push

# Create and run migrations (production)
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma db push --force-reset
```

## Testing Prisma Integration

After setting up the session mode connection:

```bash
# Test connection
npx prisma db pull

# Verify schema
npx prisma validate

# Generate types
npx prisma generate
```

## Fallback Strategy

The current implementation includes a fallback mechanism:
- If Prisma connection fails, system falls back to Supabase storage
- No disruption to existing functionality
- Gradual migration approach

## Next Steps

1. **Update DATABASE_URL** to session mode (port 5432)
2. **Test Prisma connection** with `npx prisma db pull`
3. **Switch storage implementation** in server/storage.ts
4. **Verify API functionality** with Prisma storage
5. **Monitor performance** and connection stability

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL uses port 5432 (session mode)
- Check Supabase project settings for connection pooling
- Ensure database is accessible from current environment

### Schema Issues
- Run `npx prisma db pull` to sync schema with database
- Verify column mappings in prisma/schema.prisma
- Check for naming convention conflicts

### Type Issues
- Regenerate Prisma client: `npx prisma generate`
- Restart TypeScript server in editor
- Verify import paths for generated types