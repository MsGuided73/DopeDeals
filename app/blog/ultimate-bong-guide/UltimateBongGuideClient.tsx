'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import GlobalMasthead from '../../components/GlobalMasthead';
import BlogComments from '../../components/comments/BlogComments';

type Props = {
  css: string;
  bodyHtml: string;
  jsonLdBlocks: string[];
};

export default function UltimateBongGuideClient({
  css,
  bodyHtml,
  jsonLdBlocks,
}: Props) {
  const [isCommunityMember, setIsCommunityMember] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const checkCommunityMembership = async () => {
      try {
        const res = await fetch('/api/community/membership');
        if (res.ok) {
          const data = await res.json();
          setIsCommunityMember(data.isMember || false);
          setUserId(data.userId || undefined);
        } else {
          setIsCommunityMember(false);
          setUserId(undefined);
        }
      } catch (err) {
        console.error('Error checking membership:', err);
        setIsCommunityMember(false);
        setUserId(undefined);
      }
    };
    checkCommunityMembership();
  }, []);

  return (
    <>
      <GlobalMasthead />

      {jsonLdBlocks.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ld }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ background: '#FAF7F2' }}>
        <div className="max-w-[820px] mx-auto px-5 pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#1B4332] hover:text-[#D4A03E] font-bold tracking-widest uppercase text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        <article
          className="h420-article"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div className="max-w-[780px] mx-auto px-5 pb-12">
          <BlogComments
            blogSlug="ultimate-bong-guide"
            isCommunityMember={isCommunityMember}
            userId={userId}
          />
        </div>
      </div>
    </>
  );
}
