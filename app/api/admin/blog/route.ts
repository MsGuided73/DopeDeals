import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('Blog posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, author, category, image, featured, status } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    const postData = {
      title,
      slug,
      excerpt,
      content,
      author,
      category: category || 'General',
      featured: featured || false,
      status: status || 'published',
      image_url: image || null,
      meta_title: title,
      meta_description: excerpt || null
    };

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
      message: 'Blog post created successfully'
    });

  } catch (error) {
    console.error('Blog post creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
