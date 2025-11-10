"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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

      // first 3 featured posts
      const featuredPosts = (data.posts as BlogPost[])
        .filter((post) => post.featured)
        .slice(0, 3);

      setPosts(featuredPosts);
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
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 animate-pulse"
          >
            <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Unable to load blog articles</div>
        <p className="text-gray-400">Please try again later</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No blog articles available</div>
        <p className="text-gray-400">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
        >
          {/* IMPORTANT: relative + overflow-hidden keep overlays inside the card */}
          <div className="blog-card relative overflow-hidden bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 hover:shadow-3xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            {/* Image */}
            <div className="aspect-video relative overflow-hidden rounded-xl mb-6">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-6xl">📝</div>
                </div>
              )}



              {/* Read Time Badge (decorative → non-interactive) */}
              <div className="pointer-events-none absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.readTime}
              </div>
            </div>

            {/* Content */}
            <div>
              <h3
                className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-700 transition-colors line-clamp-2"
                style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                {post.title}
              </h3>

              <p
                className="text-gray-600 mb-4 leading-relaxed line-clamp-3"
                style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium">{post.author}</span>
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Hover overlay (decorative → non-interactive) */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-green-500/0 to-green-500/0 group-hover:from-green-500/10 to-green-500/0 transition-all duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
