"use client";
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { User } from '@supabase/supabase-js';

interface PersonalizedGreetingProps {
  className?: string;
  showTime?: boolean;
  showRecommendations?: boolean;
}

export default function PersonalizedGreeting({ 
  className = "", 
  showTime = true,
  showRecommendations = false 
}: PersonalizedGreetingProps) {
  const [user, setUser] = useState<User | null>(null);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Generate time-based greeting
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    setGreeting(timeGreeting);
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <p className="text-lg font-medium text-gray-600">
          Welcome to DopeDeals! 👋
        </p>
        <p className="text-sm text-gray-500">
          Sign in for personalized recommendations
        </p>
      </div>
    );
  }

  // Get user's first name from metadata or email
  const firstName = user.user_metadata?.firstName || 
                   user.user_metadata?.first_name || 
                   user.email?.split('@')[0] || 
                   'Friend';

  const lastName = user.user_metadata?.lastName || 
                  user.user_metadata?.last_name || 
                  '';

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {showTime ? greeting : 'Hey'}, {firstName}! 
          <span className="ml-2">👋</span>
        </h1>
        
        {user.user_metadata?.preferredGreeting && (
          <span className="text-sm text-gray-500">
            ({user.user_metadata.preferredGreeting})
          </span>
        )}
      </div>
      
      <div className="mt-1 space-y-1">
        <p className="text-gray-600">
          Ready to discover something amazing?
        </p>
        
        {showRecommendations && (
          <p className="text-sm text-blue-600 font-medium">
            ✨ We've got personalized picks just for you
          </p>
        )}
        
        {/* Show returning customer message */}
        <WelcomeBackMessage userId={user.id} firstName={firstName} />
      </div>
    </div>
  );
}

// Sub-component for welcome back messages
function WelcomeBackMessage({ userId, firstName }: { userId: string, firstName: string }) {
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // This would typically come from your user analytics
        // For now, we'll use localStorage to track visits
        const lastVisitKey = `lastVisit_${userId}`;
        const orderCountKey = `orderCount_${userId}`;
        
        const storedLastVisit = localStorage.getItem(lastVisitKey);
        const storedOrderCount = parseInt(localStorage.getItem(orderCountKey) || '0');
        
        setLastVisit(storedLastVisit);
        setOrderCount(storedOrderCount);
        
        // Update last visit
        localStorage.setItem(lastVisitKey, new Date().toISOString());
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [userId]);

  if (!lastVisit) {
    return (
      <p className="text-sm text-green-600 font-medium">
        🎉 Welcome to DopeDeals, {firstName}! Thanks for joining us.
      </p>
    );
  }

  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastVisit === 0) {
    return (
      <p className="text-sm text-blue-600">
        🔥 You're on fire today! Welcome back.
      </p>
    );
  }

  if (daysSinceLastVisit === 1) {
    return (
      <p className="text-sm text-purple-600">
        ⭐ Great to see you again, {firstName}!
      </p>
    );
  }

  if (daysSinceLastVisit <= 7) {
    return (
      <p className="text-sm text-orange-600">
        🌟 Welcome back! It's been {daysSinceLastVisit} days.
      </p>
    );
  }

  return (
    <p className="text-sm text-pink-600">
      💎 Long time no see, {firstName}! We've missed you.
      {orderCount > 0 && ` Thanks for your ${orderCount} orders!`}
    </p>
  );
}
