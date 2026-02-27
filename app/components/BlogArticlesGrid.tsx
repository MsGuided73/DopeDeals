"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function BlogArticlesGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      if (!data.posts) throw new Error("Invalid response format");

      // Show all posts in the grid (including featured ones)
      setPosts((data.posts as BlogPost[]).slice(0, 9));
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 animate-pulse">
            <div className="relative aspect-[4/3] w-full bg-gray-200 dark:bg-zinc-800 border-b border-gray-100 dark:border-white/5" />
            <div className="flex-1 flex flex-col p-6 md:p-8">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-8 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded mb-8" />
              <div className="h-20 w-full bg-gray-200 dark:bg-zinc-800 rounded mb-8" />
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-sm bg-white/5">
        <div className="text-gray-400 mb-2">System Malfunction</div>
        <p className="text-[#ff6b35] font-mono text-sm uppercase">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-sm bg-white/5">
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No transmissions found.</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
            <Link
            href={`/blog/${post.id}`}
            className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(255,107,53,0.15)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-white/5"
            >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-gray-100 dark:border-white/5">
                {post.image ? (
                    <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <span className="text-gray-300 dark:text-zinc-700 font-black text-4xl">PH</span>
                    </div>
                )}
                
                <div className="absolute top-4 left-4">
                    <span className="bg-[#ff6b35] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md shadow-[#ff6b35]/20">
                        {post.category || 'News'}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-5 md:p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-4 uppercase tracking-wider">
                   <span>{new Date(post.date).toLocaleDateString()}</span>
                   <span className="text-[#ff6b35]">•</span>
                   <span>{post.readTime || '3 MIN'}</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-[#ff6b35] transition-colors line-clamp-2" style={{ letterSpacing: '-0.02em' }}>
                {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8 line-clamp-3">
                {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex justify-between items-center group-hover:border-[#ff6b35]/30 transition-colors">
                   <span className="text-sm font-bold uppercase tracking-widest text-[#ff6b35] transition-all duration-300">Read Article</span>
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-[#ff6b35] transition-all duration-300 shadow-sm">
                     <ArrowUpRight className="w-4 h-4 text-[#ff6b35] group-hover:text-black group-hover:rotate-45 transition-all duration-300" />
                   </div>
                </div>
            </div>
            </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
