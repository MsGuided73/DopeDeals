import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, TrendingUp, User, Search, Grid3X3 } from 'lucide-react';

interface RecommendationEngineProps {
  userId: string;
  className?: string;
}

type RecommendationType = 'trending' | 'personalized' | 'similar' | 'category_based';

const recommendationConfig = {
  trending: {
    title: 'Trending Products',
    description: 'What\'s popular right now',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  personalized: {
    title: 'Recommended for You',
    description: 'Based on your preferences',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  similar: {
    title: 'Similar Products',
    description: 'Products like what you\'ve viewed',
    icon: Search,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  category_based: {
    title: 'From Your Favorite Categories',
    description: 'Products from categories you love',
    icon: Grid3X3,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
};

export default function RecommendationEngine({ userId, className = "" }: RecommendationEngineProps) {
  const [selectedType, setSelectedType] = useState<RecommendationType>('personalized');
  const [scrollPosition, setScrollPosition] = useState(0);

  const { data: recommendations, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/recommendations', userId, selectedType],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/${userId}?type=${selectedType}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json() as Promise<Product[]>;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Track user behavior for recommendation improvements
  const trackProductView = async (productId: string) => {
    try {
      await fetch('/api/user-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          action: 'view',
          sessionId: getSessionId(),
          metadata: {
            source: 'recommendation_engine',
            recommendationType: selectedType,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track user behavior:', error);
    }
  };

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('vip_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('vip_session_id', sessionId);
    }
    return sessionId;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recommendation-scroll');
    if (!container) return;

    const cardWidth = 280; // Approximate width of a product card
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  const config = recommendationConfig[selectedType];
  const IconComponent = config.icon;

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Failed to load recommendations</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header with recommendation type selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <IconComponent className={`h-6 w-6 ${config.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] dark:text-white">
              {config.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {config.description}
            </p>
          </div>
        </div>

        {/* Recommendation Type Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {Object.entries(recommendationConfig).map(([type, typeConfig]) => {
            const TypeIcon = typeConfig.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as RecommendationType)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedType === type
                    ? `bg-white dark:bg-gray-700 shadow-sm ${typeConfig.color}`
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <TypeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{typeConfig.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && recommendations && recommendations.length > 0 && (
        <div className="relative">
          {/* Scroll Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {recommendations.length} products found
            </p>
          </div>

          {/* Scrollable Grid */}
          <div
            id="recommendation-scroll"
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{ scrollbarWidth: 'thin' }}
          >
            {recommendations.map((product) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 w-64"
                onClick={() => trackProductView(product.id)}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!recommendations || recommendations.length === 0) && (
        <div className="text-center py-12">
          <IconComponent className={`h-16 w-16 mx-auto mb-4 ${config.color}`} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            {selectedType === 'personalized' 
              ? 'Browse some products to get personalized recommendations!'
              : 'Try a different recommendation type or browse our catalog to build your profile.'
            }
          </p>
        </div>
      )}
    </div>
  );
}