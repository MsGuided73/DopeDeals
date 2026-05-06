'use client';
import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, Users, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  replies: number;
  isCommunityMember: boolean;
}

interface BlogCommentsProps {
  blogSlug: string;
  isCommunityMember?: boolean;
  userId?: string;
}

export default function BlogComments({ blogSlug, isCommunityMember = false, userId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/${blogSlug}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [blogSlug]);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    if (!isCommunityMember || !userId) {
      setError('Only community members can comment on articles.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${blogSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          userId: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new comment to the list
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Community Discussion</h3>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-dope-orange" />
          <h3 className="text-lg font-semibold text-gray-900">
            Community Discussion ({comments.length})
          </h3>
        </div>
        {!isCommunityMember && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span>Community Only</span>
          </div>
        )}
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-dope-orange pl-4 py-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  {comment.isCommunityMember && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Community Member
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-dope-orange transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </button>
                <span>{comment.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-2">No comments yet</p>
          <p className="text-sm">Be the first community member to start the discussion!</p>
        </div>
      )}

      {/* Comment Form */}
      {isCommunityMember ? (
        <form onSubmit={handleSubmitComment} className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Share your thoughts
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts on this article?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{newComment.length}/1000 characters</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center gap-2 bg-dope-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Join the Community to Comment
            </h4>
            <p className="text-gray-600 mb-4">
              Only community members can participate in discussions and share their insights on our educational content.
            </p>
            <Link
              href="/h420-vip"
              className="inline-flex items-center gap-2 bg-dope-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Users className="w-4 h-4" />
              Join Community
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
