import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('Cart API - Security', () => {
  const cartRouteSource = readFileSync('app/api/cart/route.ts', 'utf-8');

  it('exports GET, POST, PUT, DELETE handlers', async () => {
    const mod = await import('../../app/api/cart/route');
    expect(typeof mod.GET).toBe('function');
    expect(typeof mod.POST).toBe('function');
    expect(typeof mod.PUT).toBe('function');
    expect(typeof mod.DELETE).toBe('function');
  });

  it('does not use string interpolation in SQL/RPC calls (SQL injection prevention)', () => {
    // The old vulnerable pattern was:
    //   supabase.rpc('exec_sql', { sql: `SET LOCAL ... = '${value.replace(...)}'` })
    // This must NOT appear anywhere in the cart route.
    const hasExecSql = cartRouteSource.includes("rpc('exec_sql'");
    const hasSetLocal = cartRouteSource.includes('SET LOCAL');
    const hasStringInterpolation = /rpc\([^)]*\$\{/.test(cartRouteSource);

    expect(hasExecSql).toBe(false);
    expect(hasSetLocal).toBe(false);
    expect(hasStringInterpolation).toBe(false);
  });

  it('uses parameterized set_app_config RPC for session RLS', () => {
    // The safe pattern uses named parameters passed to a dedicated RPC function
    const usesSetAppConfig = cartRouteSource.includes("rpc('set_app_config'");
    const usesConfigName = cartRouteSource.includes('config_name');
    const usesConfigValue = cartRouteSource.includes('config_value');

    expect(usesSetAppConfig).toBe(true);
    expect(usesConfigName).toBe(true);
    expect(usesConfigValue).toBe(true);
  });

  it('validates UUID format for cart item IDs', () => {
    // Ensure the validateUUID helper exists and is used
    expect(cartRouteSource).toContain('function validateUUID');
    expect(cartRouteSource).toContain('validateUUID(');
  });

  it('verifies cart ownership before mutations (PUT/DELETE)', () => {
    // Cart operations should check that the item belongs to the current user/session
    expect(cartRouteSource).toContain('.eq(\'cart_id\', cartId)');
    expect(cartRouteSource).toContain('isOwner');
    expect(cartRouteSource).toContain('Unauthorized access to cart item');
  });
});
