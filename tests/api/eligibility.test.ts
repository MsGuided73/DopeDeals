import { describe, it, expect } from 'vitest';

// Placeholder tests to ensure routes are registered
// In CI we only smoke-test that handlers can be imported without throwing

describe('Eligibility APIs', () => {
  it('exports GET for /api/eligibility', async () => {
    const mod = await import('../../app/api/eligibility/route');
    expect(typeof mod.GET).toBe('function');
  });

  it('exports GET for /api/eligible-products', async () => {
    const mod = await import('../../app/api/eligible-products/route');
    expect(typeof mod.GET).toBe('function');
  });
});

