/**
 * Lightweight server-safe HTML sanitizer for use in server components.
 * For client components, use isomorphic-dompurify directly.
 *
 * This strips dangerous tags/attributes while preserving safe formatting HTML.
 */

const DANGEROUS_TAGS = /(<\s*\/?\s*(script|iframe|object|embed|form|input|textarea|button|select|meta|link|base|applet)\b[^>]*>)/gi;
const EVENT_HANDLERS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;
const JAVASCRIPT_URLS = /\b(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi;
const DATA_URLS = /\b(href|src)\s*=\s*["']?\s*data\s*:\s*text\/html/gi;

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(JAVASCRIPT_URLS, '')
    .replace(DATA_URLS, '');
}
