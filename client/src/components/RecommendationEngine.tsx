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
    title: 'Trending',
    description: 'What\'s popular right now',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  personalized: {
    title: 'For You',
    description: 'Based on your preferences',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  similar: {
    title: 'Similar',
    description: 'Products like what you\'ve viewed',
    icon: Search,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  category_based: {
    title: 'Categories',
    description: 'From categories you love',
    icon: Grid3X3,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
};

export default function RecommendationEngine({ userId, className = "" }: RecommendationEngineProps) {
  const [selectedType, setSelectedType] = useState<RecommendationType>('personalized');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Show 4 products per page

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

  // Calculate pagination
  const totalPages = Math.ceil((recommendations?.length || 0) / itemsPerPage);
  const currentProducts = recommendations?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) || [];

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleTypeChange = (type: RecommendationType) => {
    setSelectedType(type);
    setCurrentPage(0); // Reset to first page when changing type
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
    <div className={`recommendation-engine bg-steel-900/50 backdrop-blur-sm ${className}`}>
      {/* Main Content Area with fixed height */}
      <div className="h-80 flex flex-col">
        {/* Products Grid - Fixed height matching product card height */}
        <div className="flex-1 px-6 py-4">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-56 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && recommendations && recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userId={userId}
                  onView={() => trackProductView(product.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && (!recommendations || recommendations.length === 0) && (
            <div className="text-center py-8 h-full flex items-center justify-center">
              <div>
                <IconComponent className={`h-12 w-12 ${config.color} mx-auto mb-4`} />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No recommendations available
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Browse our products to get personalized recommendations
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="border-t border-steel-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Recommendation Type Tabs */}
            <div className="flex gap-2">
              {Object.entries(recommendationConfig).map(([type, typeConfig]) => {
                const TypeIcon = typeConfig.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type as RecommendationType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedType === type
                        ? `bg-steel-700 text-yellow-400 shadow-md`
                        : 'text-steel-300 hover:text-yellow-400 hover:bg-steel-800'
                    }`}
                  >
                    <TypeIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{typeConfig.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-steel-800 text-steel-300 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm text-steel-400 px-3">
                {currentPage + 1} / {totalPages || 1}
              </span>
              
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg bg-steel-800 text-steel-300 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}