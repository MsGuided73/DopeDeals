import { describe, it, expect } from 'vitest';
import { isRestrictedPath, RESTRICTED_PATH_TERMS, RESTRICTED_PRODUCT_TERMS } from '../../lib/compliance-filters';
import { readFileSync } from 'fs';

describe('Centralized Compliance Filters', () => {
  describe('isRestrictedPath', () => {
    it('blocks kratom paths', () => {
      expect(isRestrictedPath('/products/kratom')).toBe(true);
      expect(isRestrictedPath('/shop/KRATOM-extract')).toBe(true);
    });

    it('blocks 7-oh and mitragynine paths', () => {
      expect(isRestrictedPath('/7-oh-capsules')).toBe(true);
      expect(isRestrictedPath('/7-hydroxy-pills')).toBe(true);
      expect(isRestrictedPath('/mitragynine')).toBe(true);
    });

    it('allows normal paths', () => {
      expect(isRestrictedPath('/products')).toBe(false);
      expect(isRestrictedPath('/thca-flower')).toBe(false);
      expect(isRestrictedPath('/checkout')).toBe(false);
    });
  });

  describe('RESTRICTED_PRODUCT_TERMS includes all substance and product type terms', () => {
    it('includes all kratom-related terms', () => {
      expect(RESTRICTED_PRODUCT_TERMS).toContain('kratom');
      expect(RESTRICTED_PRODUCT_TERMS).toContain('7-oh');
      expect(RESTRICTED_PRODUCT_TERMS).toContain('7-hydroxy');
      expect(RESTRICTED_PRODUCT_TERMS).toContain('mitragynine');
    });

    it('includes restricted product types', () => {
      expect(RESTRICTED_PRODUCT_TERMS).toContain('tincture');
      expect(RESTRICTED_PRODUCT_TERMS).toContain('salve');
    });
  });

  describe('Middleware uses centralized filter', () => {
    const source = readFileSync('middleware.ts', 'utf-8');

    it('imports isRestrictedPath from compliance-filters', () => {
      expect(source).toContain("import { isRestrictedPath } from './lib/compliance-filters'");
    });

    it('does not define inline kratom terms', () => {
      expect(source).not.toContain("const kratomTerms");
    });
  });

  describe('API routes use centralized filter (no inline kratom filters)', () => {
    const apiFiles = [
      'app/api/products/route.ts',
      'app/api/search/route.ts',
      'app/api/featured/products/route.ts',
      'app/api/featured/staff-picks/route.ts',
      'app/api/featured/new-arrivals/route.ts',
    ];

    for (const file of apiFiles) {
      it(`${file} imports applyRestrictedProductFilter`, () => {
        const source = readFileSync(file, 'utf-8');
        expect(source).toContain('applyRestrictedProductFilter');
      });
    }
  });

  describe('storage.ts uses centralized filter', () => {
    const source = readFileSync('lib/storage.ts', 'utf-8');

    it('imports applyRestrictedProductFilter', () => {
      expect(source).toContain("import { applyRestrictedProductFilter } from './compliance-filters'");
    });

    it('does not have inline kratom .not() filters', () => {
      // Should not contain the old inline pattern
      expect(source).not.toMatch(/\.not\('name', 'ilike', '%kratom%'\)/);
    });
  });
});
