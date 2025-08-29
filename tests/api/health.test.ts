import { describe, it, expect } from 'vitest';

// Simple smoke test that hits the handler function if exported, or validates file presence
import fs from 'fs';

describe('GET /api/health', () => {
  it('route file exists', () => {
    const exists = fs.existsSync('app/api/health/route.ts');
    expect(exists).toBe(true);
  });
});

