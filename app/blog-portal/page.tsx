'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import { MessageCircle, Sparkles, Clock, User, Search, Filter, GraduationCap, BookOpen, Lightbulb, Users } from 'lucide-react';

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
  commentCount?: number;
}

export default function BlogPortalPage() {
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
          // Filter for educational/higher learning content
          const educationalPosts = data.posts?.filter((post: BlogPost) =>
            ['How-To', 'Technique', 'Tips', 'Science', 'Culture', 'Technology'].includes(post.category)
          ) || [];
          setBlogPosts(educationalPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

  // Higher Learning focused blog posts
  const higherLearningPosts: BlogPost[] = [
    {
      id: 'dabbing-101-beginners-guide',
      title: 'Dabbing 101: Your Beginner\'s Guide to Rigs, Nails & First Setups',
      excerpt: 'New to dabbing? This comprehensive guide breaks down rigs, nails, temperature control, and essential setup tips for smooth, flavorful vapor every time.',
      author: 'Highway 420 Team',
      date: '2025-10-30',
      category: 'How-To',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      readTime: '8 min read',
      featured: true,
      commentCount: 12
    },
    {
      id: 'anatomy-smooth-hit',
      title: 'The Anatomy of a Smooth Hit: How Airflow & Cooling Design Transform Your Experience',
      excerpt: 'Discover how percolators, recyclers, and airflow systems work together to eliminate harshness and deliver impeccably smooth, flavorful vapor.',
      author: 'Highway 420 Team',
      date: '2025-10-30',
      category: 'Technique',
      image: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=600&h=400&fit=crop',
      readTime: '10 min read',
      featured: true,
      commentCount: 8
    },
    {
      id: 'perfect-temperature-control',
      title: 'Finding the Perfect Hit: Temperature Control for Maximum Flavor & Smoothness',
      excerpt: 'Master temperature precision for concentrates. Learn the goldilocks zone, heat effects on vapor quality, and gear that keeps you in the flavor zone.',
      author: 'Highway 420 Team',
      date: '2025-10-30',
      category: 'Tips',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
      readTime: '7 min read',
      featured: true,
      commentCount: 15
    },
    {
      id: 'cannabis-history-global',
      title: 'The Wild Ride of Weed: From Ancient Rituals to Modern Revolution',
      excerpt: 'Look, cannabis has been getting people lifted for longer than most countries have been on maps. From ancient Chinese medicine to underground counterculture to today\'s multi-billion dollar industry – this plant has seen some serious history.',
      author: 'Highway 420 Crew',
      date: '2025-10-15',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      readTime: '10 min read',
      featured: false,
      commentCount: 23
    },
    {
      id: 'thca-vs-thc-science',
      title: 'THCA vs THC: The Science Behind Raw vs Decarboxylated Cannabis',
      excerpt: 'Dive deep into the molecular differences between THCA and THC. Learn how decarboxylation transforms raw cannabis into its psychoactive form and what this means for your consumption methods.',
      author: 'Dr. Cannabis',
      date: '2025-10-12',
      category: 'Science',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      readTime: '12 min read',
      featured: false,
      commentCount: 31
    },
    {
      id: 'electric-dab-rigs-explained',
      title: 'E-Rigs Revolution: How Electric Dab Rigs Are Changing the Game',
      excerpt: 'From temperature precision to portability, discover why electric dab rigs are revolutionizing concentrate consumption. Technology meets tradition in the most innovative way.',
      author: 'Tech Reviewer',
      date: '2025-10-08',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      readTime: '9 min read',
      featured: false,
      commentCount: 18
    }
  ];

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    // Simulate AI processing with educational focus
    setTimeout(() => {
      setAiResponse(`Based on our Higher Learning articles, here's what I found about "${aiQuery}":\n\n• From our educational content: ${aiQuery.toLowerCase().includes('dab') ? 'Check out our comprehensive dabbing guides covering everything from beginner setups to advanced techniques.' : 'We have in-depth articles covering cannabis science, culture, and technology.'}\n\n• Community members are discussing this topic in the comments section of relevant articles.\n\n• For deeper learning, I recommend reading our featured educational pieces!`);
      setIsAiLoading(false);
    }, 1500);
  };

  const categories = ['All', 'How-To', 'Technique', 'Tips', 'Science', 'Culture', 'Technology'];
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  // Use database posts if available, otherwise fallback to hardcoded educational posts
  const displayPosts = blogPosts.length > 0 ? blogPosts : higherLearningPosts;
  const displayFeaturedPosts = displayPosts.filter(post => post.featured);
  const displayRegularPosts = displayPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gray-50">
      <GlobalMasthead />
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-dope-orange" />
            <h1 className="text-4xl font-chalets-legweb text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              HIGHER LEARNING PORTAL
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Level up your knowledge with in-depth articles, scientific insights, and community discussions.
            <span className="text-dope-orange font-semibold"> Only community members can comment and engage.</span>
          </p>

          {/* Higher Learning Blog Link */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <h3 className="text-xl font-bold">Explore Higher Learning</h3>
            </div>
            <p className="text-blue-100 mb-4 text-center">
              Discover our comprehensive blog with the latest news, product insights, and premium smoking culture content.
            </p>
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Visit Higher Learning Blog
              </Link>
            </div>
          </div>

          {/* Community CTA */}
          <div className="bg-gradient-to-r from-dope-orange to-orange-600 text-white rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8" />
              <h3 className="text-xl font-bold">Join the Learning Community</h3>
            </div>
            <p className="text-orange-100 mb-4">
              Become part of our exclusive community to comment on articles, engage in discussions, and access premium educational content.
            </p>
            <Link
              href="/join-community"
              className="inline-flex items-center gap-2 bg-white text-dope-orange font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Join Community
            </Link>
          </div>
        </div>

        {/* AI Assistant & Category Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* AI Learning Assistant */}
          <div className="flex-1 max-w-md">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Learning AI Assistant</h3>
                  <p className="text-blue-100 text-sm">Ask about our educational content!</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g., 'explain decarboxylation'"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                />
                <button
                  onClick={handleAIQuery}
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isAiLoading ? '🤔 Researching...' : '🧠 Learn More'}
                </button>
              </div>

              {aiResponse && (
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm text-blue-100 whitespace-pre-line">{aiResponse}</p>
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

        {/* Featured Educational Articles */}
        {displayFeaturedPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-8 flex items-center gap-3" style={{ letterSpacing: '-0.02em' }}>
              <GraduationCap className="w-8 h-8 text-dope-orange" />
              Featured Learning Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displayFeaturedPosts.map((post) => (
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
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{post.category}</span>
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
                        Read & Discuss →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Educational Articles */}
        <section>
          <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-8 flex items-center gap-3" style={{ letterSpacing: '-0.02em' }}>
            <BookOpen className="w-8 h-8 text-dope-orange" />
            Latest Educational Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRegularPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.commentCount || 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{post.category}</span>
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
                      Read & Discuss →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Community Learning Hub */}
        <section className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-blue-600" />
            <h2 className="text-2xl font-chalets-legweb text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Community Learning Hub
            </h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of learners in our exclusive community. Share insights, ask questions, and deepen your understanding of cannabis science, culture, and technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join-community"
              className="bg-dope-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join the Community
            </Link>
            <Link
              href="/blog"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Browse All Articles
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
