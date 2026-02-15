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

      // Filter out the featured post if needed, or just show all
      // For now, let's show all except the very first one if it's already shown in Hero
      // But based on current design, we might want to just show the latest feed
      const feedPosts = (data.posts as BlogPost[]).filter(p => !p.featured).slice(0, 9);
      
      setPosts(feedPosts.length > 0 ? feedPosts : (data.posts as BlogPost[]).slice(1, 10));
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-zinc-900/50 h-[400px] rounded-sm animate-pulse border border-white/5" />
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
            <Link
            href={`/blog/${post.id}`}
            className="group h-full flex flex-col"
            >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 border border-white/10 mb-6">
                {post.image ? (
                    <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <span className="text-zinc-700 font-black text-4xl">PH</span>
                    </div>
                )}
                
                <div className="absolute top-4 left-4">
                    <span className="bg-[#ff6b35] text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                        {post.category || 'News'}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mb-3 uppercase tracking-wider">
                   <span>{new Date(post.date).toLocaleDateString()}</span>
                   <span className="text-[#ff6b35]">•</span>
                   <span>{post.readTime || '3 MIN'}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white uppercase leading-none mb-4 group-hover:text-[#ff6b35] transition-colors line-clamp-2">
                {post.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center group-hover:border-[#ff6b35]/50 transition-colors">
                   <span className="text-xs font-bold uppercase tracking-widest text-[#ff6b35] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Read Now</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#ff6b35] group-hover:rotate-45 transition-all duration-300" />
                </div>
            </div>
            </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
