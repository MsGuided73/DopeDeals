import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch comments for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First get the blog post ID from slug
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (blogError || !blogPost) {
      // Try to find by ID if slug lookup fails (for hardcoded posts)
      const { data: blogPostById, error: idError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('id', slug)
        .single();

      if (idError || !blogPostById) {
        // Return empty array for hardcoded posts that don't exist in DB yet
        return NextResponse.json({ comments: [] });
      }

      // Use the found blog post
      const comments = await getCommentsForPost(blogPostById.id);
      return NextResponse.json({ comments });
    }

    const comments = await getCommentsForPost(blogPost.id);
    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Create a new comment (community members only)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { content, userId } = body;

    // Validate required fields
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    // Check if user is a community member
    const { data: communityMember, error: memberError } = await supabase
      .from('community_subscribers')
      .select('id, full_name, email')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (memberError || !communityMember) {
      return NextResponse.json(
        { error: 'Only community members can comment on articles. Please join our community first.' },
        { status: 403 }
      );
    }

    // Get the blog post ID
    let blogPostId = null;

    // First try to find by slug
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (blogPost) {
      blogPostId = blogPost.id;
    } else {
      // Try to find by ID (for hardcoded posts)
      const { data: blogPostById, error: idError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('id', slug)
        .single();

      if (blogPostById) {
        blogPostId = blogPostById.id;
      } else {
        // Create a placeholder blog post entry for hardcoded posts
        const { data: newBlogPost, error: createError } = await supabase
          .from('blog_posts')
          .insert({
            title: 'Educational Article', // Placeholder
            slug: slug,
            excerpt: 'Educational content from Highway 420',
            content: 'Content coming soon...',
            author_name: 'Highway 420 Team',
            category: 'Education',
            status: 'published'
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating placeholder blog post:', createError);
          return NextResponse.json(
            { error: 'Failed to create blog post reference' },
            { status: 500 }
          );
        }

        blogPostId = newBlogPost.id;
      }
    }

    // Create the comment
    const { data: newComment, error: commentError } = await supabase
      .from('blog_comments')
      .insert({
        blog_id: blogPostId,
        user_id: userId,
        content: content.trim(),
        status: 'approved' // Auto-approve for community members
      })
      .select('id, content, created_at, updated_at, like_count, reply_count')
      .single();

    if (commentError) {
      console.error('Error creating comment:', commentError);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedComment = {
      id: newComment.id,
      content: newComment.content,
      author: communityMember.full_name || 'Community Member',
      date: newComment.created_at,
      likes: newComment.like_count || 0,
      replies: newComment.reply_count || 0,
      isCommunityMember: true
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment,
      message: 'Comment posted successfully!'
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get comments for a blog post
async function getCommentsForPost(blogId: string) {
  const { data: comments, error } = await supabase
    .from('blog_comments')
    .select(`
      id,
      content,
      created_at,
      updated_at,
      like_count,
      reply_count,
      community_subscribers!inner (
        full_name,
        email
      )
    `)
    .eq('blog_id', blogId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  // Format comments for frontend
  return comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    author: (comment.community_subscribers as any)?.full_name || 'Community Member',
    date: comment.created_at,
    likes: comment.like_count || 0,
    replies: comment.reply_count || 0,
    isCommunityMember: true
  }));
}
