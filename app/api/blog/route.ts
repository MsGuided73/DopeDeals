import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FALLBACK_POSTS } from '../../../lib/blog-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Get all blog posts
    const { data: dbPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    let allPosts = dbPosts || [];

    // If no database posts, use fallback posts
    if (!dbPosts || dbPosts.length === 0) {
      // Use shared fallback data + extended list for search if needed
      allPosts = [
        ...FALLBACK_POSTS,
        {
          id: 'cannabis-history-global',
          title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
          excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
          content: 'Cannabis history spans from ancient rituals to modern industry.',
          author: 'Highway 420 Crew',
          date: '2025-10-15',
          category: 'Culture',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
          readTime: '10 min read',
          featured: false
        },
        {
          id: 'ultimate-bong-guide',
          title: 'The Ultimate Guide to Picking the Perfect Bong',
          excerpt: 'From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).',
          content: 'Choose the perfect bong from desktop models to pocket rockets. Learn about water filtration and glass art.',
          author: 'Highway 420 Team',
          date: '2025-10-15',
          category: 'Education',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
          readTime: '12 min read',
          featured: false
        }
      ];
    }

    // Simple search implementation
    const queryLower = query.toLowerCase();
    const relevantPosts = allPosts.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(queryLower);
      const excerptMatch = post.excerpt?.toLowerCase().includes(queryLower);
      const contentMatch = post.content?.toLowerCase().includes(queryLower);
      const categoryMatch = post.category?.toLowerCase().includes(queryLower);

      return titleMatch || excerptMatch || contentMatch || categoryMatch;
    });

    // Generate AI response based on relevant posts
    let response = `Based on our blog articles, here's what I found about "${query}":\n\n`;

    if (relevantPosts.length === 0) {
      response += `I couldn't find specific information about "${query}" in our current articles. However, I recommend checking our comprehensive guides on dabbing, bongs, and cannabis culture.\n\n`;
      response += `Try searching for related topics like "dabbing guide", "bong selection", or "cannabis history".`;
    } else {
      relevantPosts.slice(0, 3).forEach(post => {
        response += `• **${post.title}**: ${post.excerpt}\n\n`;
      });

      if (relevantPosts.length > 3) {
        response += `• And ${relevantPosts.length - 3} more relevant articles...\n\n`;
      }

      response += `For more detailed information, I recommend reading these articles in full!`;
    }

    return NextResponse.json({
      response,
      relevantPosts: relevantPosts.slice(0, 5).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category
      }))
    });

  } catch (error) {
    console.error('Blog search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // First try to get posts from database
    const { data: dbPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbPosts && dbPosts.length > 0) {
      // Helper to parse image URLs that might be comma-separated strings
      const parseImageUrls = (value?: string[] | string | null) => {
        if (!value) return [] as string[];
        if (Array.isArray(value)) {
          return value
            .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
            .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
            .filter(Boolean);
        }
        if (typeof value !== 'string') return [value].filter(Boolean);
        return value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);
      };

      // Transform database posts to match old format
      const transformedPosts = dbPosts.map(dbPost => {
        const normalizedImages = parseImageUrls(dbPost.image_url);
        return {
          id: dbPost.slug,
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          author: dbPost.author,
          date: dbPost.created_at,
          category: dbPost.category,
          image: normalizedImages[0] || dbPost.image_url,
          readTime: '5 min read', // Default, could be calculated from content length
          featured: dbPost.featured
        };
      });

      return NextResponse.json({ posts: transformedPosts });
    }

    // Fallback to hardcoded posts if database is empty or unavailable
    // Fallback to hardcoded posts if database is empty or unavailable
    // Featured blog articles for homepage display
    const featuredPosts = FALLBACK_POSTS;

    // Additional blog posts
    const additionalPosts = [
      {
        id: 'cannabis-history-global',
        title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
        excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
        author: 'Highway 420 Crew',
        date: '2025-10-15',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        readTime: '10 min read',
        featured: false
      },
      {
        id: 'ultimate-bong-guide',
        title: 'The Ultimate Guide to Picking the Perfect Bong',
        excerpt: 'From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).',
        author: 'Highway 420 Team',
        date: '2025-10-15',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
        readTime: '12 min read',
        featured: false
      }
    ];

    const fallbackPosts = [...featuredPosts, ...additionalPosts];

    return NextResponse.json({ posts: fallbackPosts });

  } catch (error) {
    console.error('Blog API error:', error);

    // Final fallback to static content if everything fails
    const staticPosts = [
      {
        id: 'fallback-post',
        title: 'Welcome to the Highway 420 Blog',
        excerpt: 'Stay tuned for amazing content about premium smoking culture, product guides, and the latest industry news.',
        author: 'Highway 420 Team',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        readTime: '2 min read',
        featured: false
      }
    ];

    return NextResponse.json({ posts: staticPosts });
  }
}
