"use client";
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../app/lib/supabase-browser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, Heart, TrendingUp, DollarSign } from 'lucide-react';

interface ProductRecommendation {
  productId: string;
  product: any;
  score: number;
  reason: string;
  category: 'similar_flavor' | 'same_brand' | 'price_match' | 'trending' | 'personalized';
}

interface ProductRecommendationsProps {
  currentProductId?: string;
  limit?: number;
  className?: string;
  title?: string;
}

export default function ProductRecommendations({
  currentProductId,
  limit = 6,
  className = "",
  title = "Recommended for You"
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Build query parameters
        const params = new URLSearchParams({
          limit: limit.toString()
        });
        
        if (currentProductId) {
          params.append('currentProduct', currentProductId);
        }

        // Fetch recommendations
        const response = await fetch(`/api/recommendations?${params}`, {
          headers: {
            'Authorization': `Bearer ${(await supabaseBrowser.auth.getSession()).data.session?.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, limit]);

  const trackInteraction = async (productId: string, action: string) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabaseBrowser.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          productId,
          action,
          metadata: { source: 'recommendations', currentProduct: currentProductId }
        })
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'similar_flavor': return <Heart className="w-4 h-4" />;
      case 'same_brand': return <Badge className="w-4 h-4" />;
      case 'price_match': return <DollarSign className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'personalized': return <Sparkles className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'similar_flavor': return 'bg-pink-100 text-pink-700';
      case 'same_brand': return 'bg-blue-100 text-blue-700';
      case 'price_match': return 'bg-green-100 text-green-700';
      case 'trending': return 'bg-orange-100 text-orange-700';
      case 'personalized': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Discover Amazing Products
          </CardTitle>
          <CardDescription>
            Sign in to get personalized recommendations based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/auth'} className="w-full">
            Sign In for Personalized Picks
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {title}
          </CardTitle>
          <CardDescription>
            Start browsing and purchasing to get personalized recommendations!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            We're learning your preferences. Check back soon for tailored suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          {title}
        </h2>
        <p className="text-gray-600 mt-1">
          Curated just for you, {user.user_metadata?.firstName || 'friend'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card 
            key={rec.productId} 
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => {
              trackInteraction(rec.productId, 'view');
              window.location.href = `/product/${rec.productId}`;
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {rec.product.name}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 flex items-center gap-1 ${getCategoryColor(rec.category)}`}
                >
                  {getCategoryIcon(rec.category)}
                  <span className="text-xs">
                    {Math.round(rec.score * 100)}%
                  </span>
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {rec.reason}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {rec.product.image_url && (
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={rec.product.image_url} 
                    alt={rec.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${rec.product.price}
                  </span>
                  {rec.product.featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {rec.product.description}
                </p>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackInteraction(rec.productId, 'add_to_cart');
                      // Add to cart logic here
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackInteraction(rec.productId, 'wishlist');
                      // Add to wishlist logic here
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
