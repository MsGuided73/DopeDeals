// Server-only module: reads the cornerstone HTML once at build/server start
// and extracts the parts the page needs (article CSS, body HTML, JSON-LD).
// The HTML lives in this same folder so content edits don't need a code change.

import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

type CornerstoneArticle = {
  css: string;
  bodyHtml: string;
  jsonLdBlocks: string[];
};

let cached: CornerstoneArticle | null = null;

export function loadCornerstoneArticle(): CornerstoneArticle {
  if (cached) return cached;

  const filePath = path.join(
    process.cwd(),
    'app/blog/ultimate-bong-guide/ultimate-bong-buyers-guide.html'
  );
  const raw = fs.readFileSync(filePath, 'utf-8');

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
  const css = (styleMatch?.[1] ?? '').trim();

  const bodyMatch = raw.match(
    /<article[^>]*class="h420-article"[^>]*>([\s\S]*?)<\/article>/
  );
  const bodyHtml = (bodyMatch?.[1] ?? '').trim();

  const ldRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const jsonLdBlocks: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = ldRegex.exec(raw)) !== null) {
    jsonLdBlocks.push(m[1].trim());
  }

  cached = { css, bodyHtml, jsonLdBlocks };
  return cached;
}
