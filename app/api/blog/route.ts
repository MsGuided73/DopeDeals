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
    const fallbackPosts = [
      {
        id: 'cannabis-history-global',
        title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
        excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
        author: 'Highway 420 Crew',
        date: '2025-10-15',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        readTime: '10 min read',
        featured: true
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
        featured: true
      },
      {
        id: '1',
        title: 'The Ultimate Guide to Choosing Your First Dab Rig',
        excerpt: 'Everything you need to know about selecting the perfect dab rig for your concentrate experience. From materials to size, we cover it all.',
        author: 'Highway 420 Team',
        date: '2025-10-15',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
        readTime: '8 min read',
        featured: true
      },
      {
        id: '2',
        title: 'THCA vs THC: Understanding the Difference',
        excerpt: 'Learn about the key differences between THCA and THC, their effects, and why THCA products are gaining popularity in the hemp industry.',
        author: 'Highway 420 Team',
        date: '2025-10-12',
        category: 'Science',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        readTime: '6 min read',
        featured: true
      },
      {
        id: '3',
        title: 'New Arrivals: Premium Glass Collection',
        excerpt: 'Check out our latest collection of premium glass pieces from top artists. Limited edition designs now available.',
        author: 'Highway 420 Team',
        date: '2025-15-10',
        category: 'Product News',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
        readTime: '4 min read',
        featured: false
      },
      {
        id: '4',
        title: 'Proper Cleaning and Maintenance for Your Glass',
        excerpt: 'Keep your glass pieces in pristine condition with our comprehensive cleaning guide. Tips from the pros.',
        author: 'Highway 420 Team',
        date: '2025-10-15',
        category: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
        readTime: '7 min read',
        featured: false
      },
      {
        id: '5',
        title: 'The Rise of Electric Dab Rigs: E-Rigs Explained',
        excerpt: 'Discover why electric dab rigs are revolutionizing the concentrate experience. Technology meets tradition.',
        author: 'Highway 420 Team',
        date: '2025-10-15',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
        readTime: '9 min read',
        featured: false
      },
      {
        id: '6',
        title: 'Cannabis Culture: A Brief History',
        excerpt: 'Explore the rich history of cannabis culture and how it has evolved over the decades to become mainstream.',
        author: 'Culture Historian',
        date: '2024-01-03',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        readTime: '12 min read',
        featured: false
      }
    ];

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
