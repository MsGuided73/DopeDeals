import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProductDescriptionProps {
  markdownText: string;
}

export default function ProductDescription({ markdownText }: ProductDescriptionProps) {
  if (!markdownText) return null;

  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownText}
      </ReactMarkdown>
    </div>
  );
}
