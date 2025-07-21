import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  EmojiRecommendations, 
  QuickEmojiSuggestions, 
  EmojiAnalytics 
} from '@/components/EmojiRecommendations';
import { Sparkles, MessageCircle, Star, Search } from 'lucide-react';

export default function EmojiDemo() {
  const [demoUserId] = useState('demo-user-' + Math.random().toString(36).substr(2, 9));
  const [activeContext, setActiveContext] = useState<any>({
    type: 'product_review',
    productName: 'Royal Crown Glass Pipe',
    productCategory: 'Glass Pipes',
    currentMood: 'excited'
  });
  const [reviewText, setReviewText] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const contextOptions = [
    {
      type: 'product_review',
      label: 'Product Review',
      icon: Star,
      description: 'Writing a product review',
      productName: 'Royal Crown Glass Pipe',
      productCategory: 'Glass Pipes',
      currentMood: 'excited'
    },
    {
      type: 'comment',
      label: 'Comment',
      icon: MessageCircle,
      description: 'Commenting on a product',
      productName: 'Premium Dab Rig',
      productCategory: 'Dab Rigs',
      currentMood: 'satisfied'
    },
    {
      type: 'search',
      label: 'Search',
      icon: Search,
      description: 'Searching for products',
      currentMood: 'neutral'
    },
    {
      type: 'general',
      label: 'General',
      icon: Sparkles,
      description: 'General interaction',
      currentMood: 'happy'
    }
  ];

  const handleEmojiSelect = (emoji: string, emojiCode: string) => {
    setSelectedEmojis(prev => [...prev, emoji]);
    setReviewText(prev => prev + emoji);
  };

  const handleQuickEmojiSelect = (emoji: string) => {
    setSelectedEmojis(prev => [...prev, emoji]);
    setReviewText(prev => prev + emoji);
  };

  const clearSelection = () => {
    setSelectedEmojis([]);
    setReviewText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-500" />
            AI-Powered Emoji Recommendations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience personalized emoji suggestions powered by AI. Our system learns from your preferences 
            and context to recommend the perfect emojis for any situation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Context Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Context Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contextOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeContext.type === option.type;
                
                return (
                  <Button
                    key={option.type}
                    variant={isActive ? "default" : "outline"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setActiveContext(option)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Main Demo Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Interactive Demo</span>
                <Badge variant="secondary">
                  Context: {activeContext.type}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Input Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Write your text:</label>
                <Textarea
                  placeholder={`Start typing your ${activeContext.type.replace('_', ' ')}...`}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[100px]"
                />
                
                {/* Quick suggestions as you type */}
                {reviewText.length > 3 && (
                  <QuickEmojiSuggestions
                    text={reviewText}
                    userId={demoUserId}
                    context={activeContext}
                    onEmojiSelect={handleQuickEmojiSelect}
                  />
                )}
              </div>

              {/* AI Emoji Recommendations */}
              <EmojiRecommendations
                userId={demoUserId}
                context={activeContext}
                onEmojiSelect={handleEmojiSelect}
                className="border-2 border-purple-200"
              />

              {/* Selected Emojis Display */}
              {selectedEmojis.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Selected Emojis:</label>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear All
                    </Button>
                  </div>
                  <div className="flex gap-1 flex-wrap p-3 bg-gray-50 rounded-lg">
                    {selectedEmojis.map((emoji, index) => (
                      <span key={index} className="text-2xl">{emoji}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmojiAnalytics userId={demoUserId} />
          
          {/* Feature Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🧠
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Context-Aware</h4>
                    <p className="text-sm text-blue-700">
                      Recommendations adapt based on product type, mood, and situation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Learning System</h4>
                    <p className="text-sm text-green-700">
                      Learns from your preferences and improves over time
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">Real-time Suggestions</h4>
                    <p className="text-sm text-purple-700">
                      Get instant emoji suggestions as you type
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Product-Specific</h4>
                    <p className="text-sm text-orange-700">
                      Tailored for smoking accessories and paraphernalia
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Context Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Context Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(activeContext, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}