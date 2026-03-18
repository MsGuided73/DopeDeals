import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProductDescriptionProps {
  markdownText: string;
}

export default function ProductDescription({ markdownText }: ProductDescriptionProps) {
  if (!markdownText) return null;

  // The database sometimes stores descriptions with literal string '\n' or '\r\n'
  // instead of actual newline characters. We must unescape these so that
  // react-markdown can properly identify headings, lists, and paragraphs.
  const cleanMarkdown = markdownText
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {cleanMarkdown}
    </ReactMarkdown>
  );
}
