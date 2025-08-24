import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('GET /api/products', () => {
  it('route file exists', () => {
    const exists = fs.existsSync('app/api/products/route.ts');
    expect(exists).toBe(true);
  });
});

describe('GET /api/products/[id]', () => {
  it('route file exists', () => {
    const exists = fs.existsSync('app/api/products/[id]/route.ts');
    expect(exists).toBe(true);
  });
});

