'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AgeVerification from '../components/AgeVerification';
import { MessageCircle, Sparkles, Clock, User, Search, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  featured: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch blog posts on component mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
        return; // Exit early, no hardcoded fallback needed since database is available
      }

      setLoading(false);
    };

    fetchBlogPosts();
  }, [selectedCategory]);

  // Fallback hardcoded posts (only shown until database has posts)
  const fallbackPosts: BlogPost[] = [
    {
      id: 'cannabis-history-global',
      title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
      excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
      author: 'Highway 420 Crew',
      date: '2024-01-15',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      readTime: '10 min read',
      featured: true
    },
    {
      id: 'ultimate-bong-guide',
      title: 'The Ultimate Guide to Picking the Perfect Bong',
      excerpt: 'From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).',
      author: 'Highway 420 Team',
      date: '2024-01-15',
      category: 'Product News',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
      readTime: '12 min read',
      featured: true
    },
    {
      id: '1',
      title: 'The Ultimate Guide to Choosing Your First Dab Rig',
      excerpt: 'Everything you need to know about selecting the perfect dab rig for your concentrate experience. From materials to size, we cover it all.',
      author: 'Highway 420 Team',
      date: '2024-01-15',
      category: 'Product News',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
      readTime: '8 min read',
      featured: true
    },
    {
      id: '2',
      title: 'THCA vs THC: Understanding the Difference',
      excerpt: 'Learn about the key differences between THCA and THC, their effects, and why THCA products are gaining popularity in the hemp industry.',
      author: 'Dr. Cannabis',
      date: '2024-01-12',
      category: 'Science',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      readTime: '6 min read',
      featured: true
    },
    {
      id: '3',
      title: 'New Arrivals: Premium Glass Collection',
      excerpt: 'Check out our latest collection of premium glass pieces from top artists. Limited edition designs now available.',
      author: 'Highway 420 Team',
      date: '2024-01-10',
      category: 'Product News',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
      readTime: '4 min read',
      featured: false
    },
    {
      id: '4',
      title: 'Proper Cleaning and Maintenance for Your Glass',
      excerpt: 'Keep your glass pieces in pristine condition with our comprehensive cleaning guide. Tips from the pros.',
      author: 'Glass Expert',
      date: '2024-01-08',
      category: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
      readTime: '7 min read',
      featured: false
    },
    {
      id: '5',
      title: 'The Rise of Electric Dab Rigs: E-Rigs Explained',
      excerpt: 'Discover why electric dab rigs are revolutionizing the concentrate experience. Technology meets tradition.',
      author: 'Tech Reviewer',
      date: '2024-01-05',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      readTime: '9 min read',
      featured: false
    },
    {
      id: '6',
      title: 'Cannabis Culture: A Brief History',
      excerpt: 'Explore the rich history of cannabis culture and how it has evolved over the decades to become mainstream.',
      author: 'Culture Historian',
      date: '2024-01-03',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      readTime: '12 min read',
      featured: false
    }
  ];

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiResponse(`Based on our blog articles, here's what I found about "${aiQuery}":\n\n• From "The Ultimate Guide to Picking the Perfect Bong": ${aiQuery.toLowerCase().includes('bong') ? 'We recommend starting with a basic beaker bong for beginners, or a percolator bong for smoother hits.' : 'Check our comprehensive guides for detailed information.'}\n\n• General advice: Always prioritize quality over aesthetics and consider your experience level when making purchases.\n\n• For more specific information, I recommend reading our detailed buying guides!`);
      setIsAiLoading(false);
    }, 1500);
  };

  const categories = ['All', 'Science', 'Product News', 'Maintenance', 'Technology', 'Culture'];
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      <AgeVerification />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Higher Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Stay informed with the latest news and insights from the world of premium smoking culture.
          </p>
        </div>

        {/* AI Assistant & Category Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* AI Assistant */}
          <div className="flex-1 max-w-md">
            <div className="bg-gradient-to-br from-dope-orange to-orange-600 text-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">DOPE AI Assistant</h3>
                  <p className="text-orange-100 text-sm">Ask me anything about our articles!</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g., 'best bong for beginners'"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                />
                <button
                  onClick={handleAIQuery}
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="w-full bg-white text-dope-orange font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isAiLoading ? '🤔 Thinking...' : '✨ Ask AI'}
                </button>
              </div>

              {aiResponse && (
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm text-orange-100 whitespace-pre-line">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'bg-dope-orange text-white border-dope-orange'
                      : 'border-gray-300 text-gray-700 hover:border-dope-orange hover:text-dope-orange'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl text-gray-900 mb-8" style={{ letterSpacing: '-0.02em', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-dope-orange text-white text-sm font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
                      <span>{post.readTime}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-dope-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <Link href={`/blog/${post.id}`} className="text-dope-orange hover:text-orange-600 font-medium">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl text-gray-900 mb-8" style={{ letterSpacing: '-0.02em', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-dope-orange transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                    <Link href={`/blog/${post.id}`} className="text-dope-orange hover:text-orange-600 font-medium text-sm">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest articles, product updates, and exclusive insights from the Highway 420 team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-dope-orange focus:outline-none"
            />
            <button className="px-6 py-3 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </section>

        {/* Popular Tags */}
        <section className="mt-16">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ letterSpacing: '-0.02em', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            Popular Topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Dab Rigs', 'THCA', 'Glass Care', 'Vaporizers', 'Cannabis Culture', 'Product Reviews', 'Beginner Guides', 'Industry News'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-dope-orange hover:text-white transition-colors cursor-pointer"
              >
                #{tag.replace(' ', '').toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
