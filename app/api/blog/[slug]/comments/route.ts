import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface CommunitySubscriber {
  full_name?: string;
  email: string;
}

interface CommentWithSubscriber {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number | null;
  reply_count: number | null;
  community_subscribers: CommunitySubscriber | CommunitySubscriber[];
}

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
      // Return empty comments for unknown slugs - no fallback to ID lookup
      return NextResponse.json({ comments: [] });
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

    // Validate content length
    const trimmedContent = content.trim();
    if (trimmedContent.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Basic profanity/spam check
    const spamKeywords = ['spam', 'scam', 'fake', 'test123', 'asdf', 'qwerty'];
    const lowerContent = trimmedContent.toLowerCase();
    const hasSpam = spamKeywords.some(keyword => lowerContent.includes(keyword));

    // Rate limiting: check recent comments from this user
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentComments, error: rateLimitError } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo);

    if (rateLimitError) {
      console.error('Error checking rate limit:', rateLimitError);
      return NextResponse.json(
        { error: 'Unable to verify comment rate limit' },
        { status: 500 }
      );
    }

    if (recentComments && recentComments.length >= 5) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can only post 5 comments per hour.' },
        { status: 429 }
      );
    }

    // Determine comment status based on validation
    let commentStatus: 'approved' | 'pending' = 'approved';
    if (hasSpam || trimmedContent.length < 20) {
      commentStatus = 'pending';
    }

    // Get the blog post ID
    let blogPostId = null;

    // First try to find by slug
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    blogPostId = blogPost.id;

    // Create the comment
    const { data: newComment, error: commentError } = await supabase
      .from('blog_comments')
      .insert({
        blog_id: blogPostId,
        user_id: userId,
        content: trimmedContent,
        status: commentStatus
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
  return (comments as CommentWithSubscriber[]).map(comment => {
    const subscriber = Array.isArray(comment.community_subscribers)
      ? comment.community_subscribers[0]
      : comment.community_subscribers;

    return {
      id: comment.id,
      content: comment.content,
      author: subscriber?.full_name || 'Community Member',
      date: comment.created_at,
      likes: comment.like_count || 0,
      replies: comment.reply_count || 0,
      isCommunityMember: true
    };
  });
}
