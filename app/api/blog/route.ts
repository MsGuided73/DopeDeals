import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // First try to get posts from database
    const { data: dbPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbPosts && dbPosts.length > 0) {
      // Transform database posts to match old format
      const transformedPosts = dbPosts.map(dbPost => ({
        id: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        author: dbPost.author,
        date: dbPost.created_at,
        category: dbPost.category,
        image: dbPost.image_url,
        readTime: '5 min read', // Default, could be calculated from content length
        featured: dbPost.featured
      }));

      return NextResponse.json({ posts: transformedPosts });
    }

    // Fallback to hardcoded posts if database is empty or unavailable
    // Featured blog articles for homepage display
    const featuredPosts = [
      {
        id: 'dabbing-101-beginners-guide',
        title: 'Dabbing 101: Your Beginner\'s Guide to Rigs, Nails & First Setups',
        excerpt: 'New to dabbing? This comprehensive guide breaks down rigs, nails, temperature control, and essential setup tips for smooth, flavorful vapor every time.',
        author: 'Highway 420 Team',
        date: '2025-10-30',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        readTime: '8 min read',
        featured: true
      },
      {
        id: 'anatomy-smooth-hit',
        title: 'The Anatomy of a Smooth Hit: How Airflow & Cooling Design Transform Your Experience',
        excerpt: 'Discover how percolators, recyclers, and airflow systems work together to eliminate harshness and deliver impeccably smooth, flavorful vapor.',
        author: 'Highway 420 Team',
        date: '2025-10-30',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=600&h=400&fit=crop',
        readTime: '10 min read',
        featured: true
      },
      {
        id: 'perfect-temperature-control',
        title: 'Finding the Perfect Hit: Temperature Control for Maximum Flavor & Smoothness',
        excerpt: 'Master temperature precision for concentrates. Learn the goldilocks zone, heat effects on vapor quality, and gear that keeps you in the flavor zone.',
        author: 'Highway 420 Team',
        date: '2025-10-30',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
        readTime: '7 min read',
        featured: true
      }
    ];

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
