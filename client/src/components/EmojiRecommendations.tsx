import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, TrendingUp, BarChart3 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface EmojiRecommendation {
  emoji: string;
  emojiCode: string;
  name: string;
  category: string;
  confidence: number;
  reason: string;
  sentiment?: string;
}

interface EmojiContext {
  type: 'product_review' | 'comment' | 'reaction' | 'search' | 'general';
  productId?: string;
  productName?: string;
  productCategory?: string;
  textContent?: string;
  currentMood?: 'happy' | 'excited' | 'satisfied' | 'disappointed' | 'neutral';
}

interface EmojiRecommendationsProps {
  userId: string;
  context: EmojiContext;
  onEmojiSelect?: (emoji: string, emojiCode: string) => void;
  className?: string;
}

export function EmojiRecommendations({ 
  userId, 
  context, 
  onEmojiSelect, 
  className = "" 
}: EmojiRecommendationsProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get personalized emoji recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['emoji-recommendations', userId, context],
    queryFn: () => apiRequest('/api/emoji/recommendations', {
      method: 'POST',
      body: { userId, context }
    }),
    enabled: !!userId
  });

  // Track emoji usage
  const trackUsageMutation = useMutation({
    mutationFn: (usageData: {
      emoji: string;
      emojiCode: string;
      sentiment?: string;
    }) => apiRequest('/api/emoji/track-usage', {
      method: 'POST',
      body: {
        userId,
        emoji: usageData.emoji,
        emojiCode: usageData.emojiCode,
        context,
        sentiment: usageData.sentiment
      }
    }),
    onSuccess: () => {
      // Invalidate recommendations to get fresh ones
      queryClient.invalidateQueries({ queryKey: ['emoji-recommendations'] });
    }
  });

  const handleEmojiClick = (emoji: EmojiRecommendation) => {
    setSelectedEmoji(emoji.emoji);
    
    // Track usage for learning
    trackUsageMutation.mutate({
      emoji: emoji.emoji,
      emojiCode: emoji.emojiCode,
      sentiment: emoji.sentiment
    });

    // Notify parent component
    if (onEmojiSelect) {
      onEmojiSelect(emoji.emoji, emoji.emojiCode);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smileys': return '😊';
      case 'objects': return '🔥';
      case 'nature': return '🌿';
      default: return '✨';
    }
  };

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Emoji Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const emojiRecs = recommendations?.data?.recommendations || [];

  return (
    <Card className={`${className} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Emoji Suggestions
          </div>
          {emojiRecs.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {emojiRecs.length} suggestions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {emojiRecs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <div className="text-2xl mb-2">🤔</div>
            <p className="text-sm">No suggestions available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Primary recommendations */}
            <div className="flex gap-2 flex-wrap">
              {emojiRecs.slice(0, 6).map((emoji: EmojiRecommendation) => (
                <Button
                  key={emoji.emojiCode}
                  variant={selectedEmoji === emoji.emoji ? "default" : "outline"}
                  size="sm"
                  className="h-12 w-12 p-0 text-lg hover:scale-110 transition-transform"
                  onClick={() => handleEmojiClick(emoji)}
                  title={`${emoji.name} - ${emoji.reason}`}
                >
                  {emoji.emoji}
                </Button>
              ))}
            </div>

            {/* Detailed view for top 3 */}
            <div className="space-y-2">
              {emojiRecs.slice(0, 3).map((emoji: EmojiRecommendation) => (
                <div key={emoji.emojiCode} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{emoji.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{emoji.name}</div>
                      <div className="text-xs text-gray-600">{emoji.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(emoji.confidence)}`}
                    >
                      {emoji.confidence}%
                    </Badge>
                    <span className="text-sm" title={`Category: ${emoji.category}`}>
                      {getCategoryIcon(emoji.category)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick emoji suggestions for text input
interface QuickEmojiSuggestionsProps {
  text: string;
  userId?: string;
  context?: Partial<EmojiContext>;
  onEmojiSelect?: (emoji: string) => void;
}

export function QuickEmojiSuggestions({ 
  text, 
  userId, 
  context, 
  onEmojiSelect 
}: QuickEmojiSuggestionsProps) {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['quick-emoji-suggestions', text, userId],
    queryFn: () => apiRequest('/api/emoji/quick-suggestions', {
      method: 'POST',
      body: { text, userId, context }
    }),
    enabled: !!text && text.length > 3
  });

  if (isLoading || !suggestions?.data?.suggestions?.length) {
    return null;
  }

  return (
    <div className="flex gap-1 items-center">
      <span className="text-xs text-gray-500 mr-2">Suggested:</span>
      {suggestions.data.suggestions.map((suggestion: any) => (
        <Button
          key={suggestion.emoji}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-sm hover:bg-gray-100"
          onClick={() => onEmojiSelect?.(suggestion.emoji)}
          title={suggestion.name}
        >
          {suggestion.emoji}
        </Button>
      ))}
    </div>
  );
}

// Emoji analytics dashboard
interface EmojiAnalyticsProps {
  userId: string;
}

export function EmojiAnalytics({ userId }: EmojiAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['emoji-analytics', userId],
    queryFn: () => apiRequest(`/api/emoji/analytics/${userId}`),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Emoji Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = analytics?.data;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Your Emoji Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data.totalUsage}</div>
            <div className="text-sm text-gray-600">Total Emojis Used</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{data.favoriteEmojis?.length || 0}</div>
            <div className="text-sm text-gray-600">Favorite Emojis</div>
          </div>
        </div>

        {/* Favorite emojis */}
        {data.favoriteEmojis?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Most Used Emojis
            </h4>
            <div className="flex gap-2 flex-wrap">
              {data.favoriteEmojis.slice(0, 10).map((fav: any) => (
                <div key={fav.emoji} className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
                  <span>{fav.emoji}</span>
                  <span className="text-xs text-gray-500">{fav.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personality profile */}
        <div>
          <h4 className="font-medium mb-2">Emoji Personality</h4>
          <div className="space-y-2">
            {Object.entries(data.personalityProfile).map(([trait, score]) => (
              <div key={trait} className="flex justify-between items-center">
                <span className="text-sm capitalize">{trait.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}