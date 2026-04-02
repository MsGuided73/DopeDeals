import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

// Client components use DOMPurify, server components use sanitizeHtml
const clientFiles = [
  { path: 'components/FlowerProductPage.tsx', label: 'Flower product page' },
  { path: 'components/SimpleProductPage.tsx', label: 'Simple product page' },
  { path: 'components/ConsumableProductDetails.tsx', label: 'Consumable product details' },
];

const serverFiles = [
  { path: 'app/blog/[slug]/page.tsx', label: 'Blog post page' },
];

describe('XSS Prevention - dangerouslySetInnerHTML sanitization', () => {
  // Client components should use DOMPurify
  for (const file of clientFiles) {
    describe(file.label, () => {
      const source = readFileSync(file.path, 'utf-8');

      it('imports DOMPurify', () => {
        expect(source).toContain("import DOMPurify from 'isomorphic-dompurify'");
      });

      it('sanitizes all dangerouslySetInnerHTML with DOMPurify', () => {
        const dangerousMatches = source.match(/dangerouslySetInnerHTML=\{\{[^}]+\}\}/g) || [];
        expect(dangerousMatches.length).toBeGreaterThan(0);

        for (const match of dangerousMatches) {
          if (match.includes('JSON.stringify')) continue;
          if (match.includes('__html: `')) continue;

          if (!match.includes('DOMPurify.sanitize')) {
            const varMatch = match.match(/__html:\s*(\w+)/);
            if (varMatch) {
              const varName = varMatch[1];
              const varDeclIndex = source.indexOf(varName);
              const sanitizeIndex = source.indexOf('DOMPurify.sanitize');
              expect(varDeclIndex).toBeGreaterThan(-1);
              expect(sanitizeIndex).toBeGreaterThan(-1);
            } else {
              expect(match).toContain('DOMPurify.sanitize');
            }
          }
        }
      });
    });
  }

  // Server components should use sanitizeHtml (no jsdom dependency)
  for (const file of serverFiles) {
    describe(file.label, () => {
      const source = readFileSync(file.path, 'utf-8');

      it('imports sanitizeHtml', () => {
        expect(source).toContain("import { sanitizeHtml }");
      });

      it('sanitizes all dangerouslySetInnerHTML with sanitizeHtml', () => {
        const dangerousMatches = source.match(/dangerouslySetInnerHTML=\{\{[^}]+\}\}/g) || [];
        expect(dangerousMatches.length).toBeGreaterThan(0);

        for (const match of dangerousMatches) {
          if (match.includes('JSON.stringify')) continue;
          expect(match).toContain('sanitizeHtml');
        }
      });
    });
  }

  // Runtime tests for DOMPurify (client-side sanitizer)
  it('DOMPurify strips script tags from malicious input', () => {
    const DOMPurify = require('isomorphic-dompurify').default;
    const malicious = '<p>Hello</p><script>alert("xss")</script><img onerror="steal()" src="x">';
    const clean = DOMPurify.sanitize(malicious);

    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onerror');
    expect(clean).toContain('<p>Hello</p>');
  });

  it('DOMPurify preserves safe HTML formatting', () => {
    const DOMPurify = require('isomorphic-dompurify').default;
    const safe = '<p>Product <strong>description</strong> with <em>formatting</em> and <br/> line breaks.</p>';
    const result = DOMPurify.sanitize(safe);

    expect(result).toContain('<strong>description</strong>');
    expect(result).toContain('<em>formatting</em>');
    expect(result).toContain('<p>');
  });

  // Runtime tests for sanitizeHtml (server-side sanitizer)
  it('sanitizeHtml strips dangerous tags', async () => {
    const { sanitizeHtml } = await import('../../lib/sanitize-html');
    const malicious = '<p>Hello</p><script>alert("xss")</script><iframe src="evil"></iframe>';
    const clean = sanitizeHtml(malicious);

    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('<iframe');
    expect(clean).toContain('<p>Hello</p>');
  });

  it('sanitizeHtml strips event handlers', async () => {
    const { sanitizeHtml } = await import('../../lib/sanitize-html');
    const malicious = '<img onerror="steal()" src="x"><div onmouseover="hack()">test</div>';
    const clean = sanitizeHtml(malicious);

    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('onmouseover');
  });

  it('sanitizeHtml strips javascript: URLs', async () => {
    const { sanitizeHtml } = await import('../../lib/sanitize-html');
    const malicious = '<a href="javascript:alert(1)">click</a>';
    const clean = sanitizeHtml(malicious);

    expect(clean).not.toContain('javascript:');
  });

  it('sanitizeHtml preserves safe HTML', async () => {
    const { sanitizeHtml } = await import('../../lib/sanitize-html');
    const safe = '<p>Product <strong>description</strong> with <em>formatting</em> and <br/> line breaks.</p>';
    const result = sanitizeHtml(safe);

    expect(result).toContain('<strong>description</strong>');
    expect(result).toContain('<em>formatting</em>');
    expect(result).toContain('<p>');
  });
});
