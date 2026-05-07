'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Flame, Zap, Search } from 'lucide-react';
import BlogArticlesGrid from '../components/BlogArticlesGrid';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';
import GlobalMasthead from '../components/GlobalMasthead';

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
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  // Parallax setup for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  // FETCH DATA
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
           const data = await response.json();
           const posts = data.posts || [];
           setBlogPosts(posts);
           const featured = posts.find((p: BlogPost) => p.featured) || posts[0];
           setFeaturedPost(featured);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#000] text-white selection:bg-[#ff6b35] selection:text-black overflow-x-hidden font-sans pb-20">
      
      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-50 mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* HEADER / NAV AREA — dark variant of the site-wide masthead */}
      <GlobalMasthead theme="dark" />

      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col justify-center items-center px-4 pt-20 overflow-hidden">
        <div className="absolute top-0 w-full h-full left-0 overflow-hidden -z-10">
           {/* Abstract Gradient Blob */}
           <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff6b35] rounded-full blur-[150px] opacity-10 animate-pulse" />
           <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900 rounded-full blur-[150px] opacity-20" />
        </div>

        <motion.h1 
          ref={heroTextRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-center flex flex-col items-center mix-blend-normal z-10"
        >
          <span className="hero-word block bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">The High</span>
          <span className="hero-word block text-[#ff6b35] drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]">Chronicles</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hero-sub mt-12 max-w-lg text-center text-gray-400 font-medium text-lg md:text-xl leading-relaxed border-l-2 border-[#ff6b35] pl-6 ml-6"
        >
          Premium cannabis culture, industry insights, and the latest drops from the underground.
        </motion.div>

        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll to Explore</span>
          <div className="scroll-indicator w-[1px] h-16 bg-gradient-to-b from-[#ff6b35] to-transparent origin-top" />
        </motion.div>
      </section>

      {/* MARQUEE BAR */}
      <div className="relative w-full overflow-hidden bg-[#ff6b35] text-black py-4 z-20 rotate-1 scale-105 border-y-4 border-black shadow-[0_0_50px_rgba(255,107,53,0.2)]">
        <div className="flex w-fit animate-scroll-horizontal whitespace-nowrap">
            {[...Array(2)].map((_, i) => ( // Duplicate for infinite scroll
                <div key={i} className="flex gap-16 font-black text-2xl uppercase tracking-tight px-8">
                {[...Array(4)].map((_, j) => (
                    <span key={j} className="flex items-center gap-4">
                    Latest Drops <Zap className="fill-black w-6 h-6" /> Industry News <Flame className="fill-black w-6 h-6" /> Vibe Check
                    </span>
                ))}
                </div>
            ))}
        </div>
      </div>

      {/* FEATURED POST - CINEMATIC */}
      {featuredPost && (
        <section className="py-32 px-4 md:px-8 max-w-[1920px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 border-b border-white/10 pb-4">
             <h2 className="text-5xl md:text-7xl font-fira-heading uppercase text-white">
               Featured <span className="text-stroke-1 text-transparent stroke-white" style={{ WebkitTextStroke: '1px white' }}>Story</span>
             </h2>
             <span className="hidden md:block text-[#ff6b35] font-mono text-sm">[01]</span>
          </div>

          <Link href={`/blog/${featuredPost.id}`} className="group relative block w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm border border-white/10">
            <div className="featured-img-container absolute inset-0 w-full h-[120%] -top-[10%]">
                {featuredPost.image ? (
                   <Image 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        fill
                        className="object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900" />
                )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-8 md:p-16">
              <div className="max-w-4xl transform transition-transform duration-500 group-hover:-translate-y-4">
                <div className="flex items-center gap-4 mb-4">
                   <span className="bg-[#ff6b35] text-black px-3 py-1 text-xs font-bold uppercase tracking-widest">Featured</span>
                   <span className="text-white/60 text-sm font-mono">{featuredPost.readTime || '5 min'} READ</span>
                </div>
                <h3 className="text-4xl md:text-7xl font-fira-heading uppercase leading-[0.9] mb-6 group-hover:text-[#ff6b35] transition-colors duration-300">
                  {featuredPost.title}
                </h3>
                <p className="text-lg md:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed mb-8 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-sm group-hover:gap-6 transition-all">
                  Read Article <ArrowUpRight className="w-5 h-5 text-[#ff6b35]" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* MAIN CONTENT SPLIT */}
      <section className="py-20 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen">
        <div className="grid lg:grid-cols-12 gap-12">
           
           {/* SIDEBAR / FILTERS */}
           <div className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32">
                <div className="border-t border-white/20 pt-6 mb-12">
                  <h4 className="text-xs font-bold text-[#ff6b35] uppercase tracking-widest mb-8">Categories</h4>
                  <nav className="flex flex-col gap-4 text-xl font-bold uppercase text-gray-500">
                    {['Latest', 'Culture', 'Education', 'Business', 'Events'].map((cat) => (
                      <button key={cat} className="text-left hover:text-white hover:pl-4 transition-all duration-300 flex items-center group">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all text-[#ff6b35] mr-0 group-hover:mr-2">/</span>
                        {cat}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-white/20 pt-6">
                   <h4 className="text-xs font-bold text-[#ff6b35] uppercase tracking-widest mb-8">Newsletter</h4>
                   <p className="text-gray-400 text-sm mb-4">Join the inner circle.</p>
                   <div className="flex border-b border-white/30 pb-2 group focus-within:border-[#ff6b35] transition-colors">
                      <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent w-full outline-none text-white placeholder-gray-700 uppercase text-xs font-bold" />
                      <button className="text-[#ff6b35] hover:text-white transition-colors"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                </div>
              </div>
           </div>

           {/* FEED */}
           <div className="lg:col-span-9">
             <GlobalBreadcrumbs paths={[{ name: "The High Chronicles" }]} />

             <div className="flex items-baseline justify-between mb-12 border-b border-white/10 pb-4 mt-6">
                <h2 className="text-4xl md:text-6xl font-fira-heading uppercase text-white">
                  The <span className="text-[#ff6b35]">Feed</span>
                </h2>
                <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full focus-within:border-[#ff6b35] transition-colors">
                   <Search className="w-4 h-4 text-gray-400" />
                   <input className="bg-transparent outline-none text-sm text-white placeholder-gray-500 uppercase w-24 md:w-auto" placeholder="Search..." />
                </div>
             </div>
             
             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                   {[1,2,3,4].map(n => <div key={n} className="bg-white/5 h-96 w-full rounded-sm" />)}
                </div>
             ) : (
                <BlogArticlesGrid />
             )}

             <div className="mt-24 flex justify-center">
                <button className="group relative px-12 py-5 bg-transparent border border-white/20 hover:border-[#ff6b35] transition-colors uppercase font-bold tracking-widest text-sm overflow-hidden">
                   <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">Load More <ArrowUpRight className="w-4 h-4" /></span>
                   <div className="absolute inset-0 bg-[#ff6b35] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
}
