import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('POST /api/checkout', () => {
  it('route file exists', () => {
    const exists = fs.existsSync('app/api/checkout/route.ts');
    expect(exists).toBe(true);
  });
});

