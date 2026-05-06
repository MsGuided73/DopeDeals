import { Metadata } from 'next';
import UltimateBongGuideClient from './UltimateBongGuideClient';
import { loadCornerstoneArticle } from './article-loader';

const HERO_IMAGE =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/Percolator%20Bong%20Comp%20for%20Higher%20Learning%20Blog.png';

export const metadata: Metadata = {
  title:
    'The Complete Guide to Bong Percolators (2026): Every Type Tested & Compared | Highway 420',
  description:
    'Every type of bong percolator explained — honeycomb, tree, matrix, fritted, and 20+ more. Plus honest buying advice, lung-capacity matching, and the cleaning truth nobody talks about.',
  keywords:
    'bong percolators, perc bong, honeycomb perc, tree perc, matrix perc, fritted disc, glycerin coil, bong buying guide, percolator types',
  alternates: {
    canonical: 'https://highway420store.com/blog/ultimate-bong-guide',
  },
  openGraph: {
    title: 'The Complete Guide to Bong Percolators (2026)',
    description:
      'Every type of percolator explained, with honest buying advice, lung-capacity matching, and the cleaning truth nobody talks about.',
    type: 'article',
    url: 'https://highway420store.com/blog/ultimate-bong-guide',
    images: [HERO_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Complete Guide to Bong Percolators (2026)',
    description:
      'Every type of percolator explained, with honest buying advice, lung-capacity matching, and the cleaning truth nobody talks about.',
    images: [HERO_IMAGE],
  },
};

export default function UltimateBongGuidePage() {
  const { css, bodyHtml, jsonLdBlocks } = loadCornerstoneArticle();
  return (
    <UltimateBongGuideClient
      css={css}
      bodyHtml={bodyHtml}
      jsonLdBlocks={jsonLdBlocks}
    />
  );
}
