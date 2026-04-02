import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanitizeHtml } from '../../../lib/sanitize-html';
import { FALLBACK_POSTS } from '../../../lib/blog-data';
import GlobalBreadcrumbs from '../../components/GlobalBreadcrumbs';

// Force dynamic rendering since we are checking params
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const post = FALLBACK_POSTS.find((p) => p.id === slug);

  if (!post) {
    return {
      title: 'Article Not Found | Highway 420',
    };
  }

  return {
    title: `${post.title} | Highway 420 Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = params;
  const post = FALLBACK_POSTS.find((p) => p.id === slug);

  if (!post) {
    // If not in our fallback list, it might be a DB post or actually 404
    // For now, we only handle the fallback ones to fix the immediate error
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-dope-orange text-white text-sm font-bold rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-display-twilight shadow-sm">
              {post.title}
            </h1>
            <div className="flex items-center space-x-6 text-gray-300 text-sm md:text-base">
              <span className="font-medium text-white">By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        <GlobalBreadcrumbs paths={[
          { name: "The High Chronicles", href: "/blog" },
          { name: post.title }
        ]} />

        <div 
          className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-dope-orange prose-img:rounded-xl prose-img:shadow-lg"
        >
          {/* Render content safely */}
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }} />
          
          {/* Fallback if content is empty but excerpt exists */}
          {!post.content && (
             <p className="lead text-xl text-gray-600 italic border-l-4 border-dope-orange pl-6 py-2 bg-gray-50 rounded-r-lg">
               {post.excerpt}
             </p>
          )}
        </div>

        {/* Categories / Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm">#CannabisCommunity</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm">#Highway420</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm">#{post.category}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
