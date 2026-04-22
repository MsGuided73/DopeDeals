import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ProductDescriptionProps {
  markdownText: string;
}

/**
 * Renders product descriptions that may contain:
 *   - Raw HTML  (detected by presence of HTML tags)
 *   - Markdown  (GFM: tables, strikethrough, task lists, autolinks)
 *   - HTML embedded inside Markdown (rehype-raw passes it through safely)
 *   - Plain text (rendered as-is via react-markdown)
 *
 * All three formats go through the same pipeline so you never need to
 * branch on content type — just store whatever the supplier provides.
 */
export default function ProductDescription({ markdownText }: ProductDescriptionProps) {
  if (!markdownText) return null;

  // Unescape literal \n / \r\n sequences that some data sources store
  const clean = markdownText
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1.25rem 0 0.5rem' }}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1.1rem 0 0.45rem' }}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '1rem 0 0.4rem' }}>{children}</h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p style={{ margin: '0 0 0.85rem', lineHeight: 1.75, color: '#374151' }}>{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul style={{ paddingLeft: '1.4rem', margin: '0 0 0.85rem', listStyleType: 'disc' }}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol style={{ paddingLeft: '1.4rem', margin: '0 0 0.85rem', listStyleType: 'decimal' }}>{children}</ol>
        ),
        li: ({ children }) => (
          <li style={{ margin: '0.25rem 0', lineHeight: 1.7, color: '#374151' }}>{children}</li>
        ),
        // Inline
        strong: ({ children }) => (
          <strong style={{ fontWeight: 700, color: '#111827' }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em style={{ fontStyle: 'italic' }}>{children}</em>
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#059669', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            {children}
          </a>
        ),
        // Code
        code: ({ children, className }) => {
          const isBlock = className?.startsWith('language-');
          return isBlock ? (
            <code
              style={{
                display: 'block',
                background: '#F3F4F6',
                borderRadius: '6px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                margin: '0 0 0.85rem',
              }}
            >
              {children}
            </code>
          ) : (
            <code
              style={{
                background: '#F3F4F6',
                borderRadius: '3px',
                padding: '1px 5px',
                fontSize: '0.875em',
                fontFamily: 'monospace',
              }}
            >
              {children}
            </code>
          );
        },
        // Horizontal rule
        hr: () => (
          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '1.25rem 0' }} />
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote
            style={{
              borderLeft: '3px solid #D1FAE5',
              paddingLeft: '1rem',
              margin: '0 0 0.85rem',
              color: '#6B7280',
              fontStyle: 'italic',
            }}
          >
            {children}
          </blockquote>
        ),
        // Tables (GFM)
        table: ({ children }) => (
          <div style={{ overflowX: 'auto', margin: '0 0 0.85rem' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th
            style={{
              background: '#F9FAFB',
              padding: '8px 12px',
              textAlign: 'left',
              fontWeight: 600,
              borderBottom: '2px solid #E5E7EB',
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>{children}</td>
        ),
      }}
    >
      {clean}
    </ReactMarkdown>
  );
}
